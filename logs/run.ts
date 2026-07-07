import { encode, createSessionEncoder } from "@twilic/core";
import { encodeBatch } from "@twilic/core/advanced";
import {
  formatBytes,
  jsonBytes,
  msgpackBytes,
  printSizeTable,
} from "../shared/compare.js";
import { makeLogEvents } from "../shared/fixtures.js";

const TOTAL = 1000;
const FLUSH_SIZE = 100;

const events = makeLogEvents(TOTAL);

const perEventTwilic = events.reduce<number>(
  (sum, event) => sum + encode(event).byteLength,
  0,
);

const batchChunks: ReturnType<typeof makeLogEvents>[] = [];
for (let i = 0; i < TOTAL; i += FLUSH_SIZE) {
  batchChunks.push(events.slice(i, i + FLUSH_SIZE));
}
const batchedTwilic = batchChunks.reduce<number>(
  (sum, chunk) => sum + encodeBatch(chunk).byteLength,
  0,
);

const session = createSessionEncoder();
const microBatches: ReturnType<typeof makeLogEvents>[] = [];
for (let i = 0; i < TOTAL; i += 50) {
  microBatches.push(events.slice(i, i + 50));
}
const microTwilic = microBatches.reduce<number>(
  (sum, chunk) => sum + session.encodeMicroBatch(chunk).byteLength,
  0,
);

const ndjsonBytes = events.reduce<number>(
  (sum, event) => sum + jsonBytes(event) + 1,
  0,
);

console.log("Twilic logs example\n");
console.log(`Structured log events: ${TOTAL}\n`);

printSizeTable([
  { label: "NDJSON (1 line each)", bytes: ndjsonBytes },
  {
    label: "Twilic encode each",
    bytes: perEventTwilic,
  },
  {
    label: `Twilic encodeBatch (${FLUSH_SIZE}/flush)`,
    bytes: batchedTwilic,
  },
  {
    label: "Twilic encodeMicroBatch (50/burst)",
    bytes: microTwilic,
  },
]);

console.log("\nReference (full payload as single JSON array):");
printSizeTable([
  { label: "JSON", bytes: jsonBytes(events) },
  { label: "MessagePack", bytes: msgpackBytes(events) },
  { label: "Twilic encodeBatch (all)", bytes: encodeBatch(events).byteLength },
]);

console.log(
  `\nBatching saves ${formatBytes(perEventTwilic - batchedTwilic)} vs per-event encode.`,
);
