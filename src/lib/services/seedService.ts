import { prisma } from '../prisma';
import { NatureType, AccountType } from '@prisma/client';

export const DEFAULT_CATEGORIES = [
  // RECEITAS (INCOME)
  { name: 'Salário / Pro-labore', natureType: NatureType.INCOME },
  { name: 'Dividendos & Rendimentos', natureType: NatureType.INCOME },
  { name: 'Serviços / Freelance / Extras', natureType: NatureType.INCOME },
  { name: 'Outras Receitas', natureType: NatureType.INCOME },

  // CUSTOS FIXOS (FIXED_COST)
  { name: 'Moradia (Aluguel / Condomínio / IPTU)', natureType: NatureType.FIXED_COST },
  { name: 'Contas Básicas (Luz, Água, Gás, Internet)', natureType: NatureType.FIXED_COST },
  { name: 'Saúde & Seguros', natureType: NatureType.FIXED_COST },
  { name: 'Educação & Assinaturas', natureType: NatureType.FIXED_COST },

  // CUSTOS VARIÁVEIS (VARIABLE_COST)
  { name: 'Supermercado & Alimentação Básica', natureType: NatureType.VARIABLE_COST },
  { name: 'Restaurantes & Delivery', natureType: NatureType.VARIABLE_COST },
  { name: 'Transporte & Combustível', natureType: NatureType.VARIABLE_COST },
  { name: 'Lazer, Viagens & Entretenimento', natureType: NatureType.VARIABLE_COST },
  { name: 'Compras Pessoais & Vestuário', natureType: NatureType.VARIABLE_COST },
  { name: 'Outros Gastos Variáveis', natureType: NatureType.VARIABLE_COST },

  // INVESTIMENTOS (INVESTMENT)
  { name: 'Aportes em Renda Variável (Ações / FIIs)', natureType: NatureType.INVESTMENT },
  { name: 'Aportes em Renda Fixa / Tesouro Direto', natureType: NatureType.INVESTMENT },
  { name: 'Aportes Internacionais / Cripto', natureType: NatureType.INVESTMENT },
];

export async function seedDatabase(reset: boolean = false) {
  if (reset) {
    await prisma.transaction.deleteMany();
    await prisma.category.deleteMany();
    await prisma.account.deleteMany();
    await prisma.user.deleteMany();
  }

  // 1. Obtém ou cria usuário padrão
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'investidor@finance.local',
        name: 'Diretor Financeiro Pessoal',
      },
    });
  }

  // 2. Cria contas padrão se não existirem
  const existingAccounts = await prisma.account.findMany({ where: { userId: user.id } });
  if (existingAccounts.length === 0) {
    await prisma.account.createMany({
      data: [
        {
          userId: user.id,
          name: 'Conta Corrente Principal',
          type: AccountType.CHECKING,
          balance: 0.0,
        },
        {
          userId: user.id,
          name: 'Reserva de Emergência (Liquidez Diária)',
          type: AccountType.SAVINGS,
          balance: 0.0,
        },
        {
          userId: user.id,
          name: 'Corretora de Investimentos',
          type: AccountType.INVESTMENT,
          balance: 0.0,
        },
      ],
    });
  }

  // 3. Cria categorias contábeis padrão se não existirem
  const existingCategories = await prisma.category.findMany({ where: { userId: user.id } });
  if (existingCategories.length === 0) {
    await prisma.category.createMany({
      data: DEFAULT_CATEGORIES.map((cat) => ({
        userId: user.id,
        name: cat.name,
        natureType: cat.natureType,
      })),
    });
  }

  return {
    success: true,
    user,
    message: 'Banco de dados inicializado com sucesso!',
  };
}
