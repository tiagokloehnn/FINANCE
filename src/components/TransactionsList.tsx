'use client';

import React, { useState } from 'react';
import { Transaction, NatureType } from '../types/finance';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Trash2,
  CheckCircle2,
  Clock,
} from 'lucide-react';

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
  const [deletingId, setDeletingId] = useState<string | null>(null);

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
    });
  };

  const filteredTransactions = transactions.filter((tx) => {
    if (filterNature === 'ALL') return true;
    return tx.category?.natureType === filterNature;
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
    if (!confirm('Deseja realmente remover esta transação?')) return;
    try {
      setDeletingId(id);
      await onDeleteTransaction(id);
      onRefresh();
    } catch (err) {
      alert('Erro ao excluir transação.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-6 lg:p-7">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 sm:pb-5 border-b border-slate-800 gap-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Livro-Razão & Extrato Financeiro
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
            Histórico detalhado de movimentações e conciliação bancária
          </p>
        </div>

        {/* Nature Filter Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1.5 sm:pb-0 no-scrollbar">
          {[
            { id: 'ALL', label: 'Todos' },
            { id: 'INCOME', label: 'Receitas' },
            { id: 'FIXED_COST', label: 'Custos Fixos' },
            { id: 'VARIABLE_COST', label: 'Custos Var.' },
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
      </div>

      {/* Transactions List */}
      <div className="mt-3 divide-y divide-slate-800/60">
        {filteredTransactions.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            Nenhuma transação encontrada para este filtro.
          </div>
        ) : (
          filteredTransactions.map((tx) => {
            const isIncome = tx.category?.natureType === 'INCOME';
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
                        : 'bg-slate-800 border-slate-700/60 text-slate-400'
                    }`}
                  >
                    {isIncome ? (
                      <ArrowDownLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
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

                {/* Right side: Amount & Delete button */}
                <div className="flex items-center space-x-3 sm:space-x-4 shrink-0 pl-1">
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
