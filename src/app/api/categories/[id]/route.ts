import { NextRequest, NextResponse } from 'next/server';
import { deleteCategory, updateCategory } from '@/lib/services/categoriesService';
import { formatDatabaseError } from '@/lib/formatError';

export const dynamic = 'force-dynamic';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json({ message: 'ID da categoria não fornecido' }, { status: 400 });
    }

    const deleted = await deleteCategory(id);
    return NextResponse.json({ success: true, deleted });
  } catch (error: any) {
    console.error('Erro ao excluir categoria:', error);
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
      return NextResponse.json({ message: 'ID da categoria não fornecido' }, { status: 400 });
    }

    const body = await request.json();
    const updated = await updateCategory(id, body);
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('Erro ao atualizar categoria:', error);
    return NextResponse.json(
      { message: formatDatabaseError(error) },
      { status: 400 }
    );
  }
}
