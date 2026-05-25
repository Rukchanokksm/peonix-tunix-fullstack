import { type NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import {
  SHARE_ENABLED,
  isShareApi,
  isShareMutationApi,
  isShareRoute,
} from "@/lib/share";

// Next.js 16 renamed "middleware" to "proxy" — this is the new convention.
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Share gate (must run before auth check so disabled share routes don't
  //    bounce through /login first). ──────────────────────────────────────
  if (!SHARE_ENABLED) {
    if (isShareApi(pathname)) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if (
      isShareMutationApi(pathname) &&
      request.method !== "GET" &&
      request.method !== "HEAD"
    ) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if (isShareRoute(pathname)) {
      const homeUrl = request.nextUrl.clone();
      homeUrl.pathname = "/";
      homeUrl.search = "";
      return NextResponse.redirect(homeUrl, 307);
    }
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(
          cookiesToSet: {
            name: string;
            value: string;
            options: CookieOptions;
          }[],
        ) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Refresh session — keeps auth token alive on every request
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protected routes — redirect to login if not authenticated
  const protectedPaths = ["/tunes/new", "/profile", "/saved", "/settings"];
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (isProtected && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
