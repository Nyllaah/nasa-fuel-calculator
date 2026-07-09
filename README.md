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

| Service            | URL                   |
| ------------------ | --------------------- |
| Client (React)     | http://localhost:5173 |
| Server (WebSocket) | ws://localhost:3001   |

## Frontend

Vite + React SPA with a drag-and-drop route builder. Fuel results update in real time over WebSockets — there is no submit button.

The UI is in Brazilian Portuguese (`apps/client/src/constants/ui.ts`).

### Configuration

The client connects to the WebSocket server via `VITE_WS_URL`. Default: `ws://localhost:3001`.

```bash
cp apps/client/.env.example apps/client/.env
```

Change `VITE_WS_URL` if the server runs on another host or port.

### Using the UI

1. **Connection** — the header shows link status (connecting, connected, disconnected).
2. **Build a route** — drag planets from the palette into the drop zones:
   - First stop = launch origin
   - Last stop = final landing
   - Middle stops = intermediate destinations
   - Use **+ Adicionar parada** for multi-leg missions (up to 6 stops)
   - You cannot place the same planet on consecutive stops
3. **Enter mass** — dry spacecraft mass in kg (payload + structure, no propellant). Invalid values show an inline warning and are not sent to the server.
4. **View results** — total propellant and a per-step breakdown appear automatically when the route is complete and the server is connected.

### Example: Apollo 11

| Field               | Value                |
| ------------------- | -------------------- |
| Mass                | 28,801 kg            |
| Route               | Earth → Moon → Earth |
| Expected total fuel | 51,898 kg            |

### Run client only

```bash
npm run dev:client
```

Requires a running WebSocket server at `VITE_WS_URL`.

## Scripts

| Command              | Description                                                  |
| -------------------- | ------------------------------------------------------------ |
| `npm run dev`        | Build shared packages, then start server and client together |
| `npm run dev:server` | Server only (`ws://localhost:3001`)                          |
| `npm run dev:client` | Client only (`http://localhost:5173`)                        |
| `npm run build`      | Build all packages and apps                                  |
| `npm run test`       | Run fuel calculation tests (Vitest)                          |
| `npm run lint`       | ESLint across the monorepo                                   |
| `npm run format`     | Format code with Prettier                                    |

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
  "breakdown": [{ "action": "launch", "planet": "earth", "fuel": 32988 }]
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
{
  "mass": 28801,
  "flightPath": [
    { "action": "launch", "planet": "earth" },
    { "action": "land", "planet": "moon" },
    { "action": "launch", "planet": "moon" },
    { "action": "land", "planet": "earth" }
  ]
}
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

| Mission        | Mass (kg) | Total Fuel (kg) |
| -------------- | --------- | --------------- |
| Apollo 11      | 28,801    | 51,898          |
| Mars Mission   | 14,606    | 33,388          |
| Passenger Ship | 75,432    | 212,161         |

## Production Build

```bash
npm run build
npm run start -w @nasa-fuel/server   # run compiled server
npm run preview -w @nasa-fuel/client # preview built client
```

## Further Reference

See [AGENTS.md](AGENTS.md) for architecture boundaries, domain rules, and contributor guidelines.

---

# Calculadora de Combustível NASA

Calculadora interplanetária de combustível para o desafio full-stack da NEX Energy. Monte uma rota de voo, informe a massa da nave e receba a estimativa de combustível em tempo real via WebSockets.

## Pré-requisitos

- **Node.js** 20 ou superior
- **npm** 10 ou superior (incluído com o Node)

## Início rápido

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar servidor + cliente
npm run dev
```

| Serviço              | URL                   |
| -------------------- | --------------------- |
| Cliente (React)      | http://localhost:5173 |
| Servidor (WebSocket) | ws://localhost:3001   |

## Frontend

SPA em Vite + React com construtor de rota por arrastar e soltar. Os resultados de combustível são atualizados em tempo real via WebSockets — não há botão de envio.

A interface está em português brasileiro (`apps/client/src/constants/ui.ts`).

### Configuração

O cliente se conecta ao servidor WebSocket por meio de `VITE_WS_URL`. Padrão: `ws://localhost:3001`.

```bash
cp apps/client/.env.example apps/client/.env
```

Altere `VITE_WS_URL` se o servidor estiver em outro host ou porta.

### Como usar a interface

