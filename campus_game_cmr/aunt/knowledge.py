"""Evidence-aware canteen data, public reputation, and grounded local answers."""

from datetime import datetime, timezone
from pathlib import Path
import json
import re
import time


CATALOG = json.loads((Path(__file__).parent / "data" / "canteens.json").read_text(encoding="utf-8"))
SOURCED_WINDOWS = json.loads((Path(__file__).parent / "data" / "sourced_windows.json").read_text(encoding="utf-8"))
PLAN_WINDOWS = json.loads((Path(__file__).parent / "data" / "plan_windows.json").read_text(encoding="utf-8"))
OCT10_UPDATES = json.loads((Path(__file__).parent / "data" / "oct10_updates.json").read_text(encoding="utf-8"))
CURATED_FOOD = json.loads((Path(__file__).parent / "data" / "curated_food.json").read_text(encoding="utf-8"))
MATERIAL = json.loads((Path(__file__).parent / "data" / "material_extract.json").read_text(encoding="utf-8"))
PUBLIC_REVIEWS = json.loads((Path(__file__).parent / "data" / "review_candidates.json").read_text(encoding="utf-8"))
CATALOG["sources"].update(SOURCED_WINDOWS["sources"])
CATALOG["sources"].update(PLAN_WINDOWS["sources"])
CATALOG["sources"].update(OCT10_UPDATES["sources"])


def _floor(canteen_id, floor_label):
    canteen = next((item for item in CATALOG["canteens"] if item["id"] == canteen_id), None)
    if canteen is None:
        return None, None
    return canteen, next((item for item in canteen["floors"] if item["label"] == floor_label), None)


for fact in MATERIAL["historicalHours"]:
    canteen, floor = _floor(fact["canteenId"], fact.get("floorLabel"))
    if canteen is None:
        continue
    source_id = "MH_" + fact["id"]
    CATALOG["sources"][source_id] = {"title": fact["source"]["title"] + "（" + fact["source"]["date"] + "）",
                                     "url": fact["source"]["url"]}
    record = {"text": "、".join(fact["timePeriods"]), "date": fact["source"]["date"],
              "venueName": fact.get("venueName"), "evidence": [source_id], "currentlyVerified": False}
    target = floor if floor is not None else canteen
    target.setdefault("historicalHours", []).append(record)

for fact in MATERIAL["floorMenuLeads"]:
    _, floor = _floor(fact["canteenId"], fact.get("floorLabel"))
    if floor is None:
        continue
    source_id = "MF_" + fact["id"]
    CATALOG["sources"][source_id] = {"title": fact["source"]["title"] + "（" + fact["source"]["date"] + "）",
                                     "url": fact["source"]["url"]}
    floor.setdefault("historicalMenu", []).append({
        "dishes": fact.get("dishExamples", []), "date": fact["source"]["date"],
        "detail": fact["detail"], "price": fact.get("price"), "evidence": [source_id],
        "currentlyVerified": False,
    })

for fact in MATERIAL["foodFacts"]:
    if fact["id"].startswith("curated-") or fact.get("canteenId") is None:
        continue
    price = fact.get("price") or {}
    CURATED_FOOD["entries"].append({
        "id": "material-" + fact["id"], "canteenId": fact["canteenId"],
        "floorLabel": fact.get("floorLabel"), "dish": fact["dish"],
        "windowName": fact.get("windowName"), "priceValue": price.get("value"),
        "priceDate": price.get("date"), "priceType": price.get("type", "unpriced"),
        "summary": fact["detail"], "sourceTitle": fact["source"]["title"],
        "sourceUrl": fact["source"]["url"], "sourceDate": fact["source"]["date"],
        "confidence": fact["attributionConfidence"],
    })
for fact in MATERIAL["floorMenuLeads"]:
    if fact.get("canteenId") is None:
        continue
    for index, dish_name in enumerate(fact.get("dishExamples", [])):
        price = fact.get("price") if len(fact["dishExamples"]) == 1 else None
        CURATED_FOOD["entries"].append({
            "id": "floor-" + fact["id"] + "-" + str(index), "canteenId": fact["canteenId"],
            "floorLabel": fact.get("floorLabel"), "dish": dish_name,
            "windowName": None, "priceValue": price.get("value") if price else None,
            "priceDate": price.get("date") if price else None,
            "priceType": price.get("type") if price else "unpriced",
            "summary": fact["detail"], "sourceTitle": fact["source"]["title"],
            "sourceUrl": fact["source"]["url"], "sourceDate": fact["source"]["date"],
            "confidence": fact["attributionConfidence"],
        })
