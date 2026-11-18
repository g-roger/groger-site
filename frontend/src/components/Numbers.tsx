import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { useContent, useStrings } from '../lib/i18n'
import { ConcentricRings, Sparkles } from './Illustrations'

function Counter({ to, suffix = '', locale }: { to: number; suffix?: string; locale: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const mv = useMotionValue(0)
  const spring = useSpring(mv, { stiffness: 40, damping: 22 })
  const display = useTransform(spring, (n) => `${Math.round(n).toLocaleString(locale)}${suffix}`)

  useEffect(() => {
    if (inView) mv.set(to)
  }, [inView, mv, to])

  return (
    <motion.span
      ref={ref}
      className="section-heading text-[2.6rem] sm:text-6xl text-cream"
    >
      <motion.span>{display}</motion.span>
    </motion.span>
  )
}

export default function Numbers() {
  const { careerStats } = useContent()
  const { numbersLocale } = useStrings()
  const items = careerStats()

  return (
    <section className="relative py-8 sm:py-24">
      <div className="absolute top-10 left-10 w-24 h-24 text-jade/40 pointer-events-none hidden md:block">
        <ConcentricRings className="w-full h-full" />
      </div>
      <div className="absolute bottom-10 right-8 w-32 h-32 text-gold/60 pointer-events-none hidden md:block">
        <Sparkles className="w-full h-full" />
      </div>
      <div className="mx-auto max-w-6xl px-5 sm:px-6 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {items.map((it, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: (i % 2) * 0.08, duration: 0.6 }}
            className="rounded-2xl border border-mint/15 bg-moss/40 sm:backdrop-blur p-4 sm:p-6"
          >
            <Counter to={it.n} suffix={it.suffix} locale={numbersLocale} />
            <p className="mt-2 sm:mt-3 text-cream/70 text-[13px] leading-snug sm:text-xs sm:uppercase sm:tracking-widest sm:leading-relaxed">
              {it.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
