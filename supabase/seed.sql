-- Seed data for Omnisiv MVP
-- Run after 001_initial_schema.sql

insert into categories (name, slug, description) values
  ('Coding', 'coding', 'Agents for software development and debugging'),
  ('Research', 'research', 'Agents for research, analysis, and reports'),
  ('Sales', 'sales', 'Agents for outreach, CRM, and follow-ups'),
  ('Content', 'content', 'Agents for writing, editing, and content creation'),
  ('Data', 'data', 'Agents for data extraction, scraping, and pipelines'),
  ('Multi-Agent', 'multi-agent', 'Orchestrated multi-agent systems')
on conflict (slug) do nothing;

insert into agents (
  name, slug, short_description, description,
  website_url, github_url, demo_url, docs_url, mcp_url,
  pricing_type, pricing_details,
  is_open_source, is_self_hostable, has_api, has_mcp, is_structured, payment_ready,
  rating, review_count, view_count, status, source, published_at
) values
(
  'Cursor',
  'cursor',
  'AI-powered code editor with agentic coding capabilities in VS Code.',
  'Cursor is an AI-first code editor built on VS Code. It features agent mode for autonomous coding tasks, multi-file edits, codebase understanding, and integration with popular models. Ideal for developers who want an AI pair programmer directly in their editor.',
  'https://cursor.com',
  null,
  'https://cursor.com',
  'https://docs.cursor.com',
  null,
  'freemium', 'Free tier + Pro from $20/mo',
  false, false, true, false, true, false,
  4.7, 2840, 125000, 'published', 'seed', now()
),
(
  'Devin',
  'devin',
  'Autonomous AI software engineer that plans and executes coding tasks.',
  'Devin is an autonomous AI software engineer developed by Cognition. It can plan, write, debug, and deploy code across full projects with minimal human intervention.',
  'https://devin.ai',
  null,
  'https://devin.ai',
  null,
  null,
  'paid', 'Enterprise pricing',
  false, false, true, false, false, false,
  4.1, 890, 67000, 'published', 'seed', now()
),
(
  'LangGraph',
  'langgraph',
  'Framework for building stateful, multi-agent workflows with LLMs.',
  'LangGraph is a library for building controllable agent workflows. Supports multi-agent orchestration, human-in-the-loop, persistence, and production deployment. Built by LangChain.',
  'https://langchain.com/langgraph',
  'https://github.com/langchain-ai/langgraph',
  null,
  'https://langchain-ai.github.io/langgraph/',
  null,
  'open_source', 'MIT License',
  true, true, true, false, true, false,
  4.6, 1520, 89000, 'published', 'seed', now()
),
(
  'CrewAI',
  'crewai',
  'Multi-agent orchestration framework for collaborative AI teams.',
  'CrewAI enables you to create teams of specialized AI agents that collaborate on complex tasks. Supports role-based agents, tools, memory, and sequential/hierarchical workflows.',
  'https://crewai.com',
  'https://github.com/crewAIInc/crewAI',
  null,
  'https://docs.crewai.com',
  null,
  'open_source', 'MIT License',
  true, true, true, true, true, false,
  4.5, 980, 54000, 'published', 'seed', now()
),
(
  'Firecrawl MCP',
  'firecrawl-mcp',
  'MCP server for web scraping and structured data extraction.',
  'Firecrawl MCP provides agents with clean, structured web data via the Model Context Protocol. Supports crawling, scraping, and converting web pages to LLM-ready formats.',
  'https://firecrawl.dev',
  'https://github.com/mendableai/firecrawl',
  null,
  'https://docs.firecrawl.dev',
  'https://github.com/mendableai/firecrawl-mcp-server',
  'freemium', 'Free tier + paid plans',
  true, true, true, true, true, true,
  4.4, 420, 31000, 'published', 'seed', now()
),
(
  'Perplexity',
  'perplexity',
  'AI-powered research agent with real-time web search and citations.',
  'Perplexity is an AI answer engine that searches the web in real-time, synthesizes information, and provides cited sources. Excellent for research tasks and fact-checking.',
  'https://perplexity.ai',
  null,
  'https://perplexity.ai',
  'https://docs.perplexity.ai',
  null,
  'freemium', 'Free + Pro from $20/mo',
  false, false, true, false, true, false,
  4.6, 5200, 210000, 'published', 'seed', now()
),
(
  'n8n AI Agent',
  'n8n-ai-agent',
  'Workflow automation with built-in AI agent nodes and tool calling.',
  'n8n combines workflow automation with AI agent capabilities. Build agents that call APIs, process data, and automate business processes with a visual editor.',
  'https://n8n.io',
  'https://github.com/n8n-io/n8n',
  null,
  'https://docs.n8n.io',
  null,
  'open_source', 'Fair-code license',
  true, true, true, false, true, false,
  4.3, 760, 45000, 'published', 'seed', now()
),
(
  'AutoGPT',
  'autogpt',
  'Pioneer autonomous agent framework for goal-driven task execution.',
  'AutoGPT was one of the first open-source autonomous AI agents. It breaks down goals into sub-tasks and executes them using tools and APIs autonomously.',
  'https://agpt.co',
  'https://github.com/Significant-Gravitas/AutoGPT',
  null,
  'https://docs.agpt.co',
  null,
  'open_source', 'MIT License',
  true, true, false, false, false, false,
  3.9, 2100, 156000, 'published', 'seed', now()
),
(
  'Composio',
  'composio',
  'Tool integration platform with MCP support for AI agents.',
  'Composio provides 250+ tool integrations for AI agents with a unified API. Supports MCP, function calling, and auth management for agent tool use.',
  'https://composio.dev',
  'https://github.com/ComposioHQ/composio',
  null,
  'https://docs.composio.dev',
  'https://github.com/ComposioHQ/composio-mcp',
  'freemium', 'Free tier + paid',
  true, false, true, true, true, true,
  4.3, 340, 28000, 'published', 'seed', now()
),
(
  'Phidata / Agno',
  'agno',
  'Framework for building AI agents with memory, tools, and knowledge.',
  'Agno (formerly Phidata) is a lightweight framework for building AI agents with tools, knowledge bases, memory, and multi-agent teams. Fast and production-ready.',
  'https://agno.com',
  'https://github.com/agno-agi/agno',
  null,
  'https://docs.agno.com',
  null,
  'open_source', 'MPL 2.0',
  true, true, true, false, true, false,
  4.4, 560, 38000, 'published', 'seed', now()
),
(
  'Playwright MCP',
  'playwright-mcp',
  'Official MCP server for browser automation and web testing via Playwright.',
  'Microsoft Playwright MCP enables AI agents to control browsers, run automated tests, scrape pages, and interact with web UIs through the Model Context Protocol. Built for reliable agent-driven browser workflows.',
  'https://github.com/microsoft/playwright-mcp',
  'https://github.com/microsoft/playwright-mcp',
  null,
  'https://playwright.dev',
  'https://github.com/microsoft/playwright-mcp',
  'open_source', 'MIT License',
  true, true, false, true, true, false,
  4.5, 680, 42000, 'published', 'seed', now()
),
(
  'GitHub MCP',
  'github-mcp',
  'Official MCP server for GitHub repos, issues, PRs, and code search.',
  'GitHub MCP Server gives AI agents structured access to repositories, pull requests, issues, and code search. Ideal for coding agents that need to read, review, and act on GitHub projects.',
  'https://github.com/github/github-mcp-server',
  'https://github.com/github/github-mcp-server',
  null,
  'https://docs.github.com/en/copilot/how-tos/context/model-context-protocol',
  'https://github.com/github/github-mcp-server',
  'open_source', 'MIT License',
  true, true, false, true, true, false,
  4.6, 920, 58000, 'published', 'seed', now()
),
(
  'Supabase MCP',
  'supabase-mcp',
  'MCP server for querying and managing Supabase databases and projects.',
  'Supabase MCP connects AI agents directly to your Supabase projects. Agents can run SQL, inspect schemas, manage tables, and work with data through a structured MCP interface.',
  'https://supabase.com',
  'https://github.com/supabase-community/supabase-mcp',
  null,
  'https://supabase.com/docs/guides/getting-started/mcp',
  'https://github.com/supabase-community/supabase-mcp',
  'open_source', 'Apache 2.0',
  true, true, false, true, true, false,
  4.5, 540, 36000, 'published', 'seed', now()
),
(
  'Exa',
  'exa',
  'Neural search API and MCP server for AI-native web research.',
  'Exa provides semantic web search designed for AI agents. Find high-quality sources, papers, and companies with neural search. Ships an official MCP server for agent integrations.',
  'https://exa.ai',
  'https://github.com/exa-labs/exa-mcp-server',
  null,
  'https://docs.exa.ai',
  'https://github.com/exa-labs/exa-mcp-server',
  'freemium', 'Free tier + usage-based pricing',
  false, false, true, true, true, true,
  4.5, 780, 64000, 'published', 'seed', now()
),
(
  'Tavily',
  'tavily',
  'Search API built for AI agents with real-time web results and MCP support.',
  'Tavily is a search engine optimized for LLM agents. Returns clean, cited, agent-ready results. Widely used in RAG and research pipelines with an official MCP server.',
  'https://tavily.com',
  'https://github.com/tavily-ai/tavily-mcp',
  null,
  'https://docs.tavily.com',
  'https://github.com/tavily-ai/tavily-mcp',
  'freemium', 'Free tier + paid plans',
  false, false, true, true, true, true,
  4.4, 650, 52000, 'published', 'seed', now()
),
(
  'Notion MCP',
  'notion-mcp',
  'Official Notion MCP server for reading and writing workspace content.',
  'Notion MCP lets AI agents interact with Notion pages, databases, and blocks. Officially supported for structured knowledge retrieval and content workflows inside Notion workspaces.',
  'https://notion.so',
  null,
  null,
  'https://developers.notion.com/docs/mcp',
  'https://developers.notion.com/docs/mcp',
  'freemium', 'Included with Notion plans',
  false, false, true, true, true, false,
  4.3, 410, 38000, 'published', 'seed', now()
),
(
  'Browserbase',
  'browserbase',
  'Cloud browser infrastructure with MCP for agent-driven web automation.',
  'Browserbase provides headless browsers in the cloud for AI agents. Combined with Stagehand, it enables reliable web navigation, form filling, and data extraction via MCP.',
  'https://browserbase.com',
  'https://github.com/browserbase',
  null,
  'https://docs.browserbase.com',
  'https://github.com/browserbase/mcp-server-browserbase',
  'freemium', 'Free tier + usage-based',
  false, false, true, true, true, true,
  4.4, 380, 29000, 'published', 'seed', now()
),
(
  'Context7',
  'context7',
  'MCP server for up-to-date library documentation and code examples.',
  'Context7 resolves library docs on demand so coding agents always use current APIs. Popular MCP tool for reducing hallucinated code and outdated documentation in agent workflows.',
  'https://context7.com',
  'https://github.com/upstash/context7',
  null,
  'https://context7.com/docs',
  'https://github.com/upstash/context7',
  'freemium', 'Free tier available',
  false, false, true, true, true, false,
  4.5, 520, 44000, 'published', 'seed', now()
),
(
  'Flowise',
  'flowise',
  'Open-source visual builder for AI agents with MCP server support.',
  'Flowise is a low-code platform for building LLM flows and agent chains. Supports tool calling, RAG, and MCP integrations. Self-hostable with a drag-and-drop interface.',
  'https://flowiseai.com',
  'https://github.com/FlowiseAI/Flowise',
  null,
  'https://docs.flowiseai.com',
  'https://docs.flowiseai.com/tutorials/mcp',
  'open_source', 'Apache 2.0',
  true, true, true, true, true, false,
  4.4, 870, 72000, 'published', 'seed', now()
),
(
  'Cline',
  'cline',
  'Autonomous coding agent for VS Code with tool use and MCP client support.',
  'Cline is an AI coding assistant that lives in VS Code. It can create and edit files, run terminal commands, and connect to MCP servers for extended tool capabilities.',
  'https://cline.bot',
  'https://github.com/cline/cline',
  null,
  'https://docs.cline.bot',
  null,
  'open_source', 'Apache 2.0',
  true, true, false, false, true, false,
  4.6, 1240, 95000, 'published', 'seed', now()
),
(
  'Aider',
  'aider',
  'Terminal pair programmer that edits code in your local git repo.',
  'Aider is a command-line AI coding tool that works with your existing projects. Supports multiple LLMs, git integration, and whole-codebase context for fast iterative development.',
  'https://aider.chat',
  'https://github.com/Aider-AI/aider',
  null,
  'https://aider.chat/docs/',
  null,
  'open_source', 'Apache 2.0',
  true, true, false, false, true, false,
  4.5, 1890, 112000, 'published', 'seed', now()
),
(
  'OpenHands',
  'openhands',
  'Open-source platform for autonomous software development agents.',
  'OpenHands (formerly OpenDevin) is a community-driven platform for AI software engineers. Agents can write code, run commands, browse the web, and collaborate on dev tasks.',
  'https://openhands.dev',
  'https://github.com/OpenHands/OpenHands',
  null,
  'https://docs.openhands.dev',
  null,
  'open_source', 'MIT License',
  true, true, true, false, true, false,
  4.4, 960, 68000, 'published', 'seed', now()
),
(
  'AutoGen',
  'autogen',
  'Microsoft framework for building multi-agent conversational AI systems.',
  'AutoGen enables multiple AI agents to collaborate through structured conversations. Supports tool use, human-in-the-loop, and complex multi-agent orchestration patterns.',
  'https://microsoft.github.io/autogen/',
  'https://github.com/microsoft/autogen',
  null,
  'https://microsoft.github.io/autogen/stable/',
  null,
  'open_source', 'MIT License',
  true, true, true, false, true, false,
  4.5, 1340, 98000, 'published', 'seed', now()
),
(
  'LlamaIndex',
  'llamaindex',
  'Data framework for LLM apps with RAG, agents, and MCP tool integrations.',
  'LlamaIndex connects LLMs to your data with ingestion, indexing, and retrieval pipelines. Supports agent workflows, structured outputs, and MCP servers for production RAG systems.',
  'https://www.llamaindex.ai',
  'https://github.com/run-llama/llama_index',
  null,
  'https://docs.llamaindex.ai',
  'https://github.com/run-llama/llamaindex-mcp',
  'open_source', 'MIT License',
  true, true, true, true, true, false,
  4.5, 1100, 85000, 'published', 'seed', now()
),
(
  'Dify',
  'dify',
  'Open-source LLM app platform with agents, workflows, and MCP support.',
  'Dify is a production-ready platform for building AI apps and agents. Features visual workflows, RAG pipelines, model management, and MCP tool integrations for enterprise deployments.',
  'https://dify.ai',
  'https://github.com/langgenius/dify',
  null,
  'https://docs.dify.ai',
  'https://docs.dify.ai/guides/tools/mcp',
  'open_source', 'Apache 2.0 + cloud',
  true, true, true, true, true, false,
  4.6, 1420, 105000, 'published', 'seed', now()
)
on conflict (slug) do nothing;

