import type { Metadata, Viewport } from 'next';
import { Baloo_2, Nunito } from 'next/font/google';
import './globals.css';
import { ThemeScript } from '@/components/theme-script';
import { ServiceWorkerRegister } from '@/components/service-worker-register';

const bodyFont = Nunito({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '600', '700']
});

const displayFont = Baloo_2({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '600', '700']
});

export const metadata: Metadata = {
  title: 'Camryn + Miles Forever',
  description: 'A cozy private timeline for Camryn and Miles.',
  applicationName: 'Camryn + Miles Forever',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Camryn + Miles Forever'
  }
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fff4ec' },
    { media: '(prefers-color-scheme: dark)', color: '#25181b' }
  ]
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bodyFont.variable} ${displayFont.variable} min-h-screen bg-paper text-ink antialiased`}>
        <ThemeScript />
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
