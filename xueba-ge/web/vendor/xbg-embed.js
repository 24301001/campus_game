// 端上 embedding：在浏览器里跑 bge-small-zh-v1.5（WebGPU，没有就退 wasm）。
//
// 这份文件和 backend/retrieval/onnx_embed.py 是**一对一镜像**：文档向量是服务端用那份算的，
// 查询向量要是浏览器用不同分词/不同 pooling 算的，两边余弦就变成噪声 —— 而且不会报错，
// 只会排序悄悄变差。所以规则一条都不许自己发挥，全部照 Python 那份抄：
//   · normalize：\t\n\r -> 空格；其它 \p{Cc}/\p{Cf}（\x0b、零宽空格…）整个删掉；
//     CJK 表意文字前后各补一个空格；不小写、不剥重音（do_lower_case:false）
//   · 切分边界：\p{Zs} 空白 + 「ASCII 特殊字符四段 或 \p{P}」
//     —— $ ^ _ ` | ~ 属于后者：光看 Unicode 类别会漏，实测会让 `$$y` 变成 `##y`
//   · WordPiece 贪心最长匹配，## 是续接前缀，单词 >100 字符 -> 整个词 [UNK]
//   · [CLS] + 前 510 个 + [SEP]；取 last_hidden_state 的第 0 个向量 + L2 归一（不是 mean pooling）
//
// 已知只可能不同的地方：Unicode 版本。Python 的 unicodedata 和 V8 的 \p{...} 各跟一版标准，
// 生僻字符的类别判定理论上可能差一个 —— tools/xbg_embed_check.mjs 拿整本教材语料逐 token 比过。

const CJK_RANGES = [
  [0x4e00, 0x9fff], [0x3400, 0x4dbf], [0x20000, 0x2a6df], [0x2a700, 0x2b73f],
  [0x2b740, 0x2b81f], [0x2b820, 0x2ceaf], [0xf900, 0xfaff], [0x2f800, 0x2fa1f],
];
const MAX_CHARS_PER_WORD = 100;
const RE_WS = /\p{Zs}/u;
const RE_PUNCT = /\p{P}/u;
const RE_CTRL = /[\p{Cc}\p{Cf}]/u;

function isChinese(cp) {
  for (const [a, b] of CJK_RANGES) if (cp >= a && cp <= b) return true;
  return false;
}

function isPunct(ch) {
  const cp = ch.codePointAt(0);
  if ((cp >= 33 && cp <= 47) || (cp >= 58 && cp <= 64) || (cp >= 91 && cp <= 96) || (cp >= 123 && cp <= 126)) {
    return true;
  }
  return RE_PUNCT.test(ch);
}

function isWs(ch) {
  return ch === " " || RE_WS.test(ch);
}

export function normalize(text) {
  const out = [];
  for (const ch of text) {
    if (ch === "\n" || ch === "\t" || ch === "\r") out.push(" ");
    else if (RE_CTRL.test(ch)) continue;
    else if (isChinese(ch.codePointAt(0))) out.push(" " + ch + " ");
    else out.push(ch);
  }
  return out.join("");
}

export function preTokenize(text) {
  const words = [];
  let cur = [];
  for (const ch of text) {
    if (isWs(ch) || isPunct(ch)) {
      if (cur.length) { words.push(cur.join("")); cur = []; }
      if (!isWs(ch)) words.push(ch);
    } else {
      cur.push(ch);
    }
  }
  if (cur.length) words.push(cur.join(""));
  return words;
}

/** 默认用 fetch；在 Node 里跑同一个文件时注入一个读盘的实现（浏览器不需要）。 */
async function readTextDefault(urlOrPath) {
  return await (await fetch(urlOrPath)).text();
}

export async function loadVocab(url, readText = readTextDefault) {
  const text = await readText(url);
  const vocab = new Map();
  text.split("\n").forEach((line, i) => {
    const tok = line.replace(/\r$/, "");
    if (tok) vocab.set(tok, i);
  });
  return vocab;
}

/** 一个词 -> token id 列表。和 WordPiece.encode_word 逐行对应。 */
function encodeWord(vocab, word, unkId) {
  const chars = Array.from(word);
  if (chars.length > MAX_CHARS_PER_WORD) return [unkId];
  const ids = [];
  let start = 0;
  while (start < chars.length) {
    let hit = -1, hitEnd = -1;
    const stop = Math.min(chars.length, start + MAX_CHARS_PER_WORD);
    for (let end = stop; end > start; end--) {
      const piece = (start === 0 ? "" : "##") + chars.slice(start, end).join("");
      const id = vocab.get(piece);
      if (id !== undefined) { hit = id; hitEnd = end; break; }
    }
    if (hit < 0) return [unkId];
    ids.push(hit);
    start = hitEnd;
  }
  return ids;
}

/** 文本 -> token 字符串（比对/调试用，和 tokenize() 一样只给这条流水线的前半段）。 */
export function tokenize(vocab, text) {
  const out = [];
  for (const w of preTokenize(normalize(text))) {
    const chars = Array.from(w);
    if (chars.length > MAX_CHARS_PER_WORD) { out.push("[UNK]"); continue; }
    const pieces = [];
    let start = 0, ok = true;
    while (start < chars.length && ok) {
      const stop = Math.min(chars.length, start + MAX_CHARS_PER_WORD);
      let hit = null, hitEnd = -1;
      for (let end = stop; end > start; end--) {
        const piece = (start === 0 ? "" : "##") + chars.slice(start, end).join("");
        if (vocab.has(piece)) { hit = piece; hitEnd = end; break; }
      }
      if (hit === null) ok = false;
      else { pieces.push(hit); start = hitEnd; }
    }
    out.push(...(ok ? pieces : ["[UNK]"]));
  }
  return out;
}

