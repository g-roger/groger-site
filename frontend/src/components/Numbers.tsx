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

// Todos os números saem do currículo: 2013 (início no Grupo All Net), PagBank de 2021 a 2026,
// 7 empresas citadas nos treinamentos da Mastertech e Awari de 2022 a 2025.
const items = [
  { n: new Date().getFullYear() - 2013, suffix: '', label: 'anos de carreira, desde 2013' },
  { n: 5, suffix: '', label: 'anos no PagBank, de 2021 a 2026' },
  { n: 7, suffix: '+', label: 'empresas em que dei treinamento pela Mastertech' },
  { n: 3, suffix: '', label: 'anos como instrutor e mentor na Awari' },
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
      <div className="mx-auto max-w-6xl px-5 sm:px-6 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {items.map((it, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: i * 0.1, duration: 0.7 }}
            className="rounded-2xl border border-mint/15 bg-moss/40 backdrop-blur p-5 sm:p-6"
          >
            <Counter to={it.n} suffix={it.suffix} />
            <p className="mt-3 text-cream/70 text-[11px] sm:text-xs uppercase tracking-widest leading-relaxed">
              {it.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
