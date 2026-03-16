import asyncio
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PROJECT_ROOT = ROOT.parent
sys.path.append(str(PROJECT_ROOT))
sys.path.append(str(PROJECT_ROOT / "src"))

from src.server import get_weather


async def collect_responses(queries):
    responses = []
    for q in queries:
        result = await get_weather(q["args"]["location"])
        responses.append({
            "id": q["id"],
            "prompt": q["prompt"],
            "location": q["args"]["location"],
            "response": result,
        })
    return responses


def main() -> None:
    queries_path = ROOT / "queries.json"
    responses_path = ROOT / "responses.json"

    with queries_path.open("r", encoding="utf-8") as f:
        queries = json.load(f)

    responses = asyncio.run(collect_responses(queries))

    with responses_path.open("w", encoding="utf-8") as f:
        json.dump(responses, f, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    main()