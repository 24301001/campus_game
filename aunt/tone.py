"""Let DeepSeek select local facts without letting it author factual text."""

import json
import os
import re
from urllib.request import Request, urlopen


DEFAULT_ENDPOINT = "https://api.deepseek.com/chat/completions"
DEFAULT_MODEL = "deepseek-flash"
SYSTEM_PROMPT = (
    "你只做事实片段选择，不写回答正文。用户消息中的 fragments 由本地数据库生成，"
    "其中 required_indices 必须全部保留。最多再选一条与问题最有关的其他片段。"
    "不得自行生成菜品、窗口、价格、营业时间、评价或任何文字。"
    "只返回 JSON 对象，例如 {\"indices\":[0,1]}；不要返回 answer 或其他字段。"
)
SENSITIVE_FACTS = re.compile(
    r"[¥￥]|\d{1,2}[:：]\d{2}|(?:价格|现价|活动价|资料价|营业|排队|评分|评价|口碑|"
    r"待核|未核|不知道|没有|不保证|非现价|现场|实时|来源|历史|分钟|菜单)"
)
SENTENCES = re.compile(r"[^。！？]+[。！？]?")
CANTEEN_NAMES = {
    "xuehuo": "学活", "minghu": "明湖", "xuesi": "学四", "liuyuan": "留园",
    "dongqu": "东区", "xueyuan": "学苑", "yimin": "益民"
}
PRICE_TYPES = {
    "historical_promotion": "历史活动价",
    "personal_promotion": "个人当次优惠价",
    "personal_purchase": "学生当次消费价",
    "historical_reported_price": "历史资料价",
    "historical_student_report": "学生当次消费价",
    "historical_article_price": "历史资料价"
}


def _local_fragments(reply):
    """Keep risky facts and their caveats in one indivisible original fragment."""
    if SENSITIVE_FACTS.search(reply) or "\n" in reply:
        return [reply]
    sentences = [part.strip() for part in SENTENCES.findall(reply) if part.strip()]
    if 1 < len(sentences) <= 2 and all(len(part) <= 120 for part in sentences):
        return sentences
    return [reply]


def _recommendation_fragment(lead):
    dish = str(lead.get("dish") or "").strip()
    if not dish:
        return None
    canteen_id = str(lead.get("canteenId") or "").strip()
    place = CANTEEN_NAMES.get(canteen_id, canteen_id)
    floor = str(lead.get("floorLabel") or "").strip()
    window = str(lead.get("windowName") or "").strip()
    where = " ".join(part for part in (place, floor, window) if part)
    if not window:
        where += "（具体档口待核）"
    date = str(lead.get("sourceDate") or "").strip()
    prefix = (date + " 资料记录：") if date else "资料记录："
    price = lead.get("priceValue")
    if price is None:
        price_text = "价格待核"
    else:
        price_type = PRICE_TYPES.get(lead.get("priceType"), "历史资料价")
        price_text = "%s ¥%s，现价待核" % (price_type, price)
    return "%s%s：%s；%s。" % (prefix, where, dish, price_text)


def _fragments(result):
    local = _local_fragments(result["reply"])
    fragments = list(local)
    for lead in result.get("recommendations", [])[:4]:
        fragment = _recommendation_fragment(lead)
        if fragment and fragment not in fragments:
            fragments.append(fragment)
    return fragments, list(range(len(local)))


def _selected_indices(content, count, required):
    data = json.loads(content)
    if not isinstance(data, dict) or set(data) != {"indices"}:
        return None
    indices = data["indices"]
    if not isinstance(indices, list) or not 1 <= len(indices) <= 2:
        return None
    if any(type(index) is not int or index < 0 or index >= count for index in indices):
        return None
    if len(set(indices)) != len(indices) or not set(required).issubset(indices):
        return None
    return sorted(indices)


def respond(question: str, result: dict) -> str:
    """Select original local fact fragments, or use the complete local reply."""
    local_reply = result["reply"]
    key = (os.environ.get("DEEPSEEK_API_KEY") or os.environ.get("AUNT_LLM_API_KEY") or "").strip()
    if not key:
        return local_reply
    endpoint = os.environ.get("AUNT_LLM_ENDPOINT", DEFAULT_ENDPOINT).strip()
    model = os.environ.get("AUNT_LLM_MODEL", DEFAULT_MODEL).strip()
    if not model or not (endpoint.startswith("https://") or endpoint.startswith("http://127.0.0.1:")):
        return local_reply
    fragments, required = _fragments(result)
    payload = {
        "model": model,
        "thinking": {"type": "disabled"},
        "temperature": 0,
        "max_tokens": 128,
        "response_format": {"type": "json_object"},
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": json.dumps({
                "question": question,
                "fragments": [{"index": index, "text": text} for index, text in enumerate(fragments)],
                "required_indices": required
            }, ensure_ascii=False)},
        ],
    }
    request = Request(endpoint, data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
                      headers={"Authorization": "Bearer " + key, "Content-Type": "application/json"},
                      method="POST")
    try:
        with urlopen(request, timeout=8) as response:
            data = json.loads(response.read(64 * 1024))
        choice = data["choices"][0]
        if choice["finish_reason"] != "stop":
            return local_reply
        indices = _selected_indices(choice["message"]["content"], len(fragments), required)
        if indices is None:
            return local_reply
        return "\n".join(fragments[index] for index in indices)
    except (OSError, ValueError, KeyError, TypeError, IndexError, AttributeError):
        return local_reply
