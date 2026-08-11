import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Caveat, Delius, Inter } from "next/font/google";
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

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: "500",
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
      className={`${inter.variable} ${delius.variable} ${caveat.variable}`}
    >
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
