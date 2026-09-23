import type { TwilicEventSocket, TwilicMessageData } from "@twilic/websocket";
import type { WebSocket } from "ws";

/** Adapt `ws` to the socket surface `@twilic/websocket` attaches to. */
export function asTwilicSocket(
  socket: WebSocket,
  onFrame?: (frame: Uint8Array) => void,
): TwilicEventSocket {
  return {
    send(data, options) {
      const frame = data instanceof Uint8Array ? data : new Uint8Array(data);
      onFrame?.(frame);
      socket.send(frame, { binary: true, ...options });
    },
    on(event, listener) {
      if (event === "close") {
        socket.on("close", listener as () => void);
        return;
      }
      socket.on(
        "message",
        listener as (data: TwilicMessageData, isBinary: boolean) => void,
      );
    },
    off(event, listener) {
      if (event === "close") {
        socket.off("close", listener as () => void);
        return;
      }
      socket.off(
        "message",
        listener as (data: TwilicMessageData, isBinary: boolean) => void,
      );
    },
  };
}
