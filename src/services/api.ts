import {
  DreReport,
  ExecutiveOverview,
  Transaction,
  Account,
  Category,
  CreateTransactionPayload,
  NatureType,
  AccountType,
} from '../types/finance';


const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || '/api';

// Dados de fallback para demonstração instantânea caso a API ainda esteja sendo configurada
const MOCK_OVERVIEW: ExecutiveOverview = {
  liquidity: {
    totalFreeCash: 0.0,
    totalEmergencyFund: 0.0,
    totalInvested: 0.0,
    totalNetWorth: 0.0,
  },
  metrics: {
    operatingSavingsMargin: 0.0,
    monthlyBurnRate: 0.0,
    runwayMonths: 0.0,
    runwayStatus: 'GOOD',
    savingsRate: 0.0,
  },
  dreSummary: {
    totalIncome: 0.0,
    totalOperatingCosts: 0.0,
    operatingCashFlow: 0.0,
    totalInvestments: 0.0,
    netCashFlow: 0.0,
  },
  accounts: [
    {
      id: 'acc-1',
      userId: 'u-1',
      name: 'Conta Corrente Principal',
      type: 'CHECKING',
      balance: 0.0,
    },
    {
      id: 'acc-2',
      userId: 'u-1',
      name: 'Reserva de Emergência',
      type: 'SAVINGS',
      balance: 0.0,
    },
    {
      id: 'acc-3',
      userId: 'u-1',
      name: 'Corretora de Investimentos',
      type: 'INVESTMENT',
      balance: 0.0,
    },
  ],
};

const MOCK_DRE: DreReport = {
  period: {},
  totalIncome: 0.0,
  totalFixedCosts: 0.0,
  grossOperatingResult: 0.0,
  totalVariableCosts: 0.0,
  operatingCashFlow: 0.0,
  totalInvestments: 0.0,
  netCashFlow: 0.0,
  margins: {
    grossMargin: 0.0,
    operatingSavingsMargin: 0.0,
    investmentRate: 0.0,
  },
  breakdown: {
    incomes: [],
    fixedCosts: [],
    variableCosts: [],
    investments: [],
  },
};

const MOCK_CATEGORIES: Category[] = [
  { id: 'c1', userId: 'u1', name: 'Salário / Pro-labore', natureType: 'INCOME' },
  { id: 'c2', userId: 'u1', name: 'Dividendos & Rendimentos', natureType: 'INCOME' },
  { id: 'c3', userId: 'u1', name: 'Serviços / Freelance / Extras', natureType: 'INCOME' },
  { id: 'c4', userId: 'u1', name: 'Moradia (Aluguel / Condomínio / IPTU)', natureType: 'FIXED_COST' },
  { id: 'c5', userId: 'u1', name: 'Contas Básicas (Luz, Água, Gás, Internet)', natureType: 'FIXED_COST' },
  { id: 'c6', userId: 'u1', name: 'Saúde & Seguros', natureType: 'FIXED_COST' },
  { id: 'c7', userId: 'u1', name: 'Supermercado & Alimentação Básica', natureType: 'VARIABLE_COST' },
  { id: 'c8', userId: 'u1', name: 'Restaurantes & Delivery', natureType: 'VARIABLE_COST' },
  { id: 'c9', userId: 'u1', name: 'Transporte & Combustível', natureType: 'VARIABLE_COST' },
  { id: 'c10', userId: 'u1', name: 'Aportes em Renda Variável (Ações / FIIs)', natureType: 'INVESTMENT' },
  { id: 'c11', userId: 'u1', name: 'Aportes em Renda Fixa / Tesouro Direto', natureType: 'INVESTMENT' },
];

export const api = {
  async getOverview(): Promise<ExecutiveOverview> {
    try {
      const res = await fetch(`${API_BASE_URL}/reports/overview`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Falha ao buscar visão geral da API');
      return await res.json();
    } catch (err) {
      console.warn('API indisponível, usando fallback demo de Overview.', err);
      return MOCK_OVERVIEW;
    }
  },

  async getDre(startDate?: string, endDate?: string): Promise<DreReport> {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const url = `${API_BASE_URL}/reports/dre${params.toString() ? `?${params.toString()}` : ''}`;
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error('Falha ao buscar DRE da API');
      return await res.json();
    } catch (err) {
      console.warn('API indisponível, usando fallback demo de DRE.', err);
      return MOCK_DRE;
    }
  },

  async getTransactions(): Promise<Transaction[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/transactions`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Falha ao buscar transações da API');
      return await res.json();
    } catch (err) {
      console.warn('API indisponível para transações.', err);
      return [];
    }
  },

  async getAccounts(): Promise<Account[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/accounts`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Falha ao buscar contas');
      return await res.json();
    } catch (err) {
      return MOCK_OVERVIEW.accounts;
    }
  },

  async getCategories(): Promise<Category[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/categories`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Falha ao buscar categorias');
      return await res.json();
    } catch (err) {
      return MOCK_CATEGORIES;
    }
  },

  async createCategory(payload: { name: string; natureType: NatureType }): Promise<Category> {
    const res = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const errorData = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(errorData.message || 'Erro ao criar categoria contábil');
    }
    return errorData;
  },

  async updateCategory(
    id: string,
    payload: { name?: string; natureType?: NatureType }
  ): Promise<Category> {
    const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || 'Erro ao atualizar categoria');
    }
    return data;
  },

  async deleteCategory(id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Erro ao excluir categoria');
    }
  },

  async createAccount(payload: { name: string; type: AccountType; balance?: number }): Promise<Account> {
    const res = await fetch(`${API_BASE_URL}/accounts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const errorData = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(errorData.message || 'Erro ao criar conta financeira');
    }
    return errorData;
  },

  async updateAccount(
    id: string,
    payload: { name?: string; type?: AccountType; balance?: number }
  ): Promise<Account> {
    const res = await fetch(`${API_BASE_URL}/accounts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || 'Erro ao atualizar conta');
    }
    return data;
  },

  async deleteAccount(id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/accounts/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Erro ao excluir conta');
    }
  },

  async createTransaction(payload: CreateTransactionPayload): Promise<Transaction> {
    const res = await fetch(`${API_BASE_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || 'Erro ao criar transação');
    }

    return data;
  },

  async deleteTransaction(id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/transactions/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Erro ao deletar transação');
    }
  },

  async triggerSeed(reset: boolean = false): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/seed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reset }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || data.error || 'Erro ao inicializar banco de dados no Supabase');
    }
    return data;
  },

  // Autenticação & Sessão
  async login(credentials: { email: string; password: string }): Promise<{ user: { id: string; name: string; email: string } }> {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || data.message || 'Erro ao fazer login.');
    }
    return data;
  },

  async register(payload: { name: string; email: string; password: string }): Promise<{ user: { id: string; name: string; email: string } }> {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || data.message || 'Erro ao criar conta.');
    }
    return data;
  },

  async logout(): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
    });
    if (!res.ok) {
      throw new Error('Erro ao fazer logout.');
    }
  },

  async getMe(): Promise<{ user: { id: string; name: string; email: string } }> {
    const res = await fetch(`${API_BASE_URL}/auth/me`);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || 'Não autenticado.');
    }
    return data;
  },
};

