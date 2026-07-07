import { createServer } from "node:http";
import { createSessionEncoder } from "@twilic/core";
import { WebSocketServer } from "ws";
import { makeMetrics, tickMetrics } from "../shared/fixtures.js";

const PORT = 8788;
const TICK_MS = 1000;
const MAX_TICKS = 10;

const session = createSessionEncoder();
let tick = 0;
let current = makeMetrics();

const server = createServer();
const wss = new WebSocketServer({ server });

wss.on("connection", (socket) => {
  console.log("client connected");

  const interval = setInterval(() => {
    if (socket.readyState !== socket.OPEN) {
      clearInterval(interval);
      return;
    }

    if (tick > 0) {
      current = tickMetrics(current, tick);
    }

    const bytes =
      tick === 0 ? session.encode(current) : session.encodePatch(current);

    socket.send(bytes, { binary: true });
    console.log(
      `tick ${tick}: sent ${bytes.byteLength} bytes (${tick === 0 ? "full" : "patch"})`,
    );

    tick += 1;
    if (tick >= MAX_TICKS) {
      console.log("resetting session after stream end");
      session.reset();
      tick = 0;
      current = makeMetrics();
      clearInterval(interval);
      socket.close();
    }
  }, TICK_MS);

  socket.on("close", () => {
    clearInterval(interval);
    console.log("client disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`WebSocket server listening on ws://localhost:${PORT}`);
  console.log(`Run: pnpm example:websocket:client`);
});
