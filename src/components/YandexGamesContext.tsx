'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLanguage } from './LanguageContext';

interface YandexGamesContextType {
  ysdk: any | null;
  isInitialized: boolean;
}

const YandexGamesContext = createContext<YandexGamesContextType>({
  ysdk: null,
  isInitialized: false,
});

export function YandexGamesProvider({ children }: { children: React.ReactNode }) {
  const [ysdk, setYsdk] = useState<any | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const { setLanguage } = useLanguage();

  useEffect(() => {
    const initYandex = async () => {
      try {
        // @ts-ignore
        if (typeof YaGames !== 'undefined') {
          // @ts-ignore
          const sdk = await YaGames.init();
          setYsdk(sdk);
          setIsInitialized(true);
          console.log('Yandex Games SDK initialized');

          // Sync language with Yandex settings
          const lang = sdk.environment.i18n.lang;
          if (lang === 'ru' || lang === 'en') {
            setLanguage(lang);
          }
        } else {
          console.warn('Yandex Games SDK script not found. Running in local mode.');
          setIsInitialized(true);
        }
      } catch (err) {
        console.error('Yandex Games SDK initialization failed:', err);
        setIsInitialized(true); // Proceed anyway to not block the game
      }
    };

    initYandex();
  }, [setLanguage]);

  return (
    <YandexGamesContext.Provider value={{ ysdk, isInitialized }}>
      {children}
    </YandexGamesContext.Provider>
  );
}

export const useYandexGames = () => useContext(YandexGamesContext);
