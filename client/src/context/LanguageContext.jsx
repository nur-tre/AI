import React, { createContext, useContext, useEffect, useState } from 'react';
import { translations } from '../translations/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('eduai_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('eduai_lang', lang);
  }, [lang]);

  const t = (key) => {
    if (translations[lang] && translations[lang][key] !== undefined) {
      return translations[lang][key];
    }
    // Fallback to English
    if (translations.en && translations.en[key] !== undefined) {
      return translations.en[key];
    }
    return key;
  };

  const changeLanguage = (newLang) => {
    if (['en', 'uz', 'ru'].includes(newLang)) {
      setLang(newLang);
    }
  };

  return (
    <LanguageContext.Provider value={{ lang, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
