import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Caveat, Inter, Newsreader, Libre_Baskerville, Cormorant_Garamond, Cardo } from "next/font/google";
import localFont from "next/font/local";
import { ClickSound } from "@/components/ClickSound/ClickSound";
import { SiteControls } from "@/components/SiteControls/SiteControls";
import { ThemeProvider } from "@/theme/ThemeProvider";
import { themeInitScript } from "@/theme/theme";
import "./globals.css";

const openRunde = localFont({
  variable: "--font-open-runde",
  display: "swap",
  src: [
    {
      path: "../../public/assets/open-runde-font/web/OpenRunde-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/assets/open-runde-font/web/OpenRunde-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/assets/open-runde-font/web/OpenRunde-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/assets/open-runde-font/web/OpenRunde-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
});

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

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  axes: ["opsz"],
});

const libreBaskerville = Libre_Baskerville({
  variable: "--font-libre-baskerville",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const cardo = Cardo({
  variable: "--font-cardo",
  subsets: ["latin"],
  weight: ["400", "700"],
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
      className={`${openRunde.variable} ${inter.variable} ${caveat.variable} ${newsreader.variable} ${libreBaskerville.variable} ${cormorantGaramond.variable} ${cardo.variable}`}
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
