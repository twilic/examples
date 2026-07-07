# Telemetry

Batch high-frequency telemetry events with column-oriented compression.

## Profile

**Batch** — `col_batch` compresses each column independently (`DELTA_BITPACK`, `RLE`, etc.).

## Run

```bash
pnpm example:telemetry
```

## What it shows

Telemetry events with repeated `service` and `level` values, batched at 16, 64, and 256 records. The script prints JSON, MessagePack, and Twilic sizes for each batch size.

## When this fits

- Metrics and observability pipelines
- Time series with stable field shapes
- Throughput-optimized ingestion where larger batches are acceptable

## Batch size tuning

- **16–64 records** — lower latency per flush
- **256+ records** — better compression on numeric and enum-like columns
