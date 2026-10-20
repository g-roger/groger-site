import { motion } from 'framer-motion'
import { projects } from '../data'
import { trackEvent } from '../lib/track'
import { CircuitLines, Sparkles } from './Illustrations'

export default function Projects() {
  return (
    <section id="projetos" className="relative py-24 sm:py-32">
      <div className="absolute top-10 left-4 w-24 h-24 sm:w-32 sm:h-32 text-mint/20 pointer-events-none hidden sm:block">
        <CircuitLines className="w-full h-full" />
      </div>
      <div className="absolute bottom-20 right-4 w-16 h-16 sm:w-24 sm:h-24 text-gold/40 pointer-events-none">
        <Sparkles className="w-full h-full" />
      </div>

      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="mb-10 sm:mb-14 max-w-2xl">
          <span className="block text-gold uppercase tracking-[0.4em] text-[10px] sm:text-xs mb-3">05</span>
          <h2 className="section-heading text-4xl sm:text-6xl text-cream">
            Alguns <span className="italic text-mint">projetos</span>
          </h2>
          <p className="mt-4 text-cream/60 text-sm sm:text-base">
            A maior parte do que faço no trabalho é privada. Estes são os projetos que posso mostrar.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {projects.map((p, i) => {
            const Card = p.url ? 'a' : 'div'
            const cardProps: any = p.url
              ? {
                  href: p.url,
                  target: '_blank',
                  rel: 'noopener noreferrer',
                  onClick: () => void trackEvent('project_click', { name: p.name, url: p.url }),
                }
              : {}
            return (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ delay: i * 0.05, duration: 0.6 }}
                whileHover={{ y: -4 }}
              >
                <Card
                  {...cardProps}
                  className="group block h-full rounded-2xl border border-mint/15 bg-moss/40 backdrop-blur p-5 sm:p-6 hover:border-mint/40 hover:bg-moss/60 transition relative overflow-hidden"
                >
                  <div className="absolute -top-14 -right-14 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-50 transition bg-jade" />
                  <div className="relative">
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="font-mono text-cream text-base sm:text-lg leading-tight">{p.name}</h4>
                      {p.url && <span className="text-cream/60 text-xl leading-none">↗</span>}
                    </div>
                    <p className="mt-1 text-sm text-gold/90 italic">{p.tagline}</p>
                    <p className="mt-3 sm:mt-4 text-sm text-cream/75 leading-relaxed">{p.description}</p>
                    <div className="mt-4 sm:mt-5 flex flex-wrap items-center gap-1.5">
                      {p.year && (
                        <span className="text-[10px] uppercase tracking-widest text-mint border border-mint/30 px-2 py-1 rounded-full">
                          {p.year}
                        </span>
                      )}
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] uppercase tracking-widest text-cream/70 border border-mint/15 px-2 py-1 rounded-full"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
