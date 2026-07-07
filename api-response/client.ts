import { decode } from "@twilic/core";
import { twilicFetch } from "@twilic/fetch";

const BASE_URL = "http://localhost:8787";

const response = await twilicFetch(`${BASE_URL}/users`);
const bytes = new Uint8Array(await response.arrayBuffer());
const decoded = decode(bytes);

const records = Array.isArray(decoded) ? decoded : [decoded];
const count = response.headers.get("X-Record-Count") ?? String(records.length);

console.log("Twilic api-response client\n");
console.log(`Status: ${response.status}`);
console.log(`Content-Type: ${response.headers.get("content-type")}`);
console.log(`Payload: ${bytes.byteLength} bytes`);
console.log(`Records: ${count}`);
console.log(
  `First user: ${JSON.stringify(records[0], (_, v) => (typeof v === "bigint" ? v.toString() : v))}`,
);

const jsonResponse = await fetch(`${BASE_URL}/users.json`);
const jsonBytes = new Uint8Array(await jsonResponse.arrayBuffer());

console.log(`\nJSON comparison: ${jsonBytes.byteLength} bytes`);
console.log(
  `Twilic saves ${jsonBytes.byteLength - bytes.byteLength} bytes (${(((jsonBytes.byteLength - bytes.byteLength) / jsonBytes.byteLength) * 100).toFixed(1)}%)`,
);
