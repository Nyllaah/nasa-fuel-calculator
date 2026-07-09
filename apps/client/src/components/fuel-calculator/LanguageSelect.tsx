import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { LOCALES, type Locale } from '@/constants/ui'
import { useLocale } from '@/context/LocaleContext'
import { cn } from '@/lib/utils'

function LanguageSelect() {
  const { locale, setLocale, ui } = useLocale()
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  return (
    <div ref={containerRef} className="fc-lang-select">
      <button
        type="button"
        className="fc-lang-trigger"
        aria-label={ui.LANGUAGE}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((previous) => !previous)}
      >
        <span className="fc-lang-label">{ui.LANGUAGE}</span>
        <span className="fc-lang-value">{LOCALES[locale].label}</span>
        <ChevronDown size={14} className={cn('fc-lang-chevron', open && 'fc-lang-chevron-open')} />
      </button>

      {open && (
        <ul className="fc-lang-menu" role="listbox" aria-label={ui.LANGUAGE}>
          {(Object.entries(LOCALES) as [Locale, (typeof LOCALES)[Locale]][]).map(
            ([code, { label }]) => (
              <li key={code} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={code === locale}
                  className={cn('fc-lang-option', code === locale && 'fc-lang-option-active')}
                  onClick={() => {
                    setLocale(code)
                    setOpen(false)
                  }}
                >
                  {label}
                </button>
              </li>
            ),
          )}
        </ul>
      )}
    </div>
  )
}

export { LanguageSelect }
