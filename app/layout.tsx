import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import "./globals.css";

const fontSans = Public_Sans({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "yunejo - AI Chat",
  description: "yunejo - Your intelligent AI chat assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={fontSans.variable}>
      <body
        className="antialiased dark"
      >
        {children}
      </body>
    </html>
  );
}
