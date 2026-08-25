import type { Metadata } from "next";
import "./globals.css";
import { WalletProvider } from "@/components/wallet-provider";
import { StudioProvider } from "@/components/studio-provider";
import { AppShell } from "@/components/app-shell";

export const metadata: Metadata = {
  title: "StudioSplit — contribution credit console",
  description: "Rubric-bound ownership splits for collaborative creative work on GenLayer."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <WalletProvider>
          <StudioProvider>
            <AppShell>{children}</AppShell>
          </StudioProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
