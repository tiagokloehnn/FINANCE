import { NextRequest, NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/services/seedService';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const reset = Boolean(body.reset);

    const result = await seedDatabase(reset);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Erro ao executar seed da API:', error);
    return NextResponse.json(
      { message: 'Erro ao inicializar banco de dados', error: error?.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const result = await seedDatabase(false);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Erro ao verificar/inicializar banco de dados:', error);
    return NextResponse.json(
      { message: 'Erro ao inicializar banco de dados', error: error?.message },
      { status: 500 }
    );
  }
}
