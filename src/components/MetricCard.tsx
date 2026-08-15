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
        return <Wallet className="h-5 w-5 text-cyan-400" />;
      case 'savings_margin':
        return <PieChart className="h-5 w-5 text-emerald-400" />;
      case 'runway':
        return <Hourglass className="h-5 w-5 text-indigo-400" />;
      default:
        return <Activity className="h-5 w-5 text-cyan-400" />;
    }
  };

  const getGlowClass = () => {
    switch (type) {
      case 'liquidity':
        return 'hover:shadow-glow-cyan';
      case 'savings_margin':
        return 'hover:shadow-glow-emerald';
      case 'runway':
        return 'hover:shadow-glow-indigo';
    }
  };

  const getBadgeColors = () => {
    switch (badgeVariant) {
      case 'emerald':
        return 'bg-emerald-950/80 border-emerald-700/60 text-emerald-300';
      case 'cyan':
        return 'bg-cyan-950/80 border-cyan-700/60 text-cyan-300';
      case 'amber':
        return 'bg-amber-950/80 border-amber-700/60 text-amber-300';
      case 'rose':
        return 'bg-rose-950/80 border-rose-700/60 text-rose-300';
      case 'indigo':
        return 'bg-indigo-950/80 border-indigo-700/60 text-indigo-300';
      default:
        return 'bg-slate-800 border-slate-700 text-slate-300';
    }
  };

  return (
    <div
      className={`glass-panel-interactive rounded-2xl p-6 relative overflow-hidden transition-all duration-300 ${getGlowClass()}`}
    >
      {/* Top Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/50">
            {getIcon()}
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {title}
            </h3>
            <p className="text-[11px] text-slate-500">{subtitle}</p>
          </div>
        </div>

        {badgeText && (
          <span
            className={`px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase rounded-full border ${getBadgeColors()}`}
          >
            {badgeText}
          </span>
        )}
      </div>

      {/* Main Metric Value */}
      <div className="mt-5">
        <div className="text-3xl font-extrabold font-mono-numbers text-white tracking-tight">
          {mainValue}
        </div>
        {secondaryInfo && (
          <div className="mt-1.5 text-xs text-slate-400 flex items-center space-x-1.5">
            <span>{secondaryInfo}</span>
          </div>
        )}
      </div>

      {/* Optional Progress Bar */}
      {progressPercentage !== undefined && (
        <div className="mt-4">
          <div className="flex justify-between text-[11px] font-medium text-slate-400 mb-1.5">
            <span>Eficiência Operacional</span>
            <span className="font-mono-numbers text-emerald-400">
              {Math.min(100, Math.max(0, progressPercentage))}%
            </span>
          </div>
          <div className="w-full bg-slate-800/90 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, Math.max(0, progressPercentage))}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Breakdown Items List */}
      {breakdownItems && breakdownItems.length > 0 && (
        <div className="mt-5 pt-4 border-t border-slate-800/70 space-y-2">
          {breakdownItems.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between text-xs"
            >
              <span className="text-slate-400">{item.label}</span>
              <span className="font-medium font-mono-numbers text-slate-200">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
