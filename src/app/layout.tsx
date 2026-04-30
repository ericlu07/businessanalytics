import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "sonner";
import { QueryProvider } from "@/components/providers/query-provider";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    template: "%s — Pulse",
    default: "Pulse — Business Analytics for Humans",
  },
  description:
    "Track every number that matters for your business. Revenue, clients, goals, time — all in one beautiful dashboard. Replace Google Sheets in 5 minutes.",
  keywords: ["business analytics", "side hustle tracker", "solopreneur dashboard", "small business metrics", "KPI tracker"],
  authors: [{ name: "Pulse" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Pulse",
    title: "Pulse — Business Analytics for Humans",
    description: "The simplest business dashboard for solopreneurs and small teams.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Pulse Analytics" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pulse — Business Analytics for Humans",
    description: "Track your business metrics without the spreadsheet nightmare.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { "max-image-preview": "large", "max-video-preview": -1, "max-snippet": -1 },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
      className={`${inter.variable} ${plusJakarta.variable} h-full`}
    >
      <body className="min-h-full bg-background text-foreground antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <QueryProvider>
            {children}
            <Toaster position="top-right" richColors closeButton />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
