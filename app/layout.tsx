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
  title: 'Metrica',
  description: 'Metrica is a modern web application for data analysis and visualization.',
  openGraph: {
    title: 'Metrica | Financial Metric Visualizer',
    description: 'Metrica is a modern web application for data analysis and visualization.',
    images: 'preview-1.png',
    siteName: 'Metrica',
    type: 'website',
  },
  icons: {
    icon: '/favicon.ico',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Metrica | Financial Metric Visualizer',
    description: 'Metrica is a modern web application for data analysis and visualization.',
    images: 'preview-1.png',
  },
  category: 'Finance',
  classification: 'Finance',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn('h-full', 'antialiased', inter.variable, 'font-sans', geist.variable)}>
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
