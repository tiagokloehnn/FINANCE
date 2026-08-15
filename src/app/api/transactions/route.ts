import { NextRequest, NextResponse } from 'next/server';
import { getTransactions, createTransaction } from '@/lib/services/transactionsService';
import { NatureType } from '@prisma/client';
import { formatDatabaseError } from '@/lib/formatError';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate') || undefined;
    const endDate = searchParams.get('endDate') || undefined;
    const natureType = (searchParams.get('natureType') as NatureType) || undefined;
    const accountId = searchParams.get('accountId') || undefined;
    const isRealizedParam = searchParams.get('isRealized');
    const isRealized = isRealizedParam !== null ? isRealizedParam === 'true' : undefined;

    const transactions = await getTransactions({
      startDate,
      endDate,
      natureType,
      accountId,
      isRealized,
    });

    return NextResponse.json(transactions);
  } catch (error: any) {
    console.error('Erro ao buscar transações:', error);
    return NextResponse.json(
      { message: formatDatabaseError(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.accountId || !body.categoryId || body.amount === undefined || !body.description) {
      return NextResponse.json(
        { message: 'Campos obrigatórios ausentes: accountId, categoryId, amount, description' },
        { status: 400 }
      );
    }

    const transaction = await createTransaction({
      accountId: body.accountId,
      categoryId: body.categoryId,
      amount: Number(body.amount),
      description: body.description,
      date: body.date,
      isRealized: body.isRealized,
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error: any) {
    console.error('Erro ao criar transação:', error);
    return NextResponse.json(
      { message: formatDatabaseError(error) },
      { status: 400 }
    );
  }
}
