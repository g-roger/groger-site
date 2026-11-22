import { motion, useReducedMotion } from 'framer-motion'
import { useCallback, useState } from 'react'
import { useStrings } from '../lib/i18n'
import { useToquesSecretos } from '../lib/surpresa'
import { Mascot } from './Illustrations'
import Surprise from './Surprise'

export default function Hero() {
  const ui = useStrings()
  const t = ui.hero
  const reduzir = useReducedMotion()
  const [surpresa, setSurpresa] = useState(false)
  const abrir = useCallback(() => setSurpresa(true), [])
  const fechar = useCallback(() => setSurpresa(false), [])
  const toque = useToquesSecretos(abrir)
  const entrada = (delay = 0) => ({
    initial: { opacity: 0, y: reduzir ? 0 : 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduzir ? 0 : 0.7, delay: reduzir ? 0 : delay },
  })

  const retrato = (mobile: boolean) => (
    <motion.figure {...entrada(0.15)} className={`portrait-stage ${mobile ? 'portrait-mobile lg:hidden' : 'hidden lg:block'}`}>
      <div className="portrait-orbit" aria-hidden="true" />
      <div className="portrait-orbit portrait-orbit-inner" aria-hidden="true" />
      <div className="portrait-card">
        <div className="portrait-topline" aria-hidden="true">
          <span>GABRIEL ROGER</span>
          <span className="portrait-glyph">⌘</span>
        </div>
        <button
          type="button"
          data-testid={mobile ? 'retrato-mobile' : 'retrato-desktop'}
          onClick={toque}
          aria-label={t.portraitLabel}
          className="portrait-trigger select-none touch-manipulation"
        >
          <Mascot className="portrait-art w-full h-auto" />
        </button>
        <figcaption className="portrait-caption">
          <span className="portrait-caption-mark" aria-hidden="true">{'< / >'}</span>
          <span>{t.portraitCaption}</span>
        </figcaption>
      </div>
      <span className="portrait-tag portrait-tag-data" aria-hidden="true">{t.dataLabel}</span>
      <span className="portrait-tag portrait-tag-ai" aria-hidden="true">{t.aiLabel}</span>
    </motion.figure>
  )

  return (
    <section id="top" className="hero-shell relative overflow-hidden">
      <Surprise aberta={surpresa} onFechar={fechar} />
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-aurora" aria-hidden="true" />
      <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-6">
        <div className="hero-layout grid items-center gap-12 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
          <div className="hero-copy">
            <motion.p {...entrada()} className="hero-eyebrow font-mono">
              <span className="hero-eyebrow-line" aria-hidden="true" />
              {t.eyebrow}
            </motion.p>
            <motion.p {...entrada(0.05)} className="text-base sm:text-lg text-cream/75 mb-5">{t.greeting}</motion.p>
            <motion.h1 {...entrada(0.1)} className="section-heading hero-title text-cream">
              {t.titleLead}{' '}
              <span className="hero-title-accent">{t.titleAccent}</span>
            </motion.h1>
            <motion.p {...entrada(0.2)} className="mt-7 max-w-xl text-base sm:text-lg text-cream/75 leading-relaxed">
              {t.intro}
            </motion.p>
            <motion.div {...entrada(0.3)} className="mt-8 flex flex-wrap items-center gap-4 sm:gap-6">
              <a href={`#${ui.anchors.projects}`} className="hero-primary inline-flex min-h-[48px] items-center justify-center gap-3 rounded-xl px-6 py-3 text-sm font-semibold transition">
                <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="2.5" y="3" width="15" height="14" rx="3" /><path d="m8 7-3 3 3 3m4-6 3 3-3 3" /></svg>
                {t.seeProjects}
              </a>
              <a href={`#${ui.anchors.expertise}`} className="inline-flex items-center min-h-[44px] text-sm text-cream/80 hover:text-mint transition">
                {t.whatIDo}
              </a>
            </motion.div>
          </div>
          {retrato(false)}
          {retrato(true)}
        </div>
        <motion.div {...entrada(0.4)} className="hero-bottom">
          <p className="font-mono text-xs uppercase tracking-widest text-cream/50">{t.pathLabel}</p>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-4 sm:flex sm:flex-wrap sm:items-center sm:gap-x-6 text-cream/75 text-sm">
            {t.places.map((texto, i, todos) => (
              <li key={texto} className="flex items-center gap-4 sm:gap-6">
                <span>{texto}</span>
                {i < todos.length - 1 && <span className="hidden sm:block w-5 h-px bg-cream/20" />}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
      <a href={`#${ui.anchors.about}`} className="hero-scroll hidden sm:flex items-center gap-3 text-cream/50 text-xs font-mono">
        <span className="hero-scroll-line" aria-hidden="true" />
        <span>{t.scroll}</span>
      </a>
    </section>
  )
}
