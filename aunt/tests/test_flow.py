import tempfile
import unittest
from pathlib import Path

from fastapi.testclient import TestClient

from aunt import knowledge, server
from aunt.import_reviews import import_rows


class AuntFlowTest(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.old_path = server.DB_PATH
        server.DB_PATH = Path(self.temporary.name) / "test.sqlite3"
        self.client = TestClient(server.app)
        self.client.__enter__()

    def tearDown(self):
        self.client.__exit__(None, None, None)
        server.DB_PATH = self.old_path
        self.temporary.cleanup()

    def register(self, username):
        response = self.client.post("/api/register", json={"username": username, "password": "12345678"})
        self.assertEqual(response.status_code, 200, response.text)

    def test_catalog_keeps_approximate_plans_and_unrated_windows(self):
        self.register("资料测试")
        catalog = self.client.get("/api/canteens").json()
        self.assertEqual(len(catalog["canteens"]), 7)
        self.assertTrue(all(c["floorplanStatus"] == "unverified" for c in catalog["canteens"]))
        xuehuo = next(c for c in catalog["canteens"] if c["id"] == "xuehuo")
        xuehuo_1f = next(f for f in xuehuo["floors"] if f["label"] == "1F")
        xuehuo_2f = next(f for f in xuehuo["floors"] if f["label"] == "2F")
        xuehuo_3f = next(f for f in xuehuo["floors"] if f["label"] == "3F")
        minghu = next(c for c in catalog["canteens"] if c["id"] == "minghu")
        minghu_1f = next(f for f in minghu["floors"] if f["label"] == "1F")

        self.assertEqual(xuehuo_1f["plan"]["sourceId"], "P5")
        self.assertEqual(len([z for z in xuehuo_1f["stalls"] if z.get("rect")]), 10)
        self.assertIn("illustration", xuehuo_1f["plan"])

        self.assertEqual(xuehuo_2f["plan"]["status"], "approximate")
        self.assertEqual(xuehuo_2f["plan"]["sourceId"], "P1")
        self.assertEqual(xuehuo_2f["plan"]["north"], "up")
        positioned_2f = [z for z in xuehuo_2f["stalls"] if z["rect"] is not None]
        self.assertEqual(len(positioned_2f), 10)
        self.assertEqual(len([z for z in positioned_2f if z["name"] == "广式味道"]), 1)
        self.assertEqual(next(z for z in positioned_2f if z["id"] == "xh-2-sichuan")["rect"], [13, 1, 4, 3])

        self.assertEqual(minghu_1f["plan"]["status"], "approximate")
        self.assertEqual(minghu_1f["plan"]["sourceId"], "P2")
        self.assertIsNone(minghu_1f["plan"]["north"])
        positioned_1f = [z for z in minghu_1f["stalls"] if z["rect"] is not None]
        self.assertEqual(len(positioned_1f), 7)
        self.assertEqual(len([z for z in positioned_1f if z["kind"] == "placeholder"]), 6)
        self.assertEqual(next(z for z in positioned_1f if z["id"] == "mh-1-self-service")["name"], "自选菜台")

        self.assertNotIn("plan", xuehuo_3f)
        self.assertFalse(any(z.get("rect") for z in xuehuo_3f["stalls"]))
        for label, source_id, count in (("2F", "P6", 12), ("3F", "P4", 14)):
            floor = next(f for f in minghu["floors"] if f["label"] == label)
            self.assertEqual(floor["plan"]["sourceId"], source_id)
            self.assertEqual(len([z for z in floor["stalls"] if z.get("rect")]), count)
        minghu_2f = next(f for f in minghu["floors"] if f["label"] == "2F")
        pictured_menu = [dish for stall in minghu_2f["stalls"] for dish in stall["dishes"]
                         if "M2DOC" in dish.get("evidence", [])]
        self.assertEqual(len(pictured_menu), 103)
        ratings = self.client.get("/api/ratings").json()
        self.assertTrue(all(entry["score"] is None for entry in ratings.values()))
        self.assertFalse(any(item["planVerified"] for item in self.client.get("/api/map-layer").json()))

    def test_accounts_conversations_and_public_reviews(self):
        self.register("小明")
        first = self.client.post("/api/conversations").json()["id"]
        second = self.client.post("/api/conversations").json()["id"]
        feedback = self.client.post("/api/chat", json={"conversation_id": first, "message": "学四风味餐厅的麻辣香锅好吃，刚排了20分钟"})
        self.assertEqual(feedback.status_code, 200, feedback.text)
        self.assertTrue(feedback.json()["ratingsChanged"])
        self.assertEqual(self.client.get("/api/ratings").json()["xs-2-flavor"]["score"], 5)
        self.assertEqual(len(self.client.get(f"/api/conversations/{first}/messages").json()), 2)
        self.assertEqual(self.client.get(f"/api/conversations/{second}/messages").json(), [])
        queue = self.client.post("/api/chat", json={"conversation_id": second, "message": "学四风味餐厅现在排队吗？"})
        self.assertIn("20 分钟", queue.json()["reply"])
        self.client.post("/api/logout")
        self.register("小红")
        self.assertEqual(self.client.get(f"/api/conversations/{first}/messages").status_code, 404)
        self.assertEqual(self.client.get("/api/conversations").json(), [])
        self.assertEqual(self.client.get("/api/ratings").json()["xs-2-flavor"]["score"], 5)
        self.assertEqual(len(self.client.get("/api/stalls/xs-2-flavor").json()["reviews"]), 1)

    def test_uncertain_facts_are_labeled(self):
        self.register("核验者")
        price = self.client.post("/api/chat", json={"message": "明湖烤鸭多少钱？"}).json()
        self.assertIn("当前价格待核", price["reply"])
        self.assertTrue(price["evidence"])
        hours = self.client.post("/api/chat", json={"message": "学四学生四餐厅几点关门？"}).json()
        self.assertIn("冲突", hours["reply"])
        unknown = self.client.post("/api/chat", json={"message": "图书馆几点开？"}).json()["reply"]
        self.assertIn("没有可靠资料", unknown)
        queue = self.client.post("/api/chat", json={"message": "学四风味餐厅排队吗？"}).json()["reply"]
        self.assertIn("没有可核实的排队反馈", queue)

    def test_sourced_window_offer_is_historical(self):
        self.register("档口测试")
        catalog = self.client.get("/api/canteens").json()
        floor = next(f for c in catalog["canteens"] if c["id"] == "xuesi" for f in c["floors"] if f["label"] == "2F")
        window = next(s for s in floor["stalls"] if s["id"] == "xs-2-set")
        self.assertIsNone(window["rect"])
        self.assertEqual(window["dishes"][0]["offer"]["date"], "2026-07-09")
        price = self.client.post("/api/chat", json={"message": "学四套餐档口麻辣鸡排饭多少钱？"}).json()
        self.assertIn("2026-07-09 活动价 ¥8.28", price["reply"])
        self.assertIn("当前价待核", price["reply"])
        self.assertTrue(any(source["id"] == "W1" for source in price["evidence"]))
        menu = self.client.post("/api/chat", json={"message": "学四套餐档口卖什么？"}).json()
        self.assertIn("麻辣鸡排饭", menu["reply"])
        self.assertTrue(any(source["id"] == "W1" for source in menu["evidence"]))
        hours = self.client.post("/api/chat", json={"message": "学四套餐档口几点开？"}).json()
        self.assertIn("没有可核实的单独营业时间", hours["reply"])

    def test_added_materials_are_visible_without_invented_scores(self):
        self.register("补充资料")
        catalog = self.client.get("/api/canteens").json()
        xuehuo = next(c for c in catalog["canteens"] if c["id"] == "xuehuo")
        second = next(f for f in xuehuo["floors"] if f["label"] == "2F")
        self.assertGreaterEqual(len(second["publicReviews"]), 10)
        self.assertEqual(second["reviewSummary"]["numericRating"], None)
        self.assertGreaterEqual(second["reviewSummary"]["count"], 5)
        review = self.client.post("/api/chat", json={"message": "学活二楼口碑怎么样？"}).json()["reply"]
        self.assertIn("价格、份量和等餐时间", review)
        self.assertIn("不是档口评分", review)
        price = self.client.post("/api/chat", json={"message": "学活二楼螺蛳粉多少钱？"}).json()["reply"]
        self.assertIn("2026-09-19 学生当次消费价 ¥15", price)
        self.assertIn("当前价待核", price)
        hours = self.client.post("/api/chat", json={"message": "学活三楼几点关门？"}).json()["reply"]
        self.assertIn("2023 年资料", hours)
        self.assertIn("现场公告", hours)
        self.assertIsNone(self.client.get("/api/ratings").json()["xh-2-sichuan"]["score"])

    def test_imported_reviews_are_idempotent_and_lower_weight(self):
        rows = [{"stall_id": "xs-2-flavor", "rating": 1, "queue_minutes": None,
                 "content": "已清洗的旧评价", "published_at": "2026-09-20T12:00:00+08:00",
                 "source_ref": "https://example.edu/public/1", "tags": ["辣"]}]
        self.assertEqual(import_rows(rows), 1)
        self.assertEqual(import_rows(rows), 0)
        self.register("权重测试")
        self.client.post("/api/chat", json={"message": "学四风味餐厅的麻辣香锅好吃"})
        score = self.client.get("/api/ratings").json()["xs-2-flavor"]["score"]
        self.assertGreater(score, 3.5)
        self.assertLess(score, 5)


if __name__ == "__main__":
    unittest.main()
