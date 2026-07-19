import { serve } from "@hono/node-server";
import { init } from "@twilic/core";
import { twilicParser, twilicResponse } from "@twilic/hono";
import { Hono } from "hono";

import { PORT, logServerReady } from "./shared.js";

await init();

const app = new Hono();

app.post("/echo", twilicParser(), (c) => {
  return twilicResponse(c, {
    ok: true,
    via: "hono",
    received: c.var.twilicBody,
  });
});

serve({ fetch: app.fetch, port: PORT }, () => {
  logServerReady("Hono");
});
