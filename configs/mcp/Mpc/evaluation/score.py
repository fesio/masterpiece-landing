import argparse
import json
from pathlib import Path


def load_responses(path: Path):
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


def evaluate(responses):
    total = len(responses)
    success = 0
    schema_ok = 0
    unique_pairs = set()

    for record in responses:
        payload = record["response"]
        try:
            parsed = json.loads(payload)
        except json.JSONDecodeError:
            continue

        success += 1

        if all(k in parsed for k in ("location", "temperature", "condition")):
            schema_ok += 1
            unique_pairs.add((parsed["temperature"], parsed["condition"]))

    metrics = {
        "ToolCallSuccessRate": success / total if total else 0,
        "SchemaCompleteness": schema_ok / total if total else 0,
        "MockDataDiversity": len(unique_pairs) / total if total else 0,
    }
    return metrics


def main() -> None:
    parser = argparse.ArgumentParser(description="Score the weather MCP responses.")
    parser.add_argument(
        "--responses",
        type=Path,
        default=Path(__file__).resolve().parent / "responses.json",
        help="Path to the collected responses",
    )
    args = parser.parse_args()

    responses = load_responses(args.responses)
    metrics = evaluate(responses)

    print("Evaluation metrics:")
    for name, value in metrics.items():
        print(f"- {name}: {value:.2f}")


if __name__ == "__main__":
    main()