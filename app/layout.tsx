import "@/app/ui/global.css";
import { inter } from '@/app/ui/fonts';

// ルートレイアウト
// プライマリフォントの適用に使用した/app/layout.tsxはルートレイアウトと呼ばれ、
// すべてのページに共有されるレイアウトとなる。ここには、メタデータやグローバルスタイルなどを設置する。

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* antialiased: https://tailwindcss.com/docs/font-smoothing */}
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
