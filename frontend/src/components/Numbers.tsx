import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { ConcentricRings, Sparkles } from './Illustrations'

function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const mv = useMotionValue(0)
  const spring = useSpring(mv, { stiffness: 40, damping: 22 })
  const display = useTransform(spring, (n) => `${Math.round(n).toLocaleString('pt-BR')}${suffix}`)

  useEffect(() => {
    if (inView) mv.set(to)
  }, [inView, mv, to])

  return (
    <motion.span
      ref={ref}
      className="section-heading text-5xl sm:text-6xl text-cream"
    >
      <motion.span>{display}</motion.span>
    </motion.span>
  )
}

const items = [
  { n: 12, suffix: '+', label: 'anos de carreira em dados & software' },
  { n: 4, suffix: '', label: 'anos em risco/segurança no PagBank' },
  { n: 10, suffix: '+', label: 'grandes empresas treinadas (Santander, Itaú, IBM…)' },
  { n: 30, suffix: '+', label: 'mentorados em transição de carreira (Awari)' },
]

export default function Numbers() {
  return (
    <section className="relative py-24">
      <div className="absolute top-10 left-10 w-24 h-24 text-jade/40 pointer-events-none hidden md:block">
        <ConcentricRings className="w-full h-full" />
      </div>
      <div className="absolute bottom-10 right-8 w-32 h-32 text-gold/60 pointer-events-none hidden md:block">
        <Sparkles className="w-full h-full" />
      </div>
      <div className="mx-auto max-w-6xl px-6 grid grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((it, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: i * 0.1, duration: 0.7 }}
            className="rounded-2xl border border-mint/15 bg-moss/40 backdrop-blur p-6"
          >
            <Counter to={it.n} suffix={it.suffix} />
            <p className="mt-3 text-cream/70 text-xs uppercase tracking-widest leading-relaxed">
              {it.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
