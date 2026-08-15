import { prisma } from '../prisma';
import { NatureType, AccountType } from '@prisma/client';
import { DreReport, ExecutiveOverview, CategoryBreakdown } from '../../types/finance';
import { seedDatabase } from './seedService';

export async function getDre(startDate?: string, endDate?: string): Promise<DreReport> {
  const where: any = {};

  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = new Date(startDate);
    if (endDate) where.date.lte = new Date(endDate);
  }

  const transactions = await prisma.transaction.findMany({
    where,
    include: {
      category: true,
    },
  });

  const categoryMap: Record<
    string,
    { id: string; name: string; natureType: NatureType; amount: number }
  > = {};

  let totalIncome = 0;
  let totalFixedCosts = 0;
  let totalVariableCosts = 0;
  let totalInvestments = 0;

  for (const tx of transactions) {
    const cat = tx.category;
    if (!categoryMap[cat.id]) {
      categoryMap[cat.id] = {
        id: cat.id,
        name: cat.name,
        natureType: cat.natureType,
        amount: 0,
      };
    }
    categoryMap[cat.id].amount += tx.amount;

    switch (cat.natureType) {
      case NatureType.INCOME:
        totalIncome += tx.amount;
        break;
      case NatureType.FIXED_COST:
        totalFixedCosts += tx.amount;
        break;
      case NatureType.VARIABLE_COST:
        totalVariableCosts += tx.amount;
        break;
      case NatureType.INVESTMENT:
        totalInvestments += tx.amount;
        break;
    }
  }

  const grossOperatingResult = totalIncome - totalFixedCosts;
  const operatingCashFlow = grossOperatingResult - totalVariableCosts;
  const netCashFlow = operatingCashFlow - totalInvestments;

  const calculateBreakdown = (nature: NatureType, totalGroup: number): CategoryBreakdown[] => {
    return Object.values(categoryMap)
      .filter((c) => c.natureType === nature)
      .map((c) => ({
        id: c.id,
        name: c.name,
        amount: Number(c.amount.toFixed(2)),
        percentage:
          totalGroup > 0
            ? Number(((c.amount / totalGroup) * 100).toFixed(1))
            : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  };

  const grossMargin =
    totalIncome > 0
      ? Number(((grossOperatingResult / totalIncome) * 100).toFixed(1))
      : 0;

  const operatingSavingsMargin =
    totalIncome > 0
      ? Number(((operatingCashFlow / totalIncome) * 100).toFixed(1))
      : 0;

  const investmentRate =
    totalIncome > 0
      ? Number(((totalInvestments / totalIncome) * 100).toFixed(1))
      : 0;

  return {
    period: { startDate, endDate },
    totalIncome: Number(totalIncome.toFixed(2)),
    totalFixedCosts: Number(totalFixedCosts.toFixed(2)),
    grossOperatingResult: Number(grossOperatingResult.toFixed(2)),
    totalVariableCosts: Number(totalVariableCosts.toFixed(2)),
    operatingCashFlow: Number(operatingCashFlow.toFixed(2)),
    totalInvestments: Number(totalInvestments.toFixed(2)),
    netCashFlow: Number(netCashFlow.toFixed(2)),
    margins: {
      grossMargin,
      operatingSavingsMargin,
      investmentRate,
    },
    breakdown: {
      incomes: calculateBreakdown(NatureType.INCOME, totalIncome),
      fixedCosts: calculateBreakdown(NatureType.FIXED_COST, totalFixedCosts),
      variableCosts: calculateBreakdown(
        NatureType.VARIABLE_COST,
        totalVariableCosts,
      ),
      investments: calculateBreakdown(
        NatureType.INVESTMENT,
        totalInvestments,
      ),
    },
  };
}

export async function getExecutiveOverview(): Promise<ExecutiveOverview> {
  // Se não houver contas nem categorias, inicializa automaticamente para garantir que o dashboard nunca quebre
  const accountsCount = await prisma.account.count();
  if (accountsCount === 0) {
    await seedDatabase(false);
  }

  const accounts = await prisma.account.findMany({
    orderBy: { balance: 'desc' },
  });

  let totalFreeCash = 0; // CHECKING + CASH
  let totalEmergencyFund = 0; // SAVINGS
  let totalInvested = 0; // INVESTMENT

  for (const acc of accounts) {
    if (acc.type === AccountType.CHECKING || acc.type === AccountType.CASH) {
      totalFreeCash += acc.balance;
    } else if (acc.type === AccountType.SAVINGS) {
      totalEmergencyFund += acc.balance;
    } else if (acc.type === AccountType.INVESTMENT) {
      totalInvested += acc.balance;
    }
  }

  const totalLiquidCash = totalFreeCash + totalEmergencyFund;
  const totalNetWorth = totalLiquidCash + totalInvested;

  const dre = await getDre();

  const monthlyBurnRate = dre.totalFixedCosts + dre.totalVariableCosts;
  const runwayMonths =
    monthlyBurnRate > 0
      ? Number((totalLiquidCash / monthlyBurnRate).toFixed(1))
      : totalLiquidCash > 0
      ? 99.9
      : 0;

  let runwayStatus: 'EXCELLENT' | 'GOOD' | 'WARNING' | 'CRITICAL' = 'CRITICAL';
  if (runwayMonths >= 12) {
    runwayStatus = 'EXCELLENT';
  } else if (runwayMonths >= 6) {
    runwayStatus = 'GOOD';
  } else if (runwayMonths >= 3) {
    runwayStatus = 'WARNING';
  }

  return {
    liquidity: {
      totalFreeCash: Number(totalFreeCash.toFixed(2)),
      totalEmergencyFund: Number(totalEmergencyFund.toFixed(2)),
      totalInvested: Number(totalInvested.toFixed(2)),
      totalNetWorth: Number(totalNetWorth.toFixed(2)),
    },
    metrics: {
      operatingSavingsMargin: dre.margins.operatingSavingsMargin,
      monthlyBurnRate: Number(monthlyBurnRate.toFixed(2)),
      runwayMonths,
      runwayStatus,
      savingsRate: dre.margins.investmentRate,
    },
    dreSummary: {
      totalIncome: dre.totalIncome,
      totalOperatingCosts: Number(monthlyBurnRate.toFixed(2)),
      operatingCashFlow: dre.operatingCashFlow,
      totalInvestments: dre.totalInvestments,
      netCashFlow: dre.netCashFlow,
    },
    accounts: accounts.map((a) => ({
      id: a.id,
      userId: a.userId,
      name: a.name,
      type: a.type as AccountType,
      balance: Number(a.balance.toFixed(2)),
    })),
  };
}
