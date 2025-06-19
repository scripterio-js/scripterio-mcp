#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ToolSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { readFileSync } from "fs";
import { zodToJsonSchema } from "zod-to-json-schema";
import { request as scripterioRequest } from "scripterio";

const ToolInputSchema = ToolSchema.shape.inputSchema;
type ToolInput = z.infer<typeof ToolInputSchema>;

const packageJson = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf-8")
);
const SERVER_VERSION = packageJson.version;

// Server setup
const server = new Server(
  {
    name: "scripterio-mcp",
    version: SERVER_VERSION,
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Schema definitions
const GetArgSchema = z.object({
  url: z.string(),
});

// Tool handlers
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get",
        description:
          "Sends a GET request to the specified URL and returns a Response object",
        inputSchema: zodToJsonSchema(GetArgSchema) as ToolInput,
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;

    switch (name) {
      case "get": {
        const parsed = GetArgSchema.safeParse(args);
        if (!parsed.success) {
          throw new Error(`Invalid arguments for get request: ${parsed.error}`);
        }
        const { url } = parsed.data;

        if (!url) {
          throw new Error("Url should be provided");
        }

        const response = await scripterioRequest.get(url);
        const headersObj = Object.fromEntries(response.headers.entries());
        const body = await response.json();

        return {
          content: [
            {
              type: "text",
              text: `\nSuccessfully sent a GET request to ${url}.\nHere is the response\nstatus code: ${
                response.status
              }\nheaders: ${JSON.stringify(
                headersObj,
                null,
                2
              )}\nbody: ${JSON.stringify(body, null, 2)}\n      `,
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [{ type: "text", text: `Error: ${errorMessage}` }],
      isError: true,
    };
  }
});

// Start server
export async function main() {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error(
      `ScripterI/O MCP Server ${SERVER_VERSION} is running on stdio`
    );
  } catch (error) {
    console.error("Error during startup:", error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
