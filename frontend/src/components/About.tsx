import { motion } from 'framer-motion'
import { useStrings } from '../lib/i18n'
import Rich from './Rich'
import { ArrowScribble, LeafSprig, Sparkles, ConcentricRings } from './Illustrations'

export default function About() {
  const ui = useStrings()
  return (
    <section id={ui.anchors.about} className="relative py-14 sm:py-32">
      <div className="absolute top-10 right-4 w-14 h-20 sm:w-16 sm:h-24 text-jade/40 pointer-events-none">
        <LeafSprig className="w-full h-full" />
      </div>
      <div className="absolute bottom-10 left-4 w-14 h-14 text-gold/40 pointer-events-none hidden sm:block">
        <Sparkles className="w-full h-full" />
      </div>
      <div className="absolute top-1/2 -right-8 w-32 h-32 text-mint/15 pointer-events-none hidden lg:block">
        <ConcentricRings className="w-full h-full" />
      </div>

      <div className="mx-auto max-w-5xl px-5 sm:px-6 grid md:grid-cols-[auto_1fr] gap-8 md:gap-10 items-start">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7 }}
          className="md:sticky md:top-32"
        >
          <span className="block text-gold uppercase tracking-[0.4em] text-[11px] sm:text-xs mb-3">01</span>
          <h2 className="section-heading text-4xl sm:text-6xl text-cream">
            {ui.about.heading.lead}{' '}
            <br />
            <span className="italic text-mint">{ui.about.heading.accent}</span>
          </h2>
          <ArrowScribble className="mt-4 w-20 sm:w-24 h-10 text-cream/40" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9 }}
          className="space-y-5 sm:space-y-6 text-base sm:text-lg leading-relaxed text-cream/85 font-body"
        >
          {ui.about.paragraphs.map((texto, i) => (
            <p key={i}>
              <Rich text={texto} />
            </p>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
