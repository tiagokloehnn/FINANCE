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
    <div className="glass-panel rounded-2xl p-6 sm:p-8">
      {/* Table Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800/80 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Demonstrativo de Resultado do Exercício (DRE Pessoal)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Estrutura contábil corporativa em cascata para apuração de geração de caixa
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300">
            Margem Bruta:{' '}
            <span className="font-mono-numbers font-bold text-emerald-400">
              {dre.margins.grossMargin}%
            </span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300">
            Margem Op.:{' '}
            <span className="font-mono-numbers font-bold text-cyan-400">
              {dre.margins.operatingSavingsMargin}%
            </span>
          </div>
        </div>
      </div>

      {/* DRE Rows */}
      <div className="mt-6 space-y-3 font-mono-numbers">
        {/* 1. (+) RECEITAS TOTAIS */}
        <div className="rounded-xl bg-emerald-950/20 border border-emerald-900/40 p-4 transition">
          <div
            onClick={() => toggleSection('incomes')}
            className="flex items-center justify-between cursor-pointer select-none"
          >
            <div className="flex items-center space-x-3 font-sans">
              <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                <PlusCircle className="h-4 w-4" />
              </span>
              <div>
                <span className="text-sm font-bold text-emerald-300 uppercase tracking-wider">
                  (+) Receitas Totais
                </span>
                <span className="ml-2 text-xs text-slate-400 font-normal">
                  ({dre.breakdown.incomes.length} fontes)
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-base font-bold text-emerald-400">
                {formatBRL(dre.totalIncome)}
              </span>
              <span className="text-slate-400 text-xs w-12 text-right">100.0%</span>
              {expandedSections.incomes ? (
                <ChevronDown className="h-4 w-4 text-slate-400" />
              ) : (
                <ChevronRight className="h-4 w-4 text-slate-400" />
              )}
            </div>
          </div>

          {/* Detailed Incomes Breakdown */}
          {expandedSections.incomes && dre.breakdown.incomes.length > 0 && (
            <div className="mt-3 pt-3 border-t border-emerald-900/30 space-y-2 pl-9 font-sans text-xs">
              {dre.breakdown.incomes.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between text-slate-300 py-1 hover:text-white"
                >
                  <span>{item.name}</span>
                  <div className="flex items-center space-x-4 font-mono-numbers">
                    <span className="text-slate-200">{formatBRL(item.amount)}</span>
                    <span className="text-slate-500 w-12 text-right">
                      {item.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 2. (-) CUSTOS FIXOS */}
        <div className="rounded-xl bg-rose-950/20 border border-rose-900/40 p-4 transition">
          <div
            onClick={() => toggleSection('fixedCosts')}
            className="flex items-center justify-between cursor-pointer select-none"
          >
            <div className="flex items-center space-x-3 font-sans">
              <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
                <MinusCircle className="h-4 w-4" />
              </span>
              <div>
                <span className="text-sm font-bold text-rose-300 uppercase tracking-wider">
                  (-) Custos Fixos
                </span>
                <span className="ml-2 text-xs text-slate-400 font-normal">
                  (Essenciais / Sobrevivência)
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-base font-bold text-rose-400">
                - {formatBRL(dre.totalFixedCosts)}
              </span>
              <span className="text-rose-400/80 text-xs w-12 text-right">
                {dre.totalIncome > 0
                  ? ((dre.totalFixedCosts / dre.totalIncome) * 100).toFixed(1)
                  : 0}
                %
              </span>
              {expandedSections.fixedCosts ? (
                <ChevronDown className="h-4 w-4 text-slate-400" />
              ) : (
                <ChevronRight className="h-4 w-4 text-slate-400" />
              )}
            </div>
          </div>

          {/* Detailed Fixed Costs Breakdown */}
          {expandedSections.fixedCosts && dre.breakdown.fixedCosts.length > 0 && (
            <div className="mt-3 pt-3 border-t border-rose-900/30 space-y-2 pl-9 font-sans text-xs">
              {dre.breakdown.fixedCosts.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between text-slate-300 py-1 hover:text-white"
                >
                  <span>{item.name}</span>
                  <div className="flex items-center space-x-4 font-mono-numbers">
                    <span className="text-slate-200">{formatBRL(item.amount)}</span>
                    <span className="text-slate-500 w-12 text-right">
                      {item.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3. (=) RESULTADO OPERACIONAL BRUTO */}
        <div className="rounded-xl bg-slate-900/90 border-2 border-slate-700/80 p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-3 font-sans">
            <span className="p-1.5 rounded-lg bg-slate-800 text-cyan-400">
              <Equal className="h-4 w-4" />
            </span>
            <div>
              <span className="text-sm font-bold text-white uppercase tracking-wider">
                (=) Resultado Operacional Bruto
              </span>
              <span className="ml-2 text-xs text-slate-400">
                (Receita - Custos Fixos)
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span
              className={`text-base font-extrabold ${
                dre.grossOperatingResult >= 0 ? 'text-cyan-400' : 'text-rose-400'
              }`}
            >
              {formatBRL(dre.grossOperatingResult)}
            </span>
            <span className="text-cyan-300 font-bold text-xs w-12 text-right">
              {dre.margins.grossMargin}%
            </span>
            <div className="w-4" />
          </div>
        </div>

        {/* 4. (-) CUSTOS VARIÁVEIS */}
        <div className="rounded-xl bg-amber-950/20 border border-amber-900/40 p-4 transition">
          <div
            onClick={() => toggleSection('variableCosts')}
            className="flex items-center justify-between cursor-pointer select-none"
          >
            <div className="flex items-center space-x-3 font-sans">
              <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                <MinusCircle className="h-4 w-4" />
              </span>
              <div>
                <span className="text-sm font-bold text-amber-300 uppercase tracking-wider">
                  (-) Custos Variáveis
                </span>
                <span className="ml-2 text-xs text-slate-400 font-normal">
                  (Estilo de Vida, Lazer & Consumo)
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-base font-bold text-amber-400">
                - {formatBRL(dre.totalVariableCosts)}
              </span>
              <span className="text-amber-400/80 text-xs w-12 text-right">
                {dre.totalIncome > 0
                  ? ((dre.totalVariableCosts / dre.totalIncome) * 100).toFixed(1)
                  : 0}
                %
              </span>
              {expandedSections.variableCosts ? (
                <ChevronDown className="h-4 w-4 text-slate-400" />
              ) : (
                <ChevronRight className="h-4 w-4 text-slate-400" />
              )}
            </div>
          </div>

          {/* Detailed Variable Costs Breakdown */}
          {expandedSections.variableCosts &&
            dre.breakdown.variableCosts.length > 0 && (
              <div className="mt-3 pt-3 border-t border-amber-900/30 space-y-2 pl-9 font-sans text-xs">
                {dre.breakdown.variableCosts.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between text-slate-300 py-1 hover:text-white"
                  >
                    <span>{item.name}</span>
                    <div className="flex items-center space-x-4 font-mono-numbers">
                      <span className="text-slate-200">{formatBRL(item.amount)}</span>
                      <span className="text-slate-500 w-12 text-right">
                        {item.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>

        {/* 5. (=) GERAÇÃO DE CAIXA OPERACIONAL */}
        <div className="rounded-xl bg-gradient-to-r from-slate-900 via-cyan-950/30 to-slate-900 border-2 border-cyan-500/40 p-4 flex items-center justify-between shadow-lg shadow-cyan-950/40">
          <div className="flex items-center space-x-3 font-sans">
            <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <span className="text-sm font-extrabold text-cyan-200 uppercase tracking-wider">
                (=) Geração de Caixa Operacional
              </span>
              <span className="ml-2 text-xs text-slate-400">
                (Capacidade Real de Poupança)
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span
              className={`text-lg font-extrabold ${
                dre.operatingCashFlow >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {formatBRL(dre.operatingCashFlow)}
            </span>
            <span className="text-emerald-300 font-bold text-xs w-12 text-right">
              {dre.margins.operatingSavingsMargin}%
            </span>
            <div className="w-4" />
          </div>
        </div>

        {/* 6. (-) INVESTIMENTOS */}
        <div className="rounded-xl bg-indigo-950/20 border border-indigo-900/40 p-4 transition">
          <div
            onClick={() => toggleSection('investments')}
            className="flex items-center justify-between cursor-pointer select-none"
          >
            <div className="flex items-center space-x-3 font-sans">
              <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                <MinusCircle className="h-4 w-4" />
              </span>
              <div>
                <span className="text-sm font-bold text-indigo-300 uppercase tracking-wider">
                  (-) Investimentos & Aportes
                </span>
                <span className="ml-2 text-xs text-slate-400 font-normal">
                  (Construção Patrimonial)
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-base font-bold text-indigo-400">
                - {formatBRL(dre.totalInvestments)}
              </span>
              <span className="text-indigo-400/80 text-xs w-12 text-right">
                {dre.margins.investmentRate}%
              </span>
              {expandedSections.investments ? (
                <ChevronDown className="h-4 w-4 text-slate-400" />
              ) : (
                <ChevronRight className="h-4 w-4 text-slate-400" />
              )}
            </div>
          </div>

          {/* Detailed Investments Breakdown */}
          {expandedSections.investments &&
            dre.breakdown.investments.length > 0 && (
              <div className="mt-3 pt-3 border-t border-indigo-900/30 space-y-2 pl-9 font-sans text-xs">
                {dre.breakdown.investments.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between text-slate-300 py-1 hover:text-white"
                  >
                    <span>{item.name}</span>
                    <div className="flex items-center space-x-4 font-mono-numbers">
                      <span className="text-slate-200">{formatBRL(item.amount)}</span>
                      <span className="text-slate-500 w-12 text-right">
                        {item.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>

        {/* 7. (=) FLUXO DE CAIXA LÍQUIDO FINAL */}
        <div className="rounded-xl bg-slate-950 border-2 border-emerald-500/60 p-4 sm:p-5 flex items-center justify-between shadow-glow-emerald">
          <div className="flex items-center space-x-3 font-sans">
            <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Equal className="h-5 w-5" />
            </span>
            <div>
              <span className="text-base font-extrabold text-white uppercase tracking-wider">
                (=) Fluxo de Caixa Líquido
              </span>
              <span className="block sm:inline sm:ml-2 text-xs text-slate-400">
                (Sobra em Caixa após Aportes)
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span
              className={`text-xl font-extrabold ${
                dre.netCashFlow >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {formatBRL(dre.netCashFlow)}
            </span>
            <div className="w-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
