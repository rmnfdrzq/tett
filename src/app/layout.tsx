import type { Metadata } from "next";
import { StoreProvider } from "@/lib/store/provider";
import "@fontsource/amatic-sc/700.css";
import "@fontsource/cabin/400.css";
import "@fontsource/cabin/500.css";
import "@fontsource/cabin/600.css";
import "@fontsource/cabin/700.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tile Expert Test Task",
  description: "Frontend test task built with Next.js, TypeScript, Tailwind CSS, and Redux Toolkit.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
