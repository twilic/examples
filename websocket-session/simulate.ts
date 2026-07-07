import { createSessionEncoder } from "@twilic/core";
import { formatBytes } from "../shared/compare.js";
import { jsonBytes } from "../shared/compare.js";
import { makeMetrics, tickMetrics } from "../shared/fixtures.js";

const TICKS = 20;

console.log("Twilic websocket-session simulation\n");
console.log("Dashboard metrics: 15 fields, 2–3 fields change per tick\n");

const session = createSessionEncoder();
let base = makeMetrics();

const header = "Tick  JSON        encode()    encodePatch()";
console.log(header);
console.log("-".repeat(header.length));

for (let tick = 0; tick < TICKS; tick++) {
  const value = tick === 0 ? base : tickMetrics(base, tick);
  if (tick > 0) {
    base = value;
  }

  const jsonSize = jsonBytes(value);
  const fullSize = session.encode(value).byteLength;
  const patchSize =
    tick === 0 ? fullSize : session.encodePatch(value).byteLength;

  const tickLabel = String(tick).padStart(4);
  console.log(
    `${tickLabel}  ${formatBytes(jsonSize).padStart(10)}  ${formatBytes(fullSize).padStart(10)}  ${formatBytes(patchSize).padStart(13)}`,
  );
}

console.log("\nAfter disconnect — session.reset() then full frame:");
session.reset();
const afterReset = session.encode(makeMetrics());
console.log(`  full frame: ${formatBytes(afterReset.byteLength)}`);

console.log(
  "\nUse encodePatch() on ordered streams when only a few fields change per tick.",
);
console.log(
  "The live WebSocket demo streams binary frames; see websocket-session/README.md.",
);
