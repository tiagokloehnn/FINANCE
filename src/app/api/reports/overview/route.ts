import { NextResponse } from 'next/server';
import { getExecutiveOverview } from '@/lib/services/reportsService';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const overview = await getExecutiveOverview();
    return NextResponse.json(overview);
  } catch (error: any) {
    console.error('Erro ao buscar overview executivo:', error);
    return NextResponse.json(
      { message: 'Erro ao processar visão geral executiva', error: error?.message },
      { status: 500 }
    );
  }
}