-- Link categories
insert into agent_categories (agent_id, category_id)
select a.id, c.id from agents a, categories c
where (a.slug = 'cursor' and c.slug = 'coding')
   or (a.slug = 'devin' and c.slug = 'coding')
   or (a.slug = 'langgraph' and c.slug = 'multi-agent')
   or (a.slug = 'crewai' and c.slug = 'multi-agent')
   or (a.slug = 'firecrawl-mcp' and c.slug = 'data')
   or (a.slug = 'perplexity' and c.slug = 'research')
   or (a.slug = 'n8n-ai-agent' and c.slug = 'multi-agent')
   or (a.slug = 'autogpt' and c.slug = 'multi-agent')
   or (a.slug = 'composio' and c.slug = 'multi-agent')
   or (a.slug = 'agno' and c.slug = 'coding')
   or (a.slug = 'playwright-mcp' and c.slug = 'coding')
   or (a.slug = 'github-mcp' and c.slug = 'coding')
   or (a.slug = 'supabase-mcp' and c.slug = 'coding')
   or (a.slug = 'exa' and c.slug = 'research')
   or (a.slug = 'tavily' and c.slug = 'research')
   or (a.slug = 'notion-mcp' and c.slug = 'content')
   or (a.slug = 'browserbase' and c.slug = 'data')
   or (a.slug = 'context7' and c.slug = 'coding')
   or (a.slug = 'flowise' and c.slug = 'multi-agent')
   or (a.slug = 'cline' and c.slug = 'coding')
   or (a.slug = 'aider' and c.slug = 'coding')
   or (a.slug = 'openhands' and c.slug = 'coding')
   or (a.slug = 'autogen' and c.slug = 'multi-agent')
   or (a.slug = 'llamaindex' and c.slug = 'data')
   or (a.slug = 'dify' and c.slug = 'multi-agent')
on conflict do nothing;

-- Link tags
insert into tags (name, slug) values
  ('MCP', 'mcp'),
  ('Open Source', 'open-source'),
  ('API', 'api'),
  ('Self-Hostable', 'self-hostable')
on conflict (slug) do nothing;

insert into agent_tags (agent_id, tag_id)
select a.id, t.id from agents a, tags t
where (a.has_mcp and t.slug = 'mcp')
   or (a.is_open_source and t.slug = 'open-source')
   or (a.has_api and t.slug = 'api')
   or (a.is_self_hostable and t.slug = 'self-hostable')
on conflict do nothing;
