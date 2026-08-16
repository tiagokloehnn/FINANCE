import { prisma } from '../prisma';
import { NatureType, AccountType } from '@prisma/client';
import { DreReport, ExecutiveOverview, CategoryBreakdown } from '../../types/finance';
import { seedUserDatabase } from './seedService';

export async function getDre(startDate?: string, endDate?: string, userId?: string): Promise<DreReport> {
  const where: any = {};

  if (userId) {
    where.account = { userId };
  }

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

export async function getExecutiveOverview(userId?: string): Promise<ExecutiveOverview> {
  if (userId) {
    const accountsCount = await prisma.account.count({ where: { userId } });
    if (accountsCount === 0) {
      await seedUserDatabase(userId);
    }
  }

  const where = userId ? { userId } : {};
  const accounts = await prisma.account.findMany({
    where,
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

  const dre = await getDre(undefined, undefined, userId);

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
      savingsRate: dre.margins.operatingSavingsMargin,
      monthlyBurnRate: Number(monthlyBurnRate.toFixed(2)),
      runwayMonths,
      runwayStatus,
    },
    dreSummary: {
      totalIncome: dre.totalIncome,
      totalOperatingCosts: dre.totalFixedCosts + dre.totalVariableCosts,
      operatingCashFlow: dre.operatingCashFlow,
      totalInvestments: dre.totalInvestments,
      netCashFlow: dre.netCashFlow,
    },
    accounts: accounts.map((a) => ({
      id: a.id,
      userId: a.userId,
      name: a.name,
      type: a.type,
      balance: a.balance,
    })),
  };
}

export async function getCashFlowProjection(
  monthCount: number = 6,
  userId?: string
): Promise<import('../../types/finance').CashFlowProjectionReport> {
  const overview = await getExecutiveOverview(userId);
  const initialCash = overview.liquidity.totalFreeCash + overview.liquidity.totalEmergencyFund;

  const now = new Date();
  const months: import('../../types/finance').MonthlyProjection[] = [];

  let rollingCash = initialCash;
  let totalExpectedFutureSpend = 0;
  let totalExpectedFutureIncome = 0;

  const monthNames = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
  ];

  for (let i = 0; i < monthCount; i++) {
    const targetDate = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const year = targetDate.getFullYear();
    const month = targetDate.getMonth();

    const startOfMonth = new Date(year, month, 1, 0, 0, 0, 0);
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);

    const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
    const monthLabel = `${monthNames[month]}/${String(year).slice(-2)}`;
    const isCurrentMonth = i === 0;

    const where: any = {
      date: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    };

    if (userId) {
      where.account = { userId };
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        category: true,
        account: true,
      },
      orderBy: { date: 'asc' },
    });

    let expectedIncome = 0;
    let expectedFixedCosts = 0;
    let expectedVariableCosts = 0;
    let expectedInvestments = 0;
    let pendingCount = 0;

    for (const tx of transactions) {
      if (!tx.isRealized) {
        pendingCount++;
      }

      switch (tx.category.natureType) {
        case NatureType.INCOME:
          expectedIncome += tx.amount;
          break;
        case NatureType.FIXED_COST:
          expectedFixedCosts += tx.amount;
          break;
        case NatureType.VARIABLE_COST:
          expectedVariableCosts += tx.amount;
          break;
        case NatureType.INVESTMENT:
          expectedInvestments += tx.amount;
          break;
      }
    }

    const totalOutflow = expectedFixedCosts + expectedVariableCosts + expectedInvestments;
    const netMonthlyResult = expectedIncome - totalOutflow;

    const startingCash = rollingCash;
    const endingCash = startingCash + netMonthlyResult;
    rollingCash = endingCash;

    if (i > 0) {
      totalExpectedFutureSpend += totalOutflow;
      totalExpectedFutureIncome += expectedIncome;
    }

    const monthlyBurn = totalOutflow > 0 ? totalOutflow : (overview.metrics.monthlyBurnRate || 1);
    const runwayMonths = monthlyBurn > 0 ? Number((endingCash / monthlyBurn).toFixed(1)) : 99.9;

    let status: 'EXCELLENT' | 'GOOD' | 'WARNING' | 'CRITICAL' = 'GOOD';
    if (endingCash < 0) {
      status = 'CRITICAL';
    } else if (runwayMonths >= 6) {
      status = 'EXCELLENT';
    } else if (runwayMonths >= 3) {
      status = 'GOOD';
    } else {
      status = 'WARNING';
    }

    months.push({
      monthKey,
      monthLabel,
      isCurrentMonth,
      startingCash: Number(startingCash.toFixed(2)),
      expectedIncome: Number(expectedIncome.toFixed(2)),
      expectedFixedCosts: Number(expectedFixedCosts.toFixed(2)),
      expectedVariableCosts: Number(expectedVariableCosts.toFixed(2)),
      expectedInvestments: Number(expectedInvestments.toFixed(2)),
      totalOutflow: Number(totalOutflow.toFixed(2)),
      netMonthlyResult: Number(netMonthlyResult.toFixed(2)),
      endingCash: Number(endingCash.toFixed(2)),
      runwayMonths: runwayMonths > 0 ? runwayMonths : 0,
      status,
      pendingTransactionsCount: pendingCount,
      transactions: transactions.map((t) => ({
        id: t.id,
        accountId: t.accountId,
        categoryId: t.categoryId,
        amount: t.amount,
        date: t.date.toISOString(),
        description: t.description,
        isRealized: t.isRealized,
        account: {
          id: t.account.id,
          userId: t.account.userId,
          name: t.account.name,
          type: t.account.type,
          balance: t.account.balance,
        },
        category: {
          id: t.category.id,
          userId: t.category.userId,
          name: t.category.name,
          natureType: t.category.natureType,
        },
      })),
    });
  }

  return {
    initialCash: Number(initialCash.toFixed(2)),
    months,
    totalExpectedFutureSpend: Number(totalExpectedFutureSpend.toFixed(2)),
    totalExpectedFutureIncome: Number(totalExpectedFutureIncome.toFixed(2)),
    projectedNetSavings: Number((totalExpectedFutureIncome - totalExpectedFutureSpend).toFixed(2)),
  };
}

