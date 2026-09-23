import { createServer } from "node:http";
import { init } from "@twilic/core";
import { createTwilicWebSocket } from "@twilic/websocket";
import { WebSocketServer } from "ws";
import { makeMetrics, tickMetrics } from "../shared/fixtures.js";

await init();

const PORT = 8788;
const TICK_MS = 1000;
const MAX_TICKS = 10;
const STATE_PATCH = 0x0a;

const server = createServer();
const wss = new WebSocketServer({ server });

wss.on("connection", (socket) => {
  console.log("client connected");

  const twilic = createTwilicWebSocket(socket, {
    stateful: true,
    session: { maxBaseSnapshots: 8 },
  });

  let tick = 0;
  let current = makeMetrics();

  const interval = setInterval(() => {
    if (socket.readyState !== socket.OPEN) {
      clearInterval(interval);
      return;
    }

    if (tick > 0) {
      current = tickMetrics(current, tick);
    }

    const frame = twilic.send(current);
    const kind = frame[0] === STATE_PATCH ? "patch" : "full";
    console.log(`tick ${tick}: sent ${frame.byteLength} bytes (${kind})`);

    tick += 1;
    if (tick >= MAX_TICKS) {
      console.log("stream complete; closing connection");
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
  console.log("Run: pnpm example:websocket:client");
});
