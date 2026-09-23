import { createServer } from "node:http";
import { init } from "@twilic/core";
import { createTwilicWebSocket } from "@twilic/websocket";
import { WebSocketServer } from "ws";
import { makeMetrics, tickMetrics } from "../shared/fixtures.js";
import { asTwilicSocket } from "./socket.js";

await init();

const PORT = 8788;
const TICK_MS = 1000;
const MAX_TICKS = 10;
const STATE_PATCH = 0x0a;

const twilic = createTwilicWebSocket({
  stateful: true,
  session: { maxBaseSnapshots: 8 },
});

function frameKind(frame: Uint8Array): "full" | "patch" {
  return frame[0] === STATE_PATCH ? "patch" : "full";
}

const server = createServer();
const wss = new WebSocketServer({ server });

wss.on("connection", (socket) => {
  console.log("client connected");

  let tick = 0;
  let current = makeMetrics();
  let lastFrameBytes = 0;
  let lastKind: "full" | "patch" = "full";
  const transport = asTwilicSocket(socket, (frame) => {
    lastFrameBytes = frame.byteLength;
    lastKind = frameKind(frame);
  });

  // attach() drops this connection's session when the socket closes.
  twilic.attach(transport, () => {});

  const interval = setInterval(() => {
    if (socket.readyState !== socket.OPEN) {
      clearInterval(interval);
      return;
    }

    if (tick > 0) {
      current = tickMetrics(current, tick);
    }

    twilic.send(transport, current);
    console.log(`tick ${tick}: sent ${lastFrameBytes} bytes (${lastKind})`);

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
