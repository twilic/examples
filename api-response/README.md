# API Response

Return paginated user lists as compact Twilic batch payloads over HTTP.

## Profile

**Stateless Batch** — `encodeBatch` with shape and string interning across same-shape records.

## Run

```bash
# terminal 1
pnpm example:api-response

# terminal 2
pnpm example:api-response:client
```

## Endpoints

| Route             | Format                                  |
| ----------------- | --------------------------------------- |
| `GET /users`      | Twilic batch (`application/vnd.twilic`) |
| `GET /users.json` | JSON (size comparison)                  |

## What it shows

50 user records with 8 fields each. Field names are sent once; repeated strings like `"admin"` and `"us-east"` are interned. The server prints a size table on startup; the client compares Twilic vs JSON byte counts.

## When this fits

- REST list endpoints with repeated object shapes
- Mobile or edge clients that fetch many pages
- APIs where bandwidth matters more than human-readable JSON

## Note

Use stateless Dynamic or Batch profiles for HTTP. Stateful session compression requires an ordered stream and is not used here.
