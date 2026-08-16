import { NextRequest, NextResponse } from 'next/server';
import { getExecutiveOverview } from '@/lib/services/reportsService';
import { formatDatabaseError } from '@/lib/formatError';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || undefined;
    const overview = await getExecutiveOverview(userId);
    return NextResponse.json(overview);
  } catch (error: any) {
    console.error('Erro ao gerar visão executiva:', error);
    return NextResponse.json(
      { message: formatDatabaseError(error) },
      { status: 500 }
    );
  }
}
