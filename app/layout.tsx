import "@/app/ui/global.css";
import { inter } from '@/app/ui/fonts';

// ルートレイアウト
// プライマリフォントの適用に使用した/app/layout.tsxはルートレイアウトと呼ばれ、
// すべてのページに共有されるレイアウトとなる。ここには、メタデータやグローバルスタイルなどを設置する。


import { Metadata } from 'next';
// export const metadata: Metadata = {
//   title: 'Acme Dashboard',
//   description: 'The official Next.js Course Dashboard, built with App Router.',
//   metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
// };
export const metadata: Metadata = {
  title: {
    // テンプレートの%sは、特定のページタイトルに置き換えられます。
    template: '%s | Acme Dashboard',
    default: 'Acme Dashboard',
  },
  description: 'The official Next.js Learn Dashboard built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};

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
