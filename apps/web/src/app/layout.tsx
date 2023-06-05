import "@denoted/ui/globals.css";

import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import { PropsWithChildren } from "react";
import { Analytics } from "../components/Analytics";
import { Providers } from "../components/Providers";
import { Toaster } from "../components/Toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "denoted",
    template: "%s | denoted",
  },
  description:
    "The universal way to enhance your digital artefacts with on-chain data ✨",
  openGraph: {
    images: "/social-preview.png",
  },
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#000000" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
        <Analytics />
        <VercelAnalytics />
      </body>
    </html>
  );
}
