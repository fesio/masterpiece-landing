# AI Coding Guide for this Repo

## Architecture
- MCP server built with FastMCP; entry point is [src/__init__.py](../src/__init__.py#L1-L18) selecting `http` or `stdio` transport and applying env overrides (`LOG_LEVEL`, `PORT`).
- Core server definition lives in [src/server.py](../src/server.py#L1-L30); only tool is `get_weather`, returning JSON string with random mock conditions.
- Inspector scaffold sits in [inspector/package.json](../inspector/package.json#L1-L9) to launch `mcp-inspector` via npm; no frontend code lives here.

## Run & Debug
- Preferred debug path: VS Code task "Start MCP Server" (port 3001) or launch config `Debug in Agent Builder`; both call `python -m debugpy --listen 127.0.0.1:5678 src/__init__.py http` with `PORT=3001`.
- CLI start without tasks: `python src/__init__.py http` (streamable HTTP on 127.0.0.1:3001) or `python src/__init__.py stdio`.
- MCP Inspector: `cd inspector && npm install` once, then `npm run dev:inspector` (uses `.inspector.json` to connect to `new_http`).
- Virtualenv setup: either `uv venv && uv pip install -r pyproject.toml --extra dev` or `python -m venv .venv && pip install -e .[dev]` (see [pyproject.toml](../pyproject.toml#L1-L10)).

## Patterns & Conventions
- Tools are registered with `@server.tool(...)` on the shared `server` instance; keep async functions and return JSON-serializable strings/objects.
- Mock data is acceptable; deterministic logic should replace `random` if you need repeatable outputs for tests.
- Keep transport names aligned with FastMCP options: use `transport="streamable-http"` for HTTP, `transport="stdio"` for stdin/stdout.
- Prefer returning structured JSON via `json.dumps(..., ensure_ascii=False)` (existing pattern in `get_weather`).

## Adding/Changing Tools
- Import the shared `server` from [src/server.py](../src/server.py#L1-L30); avoid creating new FastMCP instances.
- Document tool args clearly in docstrings; validate required params early (see `location` guard in `get_weather`).
- For new HTTP-visible tools, ensure any new env-configurable behavior is wired through [src/__init__.py](../src/__init__.py#L7-L15) or added env vars.

## Notes
- Default port: 3001; host is pinned to 127.0.0.1 for HTTP debug. Change in [src/__init__.py](../src/__init__.py#L9-L13) and matching task configs.
- Dev dependency `debugpy` is used by VS Code launch; keep versions compatible with Python >=3.10.
- README is the canonical quickstart; update it when changing ports, tasks, or tool names.