export function encode(vocab, text, maxSeq = 512) {
  const ids = [];
  for (const w of preTokenize(normalize(text))) {
    ids.push(...encodeWord(vocab, w, vocab.get("[UNK]")));
    if (ids.length >= maxSeq - 2) break;
  }
  const body = ids.slice(0, maxSeq - 2);
  return { ids: [vocab.get("[CLS]"), ...body, vocab.get("[SEP]")],
           len: body.length + 2 };
}

/**
 * 起一个编码器。`want` 是想要的 EP 顺序；浏览器没有 navigator.gpu 就自动只剩 wasm。
 * 返回 { embed(texts), embedOne(text), describe(), tokenize(text) }。
 */
export async function createEncoder(opt = {}) {
  const base = opt.baseUrl || "/models/bge-small-zh-v1.5";
  // 静态文件挂在 /static 下面（backend/app.py），默认值必须带上这一截
  const ortUrl = opt.ortUrl || "/static/vendor/onnxruntime/ort.webgpu.bundle.min.mjs";
  const readText = opt.readText || readTextDefault;
  const ort = opt.ort || await import(ortUrl);

  // 有没有 WebGPU 是让浏览器自己回答，不是我们猜的。requestAdapter() 拿到东西才谈得上真推理，
  // 只判 navigator.gpu 存在不够（Headless / 驱动被墙时它是非空但拿不到 adapter）。
  // noGpu 是给 A/B 用的：同一台机器上分别量 webgpu 和 wasm 各多快。
  let adapter = null;
  if (!opt.noGpu && globalThis.navigator && globalThis.navigator.gpu) {
    try { adapter = await globalThis.navigator.gpu.requestAdapter({ powerPreference: "default" }); }
    catch (exc) { adapter = null; }
  }
  const eps = adapter ? ["webgpu", "wasm"] : ["wasm"];
  // 没有 COOP/COEP 就没有 SharedArrayBuffer，多线程 wasm 起不来 —— 显式单线程，
  // 免得 ORT 在后台偷偷 attempt 一次再回退，用户看到的是"卡住"。
  ort.env.wasm.numThreads = 1;
  ort.env.wasm.proxy = false;
  ort.env.wasm.wasmPaths = opt.wasmPaths || ortUrl.slice(0, ortUrl.lastIndexOf("/") + 1);

  const t0 = performance.now();
  const session = await ort.InferenceSession.create(
    opt.modelPath || base + "/onnx/model_quantized.onnx",
    { executionProviders: eps, graphOptimizationLevel: "all" });
  const loadedMs = performance.now() - t0;
  const vocab = await loadVocab(opt.vocabPath || base + "/vocab.txt", readText);
  const feeds = new Set(session.inputNames);
  const outName = session.outputNames.includes("last_hidden_state") ? "last_hidden_state" : session.outputNames[0];

  async function embed(texts) {
    const encs = texts.map((t) => encode(vocab, t || " "));
    const width = Math.max(...encs.map((e) => e.len));
    const pad = vocab.get("[PAD]");
    const b = encs.length, ids = new BigInt64Array(b * width);
    const mask = new BigInt64Array(b * width), types = new BigInt64Array(b * width);
    encs.forEach((e, r) => {
      for (let i = 0; i < e.len; i++) {
        ids[r * width + i] = BigInt(e.ids[i]);
        mask[r * width + i] = 1n;
        types[r * width + i] = 0n;
      }
      if (e.len < width) {
        for (let i = e.len; i < width; i++) ids[r * width + i] = BigInt(pad);
      }
    });
    const shape = [b, width];
    const input = { input_ids: new ort.Tensor("int64", ids, shape),
                    attention_mask: new ort.Tensor("int64", mask, shape) };
    if (feeds.has("token_type_ids")) input.token_type_ids = new ort.Tensor("int64", types, shape);
    const got = await session.run(input);
    const hl = got[outName];
    const dim = hl.dims[hl.dims.length - 1];
    const rows = [];
    const seq = hl.dims[1];
    for (let r = 0; r < b; r++) {
      // CLS pooling：第 0 个位置向量。data 是 Float32Array，行主序 r*seq*dim + 0*dim + k
      const v = hl.data.subarray(r * seq * dim, r * seq * dim + dim);
      let n = 0;
      for (let k = 0; k < dim; k++) n += v[k] * v[k];
      n = Math.sqrt(n) || 1;
      const outv = new Float32Array(dim);
      for (let k = 0; k < dim; k++) outv[k] = v[k] / n;
      rows.push(outv);
    }
    return rows;
  }

  return {
    adapter: adapter ? { vendor: adapter.info && adapter.info.vendor || "",
                         architecture: adapter.info && adapter.info.architecture || "",
                         device: adapter.info && adapter.info.device || "" } : null,
    embedOne: async (t) => (await embed([t]))[0],
    tokenize: (t) => tokenize(vocab, t),
    encode: (t) => encode(vocab, t),
    // ORT 按数组顺序取第一个可用的 EP，所以 eps[0] 就是实际执行者；
    // 它是问过 requestAdapter() 才排在前面的，不是我们猜的。
    describe: () => ({ eps, dim: 512, loaded_ms: Math.round(loadedMs),
                       wasmThreads: ort.env.wasm.numThreads, model: base,
                       gpu: adapter ? "adapter-ok" : "no-adapter" }),
  };
}