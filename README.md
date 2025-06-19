# ScripterI/O MCP Server

The **ScripterI/O MCP Server** enables **LLMs** and agents to interact with HTTP APIs and automate test scenarios using the Model Context Protocol (MCP). With ScripterI/O MCP, you can send HTTP requests, validate responses, and script API-driven workflows.

## 🌟 Key Features

✅ **Send HTTP requests (GET, more coming soon)**  
✅ **Automate API test scenarios**  
✅ **LLM-friendly, easy to extend**

---

## 🔧 Use Cases (Tools)

### 1. **`get`**

Send a GET request to any URL and return the response object (status, headers, body).

**Prompt Example:**

```plaintext
Act as a ScripterI/O
- Proceed with test scenario using tools provided by scripterio-mcp

API specifications and logic.
Test Scenario:
Endpoint: Send a GET request to https://api.restful-api.dev/objects/7.

Validation Criteria:
Confirm the response contains the correct status code (e.g., 200).
Validate that the returned response data matches the expected data structure or values:
{
  "id": "7",
  "name": "Apple MacBook Pro 16",
  "data": {
    "year": 2019,
    "price": 1849.99,
    "CPU model": "Intel Core i9",
    "Hard disk size": "1 TB"
  }
}

```

---

## 🛠️ How It Works

- The server exposes a `get` tool for sending HTTP GET requests.
- The tool returns the status code, headers, and parsed JSON body.
- Designed for integration with LLM agents and automated test scenarios.

---

## ⚙️ Configuration

To configure the ScripterI/O MCP server in VS Code, update your **User Settings (JSON)**:

```json
{
  "mcp": {
    "servers": {
      "scripterio-mcp": {
        "command": "npx",
        "args": ["scripterio-mcp"]
      }
    }
  }
}
```

---

## 🚀 Installation & Usage

#### Installation in VS Code

You can install the JSON MCP server using the VS Code CLI:

```bash
# For VS Code
code --add-mcp '{"name":"scripterio-mcp","command":"npx","args": ["scripterio-mcp@latest"]}'
```

### ⚙️ Installation Server

#### Install globally

```bash
npm install -g scripterio-mcp@latest
```

#### Run after global installation

```bash
scripterio-mcp
```

#### Using npx with latest version (recommended)

```bash
npx scripterio-mcp@latest
```
