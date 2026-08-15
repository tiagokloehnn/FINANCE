import { prisma } from '../prisma';
import { AccountType } from '@prisma/client';
import { seedDatabase } from './seedService';

export async function getAccounts(userId?: string) {
  // Auto-seed se não houver contas
  const count = await prisma.account.count();
  if (count === 0) {
    await seedDatabase(false);
  }

  const where = userId ? { userId } : {};
  return prisma.account.findMany({
    where,
    orderBy: { name: 'asc' },
  });
}

export async function createAccount(data: {
  name: string;
  type: AccountType;
  balance?: number;
  userId?: string;
}) {
  let user = data.userId ? await prisma.user.findUnique({ where: { id: data.userId } }) : null;
  if (!user) {
    user = await prisma.user.findFirst();
    if (!user) {
      const seedRes = await seedDatabase(false);
      user = seedRes.user;
    }
  }

  return prisma.account.create({
    data: {
      name: data.name,
      type: data.type,
      balance: data.balance ?? 0,
      userId: user!.id,
    },
  });
}
