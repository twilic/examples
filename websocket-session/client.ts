import { init } from "@twilic/core";
import { parseTwilicMessage } from "@twilic/websocket";
import WebSocket from "ws";

await init();

const URL = "ws://localhost:8788";

const socket = new WebSocket(URL);

socket.on("open", () => {
  console.log(`connected to ${URL}`);
});

socket.on("message", async (data, isBinary) => {
  const size = Buffer.isBuffer(data)
    ? data.byteLength
    : Array.isArray(data)
      ? data.reduce((total, chunk) => total + chunk.byteLength, 0)
      : data.byteLength;

  console.log(`received ${size} bytes (binary=${isBinary})`);

  try {
    const value = await parseTwilicMessage(data, { isBinary });
    const record = value as Record<string, unknown>;
    const keys = Object.keys(record).slice(0, 5).join(", ");
    console.log(`  decoded fields (first 5): ${keys}`);
    console.log(`  cpu_pct=${record.cpu_pct}, mem_mb=${record.mem_mb}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(`  decode skipped: ${message}`);
    console.log(
      "  patch frames may require a session decoder; see simulate.ts for size wins.",
    );
  }
});

socket.on("close", () => {
  console.log("connection closed");
});

socket.on("error", (error) => {
  console.error("websocket error:", error.message);
});
