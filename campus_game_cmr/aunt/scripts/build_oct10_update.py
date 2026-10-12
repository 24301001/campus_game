"""Build source-linked floor and menu data from the user supplied 2026-10-10 files."""

from pathlib import Path
from docx import Document
import json

ROOT = Path(__file__).parents[1]
SOURCE = ROOT / "static" / "plan-sources" / "minghu-2f-menu-source.docx"
OUT = ROOT / "data" / "oct10_updates.json"


def window(id, name, rect, front="south", summary="依据用户提供的楼层示意图标注；实际营业及档口边界以现场为准。"):
    return {"id": id, "name": name, "kind": "window", "rect": rect, "front": front,
            "summary": summary, "hours": [], "dishes": [], "evidence": []}


xh1 = [
    window("xh-1-shop", "商店", [1, 1, 2, 8], "east"),
    window("xh-1-staples", "主食窗口", [4, 1, 3, 8]),
    window("xh-1-home-1", "家常菜（一）", [7, 1, 3, 8]),
    window("xh-1-home-2", "家常菜（二）", [10, 1, 3, 8]),
    window("xh-1-jiangxi", "江西小炒", [13, 1, 4, 8]),
    window("xh-1-zhiwei", "知味拌饭", [17, 1, 3, 8]),
    window("xh-1-small", "小份菜", [20, 1, 3, 8]),
    window("xh-1-rice-noodles", "风味米线", [23, 1, 4, 8]),
    window("xh-1-northwest", "西北面食", [27, 1, 4, 8]),
    window("xh-1-dessert", "甜品文创", [1, 14, 5, 4], "east"),
]
for item in xh1:
    item["evidence"] = ["P5"]

mh2 = [
    window("mh-2-roast-rice", "烧腊·肠粉·砂锅饭", [1, 1, 3, 6]),
    window("mh-2-spicy", "麻辣香锅·麻辣烫", [4, 1, 3, 6]),
    window("mh-2-cantonese", "明湖广式煲仔饭", [7, 1, 3, 6]),
    window("mh-2-furnace", "炉初原·炙烤五花肉", [10, 1, 2, 6]),
    window("mh-2-roast-duck", "烤鸭米粉·烧腊", [12, 1, 3, 6]),
    window("mh-2-fenmi-chicken", "分米鸡·土豆泥拌饭", [15, 1, 2, 6]),
    window("mh-2-yunnan-mushroom", "云南菌菇炒饭·烤鱼", [17, 1, 3, 6]),
    window("mh-2-hand-powder", "一掌鲜手拍粉", [20, 1, 2, 6]),
    window("mh-2-egg-rice", "蛋浇肥牛饭·牛油拌饭", [22, 1, 3, 6]),
    window("mh-2-northwest-flavor", "西北风味·拉面刀削面", [25, 1, 3, 6]),
    window("mh-2-cotti", "Cotti Coffee 咖啡饮品", [28, 1, 3, 6], "west"),
    window("mh-2-self-service", "自选快餐", [21, 14, 10, 3], "north"),
    window("mh-2-yunnan-noodles", "云南米线", None,
           summary="逐菜价格表收录了此菜单，但新平面图未标出独立位置，暂列为待定位窗口。"),
    window("mh-2-hot-braised", "热卤拌饭", None,
           summary="补充文档列入已有窗口清单，但本张平面图未标出位置。"),
]
for item in mh2:
    item["evidence"] = ["P6", "M2DOC"]


def dishes_from_plan(items):
    return [{"name": name, "price": None,
             "historical": {"value": price, "date": "示意图", "type": "illustrated_plan"},
             "evidence": ["P5"]} for name, price in items]


