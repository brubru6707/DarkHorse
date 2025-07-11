import type { Metadata } from "next";
import { Pixelify_Sans } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import ConvexClientProvider from "./ConvexClientProvider";

const pixel = Pixelify_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DarkHorse",
  description: "This is an app to take showcases how vulnerable you are online...",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(pixel.className, "bg-[var(--background-color)]")}>
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
