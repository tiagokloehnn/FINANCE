import { NextRequest, NextResponse } from 'next/server';
import { updateCategory, deleteCategory } from '@/lib/services/categoriesService';
import { formatDatabaseError } from '@/lib/formatError';

export const dynamic = 'force-dynamic';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('x-user-id') || undefined;
    const body = await request.json();
    const updated = await updateCategory(params.id, {
      name: body.name,
      natureType: body.natureType,
      userId,
    });
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('Erro ao atualizar categoria:', error);
    return NextResponse.json(
      { message: formatDatabaseError(error, 'Erro ao atualizar categoria.') },
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
    await deleteCategory(params.id, userId);
    return NextResponse.json({ success: true, message: 'Categoria excluída com sucesso.' });
  } catch (error: any) {
    console.error('Erro ao excluir categoria:', error);
    return NextResponse.json(
      { message: formatDatabaseError(error, 'Erro ao excluir categoria.') },
      { status: 500 }
    );
  }
}
