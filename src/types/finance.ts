export type NatureType = 'INCOME' | 'FIXED_COST' | 'VARIABLE_COST' | 'INVESTMENT';
export type AccountType = 'CHECKING' | 'SAVINGS' | 'INVESTMENT' | 'CASH';

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Account {
  id: string;
  userId: string;
  name: string;
  type: AccountType;
  balance: number;
  _count?: {
    transactions: number;
  };
}

export interface Category {
  id: string;
  userId: string;
  name: string;
  natureType: NatureType;
  _count?: {
    transactions: number;
  };
}

export interface Transaction {
  id: string;
  accountId: string;
  categoryId: string;
  amount: number;
  date: string;
  description: string;
  isRealized: boolean;
  account?: Account;
  category?: Category;
}

export interface CategoryBreakdown {
  id: string;
  name: string;
  amount: number;
  percentage: number;
}

export interface DreReport {
  period: {
    startDate?: string;
    endDate?: string;
  };
  totalIncome: number;
  totalFixedCosts: number;
  grossOperatingResult: number;
  totalVariableCosts: number;
  operatingCashFlow: number;
  totalInvestments: number;
  netCashFlow: number;
  margins: {
    grossMargin: number;
    operatingSavingsMargin: number;
    investmentRate: number;
  };
  breakdown: {
    incomes: CategoryBreakdown[];
    fixedCosts: CategoryBreakdown[];
    variableCosts: CategoryBreakdown[];
    investments: CategoryBreakdown[];
  };
}

export interface ExecutiveOverview {
  liquidity: {
    totalFreeCash: number;
    totalEmergencyFund: number;
    totalInvested: number;
    totalNetWorth: number;
  };
  metrics: {
    operatingSavingsMargin: number;
    monthlyBurnRate: number;
    runwayMonths: number;
    runwayStatus: 'EXCELLENT' | 'GOOD' | 'WARNING' | 'CRITICAL';
    savingsRate: number;
  };
  dreSummary: {
    totalIncome: number;
    totalOperatingCosts: number;
    operatingCashFlow: number;
    totalInvestments: number;
    netCashFlow: number;
  };
  accounts: Account[];
}

export interface CreateTransactionPayload {
  accountId: string;
  categoryId: string;
  amount: number;
  description: string;
  date?: string;
  isRealized?: boolean;
}

export interface MonthlyProjection {
  monthKey: string; // "2026-08"
  monthLabel: string; // "Ago/26"
  isCurrentMonth: boolean;
  startingCash: number;
  expectedIncome: number;
  expectedFixedCosts: number;
  expectedVariableCosts: number;
  expectedInvestments: number;
  totalOutflow: number;
  netMonthlyResult: number;
  endingCash: number;
  runwayMonths: number;
  status: 'EXCELLENT' | 'GOOD' | 'WARNING' | 'CRITICAL';
  pendingTransactionsCount: number;
  transactions: Transaction[];
}

export interface CashFlowProjectionReport {
  initialCash: number;
  months: MonthlyProjection[];
  totalExpectedFutureSpend: number;
  totalExpectedFutureIncome: number;
  projectedNetSavings: number;
}

