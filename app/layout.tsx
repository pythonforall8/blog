import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/navbar";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Python For All Blog",
  description:
    "Insights, tutorials, and news about Python programming and related technologies.",
  metadataBase: new URL("https://blog.pythonforall.com"),
  openGraph: {
    type: "website",
    url: "https://blog.pythonforall.com",
    title: "Python For All Blog",
    description:
      "Insights, tutorials, and news about Python programming and related technologies.",
    siteName: "Python For All Blog",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/pfa_logo.ico" />
        <meta
          property="og:image"
          content="https://www.pythonforall.com/pfa_logo.ico"
        />
        <meta property="og:site_name" content="Python For All Blog" />
      </head>
      <body
        className={cn(
          "min-h-screen flex flex-col bg-background",
          inter.className
        )}
      >
        <SpeedInsights />
        <Analytics />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
