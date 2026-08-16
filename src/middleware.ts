import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken, AUTH_COOKIE_NAME } from './lib/jwt';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Rotas públicas que não requerem autenticação
  const isPublicRoute =
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/api/auth/login') ||
    pathname.startsWith('/api/auth/register') ||
    pathname.startsWith('/api/auth/logout') ||
    pathname === '/manifest.webmanifest' ||
    pathname === '/favicon.ico' ||
    pathname.startsWith('/_next') ||
    pathname.includes('.');

  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  const verifiedUser = token ? await verifyToken(token) : null;

  // 1. Se estiver acessando tela de login ou registro e já estiver logado, redireciona para a home
  if (verifiedUser && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // 2. Se for rota pública, permite passar
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // 3. Se não estiver autenticado:
  if (!verifiedUser) {
    // Se for requisição para API protegida, retorna 401 Unauthorized
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Não autorizado. Faça login para acessar seus dados financeiros.' },
        { status: 401 }
      );
    }

    // Se for página web, redireciona para o login
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 4. Usuário autenticado: injeta dados no request header para as APIs internas
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-user-id', verifiedUser.userId);
  requestHeaders.set('x-user-email', verifiedUser.email);
  requestHeaders.set('x-user-name', encodeURIComponent(verifiedUser.name));

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
