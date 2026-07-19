import type { TwilicValue } from "@twilic/core";

/** Port for the HTTP adapter round-trip demo (api-response uses 8787). */
export const PORT = 8788;

export const BASE_URL = `http://localhost:${PORT}`;

/** Sample Dynamic Profile payload with a 64-bit id. */
export const sampleRequest: TwilicValue = {
  id: 1001n,
  name: "alice",
  role: "admin",
  active: true,
};

export function logServerReady(framework: string): void {
  console.log(`\n${framework} Twilic server listening on ${BASE_URL}`);
  console.log(
    `  POST /echo — Twilic request/response (${"application/vnd.twilic"})`,
  );
  console.log(`\nIn another terminal:`);
  console.log(`  pnpm example:http-roundtrip:client`);
  console.log(`  pnpm example:http-roundtrip:axios`);
}

export function logClientResult(label: string, data: unknown): void {
  console.log(`[${label}] response:`);
  console.dir(data, { depth: null });
}
