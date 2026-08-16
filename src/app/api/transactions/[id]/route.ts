import { NextRequest, NextResponse } from 'next/server';
import { deleteTransaction, updateTransaction } from '@/lib/services/transactionsService';
import { formatDatabaseError } from '@/lib/formatError';

export const dynamic = 'force-dynamic';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('x-user-id') || undefined;
    const body = await request.json();

    const updated = await updateTransaction(
      params.id,
      {
        amount: body.amount !== undefined ? Number(body.amount) : undefined,
        description: body.description,
        date: body.date,
        isRealized: body.isRealized !== undefined ? Boolean(body.isRealized) : undefined,
        accountId: body.accountId,
        categoryId: body.categoryId,
      },
      userId
    );

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('Erro ao atualizar transação:', error);
    return NextResponse.json(
      { message: formatDatabaseError(error, 'Erro ao atualizar transação.') },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('x-user-id') || undefined;
    await deleteTransaction(params.id, userId);
    return NextResponse.json({ success: true, message: 'Transação excluída com sucesso.' });
  } catch (error: any) {
    console.error('Erro ao excluir transação:', error);
    return NextResponse.json(
      { message: formatDatabaseError(error, 'Erro ao excluir transação.') },
      { status: 500 }
    );
  }
}