for window in SOURCED_WINDOWS["windows"]:
    canteen = next((item for item in CATALOG["canteens"] if item["id"] == window["canteenId"]), None)
    if canteen is None:
        raise ValueError("Unknown sourced canteen: " + window["canteenId"])
    floor = next((item for item in canteen["floors"] if item["label"] == window["floorLabel"]), None)
    if floor is None or not any(item["id"] == window["parentZoneId"] for item in floor["stalls"]):
        raise ValueError("Unknown sourced floor/section: " + window["id"])
    floor["stalls"].append({key: value for key, value in window.items()
                            if key not in ("canteenId", "floorLabel", "parentZoneId")})
for plan in PLAN_WINDOWS["floors"]:
    canteen = next(item for item in CATALOG["canteens"] if item["id"] == plan["canteenId"])
    floor = next(item for item in canteen["floors"] if item["label"] == plan["floorLabel"])
    floor["plan"] = {key: value for key, value in plan.items()
                     if key not in ("canteenId", "floorLabel", "windows")}
    for position in plan["windows"]:
        existing = next((zone for zone in floor["stalls"] if zone["id"] == position["id"]), None)
        if existing:
            existing["rect"] = position["rect"]
            existing["front"] = position["front"]
            existing["locationEvidence"] = position["evidence"]
            existing["summary"] += "；" + position["summary"]
        else:
            floor["stalls"].append(position)
for plan in OCT10_UPDATES["plans"]:
    _, floor = _floor(plan["canteenId"], plan["floorLabel"])
    if plan["canteenId"] == "minghu" and plan["floorLabel"] == "2F":
        # Retain earlier IDs and reviews, but do not show their superseded coordinates.
        for zone in floor["stalls"]:
            if zone.get("rect") is not None:
                zone["rect"] = None
    floor["plan"] = {key: value for key, value in plan.items()
                     if key not in ("canteenId", "floorLabel", "windows")}
    for updated in plan["windows"]:
        existing = next((zone for zone in floor["stalls"] if zone["id"] == updated["id"]), None)
        if existing is None:
            floor["stalls"].append(updated)
        else:
            existing.update(updated)
        (existing or updated)["locationEvidence"] = updated["evidence"]
for lead in CURATED_FOOD["entries"]:
    source_id = "F_" + lead["id"]
    CATALOG["sources"][source_id] = {"title": lead["sourceTitle"] + "（" + lead["sourceDate"] + "）",
                                     "url": lead["sourceUrl"]}
    lead["evidence"] = [source_id]
    if not lead.get("windowName"):
        continue
    canteen, floor = _floor(lead["canteenId"], lead.get("floorLabel"))
    if floor is None:
        continue
    name = lead["windowName"].replace("档口", "")
    matches = [zone for zone in floor["stalls"] if zone.get("kind") == "window"
               and zone["name"].replace("档口", "") == name]
    if len(matches) == 1 and not any(dish["name"] == lead["dish"] for dish in matches[0]["dishes"]):
        matches[0]["dishes"].append({
            "name": lead["dish"], "price": None,
            "historical": {"value": lead["priceValue"], "date": lead["priceDate"],
                           "type": lead["priceType"]},
            "evidence": [source_id]
        })
CATALOG["foodLeads"] = CURATED_FOOD["entries"]
review_lookup = {}
for review in PUBLIC_REVIEWS["candidates"]:
    canteen, floor = _floor(review["canteenId"], review.get("floorLabel"))
    if canteen is None:
        continue
    source_id = "RV_" + review["id"]
    CATALOG["sources"][source_id] = {"title": review["source"]["title"] + "（" + review["source"]["date"] + "）",
                                     "url": review["source"]["url"]}
    record = {"id": review["id"], "windowName": review.get("windowName"), "dish": review.get("dish"),
              "excerpt": review["excerpt"][:220], "date": review["source"]["date"],
              "attributionConfidence": review["attributionConfidence"], "evidence": [source_id],
              "eligibleForScore": False}
    target = floor if floor is not None else canteen
    target.setdefault("publicReviews", []).append(record)
    review_lookup[review["id"]] = record
    if floor is not None and review.get("windowName") and review["attributionConfidence"] == "high":
        name = review["windowName"].replace("档口", "")
        matches = [zone for zone in floor["stalls"] if zone.get("kind") == "window"
                   and zone["name"].replace("档口", "") == name]
        if len(matches) == 1:
            matches[0].setdefault("publicReviews", []).append(record)
for lead in PUBLIC_REVIEWS["qualitativeSummaryLeads"]:
    canteen, floor = _floor(lead.get("canteenId"), lead.get("floorLabel"))
    if canteen is None:
        continue
    ids = [item for item in lead["supportingCandidateIds"] if item in review_lookup]
    summary = {"summary": lead["summary"], "count": len(ids),
               "evidence": [source for item in ids for source in review_lookup[item]["evidence"]],
               "numericRating": None}
    if floor is None:
        canteen["publicReviewSummary"] = summary
    else:
        floor["reviewSummary"] = summary
