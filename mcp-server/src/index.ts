#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import {
  OmnisivApiError,
  searchAgents,
  submitAgent,
} from "./omnisiv.js";

function jsonResult(data: unknown, isError = false) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
    isError,
  };
}

function fail(err: unknown) {
  if (err instanceof OmnisivApiError) {
    return jsonResult(
      {
        error: err.message,
        status: err.status,
        details: err.body,
      },
      true
    );
  }
  const message = err instanceof Error ? err.message : String(err);
  return jsonResult({ error: message }, true);
}

const server = new McpServer({
  name: "omnisiv-mcp",
  version: "0.1.0",
});

server.registerTool(
  "search_agents",
  {
    title: "Search Omnisiv agents",
    description:
      "Search published AI agents on omnisiv.com. Optional filters: MCP, public API, open source, free.",
    inputSchema: {
      q: z.string().optional().describe("Full-text search query"),
      has_mcp: z.boolean().optional().describe("Only agents with an MCP server"),
      has_api: z.boolean().optional().describe("Only agents with a public API"),
      open_source: z
        .boolean()
        .optional()
        .describe("Only open-source licensed agents"),
      free: z
        .boolean()
        .optional()
        .describe("Only free agents (pricing_type free or open_source)"),
      limit: z
        .number()
        .int()
        .min(1)
        .max(20)
        .optional()
        .describe("Results to return (default 10, max 20)"),
    },
  },
  async (args) => {
    try {
      return jsonResult(await searchAgents(args));
    } catch (err) {
      return fail(err);
    }
  }
);

server.registerTool(
  "submit_agent",
  {
    title: "Submit an agent to Omnisiv",
    description:
      "Submit an AI agent for manual review on omnisiv.com. Does not publish immediately.",
    inputSchema: {
      name: z.string().min(2).max(80).describe("Agent name (2–80 characters)"),
      short_description: z
        .string()
        .min(1)
        .max(160)
        .describe("Short description (max 160 characters)"),
      website_url: z
        .string()
        .url()
        .optional()
        .describe("Optional public website URL"),
      submitted_by: z
        .string()
        .max(120)
        .optional()
        .describe("Optional contact string (max 120 characters)"),
    },
  },
  async (args) => {
    try {
      const { status, body } = await submitAgent(args);
      return jsonResult(body, status >= 400);
    } catch (err) {
      return fail(err);
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
