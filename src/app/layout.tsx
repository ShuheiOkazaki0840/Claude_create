import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "投資ダッシュボード | Investment Pro",
  description: "プロフェッショナル投資分析ツール",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full">
      <body className="h-full bg-gray-900 text-gray-100 antialiased">
        <div className="flex h-full">
          <Sidebar />
          <main className="flex-1 ml-64 min-h-screen overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
