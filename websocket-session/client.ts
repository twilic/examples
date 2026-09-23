import { init } from "@twilic/core";
import { createTwilicWebSocket } from "@twilic/websocket";
import WebSocket from "ws";

await init();

const URL = "ws://localhost:8788";

const socket = new WebSocket(URL);
const twilic = createTwilicWebSocket(socket, {
  stateful: true,
  session: { maxBaseSnapshots: 8 },
  onError(error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`  decode error: ${message}`);
  },
});

socket.on("open", () => {
  console.log(`connected to ${URL}`);
});

twilic.onMessage((value) => {
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).slice(0, 5).join(", ");
  console.log(`  decoded fields (first 5): ${keys}`);
  console.log(`  cpu_pct=${record.cpu_pct}, mem_mb=${record.mem_mb}`);
});

socket.on("close", () => {
  console.log("connection closed");
});

socket.on("error", (error) => {
  console.error("websocket error:", error.message);
});
