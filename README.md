# NASA Fuel Calculator

Interplanetary fuel calculator for the NEX Energy full-stack code challenge. Build a flight path, enter spacecraft mass, and get fuel requirements updated in real time over WebSockets.

## Prerequisites

- **Node.js** 20 or later
- **npm** 10 or later (bundled with Node)

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start server + client
npm run dev
```

| Service | URL |
| ------- | --- |
| Client (React) | http://localhost:5173 |
| Server (WebSocket) | ws://localhost:3001 |

## Scripts

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Build shared packages, then start server and client together |
| `npm run dev:server` | Server only (`ws://localhost:3001`) |
| `npm run dev:client` | Client only (`http://localhost:5173`) |
| `npm run build` | Build all packages and apps |
| `npm run test` | Run fuel calculation tests (Vitest) |
| `npm run lint` | ESLint across the monorepo |
| `npm run format` | Format code with Prettier |

## Project Structure

```text
nasa-fuel-calculator/
├── apps/
│   ├── client/          # Vite + React SPA
│   └── server/          # Node.js WebSocket server
├── packages/
│   ├── fuel-core/       # Fuel calculation logic + tests
│   └── shared/          # Shared types and domain constants
└── package.json         # npm workspaces root
```

## Backend

The server validates incoming messages with Zod, calculates fuel via `@nasa-fuel/fuel-core`, and responds over WebSocket.

### WebSocket API

**Connect:** `ws://localhost:3001`

**Request** (sent on every input change):

```json
{
  "mass": 28801,
  "flightPath": [
    { "action": "launch", "planet": "earth" },
    { "action": "land", "planet": "moon" }
  ]
}
```

**Success response:**

```json
{
  "totalFuel": 51898,
  "breakdown": [
    { "action": "launch", "planet": "earth", "fuel": 32988 }
  ]
}
```

**Error response:**

```json
{ "error": "Mass must be a positive number" }
```

### Run server only

```bash
npm run dev:server
```

Override the port with `PORT=4000 npm run dev:server`.

### Test the server manually

With the server running, use a WebSocket client (browser devtools, [websocat](https://github.com/vi/websocat), or similar):

```bash
# Example with websocat
websocat ws://localhost:3001
```

Paste a JSON request:

```json
{"mass":28801,"flightPath":[{"action":"launch","planet":"earth"},{"action":"land","planet":"moon"},{"action":"launch","planet":"moon"},{"action":"land","planet":"earth"}]}
```

Expected `totalFuel`: **51898** (Apollo 11 scenario).

## Tests

Fuel calculation logic is tested in `packages/fuel-core`:

```bash
npm test
```

Or run only fuel-core tests:

```bash
npm test -w @nasa-fuel/fuel-core
```

Acceptance scenarios (must match exactly):

| Mission | Mass (kg) | Total Fuel (kg) |
| ------- | --------- | --------------- |
| Apollo 11 | 28,801 | 51,898 |
| Mars Mission | 14,606 | 33,388 |
| Passenger Ship | 75,432 | 212,161 |

## Production Build

```bash
npm run build
npm run start -w @nasa-fuel/server   # run compiled server
npm run preview -w @nasa-fuel/client # preview built client
```

## Further Reference

See [AGENTS.md](AGENTS.md) for architecture boundaries, domain rules, and contributor guidelines.
