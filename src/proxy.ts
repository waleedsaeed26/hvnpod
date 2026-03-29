import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export function proxy(request: Request) {
  return intlMiddleware(request as unknown as import("next/server").NextRequest);
}

export const config = {
  matcher: ["/", "/(ar|en)/:path*", "/((?!api|_next|_vercel|.*\\..*).*)"],
};
