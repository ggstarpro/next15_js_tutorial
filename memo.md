# 静的コンテンツと動的コンテンツを結合する
現在、ルート内で動的関数（noStore()など）を使用すると、ルート全体が動的になる。
このように、現行のほとんどのWebアプリは、アプリケーション・ルートに対して静的・動的いずれかのレンダリング方法を選択することで構築されている。
しかし、「部分的に動的レンダリングしたい」といったユースケースはたびたび発生する。たとえばここまで作ってきたダッシュボードは、
- 静的：サイドバー (The <SideNav> Component doesn't rely on data and is not personalized to the user, so it can be static.)
- 動的：カード、チャート、リスト(The components in <Page> rely on data that changes often and will be personalized to the user, so they can be dynamic.)
というように、静的・動的なコンテンツのどちらをも持っていることがわかる。

# 部分プリレンダリング
こういった需要にこたえるため、 Next.js には 部分的なプリレンダリング の機能が試験的に導入されている。
これは、一部のコンポーネントを動的に保ちつつ、静的なコンポーネントから分離してレンダリングする機能である。
これにより、ユーザーがアクセスしたとき、
- 静的コンテンツが高速で提供される
- 動的コンテンツがあるべき場所は、コンテンツがロードされるまで予約される（スケルトンなどが表示できる）
- 動的コンテンツがロードし終えたら、順次穴にはめ込む形で表示される
といった動作をする。

# 部分プリレンダリングの実現
では、その部分プリレンダリングを行うにはどうすればよいか。
これには、React 18 より追加された Concurrent Features（同時機能） が必要となる。
これは Suspense コンポーネントに対して機能を追加し、非同期な要素をレンダリング時に分離させ、静的なコンテンツのみを優先して表示することを実現する。
要するに、さきほど行ったようなSuspenseコンポーネントを用いた実装がこれにあてはまる。
注意点として、「Suspenseで囲めば動的になる」わけではない。(Suspense は静的コードと動的コード間の境界として使用されます。)
さきほどnoStore()で手動でキャッシュを止めていたように、あくまでSuspenseは「ルートの静的・動的の境目」として機能することを意識することが重要である。

# 部分的な事前レンダリングの実装
Next.jsアプリでPPRを有効にするには、[ppr](https://nextjs.org/docs/app/api-reference/config/next-config-js/ppr)ファイルにオプションを追加します

* next.config.mjs
```
/** @type {import('next').NextConfig} */

const nextConfig = {
  experimental: {
    ppr: 'incremental',
  },
};

export default nextConfig;
```

この'incremental'値により、特定のルートに PPR を採用できるようになります。
次に、experimental_pprダッシュボード レイアウトにセグメント設定オプションを追加します。

* app/page.tsx
```
import { Suspense } from "react"
import { StaticComponent, DynamicComponent, Fallback } from "@/app/ui"

export const experimental_ppr = true // koko

export default function Page() {
  return {
     <>
      <StaticComponent />
      <Suspense fallback={<Fallback />}>
        <DynamicComponent />
      </Suspense>
     </>
  };
}
```

これで完了です。開発中のアプリケーションでは違いが見られないかもしれませんが、本番環境ではパフォーマンスの向上が見られるはずです。
Next.js はルートの静的部分を事前にレンダリングし、動的な部分をユーザーが要求するまで延期します。
部分的な事前レンダリングの優れた点は、これを使用するためにコードを変更する必要がないことです。
ルートの動的な部分を Suspense でラップしている限り、Next.js はルートのどの部分が静的でどの部分が動的であるかを認識します。