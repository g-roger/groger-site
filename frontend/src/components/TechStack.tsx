import { motion } from 'framer-motion'
import { techStack } from '../data'
import { CircuitLines, Chip, DotGrid, WaveScribble } from './Illustrations'

export default function TechStack() {
  return (
    <section id="stack" className="relative py-24 sm:py-32">
      <div className="absolute top-24 right-4 w-32 h-32 sm:w-40 sm:h-40 text-jade/20 pointer-events-none">
        <DotGrid className="w-full h-full" />
      </div>
      <div className="absolute bottom-20 left-4 w-24 h-24 sm:w-32 sm:h-32 text-mint/25 pointer-events-none hidden md:block">
        <CircuitLines className="w-full h-full" />
      </div>
      <div className="absolute top-1/2 right-2 w-16 h-16 text-gold/30 pointer-events-none hidden lg:block">
        <Chip className="w-full h-full" />
      </div>

      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="mb-10 sm:mb-14 max-w-2xl">
          <span className="block text-gold uppercase tracking-[0.4em] text-[10px] sm:text-xs mb-3">03</span>
          <h2 className="section-heading text-4xl sm:text-6xl text-cream">
            O que eu <span className="italic text-mint">uso</span>
          </h2>
          <WaveScribble className="mt-4 w-32 sm:w-40 text-jade" />
          <p className="mt-4 sm:mt-5 text-cream/60 text-sm sm:text-base">
            Linguagens, bibliotecas e plataformas com as quais trabalho, separadas por área.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {techStack.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ delay: i * 0.05, duration: 0.6 }}
              whileHover={{ y: -4 }}
              className="relative rounded-2xl border border-mint/15 bg-moss/40 backdrop-blur p-5 overflow-hidden"
            >
              <div
                className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-30"
                style={{ background: cat.color }}
              />
              <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: cat.color }} />
                  <h3 className="font-display text-lg text-cream">{cat.name}</h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {cat.items.map((item) => (
                    <span
                      key={item}
                      className="text-[11px] tracking-wide text-cream/85 bg-forest/50 border border-mint/15 px-2.5 py-1 rounded-full"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
