import { Inter, Lusitana } from 'next/font/google';

// https://fonts.google.com/

// プライマリフォント
export const inter = Inter({ subsets: ['latin'] });

// セカンダリフォント
export const lusitana = Lusitana({ subsets: ['latin'], weight: ["400", "700"]});