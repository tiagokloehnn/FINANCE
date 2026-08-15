'use client';

import React, { useState } from 'react';
import {
  DreReport,
} from '../types/finance';
import {
  ChevronDown,
  ChevronRight,
  MinusCircle,
  PlusCircle,
  Equal,
  Sparkles,
} from 'lucide-react';

interface DreTableProps {
  dre: DreReport;
}

export function DreTable({ dre }: DreTableProps) {
  const [expandedSections, setExpandedSections] = useState<{
    incomes: boolean;
    fixedCosts: boolean;
    variableCosts: boolean;
    investments: boolean;
  }>({
    incomes: true,
    fixedCosts: true,
    variableCosts: true,
    investments: true,
  });

  const toggleSection = (
    section: 'incomes' | 'fixedCosts' | 'variableCosts' | 'investments',
  ) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const formatBRL = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val);
  };

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-6 lg:p-8">
      {/* Table Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 sm:pb-6 border-b border-slate-800/80 gap-3 sm:gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse shrink-0" />
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Demonstrativo de Resultado do Exercício (DRE Pessoal)
            </h2>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
            Estrutura contábil corporativa em cascata para apuração de geração de caixa
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] sm:text-xs font-medium text-slate-300">
            Margem Bruta:{' '}
            <span className="font-mono-numbers font-bold text-emerald-400">
              {dre.margins.grossMargin}%
            </span>
          </div>
          <div className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] sm:text-xs font-medium text-slate-300">
            Margem Op.:{' '}
            <span className="font-mono-numbers font-bold text-cyan-400">
              {dre.margins.operatingSavingsMargin}%
            </span>
          </div>
        </div>
      </div>

      {/* DRE Rows */}
      <div className="mt-4 sm:mt-6 space-y-2.5 sm:space-y-3 font-mono-numbers">
        {/* 1. (+) RECEITAS TOTAIS */}
        <div className="rounded-xl bg-emerald-950/20 border border-emerald-900/40 p-3 sm:p-4 transition">
          <div
            onClick={() => toggleSection('incomes')}
            className="flex items-center justify-between cursor-pointer select-none gap-2"
          >
            <div className="flex items-center space-x-2.5 sm:space-x-3 font-sans min-w-0 flex-1">
              <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                <PlusCircle className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <span className="text-xs sm:text-sm font-bold text-emerald-300 uppercase tracking-wider block sm:inline">
                  (+) Receitas Totais
                </span>
                <span className="text-[10px] sm:text-xs text-slate-400 font-normal sm:ml-2 block sm:inline truncate">
                  ({dre.breakdown.incomes.length} fontes)
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
              <span className="text-xs sm:text-base font-bold text-emerald-400 text-right">
                {formatBRL(dre.totalIncome)}
              </span>
              <span className="text-slate-400 text-[10px] sm:text-xs w-9 sm:w-12 text-right shrink-0">
                100.0%
              </span>
              <span className="shrink-0 text-slate-400">
                {expandedSections.incomes ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </span>
            </div>
          </div>

          {/* Detailed Incomes Breakdown */}
          {expandedSections.incomes && dre.breakdown.incomes.length > 0 && (
            <div className="mt-2.5 sm:mt-3 pt-2.5 sm:pt-3 border-t border-emerald-900/30 space-y-1.5 sm:space-y-2 pl-3 sm:pl-9 font-sans text-xs">
              {dre.breakdown.incomes.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between text-slate-300 py-0.5 sm:py-1 hover:text-white gap-2"
                >
                  <span className="truncate text-[11px] sm:text-xs min-w-0 flex-1">{item.name}</span>
                  <div className="flex items-center space-x-2 sm:space-x-4 font-mono-numbers shrink-0">
                    <span className="text-slate-200 text-[11px] sm:text-xs">{formatBRL(item.amount)}</span>
                    <span className="text-slate-500 text-[10px] sm:text-xs w-9 sm:w-12 text-right shrink-0">
                      {item.percentage}%
                    </span>
                    <div className="w-4 shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 2. (-) CUSTOS FIXOS */}
        <div className="rounded-xl bg-rose-950/20 border border-rose-900/40 p-3 sm:p-4 transition">
          <div
            onClick={() => toggleSection('fixedCosts')}
            className="flex items-center justify-between cursor-pointer select-none gap-2"
          >
            <div className="flex items-center space-x-2.5 sm:space-x-3 font-sans min-w-0 flex-1">
              <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 shrink-0">
                <MinusCircle className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <span className="text-xs sm:text-sm font-bold text-rose-300 uppercase tracking-wider block sm:inline">
                  (-) Custos Fixos
                </span>
                <span className="text-[10px] sm:text-xs text-slate-400 font-normal sm:ml-2 block sm:inline truncate">
                  (Essenciais / Sobrevivência)
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
              <span className="text-xs sm:text-base font-bold text-rose-400 text-right">
                - {formatBRL(dre.totalFixedCosts)}
              </span>
              <span className="text-rose-400/80 text-[10px] sm:text-xs w-9 sm:w-12 text-right shrink-0">
                {dre.totalIncome > 0
                  ? ((dre.totalFixedCosts / dre.totalIncome) * 100).toFixed(1)
                  : 0}
                %
              </span>
              <span className="shrink-0 text-slate-400">
                {expandedSections.fixedCosts ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </span>
            </div>
          </div>

          {/* Detailed Fixed Costs Breakdown */}
          {expandedSections.fixedCosts && dre.breakdown.fixedCosts.length > 0 && (
            <div className="mt-2.5 sm:mt-3 pt-2.5 sm:pt-3 border-t border-rose-900/30 space-y-1.5 sm:space-y-2 pl-3 sm:pl-9 font-sans text-xs">
              {dre.breakdown.fixedCosts.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between text-slate-300 py-0.5 sm:py-1 hover:text-white gap-2"
                >
                  <span className="truncate text-[11px] sm:text-xs min-w-0 flex-1">{item.name}</span>
                  <div className="flex items-center space-x-2 sm:space-x-4 font-mono-numbers shrink-0">
                    <span className="text-slate-200 text-[11px] sm:text-xs">{formatBRL(item.amount)}</span>
                    <span className="text-slate-500 text-[10px] sm:text-xs w-9 sm:w-12 text-right shrink-0">
                      {item.percentage}%
                    </span>
                    <div className="w-4 shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3. (=) RESULTADO OPERACIONAL BRUTO */}
        <div className="rounded-xl bg-slate-900/90 border-2 border-slate-700/80 p-3 sm:p-4 flex items-center justify-between shadow-sm gap-2">
          <div className="flex items-center space-x-2.5 sm:space-x-3 font-sans min-w-0 flex-1">
            <span className="p-1.5 rounded-lg bg-slate-800 text-cyan-400 shrink-0">
              <Equal className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <span className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider block sm:inline">
                (=) Res. Operacional Bruto
              </span>
              <span className="text-[10px] sm:text-xs text-slate-400 sm:ml-2 block sm:inline truncate">
                (Receita - Custos Fixos)
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
            <span
              className={`text-xs sm:text-base font-extrabold text-right ${
                dre.grossOperatingResult >= 0 ? 'text-cyan-400' : 'text-rose-400'
              }`}
            >
              {formatBRL(dre.grossOperatingResult)}
            </span>
            <span className="text-cyan-300 font-bold text-[10px] sm:text-xs w-9 sm:w-12 text-right shrink-0">
              {dre.margins.grossMargin}%
            </span>
            <div className="w-4 shrink-0" />
          </div>
        </div>

        {/* 4. (-) CUSTOS VARIÁVEIS */}
        <div className="rounded-xl bg-amber-950/20 border border-amber-900/40 p-3 sm:p-4 transition">
          <div
            onClick={() => toggleSection('variableCosts')}
            className="flex items-center justify-between cursor-pointer select-none gap-2"
          >
            <div className="flex items-center space-x-2.5 sm:space-x-3 font-sans min-w-0 flex-1">
              <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
                <MinusCircle className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <span className="text-xs sm:text-sm font-bold text-amber-300 uppercase tracking-wider block sm:inline">
                  (-) Custos Variáveis
                </span>
                <span className="text-[10px] sm:text-xs text-slate-400 font-normal sm:ml-2 block sm:inline truncate">
                  (Estilo de Vida & Lazer)
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
              <span className="text-xs sm:text-base font-bold text-amber-400 text-right">
                - {formatBRL(dre.totalVariableCosts)}
              </span>
              <span className="text-amber-400/80 text-[10px] sm:text-xs w-9 sm:w-12 text-right shrink-0">
                {dre.totalIncome > 0
                  ? ((dre.totalVariableCosts / dre.totalIncome) * 100).toFixed(1)
                  : 0}
                %
              </span>
              <span className="shrink-0 text-slate-400">
                {expandedSections.variableCosts ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </span>
            </div>
          </div>

          {/* Detailed Variable Costs Breakdown */}
          {expandedSections.variableCosts &&
            dre.breakdown.variableCosts.length > 0 && (
              <div className="mt-2.5 sm:mt-3 pt-2.5 sm:pt-3 border-t border-amber-900/30 space-y-1.5 sm:space-y-2 pl-3 sm:pl-9 font-sans text-xs">
                {dre.breakdown.variableCosts.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between text-slate-300 py-0.5 sm:py-1 hover:text-white gap-2"
                  >
                    <span className="truncate text-[11px] sm:text-xs min-w-0 flex-1">{item.name}</span>
                    <div className="flex items-center space-x-2 sm:space-x-4 font-mono-numbers shrink-0">
                      <span className="text-slate-200 text-[11px] sm:text-xs">{formatBRL(item.amount)}</span>
                      <span className="text-slate-500 text-[10px] sm:text-xs w-9 sm:w-12 text-right shrink-0">
                        {item.percentage}%
                      </span>
                      <div className="w-4 shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>

        {/* 5. (=) GERAÇÃO DE CAIXA OPERACIONAL */}
        <div className="rounded-xl bg-gradient-to-r from-slate-900 via-cyan-950/30 to-slate-900 border-2 border-cyan-500/40 p-3 sm:p-4 flex items-center justify-between shadow-lg shadow-cyan-950/40 gap-2">
          <div className="flex items-center space-x-2.5 sm:space-x-3 font-sans min-w-0 flex-1">
            <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 shrink-0">
              <Sparkles className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <span className="text-xs sm:text-sm font-extrabold text-cyan-200 uppercase tracking-wider block sm:inline">
                (=) Caixa Operacional
              </span>
              <span className="text-[10px] sm:text-xs text-slate-400 sm:ml-2 block sm:inline truncate">
                (Capacidade de Poupança)
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
            <span
              className={`text-xs sm:text-lg font-extrabold text-right ${
                dre.operatingCashFlow >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {formatBRL(dre.operatingCashFlow)}
            </span>
            <span className="text-emerald-300 font-bold text-[10px] sm:text-xs w-9 sm:w-12 text-right shrink-0">
              {dre.margins.operatingSavingsMargin}%
            </span>
            <div className="w-4 shrink-0" />
          </div>
        </div>

        {/* 6. (-) INVESTIMENTOS */}
        <div className="rounded-xl bg-indigo-950/20 border border-indigo-900/40 p-3 sm:p-4 transition">
          <div
            onClick={() => toggleSection('investments')}
            className="flex items-center justify-between cursor-pointer select-none gap-2"
          >
            <div className="flex items-center space-x-2.5 sm:space-x-3 font-sans min-w-0 flex-1">
              <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0">
                <MinusCircle className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <span className="text-xs sm:text-sm font-bold text-indigo-300 uppercase tracking-wider block sm:inline">
                  (-) Investimentos & Aportes
                </span>
                <span className="text-[10px] sm:text-xs text-slate-400 font-normal sm:ml-2 block sm:inline truncate">
                  (Construção Patrimonial)
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
              <span className="text-xs sm:text-base font-bold text-indigo-400 text-right">
                - {formatBRL(dre.totalInvestments)}
              </span>
              <span className="text-indigo-400/80 text-[10px] sm:text-xs w-9 sm:w-12 text-right shrink-0">
                {dre.margins.investmentRate}%
              </span>
              <span className="shrink-0 text-slate-400">
                {expandedSections.investments ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </span>
            </div>
          </div>

          {/* Detailed Investments Breakdown */}
          {expandedSections.investments &&
            dre.breakdown.investments.length > 0 && (
              <div className="mt-2.5 sm:mt-3 pt-2.5 sm:pt-3 border-t border-indigo-900/30 space-y-1.5 sm:space-y-2 pl-3 sm:pl-9 font-sans text-xs">
                {dre.breakdown.investments.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between text-slate-300 py-0.5 sm:py-1 hover:text-white gap-2"
                  >
                    <span className="truncate text-[11px] sm:text-xs min-w-0 flex-1">{item.name}</span>
                    <div className="flex items-center space-x-2 sm:space-x-4 font-mono-numbers shrink-0">
                      <span className="text-slate-200 text-[11px] sm:text-xs">{formatBRL(item.amount)}</span>
                      <span className="text-slate-500 text-[10px] sm:text-xs w-9 sm:w-12 text-right shrink-0">
                        {item.percentage}%
                      </span>
                      <div className="w-4 shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>

        {/* 7. (=) FLUXO DE CAIXA LÍQUIDO FINAL */}
        <div className="rounded-xl bg-slate-950 border-2 border-emerald-500/60 p-3 sm:p-5 flex items-center justify-between shadow-glow-emerald gap-2">
          <div className="flex items-center space-x-2.5 sm:space-x-3 font-sans min-w-0 flex-1">
            <span className="p-1.5 sm:p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
              <Equal className="h-4 w-4 sm:h-5 sm:w-5" />
            </span>
            <div className="min-w-0">
              <span className="text-xs sm:text-base font-extrabold text-white uppercase tracking-wider block sm:inline">
                (=) Fluxo Líquido Final
              </span>
              <span className="text-[10px] sm:text-xs text-slate-400 sm:ml-2 block sm:inline truncate">
                (Sobra após Aportes)
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
            <span
              className={`text-xs sm:text-xl font-extrabold text-right ${
                dre.netCashFlow >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {formatBRL(dre.netCashFlow)}
            </span>
            <div className="w-4 shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
}
