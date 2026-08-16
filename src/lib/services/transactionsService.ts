import { prisma } from '../prisma';
import { NatureType } from '@prisma/client';
import { seedUserDatabase } from './seedService';

export interface CreateTransactionDto {
  accountId: string;
  categoryId: string;
  amount: number;
  description: string;
  date?: string;
  isRealized?: boolean;
  userId?: string;
}

export async function createTransaction(dto: CreateTransactionDto) {
  let categoryWhere: any = { id: dto.categoryId };
  let accountWhere: any = { id: dto.accountId };

  if (dto.userId) {
    categoryWhere = { id: dto.categoryId, userId: dto.userId };
    accountWhere = { id: dto.accountId, userId: dto.userId };
  }

  let category = await prisma.category.findFirst({
    where: categoryWhere,
  });

  // Se o frontend passou um mock ID (ex: c1..c11) ou ID não encontrado, tenta achar pelo nome
  if (!category && dto.userId) {
    category = await prisma.category.findFirst({
      where: {
        userId: dto.userId,
        name: { equals: dto.categoryId, mode: 'insensitive' },
      },
    });
  }

  if (!category && dto.userId) {
    category = await prisma.category.findFirst({ where: { userId: dto.userId } });
  }

  if (!category) {
    throw new Error(`Categoria não encontrada.`);
  }

  let account = await prisma.account.findFirst({
    where: accountWhere,
  });

  if (!account && dto.userId) {
    account = await prisma.account.findFirst({ where: { userId: dto.userId } });
  }

  if (!account) {
    throw new Error(`Conta financeira não encontrada.`);
  }

  const isRealized = dto.isRealized ?? true;
  const date = dto.date ? new Date(dto.date) : new Date();

  const transaction = await prisma.transaction.create({
    data: {
      accountId: account.id,
      categoryId: category.id,
      amount: dto.amount,
      description: dto.description.trim(),
      date,
      isRealized,
    },
    include: {
      account: true,
      category: true,
    },
  });

  // Se a transação foi realizada, atualiza o saldo da conta
  if (isRealized) {
    const balanceDelta =
      category.natureType === NatureType.INCOME
        ? dto.amount
        : -dto.amount;

    await prisma.account.update({
      where: { id: account.id },
      data: {
        balance: {
          increment: balanceDelta,
        },
      },
    });
  }

  return transaction;
}

export async function getTransactions(filters?: {
  startDate?: string;
  endDate?: string;
  natureType?: NatureType;
  accountId?: string;
  isRealized?: boolean;
  userId?: string;
}) {
  const where: any = {};

  if (filters?.userId) {
    where.account = { userId: filters.userId };
  }

  if (filters?.startDate || filters?.endDate) {
    where.date = {};
    if (filters.startDate) where.date.gte = new Date(filters.startDate);
    if (filters.endDate) where.date.lte = new Date(filters.endDate);
  }

  if (filters?.natureType) {
    where.category = {
      ...(where.category || {}),
      natureType: filters.natureType,
    };
  }

  if (filters?.accountId) {
    where.accountId = filters.accountId;
  }

  if (filters?.isRealized !== undefined) {
    where.isRealized = filters.isRealized;
  }

  return prisma.transaction.findMany({
    where,
    include: {
      account: true,
      category: true,
    },
    orderBy: {
      date: 'desc',
    },
  });
}

export async function deleteTransaction(id: string, userId?: string) {
  const tx = await prisma.transaction.findUnique({
    where: { id },
    include: { account: true, category: true },
  });

  if (!tx) {
    throw new Error('Transação não encontrada');
  }

  // Verifica se a transação pertence ao usuário autenticado
  if (userId && tx.account.userId !== userId) {
    throw new Error('Não autorizado a excluir esta transação.');
  }

  // Reverte o saldo se realizada
  if (tx.isRealized) {
    const balanceDelta =
      tx.category.natureType === NatureType.INCOME
        ? -tx.amount
        : tx.amount;

    await prisma.account.update({
      where: { id: tx.accountId },
      data: {
        balance: {
          increment: balanceDelta,
        },
      },
    });
  }

  return prisma.transaction.delete({
    where: { id },
  });
}
