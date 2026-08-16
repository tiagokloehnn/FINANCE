import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { TokenPayload, signToken, verifyToken, AUTH_COOKIE_NAME } from './jwt';

export * from './jwt';

/**
 * Criptografa uma senha em texto puro usando bcrypt (12 salt rounds)
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

/**
 * Compara uma senha em texto puro com o hash criptografado
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  if (!password || !hash) return false;
  return bcrypt.compare(password, hash);
}

/**
 * Obtém a sessão do usuário autenticado a partir dos cookies do Next.js ou headers
 */
export async function getAuthSession(req?: Request): Promise<TokenPayload | null> {
  // 1. Tenta obter do header customizado injetado pelo middleware
  if (req) {
    const headerUserId = req.headers.get('x-user-id');
    const headerEmail = req.headers.get('x-user-email');
    const headerName = req.headers.get('x-user-name');

    if (headerUserId) {
      return {
        userId: headerUserId,
        email: headerEmail || '',
        name: headerName ? decodeURIComponent(headerName) : '',
      };
    }

    // Tenta Authorization header
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      return verifyToken(token);
    }
  }

  // 2. Tenta obter do cookie da requisição
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (token) {
      return verifyToken(token);
    }
  } catch {
    // cookies() pode não estar disponível em certos contextos
  }

  return null;
}