# Only clearly legible dish/price pairs from the supplied PPT are entered.
xh1_menus = {
    "xh-1-staples": [("馒头", .4), ("白花卷", .5), ("开花馒头", 2.5), ("蒸奶包", 2),
                       ("肉包", 2), ("红豆馒头", 1.5), ("红糖发糕", 1), ("玉米窝窝", 2),
                       ("豆沙饼", 1.5), ("麻酱烧饼", 1.5), ("牛舌饼", 4), ("大饼", 1)],
    "xh-1-home-1": [("清炒圆白菜", 1), ("清炒快菜", 3), ("香辣鸡翅根", 3),
                      ("红烧狮子头", 3), ("剁椒娃娃菜", 4), ("豆皮炒肉", 6),
                      ("黄豆芽肉沫粉条", 6), ("红豆肉丝", 6), ("干炸鸡米花", 7)],
    "xh-1-home-2": [("炒豆芽", 1), ("清炒小白菜", 3), ("红烧豆腐", 3),
                      ("芹菜腐竹", 4), ("红烧香菇腿", 4), ("豆腐丝炒肉", 6),
                      ("蒜薹炒肉", 6), ("魔芋丝烧鸭", 8), ("香辣片片肠", 7),
                      ("锅包肉", 8), ("番茄龙利鱼", 8)],
    "xh-1-jiangxi": [("菜椒菇炒肉", 12), ("外婆菜炒鸡蛋", 12), ("江西小炒笋", 13),
                       ("酸香小炒鱼", 14), ("辣香翅根", 12), ("酸辣鸡杂", 14),
                       ("鲜香豆炒牛肉", 16)],
    "xh-1-zhiwei": [("咖喱鸡腿拌饭", 10), ("蜜汁照烧鸡拌饭", 10), ("孜然鱿丁拌饭", 12),
                      ("香酥鸡排拌饭", 12), ("香菇小炒肉拌饭", 12),
                      ("火腿肉丝鸡蛋拌饭", 12), ("把子肉拌饭", 14),
                      ("番茄鸡蛋牛肉拌饭", 14)],
    "xh-1-small": [("清炒快菜", 2), ("清炒小白菜", 2), ("木须西葫", 3),
                     ("番茄炒鸡蛋", 3), ("红烧豆腐", 2), ("糖醋里脊", 4),
                     ("锅包肉", 4), ("茄汁鸡柳", 4), ("孜然鸡块", 4), ("日式丸子", 4)],
    "xh-1-rice-noodles": [("面片", 9), ("米线", 10), ("土豆粉", 10),
                            ("鸡米线·土豆粉", 12), ("牛肉米线·土豆粉", 16),
                            ("香菇丸子米线·土豆粉", 14)],
    "xh-1-northwest": [("拉面", 9), ("拉条子", 10), ("烩面片", 9), ("油泼面", 8),
                        ("炸酱面", 9), ("葱油拌面", 8), ("回锅肉拌面", 10),
                        ("麻辣肉沫拌面", 8)],
}
for item in xh1:
    item["dishes"] = dishes_from_plan(xh1_menus.get(item["id"], []))

doc = Document(SOURCE)
table_to_zone = ["mh-2-northwest-flavor", "mh-2-hand-powder", "mh-2-yunnan-noodles",
                 "mh-2-roast-duck", "mh-2-fenmi-chicken", "mh-2-yunnan-mushroom",
                 "mh-2-yunnan-mushroom", "mh-2-egg-rice", "mh-2-furnace"]
menus = {item["id"]: [] for item in mh2}
held = 0
for index, table in enumerate(doc.tables):
    zone_id = table_to_zone[index]
    for row in table.rows[1:]:
        cells = [cell.text.strip() for cell in row.cells]
        if len(cells) < 4 or not cells[0] or not cells[1]:
            continue
        if cells[3] != "图片可辨":
            held += 1
            continue
        try:
            price = float(cells[1].replace("元", ""))
        except ValueError:
            continue
        menus[zone_id].append({"name": cells[0], "price": None,
                               "historical": {"value": price, "date": "菜单截图", "type": "menu_screenshot"},
                               "priceNote": "每" + cells[2] + " · 非实时售价",
                               "evidence": ["M2DOC"]})
for item in mh2:
    item["dishes"] = menus[item["id"]]

data = {
    "sources": {
        "P5": {"title": "演示文稿2.pptx · 学活一楼大概平面图（含示意标价）",
               "url": "/static/plan-sources/xuehuo-1f-source.png"},
        "P6": {"title": "明湖餐厅二楼（商铺名称版）平面示意图",
               "url": "/static/plan-sources/minghu-2f-revised.png"},
        "M2DOC": {"title": "明湖餐厅二楼 · 各档口逐菜价格与方向修订",
                  "url": "/static/plan-sources/minghu-2f-menu-source.docx"},
    },
    "plans": [
        {"canteenId": "xuehuo", "floorLabel": "1F", "status": "approximate", "sourceId": "P5",
         "illustration": "/static/plan-sources/xuehuo-1f-illustrated.png",
         "entrance": [15, 19], "north": "up", "windows": xh1,
         "fixtures": [
             {"kind": "column", "rect": [5, 9, 1, 2], "solid": True},
             {"kind": "column", "rect": [18, 9, 1, 2], "solid": True},
             {"kind": "green_divider", "rect": [9, 15, 8, 1], "solid": True},
             {"kind": "green_divider", "rect": [20, 15, 8, 1], "solid": True},
         ]},
        {"canteenId": "minghu", "floorLabel": "2F", "status": "approximate", "sourceId": "P6",
         "illustration": "/static/plan-sources/minghu-2f-revised.png",
         "entrance": [16, 19], "north": "up", "windows": mh2,
         "fixtures": [
             {"kind": "column", "rect": [4, 8, 1, 2], "solid": True},
             {"kind": "column", "rect": [15, 8, 1, 2], "solid": True},
             {"kind": "column", "rect": [25, 8, 1, 2], "solid": True},
         ]},
    ],
    "heldMenuRows": held,
}
OUT.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print("Wrote", OUT, "verified Minghu rows", sum(len(items) for items in menus.values()), "held", held)
