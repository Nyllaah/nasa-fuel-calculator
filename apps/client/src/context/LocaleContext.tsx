import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { ClientErrors } from '@/constants/errors'
import { CLIENT_ERRORS } from '@/constants/errors'
import { DEFAULT_LOCALE, LOCALES, type Locale, type UiStrings } from '@/constants/ui'

const STORAGE_KEY = 'nasa-fuel-locale'

type LocaleContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  ui: UiStrings
  errors: ClientErrors
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

function readStoredLocale(): Locale {
  const stored = localStorage.getItem(STORAGE_KEY)

  if (stored === 'pt-BR' || stored === 'en') {
    return stored
  }

  return DEFAULT_LOCALE
}

function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readStoredLocale)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, locale)
    document.documentElement.lang = locale
  }, [locale])

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale: setLocaleState,
      ui: LOCALES[locale].ui,
      errors: CLIENT_ERRORS[locale],
    }),
    [locale],
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

function useLocale() {
  const context = useContext(LocaleContext)

  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider')
  }

  return context
}

export { LocaleProvider, useLocale }
