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
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-950/80 border border-emerald-800/80 text-emerald-300">
            Receita
          </span>
        );
      case 'FIXED_COST':
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-rose-950/80 border border-rose-800/80 text-rose-300">
            Custo Fixo
          </span>
        );
      case 'VARIABLE_COST':
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-950/80 border border-amber-800/80 text-amber-300">
            Custo Variável
          </span>
        );
      case 'INVESTMENT':
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-indigo-950/80 border border-indigo-800/80 text-indigo-300">
            Investimento
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
    <div className="glass-panel rounded-2xl p-6 sm:p-8">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800/80 gap-4">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">
            Livro-Razão & Extrato Financeiro
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Histórico detalhado de movimentações e conciliação bancária
          </p>
        </div>

        {/* Nature Filter Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
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
                  ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions List */}
      <div className="mt-4 divide-y divide-slate-800/50">
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
                className="py-3.5 flex items-center justify-between hover:bg-slate-900/40 px-2 rounded-xl transition group"
              >
                {/* Left side: Icon, Desc, Account, Category */}
                <div className="flex items-center space-x-3.5">
                  <div
                    className={`p-2.5 rounded-xl border ${
                      isIncome
                        ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-400'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    {isIncome ? (
                      <ArrowDownLeft className="h-4 w-4" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold text-slate-100">
                        {tx.description}
                      </span>
                      {getNatureBadge(tx.category?.natureType)}
                    </div>
                    <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-0.5">
                      <span>{tx.category?.name}</span>
                      <span>•</span>
                      <span className="text-slate-500">{tx.account?.name}</span>
                      <span>•</span>
                      <span>{formatDate(tx.date)}</span>
                    </div>
                  </div>
                </div>

                {/* Right side: Amount & Delete button */}
                <div className="flex items-center space-x-4">
                  <div className="text-right font-mono-numbers">
                    <span
                      className={`text-sm font-bold ${
                        isIncome ? 'text-emerald-400' : 'text-slate-200'
                      }`}
                    >
                      {isIncome ? '+' : '-'} {formatBRL(tx.amount)}
                    </span>
                    <div className="flex items-center justify-end space-x-1 text-[10px] text-slate-500 mt-0.5">
                      {tx.isRealized ? (
                        <span className="text-emerald-400/80 flex items-center space-x-0.5">
                          <CheckCircle2 className="h-3 w-3 inline" />
                          <span>Realizado</span>
                        </span>
                      ) : (
                        <span className="text-amber-400/80 flex items-center space-x-0.5">
                          <Clock className="h-3 w-3 inline" />
                          <span>Previsto</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(tx.id)}
                    disabled={deletingId === tx.id}
                    className="opacity-0 group-hover:opacity-100 p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition disabled:opacity-50"
                    title="Excluir lançamento"
                  >
                    <Trash2 className="h-4 w-4" />
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
