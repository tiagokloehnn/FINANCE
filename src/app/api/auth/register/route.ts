import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { hashPassword, signToken, AUTH_COOKIE_NAME } from '../../../../lib/auth';
import { seedUserDatabase } from '../../../../lib/services/seedService';
import { formatError } from '../../../../lib/formatError';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Informe seu nome completo.' },
        { status: 400 }
      );
    }

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Informe um endereço de email válido.' },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: 'A senha deve ter pelo menos 6 caracteres.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Verifica se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Este email já está cadastrado. Faça login ou use outro email.' },
        { status: 409 }
      );
    }

    // Criptografa a senha com bcrypt
    const hashedPassword = await hashPassword(password);

    // Cria o usuário
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        password: hashedPassword,
      },
    });

    // Cria automaticamente o plano de contas e categorias exclusivo para este usuário
    await seedUserDatabase(user.id);

    // Gera token JWT de sessão
    const token = await signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );

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
    console.error('Erro na rota de registro:', error);
    const friendly = formatError(error, 'Erro ao criar conta de usuário.');
    return NextResponse.json(
      { error: friendly.message },
      { status: 500 }
    );
  }
}
