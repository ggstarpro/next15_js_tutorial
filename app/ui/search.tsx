'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

/*
▫️ Next.jsのクライアントフック
◇ useSearchParams
現在のURLのパラメータにアクセスできます。
例えば、/dashboard/invoices?page=1&query=pendingというURLの検索パラメータは次のようになります：
{page: '1', query: 'pending'}。

◇ usePathname
現在のURLのパス名を読み取ることができます。
例えば、/dashboard/invoicesというルートでは、
usePathnameは'/dashboard/invoices'を返します。

◇ useRouter
クライアントコンポーネント内でプログラムによってルート間のナビゲーションを可能にします。使用できるメソッドは複数あります。
*/
export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // デバウンスは、関数の発火率を制限するプログラミング手法です。この場合、ユーザーが入力を停止したときにのみデータベースにクエリを実行する必要があります。
  // デバウンスの仕組み
  // 1.トリガーイベント：デバウンスする必要があるイベント（検索ボックスでのキーストロークなど）が発生すると、タイマーが開始します。
  // 2.待機：タイマーの期限が切れる前に新しいイベントが発生した場合、タイマーはリセットされます。
  // 3.実行：タイマーがカウントダウンの終わりに達すると、デバウンスされた関数が実行されます。
  const handleSearch = useDebouncedCallback((term) => {
    console.log(`Searching... ${term}`);

    // URLSearchParamsは、URLクエリパラメータを操作するためのユーティリティメソッドを提供するWeb APIです
    const params = new URLSearchParams(searchParams)
    params.set('page', '1');
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }

    // ${pathname}は現在のパスです。この場合は、"/dashboard/invoices"になります。
    // ユーザーが検索バーに入力すると、params.toString()はこの入力をURL対応の形式に変換します。
    // replace(${pathname}?${params.toString()})は、ユーザーの検索データでURLを更新します。
    // 例えば、ユーザーが「Lee」を検索すると、/dashboard/invoices?query=leeになります。
    // Next.jsのクライアントサイドナビゲーションのおかげで、ページの再読み込みなしでURLが更新されます（ページ間のナビゲーションの章で学習しました）。
    // https://nextjs.org/learn/dashboard-app/navigating-between-pages
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value)
        }}

        // defaultValue vs. value / 制御vs非制御
        // 入力の値を管理するために状態を使用している場合は、
        // value属性を使用して制御コンポーネントにします。
        // これは、Reactが入力の状態を管理することを意味します。
        // 一方、状態を使用していない場合は、defaultValueを使用できます。
        // これは、ネイティブの入力自体が独自の状態を管理することを意味します。
        // この場合、検索クエリを状態ではなくURLに保存しているため、問題ありません。
        defaultValue={searchParams.get('query')?.toString()}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
