import { NextRequest, NextResponse } from 'next/server';
import { seedDatabase, seedUserDatabase } from '@/lib/services/seedService';
import { formatDatabaseError } from '@/lib/formatError';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || undefined;
    const body = await request.json().catch(() => ({}));
    const reset = Boolean(body.reset);

    if (userId && !reset) {
      await seedUserDatabase(userId);
      return NextResponse.json({
        success: true,
        message: 'Plano de contas pessoal restaurado com sucesso!',
      });
    }

    const result = await seedDatabase(reset);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Erro ao executar seed da API:', error);
    return NextResponse.json(
      { message: formatDatabaseError(error) },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || undefined;
    if (userId) {
      await seedUserDatabase(userId);
      return NextResponse.json({
        success: true,
        message: 'Plano de contas verificado com sucesso!',
      });
    }

    const result = await seedDatabase(false);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Erro ao verificar/inicializar banco de dados:', error);
    return NextResponse.json(
      { message: formatDatabaseError(error) },
      { status: 500 }
    );
  }
}
