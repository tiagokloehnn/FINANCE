import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Finance CFO | Gestão Financeira Pessoal com Governança Corporativa',
  description: 'Controle de finanças pessoais utilizando metodologias corporativas: DRE em cascata, Liquidez Corrente e Runway de sobrevivência.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="antialiased selection:bg-cyan-500 selection:text-white">
        <div className="relative min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
