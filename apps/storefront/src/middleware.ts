import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["en", "sk"];
const defaultLocale = "sk";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    // For now simple redirect to defaultLocale
    // You could also parse Accept-Language header manually if you want
    return NextResponse.redirect(
      new URL(`/${defaultLocale}${pathname.startsWith("/") ? "" : "/"}${pathname}`, request.url)
    );
  }
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|brand|video|products|favicon).*)"],
};
