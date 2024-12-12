// ストリーミング
// ストリーミング は、ページを「チャンク」（かたまり）に分解し、準備が整ったチャンクから段階的にクライアントに送信する技術である。
// 先ほどの処理では、一部の処理が遅いために、ページ全体の更新が止まってしまった。ストリーミングを利用すれば、処理を分割し、表示できる部分のみを先に表示することができる。

// Next.js でストリーミングを実装するには、ふたつの手段がある。

// ページに適用：　loading.tsxを用意する
// コンポーネントに適用：　<Suspense>コンポーネントを使用する

// ------------------------------------------------------------------------------------------------
// loading.tsxは、ファイルがあるフォルダ内部のすべてのページに適用される。そのため、/dashboard/invoicesや/dashboard/customersに対しても表示される。
// これを避けるため、ルートグループ を使用する。これは、()で囲まれたフォルダ名のフォルダを作成することで、URL 構造に影響を与えることなくフォルダを作成するための機能である。

// 実際に作成してみる。/app/dashboardに(overview)フォルダを作成する。もちろん、かっこも含めた名前であるため、省略しないようにすること。
// そしたら、/app/dashboard/page.tsxと/app/dashboard/loading.tsxをフォルダの中に入れる。

import DashboardSkeleton from '@/app/ui/skeletons';

export default function Loading() {
  // return <DashboardSkeleton />;
  return <div>Loading...中</div>;
}