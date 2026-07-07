import { encodeBatch } from "@twilic/core/advanced";
import { jsonBytes, msgpackBytes, printSizeTable } from "../shared/compare.js";
import { makeTelemetryEvents } from "../shared/fixtures.js";

const BATCH_SIZES = [16, 64, 256] as const;

console.log("Twilic telemetry example\n");
console.log(
  "Synthetic events: timestamp, service, level, message, duration_ms\n",
);

for (const size of BATCH_SIZES) {
  const events = makeTelemetryEvents(size);
  const twilicBytes = encodeBatch(events).byteLength;

  console.log(`Batch size: ${size}`);
  printSizeTable([
    { label: "JSON", bytes: jsonBytes(events) },
    { label: "MessagePack", bytes: msgpackBytes(events) },
    { label: "Twilic", bytes: twilicBytes },
  ]);
  console.log();
}

console.log(
  "Larger batches improve column codec wins (delta timestamps, RLE on level).",
);
console.log("For latency-sensitive pipelines, prefer 16–64 records per batch.");
