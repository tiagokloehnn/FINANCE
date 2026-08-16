'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '../components/Header';
import { MetricCard } from '../components/MetricCard';
import { DreTable } from '../components/DreTable';
import { CashFlowProjection } from '../components/CashFlowProjection';
import { QuickTransactionForm } from '../components/QuickTransactionForm';
import { TransactionsList } from '../components/TransactionsList';
import { ManageEntitiesModal } from '../components/ManageEntitiesModal';
import {
  DreReport,
  ExecutiveOverview,
  Transaction,
  Account,
  Category,
  CreateTransactionPayload,
} from '../types/finance';
import { api } from '../services/api';
import {
  ShieldCheck,
  Calendar,
  Sparkles,
  Database,
  CheckCircle,
  LayoutDashboard,
  FolderTree,
  PlusCircle,
  TrendingUp,
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; email: string } | null>(null);
  const [overview, setOverview] = useState<ExecutiveOverview | null>(null);
  const [dre, setDre] = useState<DreReport | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isQuickEntryOpen, setIsQuickEntryOpen] = useState<boolean>(false);
  const [isManageEntitiesOpen, setIsManageEntitiesOpen] = useState<boolean>(false);
  const [isSeeding, setIsSeeding] = useState<boolean>(false);
  const [seedSuccessMessage, setSeedSuccessMessage] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'ALL' | 'DRE' | 'PROJECTION'>('ALL');

  const handleLogout = async () => {
    try {
      await api.logout();
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Erro ao fazer logout:', err);
    }
  };

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [overviewData, dreData, txsData, accountsData, catsData, meData] =
        await Promise.all([
          api.getOverview(),
          api.getDre(),
          api.getTransactions(),
          api.getAccounts(),
          api.getCategories(),
          api.getMe().catch(() => null),
        ]);

      setOverview(overviewData);
      setDre(dreData);
      setTransactions(txsData);
      setAccounts(accountsData);
      setCategories(catsData);
      if (meData?.user) {
        setCurrentUser(meData.user);
      }
    } catch (error) {
      console.error('Erro ao carregar dados financeiros:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleTriggerSeed = async () => {
    try {
      setIsSeeding(true);
      setSeedSuccessMessage(null);
      await api.triggerSeed(false);
      await loadData();
      setSeedSuccessMessage('Plano de contas e categorias padrão do Supabase criado e carregado com sucesso!');
      setTimeout(() => setSeedSuccessMessage(null), 5000);
    } catch (err: any) {
      console.error('Erro ao rodar seed manual:', err);
    } finally {
      setIsSeeding(false);
    }
  };

  const handleAddTransaction = async (payload: CreateTransactionPayload) => {
    await api.createTransaction(payload);
    await loadData();
  };

  const handleDeleteTransaction = async (id: string) => {
    await api.deleteTransaction(id);
    await loadData();
  };

  const formatBRL = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val);
  };

  const totalLiquid = overview?.liquidity.totalFreeCash
    ? overview.liquidity.totalFreeCash + (overview.liquidity.totalEmergencyFund || 0)
    : 0;

  const totalFreeCash = overview?.liquidity.totalFreeCash || 0;
  const totalEmergencyFund = overview?.liquidity.totalEmergencyFund || 0;
  const currentNetWorth = overview?.liquidity.totalNetWorth || 0;

  const operatingSavingsMargin =
    overview?.metrics.operatingSavingsMargin !== undefined
      ? overview.metrics.operatingSavingsMargin
      : dre?.margins.operatingSavingsMargin || 0;

  const runwayMonths = overview?.metrics.runwayMonths || 0;
  const monthlyBurnRate = overview?.metrics.monthlyBurnRate || 0;

  const getRunwayBadgeInfo = () => {
    if (runwayMonths >= 12) {
      return { text: 'Confortável (>12m)', variant: 'emerald' as const };
    }
    if (runwayMonths >= 6) {
      return { text: 'Estável (>6m)', variant: 'cyan' as const };
    }
    if (runwayMonths >= 3) {
      return { text: 'Alerta Moderado (3-6m)', variant: 'amber' as const };
    }
    if (runwayMonths > 0) {
      return { text: 'Crítico (<3m)', variant: 'rose' as const };
    }
    return { text: 'Início / Sem Gastos', variant: 'cyan' as const };
  };

  const runwayBadge = getRunwayBadgeInfo();

  const isMockData =
    categories.some((c) => c.id.startsWith('c')) ||
    accounts.some((a) => a.id.startsWith('acc-'));

  const isUninitialized = categories.length === 0 || isMockData;

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19] text-slate-100">
      {/* Executive Header */}
      <Header
        netWorth={currentNetWorth}
        userName={currentUser?.name}
        onOpenQuickEntry={() => setIsQuickEntryOpen(true)}
        onOpenManageEntities={() => setIsManageEntitiesOpen(true)}
        onRefresh={loadData}
        onLogout={handleLogout}
        isLoading={isLoading}
        isUninitialized={isUninitialized}
        onTriggerSeed={handleTriggerSeed}
        isSeeding={isSeeding}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-4 sm:space-y-6">
        {/* Banner de Inicialização Rápida no Supabase (se necessário) */}
        {isUninitialized && (
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 sm:p-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shadow-sm animate-fadeIn">
            <div className="flex items-start sm:items-center space-x-3 sm:space-x-4">
              <div className="p-2.5 rounded-xl bg-amber-400/10 text-amber-400 shrink-0">
                <Database className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-white flex items-center gap-2">
                  <span>Plano de Contas do Supabase</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
                    Ação Necessária
                  </span>
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                  Clique para criar suas contas bancárias e categorias padrão personalizadas.
                </p>
              </div>
            </div>

            <button
              onClick={handleTriggerSeed}
              disabled={isSeeding}
              className="px-4 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-amber-400 hover:bg-amber-300 transition shadow flex items-center justify-center space-x-2 disabled:opacity-50 shrink-0"
            >
              <Sparkles className="h-4 w-4" />
              <span>{isSeeding ? 'Inicializando no Supabase...' : '⚡ Inicializar Categorias Padrão'}</span>
            </button>
          </div>
        )}

        {seedSuccessMessage && (
          <div className="p-3.5 sm:p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center space-x-3 text-emerald-300 text-xs animate-fadeIn">
            <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{seedSuccessMessage}</span>
          </div>
        )}

        {/* 3 HERO METRICS CARDS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* KPI 1: Liquidez Corrente (Caixa Livre) */}
          <MetricCard
            type="liquidity"
            title="Liquidez Corrente"
            subtitle="Caixa Livre + Liquidez Diária"
            mainValue={formatBRL(totalLiquid)}
            secondaryInfo={`Soma disponível de pronto acesso para contingências`}
            badgeText="Disponibilidade Imediata"
            badgeVariant="emerald"
            breakdownItems={[
              {
                label: 'Conta Corrente (Caixa Livre)',
                value: formatBRL(totalFreeCash),
              },
              {
                label: 'Reserva de Emergência (CDB/DI)',
                value: formatBRL(totalEmergencyFund),
              },
            ]}
          />

          {/* KPI 2: Margem de Poupança Operacional */}
          <MetricCard
            type="savings_margin"
            title="Margem de Poupança Op."
            subtitle="Receitas vs Custos Totais"
            mainValue={`${operatingSavingsMargin}%`}
            secondaryInfo="Geração de Caixa Operacional sobre a Receita Bruta"
            badgeText={operatingSavingsMargin >= 30 ? 'Alta Eficiência' : 'Atenção'}
            badgeVariant={operatingSavingsMargin >= 30 ? 'emerald' : 'amber'}
            progressPercentage={operatingSavingsMargin}
            breakdownItems={[
              {
                label: 'Geração de Caixa Operacional',
                value: formatBRL(dre?.operatingCashFlow ?? 0),
              },
              {
                label: 'Taxa de Investimento Efetivo',
                value: `${dre?.margins.investmentRate ?? 0}%`,
              },
            ]}
          />

          {/* KPI 3: Runway (Meses de Sobrevivência) */}
          <MetricCard
            type="runway"
            title="Runway Pessoal"
            subtitle="Autonomia sem Novas Receitas"
            mainValue={`${runwayMonths} meses`}
            secondaryInfo={`Burn Rate Mensal: ${formatBRL(monthlyBurnRate)}/mês`}
            badgeText={runwayBadge.text}
            badgeVariant={runwayBadge.variant}
            breakdownItems={[
              {
                label: 'Custos Fixos de Sobrevivência',
                value: formatBRL(dre?.totalFixedCosts ?? 0),
              },
              {
                label: 'Custos Variáveis Médios',
                value: formatBRL(dre?.totalVariableCosts ?? 0),
              },
            ]}
          />
        </section>

        {/* PROJEÇÃO DE FLUXO DE CAIXA FUTURO & CARTÕES */}
        <section>
          <CashFlowProjection onRefreshAll={loadData} />
        </section>

        {/* DRE PESSOAL EM CASCATA */}
        {dre && (
          <section>
            <DreTable dre={dre} />
          </section>
        )}

        {/* LIVRO RAZÃO / EXTRATO DE TRANSAÇÕES */}
        <section>
          <TransactionsList
            transactions={transactions}
            onDeleteTransaction={handleDeleteTransaction}
            onRefresh={loadData}
          />
        </section>
      </main>

      {/* MODAL DE LANÇAMENTO RÁPIDO */}
      <QuickTransactionForm
        isOpen={isQuickEntryOpen}
        onClose={() => setIsQuickEntryOpen(false)}
        accounts={accounts}
        categories={categories}
        onSubmitSuccess={loadData}
        onAddTransaction={handleAddTransaction}
        onOpenManageEntities={() => setIsManageEntitiesOpen(true)}
      />

      {/* MODAL DE GERENCIAMENTO DE CONTAS E CATEGORIAS */}
      <ManageEntitiesModal
        isOpen={isManageEntitiesOpen}
        onClose={() => setIsManageEntitiesOpen(false)}
        categories={categories}
        accounts={accounts}
        onRefresh={loadData}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/60 py-5 sm:py-6 px-4 text-center text-xs text-slate-500 mb-16 sm:mb-0">
        <p>
          Finance CFO • Sistema de Gestão Financeira Pessoal com Governança Corporativa • Hospedado 100% no Vercel & Supabase
        </p>
      </footer>

      {/* Mobile Bottom Navigation / Action Bar */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0d121f]/95 border-t border-slate-800/90 backdrop-blur-lg pb-safe pt-2 px-6 flex items-center justify-around shadow-modal">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex flex-col items-center justify-center text-slate-400 hover:text-white transition active:scale-95 py-1"
        >
          <LayoutDashboard className="h-5 w-5 mb-0.5 text-slate-400" />
          <span className="text-[10px] font-medium">Início</span>
        </button>

        <button
          onClick={() => setIsQuickEntryOpen(true)}
          className="flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl font-semibold text-xs text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm active:scale-95 -mt-3 border-2 border-[#0d121f]"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Lançamento</span>
        </button>

        <button
          onClick={() => setIsManageEntitiesOpen(true)}
          className="flex flex-col items-center justify-center text-slate-400 hover:text-white transition active:scale-95 py-1"
        >
          <FolderTree className="h-5 w-5 mb-0.5 text-slate-400" />
          <span className="text-[10px] font-medium">Categorias</span>
        </button>
      </nav>
    </div>
  );
}
