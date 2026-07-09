# NASA Fuel Calculator — Agent Guide

Canonical reference for agents and contributors. Cursor rules are thin pointers to this file — do not duplicate content there.

Interplanetary fuel calculator for the NEX Energy full-stack code challenge. Users build flight paths, enter spacecraft mass, and see fuel calculations update in real time over WebSockets.

## Tech Stack

| Layer | Technology |
| ----- | ---------- |
| Monorepo | npm workspaces |
| Language | TypeScript (strict) |
| Frontend | React, Vite |
| Backend | Node.js, WebSockets (`ws`) |
| Validation | Zod (server) |
| Testing | Vitest (`packages/fuel-core`) |
| Formatting | Prettier (no semicolons) |
| Linting | ESLint (monorepo root) |

**Runtime:** Node.js with native ESM (`"type": "module"`). Packages compile with `tsc`; the client bundles with Vite.

**Real-time:** Persistent WebSocket connection between client and server — no REST submit flow.

## Monorepo Layout

```text
nasa-fuel-calculator/
├── apps/
│   ├── client/          # Vite + React SPA
│   └── server/          # Node.js WebSocket server + validation/errors
├── packages/
│   ├── fuel-core/       # Pure fuel calculation logic (Vitest)
│   └── shared/          # Types + domain constants (actions, planets, gravity)
├── package.json
└── AGENTS.md
```

## Package Boundaries

| Package | Responsibility |
| ------- | -------------- |
| `packages/fuel-core` | All fuel calculation logic. Pure functions only. |
| `packages/shared` | Shared types and domain constants (`ACTIONS`, `PLANETS`, `GRAVITY`). |
| `apps/server` | WebSocket transport, Zod validation, error messages, calls `fuel-core`. |
| `apps/client` | React UI. Flight path builder, mass input, displays results. No calculation logic. |

## Dev Commands

```bash
npm install
npm run dev              # server (3001) + client (5173)
npm run dev:server       # server only
npm run dev:client       # client only
npm run build
npm run test
npm run lint
npm run format

# Per-package:
npm run dev -w @nasa-fuel/client
npm run dev -w @nasa-fuel/server
npm run test -w @nasa-fuel/fuel-core
```

## Naming Conventions

| Kind | Style | Example |
| ---- | ----- | ------- |
| Constant maps / lookup objects | `SCREAMING_SNAKE` keys | `errors.INVALID_JSON`, `FUEL_FORMULA` |
| Variables, functions, types | `camelCase` | `flightPath`, `calculateFuel` |
| Domain string literals | lowercase | `'earth'`, `'launch'` |
| JSON / TypeScript fields | `camelCase` | `flightPath`, `totalFuel` |

Server error messages live in `apps/server/src/constants/errors.ts` — not in `shared` or `fuel-core`.

## Domain Rules

### Formulas (rounded down with `Math.floor`)

- **Launch:** `mass × gravity × 0.042 − 33`
- **Land:** `mass × gravity × 0.033 − 42`

Implemented via `FUEL_FORMULA` map in `packages/fuel-core`.

### Fuel-for-Fuel (Recursive)

Fuel adds weight, requiring more fuel calculated with the same formula — recursively — until additional fuel is 0 or negative.

Example: Landing 28,801 kg on Earth (g = 9.807) → 13,447 total fuel.

### Planet Gravity (m/s²)

| Planet | Gravity |
| ------ | ------- |
| Earth  | 9.807   |
| Moon   | 1.62    |
| Mars   | 3.711   |

Defined in `packages/shared` as `GRAVITY`.

### Flight Path Processing

Process the flight path **in reverse order**. Later legs do not carry fuel from earlier legs, but earlier legs must carry fuel for all subsequent legs. Each step's fuel is added to the running mass for preceding steps.

## Acceptance Test Scenarios

Results must match exactly:

| Mission | Mass (kg) | Total Fuel (kg) |
| ------- | --------- | --------------- |
| Apollo 11 | 28,801 | 51,898 |
| Mars Mission | 14,606 | 33,388 |
| Passenger Ship | 75,432 | 212,161 |

Apollo 11 path: Launch Earth → Land Moon → Launch Moon → Land Earth.

## WebSocket Contract

Client sends on every input change (no submit button):

```json
{
  "mass": 28801,
  "flightPath": [
    { "action": "launch", "planet": "earth" },
    { "action": "land", "planet": "moon" }
  ]
}
```

Server responds on success:

```json
{
  "totalFuel": 51898,
  "breakdown": [
    { "action": "launch", "planet": "earth", "fuel": 32988 }
  ]
}
```

Server responds on failure:

```json
{ "error": "Mass must be a positive number" }
```

## Architecture Constraints

- Business logic lives exclusively in `packages/fuel-core`.
- Server is a thin WebSocket transport layer (validate → calculate → respond).
- Client never implements fuel formulas — server is the source of truth.
- Real-time updates: persistent WebSocket, recalculate on every input change.
- No manual submit button.

## Testing Policy

- Vitest in `packages/fuel-core` only.
- Minimum: recursive fuel logic + all three acceptance scenarios.
- Co-locate tests with source (`*.test.ts`).

## Code Style

- TypeScript strict mode.
- Functional React components with hooks.
- Shared types from `@nasa-fuel/shared`.
- Comments only for non-obvious business logic.
- Validate inputs client-side; defer fuel numbers to the server.
