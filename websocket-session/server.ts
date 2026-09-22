import { createServer } from "node:http";
import { createSessionEncoder, decode, init } from "@twilic/core";
import { createTwilicWebSocket, type TwilicSocket } from "@twilic/websocket";
import { WebSocketServer, type WebSocket } from "ws";
import { makeMetrics, tickMetrics } from "../shared/fixtures.js";

await init();

const PORT = 8788;
const TICK_MS = 1000;
const MAX_TICKS = 10;

function asTwilicSocket(socket: WebSocket): TwilicSocket {
  return {
    send(data, options) {
      socket.send(data, { binary: true, ...options });
    },
  };
}

const server = createServer();
const wss = new WebSocketServer({ server });

wss.on("connection", (socket) => {
  console.log("client connected");

  const session = createSessionEncoder();
  let tick = 0;
  let current = makeMetrics();
  let usePatch = false;
  let lastFrameBytes = 0;
  const twilicSocket = asTwilicSocket(socket);

  const twilic = createTwilicWebSocket({
    encode: (value) => {
      const bytes = usePatch
        ? session.encodePatch(value)
        : session.encode(value);
      lastFrameBytes = bytes.byteLength;
      return bytes;
    },
    decode,
  });

  const interval = setInterval(() => {
    if (socket.readyState !== socket.OPEN) {
      clearInterval(interval);
      return;
    }

    if (tick > 0) {
      current = tickMetrics(current, tick);
      usePatch = true;
    } else {
      usePatch = false;
    }

    twilic.send(twilicSocket, current);
    console.log(
      `tick ${tick}: sent ${lastFrameBytes} bytes (${usePatch ? "patch" : "full"})`,
    );

    tick += 1;
    if (tick >= MAX_TICKS) {
      console.log("resetting session after stream end");
      session.reset();
      usePatch = false;
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
