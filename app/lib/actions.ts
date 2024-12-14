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

// @types/react-domが更新されるまでの一時的なもの
export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  // amountフィールドは、文字列から数値に強制（変更）されるように特別に設定されており、型も検証されます。
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

// export async function createInvoice(formData: FormData) {
// formData - 以前と同じです。
// prevState - useFormStateフックから渡された状態を含みます。この例ではアクション内で使用しませんが、必須のプロパティです。
export async function createInvoice(prevState: State, formData: FormData) {
  // const rawFormData = {
  //   customerId: formData.get('customerId'),
  //   amount: formData.get('amount'),
  //   status: formData.get('status'),
  // };
  // テストしてみる：
  // console.log(rawFormData);
  // const rawFormData = Object.fromEntries(formData.entries())

  // amountの型がnumberではなくstringであることがわかります。これは、type="number"を持つinput要素が実際には文字列を返すためです！
  // console.log(typeof rawFormData.amount);

  // const { customerId, amount, status } = CreateInvoice.parse({
  //   customerId: formData.get('customerId'),
  //   amount: formData.get('amount'),
  //   status: formData.get('status'),
  // });
  // const amountInCents = amount * 100;
  // const date = new Date().toISOString().split('T')[0];


  // Zodを使用してフォームフィールドを検証する
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  // フォームの検証に失敗した場合は、エラーをすぐに返す。そうでない場合は続行。
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: '送信エラー:Missing Fields. Failed to Create Invoice.',
    };
  }

  // データベースに挿入するためのデータを準備する
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  // データベースにデータを挿入する
  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
        // データベースエラーが発生した場合は、より具体的なエラーを返す。
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }

  // 請求書ページのキャッシュを再検証し、ユーザーをリダイレクトする。
  revalidatePath('/dashboard/invoices');

  // redirectがtry/catchブロックの外で呼び出されていることに注目してください。
  // これは、redirectがエラーを投げることで動作し、catchブロックでキャッチされてしまうためです。
  // これを避けるため、try/catchの後にredirectを呼び出すことができます。redirectは、tryが成功した場合にのみ到達可能です。
  // redirect関数でgetRedirectErrorが呼ばれNEXT_REDIRECTエラーが投げられていることがわかります。
  // つまり、redirect関数はNEXT_REDIRECTエラーを投げるため、try/catchの中で呼び出すとそのエラーをcatchブロックでキャッチしてしまうため、
  // 処理が成功している場合でもエラーが表示されてしまう、ということです。

  redirect('/dashboard/invoices');
}

// export async function updateInvoice(id: string, formData: FormData) {
export async function updateInvoice(id: string, prevState: State, formData: FormData,) {
  // const { customerId, amount, status } = UpdateInvoice.parse({
  //   customerId: formData.get('customerId'),
  //   amount: formData.get('amount'),
  //   status: formData.get('status'),
  // });

  // const amountInCents = amount * 100;

  // Zodを使用してフォームフィールドを検証する
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  // フォームの検証に失敗した場合は、エラーをすぐに返す。そうでない場合は続行。
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: '更新エラーMissing Fields. Failed to Update Invoice.',
    };
  }

  const { customerId, amount, status } = validatedFields.data
  const amountInCents = amount * 100;

  try {
    await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
    `;
  } catch(error) {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  // error.tsxファイルの確認
  // throw new Error('Failed to Delete Invoice');

  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
    return { message: 'Deleted Invoice.' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Invoice.' };
  }
}

// [追加の学習として、Server Actionsでのセキュリティについてもっと読むこともできます。]https://nextjs.org/blog/security-nextjs-server-components-actions