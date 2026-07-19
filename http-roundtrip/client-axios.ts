import { createTwilicAxios } from "@twilic/axios";
import { init } from "@twilic/core";
import axios from "axios";

import { BASE_URL, logClientResult, sampleRequest } from "./shared.js";

await init();

const client = createTwilicAxios(axios.create({ baseURL: BASE_URL }));

const { data } = await client.post("/echo", null, {
  twilicBody: sampleRequest,
});

logClientResult("axios", data);
