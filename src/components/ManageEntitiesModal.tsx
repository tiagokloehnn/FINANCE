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
  TrendingUp,
  CreditCard,
  Building,
  CheckCircle,
  Tag,
  PiggyBank,
  Coins,
  Landmark,
  Sparkles,
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
  const [isSeeding, setIsSeeding] = useState(false);

  // Form Categoria
  const [newCatName, setNewCatName] = useState('');
  const [newCatNature, setNewCatNature] = useState<NatureType>('FIXED_COST');
  const [isSubmittingCat, setIsSubmittingCat] = useState(false);
  const [catSuccessMsg, setCatSuccessMsg] = useState<string | null>(null);
  const [catErrorMsg, setCatErrorMsg] = useState<string | null>(null);

  // Form Conta
  const [newAccName, setNewAccName] = useState('');
  const [newAccType, setNewAccType] = useState<AccountType>('CHECKING');
  const [newAccBalance, setNewAccBalance] = useState<string>('0');
  const [isSubmittingAcc, setIsSubmittingAcc] = useState(false);
  const [accSuccessMsg, setAccSuccessMsg] = useState<string | null>(null);
  const [accErrorMsg, setAccErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTriggerSeed = async () => {
    try {
      setIsSeeding(true);
      setCatErrorMsg(null);
      setAccErrorMsg(null);
      await api.triggerSeed(false);
      await onRefresh();
      setCatSuccessMsg('Plano padrão de categorias e contas inicializado no Supabase com sucesso!');
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
      setCatSuccessMsg('Categoria contábil criada com sucesso!');
      await onRefresh();
      setTimeout(() => setCatSuccessMsg(null), 4000);
    } catch (err: any) {
      setCatErrorMsg(err?.message || 'Erro ao criar categoria.');
    } finally {
      setIsSubmittingCat(false);
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

  const natureLabels: Record<NatureType, { label: string; bg: string; text: string }> = {
    INCOME: { label: 'Receita', bg: 'bg-emerald-950/60 border-emerald-500/40', text: 'text-emerald-400' },
    FIXED_COST: { label: 'Custo Fixo', bg: 'bg-rose-950/60 border-rose-500/40', text: 'text-rose-400' },
    VARIABLE_COST: { label: 'Custo Variável', bg: 'bg-amber-950/60 border-amber-500/40', text: 'text-amber-400' },
    INVESTMENT: { label: 'Investimento', bg: 'bg-cyan-950/60 border-cyan-500/40', text: 'text-cyan-400' },
  };

  const accountTypeLabels: Record<AccountType, { label: string; icon: React.ReactNode }> = {
    CHECKING: { label: 'Conta Corrente / Caixa Livre', icon: <Landmark className="h-4 w-4 text-cyan-400" /> },
    SAVINGS: { label: 'Reserva de Emergência / CDB DI', icon: <PiggyBank className="h-4 w-4 text-emerald-400" /> },
    INVESTMENT: { label: 'Corretora de Investimentos', icon: <Coins className="h-4 w-4 text-indigo-400" /> },
    CASH: { label: 'Dinheiro Físico', icon: <Wallet className="h-4 w-4 text-amber-400" /> },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 sm:p-6 max-h-[90vh] flex flex-col">
        {/* Header do Modal */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 text-cyan-400">
              <FolderPlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Gerenciar Contas & Categorias
              </h2>
              <p className="text-xs text-slate-400">
                Personalize o plano de contas e estrutura da sua DRE corporativa
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

        {/* Abas */}
        <div className="flex space-x-2 my-4 border-b border-slate-800/80 pb-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('categories')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'categories'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Tag className="h-4 w-4" />
            <span>Categorias Contábeis ({categories.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('accounts')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'accounts'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Building className="h-4 w-4" />
            <span>Contas Financeiras ({accounts.length})</span>
          </button>
        </div>

        {/* Conteúdo com Scroll */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-5">
          {/* Card de Inicialização / Restauração do Plano Padrão */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-950/40 via-indigo-950/40 to-slate-900 border border-cyan-500/30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 shrink-0">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">
                  Plano Padrão DRE & Liquidez (Supabase)
                </h4>
                <p className="text-[11px] text-slate-400">
                  Cria todas as contas essenciais e categorias de DRE no banco de dados.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleTriggerSeed}
              disabled={isSeeding}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 transition shadow disabled:opacity-50 flex items-center justify-center space-x-1.5 shrink-0"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>{isSeeding ? 'Inicializando...' : '⚡ Inicializar Padrões'}</span>
            </button>
          </div>

          {activeTab === 'categories' ? (
            <div>
              {/* Formulário Nova Categoria */}
              <form onSubmit={handleCreateCategory} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/90 space-y-3">
                <div className="flex items-center space-x-2 text-xs font-bold text-white uppercase tracking-wider">
                  <Plus className="h-4 w-4 text-cyan-400" />
                  <span>Cadastrar Nova Categoria</span>
                </div>

                {catSuccessMsg && (
                  <div className="p-2.5 rounded-lg bg-emerald-950/50 border border-emerald-500/40 flex items-center space-x-2 text-emerald-300 text-xs">
                    <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>{catSuccessMsg}</span>
                  </div>
                )}
                {catErrorMsg && (
                  <div className="p-2.5 rounded-lg bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs">
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
                      placeholder="Ex: Pets & Veterinário, Consultoria PJ..."
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Natureza Contábil
                    </label>
                    <select
                      value={newCatNature}
                      onChange={(e) => setNewCatNature(e.target.value as NatureType)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                    >
                      <option value="FIXED_COST">Custo Fixo</option>
                      <option value="VARIABLE_COST">Custo Variável</option>
                      <option value="INCOME">Receita</option>
                      <option value="INVESTMENT">Investimento</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={isSubmittingCat}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 transition shadow disabled:opacity-50 flex items-center space-x-1.5"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>{isSubmittingCat ? 'Salvando...' : 'Adicionar Categoria'}</span>
                  </button>
                </div>
              </form>

              {/* Lista de Categorias Existentes */}
              <div className="mt-4">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Categorias Ativas ({categories.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {categories.map((cat) => {
                    const badge = natureLabels[cat.natureType] || { label: cat.natureType, bg: 'bg-slate-800', text: 'text-slate-300' };
                    return (
                      <div
                        key={cat.id}
                        className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/80 flex items-center justify-between gap-2"
                      >
                        <span className="text-xs font-medium text-slate-200 truncate">
                          {cat.name}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${badge.bg} ${badge.text}`}
                        >
                          {badge.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div>
              {/* Formulário Nova Conta */}
              <form onSubmit={handleCreateAccount} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/90 space-y-3">
                <div className="flex items-center space-x-2 text-xs font-bold text-white uppercase tracking-wider">
                  <Plus className="h-4 w-4 text-cyan-400" />
                  <span>Cadastrar Nova Conta Financeira</span>
                </div>

                {accSuccessMsg && (
                  <div className="p-2.5 rounded-lg bg-emerald-950/50 border border-emerald-500/40 flex items-center space-x-2 text-emerald-300 text-xs">
                    <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>{accSuccessMsg}</span>
                  </div>
                )}
                {accErrorMsg && (
                  <div className="p-2.5 rounded-lg bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs">
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
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Tipo de Conta
                    </label>
                    <select
                      value={newAccType}
                      onChange={(e) => setNewAccType(e.target.value as AccountType)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                    >
                      <option value="CHECKING">Conta Corrente (Caixa)</option>
                      <option value="SAVINGS">Reserva / Poupança</option>
                      <option value="INVESTMENT">Investimentos</option>
                      <option value="CASH">Dinheiro Vivo</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={isSubmittingAcc}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 transition shadow disabled:opacity-50 flex items-center space-x-1.5"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>{isSubmittingAcc ? 'Salvando...' : 'Adicionar Conta'}</span>
                  </button>
                </div>
              </form>

              {/* Lista de Contas Existentes */}
              <div className="mt-4">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Contas Cadastradas ({accounts.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {accounts.map((acc) => {
                    const typeInfo = accountTypeLabels[acc.type] || { label: acc.type, icon: <Building className="h-4 w-4" /> };
                    return (
                      <div
                        key={acc.id}
                        className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 shrink-0">
                            {typeInfo.icon}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-white truncate">
                              {acc.name}
                            </p>
                            <p className="text-[10px] text-slate-400 truncate">
                              {typeInfo.label}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-bold font-mono-numbers text-cyan-400 shrink-0">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(acc.balance)}
                        </span>
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
