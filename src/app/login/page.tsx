'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Layers,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';
import { api } from '../../services/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Informe seu email e senha.');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMsg(null);
      await api.login({ email, password });
      router.push('/');
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Erro ao realizar login. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden">
      {/* Container Principal */}
      <div className="w-full max-w-md space-y-6 relative z-10 animate-fadeIn">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-slate-800 border border-slate-700 text-emerald-400 mb-2 shadow-sm">
            <Layers className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Finance<span className="text-emerald-400 font-semibold">CFO</span>
          </h1>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Acesso seguro à sua Governança Financeira Pessoal & DRE Corporativa
          </p>
        </div>

        {/* Card do Formulário */}
        <div className="bg-[#111726] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-card">
          <div className="flex items-center space-x-2 pb-4 mb-4 border-b border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-300">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Autenticação Segura</span>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-start space-x-2 animate-fadeIn">
              <span className="shrink-0 text-sm">⚠️</span>
              <p className="leading-relaxed">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  required
                  autoFocus
                  placeholder="seu.email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-750 text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Senha
                </label>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-750 text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                  title={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm text-white bg-emerald-600 hover:bg-emerald-500 transition shadow-sm disabled:opacity-50 flex items-center justify-center space-x-2 active:scale-98"
            >
              {isLoading ? (
                <span>Autenticando...</span>
              ) : (
                <>
                  <span>Entrar no Sistema</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-400">
              Primeiro acesso?{' '}
              <Link
                href="/register"
                className="text-emerald-400 hover:text-emerald-300 font-semibold transition"
              >
                Criar uma conta nova
              </Link>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center">
          <p className="text-[11px] text-slate-500 flex items-center justify-center space-x-1.5">
            <Lock className="h-3 w-3" />
            <span>Dados 100% isolados e criptografados (Bcrypt + JWT)</span>
          </p>
        </div>
      </div>
    </div>
  );
}
