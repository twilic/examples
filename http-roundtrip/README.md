# HTTP Round-Trip

Exchange Twilic request and response bodies over HTTP using the official adapters.

## Profile

**Stateless Dynamic** — one POST echo. Use Dynamic or Batch for HTTP; do not use Stateful session compression on request/response pairs.

## What it shows

| Side    | Packages                                             |
| ------- | ---------------------------------------------------- |
| Servers | `@twilic/express`, `@twilic/hono`, `@twilic/fastify` |
| Clients | `@twilic/fetch`, `@twilic/axios`                     |

`POST /echo` accepts `application/vnd.twilic`, decodes into `twilicBody`, and replies with `{ ok, via, received }` as Twilic.

## Run

Start any one server, then a client in a second terminal.

```bash
# terminal 1 — pick one server
pnpm example:http-roundtrip           # Express (default)
pnpm example:http-roundtrip:hono
pnpm example:http-roundtrip:fastify

# terminal 2 — pick one client
pnpm example:http-roundtrip:client    # fetch
pnpm example:http-roundtrip:axios
```

Default URL: `http://localhost:8788/echo`.

## When this fits

- Internal service-to-service APIs that already speak JSON maps
- Replacing JSON bodies with Twilic without changing route shapes
- Pairing a Node server adapter with a browser or Node client helper

## Related

- [Web Integrations](https://github.com/twilic/website/blob/main/docs/guide/web-integrations.md)
- [api-response](../api-response/) — Batch list endpoint size comparison (GET)
