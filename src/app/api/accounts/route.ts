import { NextRequest, NextResponse } from 'next/server';
import { getAccounts, createAccount } from '@/lib/services/accountsService';
import { AccountType } from '@prisma/client';
import { formatDatabaseError } from '@/lib/formatError';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || undefined;
    const accounts = await getAccounts(userId);
    return NextResponse.json(accounts);
  } catch (error: any) {
    console.error('Erro ao buscar contas:', error);
    return NextResponse.json(
      { message: formatDatabaseError(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || undefined;
    const body = await request.json();

    if (!body.name || !body.type) {
      return NextResponse.json(
        { message: 'Campos obrigatórios: name, type' },
        { status: 400 }
      );
    }

    const account = await createAccount({
      name: body.name,
      type: body.type as AccountType,
      balance: body.balance !== undefined ? Number(body.balance) : 0,
      userId: userId || body.userId,
    });

    return NextResponse.json(account, { status: 201 });
  } catch (error: any) {
    console.error('Erro ao criar conta:', error);
    return NextResponse.json(
      { message: formatDatabaseError(error) },
      { status: 400 }
    );
  }
}
