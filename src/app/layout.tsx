
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&display=swap" rel="stylesheet" />
        <Script 
          src="https://yandex.ru/games/sdk/v2" 
          strategy="beforeInteractive"
        />
      </head>
      <body className="font-body antialiased selection:bg-primary/30">
        <LanguageProvider>
          <YandexGamesProvider>
            {children}
          </YandexGamesProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
