import { NextRequest, NextResponse } from 'next/server';
import { deleteAccount, updateAccount } from '@/lib/services/accountsService';
import { formatDatabaseError } from '@/lib/formatError';

export const dynamic = 'force-dynamic';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json({ message: 'ID da conta não fornecido' }, { status: 400 });
    }

    const deleted = await deleteAccount(id);
    return NextResponse.json({ success: true, deleted });
  } catch (error: any) {
    console.error('Erro ao excluir conta:', error);
    return NextResponse.json(
      { message: formatDatabaseError(error) },
      { status: 400 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json({ message: 'ID da conta não fornecido' }, { status: 400 });
    }

    const body = await request.json();
    const updated = await updateAccount(id, body);
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('Erro ao atualizar conta:', error);
    return NextResponse.json(
      { message: formatDatabaseError(error) },
      { status: 400 }
    );
  }
}
