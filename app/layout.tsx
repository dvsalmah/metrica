import type { Metadata } from 'next';
import { Inter, Geist } from 'next/font/google';
import '@/app/globals.css';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/layout/theme-provider';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Metrica - Your Metrics Hub',
  description:
    'Metrica: Analyze Financial Metrics for your investment with real-time interactive charts.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cn('h-full', 'antialiased', inter.variable, 'font-sans', geist.variable)}>
      <body className="h-full bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          storageKey="metrica-theme"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
