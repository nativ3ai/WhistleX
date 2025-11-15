import type { Metadata } from "next";
import "./globals.css";
import { ReactQueryProvider } from "@/components/providers/ReactQueryProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { WagmiProviders } from "@/components/providers/WagmiProviders";
import { Navbar } from "@/components/navigation/Navbar";

export const metadata: Metadata = {
  title: "Intel Marketplace",
  description: "Fund crowdsourced intelligence and unlock secrets when thresholds are met.",
  metadataBase: new URL("https://intel-marketplace.local"),
  openGraph: {
    title: "Intel Marketplace",
    description: "Collaboratively fund and unlock premium intelligence.",
    type: "website"
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <ReactQueryProvider>
            <WagmiProviders>
              <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8">
                <Navbar />
                <main className="mt-10 flex-1 space-y-12 pb-16">{children}</main>
              </div>
            </WagmiProviders>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
