import { NextResponse, type NextRequest } from "next/server";
import {
  PRIVATE_COOKIE_NAME,
  privateCookieValueEdge,
} from "@/lib/private-auth-edge";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/private") || pathname === "/private/login") {
    return NextResponse.next();
  }

  const password = process.env.PRIVATE_ACCESS_PASSWORD;
  if (!password) {
    const url = request.nextUrl.clone();
    url.pathname = "/private/login";
    url.searchParams.set("disabled", "1");
    return NextResponse.redirect(url);
  }

  const expected = await privateCookieValueEdge(password);
  const actual = request.cookies.get(PRIVATE_COOKIE_NAME)?.value;

  if (actual === expected) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = "/private/login";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/private/:path*"],
};
