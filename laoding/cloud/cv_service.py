# -*- coding: utf-8 -*-
"""
云端 CV 服务 —— 跑在按需 GPU 实例上（保安.md §3.3 / 总体设计 §6.4、附录 B）

只做两件事，均为「真 AI」展示点：
  1. CLIP 编码 / 零样本分类（以图搜物的相似度路；零训练、零标注）
  2. PaddleOCR 关键字段识别（证件的精确路；只认姓名 / 学号，不整版识别）

运维口径（总体设计附录 B）：
  · 冷启动约 2 分半（开机 90s + 模型加载 30s），热机单张约 100ms——慢的是开机不是算力
  · 答辩前 10 分钟调 GET /warm 预热；云平台设无操作自动关机；提前录 30s 演示视频兜底
  · 检索不算余弦——向量在入库时算好，余弦由前端纯 CPU 完成，GPU 只编码新图片

依赖（GPU 实例上安装，本地沙箱不需要也不安装）：
  pip install fastapi uvicorn torch torchvision transformers pillow paddleocr paddlepaddle

部署：  CV_TOKEN=xxx uvicorn cv_service:app --host 0.0.0.0 --port 9000
代理：  cloud/proxy.js 注入 Authorization: Bearer $CV_TOKEN 后转发到这里
"""
import base64
import io
import os
import re

from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel

CV_TOKEN = os.environ.get("CV_TOKEN", "")
CLIP_MODEL = "openai/clip-vit-base-patch32"   # 512 维
OCR_MIN_CONF = 0.6                             # 置信度门槛：低置信度字段不参与判定

app = FastAPI(title="guard-cv", version="1.0")
_state = {"clip": None, "proc": None, "ocr": None}


class ImgBody(BaseModel):
    image: str                 # dataURL 或裸 base64
    labels: list = None        # classify 用：零样本候选标签


def _check(auth: str) -> None:
    if CV_TOKEN and auth != f"Bearer {CV_TOKEN}":
        raise HTTPException(401, "bad token")


def _to_pil(image: str):
    from PIL import Image

    b64 = image.split(",", 1)[1] if image.startswith("data:") else image
    return Image.open(io.BytesIO(base64.b64decode(b64))).convert("RGB")


def _load_clip():
    """懒加载：首拍才进显存，之后常驻热机。"""
    import torch
    from transformers import CLIPModel, CLIPProcessor

    if _state["clip"] is None:
        _state["clip"] = (
            CLIPModel.from_pretrained(CLIP_MODEL).eval(),
            CLIPProcessor.from_pretrained(CLIP_MODEL),
        )
        if torch.cuda.is_available():
            _state["clip"][0].to("cuda")
    return _state["clip"]


def _load_ocr():
    from paddleocr import PaddleOCR

    if _state["ocr"] is None:
        # 版式约束：校园卡是学校统一版式，chPP-OCRv3 够用
        _state["ocr"] = PaddleOCR(use_angle_cls=True, lang="ch", show_log=False)
    return _state["ocr"]


@app.get("/health")
def health():
    return {"ok": True, "clip_loaded": _state["clip"] is not None, "ocr_loaded": _state["ocr"] is not None}


@app.get("/warm")
def warm():
    """答辩前 10 分钟预热：把两个模型都拉起来。"""
    _load_clip()
    _load_ocr()
    return {"ok": True, "msg": "warmed"}


@app.post("/encode")
def encode(body: ImgBody, authorization: str = Header(default="")):
    """图片 → CLIP 向量（L2 归一化）。入库时算一次存库，检索余弦在前端算。"""
    _check(authorization)
    import numpy as np
    import torch

    model, proc = _load_clip()
    inputs = proc(images=[_to_pil(body.image)], return_tensors="pt")
    if next(model.parameters()).is_cuda:
        inputs = {k: v.to("cuda") for k, v in inputs.items()}
    with torch.no_grad():
        feats = model.get_image_features(**inputs)
    v = feats[0].cpu().numpy().astype(float)
    v = v / (np.linalg.norm(v) + 1e-9)
    return {"vector": [round(float(x), 6) for x in v], "dim": int(v.shape[0])}


@app.post("/classify")
def classify(body: ImgBody, authorization: str = Header(default="")):
    """CLIP 零样本分类：照片先分路——证件类转 OCR 精确路，其余走以图搜物。"""
    _check(authorization)
    import torch

    model, proc = _load_clip()
    labels = body.labels or ["校园卡", "学生证", "身份证", "水杯", "钥匙", "耳机", "雨伞", "手机", "充电宝", "眼镜", "书", "钱包"]
    prompts = [f"a photo of a {lab}" for lab in labels]
    inputs = proc(text=prompts, images=[_to_pil(body.image)], return_tensors="pt", padding=True)
    if next(model.parameters()).is_cuda:
        inputs = {k: v.to("cuda") for k, v in inputs.items()}
    with torch.no_grad():
        logits = model(**inputs).logits_per_image[0]
    probs = torch.softmax(logits, dim=-1).cpu().tolist()
    ranked = sorted(zip(labels, probs), key=lambda x: -x[1])
    return {"labels": [{"label": l, "score": round(s, 4)} for l, s in ranked]}


def _extract_fields(lines):
    """证件 OCR ≠ 通用 OCR：只认关键字段，按版式定位 + 正则兜底，不整版识别。

    lines: [{"text":..., "conf":...}]（自上而下）
    返回 {name: {value, confidence}, student_id: {value, confidence}}
    """
    out = {"name": None, "student_id": None}

    # 学号：8~12 位数字（北交大均为 10 位、20 开头，放宽以便兼容他证）
    for ln in lines:
        m = re.search(r"\d{8,12}", ln["text"])
        if m:
            out["student_id"] = {"value": m.group(0), "confidence": ln["conf"]}
            break

    # 姓名：「姓名」关键字右侧 / 下一行的 2~4 个汉字
    for i, ln in enumerate(lines):
        if "姓名" in ln["text"]:
            after = re.search(r"姓名[：:\s]*([\u4e00-\u9fa5]{2,4})", ln["text"])
            if after:
                out["name"] = {"value": after.group(1), "confidence": ln["conf"]}
            elif i + 1 < len(lines):
                m = re.match(r"^[\u4e00-\u9fa5]{2,4}$", lines[i + 1]["text"].strip())
                if m:
                    out["name"] = {"value": m.group(0), "confidence": lines[i + 1]["conf"]}
            break

    if not out["name"]:  # 兜底：卡面正中独立的 2~4 汉字行
        for ln in lines:
            if re.match(r"^[\u4e00-\u9fa5]{2,4}$", ln["text"].strip()) and "大学" not in ln["text"]:
                out["name"] = {"value": ln["text"].strip(), "confidence": ln["conf"]}
                break
    return out


@app.post("/ocr")
def ocr(body: ImgBody, authorization: str = Header(default="")):
    """证件关键字段识别。置信度随字段返回——低置信度字段前端不参与判定。"""
    _check(authorization)
    ocr_engine = _load_ocr()
    result = ocr_engine.ocr(__import__("numpy").array(_to_pil(body.image)), cls=True)
    lines = []
    for page in result or []:
        for box, (text, conf) in (page or []):
            lines.append({"text": text, "conf": float(conf), "box": box})
    fields = _extract_fields(lines)
    return {
        "fields": fields,
        "min_conf": OCR_MIN_CONF,
        "raw_text": [ln["text"] for ln in lines],
        # 隐私口径：不返回原图、不落图——原图在前端用完即弃，服务端不留存
    }
