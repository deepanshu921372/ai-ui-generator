import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI UI Generator",
  description: "Generate UIs from natural language using AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
