// layout.tsxは、そのファイルがあるフォルダより下の階層のフォルダのページに対して適用される。
// 今回の場合は/app/dashboardに設置したので、/app/dashboardの中にあるページすべてに適用される。
// また、共通のコンポーネントを使っているページに遷移する際、わざわざそのコンポーネントが再レンダリングされることはない。
// これは Next.js の 部分レンダリング によるもので、ページ遷移時に更新のあるコンポーネントだけを置き換え、それ以外はそのまま使用することで、処理を削減している。

import SideNav from '@/app/ui/dashboard/sidenav';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
        {children}
      </div>
    </div>
  );
}