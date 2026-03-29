import type { Metadata } from "next";
import { Outfit, Inter, JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ThemeProvider } from "@/providers/theme-provider";
import { OrganizationJsonLd } from "@/components/seo/json-ld";
import "../globals.css";

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hvnpod.com"),
  title: {
    default: "HVNPOD — Premium Acoustic Privacy Pods",
    template: "%s | HVNPOD",
  },
  description: "Premium acoustic pods for focused work — without construction. Designed for offices that need privacy fast.",
  keywords: ["acoustic pods", "privacy pods", "office pods", "acoustic booth", "work pod", "meeting pod"],
  icons: {
    icon: "/images/logo/hvnpod-symbol-color.png",
    apple: "/images/logo/hvnpod-symbol-color.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "HVNPOD",
  },
  twitter: {
    card: "summary_large_image",
    site: "@hvnpod",
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${outfit.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-foreground font-[family-name:var(--font-body)] antialiased">
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
          <OrganizationJsonLd />
        </ThemeProvider>
      </body>
    </html>
  );
}
