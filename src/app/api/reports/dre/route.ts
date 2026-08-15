import { NextRequest, NextResponse } from 'next/server';
import { getDre } from '@/lib/services/reportsService';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate') || undefined;
    const endDate = searchParams.get('endDate') || undefined;

    const dre = await getDre(startDate, endDate);
    return NextResponse.json(dre);
  } catch (error: any) {
    console.error('Erro ao gerar relatório DRE:', error);
    return NextResponse.json(
      { message: 'Erro ao gerar DRE', error: error?.message },
      { status: 500 }
    );
  }
}
