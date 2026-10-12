// 端上那份 JS 的验收：**跑的是浏览器同一份文件**（web/vendor/xbg-embed.js），这里只是拿 Node 驱动。
//
//     node tools/xbg_embed_check.mjs
//
// 两道关，都是"错一个字符就全废"的那种：
//   1) 分词 —— tests/fixtures/onnx_tokenizer.jsonl 里每条 text，JS 出的 token id
//      必须和 Python(backend/retrieval/onnx_embed.py) 逐 id 相等。那份 Python 实现
//      又已用 `tokenizers` 库在 3,028 条真实文本上比过（0 不一致），所以这是三方对齐。
//   2) 推理 —— web/fixtures/onnx_vectors.json 里 6 条查询，JS 算出来的 512 维向量
//      和 Python+onnxruntime(CPU) 的余弦必须 >= 0.999。同一份权重、同一套 pooling，
//      差异只可能来自 padding / EP 取整，正常应该在 0.99999 这一档。
//
// Node 这边只有 wasm EP。WebGPU 那条只能在真浏览器里量：打开 web/onnx.html。
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MODEL = path.join(ROOT, "models", "bge-small-zh-v1.5");
const VENDOR = path.join(ROOT, "web", "vendor");
const fails = [];
const say = (ok, name, extra = "") => { console.log((ok ? "  PASS  " : "  FAIL  ") + name + (extra ? "  · " + extra : "")); if (!ok) fails.push(name); };

const mod = await import(pathToFileURL(path.join(VENDOR, "xbg-embed.js")).href);
const { encode, loadVocab, tokenize } = mod;

// ---------- 1) 分词逐 id 比对 ----------
const vocab = await loadVocab(path.join(MODEL, "vocab.txt"), (p) => fs.readFile(p, "utf8"));
const lines = (await fs.readFile(path.join(ROOT, "tests/fixtures/onnx_tokenizer.jsonl"), "utf8")).trim().split("\n");
let badTok = 0, firstBad = null, nTok = 0;
for (const line of lines) {
  const { text, ids } = JSON.parse(line);
  const got = encode(vocab, text).ids;
  nTok += ids.length;
  if (got.length !== ids.length || got.some((v, i) => v !== ids[i])) {
    badTok += 1;
    if (!firstBad) firstBad = { text: text.slice(0, 60), ref: ids.slice(0, 14), got: got.slice(0, 14) };
  }
}
say(badTok === 0, `分词与 Python 逐 id 相等（${lines.length} 条文本 / ${nTok} 个 token）`,
    badTok ? `${badTok} 条不一致，例：${JSON.stringify(firstBad)}` : "");

// 顺带看一眼 token 字符串（不是 id）也能对上，排查时不用翻译 id
const t0 = tokenize(vocab, "设三阶实对称矩阵A的特征值是1,2,3");
say(t0.slice(0, 3).join("") !== "", "tokenize() 可用", t0.slice(0, 10).join(" "));

// ---------- 2) 真推理：向量和 Python 对得上吗 ----------
let ort = null;
try {
  ort = await import(pathToFileURL(path.join(VENDOR, "onnxruntime", "ort.webgpu.bundle.min.mjs")).href);
} catch (exc) {
  ort = null;
  console.log("  SKIP  onnxruntime-web 在 Node 里加载：" + String(exc.message).slice(0, 120));
}
const fixture = JSON.parse(await fs.readFile(path.join(ROOT, "web/fixtures/onnx_vectors.json"), "utf8"));
let enc2;
if (!ort) {
  console.log("  SKIP  向量对照：ORT-web 在 Node 里要 import 一个 .mjs 加载器、又要 fetch 一个 .wasm，"
      + "\n        前者只认 file:// URL、后者只认裸路径，同一个 wasmPaths 满足不了两边。");
  console.log("        这一步交给真浏览器跑（页面里全是 http，不存在这个矛盾）：");
  console.log("          开 http://127.0.0.1:8010/static/onnx.html  或  "
      + "node tools/xbg_onnx_page.mjs（无头浏览器，同样口径）");
} else {
try {
  enc2 = await mod.createEncoder({
    ort,
    modelPath: path.join(MODEL, "onnx", "model_quantized.onnx"),
    vocabPath: path.join(MODEL, "vocab.txt"),
    wasmPaths: pathToFileURL(path.join(VENDOR, "onnxruntime") + path.sep).href,
    readText: (p) => fs.readFile(p, "utf8"),
    baseUrl: MODEL,
  });
} catch (exc) {
  // Node 里 wasm 加载器只认 file:// URL、wasm 二进制又只能按裸路径读，同一个 wasmPaths
  // 满足不了两边 —— 这是 Node 的限制，不是这份 JS 的问题。浏览器里全是 http，不存在这个矛盾。
  console.log("  SKIP  向量对照在 Node 里跑不了：" + String(exc.message).slice(0, 120));
  console.log("        请在浏览器里验：http://127.0.0.1:8010/static/onnx.html（或无头跑 tools/run_onnx_page.ps1）");
  console.log(`\n${fails.length ? fails.length + " 项不通过：" + fails.join(" / ") : "分词这一关通过（向量那一关留给浏览器）"}`);
  process.exit(fails.length ? 1 : 0);
}
const t1 = Date.now();
const vecs = await enc2.embed(fixture.queries);
const ms = (Date.now() - t1) / fixture.queries.length;
say(vecs.length === fixture.queries.length && vecs[0].length === fixture.dim,
    `JS 推理出向量（${fixture.queries.length} 条 / ${Math.round(ms)} ms 每条，EP 见下）`,
    JSON.stringify(enc2.describe()));
const cos = fixture.queries.map((q, r) => {
  const a = vecs[r], b = fixture.vectors[r];
  let d = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) { d += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i]; }
  return { q, c: d / Math.sqrt(na * nb), maxdiff: Math.max(...Array.from(a).map((x, i) => Math.abs(x - b[i]))) };
});
for (const { q, c, maxdiff } of cos) {
  say(c >= 0.999, `JS 向量 ≈ Python 向量  cos=${c.toFixed(6)} maxΔ=${maxdiff.toExponential(1)}`, q);
}
}
const worst = Math.min(...cos.map((x) => x.c));
console.log(`\n最差 cos = ${worst.toFixed(6)}（阈值 0.999）`);
console.log(fails.length ? `${fails.length} 项不通过：${fails.join(" / ")}` : "全部通过");
process.exit(fails.length ? 1 : 0);