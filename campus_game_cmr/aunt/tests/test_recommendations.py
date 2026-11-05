import tempfile
import unittest
import sqlite3
from pathlib import Path

from fastapi.testclient import TestClient

from aunt import server


class RecommendationFlowTest(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.old_path = server.DB_PATH
        server.DB_PATH = Path(self.temporary.name) / "recommendations.sqlite3"
        self.client = TestClient(server.app)
        self.client.__enter__()
        response = self.client.post("/api/register", json={"username": "面食同学", "password": "12345678"})
        self.assertEqual(response.status_code, 200, response.text)

    def tearDown(self):
        self.client.__exit__(None, None, None)
        server.DB_PATH = self.old_path
        self.temporary.cleanup()

    def test_grounded_noodle_cards_survive_history_reload(self):
        conversation_id = self.client.post("/api/conversations").json()["id"]
        response = self.client.post("/api/chat", json={
            "conversation_id": conversation_id, "message": "学活二楼有什么面？"
        })
        self.assertEqual(response.status_code, 200, response.text)
        result = response.json()
        dishes = {item["dish"] for item in result["recommendations"]}
        self.assertTrue({"炸酱面", "瑜香小面", "生椒牛肉面"}.issubset(dishes))
        self.assertTrue(all(item["canteenId"] == "xuehuo" and item["floorLabel"] == "2F"
                            for item in result["recommendations"]))
        self.assertTrue(all(item["sourceUrl"].startswith("https://") for item in result["recommendations"]))
        self.assertFalse(any("score" in item or "rating" in item for item in result["recommendations"]))
        self.assertIn("历史价格和菜单", result["reply"])

        messages = self.client.get(f"/api/conversations/{conversation_id}/messages").json()
        self.assertEqual(messages[1]["recommendations"], result["recommendations"])
        self.assertEqual(self.client.get("/api/history").json()[1]["recommendations"], result["recommendations"])
        general = self.client.post("/api/chat", json={"message": "推荐面条"}).json()
        self.assertIn("炸酱面", {item["dish"] for item in general["recommendations"]})

    def test_uncovered_floor_does_not_invent_recommendations(self):
        response = self.client.post("/api/chat", json={"message": "学活一楼推荐什么面？"})
        self.assertEqual(response.status_code, 200, response.text)
        self.assertEqual(response.json()["recommendations"], [])
        self.assertIn("没有能明确归属的来源记录", response.json()["reply"])
        uncovered_dish = self.client.post("/api/chat", json={"message": "学活二楼麻辣烫推荐吗？"}).json()
        self.assertEqual(uncovered_dish["recommendations"], [])

    def test_existing_message_table_gains_recommendation_column(self):
        legacy_path = Path(self.temporary.name) / "legacy.sqlite3"
        connection = sqlite3.connect(legacy_path)
        try:
            connection.execute(
                "CREATE TABLE messages (id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL, "
                "conversation_id INTEGER, role TEXT NOT NULL, content TEXT NOT NULL, "
                "evidence_json TEXT NOT NULL DEFAULT '[]', ranking_json TEXT NOT NULL DEFAULT '[]', "
                "created_at REAL NOT NULL)"
            )
            connection.commit()
        finally:
            connection.close()
        active_path = server.DB_PATH
        try:
            server.DB_PATH = legacy_path
            server.init_db()
            connection = sqlite3.connect(legacy_path)
            try:
                columns = {row[1] for row in connection.execute("PRAGMA table_info(messages)")}
            finally:
                connection.close()
            self.assertIn("recommendations_json", columns)
        finally:
            server.DB_PATH = active_path

    def test_selected_window_context_answers_nearby_aunt(self):
        response = self.client.post("/api/chat", json={
            "message": "这里营业到几点？", "context_stall_id": "xh-2-sichuan"
        })
        self.assertEqual(response.status_code, 200, response.text)
        self.assertIn("学活 2F 四川味道", response.json()["reply"])
        self.assertIn("现场公告", response.json()["reply"])
        invalid = self.client.post("/api/chat", json={
            "message": "这里营业到几点？", "context_stall_id": "missing-window"
        })
        self.assertEqual(invalid.status_code, 404)

    def test_updated_plan_has_one_guangshi_window(self):
        result = self.client.post("/api/chat", json={"message": "学活二楼广式味道怎么样？"}).json()
        self.assertIn("广式味道", result["reply"])
        self.assertNotIn("上侧和右侧两处", result["reply"])


if __name__ == "__main__":
    unittest.main()
