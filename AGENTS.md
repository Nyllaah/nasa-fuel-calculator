# NASA Fuel Calculator — Agent Guide

Interplanetary fuel calculator for the NEX Energy full-stack code challenge. Users build flight paths, enter spacecraft mass, and see fuel calculations update in real time over WebSockets.

## Monorepo Layout

```text
nasa-fuel-calculator/
├── apps/
│   ├── client/          # Vite + React SPA
│   └── server/          # Node.js WebSocket server
├── packages/
│   ├── fuel-core/       # Pure fuel calculation logic (Vitest)
│   └── shared/          # WS message types + planet constants
├── package.json         # npm workspaces root
└── AGENTS.md
```

## Package Boundaries

| Package              | Responsibility                                                                     |
| -------------------- | ---------------------------------------------------------------------------------- |
| `packages/fuel-core` | All fuel calculation logic. Pure functions only.                                   |
| `packages/shared`    | Shared TypeScript types, planet constants, WS message shapes.                      |
| `apps/server`        | WebSocket transport. Validates input, calls `fuel-core`, returns results.          |
| `apps/client`        | React UI. Flight path builder, mass input, displays results. No calculation logic. |

## Dev Commands

```bash
npm install                  # Install all workspace dependencies
npm run dev                  # Start all packages with a dev script
npm run build                # Build all packages
npm run test                 # Run all workspace tests

# Per-package (once scaffolded):
npm run dev -w @nasa-fuel/client
npm run dev -w @nasa-fuel/server
npm run test -w @nasa-fuel/fuel-core
```

## Domain Rules

### Formulas (rounded down with `Math.floor`)

- **Launch:** `mass × gravity × 0.042 − 33`
- **Land:** `mass × gravity × 0.033 − 42`

### Fuel-for-Fuel (Recursive)

Fuel adds weight, requiring more fuel calculated with the same formula — recursively — until additional fuel is 0 or negative.

Example: Landing 28,801 kg on Earth (g = 9.807) → 13,447 total fuel.

### Planet Gravity (m/s²)

| Planet | Gravity |
| ------ | ------- |
| Earth  | 9.807   |
| Moon   | 1.62    |
| Mars   | 3.711   |

### Flight Path Processing

Process the flight path **in reverse order**. Later legs do not carry fuel from earlier legs, but earlier legs must carry fuel for all subsequent legs. Each step's fuel is added to the running mass for preceding steps.

## Acceptance Test Scenarios

Results must match exactly:

| Mission        | Flight Path                                                                   | Mass (kg) | Total Fuel (kg) |
| -------------- | ----------------------------------------------------------------------------- | --------- | --------------- |
| Apollo 11      | Launch Earth → Land Moon → Launch Moon → Land Earth                           | 28,801    | 51,898          |
| Mars Mission   | Launch Earth → Land Mars → Launch Mars → Land Earth                           | 14,606    | 33,388          |
| Passenger Ship | Launch Earth → Land Moon → Launch Moon → Land Mars → Launch Mars → Land Earth | 75,432    | 212,161         |

## WebSocket Contract

Client sends on every input change (no submit button):

```json
{
  "mass": 28801,
  "flight_path": [
    { "action": "launch", "planet": "earth" },
    { "action": "land", "planet": "moon" }
  ]
}
```

Server responds:

```json
{
  "total_fuel": 51898,
  "breakdown": [{ "action": "launch", "planet": "earth", "fuel": 0 }]
}
```

## Architecture Constraints

- Business logic lives exclusively in `packages/fuel-core`.
- Server is a thin WebSocket transport layer.
- Client never implements fuel formulas — server is the source of truth.
- Real-time updates are required: persistent WebSocket connection, recalculate on every input change.
- No manual submit button.

## Testing Policy

- Use Vitest in `packages/fuel-core`.
- Minimum coverage: recursive fuel logic and all three acceptance scenarios.
- Co-locate tests with source (`*.test.ts` or `*.spec.ts`).

## Code Style

- TypeScript strict mode.
- Functional React components with hooks.
- Shared types from `@nasa-fuel/shared`.
- Comments only for non-obvious business logic.
- Validate inputs client-side (positive mass, required selections) but defer fuel numbers to the server.
- Use camelCase for constants names.
