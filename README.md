# NASA Fuel Calculator

- Para o README.md em PT-BR, refira-se ao fim desde arquivo.

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

The UI supports English and Brazilian Portuguese. Use the **language dropdown** in the header to switch (`apps/client/src/constants/ui.ts`, `apps/client/src/constants/errors.ts`). Default locale is `pt-BR` (persisted in `localStorage`). Client-side errors are localized; server WebSocket errors are returned in English.

### Configuration

The client connects to the WebSocket server via `VITE_WS_URL`. Default: `ws://localhost:3001`.

```bash
cp apps/client/.env.example apps/client/.env
```

Change `VITE_WS_URL` if the server runs on another host or port.

### Using the UI

1. **Connection** — the header shows link status (connecting, connected, disconnected, error) and the language selector.
2. **Build a route** — drag planets from the palette into the drop zones:
   - First stop = launch origin
   - Last stop = final landing
   - Middle stops = intermediate destinations
   - Use **+ Add stop** (or **+ Adicionar parada** in Portuguese) for multi-leg missions (up to 6 stops)
   - You cannot place the same planet on consecutive stops
3. **Enter mass** — dry spacecraft mass in kg (payload + structure, no propellant). Invalid values show an inline warning and are not sent to the server.
4. **View results** — total propellant and a per-step breakdown appear automatically when the route is complete and the server is connected. A **Calculating…** indicator shows while waiting for the server response.

The app starts with two empty stops and a default mass of 28,801 kg. Results are not shown until every stop is filled.

**Stops → API steps:** each pair of consecutive stops becomes a launch/land leg. For example, `Earth → Moon → Earth` sends:

```text
launch earth → land moon → launch moon → land earth
```

### Example: Apollo 11

Build this route manually in the UI (the app does not pre-fill it on load):

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

| Command                | Description                                                  |
| ---------------------- | ------------------------------------------------------------ |
| `npm run dev`          | Build shared packages, then start server and client together |
| `npm run dev:server`   | Rebuild shared packages, then server only (`ws://localhost:3001`) |
| `npm run dev:client`   | Client only (`http://localhost:5173`; does not rebuild packages) |
| `npm run build`        | Build all packages and apps                                  |
| `npm run test`         | Rebuild shared packages, then run Vitest across workspaces   |
| `npm run lint`         | ESLint across the monorepo                                   |
| `npm run lint:fix`     | ESLint with auto-fix                                         |
| `npm run format`       | Format code with Prettier                                    |
| `npm run format:check` | Check formatting without writing files                       |

## Project Structure

```text
nasa-fuel-calculator/
├── apps/
│   ├── client/          # Vite + React SPA
│   └── server/          # Node.js WebSocket server
├── packages/
│   ├── fuel-core/       # Fuel calculation logic + tests
│   └── shared/          # Shared types, constants, and flight-path validation
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

**Success response** (example for Earth → Moon with mass 28,801 kg):

```json
{
  "totalFuel": 22380,
  "breakdown": [
    { "action": "launch", "planet": "earth", "fuel": 20845 },
    { "action": "land", "planet": "moon", "fuel": 1535 }
  ]
}
```

The UI derives `flightPath` from waypoint stops before sending (see [Using the UI](#using-the-ui)).

**Error responses:**

```json
{ "error": "Mass must be a positive number" }
```

```json
{ "error": "Launch and land cannot be on the same planet" }
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

A interface suporta inglês e português brasileiro. Use o **seletor de idioma** no cabeçalho para alternar (`apps/client/src/constants/ui.ts`, `apps/client/src/constants/errors.ts`). O idioma padrão é `pt-BR` (persistido em `localStorage`). Erros do lado do cliente são localizados; erros do servidor WebSocket são retornados em inglês.

### Configuração

O cliente se conecta ao servidor WebSocket por meio de `VITE_WS_URL`. Padrão: `ws://localhost:3001`.

```bash
cp apps/client/.env.example apps/client/.env
```

Altere `VITE_WS_URL` se o servidor estiver em outro host ou porta.

### Como usar a interface

1. **Conexão** — o cabeçalho exibe o status do link (conectando, conectado, desconectado, erro) e o seletor de idioma.
2. **Montar a rota** — arraste planetas da paleta para as zonas de pouso:
   - Primeira parada = origem da decolagem
   - Última parada = pouso final
   - Paradas intermediárias = destinos no meio do trajeto
   - Use **+ Adicionar parada** (ou **+ Add stop** em inglês) para missões com vários trechos (até 6 paradas)
   - Não é permitido colocar o mesmo planeta em paradas consecutivas
3. **Informar a massa** — massa seca da nave em kg (carga útil + estrutura, sem propelente). Valores inválidos exibem aviso inline e não são enviados ao servidor.
4. **Ver resultados** — propelente total e detalhamento por etapa aparecem automaticamente quando a rota está completa e o servidor está conectado. Um indicador **Calculando…** aparece enquanto aguarda a resposta do servidor.

O app inicia com duas paradas vazias e massa padrão de 28.801 kg. Os resultados só aparecem quando todas as paradas estão preenchidas.

**Paradas → etapas da API:** cada par de paradas consecutivas vira um trecho decolagem/pouso. Por exemplo, `Terra → Lua → Terra` envia:

```text
launch earth → land moon → launch moon → land earth
```

### Exemplo: Apollo 11

Monte esta rota manualmente na interface (o app não pré-preenche ao carregar):

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

| Comando                | Descrição                                                            |
| ---------------------- | -------------------------------------------------------------------- |
| `npm run dev`          | Compila os pacotes compartilhados e inicia servidor e cliente juntos |
| `npm run dev:server`   | Recompila pacotes compartilhados, depois apenas o servidor (`ws://localhost:3001`) |
| `npm run dev:client`   | Apenas o cliente (`http://localhost:5173`; não recompila pacotes)  |
| `npm run build`        | Compila todos os pacotes e apps                                      |
| `npm run test`         | Recompila pacotes compartilhados e executa Vitest nos workspaces     |
| `npm run lint`         | ESLint em todo o monorepo                                            |
| `npm run lint:fix`     | ESLint com correção automática                                       |
| `npm run format`       | Formata o código com Prettier                                        |
| `npm run format:check` | Verifica formatação sem alterar arquivos                             |

## Estrutura do projeto

```text
nasa-fuel-calculator/
├── apps/
│   ├── client/          # SPA Vite + React
│   └── server/          # Servidor WebSocket Node.js
├── packages/
│   ├── fuel-core/       # Lógica de cálculo de combustível + testes
│   └── shared/          # Tipos compartilhados, constantes e validação de rota
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

**Resposta de sucesso** (exemplo para Terra → Lua com massa 28.801 kg):

```json
{
  "totalFuel": 22380,
  "breakdown": [
    { "action": "launch", "planet": "earth", "fuel": 20845 },
    { "action": "land", "planet": "moon", "fuel": 1535 }
  ]
}
```

A interface deriva `flightPath` a partir das paradas antes de enviar (veja [Como usar a interface](#como-usar-a-interface)).

**Respostas de erro:**

```json
{ "error": "Mass must be a positive number" }
```

```json
{ "error": "Launch and land cannot be on the same planet" }
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
