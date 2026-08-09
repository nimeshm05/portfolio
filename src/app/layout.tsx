import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Delius, Inter, Patrick_Hand, Playwrite_CA_Guides } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const delius = Delius({
  variable: "--font-delius",
  subsets: ["latin"],
  weight: "400",
});

const patrickHand = Patrick_Hand({
  variable: "--font-patrick-hand",
  subsets: ["latin"],
  weight: "400",
});

const playwriteCAguides = Playwrite_CA_Guides({
  variable: "--font-playwrite-ca-guides",
  weight: "400",
  adjustFontFallback: false,
  fallback: ["Patrick Hand", "cursive"],
});

export const metadata: Metadata = {
  title: "Nimesh Mohanakrishnan",
  description:
    "Product designer in Seattle, currently a masters student in the HCDE program at the University of Washington.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${delius.variable} ${patrickHand.variable} ${playwriteCAguides.variable}`}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
