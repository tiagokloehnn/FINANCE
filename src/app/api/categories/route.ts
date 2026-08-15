import { NextRequest, NextResponse } from 'next/server';
import { getCategories, createCategory } from '@/lib/services/categoriesService';
import { NatureType } from '@prisma/client';
import { formatDatabaseError } from '@/lib/formatError';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || undefined;

    const categories = await getCategories(userId);
    return NextResponse.json(categories);
  } catch (error: any) {
    console.error('Erro ao buscar categorias:', error);
    return NextResponse.json(
      { message: formatDatabaseError(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name || !body.natureType) {
      return NextResponse.json(
        { message: 'Campos obrigatórios: name, natureType' },
        { status: 400 }
      );
    }

    const category = await createCategory({
      name: body.name,
      natureType: body.natureType as NatureType,
      userId: body.userId,
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    console.error('Erro ao criar categoria:', error);
    return NextResponse.json(
      { message: formatDatabaseError(error) },
      { status: 400 }
    );
  }
}
