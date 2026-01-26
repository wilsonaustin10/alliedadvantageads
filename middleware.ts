import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";

  // Redirect www to non-www for consistent origin
  if (host.startsWith("www.")) {
    const newHost = host.replace("www.", "");
    const url = new URL(request.url);
    url.host = newHost;
    return NextResponse.redirect(url, { status: 301 });
  }

  const protectedPaths = ["/home-portal", "/onboarding", "/midprint", "/admin"];

  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedPath) {
    const authToken = request.cookies.get("auth-token");

    if (!authToken) {
      const url = new URL("/signin", request.url);
      url.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images).*)",
  ],
};