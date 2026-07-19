import { init } from "@twilic/core";
import { twilicFetchJson } from "@twilic/fetch";

import { BASE_URL, logClientResult, sampleRequest } from "./shared.js";

await init();

const data = await twilicFetchJson(`${BASE_URL}/echo`, {
  method: "POST",
  twilicBody: sampleRequest,
});

logClientResult("fetch", data);
