import type { ReactNode } from "react";
import "./globals.css";
import { MiniKitProvider } from "../components/MiniKitProvider";

export const metadata = {
  title: "EtherCast",
  description: "a small door into the world below"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <MiniKitProvider>{children}</MiniKitProvider>
      </body>
    </html>
  );
}
