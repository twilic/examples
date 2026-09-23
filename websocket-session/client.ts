import { init } from "@twilic/core";
import { createTwilicWebSocket } from "@twilic/websocket";
import WebSocket from "ws";
import { asTwilicSocket } from "./socket.js";

await init();

const URL = "ws://localhost:8788";

const socket = new WebSocket(URL);
const twilic = createTwilicWebSocket({
  stateful: true,
  session: { maxBaseSnapshots: 8 },
});
const transport = asTwilicSocket(socket);

socket.on("open", () => {
  console.log(`connected to ${URL}`);
});

socket.on("message", (data, isBinary) => {
  const size = Buffer.isBuffer(data)
    ? data.byteLength
    : Array.isArray(data)
      ? data.reduce((total, chunk) => total + chunk.byteLength, 0)
      : data.byteLength;

  console.log(`received ${size} bytes (binary=${isBinary})`);
});

twilic.attach(
  transport,
  (value) => {
    const record = value as Record<string, unknown>;
    const keys = Object.keys(record).slice(0, 5).join(", ");
    console.log(`  decoded fields (first 5): ${keys}`);
    console.log(`  cpu_pct=${record.cpu_pct}, mem_mb=${record.mem_mb}`);
  },
  {
    onError(error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`  decode error: ${message}`);
    },
  },
);

socket.on("close", () => {
  console.log("connection closed");
});

socket.on("error", (error) => {
  console.error("websocket error:", error.message);
});