for canteen in CATALOG["canteens"]:
    for floor in canteen["floors"]:
        sourced = next((zone for zone in floor["stalls"] if zone.get("kind") == "window"), None)
        if sourced:
            floor["auntStallId"] = sourced["id"]
CATALOG["notice"] = ("学活一、二楼与明湖一至三楼按用户提供的示意图画相对布局；学活三楼无平面图，暂不绘制未定位窗口。"
                     "明湖二楼逐菜价格来自用户提供的菜单截图修订表，仅录入103条图片可辨记录，18条菜名待核记录暂不展示；图示标价与截图标价都不是实时售价。"
                     "窗口评分只来自可追溯的逐条用户评价。")
CANTEENS = {item["id"]: item for item in CATALOG["canteens"]}
ZONES = {}
ZONE_CONTEXT = {}
DISHES = []
for canteen in CATALOG["canteens"]:
    for floor in canteen["floors"]:
        for zone in floor["stalls"]:
            zone_id = zone["id"]
            if zone_id in ZONES:
                raise ValueError("Duplicate zone id: " + zone_id)
            bounds = zone.get("rect")
            if bounds is not None:
                x, y, width, height = bounds
                if min(x, y) < 0 or min(width, height) <= 0 or x + width > floor["size"][0] or y + height > floor["size"][1]:
                    raise ValueError("Invalid rect for " + zone_id)
            ZONES[zone_id] = zone
            ZONE_CONTEXT[zone_id] = {
                "canteenId": canteen["id"], "canteen": canteen["name"],
                "level": floor["level"], "floorLabel": floor["label"]
            }
            for dish in zone.get("dishes", []):
                DISHES.append({"dish": dish, "canteen": canteen, "zone": zone, "floor": floor})
    for dish in canteen.get("menu", []):
        DISHES.append({"dish": dish, "canteen": canteen, "zone": None, "floor": None})
for lead in CURATED_FOOD["entries"]:
    source_id = "F_" + lead["id"]
    if any(source_id in entry["dish"].get("evidence", []) for entry in DISHES):
        continue
    canteen, floor = _floor(lead["canteenId"], lead.get("floorLabel"))
    if canteen is None:
        continue
    historical = ({"value": lead["priceValue"], "date": lead["priceDate"], "type": lead["priceType"]}
                  if lead.get("priceValue") is not None else None)
    DISHES.append({"dish": {"name": lead["dish"], "price": None, "historical": historical,
                            "evidence": [source_id]},
                   "canteen": canteen, "zone": None, "floor": floor})


def sources_for(ids):
    seen = set()
    result = []
    for source_id in ids:
        if source_id not in seen and source_id in CATALOG["sources"]:
            seen.add(source_id)
            result.append({"id": source_id, **CATALOG["sources"][source_id]})
    return result


def find_canteen(text):
    hits = []
    for canteen in CATALOG["canteens"]:
        for alias in [canteen["name"]] + canteen.get("aliases", []):
            if alias and alias in text:
                hits.append((len(alias), canteen))
    hits.sort(key=lambda item: item[0], reverse=True)
    return hits[0][1] if hits else None


def matched_dishes(text, canteen=None):
    result = []
    for entry in DISHES:
        if entry["dish"]["name"] in text and (canteen is None or entry["canteen"]["id"] == canteen["id"]):
            result.append(entry)
    return result


def find_zone(text, canteen=None):
    direct = []
    for zone_id, zone in ZONES.items():
        if canteen and ZONE_CONTEXT[zone_id]["canteenId"] != canteen["id"]:
            continue
        short_name = zone["name"].replace(ZONE_CONTEXT[zone_id]["canteen"], "")
        if zone["name"] in text or (canteen and len(short_name) >= 3 and short_name in text):
            direct.append((zone.get("kind") == "window", len(zone["name"]), zone_id))
    window_hits = [item for item in direct if item[0]]
    if window_hits:
        window_hits.sort(reverse=True)
        return window_hits[0][2]
    zone_ids = {entry["zone"]["id"] for entry in matched_dishes(text, canteen) if entry["zone"]}
    if len(zone_ids) == 1:
        return next(iter(zone_ids))
    if direct:
        direct.sort(reverse=True)
        return direct[0][2]
    if canteen:
        for floor in canteen["floors"]:
            labels = [floor["label"], "地下" if floor["level"] < 0 else "%s层" % floor["level"],
                      {1: "一层", 2: "二层", 3: "三层"}.get(floor["level"], "")]
            if any(label and label in text for label in labels) and len(floor["stalls"]) == 1:
                return floor["stalls"][0]["id"]
    return None


