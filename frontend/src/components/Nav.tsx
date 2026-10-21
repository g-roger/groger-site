import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import { useStrings } from '../lib/i18n'
import type { Strings } from '../strings'
import LanguageSwitch from './LanguageSwitch'

// na ordem em que as seções aparecem na página
const SECOES = ['about', 'expertise', 'stack', 'career', 'projects', 'contact'] as const

export function navLinks(ui: Strings) {
  return SECOES.map((k) => ({ href: `#${ui.anchors[k]}`, label: ui.nav.links[k] }))
}

// largura a partir da qual o menu de links aparece direto na barra (classe md do Tailwind)
const LARGURA_MENU_FIXO = 768

export default function Nav() {
  const ui = useStrings()
  const links = navLinks(ui)
  const [aberto, setAberto] = useState(false)
  const fechar = useCallback(() => setAberto(false), [])

  useEffect(() => {
    if (!aberto) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setAberto(false)
    const onResize = () => window.innerWidth >= LARGURA_MENU_FIXO && setAberto(false)
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [aberto])

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-forest/70 border-b border-mint/10 pt-[env(safe-area-inset-top)]"
      >
        <div className="mx-auto max-w-6xl pl-[max(1.25rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))] sm:px-6 h-16 flex items-center justify-between">
          <a href="#top" onClick={fechar} className="flex items-center gap-2 group min-h-[44px] min-w-[44px]">
            <span className="text-2xl font-display font-bold tracking-tight text-mint">g·r</span>
            {/* só a partir de xl: abaixo disso o texto encosta nos links e no seletor de idioma */}
            <span className="text-xs uppercase tracking-[0.3em] text-cream/50 whitespace-nowrap hidden xl:inline">
              {ui.nav.brandRole}
            </span>
          </a>

          <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
            <nav aria-label={ui.nav.sections} className="hidden md:flex items-center gap-3">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="relative px-2 py-1 text-sm text-cream/70 hover:text-cream transition-colors"
                >
                  {l.label}
                </a>
              ))}
            </nav>

            <LanguageSwitch />

            <button
              type="button"
              className="md:hidden -mr-2 w-12 h-12 grid place-items-center rounded-full text-cream"
              aria-label={aberto ? ui.nav.closeMenu : ui.nav.openMenu}
              aria-expanded={aberto}
              aria-controls="menu-celular"
              onClick={() => setAberto((v) => !v)}
            >
              <span className="relative block w-6 h-[18px]" aria-hidden>
                <span
                  className={`absolute left-0 w-6 h-0.5 rounded bg-current transition-all duration-300 ${
                    aberto ? 'top-2 rotate-45' : 'top-0'
                  }`}
                />
                <span
                  className={`absolute left-0 top-2 w-6 h-0.5 rounded bg-current transition-opacity duration-200 ${
                    aberto ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                <span
                  className={`absolute left-0 w-6 h-0.5 rounded bg-current transition-all duration-300 ${
                    aberto ? 'top-2 -rotate-45' : 'top-4'
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {aberto && (
          <motion.nav
            id="menu-celular"
            aria-label={ui.nav.menu}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden fixed inset-0 z-40 bg-forest/95 backdrop-blur-xl pt-[calc(4rem+env(safe-area-inset-top))] pb-[env(safe-area-inset-bottom)] overflow-y-auto"
          >
            <ul className="px-5 pt-4">
              {links.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i + 0.05, duration: 0.35 }}
                  className="border-b border-mint/10"
                >
                  <a
                    href={l.href}
                    onClick={fechar}
                    className="flex items-baseline gap-4 min-h-[64px] py-4 font-display text-3xl text-cream active:text-mint"
                  >
                    <span className="font-body text-xs tracking-[0.3em] text-gold w-6">0{i + 1}</span>
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  )
}
