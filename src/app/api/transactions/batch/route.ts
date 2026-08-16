import { NextRequest, NextResponse } from 'next/server';
import { createBatchTransactions } from '@/lib/services/transactionsService';
import { formatDatabaseError } from '@/lib/formatError';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || undefined;
    const body = await request.json();

    const transactions = Array.isArray(body) ? body : body.transactions;

    if (!Array.isArray(transactions) || transactions.length === 0) {
      return NextResponse.json(
        { message: 'Envie um array de transações para processamento em lote.' },
        { status: 400 }
      );
    }

    const itemsToCreate = transactions.map((t: any) => ({
      accountId: t.accountId,
      categoryId: t.categoryId,
      amount: Number(t.amount),
      description: t.description,
      date: t.date,
      isRealized: t.isRealized,
      userId,
    }));

    const created = await createBatchTransactions(itemsToCreate);
    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    console.error('Erro ao criar lote de transações:', error);
    return NextResponse.json(
      { message: formatDatabaseError(error) },
      { status: 400 }
    );
  }
}
