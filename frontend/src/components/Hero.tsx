import { motion } from 'framer-motion'
import { useCallback, useState } from 'react'
import { useToquesSecretos } from '../lib/surpresa'
import { Mascot, StarBurst, ArrowScribble, LeafSprig, DotGrid, ConcentricRings, Sparkles, BlobShape } from './Illustrations'
import Surprise from './Surprise'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 * i, duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function Hero() {
  const [surpresa, setSurpresa] = useState(false)
  const abrir = useCallback(() => setSurpresa(true), [])
  const fechar = useCallback(() => setSurpresa(false), [])
  // 5 toques seguidos no retrato abrem a surpresa (celular e computador)
  const toque = useToquesSecretos(abrir)

  return (
    <section id="top" className="relative min-h-[100svh] pt-24 sm:pt-28 pb-16 overflow-hidden">
      <Surprise aberta={surpresa} onFechar={fechar} />
      <div className="absolute inset-0 paper-grain opacity-30 pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-[420px] sm:w-[520px] h-[420px] sm:h-[520px] rounded-full bg-jade/25 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -left-24 w-[320px] sm:w-[420px] h-[320px] sm:h-[420px] rounded-full bg-gold/10 blur-3xl pointer-events-none" />

      {/* decoração desktop */}
      <div className="absolute top-40 left-6 w-16 h-24 text-jade/40 pointer-events-none hidden md:block">
        <LeafSprig className="w-full h-full" />
      </div>
      <div className="absolute bottom-24 right-10 w-24 h-24 text-mint/25 pointer-events-none hidden md:block">
        <DotGrid className="w-full h-full" />
      </div>
      <div className="absolute top-32 right-1/3 w-16 h-16 text-gold/50 pointer-events-none hidden lg:block">
        <Sparkles className="w-full h-full" />
      </div>
      <div className="absolute top-1/2 right-4 w-20 h-20 text-mint/30 pointer-events-none hidden lg:block">
        <ConcentricRings className="w-full h-full" />
      </div>
      <div className="absolute bottom-8 left-1/3 w-16 h-8 text-jade/30 pointer-events-none hidden lg:block">
        <BlobShape className="w-full h-full" />
      </div>

      <div className="relative mx-auto max-w-6xl px-5 sm:px-6 grid lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-12 items-center">
        {/* no mobile o retrato aparece antes do texto, menor */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: -4 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-40 sm:w-52 lg:hidden"
        >
          <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-jade/40 via-mint/10 to-forest/40 blur-2xl" />
          <div
            data-testid="retrato-mobile"
            onClick={toque}
            className="relative rounded-[1.5rem] border border-mint/20 bg-forest/70 p-2 select-none touch-manipulation"
          >
            <Mascot className="w-full h-auto" />
          </div>
          <StarBurst className="absolute -top-3 -right-3 w-10 h-10 text-gold" />
        </motion.div>

        <div>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0}
            className="uppercase tracking-[0.3em] text-[11px] sm:text-xs text-gold mb-4 sm:mb-6"
          >
            Olá, eu sou o Gabriel
          </motion.p>
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="section-heading text-balance text-[12.5vw] sm:text-[7vw] lg:text-[5.25rem] text-cream"
          >
            Tech lead,{' '}
            <span className="text-mint italic font-normal">cientista e engenheiro de dados.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="mt-6 sm:mt-8 max-w-xl text-base sm:text-lg text-cream/80 leading-relaxed"
          >
            Hoje sou tech lead na CERC, em projetos de arranjos de pagamento e modelos de
            fraude. Antes passei cinco anos no PagBank, com segurança de contas e modelos de
            crédito.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
            className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4"
          >
            <a
              href="#projetos"
              className="group inline-flex items-center gap-3 rounded-full bg-jade text-cream px-6 py-3 text-sm font-medium hover:bg-jade/90 transition"
            >
              Ver projetos
              <span className="w-6 h-px bg-cream group-hover:w-10 transition-all" />
            </a>
            <a
              href="#expertise"
              className="inline-flex items-center gap-2 min-h-[44px] text-sm text-cream/70 hover:text-cream transition"
            >
              <span className="w-8 h-px bg-cream/40" />
              O que eu faço
            </a>
          </motion.div>

          {/* no celular vira uma grade 2x2 sem traços soltos; do sm em diante, uma linha com divisores */}
          <motion.ul
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={4}
            className="mt-10 sm:mt-14 grid grid-cols-2 gap-x-4 gap-y-3 sm:flex sm:flex-wrap sm:items-center sm:gap-x-6 text-cream/55 text-[11px] sm:text-xs uppercase tracking-widest"
          >
            {['Tech lead na CERC', 'PagBank', 'Mastertech', 'MBA na FIAP'].map((texto, i, todos) => (
              <li key={texto} className="flex items-center gap-4 sm:gap-6">
                <span>{texto}</span>
                {i < todos.length - 1 && <span className="hidden sm:block w-8 h-px bg-cream/20" />}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* retrato no desktop */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: -4 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-sm hidden lg:block"
        >
          <div className="relative">
            <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-jade/30 via-mint/10 to-forest/40 blur-2xl" />
            <div
              data-testid="retrato-desktop"
              onClick={toque}
              className="relative rounded-[2rem] border border-mint/20 bg-forest/70 p-4 sm:backdrop-blur select-none touch-manipulation"
            >
              <Mascot className="w-full h-auto animate-floaty" />
            </div>
            <StarBurst className="absolute -top-6 -right-6 w-16 h-16 text-gold" />
            <div className="absolute -bottom-8 -right-4 w-20 h-20 text-mint/60">
              <ConcentricRings className="w-full h-full" />
            </div>
          </div>
          <div className="absolute -bottom-6 -left-6 text-cream/60 flex items-center gap-2">
            <ArrowScribble className="w-16 h-8 text-mint" />
            <span className="text-xs italic font-display">eu, em desenho</span>
          </div>
        </motion.div>
      </div>

      {/* no celular o hero já é mais alto que a tela, então o aviso só atrapalharia */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center text-cream/40 text-xs">
        <span className="uppercase tracking-[0.4em]">rolar</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          className="mt-2 w-px h-6 sm:h-8 bg-cream/40"
        />
      </div>
    </section>
  )
}
