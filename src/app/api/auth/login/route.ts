import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { comparePassword, hashPassword, signToken, AUTH_COOKIE_NAME } from '../../../../lib/auth';
import { formatError } from '../../../../lib/formatError';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Informe seu email e senha.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Busca usuário pelo email
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Email ou senha inválidos.' },
        { status: 401 }
      );
    }

    // Se o usuário existente não tiver senha cadastrada (ex: usuário prévio do banco), atualiza a senha agora
    if (!user.password) {
      const hashedPassword = await hashPassword(password);
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });
    } else {
      // Valida senha com bcrypt
      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        return NextResponse.json(
          { error: 'Email ou senha inválidos.' },
          { status: 401 }
        );
      }
    }

    // Gera token JWT de sessão
    const token = await signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });

    // Define cookie HttpOnly seguro
    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 dias
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Erro na rota de login:', error);
    const friendly = formatError(error, 'Erro ao autenticar usuário.');
    return NextResponse.json(
      { error: friendly.message },
      { status: 500 }
    );
  }
}
