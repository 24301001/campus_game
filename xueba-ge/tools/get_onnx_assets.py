# -*- coding: utf-8 -*-
r"""把端上推理要用的两坨二进制落到本地，之后运行时一个公网依赖都不许有。

    python tools/get_onnx_assets.py            # int8 模型 + onnxruntime-web（默认，约 44 MB）
    python tools/get_onnx_assets.py --full     # 再多下一份 fp32 模型（+95 MB，做逐位一致对照用）

来源是实测挑的，不是随手抄的：
  · 模型 `BAAI/bge-small-zh-v1.5` 的 ONNX 导出（Xenova 那份，含 int8 量化）
    —— **huggingface.co 在这台机器上 DNS 直接不通**，走 `hf-mirror.com`，实测 23 MB 两秒；
  · `onnxruntime-web@1.30.0` 从 npm registry 的 tarball 里只抽 4 个文件
    （bundle + 两套 wasm）。npm install 在这台机器上要跑十几分钟还会回滚，别用。

落点：
  models/bge-small-zh-v1.5/            服务端(provider=onnx) 和浏览器读**同一份**
  web/vendor/onnxruntime/              浏览器从 /static/vendor/onnxruntime/ 取
"""
from __future__ import annotations

import argparse
import io
import json
import os
import sys
import tarfile
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HF = "https://hf-mirror.com/Xenova/bge-small-zh-v1.5/resolve/main"
NPM = "https://registry.npmjs.org/onnxruntime-web/-/onnxruntime-web-1.30.0.tgz"
MODEL_DIR = os.path.join(ROOT, "models", "bge-small-zh-v1.5")
VENDOR = os.path.join(ROOT, "web", "vendor", "onnxruntime")

MODEL_FILES = ["config.json", "tokenizer.json", "tokenizer_config.json", "vocab.txt",
               "special_tokens_map.json", "quantize_config.json", "onnx/model_quantized.onnx"]
ORT_FILES = ["ort.webgpu.bundle.min.mjs",
             "ort-wasm-simd-threaded.jsep.mjs", "ort-wasm-simd-threaded.jsep.wasm",
             "ort-wasm-simd-threaded.asyncify.mjs", "ort-wasm-simd-threaded.asyncify.wasm"]


UA = {"User-Agent": "xueba-ge/1.0 (dev asset fetcher)"}


def _req(url: str) -> "urllib.request.Request":
    """hf-mirror 对没有 User-Agent 的请求直接 403（实测），带一个就行。"""
    return urllib.request.Request(url, headers=UA)


def fetch(url: str, dest: str) -> None:
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    if os.path.exists(dest) and os.path.getsize(dest) > 0:
        print(f"  · 已有 {os.path.relpath(dest, ROOT)}（跳过；要重下先删掉）")
        return
    print(f"  ↓ {url}")
    with urllib.request.urlopen(_req(url), timeout=120) as r, open(dest, "wb") as fh:
        total = 0
        while True:
            buf = r.read(1 << 20)
            if not buf:
                break
            total += fh.write(buf)
            sys.stdout.write(f"\r    {total / 1e6:6.1f} MB")
            sys.stdout.flush()
    print(f"\r    落地 {total / 1e6:6.1f} MB -> {os.path.relpath(dest, ROOT)}")


def main(argv=None) -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--full", action="store_true", help="再多要一份 fp32 的 model.onnx（95 MB）")
    a = ap.parse_args(argv)
    files = list(MODEL_FILES) + (["onnx/model.onnx"] if a.full else [])
    print(f"[1/2] 模型（hf-mirror）-> {os.path.relpath(MODEL_DIR, ROOT)}")
    for f in files:
        fetch(f"{HF}/{f}", os.path.join(MODEL_DIR, *f.split("/")))
    print(f"[2/2] onnxruntime-web -> {os.path.relpath(VENDOR, ROOT)}")
    tgz = io.BytesIO()
    with urllib.request.urlopen(_req(NPM), timeout=300) as r:
        tgz.write(r.read())
    tgz.seek(0)
    with tarfile.open(fileobj=tgz, mode="r:gz") as tf:
        for name in ORT_FILES:
            member = "package/dist/" + name
            dest = os.path.join(VENDOR, name)
            if os.path.exists(dest) and os.path.getsize(dest) > 0:
                print(f"  · 已有 {os.path.relpath(dest, ROOT)}")
                continue
            data = tf.extractfile(member).read()
            os.makedirs(VENDOR, exist_ok=True)
            with open(dest, "wb") as fh:
                fh.write(data)
            print(f"    抽出 {len(data) / 1e6:6.1f} MB -> {os.path.relpath(dest, ROOT)}")
    with open(os.path.join(VENDOR, "VERSION.txt"), "w", encoding="utf-8") as fh:
        fh.write("onnxruntime-web 1.30.0（npm registry tarball 里抽的 5 个文件：webgpu bundle + "
                 "两套 wasm：jsep=有 SharedArrayBuffer 时用、asyncify=没有时用）\n"
                 "重新落地：python tools/get_onnx_assets.py\n")
    # 校验：模型必须能被 onnxruntime 打开，vocab 行数必须和 config 的 vocab_size 对得上
    cfg = json.load(open(os.path.join(MODEL_DIR, "config.json"), encoding="utf-8"))
    vocab = open(os.path.join(MODEL_DIR, "vocab.txt"), encoding="utf-8").read().split("\n")
    got = len([v for v in vocab if v])
    print("\n[校验] vocab %d 行 / config.vocab_size %d -> %s"
          % (got, cfg["vocab_size"], "一致" if got == cfg["vocab_size"] else "**不一致，下载坏了**"))
    if a.full:
        try:
            import onnxruntime  # noqa: F401
            from backend.retrieval.onnx_embed import get_encoder
            get_encoder({"model_file": "model.onnx"})
            print("[校验] fp32 模型能加载 ✓")
        except Exception as exc:                      # noqa: BLE001
            print(f"[校验] fp32 模型加载失败：{exc}")
    return 0


if __name__ == "__main__":
    sys.path.insert(0, ROOT)
    raise SystemExit(main())