def all_dishes(canteen):
    return [entry for entry in DISHES if entry["canteen"]["id"] == canteen["id"]]


def price_text(dish):
    value = dish.get("price")
    if value is None:
        offer = dish.get("offer")
        if offer:
            return "%s 活动价 ¥%s（当期标注原价 ¥%s；当前价待核）" % (
                offer["date"], offer["promotionalPrice"], offer["originalPrice"])
        historical = dish.get("historical")
        if historical and historical.get("value") is not None:
            kind = {"historical_promotion": "活动价", "personal_promotion": "个人当次优惠价",
                    "personal_purchase": "学生当次消费价", "historical_reported_price": "历史资料价",
                    "menu_screenshot": "截图标价", "illustrated_plan": "图示标价"}.get(
                        historical["type"], "历史记录价")
            return "%s %s ¥%s（当前价待核）" % (historical["date"], kind, historical["value"])
        return "当前价格待核"
    return "资料价 ¥%s（当前价待现场确认）" % value


def review_values(text):
    negative_words = ("难吃", "太咸", "太淡", "不新鲜", "失望", "不推荐")
    positive_words = ("好吃", "真香", "美味", "不错", "很棒", "推荐", "喜欢")
    neutral_words = ("一般", "还行", "普通")
    negated_good = re.search(r"(?:不|没|不是|并不).{0,3}好吃", text)
    negative = bool(negated_good) or any(word in text for word in negative_words)
    positive_text = text.replace(negated_good.group(0), "") if negated_good else text
    positive_text = positive_text.replace("不推荐", "")
    positive = any(word in positive_text for word in positive_words)
    mixed = negative and positive
    rating = None if mixed else 2 if negative else 5 if positive else 3 if any(word in text for word in neutral_words) else None
    match = re.search(r"(?:排(?:队|了)?|等了?)\s*(\d{1,3})\s*分钟", text)
    queue = int(match.group(1)) if match else None
    if queue is not None and queue > 240:
        queue = None
    tags = []
    for tag, words in {
        "辣": ("辣", "麻"), "清淡": ("清淡", "不辣"),
        "分量": ("分量", "量大", "量少", "份量"),
        "价格": ("便宜", "贵", "价格"),
        "排队": ("排队", "等了", "排了"),
        "环境": ("环境", "座位", "拥挤", "闷")
    }.items():
        if any(word in text for word in words):
            tags.append(tag)
    return rating, queue, tags, mixed


def rating_for(connection, zone_id, tag=None):
    rows = connection.execute(
        "SELECT rating,source,created_at,tags_json FROM reviews WHERE stall_id=? AND rating IS NOT NULL",
        (zone_id,),
    ).fetchall()
    total = 0.0
    weights = 0.0
    count = 0
    latest = None
    user_count = 0
    imported_count = 0
    now = time.time()
    for row in rows:
        if tag and tag not in json.loads(row["tags_json"] or "[]"):
            continue
        age_days = max(0.0, (now - row["created_at"]) / 86400)
        weight = 0.5 ** (age_days / 90) * (0.35 if row["source"] == "imported" else 1.0)
        total += row["rating"] * weight
        weights += weight
        count += 1
        latest = max(latest or 0, row["created_at"])
        if row["source"] == "imported":
            imported_count += 1
        else:
            user_count += 1
    return {"score": round(total / weights, 2) if weights else None, "count": count,
            "userCount": user_count, "importedCount": imported_count,
            "updatedAt": datetime.fromtimestamp(latest, timezone.utc).isoformat() if latest else None}


def recent_queue(connection, zone_id):
    return connection.execute(
        "SELECT queue_minutes,created_at FROM reviews WHERE stall_id=? AND queue_minutes IS NOT NULL "
        "AND created_at>=? ORDER BY created_at DESC,id DESC LIMIT 1",
        (zone_id, time.time() - 3 * 3600),
    ).fetchone()


def _result(reply, evidence=(), changed=False, emotion="neutral", ranking=None, recommendations=None):
    return {"reply": reply, "evidence": sources_for(evidence), "ratingsChanged": changed,
            "emotion": emotion, "ranking": ranking or [], "recommendations": recommendations or []}


def _zone_name(zone_id):
    return ZONE_CONTEXT[zone_id]["canteen"] + " " + ZONE_CONTEXT[zone_id]["floorLabel"] + " " + ZONES[zone_id]["name"]


def _requested_floor(text, canteen):
    for label, words in (("1F", ("1F", "一楼", "一层", "1楼", "1层")),
                         ("2F", ("2F", "二楼", "二层", "2楼", "2层")),
                         ("3F", ("3F", "三楼", "三层", "3楼", "3层"))):
        if any(word.lower() in text.lower() for word in words):
            return label
    if canteen and canteen["id"] == "xuehuo" and "学三" in text:
        return "2F"
    return None


