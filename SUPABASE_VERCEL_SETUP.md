# 🚀 Guia de Implantação 100% Vercel + Supabase (Zero Servidor Local)

Este guia orienta o passo a passo para colocar a aplicação de Gestão Financeira Pessoal (DRE, Liquidez e Runway) no ar, utilizando **exclusivamente a nuvem gratuita da Vercel e do Supabase**.

---

## 📋 Passo 1: Criar o Projeto no Supabase

1. Acesse **[supabase.com](https://supabase.com)** e crie uma conta gratuita (ou faça login).
2. Clique em **"New Project"**.
3. Escolha uma organização, defina um nome (ex: `finance-cfo`), escolha uma senha forte para o banco de dados (guarde essa senha!) e selecione uma região (ex: `São Paulo - South America (sa-east-1)`).
4. Clique em **"Create new project"** e aguarde 1 minuto enquanto o banco é provisionado.

---

## 🔑 Passo 2: Obter as Strings de Conexão do Supabase

No painel do seu projeto no Supabase:
1. Vá em **Project Settings** (ícone de engrenagem no menu lateral) $\rightarrow$ **Database**.
2. Role até a seção **Connection string** e clique na aba **URI**:
   - **Para `DATABASE_URL` (Connection Pooler / Modo Transaction)**:
     - Marque a opção **Mode: Transaction** e **Port: 6543**.
     - Copie a URI. Ela terá o formato:
       ```
       postgresql://postgres.[SEU-PROJECT-REF]:[SUA-SENHA]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
       ```
   - **Para `DIRECT_URL` (Direct Connection / Modo Session)**:
     - Marque a opção **Mode: Session** e **Port: 5432**.
     - Copie a URI. Ela terá o formato:
       ```
       postgresql://postgres.[SEU-PROJECT-REF]:[SUA-SENHA]@aws-0-sa-east-1.pooler.supabase.com:5432/postgres
       ```
   > 💡 *Substitua `[SUA-SENHA]` pela senha que você definiu ao criar o projeto.*

---

## 🗄️ Passo 3: Criar as Tabelas no Supabase (2 Opções)

Você pode criar as tabelas de duas formas super simples:

### Opção A (Direto pelo Navegador - Sem Terminal!):
1. No painel do Supabase, clique no menu **SQL Editor** na barra lateral.
2. Clique em **"New Query"**.
3. Copie todo o conteúdo do arquivo [`supabase-schema.sql`](file:///e:/PROJETOS/FINANCE/supabase-schema.sql) e cole no editor.
4. Clique em **"Run"** (ou Ctrl+Enter). Pronto! As tabelas `users`, `accounts`, `categories` e `transactions` foram criadas.

### Opção B (Via Terminal Local, se tiver Node instalado):
Crie um arquivo `.env` na raiz com as suas URLs do Supabase e rode:
```bash
npx prisma db push
```

---

## ▲ Passo 4: Deploy na Vercel

1. Suba este projeto para um repositório no seu **GitHub** (ex: `https://github.com/seu-usuario/finance-cfo`).
2. Acesse **[vercel.com](https://vercel.com)** e faça login com o GitHub.
3. Clique em **"Add New..."** $\rightarrow$ **"Project"**.
4. Importe o repositório do projeto.
5. A Vercel detectará automaticamente o framework como **Next.js**.
6. Na seção **Environment Variables**, adicione as duas variáveis:
   - `DATABASE_URL`: *(sua URL do pooler do Supabase com porta 6543)*
   - `DIRECT_URL`: *(sua URL direta do Supabase com porta 5432)*
7. Clique em **"Deploy"**!

---

## ⚡ Passo 5: Inicialização e Primeiro Acesso

1. Assim que a Vercel concluir a compilação, acesse o link gerado (ex: `https://seu-projeto.vercel.app`).
2. Ao abrir o painel pela primeira vez, você verá o banner de boas-vindas com o botão:
   **"⚡ Inicializar Categorias Padrão"**.
3. Clique nele! A aplicação criará instantaneamente o usuário mestre, as contas bancárias (Corrente, Reserva de Emergência, Investimentos) e o plano completo de categorias contábeis corporativas.
4. Pronto! O sistema está 100% operacional na nuvem, sem necessitar de nada rodando no seu computador.
