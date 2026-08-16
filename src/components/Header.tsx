'use client';

import React from 'react';
import {
  Layers,
  PlusCircle,
  RefreshCw,
  FolderTree,
  Sparkles,
} from 'lucide-react';

interface HeaderProps {
  netWorth: number;
  onOpenQuickEntry: () => void;
  onOpenManageEntities?: () => void;
  onRefresh: () => void;
  isLoading: boolean;
  isUninitialized?: boolean;
  onTriggerSeed?: () => void;
  isSeeding?: boolean;
}

export function Header({
  netWorth,
  onOpenQuickEntry,
  onOpenManageEntities,
  onRefresh,
  isLoading,
  isUninitialized,
  onTriggerSeed,
  isSeeding,
}: HeaderProps) {
  const formattedNetWorth = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(netWorth);

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-800 bg-[#0d121f]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          {/* Logo & Subtitle */}
          <div className="flex items-center space-x-3 min-w-0">
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200 shrink-0">
              <Layers className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap">
                  Finance<span className="text-emerald-400 font-semibold">CFO</span>
                </h1>
                <span className="hidden sm:inline-flex px-2 py-0.5 text-[10px] font-semibold text-slate-300 bg-slate-800 border border-slate-700 rounded-md">
                  Vercel + Supabase
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-400 truncate hidden xs:block">
                Governança, DRE e Liquidez Pessoal
              </p>
            </div>
          </div>

          {/* Right Section: Net Worth & CTA */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            {/* Total Net Worth Badge */}
            <div className="hidden lg:flex flex-col items-end px-3.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Patrimônio Consolidado
              </span>
              <span className="text-sm font-bold font-mono-numbers text-emerald-400">
                {formattedNetWorth}
              </span>
            </div>

            {/* Manage Categories & Accounts */}
            {onOpenManageEntities && (
              <button
                onClick={onOpenManageEntities}
                className="flex items-center space-x-1.5 px-3 py-2 sm:py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-300 hover:text-white hover:border-slate-600 transition active:scale-95 text-xs font-semibold shrink-0"
                title="Gerenciar Contas e Categorias Contábeis"
              >
                <FolderTree className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="hidden md:inline">Contas & Categorias</span>
              </button>
            )}

            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-400 hover:text-white hover:border-slate-600 transition disabled:opacity-50 active:scale-95 shrink-0"
              title="Atualizar dados"
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? 'animate-spin text-emerald-400' : ''}`}
              />
            </button>

            {/* Quick Seed Action in Header if uninitialized */}
            {isUninitialized && onTriggerSeed && (
              <button
                onClick={onTriggerSeed}
                disabled={isSeeding}
                className="flex items-center space-x-1.5 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-amber-400 hover:bg-amber-300 transition shadow-sm active:scale-95 shrink-0"
                title="Criar contas e categorias padrão no Supabase"
              >
                <Sparkles className="h-4 w-4 text-slate-950 shrink-0" />
                <span className="hidden sm:inline">{isSeeding ? 'Inicializando...' : '⚡ Inicializar Supabase'}</span>
                <span className="sm:hidden font-bold">⚡ Inicializar</span>
              </button>
            )}

            {/* Fast Entry Button */}
            <button
              onClick={onOpenQuickEntry}
              className="flex items-center space-x-1.5 sm:space-x-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white bg-emerald-600 hover:bg-emerald-500 transition shadow-sm active:scale-95 shrink-0"
            >
              <PlusCircle className="h-4 w-4 text-emerald-100 shrink-0" />
              <span className="hidden sm:inline">Novo Lançamento</span>
              <span className="sm:hidden font-bold">Novo</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