def _focused_floor(text, canteen, zone_id=None):
    if not canteen:
        return None
    label = _requested_floor(text, canteen)
    if not label and zone_id:
        label = ZONE_CONTEXT[zone_id]["floorLabel"]
    return next((floor for floor in canteen["floors"] if floor["label"] == label), None)


def _food_request(text):
    if any(word in text for word in ("我推荐", "不推荐", "评分", "评价", "口碑", "排队")):
        return False
    prompts = ("推荐", "吃什么", "想吃", "有啥吃", "有什么吃", "吃点啥", "哪道菜", "哪个菜")
    if any(word in text for word in prompts):
        return True
    return any(word in text for word in ("面", "粉", "米线", "饺子", "馄饨")) and any(
        word in text for word in ("有", "哪", "什么", "吃", "来碗"))


def _recommendations(text, canteen, zone_id):
    floor_label = _requested_floor(text, canteen)
    if zone_id and not floor_label:
        floor_label = ZONE_CONTEXT[zone_id]["floorLabel"]
    entries = [lead for lead in CURATED_FOOD["entries"]
               if (canteen is None or lead["canteenId"] == canteen["id"])
               and (floor_label is None or lead["floorLabel"] == floor_label)]
    exact_dishes = [lead for lead in entries if lead["dish"] not in ("面条", "拉面", "饺子")
                    and len(lead["dish"]) >= 2 and lead["dish"] in text]
    if exact_dishes:
        entries = exact_dishes
    elif any(len(entry["dish"]["name"]) >= 3 and entry["dish"]["name"] in text
             for entry in matched_dishes(text, canteen)):
        entries = []
    else:
        for term in ("饺子", "米线", "馄饨", "拉面", "粉", "面"):
            if term in text:
                entries = [lead for lead in entries if term in lead["dish"]]
                break
    if zone_id and ZONES[zone_id].get("kind") == "window":
        window = ZONES[zone_id]["name"].replace("档口", "")
        matching = [lead for lead in entries if lead["windowName"] and
                    lead["windowName"].replace("档口", "") == window]
        entries = matching
    elif zone_id and ZONES[zone_id].get("kind") == "placeholder":
        entries = []
    entries.sort(key=lambda lead: (lead["sourceDate"], lead["windowName"] is not None), reverse=True)
    chosen = []
    per_floor = {}
    for lead in entries:
        key = (lead["canteenId"], lead["floorLabel"])
        if floor_label is None and per_floor.get(key, 0) >= 2:
            continue
        chosen.append(lead)
        per_floor[key] = per_floor.get(key, 0) + 1
        if len(chosen) == 4:
            break
    return chosen


