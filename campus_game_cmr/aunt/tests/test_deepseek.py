import io
import json
import os
import unittest
from unittest.mock import patch

from aunt import tone


LOCAL_REPLY = "孩子，现有资料是历史记录，当前菜单和价格待核。"
LEADS = [
    {
        "dish": "番茄小酥肉", "canteenId": "xuehuo", "floorLabel": "2F",
        "windowName": "四川味道档口", "sourceDate": "2026-07-09",
        "priceValue": 8.4, "priceType": "historical_promotion"
    },
    {
        "dish": "滑蛋饭", "canteenId": "minghu", "floorLabel": "2F",
        "windowName": None, "sourceDate": "2026-09-01",
        "priceValue": None, "priceType": None
    }
]


def api_reply(body, finish_reason="stop"):
    content = json.dumps(body, ensure_ascii=False)
    response = {"choices": [{"finish_reason": finish_reason, "message": {"content": content}}]}
    return io.BytesIO(json.dumps(response, ensure_ascii=False).encode("utf-8"))


class DeepSeekGroundingTest(unittest.TestCase):
    def setUp(self):
        self.result = {"reply": LOCAL_REPLY, "recommendations": LEADS}

    def test_without_key_uses_local_answer_without_network(self):
        with patch.dict(os.environ, {}, clear=True), patch.object(tone, "urlopen") as call:
            self.assertEqual(tone.respond("有什么推荐？", self.result), LOCAL_REPLY)
            call.assert_not_called()

    def test_valid_indices_select_only_original_local_facts(self):
        with patch.dict(os.environ, {"DEEPSEEK_API_KEY": "test-only"}, clear=True), \
             patch.object(tone, "urlopen", return_value=api_reply({"indices": [0, 1]})) as call:
            answer = tone.respond("学活二楼有什么菜？", self.result)
        self.assertTrue(answer.startswith(LOCAL_REPLY + "\n"))
        self.assertIn("学活 2F 四川味道档口：番茄小酥肉", answer)
        self.assertIn("2026-07-09", answer)
        self.assertIn("历史活动价 ¥8.4，现价待核", answer)
        self.assertNotIn("滑蛋饭", answer)
        sent = json.loads(call.call_args.args[0].data)
        self.assertEqual(sent["model"], "deepseek-flash")
        self.assertEqual(sent["thinking"], {"type": "disabled"})
        self.assertEqual(sent["response_format"], {"type": "json_object"})
        self.assertNotIn("test-only", json.dumps(sent))
        selector_input = json.loads(sent["messages"][1]["content"])
        self.assertEqual(selector_input["required_indices"], [0])
        self.assertEqual(selector_input["fragments"][0]["text"], LOCAL_REPLY)

    def test_free_text_cannot_invent_dish_review_or_price(self):
        for response in (
            {"answer": "红烧肉饭好评如潮，现价 ¥9.99。"},
            {"indices": [0, 1], "answer": "红烧肉饭好评如潮，现价 ¥9.99。"},
            {"indices": [0, 2], "comment": "滑蛋饭当前售价 ¥9.99。"}
        ):
            with self.subTest(response=response), \
                 patch.dict(os.environ, {"DEEPSEEK_API_KEY": "test-only"}, clear=True), \
                 patch.object(tone, "urlopen", return_value=api_reply(response)):
                self.assertEqual(tone.respond("哪个好吃？", self.result), LOCAL_REPLY)

    def test_invalid_or_missing_core_indices_fall_back(self):
        for indices in ([1], [0, 9], [0, 0], [True, 1], ["0", 1], [], [0, 1, 2], [0, 1, 2, 3]):
            with self.subTest(indices=indices), \
                 patch.dict(os.environ, {"DEEPSEEK_API_KEY": "test-only"}, clear=True), \
                 patch.object(tone, "urlopen", return_value=api_reply({"indices": indices})):
                self.assertEqual(tone.respond("吃什么？", self.result), LOCAL_REPLY)

    def test_nonfinal_completion_falls_back_and_simple_chat_calls_agent(self):
        with patch.dict(os.environ, {"DEEPSEEK_API_KEY": "test-only"}, clear=True), \
             patch.object(tone, "urlopen", return_value=api_reply({"indices": [0, 1]}, "length")):
            self.assertEqual(tone.respond("吃什么？", self.result), LOCAL_REPLY)
        with patch.dict(os.environ, {"DEEPSEEK_API_KEY": "test-only"}, clear=True), \
             patch.object(tone, "urlopen", return_value=api_reply({"indices": [0]})) as call:
            self.assertEqual(tone.respond("你好", {"reply": "孩子，想吃点什么？"}), "孩子，想吃点什么？")
            call.assert_called_once()

    def test_price_and_hours_caveats_remain_attached(self):
        student_report = dict(LEADS[0], priceType="historical_student_report", priceValue=13)
        self.assertIn("学生当次消费价 ¥13，现价待核", tone._recommendation_fragment(student_report))
        hours = "学四二层资料时段 11:00–13:00。临时调整以现场公告为准。"
        result = {"reply": hours, "recommendations": LEADS[:1]}
        with patch.dict(os.environ, {"DEEPSEEK_API_KEY": "test-only"}, clear=True), \
             patch.object(tone, "urlopen", return_value=api_reply({"indices": [0, 1]})):
            answer = tone.respond("几点开门？", result)
        self.assertTrue(answer.startswith(hours + "\n"))
        self.assertIn("现场公告为准", answer)


if __name__ == "__main__":
    unittest.main()
