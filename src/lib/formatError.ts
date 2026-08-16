export function formatDatabaseError(error: any): string {
  const msg = error?.message || String(error || '');
  const code = error?.code || '';

  // PgBouncer Pooler sem ?pgbouncer=true
  if (msg.includes('prepared statement') && msg.includes('already exists')) {
    return 'Erro de PgBouncer: Adicione ?pgbouncer=true no final da DATABASE_URL nas variáveis da Vercel (ex: ...:6543/postgres?pgbouncer=true) e faça um Redeploy.';
  }

  // Falha de autenticação (senha incorreta ou caracteres especiais não encodados)
  if (code === 'P1000' || msg.includes('Authentication failed') || msg.includes('password authentication failed')) {
    return 'Falha de autenticação no Supabase: A senha do banco de dados na DATABASE_URL está incorreta ou contém caracteres especiais (@, #, $, %, etc.) que precisam estar em URL Encode (ex: @ -> %40). Após ajustar, faça um Redeploy na Vercel.';
  }

  // Falha de conexão / Host inacessível / Projeto Supabase pausado
  if (code === 'P1001' || msg.includes("Can't reach database server") || msg.includes('timed out')) {
    return 'Não foi possível conectar ao Supabase: Verifique se o projeto não está Pausado no Supabase e se o host/porta (6543) estão corretos nas variáveis de ambiente.';
  }

  // Tabelas ainda não criadas no Supabase (P2021 ou relação inexistente)
  if (
    code === 'P2021' ||
    msg.includes('does not exist') ||
    msg.includes('relation') && msg.includes('does not exist') ||
    msg.includes('Table') && msg.includes('does not exist')
  ) {
    return 'Tabelas não criadas no Supabase: As tabelas do banco ainda não foram criadas. Abra o SQL Editor no painel do Supabase, cole o conteúdo de "supabase-schema.sql" e clique em "Run" (ou rode "npx prisma db push").';
  }

  // Formato inválido da URL do datasource
  if (
    msg.includes('Error validating datasource') ||
    msg.includes('must start with the protocol') ||
    msg.includes('the URL must start with')
  ) {
    return 'Formato inválido na DATABASE_URL: Verifique se a URL não contém aspas (""), se começa com postgresql:// e se caracteres especiais na senha foram codificados (URL-encoded). Após salvar na Vercel, faça um Redeploy.';
  }

  // Registro ou plano de contas não inicializado
  if (code === 'P2025' || msg.includes('não encontrada') || msg.includes('Record to update not found')) {
    return 'Plano de contas não inicializado: Clique no botão "⚡ Inicializar Categorias Padrão" para criar as contas e categorias no Supabase.';
  }

  // Mensagem genérica com menção a DATABASE_URL
  if (msg.includes('DATABASE_URL') || msg.includes('Environment variable not found')) {
    return 'Banco de Dados não configurado: A variável DATABASE_URL não foi definida na Vercel (ou no arquivo .env local). Após adicionar as variáveis na Vercel, vá em "Deployments" -> (...) -> "Redeploy" para aplicar.';
  }

  return msg || 'Erro ao processar requisição no banco de dados.';
}


