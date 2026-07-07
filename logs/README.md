# Logs

Structured log shipping with string and shape interning.

## Profile

**Dynamic + Batch** — repeated `level`, `service`, and field names compress well when events are grouped.

## Run

```bash
pnpm example:logs
```

## What it shows

1,000 structured log events compared as:

- NDJSON (one JSON object per line)
- Twilic `encode` per event
- Twilic `encodeBatch` in 100-event flushes
- Twilic `encodeMicroBatch` in 50-event bursts

## When this fits

- Log agents that flush on an interval
- Bursty application logging
- Pipelines where the same strings appear across many events

## Trade-off

Per-event encoding is simple but repeats field names and common strings. Batching or micro-batching amortizes that overhead across each flush.
