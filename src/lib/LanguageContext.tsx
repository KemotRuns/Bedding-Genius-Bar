import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Lang } from './i18n'

interface LangCtx {
  lang: Lang
  setLang: (l: Lang) => void
}

const LanguageContext = createContext<LangCtx>({ lang: 'en', setLang: () => {} })

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const s = localStorage.getItem('tn_lang')
      return s === 'zh' ? 'zh' : 'en'
    } catch {
      return 'en'
    }
  })

  function setLang(l: Lang) {
    setLangState(l)
    try { localStorage.setItem('tn_lang', l) } catch { /* noop */ }
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  return useContext(LanguageContext)
}
