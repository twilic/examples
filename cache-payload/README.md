# Cache Payload

Store compact binary session blobs in a key-value cache.

## Profile

**Dynamic (stateless)** — each value is encoded independently with `encode` and decoded with `decode`.

## Run

```bash
pnpm example:cache-payload
```

## What it shows

100 user session objects stored in an in-memory `Map<string, Uint8Array>`, with total size compared against JSON strings. A roundtrip decode verifies data integrity.

## When this fits

- Redis, Memcached, or CDN edge caches
- Session stores with stable object shapes
- Config snapshots that are read more often than they change

## Note

Use stateless encoding per cache key. Stateful session compression is for ordered streams, not unrelated KV entries.
