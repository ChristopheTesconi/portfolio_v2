import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["fr", "en"];
const defaultLocale = "fr";

function getLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get("accept-language");
  if (acceptLanguage) {
    const browserLocale = acceptLanguage.split(",")[0].split("-")[0];
    if (locales.includes(browserLocale)) {
      return browserLocale;
    }
  }
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // ✅ Ne pas intercepter les fichiers statiques, API, etc.
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    pathname === "/sitemap.xml" ||
    pathname === "/robots.txt"
  ) {
    return NextResponse.next();
  }

  // ✅ Vérifier si la locale est déjà dans l'URL
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // ✅ REDIRECTION RACINE "/" AVEC DÉTECTION BOT AMÉLIORÉE
  if (pathname === "/") {
    const userAgent = request.headers.get("user-agent") || "";

    // ✅ LISTE COMPLÈTE DES BOTS POUR SEO
    const isBot =
      /googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot|applebot|slackbot|discordbot|petalbot|semrushbot|ahrefsbot|dotbot|mj12bot|seznambot|archive\.org_bot/i.test(
        userAgent
      );

    if (isBot) {
      // ✅ BOTS → Toujours FR (langue par défaut pour SEO)
      return NextResponse.redirect(new URL("/fr", request.url));
    }

    // ✅ UTILISATEURS → Détection langue navigateur
    const locale = getLocale(request);
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  // ✅ AUTRES URLS SANS LOCALE → Ajouter locale
  const locale = getLocale(request);
  return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)"],
};
