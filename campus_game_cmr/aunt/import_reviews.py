"""Import vetted, structured campus-wall reviews offline (never fetches the web)."""

import argparse
import json
from datetime import datetime
from pathlib import Path

from aunt import server, knowledge


def import_rows(rows):
    server.init_db()
    added = 0
    with server.db() as connection:
        for row in rows:
            stall_id = row.get("stall_id")
            if stall_id not in knowledge.ZONES:
                raise ValueError("Unknown stall_id: " + str(stall_id))
            rating = row.get("rating")
            queue_minutes = row.get("queue_minutes")
            if rating is not None and (type(rating) is not int or not 1 <= rating <= 5):
                raise ValueError("rating must be an integer from 1 to 5")
            if queue_minutes is not None and (type(queue_minutes) is not int or not 0 <= queue_minutes <= 240):
                raise ValueError("queue_minutes must be an integer from 0 to 240")
            if rating is None and queue_minutes is None:
                raise ValueError("A review needs rating or queue_minutes")
            content = row.get("content", "").strip()
            if not content or len(content) > 1000:
                raise ValueError("content must have 1–1000 characters")
            tags = row.get("tags", [])
            if not isinstance(tags, list) or any(tag not in ("辣", "清淡", "分量", "价格", "排队", "环境") for tag in tags):
                raise ValueError("tags must use the known tag names")
            source_ref = row.get("source_ref")
            if source_ref is not None and (not isinstance(source_ref, str) or not source_ref.strip()):
                raise ValueError("source_ref must be a non-empty source identifier")
            if source_ref is not None and not (source_ref.startswith("http://") or source_ref.startswith("https://")):
                raise ValueError("source_ref must be a public source URL")
            published_at = datetime.fromisoformat(row["published_at"])
            if published_at.tzinfo is None:
                raise ValueError("published_at must include a timezone")
            timestamp = published_at.timestamp()
            existing = connection.execute(
                "SELECT id FROM reviews WHERE stall_id=? AND source='imported' AND content=? AND created_at=?",
                (stall_id, content, timestamp),
            ).fetchone()
            if existing:
                continue
            connection.execute(
                "INSERT INTO reviews(user_id,stall_id,rating,queue_minutes,content,source,created_at,source_ref,tags_json) "
                "VALUES(NULL,?,?,?,?,'imported',?,?,?)",
                (stall_id, rating, queue_minutes, content, timestamp, source_ref, json.dumps(tags, ensure_ascii=False)),
            )
            added += 1
    return added


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("file", type=Path, help="JSON array with vetted and de-identified reviews")
    args = parser.parse_args()
    rows = json.loads(args.file.read_text(encoding="utf-8"))
    if not isinstance(rows, list):
        raise ValueError("Root JSON value must be an array")
    print("Imported %d reviews" % import_rows(rows))


if __name__ == "__main__":
    main()
