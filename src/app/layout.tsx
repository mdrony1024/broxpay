import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Broxpay - Web3 Auto Exchange Wallet',
  description: 'Premium Web3 Auto-Exchange Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
        />
      </head>
      <body className="bg-slate-100 dark:bg-slate-950 min-h-screen m-0 p-0 select-none">
        {children}
      </body>
    </html>
  );
}
