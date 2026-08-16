'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '../components/Header';
import { MetricCard } from '../components/MetricCard';
import { DreTable } from '../components/DreTable';
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
} from 'lucide-react';

export default function DashboardPage() {
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


  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [overviewData, dreData, txsData, accountsData, catsData] =
        await Promise.all([
          api.getOverview(),
          api.getDre(),
          api.getTransactions(),
          api.getAccounts(),
          api.getCategories(),
        ]);

      setOverview(overviewData);
      setDre(dreData);
      setTransactions(txsData);
      setAccounts(accountsData);
      setCategories(catsData);
    } catch (error) {
      console.error('Erro ao carregar dados financeiros:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddTransaction = async (payload: CreateTransactionPayload) => {
    await api.createTransaction(payload);
    await loadData();
  };

  const handleDeleteTransaction = async (id: string) => {
    await api.deleteTransaction(id);
    await loadData();
  };

  const handleTriggerSeed = async () => {
    try {
      setIsSeeding(true);
      await api.triggerSeed(false);
      setSeedSuccessMessage('Plano de contas e categorias contábeis criados com sucesso!');
      await loadData();
      setTimeout(() => setSeedSuccessMessage(null), 5000);
    } catch (err: any) {
      alert('Erro ao inicializar banco de dados: ' + (err?.message || 'Verifique as variáveis de ambiente'));
    } finally {
      setIsSeeding(false);
    }
  };

  const formatBRL = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val);
  };

  const currentNetWorth = overview?.liquidity.totalNetWorth ?? 0;
  const totalFreeCash = overview?.liquidity.totalFreeCash ?? 0;
  const totalEmergencyFund = overview?.liquidity.totalEmergencyFund ?? 0;
  const totalLiquid = totalFreeCash + totalEmergencyFund;

  const operatingSavingsMargin = overview?.metrics.operatingSavingsMargin ?? 0;
  const runwayMonths = overview?.metrics.runwayMonths ?? 0;
  const monthlyBurnRate = overview?.metrics.monthlyBurnRate ?? 0;

  const getRunwayBadgeInfo = () => {
    if (runwayMonths >= 12) {
      return { text: 'Excelente (>= 12m)', variant: 'emerald' as const };
    }
    if (runwayMonths >= 6) {
      return { text: 'Saudável (>= 6m)', variant: 'cyan' as const };
    }
    if (runwayMonths >= 3) {
      return { text: 'Alerta (>= 3m)', variant: 'amber' as const };
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
        onOpenQuickEntry={() => setIsQuickEntryOpen(true)}
        onOpenManageEntities={() => setIsManageEntitiesOpen(true)}
        onRefresh={loadData}
        isLoading={isLoading}
        isUninitialized={isUninitialized}
        onTriggerSeed={handleTriggerSeed}
        isSeeding={isSeeding}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-4 sm:space-y-6">
        {/* Banner de Inicialização Rápida no Supabase (se necessário ou se usando mock) */}
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
                  Clique no botão ao lado para criar o plano de contas e categorias contábeis padrão (DRE, Liquidez, Runway) no Supabase.
                </p>
              </div>
            </div>
            <button
              onClick={handleTriggerSeed}
              disabled={isSeeding}
              className="w-full sm:w-auto px-4 sm:px-5 py-2.5 rounded-xl font-semibold text-xs text-slate-900 bg-amber-400 hover:bg-amber-300 transition shadow whitespace-nowrap disabled:opacity-50 flex items-center justify-center space-x-2 shrink-0"
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

        {/* Banner Executivo de Governança */}
        <div className="rounded-2xl bg-[#111726] border border-slate-800 p-4 sm:p-6 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 relative z-10">
            <div>
              <div className="flex items-center space-x-1.5 sm:space-x-2 text-emerald-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
                <ShieldCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>Painel de Controle Financeiro & Governança</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1 tracking-tight">
                Visão Geral da Saúde Financeira
              </h2>
              <p className="text-[11px] sm:text-xs md:text-sm text-slate-400 mt-1 max-w-2xl">
                Cálculo em tempo real de liquidez disponível, margem de poupança operacional corporativa e autonomia de sobrevivência (Runway).
              </p>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
              <div className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center space-x-2 text-[11px] sm:text-xs text-slate-300">
                <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-400" />
                <span>Competência: Mês Atual</span>
              </div>
            </div>
          </div>
        </div>

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

      <footer className="border-t border-slate-900 bg-slate-950/60 py-5 sm:py-6 px-4 text-center text-xs text-slate-500">
        <p>
          Finance CFO • Sistema de Gestão Financeira Pessoal com Governança Corporativa • Hospedado 100% no Vercel & Supabase
        </p>
      </footer>
    </div>
  );
}
