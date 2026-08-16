'use client';

import React, { useState } from 'react';
import { Transaction, NatureType } from '../types/finance';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Trash2,
  CheckCircle2,
  Clock,
  CreditCard,
  Check,
  Filter,
} from 'lucide-react';
import { api } from '../services/api';

interface TransactionsListProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => Promise<void>;
  onRefresh: () => void;
}

export function TransactionsList({
  transactions,
  onDeleteTransaction,
  onRefresh,
}: TransactionsListProps) {
  const [filterNature, setFilterNature] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'REALIZED' | 'PENDING'>('ALL');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [settlingId, setSettlingId] = useState<string | null>(null);

  const formatBRL = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val);
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: '2-digit',
    });
  };

  const filteredTransactions = transactions.filter((tx) => {
    if (filterNature !== 'ALL' && tx.category?.natureType !== filterNature) {
      return false;
    }
    if (filterStatus === 'REALIZED' && !tx.isRealized) {
      return false;
    }
    if (filterStatus === 'PENDING' && tx.isRealized) {
      return false;
    }
    return true;
  });

  const getNatureBadge = (nature?: NatureType) => {
    switch (nature) {
      case 'INCOME':
        return (
          <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
            Receita
          </span>
        );
      case 'FIXED_COST':
        return (
          <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 shrink-0">
            Custo Fixo
          </span>
        );
      case 'VARIABLE_COST':
        return (
          <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
            Custo Var.
          </span>
        );
      case 'INVESTMENT':
        return (
          <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
            Aporte
          </span>
        );
      default:
        return null;
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente remover este lançamento?')) return;
    try {
      setDeletingId(id);
      await onDeleteTransaction(id);
      onRefresh();
    } catch (err) {
      alert('Erro ao excluir lançamento.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSettle = async (id: string) => {
    try {
      setSettlingId(id);
      await api.updateTransaction(id, { isRealized: true });
      onRefresh();
    } catch (err) {
      alert('Erro ao liquidar lançamento.');
    } finally {
      setSettlingId(null);
    }
  };

  const pendingCount = transactions.filter((t) => !t.isRealized).length;

  return (
    <div className="bg-[#111726] border border-slate-800 rounded-2xl p-4 sm:p-6 lg:p-7 shadow-card space-y-4">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span>Livro-Razão & Extrato Financeiro</span>
            {pendingCount > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">
                {pendingCount} previstos
              </span>
            )}
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
            Histórico completo de transações realizadas e agendamentos futuros
          </p>
        </div>

        {/* Status Filter (Todos vs Realizados vs Previstos) */}
        <div className="flex items-center space-x-1 p-1 rounded-xl bg-slate-900 border border-slate-750 self-start sm:self-auto text-xs font-semibold">
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-3 py-1 rounded-lg transition ${
              filterStatus === 'ALL'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilterStatus('REALIZED')}
            className={`px-3 py-1 rounded-lg transition flex items-center gap-1 ${
              filterStatus === 'REALIZED'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-emerald-400'
            }`}
          >
            <CheckCircle2 className="h-3 w-3" />
            <span>Realizados</span>
          </button>
          <button
            onClick={() => setFilterStatus('PENDING')}
            className={`px-3 py-1 rounded-lg transition flex items-center gap-1 ${
              filterStatus === 'PENDING'
                ? 'bg-amber-600 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-amber-400'
            }`}
          >
            <Clock className="h-3 w-3" />
            <span>Previstos / Futuros</span>
          </button>
        </div>
      </div>

      {/* Nature Filter Tabs */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'ALL', label: 'Todas Categorias' },
          { id: 'INCOME', label: 'Receitas' },
          { id: 'FIXED_COST', label: 'Custos Fixos' },
          { id: 'VARIABLE_COST', label: 'Custos Var. & Cartão' },
          { id: 'INVESTMENT', label: 'Aportes' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterNature(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              filterNature === tab.id
                ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Transactions List */}
      <div className="divide-y divide-slate-800/60">
        {filteredTransactions.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            Nenhuma transação encontrada para este filtro.
          </div>
        ) : (
          filteredTransactions.map((tx) => {
            const isIncome = tx.category?.natureType === 'INCOME';
            const isInstallment = tx.description.includes('/') && !isIncome;

            return (
              <div
                key={tx.id}
                className="py-3 sm:py-3.5 flex items-center justify-between hover:bg-slate-900/40 px-2 rounded-xl transition group gap-2 sm:gap-4"
              >
                {/* Left side: Icon, Desc, Account, Category */}
                <div className="flex items-center space-x-3 sm:space-x-3.5 min-w-0 flex-1">
                  <div
                    className={`p-2 sm:p-2.5 rounded-xl border shrink-0 ${
                      isIncome
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        : isInstallment
                        ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                        : 'bg-slate-800 border-slate-700/60 text-slate-400'
                    }`}
                  >
                    {isIncome ? (
                      <ArrowDownLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    ) : isInstallment ? (
                      <CreditCard className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    ) : (
                      <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs sm:text-sm font-semibold text-slate-100 truncate">
                        {tx.description}
                      </span>
                      <span className="shrink-0">{getNatureBadge(tx.category?.natureType)}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[10px] sm:text-[11px] text-slate-400 mt-0.5">
                      <span className="truncate max-w-[110px] sm:max-w-none">{tx.category?.name}</span>
                      <span>•</span>
                      <span className="text-slate-500 truncate max-w-[90px] sm:max-w-none">{tx.account?.name}</span>
                      <span>•</span>
                      <span className="shrink-0">{formatDate(tx.date)}</span>
                    </div>
                  </div>
                </div>

                {/* Right side: Amount, Status & Actions */}
                <div className="flex items-center space-x-2.5 sm:space-x-3 shrink-0 pl-1">
                  <div className="text-right font-mono-numbers">
                    <span
                      className={`text-xs sm:text-sm font-semibold block ${
                        isIncome ? 'text-emerald-400' : 'text-slate-200'
                      }`}
                    >
                      {isIncome ? '+' : '-'} {formatBRL(tx.amount)}
                    </span>
                    <div className="flex items-center justify-end space-x-1 text-[9px] sm:text-[10px] text-slate-500 mt-0.5">
                      {tx.isRealized ? (
                        <span className="text-emerald-400/90 flex items-center space-x-0.5">
                          <CheckCircle2 className="h-3 w-3 inline shrink-0" />
                          <span>Realizado</span>
                        </span>
                      ) : (
                        <span className="text-amber-400/90 flex items-center space-x-0.5">
                          <Clock className="h-3 w-3 inline shrink-0" />
                          <span>Previsto</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 1-Click Settlement Button if Pending */}
                  {!tx.isRealized && (
                    <button
                      onClick={() => handleSettle(tx.id)}
                      disabled={settlingId === tx.id}
                      className="px-2 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold transition flex items-center gap-1 active:scale-95 disabled:opacity-50"
                      title="Marcar lançamento como realizado / liquidado"
                    >
                      <Check className="h-3 w-3" />
                      <span className="hidden sm:inline">Efetivar</span>
                    </button>
                  )}

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(tx.id)}
                    disabled={deletingId === tx.id}
                    className="opacity-70 sm:opacity-0 sm:group-hover:opacity-100 p-1.5 sm:p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition disabled:opacity-50 active:scale-90 shrink-0"
                    title="Excluir lançamento"
                  >
                    <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
