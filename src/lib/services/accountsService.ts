import { prisma } from '../prisma';
import { AccountType } from '@prisma/client';
import { seedUserDatabase } from './seedService';

export async function getAccounts(userId?: string) {
  if (userId) {
    const userAccCount = await prisma.account.count({ where: { userId } });
    if (userAccCount === 0) {
      await seedUserDatabase(userId);
    }
  }

  const where = userId ? { userId } : {};
  return prisma.account.findMany({
    where,
    include: {
      _count: {
        select: { transactions: true },
      },
    },
    orderBy: { name: 'asc' },
  });
}

export async function createAccount(data: {
  name: string;
  type: AccountType;
  balance?: number;
  userId?: string;
}) {
  let userId = data.userId;
  if (!userId) {
    const user = await prisma.user.findFirst();
    if (user) userId = user.id;
  }

  if (!userId) {
    throw new Error('Usuário não identificado.');
  }

  return prisma.account.create({
    data: {
      name: data.name.trim(),
      type: data.type,
      balance: data.balance ?? 0,
      userId,
    },
    include: {
      _count: {
        select: { transactions: true },
      },
    },
  });
}

export async function updateAccount(
  id: string,
  data: { name?: string; type?: AccountType; balance?: number; userId?: string }
) {
  const where: any = { id };
  if (data.userId) {
    where.userId = data.userId;
  }

  return prisma.account.update({
    where,
    data: {
      ...(data.name && { name: data.name.trim() }),
      ...(data.type && { type: data.type }),
      ...(data.balance !== undefined && { balance: data.balance }),
    },
    include: {
      _count: {
        select: { transactions: true },
      },
    },
  });
}

export async function deleteAccount(id: string, userId?: string) {
  const where: any = { id };
  if (userId) {
    where.userId = userId;
  }

  return prisma.account.delete({
    where,
  });
}
