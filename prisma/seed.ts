import { prisma } from '../src/lib/prisma';
import { seedDatabase } from '../src/lib/services/seedService';

async function main() {
  console.log('Iniciando seed no banco de dados (Supabase / PostgreSQL)...');
  const result = await seedDatabase(true);
  console.log(result.message);
  console.log('Usuário padrão configurado:', result.user?.email);
  console.log('Contas e categorias contábeis criadas com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
