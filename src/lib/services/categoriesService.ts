import { prisma } from '../prisma';
import { NatureType } from '@prisma/client';
import { seedDatabase } from './seedService';

export async function getCategories(userId?: string) {
  // Se não houver categorias no banco, roda auto-seed para garantir prontidão
  const count = await prisma.category.count();
  if (count === 0) {
    await seedDatabase(false);
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
  let user = data.userId ? await prisma.user.findUnique({ where: { id: data.userId } }) : null;
  if (!user) {
    user = await prisma.user.findFirst();
    if (!user) {
      const seedRes = await seedDatabase(false);
      user = seedRes.user;
    }
  }

  return prisma.category.create({
    data: {
      name: data.name,
      natureType: data.natureType,
      userId: user!.id,
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
  data: { name?: string; natureType?: NatureType }
) {
  return prisma.category.update({
    where: { id },
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

export async function deleteCategory(id: string) {
  return prisma.category.delete({
    where: { id },
  });
}