def answer(text, user_id, connection, context_zone_id=None):
    if any(word in text for word in ("图书馆", "选课", "绩点", "失物招领", "教务", "借书", "考试安排")):
        return _result("这个我没有可靠资料。食堂楼层、菜品和口碑可以问我；校园其他事务请问负责的同学。", emotion="thinking")
    canteen = find_canteen(text)
    zone_id = find_zone(text, canteen)
    if context_zone_id in ZONES:
        zone_id = context_zone_id
        canteen = CANTEENS[ZONE_CONTEXT[zone_id]["canteenId"]]
    # [QODER-FIX #24] 甜品/蛋糕问题不再一句“没有资料”拒答：
    # 按示意图（P5）上能看到的陈列品类回答，并说明没有品种/售价记录。
    # 只在没指定食堂、或指定学活一楼/甜品窗口时接管；问其他食堂的蛋糕仍走通用流程。
    if (any(word in text for word in ("蛋糕", "甜品", "烘焙", "面包", "三明治"))
            and zone_id in (None, "xh-1-dessert")
            and (canteen is None or canteen["id"] == "xuehuo")):
        dessert = ZONES.get("xh-1-dessert")
        if dessert is not None:
            names = "、".join(dish["name"] for dish in dessert.get("dishes", []))
            return _result(
                "学活一楼的“甜品文创”窗口，示意图上能看到" + (names or "烘焙类陈列") +
                "；但图上没有标具体品种、是否在售和价格，我不能替它报价。想吃哪一类，可以到窗口确认当天菜单。",
                ["P5"], emotion="thinking")
    dishes = matched_dishes(text, canteen)
    question = any(word in text for word in ("？", "?", "吗", "多少", "什么", "哪个", "哪家", "有没有", "几点", "在哪", "怎么样", "推荐不"))
    if "推荐" in text and "我推荐" not in text and "不推荐" not in text:
        question = True
    if _food_request(text):
        question = True
    rating, queue, tags, mixed = review_values(text)

    if not question and (rating is not None or queue is not None or tags):
        if not zone_id:
            return _result("孩子，这条我想记准一些。请带上餐厅和楼层或分区名，例如“学四二层风味餐厅的麻辣香锅好吃”。现在还没有核实到每个具体窗口。", emotion="thinking")
        if ZONES[zone_id].get("kind") == "placeholder":
            return _result("这个只是示意档口位，还不知道真实牌名，不能把评价记到它名下。请告诉我具体窗口名，或先描述已核的餐厅分区。", emotion="thinking")
        if mixed and queue is None:
            return _result("这句有褒有贬，我先不替你打分。你觉得整体是好吃、一般，还是不好吃？带上分区名再告诉我。", emotion="thinking")
        connection.execute(
            "INSERT INTO reviews(user_id,stall_id,rating,queue_minutes,content,source,created_at,tags_json) "
            "VALUES(?,?,?,?,?,'user',?,?)",
            (user_id, zone_id, rating, queue, text, time.time(), json.dumps(tags, ensure_ascii=False)),
        )
        detail = []
        if rating is not None:
            detail.append("口味评价")
        if queue is not None:
            detail.append("排队约 %d 分钟" % queue)
        if tags:
            detail.append("标签：" + "、".join(tags))
        return _result("孩子，记下了 %s 的%s。这个分区的口碑会随新评价更新。" % (_zone_name(zone_id), "，".join(detail)), changed=True, emotion="happy")

    if any(word in text for word in ("我上次", "我以前", "我说过", "我的评价")):
        rows = connection.execute("SELECT content FROM reviews WHERE user_id=? ORDER BY id DESC LIMIT 3", (user_id,)).fetchall()
        if not rows:
            return _result("你还没跟我说过具体分区的用餐评价。说清食堂和分区，我就能记住。")
        return _result("你最近说过：\n" + "\n".join("· " + row["content"] for row in rows))

    if any(word in text for word in ("排队", "等多久", "人多")):
        if not zone_id:
            return _result("你问哪个餐厅的哪层或哪个分区？我只能用最近三小时的反馈回答，不能拿旧评论猜现在的队伍。", emotion="thinking")
        row = recent_queue(connection, zone_id)
        if row is None:
            return _result(_zone_name(zone_id) + "最近三小时没有可核实的排队反馈，我不知道现在等多久。", emotion="thinking")
        return _result("最近一条反馈说，%s 排队约 %d 分钟。队伍会变，出发前再留意现场。" % (_zone_name(zone_id), row["queue_minutes"]))

    price_question = any(word in text for word in ("多少钱", "价格", "贵不贵", "几块", "售价"))
    if price_question:
        if zone_id and ZONES[zone_id].get("kind") == "window" and dishes:
            dishes = [entry for entry in dishes if entry["zone"] and entry["zone"]["id"] == zone_id]
            if not dishes:
                return _result(_zone_name(zone_id) + "的已收录菜单没有这道菜的可靠价格，不能按其他档口的价格回答。", emotion="thinking")
        if dishes:
            lines = []
            evidence = []
            for entry in dishes[:8]:
                dish = entry["dish"]
                place = entry["canteen"]["name"] + (" " + entry["floor"]["label"] if entry["floor"] else "")
                lines.append("· %s %s：%s%s" % (place, dish["name"], price_text(dish),
                             "；" + dish["priceNote"] if dish.get("priceNote") else ""))
                evidence.extend(dish.get("evidence", ["R"]))
            return _result("现有资料记录：\n" + "\n".join(lines) + "\n各价格均非现场实时价。", evidence)
        if canteen:
            return _result(canteen["name"] + "的资料只覆盖部分菜品，没有完整的当前价目表。说一道菜名，我查已核到的资料；没有来源的价格我不报。", ["R"])
        return _result("说一下食堂和菜名，我查已有来源的历史价格。当前价格仍要以现场为准。", emotion="thinking")

    if any(word in text for word in ("几点", "营业", "开门", "关门", "什么时候")):
        if zone_id:
            hours = ZONES[zone_id].get("hours", [])
            if not hours:
                floor = _focused_floor(text, canteen, zone_id)
                if floor and floor.get("historicalHours"):
                    historic = floor["historicalHours"]
                    lines = ["· %s 年资料：%s" % (row["date"][:4], row["text"]) for row in historic[:3]]
                    evidence = [source for row in historic[:3] for source in row["evidence"]]
                    return _result(_zone_name(zone_id) + "没有可核实的单独营业时间；同层旧资料记录：\n" +
                                   "\n".join(lines) + "\n这是整层历史时段，当前营业以现场公告为准。", evidence,
                                   emotion="thinking")
                return _result(_zone_name(zone_id) + "还没有可核实的单独营业时间，请以现场公告为准。", emotion="thinking")
            lines = ["· " + row["text"] for row in hours]
            evidence = [source for row in hours for source in row.get("evidence", ["R"])]
            return _result("%s 的资料时段：\n%s\n若口径冲突或临时调整，以现场公告为准。" % (_zone_name(zone_id), "\n".join(lines)), evidence)
        if canteen:
            lines = []
            evidence = []
            focused = _focused_floor(text, canteen)
            for floor in [focused] if focused else canteen["floors"]:
                for zone in floor["stalls"]:
                    for row in zone.get("hours", []):
                        lines.append("· %s %s：%s" % (floor["label"], zone["name"], row["text"]))
                        evidence.extend(row.get("evidence", ["R"]))
                for row in floor.get("historicalHours", []):
                    periods = row["text"].split("、")
                    same_line = next((index for index, line in enumerate(lines)
                                      if all(period in line.replace("–", "-") for period in periods)), None)
                    if same_line is not None:
                        lines[same_line] += "（%s 年资料，现时待核）" % row["date"][:4]
                        evidence.extend(row["evidence"])
                    else:
                        lines.append("· %s：%s 年资料时段 %s" % (floor["label"], row["date"][:4], row["text"]))
                        evidence.extend(row["evidence"])
            if not focused:
                for row in canteen.get("historicalHours", []):
                    lines.append("· %s 年资料时段 %s" % (row["date"][:4], row["text"]))
                    evidence.extend(row["evidence"])
            if lines:
                return _result(canteen["name"] + "的资料时段：\n" + "\n".join(lines[:14]) +
                               "\n旧时段不代表今天营业，以现场公告为准。", evidence)
            return _result(canteen["name"] + "暂无可核实的营业时段，请以现场公告为准。", emotion="thinking")
        return _result("你想问哪个食堂或分区的营业时间？", emotion="thinking")

    if any(word in text for word in ("哪儿", "在哪", "怎么走", "位置")):
        if zone_id:
            place = canteen["location"] if canteen else CANTEENS[ZONE_CONTEXT[zone_id]["canteenId"]]["location"]
            zone = ZONES[zone_id]
            if zone.get("rect") and zone.get("locationEvidence"):
                return _result("%s位于%s；室内示意图能看相对方位，但格坐标和窗口尺寸尚未现场测量。" %
                               (_zone_name(zone_id), place), zone["locationEvidence"])
            return _result("%s位于%s；具体档口坐标尚无可核验的室内平面图。校园路线可以问向导。" %
                           (_zone_name(zone_id), place), ["R"])
        if canteen:
            return _result(canteen["name"] + "在" + canteen["location"] + "。我只管食堂内的菜与口碑；校园路线交给向导。", ["R"])

    if _food_request(text):
        food_zone_id = zone_id if zone_id and (
            context_zone_id in ZONES or ZONES[zone_id]["name"] in text) else None
        recommendations = _recommendations(text, canteen, food_zone_id)
        if recommendations:
            evidence = ["F_" + lead["id"] for lead in recommendations]
            floor_focus = _requested_floor(text, canteen)
            focus = (canteen["name"] if canteen else "食堂") + (" " + floor_focus if floor_focus else "")
            focused = _focused_floor(text, canteen, zone_id)
            floor_note = focused.get("reviewSummary") if focused else None
            intro = (("同层个人评价摘要：" + floor_note["summary"] + "这不是档口评分；")
                     if floor_note and any(word in text for word in ("好吃", "最好", "哪个好"))
                     else "")
            dish_names = list(dict.fromkeys(item["dish"] for item in recommendations))
            dishes = "、".join(dish_names[:3]) + ("等" if len(dish_names) > 3 else "")
            reply = ("孩子，" + intro + focus + " 有" + dishes + "的记录。"
                     "历史价格和菜单仅反映发布时的信息，现售待核。")
            return _result(reply, evidence, emotion="thinking", recommendations=recommendations)
        return _result("孩子，这个楼层或这类菜目前没有能明确归属的来源记录，我不能凭空推荐。换个楼层或菜品再问问我。", emotion="thinking")

    if any(word in text for word in ("好吃", "推荐", "哪家强", "最好", "排行榜", "吃什么", "评价", "口碑", "怎么样")):
        if zone_id:
            score = rating_for(connection, zone_id)
            if score["score"] is None:
                reviews = ZONES[zone_id].get("publicReviews", [])
                if reviews:
                    examples = "；".join(item["excerpt"].replace("\n", " ")[:100] for item in reviews[:2])
                    evidence = [source for item in reviews[:2] for source in item["evidence"]]
                    return _result(_zone_name(zone_id) + "暂无可计算评分。找到 %d 条可归到该窗口的个人体验：%s。个体看法仅供参考。" %
                                   (len(reviews), examples), evidence, emotion="thinking")
                return _result(_zone_name(zone_id) + "还没有可计算的逐条用户评分。现有调研摘要不能当成这个分区的星级。", ["R"], emotion="thinking")
            return _result("%s目前是 %.1f 分，来自 %d 条逐条评价；旧评价会逐渐降低权重。" % (_zone_name(zone_id), score["score"], score["count"]))
        candidates = []
        requested_tag = next((tag for tag in ("辣", "清淡", "分量", "价格", "环境") if tag in text), None)
        dish_filter = next((entry["dish"]["name"] for entry in matched_dishes(text, canteen)), None)
        for candidate_id in ZONES:
            if canteen and ZONE_CONTEXT[candidate_id]["canteenId"] != canteen["id"]:
                continue
            if dish_filter and not any(dish["name"] == dish_filter for dish in ZONES[candidate_id].get("dishes", [])):
                continue
            score = rating_for(connection, candidate_id, requested_tag)
            if score["score"] is not None:
                candidates.append({"id": candidate_id, "name": _zone_name(candidate_id), **score})
        candidates.sort(key=lambda item: (item["score"], item["count"]), reverse=True)
        if candidates:
            lines = ["%d. %s · %.1f 分（%d 条）" % (index + 1, item["name"], item["score"], item["count"])
                     for index, item in enumerate(candidates[:3])]
            return _result("我跟你说，按%s已有的逐条评价看：\n%s\n样本少时先当参考。" % ("“" + requested_tag + "”标签下" if requested_tag else "", "\n".join(lines)), ranking=candidates[:3], emotion="happy")
        focused = _focused_floor(text, canteen, zone_id)
        if focused and focused.get("reviewSummary"):
            note = focused["reviewSummary"]
            return _result(canteen["name"] + " " + focused["label"] + "的个人评价摘要：" + note["summary"] +
                           "这些不是档口评分。", note["evidence"], emotion="thinking")
        if canteen and canteen.get("publicReviewSummary"):
            note = canteen["publicReviewSummary"]
            return _result(canteen["name"] + "的个人评价摘要：" + note["summary"] +
                           "这些不是档口评分。", note["evidence"], emotion="thinking")
        if canteen:
            notes = [(floor["label"], floor["reviewSummary"]) for floor in canteen["floors"]
                     if floor.get("reviewSummary")]
            if notes:
                evidence = [source for _, note in notes for source in note["evidence"]]
                brief = "；".join(label + "：" + note["summary"] for label, note in notes[:3])
                return _result(canteen["name"] + "的个人评价摘要：" + brief + "。样本不能当作档口评分。",
                               evidence, emotion="thinking")
        if canteen and canteen.get("reviewSummary"):
            note = canteen["reviewSummary"][0]
            return _result("目前没有足够的逐条评价给 %s 排名。调研摘要只说：%s这不是档口评分。" % (canteen["name"], note["text"]), note.get("evidence", ["R"]), emotion="thinking")
        return _result("目前没有足够的逐条评价可以排行。调研材料中的平台累计评价数没有正文，不能拿来算分。", ["R"], emotion="thinking")

    if canteen or any(word in text for word in ("食堂", "窗口", "菜单", "有什么吃", "卖什么")):
        if not canteen:
            return _result("目前收录学活、明湖、学四、留园、东区、学苑和益民。你想查哪一个？", ["R"])
        floor_lines = ["· %s：%s" % (floor["label"], floor["summary"]) for floor in canteen["floors"]]
        if zone_id:
            zone = ZONES[zone_id]
            dish_names = "、".join(dish["name"] for dish in zone.get("dishes", []))
            evidence = [source for dish in zone.get("dishes", []) for source in dish.get("evidence", [])]
            return _result("%s：%s。%s" % (_zone_name(zone_id), zone["summary"], "资料列出的菜品有" + dish_names + "。" if dish_names else "还没有可核的分区菜单。"), evidence or ["R"])
        menu_names = "、".join(entry["dish"]["name"] for entry in all_dishes(canteen)[:14])
        evidence = [source for entry in all_dishes(canteen)[:14] for source in entry["dish"].get("evidence", [])]
        return _result(canteen["name"] + "已核到的楼层功能：\n" + "\n".join(floor_lines) + ("\n资料中出现的菜品：" + menu_names + "。" if menu_names else "") + "\n这是不完整菜单，具体档口位置尚未核验。", ["R", *evidence])

    if any(word in text for word in ("你好", "您好", "嗨", "在吗")):
        return _result("孩子，想吃点什么？你可以问食堂楼层、菜品、资料价格和口碑，或者告诉我某个分区的真实体验。", emotion="happy")
    return _result("这个我没有可靠资料。食堂楼层、菜品和口碑可以问我；选课、图书馆规则、失物招领等事要问负责的同学。", emotion="thinking")
