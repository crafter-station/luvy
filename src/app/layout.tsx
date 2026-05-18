import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";
import { cn } from "@/lib/utils";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Luvy.run",
  description: "Voice notes for race day. Send love they hear when it matters.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        spaceGrotesk.variable,
        "font-sans",
        jetbrainsMono.variable,
      )}
    >
      <body className="flex min-h-full flex-col bg-luvy-lavender/35">
        <ClerkProvider>
          <ThemeProvider>
            <div className="mx-auto min-h-dvh w-full max-w-6xl bg-background shadow-[0_0_60px_rgb(91_53_200_/_10%)]">
              {children}
            </div>
          </ThemeProvider>
          <Analytics />
        </ClerkProvider>
      </body>
    </html>
  );
}
