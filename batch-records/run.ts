import { encodeBatch } from "@twilic/core/advanced";
import { printSizeComparison } from "../shared/compare.js";
import {
  makeBatchHomogeneous,
  makeTelemetryEvents,
} from "../shared/fixtures.js";

function runSmallBatch(): void {
  const records = makeBatchHomogeneous(64);
  const twilicBytes = encodeBatch(records).byteLength;

  printSizeComparison(
    "Small homogeneous batch (64 records, row_batch friendly)",
    records,
    twilicBytes,
  );
}

function runLargeBatch(): void {
  const records = makeTelemetryEvents(256);
  const twilicBytes = encodeBatch(records).byteLength;

  printSizeComparison(
    "Large tabular batch (256 telemetry events, col_batch friendly)",
    records,
    twilicBytes,
  );
}

console.log("Twilic batch-records example\n");
runSmallBatch();
runLargeBatch();
