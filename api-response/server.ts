import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { serve } from "@hono/node-server";
import { encodeBatch } from "@twilic/core/advanced";
import { TWILIC_CONTENT_TYPE } from "@twilic/hono";
import { Hono } from "hono";
import type { TwilicValue } from "@twilic/core";
import { printSizeComparison } from "../shared/compare.js";

const PORT = 8787;

interface UserJson {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: number;
  active: boolean;
  plan: string;
  region: string;
}

const dataDir = dirname(fileURLToPath(import.meta.url));
const usersJson = JSON.parse(
  readFileSync(join(dataDir, "data", "users.json"), "utf8"),
) as UserJson[];

const users: TwilicValue[] = usersJson.map((user) => ({
  id: BigInt(user.id),
  name: user.name,
  email: user.email,
  role: user.role,
  created_at: BigInt(user.created_at),
  active: user.active,
  plan: user.plan,
  region: user.region,
}));

const app = new Hono();

app.get("/users", (_c) => {
  const bytes = encodeBatch(users);
  return new Response(Buffer.from(bytes), {
    headers: {
      "Content-Type": TWILIC_CONTENT_TYPE,
      "X-Record-Count": String(users.length),
    },
  });
});

app.get("/users.json", (c) => {
  return c.json(usersJson);
});

printSizeComparison(
  "API response payload (50 users)",
  usersJson,
  encodeBatch(users).byteLength,
);

serve({ fetch: app.fetch, port: PORT }, () => {
  console.log(`\nAPI server listening on http://localhost:${PORT}`);
  console.log(`  GET /users      — Twilic batch (${TWILIC_CONTENT_TYPE})`);
  console.log(`  GET /users.json — JSON comparison`);
  console.log(`\nRun: pnpm example:api-response:client`);
});
