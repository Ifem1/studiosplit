import { createClient } from "genlayer-js";
import { STUDIOSPLIT_CHAIN } from "./config";

export const readClient = createClient({ chain: STUDIOSPLIT_CHAIN });
