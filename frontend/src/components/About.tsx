import { motion } from 'framer-motion'
import { ArrowScribble, LeafSprig, Sparkles, ConcentricRings } from './Illustrations'

export default function About() {
  return (
    <section id="about" className="relative py-24 sm:py-32">
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
          <span className="block text-gold uppercase tracking-[0.4em] text-[10px] sm:text-xs mb-3">01</span>
          <h2 className="section-heading text-4xl sm:text-6xl text-cream">
            Sobre
            <br />
            <span className="italic text-mint">mim</span>
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
          <p>
            Sou <span className="text-cream">tech lead</span>, cientista e engenheiro de dados.
            Comecei em 2013 dando aula de informática, fui engenheiro de software sênior e, em
            2021, mudei para a área de dados. Desde então trabalho com{' '}
            <span className="text-cream">crédito e segurança de contas</span>.
          </p>
          <p>
            Na CERC sou tech lead e engenheiro de dados sênior. Atuo tanto em ciência quanto em
            engenharia de dados, em projetos de{' '}
            <span className="text-cream">arranjos de pagamento</span> que envolvem grandes clientes
            de crédito do Brasil. Faço análises e reports para esses clientes, modelagem sobre os
            dados da CERC, como duplicata e arranjos, e uso{' '}
            <span className="text-cream">agentes de IA</span> em projetos com LLM.
          </p>
          <p>
            Ensinar sempre fez parte do caminho. Dei aula no Grupo All Net, treinei equipes de
            empresas como Santander, Itaú, Facebook e IBM pela Mastertech, e fui instrutor e
            mentor de dados na Awari de 2022 a 2025.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
