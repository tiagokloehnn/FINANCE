import { NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME } from '../../../../lib/auth';

export const dynamic = 'force-dynamic';

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: 'Logout realizado com sucesso.',
  });

  // Limpa o cookie de autenticação
  response.cookies.set(AUTH_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });

  return response;
}
