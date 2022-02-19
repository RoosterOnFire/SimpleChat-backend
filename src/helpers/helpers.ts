import { randomBytes } from "crypto";

export function createRndId() {
  return randomBytes(16).toString("hex");
}
