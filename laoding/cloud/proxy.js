// 云函数代理 —— 保安.md §3.3 / 总体设计 §6.4、附录 B
// 职责只有一个：注入鉴权 Token 并转发到云端 GPU 实例。无状态、无业务逻辑。
// 必须存在的原因：前端不能直连 GPU——跨域、API Key 泄露、HTTPS 混合内容。
// 前端仍是一个 HTML，只多一个 fetch；模型在云端，不在包里。
//
// 部署：任意 Serverless 平台（腾讯云函数 / 阿里 FC 等），环境变量：
//   CV_SERVICE_URL  GPU 实例地址（例：http://<gpu-ip>:9000）
//   CV_TOKEN        与 cv_service.py 约定好的鉴权 Token

const GPU_BASE = process.env.CV_SERVICE_URL || "";
const CV_TOKEN = process.env.CV_TOKEN || "";

// 800ms 超时即降级（总体设计 §6.4 链路图）：慢的是开机不是算力，
// 超时说明实例没热，前端会自行降级到文字四维匹配，不硬等。
const TIMEOUT_MS = 800;

exports.main = async ({ httpMethod, body }) => {
  if (httpMethod !== "POST") return { statusCode: 405, body: '{"error":"method"}' };
  if (!GPU_BASE) return { statusCode: 500, body: '{"error":"no_cv_service_url"}' };

  let payload;
  try { payload = JSON.parse(body); } catch (e) { return { statusCode: 400, body: '{"error":"bad_json"}' }; }
  const action = payload.action; // encode | classify | ocr
  if (!["encode", "classify", "ocr"].includes(action))
    return { statusCode: 404, body: '{"error":"no_such_action"}' };

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const r = await fetch(`${GPU_BASE}/${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${CV_TOKEN}` },
      body: JSON.stringify({ image: payload.image, labels: payload.labels }),
      signal: ctrl.signal,
    });
    const text = await r.text();
    return { statusCode: r.status, body: text };
  } catch (e) {
    return { statusCode: 504, body: '{"error":"cv_timeout"}' }; // 前端据此降级
  } finally {
    clearTimeout(timer);
  }
};
