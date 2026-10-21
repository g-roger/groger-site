import type { MouseEvent } from 'react'
import { LANGS, pathFor, useLang, useOnSwitchLang, useStrings, type Lang } from '../lib/i18n'
import { trackEvent } from '../lib/track'

/**
 * PT | EN no topo da página. São links de verdade (/ e /en): abrem em nova aba, funcionam
 * sem JavaScript e podem ser copiados. Num clique normal a troca é feita sem recarregar,
 * para a pessoa continuar no ponto da página em que estava.
 */
export default function LanguageSwitch() {
  const lang = useLang()
  const ui = useStrings()
  const onSwitch = useOnSwitchLang()

  function escolher(e: MouseEvent<HTMLAnchorElement>, destino: Lang) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    if (!onSwitch) return
    e.preventDefault()
    if (destino === lang) return
    void trackEvent('language_switch', { to: destino })
    onSwitch(destino)
  }

  return (
    <div
      role="group"
      aria-label={ui.language.group}
      className="flex items-center rounded-full border border-mint/25 p-0.5 text-xs font-medium uppercase tracking-widest"
    >
      {LANGS.map((l) => {
        const ativo = l === lang
        return (
          <a
            key={l}
            href={pathFor(l)}
            lang={l === 'pt' ? 'pt-BR' : 'en'}
            hrefLang={l === 'pt' ? 'pt-BR' : 'en'}
            aria-label={ui.language[l]}
            aria-current={ativo ? 'true' : undefined}
            onClick={(e) => escolher(e, l)}
            className={`grid place-items-center min-w-[44px] min-h-[44px] rounded-full transition-colors ${
              ativo ? 'bg-mint text-forest' : 'text-cream/70 hover:text-cream'
            }`}
          >
            {l}
          </a>
        )
      })}
    </div>
  )
}
