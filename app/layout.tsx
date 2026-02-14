import "./globals.css";
import { ThemeToggle } from "@/components/theme-toggle";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3">
          <p className="font-semibold">BENCLO Warehouse</p>
          <ThemeToggle />
        </header>
        <main className="mx-auto w-full max-w-5xl px-4 pb-6">{children}</main>
      </body>
    </html>
  );
}
