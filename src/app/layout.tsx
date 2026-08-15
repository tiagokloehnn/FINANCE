import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Finance CFO | Gestão Financeira Pessoal com Governança Corporativa',
  description: 'Controle de finanças pessoais utilizando metodologias corporativas: DRE em cascata, Liquidez Corrente e Runway de sobrevivência.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#070b12',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark overflow-x-hidden">
      <body className="antialiased selection:bg-cyan-500 selection:text-white overflow-x-hidden min-h-screen">
        <div className="relative min-h-screen flex flex-col w-full overflow-x-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}
