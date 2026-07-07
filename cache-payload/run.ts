import { decode, encode } from "@twilic/core";
import { formatBytes, jsonBytes, printSizeTable } from "../shared/compare.js";
import { makeSessionBlob } from "../shared/fixtures.js";

const SESSION_COUNT = 100;
const store = new Map<string, Uint8Array>();

let totalJson = 0;
let totalTwilic = 0;

for (let userId = 1; userId <= SESSION_COUNT; userId++) {
  const key = `session:${userId}`;
  const value = makeSessionBlob(userId);

  const bytes = encode(value);

  store.set(key, bytes);
  totalJson += jsonBytes(value);
  totalTwilic += bytes.byteLength;
}

const sampleKey = "session:42";
const sampleBytes = store.get(sampleKey);
if (!sampleBytes) {
  throw new Error("missing sample session");
}

const roundtrip = decode(sampleBytes);

console.log("Twilic cache-payload example\n");
console.log(`In-memory KV entries: ${store.size}\n`);

printSizeTable([
  { label: "JSON strings (total)", bytes: totalJson },
  { label: "Twilic blobs (total)", bytes: totalTwilic },
]);

console.log(
  `\nSaved ${formatBytes(totalJson - totalTwilic)} across ${SESSION_COUNT} sessions.`,
);

console.log("\nRoundtrip check (session:42):");
console.log(`  user_id: ${(roundtrip as { user_id: bigint }).user_id}`);
console.log(`  email: ${(roundtrip as { email: string }).email}`);

console.log(
  "\nUse stateless encode/decode per key. Do not share a SessionEncoder across unrelated cache keys.",
);
