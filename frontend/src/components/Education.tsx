import { motion } from 'framer-motion'
import { useContent, useStrings } from '../lib/i18n'
import { GradCap, LeafSprig, Sparkles } from './Illustrations'

export default function Education() {
  const ui = useStrings()
  const t = ui.education
  const { degrees, courses, languages } = useContent()

  return (
    <section id={ui.anchors.education} className="relative py-14 sm:py-32">
      <div className="absolute top-16 right-4 w-14 h-14 sm:w-20 sm:h-20 text-gold/40 pointer-events-none">
        <Sparkles className="w-full h-full" />
      </div>
      <div className="absolute bottom-24 left-2 w-16 h-24 text-jade/30 pointer-events-none hidden md:block">
        <LeafSprig className="w-full h-full" />
      </div>

      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="mb-8 sm:mb-14 max-w-2xl">
          <h2 className="section-heading text-4xl sm:text-6xl text-cream">
            {t.heading.lead} <span className="italic text-mint">{t.heading.accent}</span>
          </h2>
          <p className="mt-4 sm:mt-5 text-cream/60 text-sm sm:text-base">{t.intro}</p>
        </div>

        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-4 sm:gap-6 items-start">
          {/* graduação e MBA */}
          <div className="space-y-4 sm:space-y-6">
            {degrees.map((d, i) => (
              <motion.article
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.6 }}
                className="relative overflow-hidden rounded-2xl border border-mint/15 bg-moss/40 sm:backdrop-blur p-5 sm:p-8"
              >
                <GradCap className="absolute -right-3 -top-2 w-24 sm:w-32 text-mint/15 pointer-events-none" />
                <p className="text-[11px] sm:text-xs uppercase tracking-[0.3em] text-gold">{d.period}</p>
                <h3 className="mt-2 font-display text-xl sm:text-3xl text-cream leading-tight pr-10">{d.title}</h3>
                <p className="mt-1.5 text-[11px] sm:text-xs uppercase tracking-widest text-cream/55">{d.school}</p>
                <p className="mt-3 sm:mt-4 text-sm sm:text-base text-cream/80 leading-relaxed">{d.detail}</p>
                {d.projects && d.projects.length > 0 && (
                  <div className="mt-4 sm:mt-5">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-gold/80 mb-2">{t.courseProjects}</p>
                    <ul className="flex flex-wrap gap-1.5">
                      {d.projects.map((nome) => (
                        <li
                          key={nome}
                          className="font-mono text-xs text-cream/90 bg-forest/60 border border-gold/25 px-2.5 py-1 rounded-full"
                        >
                          {nome}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.article>
            ))}
          </div>

          {/* cursos e idiomas */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl border border-mint/15 bg-moss/40 sm:backdrop-blur p-5 sm:p-8"
          >
            <h3 className="font-display text-xl sm:text-2xl text-cream">{t.courses}</h3>
            <ol className="mt-4 divide-y divide-mint/10">
              {courses.map((c) => (
                <li key={`${c.year}-${c.name}`} className="grid grid-cols-[3rem_1fr] gap-3 py-3 first:pt-0 last:pb-0">
                  <span className="font-mono text-xs text-gold pt-0.5">{c.year}</span>
                  <span>
                    <span className="block text-sm text-cream/90 leading-snug">{c.name}</span>
                    <span className="block mt-0.5 text-xs text-cream/50">{c.school}</span>
                  </span>
                </li>
              ))}
            </ol>

            <h3 className="mt-8 font-display text-xl sm:text-2xl text-cream">{t.languages}</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {languages.map((l) => (
                <li key={l.name} className="rounded-full border border-mint/25 px-3 py-1.5 text-sm">
                  <span className="text-cream">{l.name}</span> <span className="text-cream/55">{l.level}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
