export const PRIVATE_COOKIE_NAME = "ri_private_access";

export async function privateCookieValueEdge(password: string) {
  const encoder = new TextEncoder();
  const digest = await crypto.subtle.digest(
    "SHA-256",
    encoder.encode(`recursiveintell-private:${password}`)
  );
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}
