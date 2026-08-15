import { NextResponse } from 'next/server';
import { getExecutiveOverview } from '@/lib/services/reportsService';
import { formatDatabaseError } from '@/lib/formatError';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const overview = await getExecutiveOverview();
    return NextResponse.json(overview);
  } catch (error: any) {
    console.error('Erro ao buscar overview executivo:', error);
    return NextResponse.json(
      { message: formatDatabaseError(error) },
      { status: 500 }
    );
  }
}
