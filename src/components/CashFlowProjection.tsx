'use client';

import React, { useState, useEffect } from 'react';
import {
  CashFlowProjectionReport,
  MonthlyProjection,
  Transaction,
} from '../types/finance';
import { api } from '../services/api';
import {
  TrendingUp,
  Calendar,
  CreditCard,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Layers,
  ArrowRight,
  Sparkles,
  Clock,
  Check,
} from 'lucide-react';

interface CashFlowProjectionProps {
  onRefreshAll: () => void;
}

export function CashFlowProjection({ onRefreshAll }: CashFlowProjectionProps) {
  const [monthsCount, setMonthsCount] = useState<number>(6);
  const [projection, setProjection] = useState<CashFlowProjectionReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedMonthKey, setSelectedMonthKey] = useState<string | null>(null);
  const [settlingId, setSettlingId] = useState<string | null>(null);

  const loadProjection = async () => {
    try {
      setIsLoading(true);
      const data = await api.getCashFlowProjection(monthsCount);
      setProjection(data);
      if (data.months.length > 0 && !selectedMonthKey) {
        setSelectedMonthKey(data.months[0].monthKey);
      }
    } catch (err) {
      console.error('Erro ao carregar projeção de fluxo de caixa:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjection();
  }, [monthsCount]);

  const formatBRL = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val);
  };

  const handleSettleTransaction = async (txId: string) => {
    try {
      setSettlingId(txId);
      await api.updateTransaction(txId, { isRealized: true });
      await loadProjection();
      onRefreshAll();
    } catch (err) {
      console.error('Erro ao efetivar transação:', err);
    } finally {
      setSettlingId(null);
    }
  };

  const selectedMonth = projection?.months.find((m) => m.monthKey === selectedMonthKey) || projection?.months[0];

  return (
    <div className="bg-[#111726] border border-slate-800 rounded-2xl p-4 sm:p-6 lg:p-7 shadow-card space-y-6 animate-fadeIn">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-emerald-400 shrink-0">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span>Projeção de Fluxo de Caixa Futuro</span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold uppercase tracking-wider">
                Planejamento & Cartões
              </span>
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
              Simulação de liquidez, parcelas futuras de cartão e capacidade de poupança mês a mês
            </p>
          </div>
        </div>

        {/* Seletor de Horizonte de Projeção */}
        <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-slate-900 border border-slate-750 self-start sm:self-auto">
          {[3, 6, 12].map((count) => (
            <button
              key={count}
              onClick={() => setMonthsCount(count)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                monthsCount === count
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {count} Meses
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards de Resumo Futuro */}
      {projection && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Saldo Líquido Atual
            </span>
            <p className="text-base sm:text-lg font-bold text-emerald-400 font-mono-numbers mt-1">
              {formatBRL(projection.initialCash)}
            </p>
            <span className="text-[10px] text-slate-500">Caixa Livre + Reserva</span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Gastos Previstos (+{monthsCount - 1}m)
            </span>
            <p className="text-base sm:text-lg font-bold text-rose-400 font-mono-numbers mt-1">
              {formatBRL(projection.totalExpectedFutureSpend)}
            </p>
            <span className="text-[10px] text-slate-500">Faturas de cartão + Fixos</span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Receitas Previstas (+{monthsCount - 1}m)
            </span>
            <p className="text-base sm:text-lg font-bold text-white font-mono-numbers mt-1">
              {formatBRL(projection.totalExpectedFutureIncome)}
            </p>
            <span className="text-[10px] text-slate-500">Salários e rendimentos</span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Saldo Final Projetado ({monthsCount}m)
            </span>
            <p className={`text-base sm:text-lg font-bold font-mono-numbers mt-1 ${
              (projection.months[projection.months.length - 1]?.endingCash ?? 0) >= 0
                ? 'text-emerald-400'
                : 'text-rose-400'
            }`}>
              {formatBRL(projection.months[projection.months.length - 1]?.endingCash ?? 0)}
            </p>
            <span className="text-[10px] text-slate-500">Posição final acumulada</span>
          </div>
        </div>
      )}

      {/* Grid de Meses da Timeline */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Linha do Tempo Mensal (Selecione um mês para ver os detalhes)
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
          {projection?.months.map((m) => {
            const isSelected = selectedMonthKey === m.monthKey;
            const isNegativeResult = m.netMonthlyResult < 0;

            return (
              <button
                key={m.monthKey}
                type="button"
                onClick={() => setSelectedMonthKey(m.monthKey)}
                className={`p-3 rounded-xl border text-left transition relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-800/90 border-emerald-500/80 shadow-md ring-1 ring-emerald-500/40'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-xs font-bold text-white">
                      {m.monthLabel}
                    </span>
                    {m.isCurrentMonth ? (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400">
                        Atual
                      </span>
                    ) : m.pendingTransactionsCount > 0 ? (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-amber-500/20 text-amber-400 flex items-center gap-0.5">
                        <Clock className="h-2.5 w-2.5" />
                        <span>{m.pendingTransactionsCount}</span>
                      </span>
                    ) : null}
                  </div>

                  <p className="text-[10px] text-slate-400">Saídas Previstas:</p>
                  <p className="text-xs font-semibold text-rose-400 font-mono-numbers">
                    {formatBRL(m.totalOutflow)}
                  </p>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-800/80">
                  <p className="text-[10px] text-slate-400">Saldo Final:</p>
                  <p className={`text-xs font-bold font-mono-numbers ${
                    m.endingCash >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {formatBRL(m.endingCash)}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detalhe do Mês Selecionado */}
      {selectedMonth && (
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
            <div>
              <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>Detalhamento de {selectedMonth.monthLabel}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold border ${
                  selectedMonth.endingCash >= 0
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                }`}>
                  {selectedMonth.endingCash >= 0 ? '✓ Saldo Positivo' : '⚠️ Alerta de Caixa'}
                </span>
              </h4>
              <p className="text-xs text-slate-400">
                Saldo Inicial: <strong className="text-white font-mono-numbers">{formatBRL(selectedMonth.startingCash)}</strong> |{' '}
                Resultado do Mês:{' '}
                <strong className={`font-mono-numbers ${selectedMonth.netMonthlyResult >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {selectedMonth.netMonthlyResult >= 0 ? '+' : ''}{formatBRL(selectedMonth.netMonthlyResult)}
                </strong> |{' '}
                Saldo Projetado Final: <strong className="text-white font-mono-numbers">{formatBRL(selectedMonth.endingCash)}</strong>
              </p>
            </div>
          </div>

          {/* Lista de Contas e Parcelas que Vencem neste Mês */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Lançamentos & Parcelas do Mês ({selectedMonth.transactions.length})
            </h5>

            {selectedMonth.transactions.length === 0 ? (
              <div className="p-6 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
                <p className="text-xs text-slate-400">
                  Nenhum lançamento ou parcela agendada para {selectedMonth.monthLabel}.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {selectedMonth.transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between gap-3 transition"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className={`p-2 rounded-lg shrink-0 ${
                        tx.category?.natureType === 'INCOME'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : tx.description.includes('/')
                          ? 'bg-amber-500/10 text-amber-400'
                          : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        {tx.description.includes('/') ? (
                          <CreditCard className="h-4 w-4" />
                        ) : tx.category?.natureType === 'INCOME' ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <Calendar className="h-4 w-4" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-white truncate">
                          {tx.description}
                        </p>
                        <div className="flex items-center space-x-2 text-[10px] text-slate-400">
                          <span>{new Date(tx.date).toLocaleDateString('pt-BR')}</span>
                          <span>•</span>
                          <span className="truncate">{tx.category?.name || 'Geral'}</span>
                          <span>•</span>
                          <span className="truncate">{tx.account?.name}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 shrink-0">
                      <span className={`text-xs font-bold font-mono-numbers ${
                        tx.category?.natureType === 'INCOME' ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {tx.category?.natureType === 'INCOME' ? '+' : '-'}{formatBRL(tx.amount)}
                      </span>

                      {/* Status / Ação de Efetivar */}
                      {tx.isRealized ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          <span className="hidden sm:inline">Liquidado</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSettleTransaction(tx.id)}
                          disabled={settlingId === tx.id}
                          className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 transition flex items-center gap-1 active:scale-95 disabled:opacity-50"
                          title="Marcar como já pago / liquidado"
                        >
                          <Check className="h-3 w-3" />
                          <span>{settlingId === tx.id ? 'Efetivando...' : '✓ Efetivar'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
