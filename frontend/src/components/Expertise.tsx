import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import type { Expertise } from '../data'
import { useContent, useStrings } from '../lib/i18n'
import { IllustrationFor, Sparkles, BlobShape } from './Illustrations'
import { trackEvent } from '../lib/track'

export default function ExpertiseSection() {
  const ui = useStrings()
  const { expertises } = useContent()
  // guarda só a chave: se o idioma mudar com o modal aberto, ele mostra o texto do idioma novo
  const [activeKey, setActive] = useState<string | null>(null)
  const active = expertises.find((e) => e.key === activeKey) ?? null

  useEffect(() => {
    if (!activeKey) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setActive(null)
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [activeKey])

  return (
    <section id={ui.anchors.expertise} className="relative py-14 sm:py-32">
      <div className="absolute top-16 right-4 w-14 h-14 sm:w-20 sm:h-20 text-gold/40 pointer-events-none">
        <Sparkles className="w-full h-full" />
      </div>
      <div className="absolute bottom-20 left-2 w-24 h-14 text-jade/25 pointer-events-none hidden md:block">
        <BlobShape className="w-full h-full" />
      </div>

      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 sm:gap-6 mb-10 sm:mb-14">
          <div>
            <span className="block text-gold uppercase tracking-[0.4em] text-[11px] sm:text-xs mb-3">02</span>
            <h2 className="section-heading text-4xl sm:text-6xl text-cream">
              {ui.expertise.heading.lead} <span className="italic text-mint">{ui.expertise.heading.accent}</span>
            </h2>
          </div>
          <p className="text-cream/50 text-sm max-w-xs">
            {ui.expertise.hint}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {expertises.map((e, i) => (
            <motion.button
              key={e.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ delay: 0.06 * i, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
              onClick={() => {
                setActive(e.key)
                void trackEvent('expertise_open', { key: e.key })
              }}
              className="group relative text-left rounded-3xl border border-mint/15 bg-moss/40 sm:backdrop-blur p-5 sm:p-6 overflow-hidden hover:border-mint/40 transition"
            >
              <div
                className="absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl opacity-40 group-hover:opacity-80 transition"
                style={{ background: e.color }}
              />
              {/* no celular o desenho fica ao lado do título: o cartão cai de ~320 para ~200 px de altura */}
              <div className="relative flex items-start gap-4 sm:block">
                <div
                  className="relative shrink-0 w-[72px] h-[72px] sm:w-full sm:h-auto sm:aspect-square sm:max-w-[140px] sm:mb-4"
                  style={{ color: e.color }}
                >
                  <IllustrationFor kind={e.illustration} />
                </div>
                <div className="min-w-0">
                  <h3 className="section-heading text-xl sm:text-2xl text-cream">{e.title}</h3>
                  <p className="mt-2 text-sm text-cream/70 leading-relaxed">{e.short}</p>
                </div>
              </div>
              <div className="mt-3 sm:mt-4 flex flex-wrap gap-1.5">
                {e.keywords.slice(0, 3).map((k) => (
                  <span
                    key={k}
                    className="text-[11px] uppercase tracking-widest text-cream/70 border border-mint/25 px-2 py-1 rounded-full"
                  >
                    {k}
                  </span>
                ))}
              </div>
              <div className="mt-4 sm:mt-5 flex items-center gap-2 text-xs uppercase tracking-widest text-cream/50 group-hover:text-cream transition">
                <span>{ui.expertise.open}</span>
                <span className="w-6 h-px bg-cream/40 group-hover:w-10 transition-all" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>{active && <ExpertiseModal item={active} onClose={() => setActive(null)} />}</AnimatePresence>
    </section>
  )
}

function ExpertiseModal({ item, onClose }: { item: Expertise; onClose: () => void }) {
  const ui = useStrings()
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[80] bg-forest/90 backdrop-blur-xl grid place-items-center p-4"
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-4xl rounded-2xl sm:rounded-3xl border border-mint/20 bg-gradient-to-br from-pine to-forest overflow-hidden max-h-[88dvh] overflow-y-auto"
        onClick={(ev) => ev.stopPropagation()}
      >
        <div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl opacity-40"
          style={{ background: item.color }}
        />
        <button
          onClick={onClose}
          aria-label={ui.expertise.close}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-11 h-11 rounded-full border border-mint/25 text-cream/70 hover:bg-mint hover:text-forest transition grid place-items-center"
        >
          ✕
        </button>
        <div className="relative grid md:grid-cols-[220px_1fr] gap-6 sm:gap-8 p-6 sm:p-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="w-[140px] sm:w-[180px] mx-auto md:mx-0"
            style={{ color: item.color }}
          >
            <IllustrationFor kind={item.illustration} />
          </motion.div>
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="uppercase tracking-[0.35em] text-[11px] sm:text-xs mb-2 sm:mb-3"
              style={{ color: item.color }}
            >
              {ui.expertise.area}
            </motion.p>
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="section-heading text-3xl sm:text-5xl text-cream mb-4 sm:mb-6"
            >
              {item.title}
            </motion.h3>

            <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-cream/85 leading-relaxed">
              {item.paragraphs.map((p, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + i * 0.15, duration: 0.6 }}
                >
                  {p}
                </motion.p>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 sm:mt-8 flex flex-wrap gap-2"
            >
              {item.keywords.map((k) => (
                <span
                  key={k}
                  className="text-[11px] uppercase tracking-widest text-cream/80 border border-mint/25 px-3 py-1 rounded-full"
                >
                  {k}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
