import { motion } from 'framer-motion'
import { useStrings } from '../lib/i18n'
import Rich from './Rich'

export default function About() {
  const ui = useStrings()
  const t = ui.about
  return (
    <section id={ui.anchors.about} className="about-shell relative py-16 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.1 }}>
          <p className="section-kicker">{t.eyebrow}</p>
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
            <div>
              <h2 className="section-heading text-4xl sm:text-6xl text-cream">
                {t.heading.lead}{' '}<span className="text-mint">{t.heading.accent}</span>
              </h2>
              <p className="about-statement mt-6 text-2xl sm:text-3xl leading-snug text-cream/90">{t.statement}</p>
              <div className="about-signature mt-8 font-mono text-sm text-mint" aria-hidden="true">Gabriel Roger<span>_</span></div>
            </div>
            <div className="about-narrative">
              <div className="about-current">
                <h3 className="font-mono text-sm text-mint mb-4">{t.currentLabel}</h3>
                <p className="text-base sm:text-lg leading-relaxed text-cream/80"><Rich text={t.paragraphs[1]} /></p>
              </div>
              <div className="about-teaching">
                <h3 className="font-mono text-sm text-mint mb-4">{t.teachingLabel}</h3>
                <p className="text-base sm:text-lg leading-relaxed text-cream/75"><Rich text={t.paragraphs[3]} /></p>
              </div>
              <details className="about-story">
                <summary className="flex items-center justify-between gap-4 text-base font-medium text-cream">
                  {t.storyLabel}<span className="story-plus text-mint text-2xl" aria-hidden="true">+</span>
                </summary>
                <div className="space-y-5 pt-6 text-base leading-relaxed text-cream/75">
                  <p><Rich text={t.paragraphs[0]} /></p>
                  <p><Rich text={t.paragraphs[2]} /></p>
                </div>
              </details>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
