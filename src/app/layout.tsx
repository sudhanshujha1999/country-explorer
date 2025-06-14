import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/atom/Header";
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { NotificationProvider } from '@/components/providers/NotificationProvider';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GlobeTrekker - Explore Countries Around the World",
  description: "Discover detailed information about countries worldwide. Explore populations, regions, capitals, currencies, languages, and more with GlobeTrekker.",
  keywords: "countries, world, geography, population, capitals, currencies, languages, flags",
  authors: [{ name: "GlobeTrekker Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <NotificationProvider>
            {/* Skip to main content link for keyboard users */}
            <a 
              href="#main-content" 
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Skip to main content
            </a>
            <Header />
            <div id="main-content" role="main">
              {children}
            </div>
          </NotificationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}