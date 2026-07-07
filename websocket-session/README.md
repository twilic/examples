# WebSocket Session

Stream live dashboard metrics over WebSocket with stateful Twilic compression.

## Profile

**Stateful** — `createSessionEncoder()` with `encode()` for the first frame and `encodePatch()` when only a few fields change.

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

- **simulate.ts** — 20 ticks of dashboard metrics; compares JSON, full `encode()`, and `encodePatch()` sizes per tick
- **server.ts** — sends binary frames every second; first tick is full, later ticks use patches
- **client.ts** — logs frame sizes and decodes when possible

## When this fits

- Live dashboards and game state
- Ordered, reliable streams where most fields stay stable
- Scenarios where 2–3 of 15 fields change per update

## Session recovery

Call `session.reset()` after a disconnect so the next frame is a full stateless message, then resume patching.

## JS SDK note

The current `@twilic/core` SDK exposes session **encode** APIs. Patch frame decoding on the client may require a matching session decoder in your language SDK. Use `simulate.ts` to evaluate payload savings; treat the WebSocket demo as a binary transport example.
