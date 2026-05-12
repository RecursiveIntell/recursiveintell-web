"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  PRIVATE_COOKIE_NAME,
  passwordsMatch,
  privateCookieValue,
  privateModeEnabled,
} from "@/lib/private-auth";

export async function loginPrivate(formData: FormData) {
  if (!privateModeEnabled()) {
    redirect("/private/login?disabled=1");
  }

  const password = String(formData.get("password") ?? "");
  const expected = process.env.PRIVATE_ACCESS_PASSWORD ?? "";

  if (!passwordsMatch(password, expected)) {
    redirect("/private/login?error=1");
  }

  const cookieStore = await cookies();
  cookieStore.set(PRIVATE_COOKIE_NAME, privateCookieValue(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/private",
    maxAge: 60 * 60 * 24 * 7,
  });

  const next = String(formData.get("next") ?? "/private");
  redirect(next.startsWith("/private") ? next : "/private");
}

export async function logoutPrivate() {
  const cookieStore = await cookies();
  cookieStore.delete(PRIVATE_COOKIE_NAME);
  redirect("/private/login");
}
