# Twilic Examples

Official example projects and real-world use cases for Twilic.

Twilic Examples is a collection of practical examples that show how Twilic can be used in real applications. The goal of this repository is to make Twilic easier to understand, evaluate, and adopt by demonstrating concrete use cases instead of only providing the specification or library API.

Twilic is especially useful when data contains repeated structures, repeated strings, homogeneous records, batched payloads, or session-based updates. These examples show how Twilic can be used as a compact binary representation for APIs, WebSocket messages, telemetry data, logs, cache payloads, and other structured data.

## Prerequisites

- Node.js 24+
- [Bun](https://bun.sh/) (recommended)

## Setup

```bash
bun install
```

## Examples

| Example | Profile | Command |
| --- | --- | --- |
| [api-response](api-response/) | Stateless Batch | `bun run example:api-response` |
| [http-roundtrip](http-roundtrip/) | Stateless Dynamic | `bun run example:http-roundtrip` |
| [websocket-session](websocket-session/) | Stateful | `bun run example:websocket:simulate` |
| [batch-records](batch-records/) | Batch | `bun run example:batch-records` |
| [telemetry](telemetry/) | Batch (`col_batch`) | `bun run example:telemetry` |
| [logs](logs/) | Dynamic + Batch | `bun run example:logs` |
| [cache-payload](cache-payload/) | Dynamic (stateless) | `bun run example:cache-payload` |

### API response (HTTP)

```bash
# terminal 1
bun run example:api-response

# terminal 2
bun run example:api-response:client
```

### HTTP adapter round-trip

Express / Hono / Fastify server with fetch or Axios client. Both sides use `application/vnd.twilic`.

```bash
# terminal 1 — pick one
bun run example:http-roundtrip
bun run example:http-roundtrip:hono
bun run example:http-roundtrip:fastify

# terminal 2 — pick one
bun run example:http-roundtrip:client
bun run example:http-roundtrip:axios
```

### WebSocket session

```bash
# size comparison (recommended first)
bun run example:websocket:simulate

# live stream
bun run example:websocket          # terminal 1
bun run example:websocket:client   # terminal 2
```

### CLI examples

```bash
bun run example:batch-records
bun run example:telemetry
bun run example:logs
bun run example:cache-payload
```

## Goals

- Show practical use cases for Twilic
- Compare Twilic with JSON and MessagePack where useful
- Provide small examples that are easy to run and modify
- Demonstrate Twilic features such as batch encoding, compact payloads, and session patches
- Help developers decide when Twilic is a good fit

## When Twilic Fits Well

Twilic is designed to work well with data that has repeated patterns. It can be a good fit when many messages share the same object shape, when the same strings appear repeatedly, when records are sent in batches, or when only small changes need to be sent after the first message.

Twilic is not intended to replace every serialization format in every situation. These examples are designed to make the trade-offs visible and help developers choose Twilic for the right use cases.

## Related resources

- [Cookbook](https://github.com/twilic/website/blob/main/docs/guide/cookbook.md) — practical patterns
- [Playground](https://github.com/twilic/playground) — interactive size comparison
- [Benchmark](https://github.com/twilic/benchmark) — encode/decode throughput
- [@twilic/core](https://www.npmjs.com/package/@twilic/core) — JavaScript SDK

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
