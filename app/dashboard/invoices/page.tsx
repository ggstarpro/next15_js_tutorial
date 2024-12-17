import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/invoices/table';
import { CreateInvoice } from '@/app/ui/invoices/buttons';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchInvoicesPages } from '@/app/lib/data';

// https://nextjs.org/docs/app/api-reference/file-conventions/page
// pageコンポーネントはsearchParamsというpropを受け取ることができるため、現在のURLパラメータを<Table>コンポーネントに渡すことができます。

// useSearchParams()hookとsearchParams propのどちらを使用するか
// 検索パラメータを抽出する2つの異なる方法を使用していることに気づいたかもしれません。どちらを使用するかは、クライアントとサーバーのどちらで作業しているかによって異なります。
{/* ◇ <Search>はクライアントコンポーネントなので、useSearchParams()フックを使用してクライアントからパラメータにアクセスしました。 */}
{/* ◇ <Table>は独自のデータをフェッチするサーバーコンポーネントなので、ページからsearchParamsプロップをコンポーネントに渡すことができます。 */}
// => 一般的なルールとして、クライアントからパラメータを読み取る場合は、useSearchParams()フックを使用します。これにより、サーバーに戻る必要がなくなります。


import { Metadata } from 'next';
// export const metadata: Metadata = {
//   title: 'Invoices | Acme Dashboard',
// };
export const metadata: Metadata = {
  title: 'Invoices',
};

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchInvoicesPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        {/*
        検索フォームは、URL パラメータとしてキーワードを渡すことで実装する。
        ユーザーがクライアント上で請求書を検索すると、URL パラメータが更新され、それをサーバー上で取得、新しいデータを使用してテーブルを再レンダリングする、といった流れになる。
        URL パラメータを利用することで、以下のような利点が生まれる。
        - 検索内容を含めたURLが発行・ブックマーク可能になる
        - URLにユーザーの行動が記されるため、行動の追跡が容易になる
        */}

        <Search placeholder="Search invoices..." />
        <CreateInvoice />
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}