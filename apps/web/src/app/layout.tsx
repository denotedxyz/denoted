import "@denoted/ui/globals.css";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { Analytics } from "../components/Analytics";
import { Providers } from "../components/Providers";
import { InitializeCeramic } from "../components/Sessions";
import { Toaster } from "../components/Toaster";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
          <InitializeCeramic />
          <Analytics />
          <VercelAnalytics />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
