# omnisiv-mcp

MCP server for [omnisiv.com](https://www.omnisiv.com) — search and submit AI agents.

Run it with `npx`. Cursor, Claude Desktop, and Windsurf spawn it over stdio. It calls the public Omnisiv API only (no admin tools).

Default API base: `https://www.omnisiv.com`

## Quick start

```bash
npx -y omnisiv-mcp
```

That process speaks MCP on stdin/stdout. You do not open a browser or port.

## Cursor / Claude Desktop / Windsurf

Add this to the client MCP config, then restart the client.

- **Cursor:** `~/.cursor/mcp.json`
- **Claude Desktop:** `claude_desktop_config.json`
- **Windsurf:** `~/.codeium/windsurf/mcp_config.json`

```json
{
  "mcpServers": {
    "omnisiv": {
      "command": "npx",
      "args": ["-y", "omnisiv-mcp"]
    }
  }
}
```

Optional local/staging API:

```json
{
  "mcpServers": {
    "omnisiv": {
      "command": "npx",
      "args": ["-y", "omnisiv-mcp"],
      "env": {
        "OMNISIV_API_BASE": "http://localhost:3000"
      }
    }
  }
}
```

Then ask: “Search Omnisiv for MCP scrapers.”

## Tools

### `search_agents`

`GET {API}/api/search`

| Arg | Type | Notes |
| --- | --- | --- |
| `q` | string | Optional full-text query |
| `has_mcp` | boolean | Agents with an MCP server |
| `has_api` | boolean | Agents with a public API |
| `open_source` | boolean | Open-source license |
| `free` | boolean | Free to use (`free` or `open_source` pricing) |
| `limit` | number | Default **10**, max **20** |

Returns compact rows: `name`, `slug`, `url`, `short_description`, `has_mcp`, `has_api`, `is_open_source`, `agent_ready_score`, `website_url`.

### `submit_agent`

`POST {API}/api/submit`

| Arg | Type | Notes |
| --- | --- | --- |
| `name` | string | Required, 2–80 chars |
| `short_description` | string | Required, max 160 chars |
| `website_url` | string | Optional URL |
| `submitted_by` | string | Optional contact, max 120 chars |

Returns the API JSON as-is. Submissions are reviewed manually.

## Env

| Variable | Default | Purpose |
| --- | --- | --- |
| `OMNISIV_API_BASE` | `https://www.omnisiv.com` | Override API host (no trailing slash) |

## Develop from this repo

```bash
cd mcp-server
npm install
npm run build
npm start
```
