import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Caveat, Inter } from "next/font/google";
import { ClickSound } from "@/components/ClickSound/ClickSound";
import { SiteControls } from "@/components/SiteControls/SiteControls";
import { ThemeProvider } from "@/theme/ThemeProvider";
import { themeInitScript } from "@/theme/theme";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  axes: ["opsz"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["500", "700"],
});

export const metadata: Metadata = {
  title: "Nimesh Mohanakrishnan",
  description:
    "Product designer in Seattle, currently a masters student in the HCDE program at the University of Washington.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${caveat.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <ThemeProvider>
          <ClickSound />
          <SiteControls />
          {children}
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
