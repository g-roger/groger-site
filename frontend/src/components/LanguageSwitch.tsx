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
      // o contorno é desenhado por trás (before:) e é mais baixo que a área de toque de 44 px de cada opção,
      // para o seletor não pesar na barra do celular
      className="relative flex items-center text-[11px] font-medium uppercase tracking-widest before:absolute before:inset-x-1 before:inset-y-1.5 before:rounded-full before:border before:border-mint/25 before:pointer-events-none"
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
            className="group relative grid place-items-center min-w-[44px] min-h-[44px]"
          >
            <span
              className={`grid place-items-center w-[34px] h-7 rounded-full transition-colors ${
                ativo ? 'bg-mint text-forest' : 'text-cream/70 group-hover:text-cream'
              }`}
            >
              {l}
            </span>
          </a>
        )
      })}
    </div>
  )
}
