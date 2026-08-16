'use client';

import React from 'react';
import {
  Wallet,
  PieChart,
  Hourglass,
  Activity,
} from 'lucide-react';

interface MetricCardProps {
  type: 'liquidity' | 'savings_margin' | 'runway';
  title: string;
  subtitle: string;
  mainValue: string;
  secondaryInfo?: string;
  badgeText?: string;
  badgeVariant?: 'emerald' | 'cyan' | 'amber' | 'rose' | 'indigo';
  progressPercentage?: number;
  breakdownItems?: Array<{ label: string; value: string }>;
}

export function MetricCard({
  type,
  title,
  subtitle,
  mainValue,
  secondaryInfo,
  badgeText,
  badgeVariant = 'cyan',
  progressPercentage,
  breakdownItems,
}: MetricCardProps) {
  const getIcon = () => {
    switch (type) {
      case 'liquidity':
        return <Wallet className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400" />;
      case 'savings_margin':
        return <PieChart className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />;
      case 'runway':
        return <Hourglass className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-400" />;
      default:
        return <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />;
    }
  };

  const getBadgeColors = () => {
    switch (badgeVariant) {
      case 'emerald':
        return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
      case 'cyan':
        return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
      case 'amber':
        return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
      case 'rose':
        return 'bg-rose-500/10 border-rose-500/20 text-rose-400';
      case 'indigo':
        return 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400';
      default:
        return 'bg-slate-800 border-slate-700 text-slate-300';
    }
  };

  return (
    <div
      className="glass-panel-interactive rounded-2xl p-4 sm:p-6 relative overflow-hidden"
    >
      {/* Top Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
          <div className="p-2 sm:p-2.5 rounded-xl bg-slate-800 border border-slate-700/60 shrink-0">
            {getIcon()}
          </div>
          <div className="min-w-0">
            <h3 className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400 truncate">
              {title}
            </h3>
            <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">{subtitle}</p>
          </div>
        </div>

        {badgeText && (
          <span
            className={`px-2.5 py-1 text-[10px] font-semibold tracking-wide rounded-md border shrink-0 whitespace-nowrap ${getBadgeColors()}`}
          >
            {badgeText}
          </span>
        )}
      </div>

      {/* Main Metric Value */}
      <div className="mt-4 sm:mt-5">
        <div className="text-2xl sm:text-3xl font-bold font-mono-numbers text-white tracking-tight break-words">
          {mainValue}
        </div>
        {secondaryInfo && (
          <div className="mt-1 sm:mt-1.5 text-[11px] sm:text-xs text-slate-400 flex items-center space-x-1.5">
            <span>{secondaryInfo}</span>
          </div>
        )}
      </div>

      {/* Optional Progress Bar */}
      {progressPercentage !== undefined && (
        <div className="mt-3 sm:mt-4">
          <div className="flex justify-between text-[10px] sm:text-[11px] font-medium text-slate-400 mb-1.5">
            <span>Eficiência Operacional</span>
            <span className="font-mono-numbers text-emerald-400 font-semibold">
              {Math.min(100, Math.max(0, progressPercentage))}%
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, Math.max(0, progressPercentage))}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Breakdown Items List */}
      {breakdownItems && breakdownItems.length > 0 && (
        <div className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-slate-800/80 space-y-2">
          {breakdownItems.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between text-xs gap-2"
            >
              <span className="text-slate-400 truncate text-[11px] sm:text-xs">{item.label}</span>
              <span className="font-medium font-mono-numbers text-slate-200 shrink-0 text-[11px] sm:text-xs">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
