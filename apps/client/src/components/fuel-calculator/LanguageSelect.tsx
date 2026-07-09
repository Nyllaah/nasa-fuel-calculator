import { LOCALES, type Locale } from '@/constants/ui'
import { useLocale } from '@/context/LocaleContext'

function LanguageSelect() {
  const { locale, setLocale, ui } = useLocale()

  return (
    <label className="fc-lang-select">
      <span className="fc-lang-label">{ui.LANGUAGE}</span>
      <select
        value={locale}
        onChange={(event) => setLocale(event.target.value as Locale)}
        className="fc-lang-dropdown"
        aria-label={ui.LANGUAGE}
      >
        {(Object.entries(LOCALES) as [Locale, (typeof LOCALES)[Locale]][]).map(
          ([code, { label }]) => (
            <option key={code} value={code}>
              {label}
            </option>
          ),
        )}
      </select>
    </label>
  )
}

export { LanguageSelect }
