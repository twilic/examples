import assert from "node:assert/strict";
import {
  createSessionDecoder,
  createSessionEncoder,
  encode,
} from "@twilic/core";
import { formatBytes, jsonBytes } from "../shared/compare.js";
import { makeMetrics, tickMetrics } from "../shared/fixtures.js";

const TICKS = 20;
const STATE_PATCH = 0x0a;

console.log("Twilic websocket-session simulation\n");
console.log("Dashboard metrics: 15 fields, one field changes per tick\n");

const session = createSessionEncoder({ maxBaseSnapshots: 8 });
const decoder = createSessionDecoder({ maxBaseSnapshots: 8 });
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
  const fullSize = encode(value).byteLength;
  const patchBytes = session.encodePatch(value);
  decoder.decode(patchBytes);

  const tickLabel = String(tick).padStart(4);
  console.log(
    `${tickLabel}  ${formatBytes(jsonSize).padStart(10)}  ${formatBytes(fullSize).padStart(10)}  ${formatBytes(patchBytes.byteLength).padStart(13)}`,
  );
}

console.log("\nAfter disconnect — session.reset() then a new full frame:");
session.reset();
decoder.reset();
const afterReset = session.encodePatch(makeMetrics());
assert.notEqual(afterReset[0], STATE_PATCH);
decoder.decode(afterReset);
console.log(`  full frame: ${formatBytes(afterReset.byteLength)}`);

console.log(
  "\nencodePatch() keeps one directional session. The first frame is a full snapshot; later frames are patches when one field changes.",
);
console.log(
  "The live WebSocket demo uses createTwilicWebSocket({ stateful: true }); see websocket-session/README.md.",
);
