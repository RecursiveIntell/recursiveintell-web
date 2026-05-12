import { createHash, timingSafeEqual } from "crypto";

export const PRIVATE_COOKIE_NAME = "ri_private_access";

export function privateModeEnabled() {
  return Boolean(process.env.PRIVATE_ACCESS_PASSWORD);
}

export function privateCookieValue(password = process.env.PRIVATE_ACCESS_PASSWORD) {
  if (!password) return "";
  return createHash("sha256")
    .update(`recursiveintell-private:${password}`)
    .digest("hex");
}

export function passwordsMatch(input: string, expected: string) {
  const inputBuffer = Buffer.from(input);
  const expectedBuffer = Buffer.from(expected);

  if (inputBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(inputBuffer, expectedBuffer);
}
