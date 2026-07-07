import { encode as encodeMsgpack } from "@msgpack/msgpack";

export interface SizeRow {
  label: string;
  bytes: number;
}

function toComparableJson(value: unknown): unknown {
  if (typeof value === "bigint") {
    return value.toString();
  }
  if (Array.isArray(value)) {
    return value.map((item) => toComparableJson(item));
  }
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, toComparableJson(item)]),
    );
  }
  return value;
}

export function jsonBytes(value: unknown): number {
  return Buffer.byteLength(JSON.stringify(toComparableJson(value)));
}

export function msgpackBytes(value: unknown): number {
  return encodeMsgpack(toComparableJson(value)).byteLength;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  return `${(bytes / 1024).toFixed(1)} KB`;
}

export function printSizeTable(rows: SizeRow[]): void {
  const labelWidth = Math.max(...rows.map((row) => row.label.length), 5);
  const header = `${"Format".padEnd(labelWidth)}  Size`;
  console.log(header);
  console.log("-".repeat(header.length));
  for (const row of rows) {
    console.log(`${row.label.padEnd(labelWidth)}  ${formatBytes(row.bytes)}`);
  }
}

export function printSizeComparison(
  label: string,
  json: unknown,
  twilicBytes: number,
): void {
  console.log(`\n${label}`);
  printSizeTable([
    { label: "JSON", bytes: jsonBytes(json) },
    { label: "MessagePack", bytes: msgpackBytes(json) },
    { label: "Twilic", bytes: twilicBytes },
  ]);
}
