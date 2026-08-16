import { prisma } from '../prisma';
import { NatureType } from '@prisma/client';
import { seedUserDatabase } from './seedService';

export async function getCategories(userId?: string) {
  if (userId) {
    const userCatCount = await prisma.category.count({ where: { userId } });
    if (userCatCount === 0) {
      await seedUserDatabase(userId);
    }
  }

  const where = userId ? { userId } : {};
  return prisma.category.findMany({
    where,
    include: {
      _count: {
        select: { transactions: true },
      },
    },
    orderBy: [{ natureType: 'asc' }, { name: 'asc' }],
  });
}

export async function createCategory(data: { name: string; natureType: NatureType; userId?: string }) {
  let userId = data.userId;
  if (!userId) {
    const user = await prisma.user.findFirst();
    if (user) userId = user.id;
  }

  if (!userId) {
    throw new Error('Usuário não identificado.');
  }

  return prisma.category.create({
    data: {
      name: data.name.trim(),
      natureType: data.natureType,
      userId,
    },
    include: {
      _count: {
        select: { transactions: true },
      },
    },
  });
}

export async function updateCategory(
  id: string,
  data: { name?: string; natureType?: NatureType; userId?: string }
) {
  const where: any = { id };
  if (data.userId) {
    where.userId = data.userId;
  }

  return prisma.category.update({
    where,
    data: {
      ...(data.name && { name: data.name.trim() }),
      ...(data.natureType && { natureType: data.natureType }),
    },
    include: {
      _count: {
        select: { transactions: true },
      },
    },
  });
}

export async function deleteCategory(id: string, userId?: string) {
  const where: any = { id };
  if (userId) {
    where.userId = userId;
  }

  return prisma.category.delete({
    where,
  });
}
