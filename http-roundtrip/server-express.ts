import { init } from "@twilic/core";
import { twilicParser, twilicSend } from "@twilic/express";
import express from "express";

import { PORT, logServerReady } from "./shared.js";

await init();

const app = express();

// Do not mount express.json() on this path — it would consume the body stream.
app.post("/echo", twilicParser(), (req, res) => {
  twilicSend(res, {
    ok: true,
    via: "express",
    received: req.twilicBody ?? null,
  });
});

app.listen(PORT, () => {
  logServerReady("Express");
});
