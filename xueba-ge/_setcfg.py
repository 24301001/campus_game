# -*- coding: utf-8 -*-
"""临时脚本：把学霸哥的两处配置改成「本机无百炼 Key 也能跑」的档位。跑完可留着复用。

改两处（都只动一个键，其余一个字不动，`_` 开头的注释键原样保留）：
  config/retrieval.json  →  embedding.provider : "api"  ->  "onnx"   本地小模型出向量
  config/llm.json        →  provider           : "api"  ->  "stub"   回答由抽取式拼接代替

用法：
    python _setcfg.py status      # 只看现在是什么
    python _setcfg.py local       # 切到「无 Key」档
    python _setcfg.py api         # 切回「有百炼 Key」档（切之前先把 key 放进 data/.llm_key）
"""
import json
import os
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))


def load(name):
    path = os.path.join(ROOT, "config", f"{name}.json")
    with open(path, "r", encoding="utf-8") as fh:
        return path, json.load(fh)


def save(path, data):
    with open(path, "w", encoding="utf-8") as fh:
        json.dump(data, fh, ensure_ascii=False, indent=2)
        fh.write("\n")


def status():
    _, r = load("retrieval")
    _, l = load("llm")
    keyfile = os.path.join(ROOT, "data", l.get("key_file") or ".llm_key")
    has_key = os.path.exists(keyfile) and os.path.getsize(keyfile) > 0
    print(f"  retrieval.json  embedding.provider = {r['embedding']['provider']!r}"
          f"   (model={r['embedding'].get('model')!r}, dim={r['embedding'].get('dim')})")
    print(f"  llm.json        provider           = {l['provider']!r}"
          f"   (base_url={l.get('base_url')!r}, model={l.get('model')!r})")
    print(f"  data/.llm_key   存在 = {has_key}")


def set_local():
    p, r = load("retrieval")
    r["embedding"]["provider"] = "onnx"
    save(p, r)
    p, l = load("llm")
    l["provider"] = "stub"
    save(p, l)
    print("[OK] 已切到「无 Key」档：embedding=onnx（本地小模型） / llm=stub（抽取式回答）")


def set_api():
    p, l = load("llm")
    l["provider"] = "api"
    save(p, l)
    p, r = load("retrieval")
    was = r["embedding"]["provider"]
    r["embedding"]["provider"] = "api"
    save(p, r)
    print(f"[OK] llm.json provider='api'（百炼 qwen3.8-flash）")
    print(f"[OK] retrieval.json embedding.provider: {was!r} -> 'api'（百炼 qwen3.7-text-embedding-flash）")
    if was != "api":
        print()
        print("     ⚠️ 向量提供方换过了 ⇒ **必须重建索引**，否则索引里的向量和查询时的向量不是一个空间：")
        print("        .\\.venv\\Scripts\\python.exe -m kb.build")


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "status"
    print(f"== 当前配置（{ROOT}）==")
    if cmd == "status":
        status()
    elif cmd == "local":
        set_local()
        status()
    elif cmd == "api":
        set_api()
        status()
    else:
        print(f"不认识的命令：{cmd}")
        sys.exit(1)
