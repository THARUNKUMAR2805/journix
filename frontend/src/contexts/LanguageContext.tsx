import { createContext, useContext, useState, ReactNode } from 'react';
import type { Language } from '../utils/i18n';
import { translate } from '../utils/i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(
    () => (localStorage.getItem('journix_lang') as Language) ?? 'en'
  );

  function setLanguage(lang: Language) {
    setLanguageState(lang);
    localStorage.setItem('journix_lang', lang);
  }

  function t(key: string): string {
    return translate(key, language);
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
