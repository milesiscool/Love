import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeScript } from '@/components/theme-script';
import { ServiceWorkerRegister } from '@/components/service-worker-register';

export const metadata: Metadata = {
  title: 'Love Timeline',
  description: 'A private day tracker for your relationship milestones.',
  applicationName: 'Love Timeline',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Love Timeline'
  }
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8f4ea' },
    { media: '(prefers-color-scheme: dark)', color: '#111312' }
  ]
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-paper text-ink antialiased">
        <ThemeScript />
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
