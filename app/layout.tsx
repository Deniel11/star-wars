import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SWAPI People Gallery",
  description: "SWAPI People Gallery",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div id="title">
          <h1>SWAPI People Gallery</h1>
        </div>
        {children}
      </body>
    </html>
  );
}
