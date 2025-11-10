import React, { ReactNode, useState } from "react";

export type Language = "en" | "es" | "fr" | "zh";

type LanguageProviderProps = {
  children: ReactNode;
};

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("en");

  return (
    <LanguageState.Provider value={{ selectedLanguage, setSelectedLanguage }}>
      {children}
    </LanguageState.Provider>
  );
}

const LanguageState = React.createContext<any>(null);

export function useLanguage() {
  const context = React.useContext(LanguageState);
  if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
}
