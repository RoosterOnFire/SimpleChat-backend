import { randomBytes } from "crypto";

export function createToken() {
  return randomBytes(16).toString("hex");
}
