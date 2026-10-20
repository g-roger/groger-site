import { motion } from 'framer-motion'
import { timeline } from '../data'
import { BarChart, LeafSprig, Sparkles } from './Illustrations'

export default function TimelineSection() {
  return (
    <section id="trajetoria" className="relative py-24 sm:py-32">
      <div className="absolute top-24 right-4 w-16 h-24 sm:w-20 sm:h-32 text-jade/30 pointer-events-none">
        <LeafSprig className="w-full h-full" />
      </div>
      <div className="absolute bottom-40 left-2 w-24 h-16 text-gold/40 pointer-events-none hidden md:block">
        <BarChart className="w-full h-full" />
      </div>
      <div className="absolute top-1/3 right-6 w-16 h-16 text-mint/35 pointer-events-none hidden lg:block">
        <Sparkles className="w-full h-full" />
      </div>

      <div className="mx-auto max-w-5xl px-5 sm:px-6">
        <div className="mb-10 sm:mb-14 max-w-2xl">
          <span className="block text-gold uppercase tracking-[0.4em] text-[10px] sm:text-xs mb-3">04</span>
          <h2 className="section-heading text-4xl sm:text-6xl text-cream">
            Minha <span className="italic text-mint">trajetória</span>
          </h2>
          <p className="mt-4 sm:mt-5 text-cream/60 text-sm sm:text-base">
            Onde trabalhei e o que fiz em cada lugar.
          </p>
        </div>

        <div className="relative pl-6 sm:pl-14">
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: 'top' }}
            className="absolute left-1.5 sm:left-4 top-0 bottom-0 w-px bg-gradient-to-b from-mint via-jade to-transparent"
          />

          <div className="space-y-10 sm:space-y-14">
            {timeline.map((t, i) => (
              <motion.article
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.7, delay: i * 0.05 }}
                className="relative rounded-2xl border border-mint/15 bg-moss/40 backdrop-blur p-5 sm:p-8"
              >
                <div className="absolute -left-6 sm:-left-14 top-6 sm:top-8 w-4 sm:w-5 h-4 sm:h-5 rounded-full bg-mint border-2 sm:border-4 border-forest shadow-[0_0_0_3px_rgba(63,122,91,0.35)]" />
                <div className="flex flex-wrap items-baseline gap-2 sm:gap-3 mb-2">
                  <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-gold">{t.period}</p>
                  <span className="hidden sm:inline-block w-4 h-px bg-cream/30 self-center" />
                  <p className="text-[10px] sm:text-xs uppercase tracking-widest text-cream/50">{t.place}</p>
                </div>
                <h3 className="text-xl sm:text-3xl font-display text-cream">{t.role}</h3>
                <p className="mt-2 sm:mt-3 text-sm sm:text-base text-cream/80 leading-relaxed">{t.detail}</p>
                {t.bullets && t.bullets.length > 0 && (
                  <ul className="mt-3 sm:mt-4 grid sm:grid-cols-2 gap-x-6 gap-y-2 text-cream/70 text-xs sm:text-sm">
                    {t.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <span className="mt-1.5 sm:mt-2 w-1.5 h-1.5 rounded-full bg-jade shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {t.clients && t.clients.length > 0 && (
                  <div className="mt-5">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-gold/80 mb-2">
                      Clientes e parceiros
                    </p>
                    <ul className="flex flex-wrap gap-1.5">
                      {t.clients.map((c) => (
                        <li
                          key={c}
                          className="text-xs text-cream/90 bg-forest/60 border border-gold/25 px-2.5 py-1 rounded-full"
                        >
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {t.tags && t.tags.length > 0 && (
                  <div className="mt-4 sm:mt-5 flex flex-wrap gap-1.5">
                    {t.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] uppercase tracking-widest text-cream/70 border border-mint/20 px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
