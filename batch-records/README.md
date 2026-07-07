# Batch Records

Send many homogeneous records in one payload using Twilic batch encoding.

## Profile

**Batch** — `encodeBatch` picks `row_batch` for smaller same-shape sets and `col_batch` for larger tabular data.

## Run

```bash
pnpm example:batch-records
```

## What it shows

1. **64 same-shape records** — row batch with shape interning
2. **256 telemetry-shaped records** — column batch with per-column codecs

Each scenario prints encoded sizes for JSON, MessagePack, and Twilic.

## When this fits

- Bulk exports and queue messages
- API endpoints that return many records at once
- Pipelines that flush records in groups instead of one-by-one
