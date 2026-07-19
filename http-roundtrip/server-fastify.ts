import { init } from "@twilic/core";
import { twilicParser, twilicPlugin, twilicReply } from "@twilic/fastify";
import Fastify from "fastify";

import { PORT, logServerReady } from "./shared.js";

await init();

const app = Fastify();
await app.register(twilicPlugin);

app.post("/echo", { preHandler: twilicParser() }, (request, reply) => {
  return twilicReply(reply, {
    ok: true,
    via: "fastify",
    received: request.twilicBody ?? null,
  });
});

await app.listen({ port: PORT, host: "127.0.0.1" });
logServerReady("Fastify");
