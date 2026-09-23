# WebSocket Session

Stream live dashboard metrics over WebSocket with the Twilic WebSocket Stateful Profile.

## Profile

**Stateful** — `createTwilicWebSocket(socket, { stateful: true })` binds one connection. `send()` uses `encodePatch()`: the first frame is a full snapshot, and later frames are patches when a single field changes.

## Packages

| Side | Package | Helpers |
| --- | --- | --- |
| Server | `@twilic/websocket` | `createTwilicWebSocket(socket, { stateful: true })` and `send` |
| Client | `@twilic/websocket` | `createTwilicWebSocket(socket, { stateful: true })` and `onMessage` |

The live server and client use `@twilic/websocket`. The simulation uses `@twilic/core` `createSessionEncoder()` and `createSessionDecoder()` directly.

## Run

Simulation (size comparison, recommended first):

```bash
pnpm example:websocket:simulate
```

Live WebSocket demo:

```bash
# terminal 1
pnpm example:websocket

# terminal 2
pnpm example:websocket:client
```

## What it shows

- **simulate.ts** — 20 ticks of dashboard metrics; compares JSON, stateless `encode()`, and session `encodePatch()` sizes, and decodes each frame with `createSessionDecoder()`
- **server.ts** — sends one binary frame per second through a stateful `send()`; the first tick is a full snapshot and later ticks are patches
- **client.ts** — `onMessage()` reconstructs every tick, including patch frames

## When this fits

- Live dashboards and game state
- Ordered, reliable streams where most fields stay stable
- Scenarios where one field of a stable object changes per update

## Session recovery

Each WebSocket has its own directional session. Closing the socket discards that session. The next connection starts again with a full snapshot; previous base snapshots are not inherited. Pass the same session options on both sides (`maxBaseSnapshots: 8` in this demo).
