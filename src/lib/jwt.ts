import { SignJWT, jwtVerify } from 'jose';

export const AUTH_COOKIE_NAME = 'finance_cfo_token';

// Segredo JWT para assinatura e verificação
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'finance-cfo-secret-token-key-2026-secure-auth'
);

export interface TokenPayload {
  userId: string;
  email: string;
  name: string;
}

/**
 * Gera um JWT assinado válido por 30 dias (compatível com Edge e Node.js)
 */
export async function signToken(payload: TokenPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(JWT_SECRET);
}

/**
 * Verifica e decodifica um JWT (100% nativo Edge e Node.js via jose)
 */
export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (!payload || typeof payload.userId !== 'string') {
      return null;
    }
    return {
      userId: payload.userId as string,
      email: (payload.email as string) || '',
      name: (payload.name as string) || '',
    };
  } catch {
    return null;
  }
}
