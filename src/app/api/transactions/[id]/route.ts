import { NextRequest, NextResponse } from 'next/server';
import { deleteTransaction } from '@/lib/services/transactionsService';
import { formatDatabaseError } from '@/lib/formatError';

export const dynamic = 'force-dynamic';

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
