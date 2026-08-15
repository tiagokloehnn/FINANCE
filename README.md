# Finance CFO - Gestão Financeira Pessoal com Governança Corporativa

> Sistema de Gestão Financeira Pessoal aplicando conceitos contábeis e de finanças corporativas (**DRE em cascata**, **Liquidez Corrente**, **Margem de Poupança Operacional** e **Runway** de sobrevivência).
> **100% Serverless: Desenvolvido para rodar exclusivamente na Vercel + Supabase.**

---

## 🏛️ Conceitos Financeiros Implementados

### 1. Mini-DRE Pessoal (Demonstrativo do Resultado do Exercício)
Estrutura em cascata para apuração da capacidade real de geração de riqueza e poupança:
```
(+) Receitas Totais
(-) Custos Fixos (Moradia, Saúde, Contas Essenciais)
(=) Resultado Operacional Bruto
(-) Custos Variáveis (Estilo de vida, Alimentação, Lazer)
(=) Geração de Caixa Operacional (Margem de Poupança)
(-) Investimentos & Aportes (Ações, FIIs, Tesouro)
(=) Fluxo de Caixa Líquido (Saldo remanescente em caixa)
```

### 2. Três KPIs Estratégicos
1. **Liquidez Corrente (Caixa Livre)**: Disponibilidade imediata (Conta Corrente + Reserva de Emergência diária).
2. **Margem de Poupança Operacional**: Percentual da receita bruta retido após custos fixos e variáveis ($\frac{\text{Geração de Caixa Operacional}}{\text{Receita Total}} \times 100$).
3. **Runway (Meses de Sobrevivência)**: Autonomia financeira em meses caso todas as receitas cessem ($\frac{\text{Liquidez Total}}{\text{Custos Fixos + Custos Variáveis}}$).

---

## 🛠️ Stack Tecnológica

- **Frontend & API Fullstack**: [Next.js 14](https://nextjs.org/) (App Router, Serverless Functions, React 18, TypeScript)
- **Design & UI**: [Tailwind CSS](https://tailwindcss.com/) + [Lucide Icons](https://lucide.dev/) (Glassmorphism Dark Theme)
- **ORM & Modelagem**: [Prisma ORM](https://www.prisma.io/) (PostgreSQL Client com Pooler Supavisor)
- **Hospedagem & Nuvem**: [Vercel](https://vercel.com/) (Deploy 1-clique Serverless)
- **Banco de Dados**: [Supabase](https://supabase.com/) (PostgreSQL 16 Gerenciado)

---

## 🚀 Como Hospedar (Vercel + Supabase)

Consulte o passo a passo completo no arquivo [**SUPABASE_VERCEL_SETUP.md**](file:///e:/PROJETOS/FINANCE/SUPABASE_VERCEL_SETUP.md).

### Resumo Rápido:
1. **Crie um projeto no Supabase** e obtenha a `DATABASE_URL` (porta 6543) e `DIRECT_URL` (porta 5432).
2. **Crie as tabelas** executando o script [`supabase-schema.sql`](file:///e:/PROJETOS/FINANCE/supabase-schema.sql) no SQL Editor do Supabase (ou `npx prisma db push`).
3. **Importe o projeto na Vercel**, configure as variáveis de ambiente (`DATABASE_URL` e `DIRECT_URL`) e clique em **Deploy**.
4. Acesse o link da sua aplicação e clique em **"⚡ Inicializar Categorias Padrão"** no painel inicial.

---

## 💻 Desenvolvimento Local Opcional

Se desejar rodar em ambiente de desenvolvimento conectado ao Supabase:

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis no .env
cp .env.example .env
# (Preencha com suas credenciais do Supabase)

# 3. Gerar Prisma Client
npx prisma generate

# 4. Iniciar servidor Next.js
npm run dev
```

Acesse em: `http://localhost:3000`.

---

## 📁 Estrutura de Diretórios Unificada

```
FINANCE/
├── .env.example                # Template de variáveis para Vercel & Supabase
├── SUPABASE_VERCEL_SETUP.md    # Guia detalhado de deploy na nuvem
├── supabase-schema.sql         # Script SQL pronto para o SQL Editor do Supabase
├── package.json                # Configuração Next.js 14 + Prisma Serverless
├── prisma/
│   ├── schema.prisma           # Modelos (User, Account, Category, Transaction)
│   └── seed.ts                 # Script de seed CLI
└── src/
    ├── app/
    │   ├── api/                # Rotas de API Serverless nativas da Vercel
    │   │   ├── accounts/
    │   │   ├── categories/
    │   │   ├── reports/
    │   │   │   ├── dre/
    │   │   │   └── overview/
    │   │   ├── seed/
    │   │   └── transactions/
    │   ├── layout.tsx
    │   ├── page.tsx            # Dashboard Executivo
    │   └── globals.css
    ├── components/             # Componentes React
    │   ├── Header.tsx
    │   ├── MetricCard.tsx
    │   ├── DreTable.tsx
    │   ├── QuickTransactionForm.tsx
    │   └── TransactionsList.tsx
    ├── lib/
    │   ├── prisma.ts           # Instância singleton Prisma para Serverless
    │   └── services/           # Regras de negócio contábeis e de relatórios
    ├── services/
    │   └── api.ts              # Cliente HTTP para as rotas /api
    └── types/
        └── finance.ts          # Tipagem TypeScript compartilhada
```
