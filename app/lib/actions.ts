// 'use server'を追加することで、ファイル内のすべてのエクスポートされた関数をサーバー関数としてマークします。
// これらのサーバー関数は、クライアントコンポーネントとサーバーコンポーネントの両方にインポートできるため、非常に汎用性があります。
'use server';

// 型の検証を処理するには、いくつかの選択肢があります。
// 型を手動で検証することもできますが、型検証ライブラリを使用すると時間と労力を節約できます。
// この例では、TypeScriptファーストの検証ライブラリであるZodを使用します。
import { z } from 'zod';

import { sql } from '@vercel/postgres';

// Next.jsには[クライアント側ルーターキャッシュ](https://nextjs.org/docs/app/building-your-application/caching#router-cache)があり、
// ルートセグメントをユーザーのブラウザに一定期間保存します。
// [プリフェッチ](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#1-prefetching)と合わせて、
// このキャッシュにより、ユーザーはサーバーへのリクエスト数を減らしながら、ルート間をすばやく移動できます。
// 請求書ルートに表示されるデータを更新しているので、このキャッシュをクリアし、サーバーへの新しいリクエストをトリガーする必要があります。
// これは、Next.jsの[revalidatePath関数](https://nextjs.org/docs/app/api-reference/functions/revalidatePath)を使用して実行できます：
import { revalidatePath } from 'next/cache';

import { redirect } from 'next/navigation';

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  // amountフィールドは、文字列から数値に強制（変更）されるように特別に設定されており、型も検証されます。
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
  const rawFormData = {
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  };
  // テストしてみる：
  console.log(rawFormData);
  // const rawFormData = Object.fromEntries(formData.entries())

  // amountの型がnumberではなくstringであることがわかります。これは、type="number"を持つinput要素が実際には文字列を返すためです！
  console.log(typeof rawFormData.amount);

  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  const amountInCents = amount * 100;

  await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath('/dashboard/invoices');
}

// [追加の学習として、Server Actionsでのセキュリティについてもっと読むこともできます。]https://nextjs.org/blog/security-nextjs-server-components-actions