
import type {Metadata} from 'next';
import './globals.css';
import { LanguageProvider } from '@/components/LanguageContext';
import { YandexGamesProvider } from '@/components/YandexGamesContext';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'StackUp Frenzy',
  description: 'A hypercasual block-stacking challenge!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script 
          src="https://yandex.ru/games/sdk/v2" 
          strategy="beforeInteractive"
        />
      </head>
      <body className="antialiased selection:bg-primary/30 font-sans">
        <LanguageProvider>
          <YandexGamesProvider>
            {children}
          </YandexGamesProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
