export function formatDatabaseError(error: any): string {
  const msg = error?.message || String(error || '');

  if (
    msg.includes('Error validating datasource') ||
    msg.includes('must start with the protocol') ||
    msg.includes('DATABASE_URL')
  ) {
    return 'Banco de Dados não configurado: A variável DATABASE_URL não foi definida na Vercel ou está em formato inválido. Acesse Settings -> Environment Variables na Vercel, configure a URI do Supabase (porta 6543) e faça um Redeploy.';
  }

  if (msg.includes('não encontrada') || msg.includes('Record to update not found')) {
    return 'Plano de contas não inicializado: Clique no botão "⚡ Inicializar Categorias Padrão" no topo do painel para criar as contas e categorias no Supabase.';
  }

  return msg || 'Erro ao processar requisição no banco de dados.';
}
