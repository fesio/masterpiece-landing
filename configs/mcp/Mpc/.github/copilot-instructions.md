# Copilot instructions for Weather MCP

## Top-level architecture
- The whole MCP server lives in [src/server.py](src/server.py); it registers one `FastMCP` tool (`get_weather`) that returns a mocked JSON payload via `json.dumps` instead of serializing domain objects, so expect consumers to parse string responses.
- [src/__init__.py](src/__init__.py) is the entry point. It inspects `sys.argv[1]` for `http` vs `stdio`, wires in `debugpy` when run through the VS Code task, and calls `server.run(transport="streamable-http")` for the HTTP path that the Inspector and Agent Builder rely on.

## Setup & dependencies
- The roadmap in [README.md](README.md) is authoritative for local setup. You can use either `uv venv` + `uv pip install -r pyproject.toml --extra dev` or the plain-`venv` flow (`python -m venv .venv` + `pip install -e .[dev]`). The only runtime dependency is `mcp==1.18.0` (see [pyproject.toml](pyproject.toml)), and `debugpy==1.8.8` is installed for debugging.
- No other services, databases, or background workers are required; the server is self-contained inside `src/` and mocks weather responses with random data.

## Running & debugging
- Start the server through the `Start MCP Server` task in [.vscode/tasks.json](.vscode/tasks.json) so environment variables (`PORT`, `LOG_LEVEL`) and the `debugpy` listener are configured consistently.
- For HTTP/local testing run that task (it sets `PORT=3001`) and then either open the Agent Builder via the `Open Agent Builder` task or hit the Inspector. The Agent Builder task uses the `ai-mlstudio.agentBuilder` command with `initialMCPs` pointing to `local-server-mpc` defined in [.aitk/mcp.json](.aitk/mcp.json).
- Debuggers expect the streamable HTTP `/mcp` endpoint, so keep `server.settings.port` at 3001 unless you change every config (see the note in [README.md](README.md) about editing `.vscode/tasks.json`, [src/__init__.py](src/__init__.py), and [.aitk/mcp.json](.aitk/mcp.json) together).

## Inspector & Agent Builder glue
- The Inspector is powered by the placeholder project in [inspector/package.json](inspector/package.json); `npm run dev:inspector` launches `mcp-inspector` with `.inspector.json` that maps the `mpc_http` target to `streamable-http` on `http://localhost:3001/mcp`.
- The Inspector task in [.vscode/tasks.json](.vscode/tasks.json) depends on the MCP server task, injects `CLIENT_PORT=5173`/`SERVER_PORT=3000`, and ensures the `mcp-inspector` CLI can reach the running server.

## Patterns & expectations
- Tool implementations should remain async functions decorated with `@server.tool` so the FastMCP runtime discovers them; the weather tool returns a stringified dict (including keys like `location`, `temperature`, `condition`) and raises no exceptions beyond returning error strings for invalid input.
- There are currently no automated tests or CI hooks; validation happens by running the server + Inspector/Agent Builder prompt. Keep code changes small and manually verify via the tasks.

## What to do before PR
- Run or rerun the `Start MCP Server` task to catch import or runtime issues introduced by server code changes and retest through the Inspector (use `npm run dev:inspector` inside `inspector/`).
- Mention in your PR which files you touched (e.g., [src/server.py](src/server.py) or [inspector/.inspector.json](inspector/.inspector.json)) so reviewers can rerun the right flows and re-check port settings.

## Evaluation workflow
- Store test prompts under [evaluation/queries.json](evaluation/queries.json) and run [evaluation/generate_responses.py](evaluation/generate_responses.py) to collect the `get_weather` replies; the script calls the tool directly so the results stay reproducible even without hitting the HTTP endpoint.
- The collected payloads land in [evaluation/responses.json](evaluation/responses.json). Every entry keeps the original `prompt`, `location`, and raw `response` so agents can replay or diff them before opening a PR.
- Score the work with [evaluation/score.py](evaluation/score.py); it reports the three project-specific metrics (ToolCallSuccessRate, SchemaCompleteness, MockDataDiversity) against the saved responses so agents can confirm a change left the weather schema intact.
- Capture the workflow inside [evaluation/README.md](evaluation/README.md) and keep those files committed so agents can work entirely within GitHub without dumping temporary data locally.

If any section needs more detail, let me know and I can iterate.