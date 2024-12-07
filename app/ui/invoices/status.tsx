import { CheckIcon, ClockIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
// clsx（クラスエックス） は、より動的にクラスを適用したい場合に役立つライブラリである。
// たとえば「statusというパラメータがpendingのときだけ文字色を灰色にしたい」といった実装をしたいとする。
// そういった場合、clsx を使用することで以下のように直接条件文の紐づけができる。
// https://github.com/lukeed/clsx
export default function InvoiceStatus({ status }: { status: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-1 text-xs',
        {
          'bg-gray-100 text-gray-500': status === 'pending',
          'bg-green-500 text-white': status === 'paid',
        },
      )}
    >
      {status === 'pending' ? (
        <>
          Pending
          <ClockIcon className="ml-1 w-4 text-gray-500" />
        </>
      ) : null}
      {status === 'paid' ? (
        <>
          Paid
          <CheckIcon className="ml-1 w-4 text-white" />
        </>
      ) : null}
    </span>
  );
}
