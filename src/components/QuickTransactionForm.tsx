'use client';

import React, { useState, useEffect } from 'react';
import {
  Account,
  Category,
  NatureType,
  CreateTransactionPayload,
} from '../types/finance';
import {
  X,
  PlusCircle,
  TrendingUp,
  MinusCircle,
  PiggyBank,
  Check,
  Sparkles,
} from 'lucide-react';
import { api } from '../services/api';

interface QuickTransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: Account[];
  categories: Category[];
  onSubmitSuccess: () => void;
  onAddTransaction: (payload: CreateTransactionPayload) => Promise<void>;
  onOpenManageEntities?: () => void;
}

export function QuickTransactionForm({
  isOpen,
  onClose,
  accounts,
  categories,
  onSubmitSuccess,
  onAddTransaction,
  onOpenManageEntities,
}: QuickTransactionFormProps) {

  const [selectedNature, setSelectedNature] = useState<NatureType>('VARIABLE_COST');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [accountId, setAccountId] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [date, setDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [isRealized, setIsRealized] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSeedingLocal, setIsSeedingLocal] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Filtra categorias pela natureza selecionada
  const filteredCategories = categories.filter(
    (c) => c.natureType === selectedNature,
  );

  // Atualiza accountId e categoryId padrão quando a lista de categorias/contas mudar
  useEffect(() => {
    if (accounts.length > 0) {
      if (!accountId || !accounts.some((a) => a.id === accountId)) {
        setAccountId(accounts[0].id);
      }
    }
  }, [accounts, accountId]);

  useEffect(() => {
    if (filteredCategories.length > 0) {
      if (!categoryId || !filteredCategories.some((c) => c.id === categoryId)) {
        setCategoryId(filteredCategories[0].id);
      }
    } else {
      setCategoryId('');
    }
  }, [selectedNature, filteredCategories, categoryId]);

  if (!isOpen) return null;

  const handleQuickSeed = async () => {
    try {
      setIsSeedingLocal(true);
      setErrorMsg(null);
      await api.triggerSeed(false);
      onSubmitSuccess(); // Recarrega contas e categorias do banco
    } catch (err: any) {
      setErrorMsg(err?.message || 'Erro ao inicializar plano de contas no Supabase.');
    } finally {
      setIsSeedingLocal(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const numericAmount = parseFloat(amount.replace(',', '.'));
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setErrorMsg('Informe um valor monetário válido e maior que zero.');
      return;
    }

    if (!description.trim()) {
      setErrorMsg('Informe uma descrição para o lançamento.');
      return;
    }

    if (!accountId) {
      setErrorMsg('Selecione a conta bancária/financeira.');
      return;
    }

    if (!categoryId) {
      setErrorMsg('Selecione uma categoria contábil.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onAddTransaction({
        accountId,
        categoryId,
        amount: numericAmount,
        description: description.trim(),
        date: new Date(date).toISOString(),
        isRealized,
      });

      // Limpa formulário e fecha
      setAmount('');
      setDescription('');
      onSubmitSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao registrar o lançamento.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const natureOptions: Array<{
    type: NatureType;
    label: string;
    icon: React.ReactNode;
    colorClasses: string;
    activeClasses: string;
  }> = [
    {
      type: 'INCOME',
      label: 'Receita',
      icon: <TrendingUp className="h-4 w-4" />,
      colorClasses: 'hover:border-emerald-500/50 hover:bg-emerald-950/20 text-emerald-400',
      activeClasses: 'border-emerald-500 bg-emerald-950/50 text-emerald-300 ring-1 ring-emerald-500',
    },
    {
      type: 'FIXED_COST',
      label: 'Custo Fixo',
      icon: <MinusCircle className="h-4 w-4" />,
      colorClasses: 'hover:border-rose-500/50 hover:bg-rose-950/20 text-rose-400',
      activeClasses: 'border-rose-500 bg-rose-950/50 text-rose-300 ring-1 ring-rose-500',
    },
    {
      type: 'VARIABLE_COST',
      label: 'Custo Variável',
      icon: <MinusCircle className="h-4 w-4" />,
      colorClasses: 'hover:border-amber-500/50 hover:bg-amber-950/20 text-amber-400',
      activeClasses: 'border-amber-500 bg-amber-950/50 text-amber-300 ring-1 ring-amber-500',
    },
    {
      type: 'INVESTMENT',
      label: 'Investimento',
      icon: <PiggyBank className="h-4 w-4" />,
      colorClasses: 'hover:border-indigo-500/50 hover:bg-indigo-950/20 text-indigo-400',
      activeClasses: 'border-indigo-500 bg-indigo-950/50 text-indigo-300 ring-1 ring-indigo-500',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-y-auto max-h-[92vh] p-4 sm:p-7 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0">
              <PlusCircle className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-bold text-white truncate">
                Lançamento Financeiro Rápido
              </h2>
              <p className="text-[10px] sm:text-xs text-slate-400 truncate">
                Classificação automática para apuração de DRE
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition shrink-0"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Alerta de Erro com Botão de Ação Rápida */}
        {errorMsg && (
          <div className="mt-3 sm:mt-4 p-3.5 rounded-xl bg-rose-950/70 border border-rose-500/50 text-xs text-rose-200 space-y-2.5">
            <div className="flex items-start space-x-2">
              <span className="shrink-0 text-base">⚠️</span>
              <p className="leading-relaxed">{errorMsg}</p>
            </div>
            {(errorMsg.includes('Plano de contas') ||
              errorMsg.includes('não inicializado') ||
              errorMsg.includes('não encontrada') ||
              errorMsg.includes('Inicializar')) && (
              <button
                type="button"
                onClick={handleQuickSeed}
                disabled={isSeedingLocal}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-bold text-xs transition shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4 shrink-0" />
                <span>{isSeedingLocal ? 'Inicializando no Supabase...' : '⚡ Inicializar Categorias Padrão Agora'}</span>
              </button>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 sm:mt-5 space-y-3.5 sm:space-y-4">
          {/* Nature Selector Pills */}
          <div>
            <label className="block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Natureza Contábil
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {natureOptions.map((item) => (
                <button
                  type="button"
                  key={item.type}
                  onClick={() => setSelectedNature(item.type)}
                  className={`flex flex-col items-center justify-center py-2 px-1.5 sm:py-2.5 sm:px-2 rounded-xl border text-[11px] sm:text-xs font-medium transition ${
                    selectedNature === item.type
                      ? item.activeClasses
                      : `border-slate-800 bg-slate-950/40 text-slate-400 ${item.colorClasses}`
                  }`}
                >
                  <span className="mb-1">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Amount & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Valor (R$)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 font-mono-numbers text-sm">
                  R$
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  placeholder="0,00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono-numbers font-bold placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm sm:text-base"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Data do Evento
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Descrição
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Aluguel mensal, Supermercado, Aporte FIIs..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          {/* Category & Account */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-400">
                  Categoria Contábil
                </label>
                {onOpenManageEntities && (
                  <button
                    type="button"
                    onClick={onOpenManageEntities}
                    className="text-[10px] text-cyan-400 hover:text-cyan-300 transition flex items-center space-x-1"
                  >
                    <span>+ Nova</span>
                  </button>
                )}
              </div>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              >
                {filteredCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-400">
                  Conta Financeira
                </label>
                {onOpenManageEntities && (
                  <button
                    type="button"
                    onClick={onOpenManageEntities}
                    className="text-[10px] text-cyan-400 hover:text-cyan-300 transition flex items-center space-x-1"
                  >
                    <span>+ Nova</span>
                  </button>
                )}
              </div>
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              >
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.type})
                  </option>
                ))}
              </select>
            </div>
          </div>


          {/* Realized Toggle */}
          <div className="flex items-start space-x-2.5 sm:space-x-3 pt-1 sm:pt-2">
            <input
              type="checkbox"
              id="isRealized"
              checked={isRealized}
              onChange={(e) => setIsRealized(e.target.checked)}
              className="h-4 w-4 mt-0.5 rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-900 shrink-0"
            />
            <label htmlFor="isRealized" className="text-[11px] sm:text-xs text-slate-300 cursor-pointer">
              Lançamento já liquidado / realizado (impacta saldo de caixa imediatamente)
            </label>
          </div>

          {/* Submit Action */}
          <div className="pt-3 sm:pt-4 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition text-center"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 transition shadow-lg shadow-cyan-500/20 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <span>Gravando...</span>
              ) : (
                <>
                  <Check className="h-4 w-4 shrink-0" />
                  <span>Confirmar Lançamento</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
