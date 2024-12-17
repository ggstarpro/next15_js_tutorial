// NextAuth.js
// アプリケーションに認証を追加するために、NextAuth.jsを使用します。
// NextAuth.jsは、セッション管理、サインイン、サインアウト、その他の認証の側面に関連する複雑さの多くを抽象化します。
// これらの機能を手動で実装することもできますが、その過程は時間がかかり、エラーが発生しやすくなります。NextAuth.jsはこのプロセスを簡素化し、Next.jsアプリケーションでの認証のための統一されたソリューションを提供します。

import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // ログインしていないユーザーをログインページにリダイレクト
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;