import { useState, useEffect } from 'react';

export type Language = 'en' | 'sv';

export const useLocalization = () => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    // Auto-detect language from browser or localStorage
    const savedLanguage = localStorage.getItem('klario-language') as Language;
    const browserLang = navigator.language.toLowerCase();
    
    if (savedLanguage) {
      setLanguage(savedLanguage);
    } else if (browserLang.includes('sv')) {
      setLanguage('sv');
    }
  }, []);

  const switchLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem('klario-language', newLanguage);
  };

  return {
    language,
    switchLanguage,
    isSwedish: language === 'sv'
  };
};