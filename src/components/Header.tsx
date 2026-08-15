'use client';

import React from 'react';
import {
  Layers,
  PlusCircle,
  RefreshCw,
} from 'lucide-react';

interface HeaderProps {
  netWorth: number;
  onOpenQuickEntry: () => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export function Header({
  netWorth,
  onOpenQuickEntry,
  onRefresh,
  isLoading,
}: HeaderProps) {
  const formattedNetWorth = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(netWorth);

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          {/* Logo & Subtitle */}
          <div className="flex items-center space-x-2.5 sm:space-x-4 min-w-0">
            <div className="h-9 w-9 sm:h-11 sm:w-11 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-emerald-400 p-[1px] flex items-center justify-center shadow-glow-cyan shrink-0">
              <div className="h-full w-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <Layers className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-400" />
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <h1 className="text-base sm:text-xl font-extrabold tracking-tight text-white whitespace-nowrap">
                  FINANCE<span className="text-cyan-400">.CFO</span>
                </h1>
                <span className="hidden sm:inline-flex px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 rounded-full">
                  Vercel + Supabase
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-400 truncate hidden xs:block">
                Governança, DRE e Liquidez Pessoal
              </p>
            </div>
          </div>

          {/* Right Section: Net Worth & CTA */}
          <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
            {/* Total Net Worth Badge */}
            <div className="hidden lg:flex flex-col items-end px-3.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                Patrimônio Consolidado
              </span>
              <span className="text-sm font-bold font-mono-numbers text-emerald-400">
                {formattedNetWorth}
              </span>
            </div>

            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition disabled:opacity-50 active:scale-95 shrink-0"
              title="Atualizar dados"
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? 'animate-spin text-cyan-400' : ''}`}
              />
            </button>

            {/* Fast Entry Button */}
            <button
              onClick={onOpenQuickEntry}
              className="flex items-center space-x-1.5 sm:space-x-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 transition-all duration-200 shadow-lg shadow-cyan-500/20 active:scale-95 shrink-0"
            >
              <PlusCircle className="h-4 w-4 text-slate-950 shrink-0" />
              <span className="hidden sm:inline">Novo Lançamento</span>
              <span className="sm:hidden font-bold">Novo</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
