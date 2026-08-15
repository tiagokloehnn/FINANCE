import { prisma } from '../prisma';
import { NatureType } from '@prisma/client';

export interface CreateTransactionDto {
  accountId: string;
  categoryId: string;
  amount: number;
  description: string;
  date?: string;
  isRealized?: boolean;
}

export async function createTransaction(dto: CreateTransactionDto) {
  const category = await prisma.category.findUnique({
    where: { id: dto.categoryId },
  });

  if (!category) {
    throw new Error(`Categoria com ID ${dto.categoryId} não encontrada`);
  }

  const isRealized = dto.isRealized ?? true;
  const date = dto.date ? new Date(dto.date) : new Date();

  const transaction = await prisma.transaction.create({
    data: {
      accountId: dto.accountId,
      categoryId: dto.categoryId,
      amount: dto.amount,
      description: dto.description,
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
      where: { id: dto.accountId },
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
}) {
  const where: any = {};

  if (filters?.startDate || filters?.endDate) {
    where.date = {};
    if (filters.startDate) where.date.gte = new Date(filters.startDate);
    if (filters.endDate) where.date.lte = new Date(filters.endDate);
  }

  if (filters?.natureType) {
    where.category = {
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

export async function deleteTransaction(id: string) {
  const transaction = await prisma.transaction.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!transaction) {
    throw new Error(`Transação com ID ${id} não encontrada`);
  }

  // Reverte o saldo se estava realizada
  if (transaction.isRealized) {
    const balanceDelta =
      transaction.category.natureType === NatureType.INCOME
        ? -transaction.amount
        : transaction.amount;

    await prisma.account.update({
      where: { id: transaction.accountId },
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
