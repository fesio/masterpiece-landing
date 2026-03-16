# Evaluation workflow

1. **Start the MCP server** via the `Start MCP Server` task in `.vscode/tasks.json`. The task sets `PORT=3001`, launches `debugpy`, and keeps the `/mcp` endpoint available for evaluation.
2. Install dependencies if not done yet: run `python -m pip install -e .[dev]` inside the virtual environment so `mcp` and `debugpy` are available.
3. Generate the dataset by running `python evaluation/generate_responses.py`. The script reuses `get_weather` to produce real payloads for each entry from `evaluation/queries.json` and saves them in `evaluation/responses.json`.
4. Score the tool behavior with `python evaluation/score.py --responses evaluation/responses.json`. It prints `ToolCallSuccessRate`, `SchemaCompleteness`, and `MockDataDiversity` so agents can see if their changes keep the weather tool reliable.

All files are kept inside `evaluation/` so agents can commit datasets and metrics results back to GitHub instead of leaving them on a local machine.