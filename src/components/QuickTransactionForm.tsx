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
  Plus,
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

  // Criar categoria rápida inline
  const [isCreatingQuickCat, setIsCreatingQuickCat] = useState<boolean>(false);
  const [quickCatName, setQuickCatName] = useState<string>('');
  const [isSubmittingQuickCat, setIsSubmittingQuickCat] = useState<boolean>(false);

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

  const handleQuickCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickCatName.trim()) return;

    try {
      setIsSubmittingQuickCat(true);
      setErrorMsg(null);
      const newCat = await api.createCategory({
        name: quickCatName.trim(),
        natureType: selectedNature,
      });
      setQuickCatName('');
      setIsCreatingQuickCat(false);
      onSubmitSuccess();
      setCategoryId(newCat.id);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Erro ao criar categoria rápida.');
    } finally {
      setIsSubmittingQuickCat(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Converte vírgula para ponto no valor monetário
    const cleanAmount = amount.replace(/\./g, '').replace(',', '.');
    const parsedAmount = parseFloat(cleanAmount);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMsg('Informe um valor monetário válido maior que zero.');
      return;
    }

    if (!accountId) {
      setErrorMsg('Selecione uma conta bancária.');
      return;
    }

    if (!categoryId) {
      setErrorMsg('Selecione uma categoria contábil.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onAddTransaction({
        amount: parsedAmount,
        description,
        date: new Date(date).toISOString(),
        isRealized,
        accountId,
        categoryId,
      });

      // Reset form
      setAmount('');
      setDescription('');
      onClose();
      onSubmitSuccess();
    } catch (err: any) {
      console.error('Erro ao registrar transação:', err);
      setErrorMsg(
        err?.message ||
          'Erro ao salvar transação. Verifique se as categorias contábeis estão criadas.',
      );
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
      colorClasses: 'hover:border-emerald-500/40 hover:bg-emerald-500/5 text-emerald-400',
      activeClasses: 'border-emerald-500/60 bg-emerald-500/10 text-emerald-300 font-semibold',
    },
    {
      type: 'FIXED_COST',
      label: 'Custo Fixo',
      icon: <MinusCircle className="h-4 w-4" />,
      colorClasses: 'hover:border-rose-500/40 hover:bg-rose-500/5 text-rose-400',
      activeClasses: 'border-rose-500/60 bg-rose-500/10 text-rose-300 font-semibold',
    },
    {
      type: 'VARIABLE_COST',
      label: 'Custo Variável',
      icon: <MinusCircle className="h-4 w-4" />,
      colorClasses: 'hover:border-amber-500/40 hover:bg-amber-500/5 text-amber-400',
      activeClasses: 'border-amber-500/60 bg-amber-500/10 text-amber-300 font-semibold',
    },
    {
      type: 'INVESTMENT',
      label: 'Investimento',
      icon: <PiggyBank className="h-4 w-4" />,
      colorClasses: 'hover:border-indigo-500/40 hover:bg-indigo-500/5 text-indigo-400',
      activeClasses: 'border-indigo-500/60 bg-indigo-500/10 text-indigo-300 font-semibold',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#111726] border border-slate-800 rounded-2xl shadow-modal overflow-y-auto max-h-[92vh] p-4 sm:p-6 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="p-2 rounded-xl bg-slate-800 text-emerald-400 shrink-0">
              <PlusCircle className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-bold text-white truncate">
                Lançamento Financeiro
              </h2>
              <p className="text-[10px] sm:text-xs text-slate-400 truncate">
                Classificação contábil para apuração automática de DRE
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
          <div className="mt-3 sm:mt-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 space-y-2.5">
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
                className="w-full py-2.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition shadow flex items-center justify-center space-x-2 disabled:opacity-50"
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
                      : `border-slate-800 bg-slate-900/60 text-slate-400 ${item.colorClasses}`
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
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-xs">
                  R$
                </span>
                <input
                  type="text"
                  required
                  placeholder="0,00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-750 text-white font-mono-numbers font-semibold placeholder-slate-600 focus:outline-none focus:border-emerald-500 text-sm sm:text-base"
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
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-750 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
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
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-750 text-white text-xs sm:text-sm placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Category & Account */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-400">
                  Categoria Contábil
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsCreatingQuickCat(!isCreatingQuickCat)}
                    className="text-[10px] text-emerald-400 hover:text-emerald-300 font-semibold transition flex items-center space-x-1"
                  >
                    <span>{isCreatingQuickCat ? 'Cancelar' : '+ Nova Rápida'}</span>
                  </button>
                  {onOpenManageEntities && (
                    <button
                      type="button"
                      onClick={onOpenManageEntities}
                      className="text-[10px] text-slate-400 hover:text-slate-200 transition"
                      title="Gerenciar todas as categorias"
                    >
                      Gerenciar
                    </button>
                  )}
                </div>
              </div>

              {isCreatingQuickCat ? (
                <div className="flex items-center space-x-1.5 animate-fadeIn">
                  <input
                    type="text"
                    autoFocus
                    placeholder="Nome da categoria..."
                    value={quickCatName}
                    onChange={(e) => setQuickCatName(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-900 border border-emerald-500 text-white text-xs placeholder-slate-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleQuickCreateCategory}
                    disabled={isSubmittingQuickCat || !quickCatName.trim()}
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition shadow disabled:opacity-50 shrink-0"
                  >
                    {isSubmittingQuickCat ? '...' : 'Criar'}
                  </button>
                </div>
              ) : (
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-750 text-white text-xs focus:outline-none focus:border-emerald-500"
                >
                  {filteredCategories.length === 0 ? (
                    <option value="">Nenhuma categoria encontrada - Clique em + Nova</option>
                  ) : (
                    filteredCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))
                  )}
                </select>
              )}
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
                    className="text-[10px] text-emerald-400 hover:text-emerald-300 transition flex items-center space-x-1"
                  >
                    <span>+ Nova</span>
                  </button>
                )}
              </div>
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-750 text-white text-xs focus:outline-none focus:border-emerald-500"
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
          <div className="flex items-start space-x-2.5 sm:space-x-3 pt-1">
            <input
              type="checkbox"
              id="isRealized"
              checked={isRealized}
              onChange={(e) => setIsRealized(e.target.checked)}
              className="h-4 w-4 mt-0.5 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500 shrink-0"
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
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition text-center"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-emerald-600 hover:bg-emerald-500 transition shadow-sm disabled:opacity-50 flex items-center justify-center space-x-2"
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
