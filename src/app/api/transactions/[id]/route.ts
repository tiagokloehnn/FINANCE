import { NextRequest, NextResponse } from 'next/server';
import { deleteTransaction } from '@/lib/services/transactionsService';

export const dynamic = 'force-dynamic';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json({ message: 'ID da transação não fornecido' }, { status: 400 });
    }

    const deleted = await deleteTransaction(id);
    return NextResponse.json({ success: true, deleted });
  } catch (error: any) {
    console.error('Erro ao excluir transação:', error);
    return NextResponse.json(
      { message: error?.message || 'Erro ao excluir transação' },
      { status: 400 }
    );
  }
}
