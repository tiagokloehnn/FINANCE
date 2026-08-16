import { NextRequest, NextResponse } from 'next/server';
import { updateAccount, deleteAccount } from '@/lib/services/accountsService';
import { formatDatabaseError } from '@/lib/formatError';

export const dynamic = 'force-dynamic';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('x-user-id') || undefined;
    const body = await request.json();
    const updated = await updateAccount(params.id, {
      name: body.name,
      type: body.type,
      balance: body.balance !== undefined ? Number(body.balance) : undefined,
      userId,
    });
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('Erro ao atualizar conta:', error);
    return NextResponse.json(
      { message: formatDatabaseError(error, 'Erro ao atualizar conta.') },
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
    await deleteAccount(params.id, userId);
    return NextResponse.json({ success: true, message: 'Conta excluída com sucesso.' });
  } catch (error: any) {
    console.error('Erro ao excluir conta:', error);
    return NextResponse.json(
      { message: formatDatabaseError(error, 'Erro ao excluir conta.') },
      { status: 500 }
    );
  }
}
