'use client';

import React from 'react';
import {
  Layers,
  PlusCircle,
  RefreshCw,
  FolderTree,
  Sparkles,
  LogOut,
  User,
} from 'lucide-react';

interface HeaderProps {
  netWorth: number;
  userName?: string;
  onOpenQuickEntry: () => void;
  onOpenManageEntities?: () => void;
  onRefresh: () => void;
  onLogout?: () => void;
  isLoading: boolean;
  isUninitialized?: boolean;
  onTriggerSeed?: () => void;
  isSeeding?: boolean;
}

export function Header({
  netWorth,
  userName,
  onOpenQuickEntry,
  onOpenManageEntities,
  onRefresh,
  onLogout,
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
                {userName ? (
                  <span className="hidden md:inline-flex items-center space-x-1 px-2 py-0.5 text-[10px] font-medium text-slate-300 bg-slate-800/80 border border-slate-700/80 rounded-md truncate max-w-[160px]">
                    <User className="h-3 w-3 text-slate-400 shrink-0" />
                    <span className="truncate">{userName}</span>
                  </span>
                ) : (
                  <span className="hidden sm:inline-flex px-2 py-0.5 text-[10px] font-semibold text-slate-300 bg-slate-800 border border-slate-700 rounded-md">
                    Protegido
                  </span>
                )}
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

            {/* Fast Entry Button */}
            <button
              onClick={onOpenQuickEntry}
              className="flex items-center space-x-1.5 sm:space-x-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white bg-emerald-600 hover:bg-emerald-500 transition shadow-sm active:scale-95 shrink-0"
            >
              <PlusCircle className="h-4 w-4 text-emerald-100 shrink-0" />
              <span className="hidden sm:inline">Novo Lançamento</span>
              <span className="sm:hidden font-bold">Novo</span>
            </button>

            {/* Logout Button */}
            {onLogout && (
              <button
                onClick={onLogout}
                className="p-2 sm:p-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-400 hover:text-rose-400 hover:border-rose-500/40 hover:bg-rose-950/20 transition active:scale-95 shrink-0"
                title="Sair / Encerrar sessão"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
