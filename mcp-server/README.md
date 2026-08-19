# Omnisiv MCP server

Minimal [MCP](https://modelcontextprotocol.io) server for [omnisiv.com](https://www.omnisiv.com) — the search engine for AI agents.

It talks to the public HTTP API only. No admin tools.

## Tools

### `search_agents`

`GET https://www.omnisiv.com/api/search`

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

`POST https://www.omnisiv.com/api/submit`

| Arg | Type | Notes |
| --- | --- | --- |
| `name` | string | Required, 2–80 chars |
| `short_description` | string | Required, max 160 chars |
| `website_url` | string | Optional URL |
| `submitted_by` | string | Optional contact, max 120 chars |

Returns the API JSON as-is (submissions are reviewed manually).

## Install / run

Node 18+.

```bash
cd mcp-server
npm install
npm run build
npm start
```

`npm start` is stdio-only (no HTTP port). Cursor and Claude spawn it for you.

Override the API host when testing locally:

```bash
OMNISIV_API_BASE=http://localhost:3000 npm start
```

## Cursor / Claude MCP config

After `npm install` and `npm run build`, add this to Cursor (`~/.cursor/mcp.json`) or Claude Desktop (`claude_desktop_config.json`). Use your real absolute path.

```json
{
  "mcpServers": {
    "omnisiv": {
      "command": "node",
      "args": ["C:/au_projects/omnisiv/mcp-server/dist/index.js"]
    }
  }
}
```

Same thing via npm:

```json
{
  "mcpServers": {
    "omnisiv": {
      "command": "npm",
      "args": ["start"],
      "cwd": "C:/au_projects/omnisiv/mcp-server"
    }
  }
}
```

Restart the client after saving. Then ask: “Search Omnisiv for MCP scrapers.”