1. **Conexão** — o cabeçalho exibe o status do link (conectando, conectado, desconectado).
2. **Montar a rota** — arraste planetas da paleta para as zonas de pouso:
   - Primeira parada = origem da decolagem
   - Última parada = pouso final
   - Paradas intermediárias = destinos no meio do trajeto
   - Use **+ Adicionar parada** para missões com vários trechos (até 6 paradas)
   - Não é permitido colocar o mesmo planeta em paradas consecutivas
3. **Informar a massa** — massa seca da nave em kg (carga útil + estrutura, sem propelente). Valores inválidos exibem aviso inline e não são enviados ao servidor.
4. **Ver resultados** — propelente total e detalhamento por etapa aparecem automaticamente quando a rota está completa e o servidor está conectado.

### Exemplo: Apollo 11

| Campo                      | Valor               |
| -------------------------- | ------------------- |
| Massa                      | 28.801 kg           |
| Rota                       | Terra → Lua → Terra |
| Combustível total esperado | 51.898 kg           |

### Executar só o cliente

```bash
npm run dev:client
```

Requer um servidor WebSocket em execução em `VITE_WS_URL`.

## Scripts

| Comando              | Descrição                                                            |
| -------------------- | -------------------------------------------------------------------- |
| `npm run dev`        | Compila os pacotes compartilhados e inicia servidor e cliente juntos |
| `npm run dev:server` | Apenas o servidor (`ws://localhost:3001`)                            |
| `npm run dev:client` | Apenas o cliente (`http://localhost:5173`)                           |
| `npm run build`      | Compila todos os pacotes e apps                                      |
| `npm run test`       | Executa os testes de cálculo de combustível (Vitest)                 |
| `npm run lint`       | ESLint em todo o monorepo                                            |
| `npm run format`     | Formata o código com Prettier                                        |

## Estrutura do projeto

```text
nasa-fuel-calculator/
├── apps/
│   ├── client/          # SPA Vite + React
│   └── server/          # Servidor WebSocket Node.js
├── packages/
│   ├── fuel-core/       # Lógica de cálculo de combustível + testes
│   └── shared/          # Tipos compartilhados e constantes de domínio
└── package.json         # Raiz do monorepo npm workspaces
```

## Backend

O servidor valida mensagens recebidas com Zod, calcula o combustível via `@nasa-fuel/fuel-core` e responde pelo WebSocket.

### API WebSocket

**Conectar:** `ws://localhost:3001`

**Requisição** (enviada a cada alteração de entrada):

```json
{
  "mass": 28801,
  "flightPath": [
    { "action": "launch", "planet": "earth" },
    { "action": "land", "planet": "moon" }
  ]
}
```

**Resposta de sucesso:**

```json
{
  "totalFuel": 51898,
  "breakdown": [{ "action": "launch", "planet": "earth", "fuel": 32988 }]
}
```

**Resposta de erro:**

```json
{ "error": "Mass must be a positive number" }
```

### Executar só o servidor

```bash
npm run dev:server
```

Altere a porta com `PORT=4000 npm run dev:server`.

### Testar o servidor manualmente

Com o servidor em execução, use um cliente WebSocket (devtools do navegador, [websocat](https://github.com/vi/websocat) ou similar):

```bash
# Exemplo com websocat
websocat ws://localhost:3001
```

Cole uma requisição JSON:

```json
{
  "mass": 28801,
  "flightPath": [
    { "action": "launch", "planet": "earth" },
    { "action": "land", "planet": "moon" },
    { "action": "launch", "planet": "moon" },
    { "action": "land", "planet": "earth" }
  ]
}
```

`totalFuel` esperado: **51898** (cenário Apollo 11).

## Testes

A lógica de cálculo de combustível é testada em `packages/fuel-core`:

```bash
npm test
```

Ou apenas os testes do fuel-core:

```bash
npm test -w @nasa-fuel/fuel-core
```

Cenários de aceitação (devem coincidir exatamente):

| Missão         | Massa (kg) | Combustível total (kg) |
| -------------- | ---------- | ---------------------- |
| Apollo 11      | 28.801     | 51.898                 |
| Mars Mission   | 14.606     | 33.388                 |
| Passenger Ship | 75.432     | 212.161                |

## Build de produção

```bash
npm run build
npm run start -w @nasa-fuel/server   # executar servidor compilado
npm run preview -w @nasa-fuel/client # visualizar cliente compilado
```

## Referência adicional

Consulte [AGENTS.md](AGENTS.md) para limites de arquitetura, regras de domínio e orientações para contribuidores.
