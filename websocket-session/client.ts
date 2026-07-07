import { decode } from "@twilic/core";
import WebSocket from "ws";

const URL = "ws://localhost:8788";

const socket = new WebSocket(URL);

socket.on("open", () => {
  console.log(`connected to ${URL}`);
});

socket.on("message", (data, isBinary) => {
  const bytes =
    data instanceof Buffer
      ? new Uint8Array(data)
      : data instanceof ArrayBuffer
        ? new Uint8Array(data)
        : Buffer.from(String(data));

  console.log(
    `received ${bytes.byteLength} bytes (binary=${isBinary ?? true})`,
  );

  try {
    const value = decode(bytes);
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
