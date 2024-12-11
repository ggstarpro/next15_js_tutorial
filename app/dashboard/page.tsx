import { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import { fetchRevenue, fetchLatestInvoices, fetchCardData} from '@/app/lib/data';


// async: ページは非同期コンポーネント
export default async function Page() {
  /**
   * リクエスト・ウォーターフォール
   * Next.js では、各リクエストは並列には処理されず、実行された順番に処理される。これをリクエスト・ウォーターフォールと呼ぶ
   * たとえば、先ほどのコードでは、fetchRevenue、fetchLatestInvoices、fetchCardDataという順に通信が行われ、各リクエストはひとつ前のリクエストの完了を待っていた。
   * この動きは、システムのスムーズな動作に悪影響になる可能性がある。とくに負荷の大きい通信などの場合は、UXを損ねてしまうことも大いに考えられる。
   * ↓ 並列処理でデータを取得する
   * JavaScript では、Promise.all()やPromise.allSettled()で並列処理を実現できる。実際に、さきほど使用したfetchCardData()の内部では、カードに必要な各データを並列で取得している。
   */
  const revenue = await fetchRevenue();
  const latestInvoices = await fetchLatestInvoices();
  const {
    numberOfCustomers,
    numberOfInvoices,
    totalPaidInvoices,
    totalPendingInvoices,
  } = await fetchCardData()
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Collected" value={totalPaidInvoices} type="collected" />
        <Card title="Pending" value={totalPendingInvoices} type="pending" />
        <Card title="Total Invoices" value={numberOfInvoices} type="invoices" />
        <Card
          title="Total Customers"
          value={numberOfCustomers}
          type="customers"
        />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <RevenueChart revenue={revenue}  />
        <LatestInvoices latestInvoices={latestInvoices} />
      </div>
    </main>
  );
}