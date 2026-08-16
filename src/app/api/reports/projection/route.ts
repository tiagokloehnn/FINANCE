import { NextRequest, NextResponse } from 'next/server';
import { getCashFlowProjection } from '@/lib/services/reportsService';
import { formatDatabaseError } from '@/lib/formatError';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || undefined;
    const { searchParams } = new URL(request.url);
    const monthsParam = searchParams.get('months');
    const months = monthsParam ? parseInt(monthsParam, 10) : 6;

    const projection = await getCashFlowProjection(months, userId);
    return NextResponse.json(projection);
  } catch (error: any) {
    console.error('Erro ao calcular projeção de fluxo de caixa:', error);
    return NextResponse.json(
      { message: formatDatabaseError(error, 'Erro ao calcular projeção de fluxo de caixa.') },
      { status: 500 }
    );
  }
}
