'use client';

import React, { useState } from 'react';
import {
  Category,
  Account,
  NatureType,
  AccountType,
} from '../types/finance';
import { api } from '../services/api';
import {
  X,
  Plus,
  FolderPlus,
  Wallet,
  CheckCircle,
  Tag,
  PiggyBank,
  Coins,
  Landmark,
  Sparkles,
  Trash2,
  Pencil,
  Check,
} from 'lucide-react';

interface ManageEntitiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  accounts: Account[];
  onRefresh: () => Promise<void>;
}

export function ManageEntitiesModal({
  isOpen,
  onClose,
  categories,
  accounts,
  onRefresh,
}: ManageEntitiesModalProps) {
  const [activeTab, setActiveTab] = useState<'categories' | 'accounts'>('categories');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | NatureType>('VARIABLE_COST');
  const [isSeeding, setIsSeeding] = useState(false);

  // Form Categoria
  const [newCatName, setNewCatName] = useState('');
  const [newCatNature, setNewCatNature] = useState<NatureType>('VARIABLE_COST');
  const [isSubmittingCat, setIsSubmittingCat] = useState(false);
  const [catSuccessMsg, setCatSuccessMsg] = useState<string | null>(null);
  const [catErrorMsg, setCatErrorMsg] = useState<string | null>(null);

  // Edição Categoria
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editCatName, setEditCatName] = useState('');
  const [editCatNature, setEditCatNature] = useState<NatureType>('VARIABLE_COST');
  const [isUpdatingCat, setIsUpdatingCat] = useState(false);
  const [deletingCatId, setDeletingCatId] = useState<string | null>(null);

  // Form Conta
  const [newAccName, setNewAccName] = useState('');
  const [newAccType, setNewAccType] = useState<AccountType>('CHECKING');
  const [newAccBalance, setNewAccBalance] = useState<string>('0');
  const [isSubmittingAcc, setIsSubmittingAcc] = useState(false);
  const [accSuccessMsg, setAccSuccessMsg] = useState<string | null>(null);
  const [accErrorMsg, setAccErrorMsg] = useState<string | null>(null);
  const [deletingAccId, setDeletingAccId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTriggerSeed = async () => {
    try {
      setIsSeeding(true);
      setCatErrorMsg(null);
      setAccErrorMsg(null);
      await api.triggerSeed(false);
      await onRefresh();
      setCatSuccessMsg('Plano padrão de categorias e contas restaurado no Supabase com sucesso!');
      setTimeout(() => setCatSuccessMsg(null), 5000);
    } catch (err: any) {
      setCatErrorMsg(err?.message || 'Erro ao inicializar plano de contas.');
    } finally {
      setIsSeeding(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) {
      setCatErrorMsg('Informe o nome da categoria.');
      return;
    }

    try {
      setIsSubmittingCat(true);
      setCatErrorMsg(null);
      await api.createCategory({
        name: newCatName.trim(),
        natureType: newCatNature,
      });
      setNewCatName('');
      setCatSuccessMsg(`Categoria "${newCatName.trim()}" criada com sucesso!`);
      await onRefresh();
      setTimeout(() => setCatSuccessMsg(null), 4000);
    } catch (err: any) {
      setCatErrorMsg(err?.message || 'Erro ao criar categoria.');
    } finally {
      setIsSubmittingCat(false);
    }
  };

  const handleStartEditCat = (cat: Category) => {
    setEditingCatId(cat.id);
    setEditCatName(cat.name);
    setEditCatNature(cat.natureType);
  };

  const handleSaveEditCat = async (id: string) => {
    if (!editCatName.trim()) return;
    try {
      setIsUpdatingCat(true);
      setCatErrorMsg(null);
      await api.updateCategory(id, {
        name: editCatName.trim(),
        natureType: editCatNature,
      });
      setEditingCatId(null);
      setCatSuccessMsg('Categoria atualizada com sucesso!');
      await onRefresh();
      setTimeout(() => setCatSuccessMsg(null), 4000);
    } catch (err: any) {
      setCatErrorMsg(err?.message || 'Erro ao atualizar categoria.');
    } finally {
      setIsUpdatingCat(false);
    }
  };

  const handleDeleteCategory = async (cat: Category) => {
    const txCount = cat._count?.transactions ?? 0;
    const confirmText =
      txCount > 0
        ? `A categoria "${cat.name}" possui ${txCount} lançamento(s) vinculado(s). Ao excluí-la, esses lançamentos também serão removidos. Deseja continuar?`
        : `Deseja realmente excluir a categoria "${cat.name}"?`;

    if (!window.confirm(confirmText)) return;

    try {
      setDeletingCatId(cat.id);
      setCatErrorMsg(null);
      await api.deleteCategory(cat.id);
      setCatSuccessMsg(`Categoria "${cat.name}" excluída com sucesso!`);
      await onRefresh();
      setTimeout(() => setCatSuccessMsg(null), 4000);
    } catch (err: any) {
      setCatErrorMsg(err?.message || 'Erro ao excluir categoria.');
    } finally {
      setDeletingCatId(null);
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccName.trim()) {
      setAccErrorMsg('Informe o nome da conta financeira.');
      return;
    }

    try {
      setIsSubmittingAcc(true);
      setAccErrorMsg(null);
      const balanceNum = parseFloat(newAccBalance.replace(',', '.')) || 0;
      await api.createAccount({
        name: newAccName.trim(),
        type: newAccType,
        balance: balanceNum,
      });
      setNewAccName('');
      setNewAccBalance('0');
      setAccSuccessMsg('Conta financeira criada com sucesso!');
      await onRefresh();
      setTimeout(() => setAccSuccessMsg(null), 4000);
    } catch (err: any) {
      setAccErrorMsg(err?.message || 'Erro ao criar conta.');
    } finally {
      setIsSubmittingAcc(false);
    }
  };

  const handleDeleteAccount = async (acc: Account) => {
    const txCount = acc._count?.transactions ?? 0;
    const confirmText =
      txCount > 0
        ? `A conta "${acc.name}" possui ${txCount} lançamento(s) vinculado(s). Deseja realmente excluí-la?`
        : `Deseja realmente excluir a conta "${acc.name}"?`;

    if (!window.confirm(confirmText)) return;

    try {
      setDeletingAccId(acc.id);
      setAccErrorMsg(null);
      await api.deleteAccount(acc.id);
      setAccSuccessMsg(`Conta "${acc.name}" excluída com sucesso!`);
      await onRefresh();
      setTimeout(() => setAccSuccessMsg(null), 4000);
    } catch (err: any) {
      setAccErrorMsg(err?.message || 'Erro ao excluir conta.');
    } finally {
      setDeletingAccId(null);
    }
  };

  const natureLabels: Record<NatureType, { label: string; bg: string; text: string; border: string }> = {
    INCOME: { label: 'Receita', bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
    FIXED_COST: { label: 'Custo Fixo', bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20' },
    VARIABLE_COST: { label: 'Custo Variável', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
    INVESTMENT: { label: 'Investimento', bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20' },
  };

  const accountTypeLabels: Record<AccountType, { label: string; icon: React.ReactNode }> = {
    CHECKING: { label: 'Conta Corrente / Caixa', icon: <Landmark className="h-4 w-4 text-slate-400" /> },
    SAVINGS: { label: 'Reserva de Emergência / CDB DI', icon: <PiggyBank className="h-4 w-4 text-emerald-400" /> },
    INVESTMENT: { label: 'Corretora de Investimentos', icon: <Coins className="h-4 w-4 text-indigo-400" /> },
    CASH: { label: 'Dinheiro Físico', icon: <Wallet className="h-4 w-4 text-amber-400" /> },
  };

  const filteredCategories = categories.filter((cat) => {
    if (categoryFilter === 'ALL') return true;
    return cat.natureType === categoryFilter;
  });

  const variableCostCount = categories.filter((c) => c.natureType === 'VARIABLE_COST').length;
  const fixedCostCount = categories.filter((c) => c.natureType === 'FIXED_COST').length;
  const incomeCount = categories.filter((c) => c.natureType === 'INCOME').length;
  const investmentCount = categories.filter((c) => c.natureType === 'INVESTMENT').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[#111726] border border-slate-800 rounded-2xl shadow-modal p-4 sm:p-6 max-h-[92vh] flex flex-col">
        {/* Header do Modal */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700/60 text-slate-200">
              <FolderPlus className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Gerenciar Categorias & Contas
              </h2>
              <p className="text-xs text-slate-400">
                Organize seu plano de contas, adicione custos variáveis e personalize a DRE
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Abas Principais */}
        <div className="flex space-x-2 my-3 sm:my-4 border-b border-slate-800 pb-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('categories')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'categories'
                ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
            }`}
          >
            <Tag className="h-4 w-4" />
            <span>Categorias Contábeis ({categories.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('accounts')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'accounts'
                ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
            }`}
          >
            <Landmark className="h-4 w-4" />
            <span>Contas Financeiras ({accounts.length})</span>
          </button>
        </div>

        {/* Conteúdo com Scroll */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4">
          {/* Card de Restauração do Plano Padrão */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-lg bg-amber-400/10 text-amber-400 shrink-0">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">
                  Restaurar Plano Padrão (DRE & Liquidez)
                </h4>
                <p className="text-[11px] text-slate-400">
                  Garante que todas as categorias e contas essenciais padrão estejam criadas.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleTriggerSeed}
              disabled={isSeeding}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 transition shadow disabled:opacity-50 flex items-center justify-center space-x-1.5 shrink-0"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>{isSeeding ? 'Inicializando...' : '⚡ Restaurar Padrões'}</span>
            </button>
          </div>

          {activeTab === 'categories' ? (
            <div className="space-y-4">
              {/* Formulário Nova Categoria */}
              <form onSubmit={handleCreateCategory} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center space-x-2 text-xs font-semibold text-white uppercase tracking-wider">
                  <Plus className="h-4 w-4 text-emerald-400" />
                  <span>Cadastrar Nova Categoria</span>
                </div>

                {catSuccessMsg && (
                  <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center space-x-2 text-emerald-300 text-xs">
                    <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>{catSuccessMsg}</span>
                  </div>
                )}
                {catErrorMsg && (
                  <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                    {catErrorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Nome da Categoria
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Roupas & Vestuário, Combustível, Streaming..."
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-750 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Natureza Contábil
                    </label>
                    <select
                      value={newCatNature}
                      onChange={(e) => setNewCatNature(e.target.value as NatureType)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-750 text-white text-xs focus:outline-none focus:border-emerald-500"
                    >
                      <option value="VARIABLE_COST">Custo Variável (Recomendado)</option>
                      <option value="FIXED_COST">Custo Fixo</option>
                      <option value="INCOME">Receita</option>
                      <option value="INVESTMENT">Investimento</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={isSubmittingCat}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition shadow disabled:opacity-50 flex items-center space-x-1.5"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>{isSubmittingCat ? 'Salvando...' : 'Adicionar Categoria'}</span>
                  </button>
                </div>
              </form>

              {/* Filtros de Natureza */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Categorias Cadastradas ({filteredCategories.length})
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    Clique na lixeira para excluir categorias não utilizadas
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setCategoryFilter('ALL')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      categoryFilter === 'ALL'
                        ? 'bg-slate-800 text-white border border-slate-700'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    Todos ({categories.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCategoryFilter('VARIABLE_COST');
                      setNewCatNature('VARIABLE_COST');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 ${
                      categoryFilter === 'VARIABLE_COST'
                        ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                        : 'bg-slate-900 text-amber-400/80 hover:text-amber-300 border border-slate-800'
                    }`}
                  >
                    <span>⚡ Custos Variáveis ({variableCostCount})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCategoryFilter('FIXED_COST');
                      setNewCatNature('FIXED_COST');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      categoryFilter === 'FIXED_COST'
                        ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                        : 'bg-slate-900 text-rose-400/80 hover:text-rose-300 border border-slate-800'
                    }`}
                  >
                    Custos Fixos ({fixedCostCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCategoryFilter('INCOME');
                      setNewCatNature('INCOME');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      categoryFilter === 'INCOME'
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-900 text-emerald-400/80 hover:text-emerald-300 border border-slate-800'
                    }`}
                  >
                    Receitas ({incomeCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCategoryFilter('INVESTMENT');
                      setNewCatNature('INVESTMENT');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      categoryFilter === 'INVESTMENT'
                        ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                        : 'bg-slate-900 text-indigo-400/80 hover:text-indigo-300 border border-slate-800'
                    }`}
                  >
                    Investimentos ({investmentCount})
                  </button>
                </div>

                {/* Grid de Categorias */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {filteredCategories.map((cat) => {
                    const badge = natureLabels[cat.natureType] || {
                      label: cat.natureType,
                      bg: 'bg-slate-800',
                      text: 'text-slate-300',
                      border: 'border-slate-700',
                    };
                    const txCount = cat._count?.transactions ?? 0;
                    const isEditing = editingCatId === cat.id;

                    if (isEditing) {
                      return (
                        <div
                          key={cat.id}
                          className="p-3 rounded-xl bg-slate-900 border border-emerald-500/50 space-y-2"
                        >
                          <input
                            type="text"
                            value={editCatName}
                            onChange={(e) => setEditCatName(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-750 text-white text-xs focus:outline-none focus:border-emerald-500"
                          />
                          <div className="flex items-center justify-between gap-2">
                            <select
                              value={editCatNature}
                              onChange={(e) => setEditCatNature(e.target.value as NatureType)}
                              className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-750 text-white text-[11px]"
                            >
                              <option value="VARIABLE_COST">Custo Variável</option>
                              <option value="FIXED_COST">Custo Fixo</option>
                              <option value="INCOME">Receita</option>
                              <option value="INVESTMENT">Investimento</option>
                            </select>
                            <div className="flex items-center space-x-1">
                              <button
                                type="button"
                                onClick={() => setEditingCatId(null)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                              >
                                <X className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSaveEditCat(cat.id)}
                                disabled={isUpdatingCat}
                                className="p-1.5 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-500"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={cat.id}
                        className="p-2.5 sm:p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition flex items-center justify-between gap-2 group"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-slate-200 truncate">
                            {cat.name}
                          </p>
                          <div className="flex items-center space-x-2 mt-0.5">
                            <span
                              className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border ${badge.bg} ${badge.text} ${badge.border}`}
                            >
                              {badge.label}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {txCount === 0 ? 'Sem lançamentos' : `${txCount} lançamento(s)`}
                            </span>
                          </div>
                        </div>

                        {/* Botões de Ação */}
                        <div className="flex items-center space-x-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleStartEditCat(cat)}
                            title="Editar Categoria"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(cat)}
                            disabled={deletingCatId === cat.id}
                            title={txCount === 0 ? "Excluir categoria não utilizada" : `Excluir categoria (${txCount} lançamentos)`}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition disabled:opacity-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Formulário Nova Conta */}
              <form onSubmit={handleCreateAccount} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center space-x-2 text-xs font-semibold text-white uppercase tracking-wider">
                  <Plus className="h-4 w-4 text-emerald-400" />
                  <span>Cadastrar Nova Conta Financeira</span>
                </div>

                {accSuccessMsg && (
                  <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center space-x-2 text-emerald-300 text-xs">
                    <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>{accSuccessMsg}</span>
                  </div>
                )}
                {accErrorMsg && (
                  <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                    {accErrorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Nome da Conta / Instituição
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Nubank, BTG Pactual, Inter, Carteira..."
                      value={newAccName}
                      onChange={(e) => setNewAccName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-750 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Tipo de Conta
                    </label>
                    <select
                      value={newAccType}
                      onChange={(e) => setNewAccType(e.target.value as AccountType)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-750 text-white text-xs focus:outline-none focus:border-emerald-500"
                    >
                      <option value="CHECKING">Conta Corrente (Caixa)</option>
                      <option value="SAVINGS">Reserva / CDB</option>
                      <option value="INVESTMENT">Investimentos</option>
                      <option value="CASH">Dinheiro Vivo</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={isSubmittingAcc}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition shadow disabled:opacity-50 flex items-center space-x-1.5"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>{isSubmittingAcc ? 'Salvando...' : 'Adicionar Conta'}</span>
                  </button>
                </div>
              </form>

              {/* Lista de Contas Existentes */}
              <div className="mt-4">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Contas Cadastradas ({accounts.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {accounts.map((acc) => {
                    const typeInfo = accountTypeLabels[acc.type] || { label: acc.type, icon: <Landmark className="h-4 w-4" /> };
                    const txCount = acc._count?.transactions ?? 0;
                    return (
                      <div
                        key={acc.id}
                        className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-2 group hover:border-slate-700 transition"
                      >
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <div className="p-1.5 rounded-lg bg-slate-800 border border-slate-700/60 shrink-0">
                            {typeInfo.icon}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-white truncate">
                              {acc.name}
                            </p>
                            <p className="text-[10px] text-slate-400 truncate">
                              {typeInfo.label} • {txCount} lançamento(s)
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 shrink-0">
                          <span className="text-xs font-semibold font-mono-numbers text-emerald-400">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(acc.balance)}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteAccount(acc)}
                            disabled={deletingAccId === acc.id}
                            title="Excluir conta"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition disabled:opacity-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
