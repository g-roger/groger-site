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
          <span className="block text-gold uppercase tracking-[0.4em] text-[10px] sm:text-xs mb-3">·01</span>
          <h2 className="section-heading text-4xl sm:text-6xl text-cream">
            Sobre
            <br />
            <span className="italic text-mint">mim.</span>
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
            Comecei minha vida técnica <span className="text-mint">ensinando informática</span> ainda adolescente,
            no Grupo All Net — Excel, hardware, lógica. Fui pra estágio de software na Ponte21 (C#, .NET),
            virei engenheiro back-end na <span className="text-cream">Mastertech</span>, e ali descobri
            duas coisas que me acompanham até hoje: <em>escrever software que outras pessoas usam</em> e{' '}
            <em>ensinar</em>.
          </p>
          <p>
            Na Mastertech, além dos produtos e sistemas internos, publiquei o SDK aberto{' '}
            <code className="text-mint">moip-sdk-python</code> e dei treinamentos in-company para
            times de <span className="text-cream">Santander, Itaú, Facebook (Estação Hack), IBM,
            Bayer, Icatu, Banco Omni</span> e outros.
          </p>
          <p>
            Depois vieram quatro anos no PagBank, primeiro como engenheiro de dados (pipelines de
            login, MFA, OTP e onboarding) e depois como cientista sênior, tocando modelos do{' '}
            <span className="text-cream">ciclo de crédito</span> (application, behavior, previsão
            de TPV) e da <span className="text-cream">segurança da conta</span> —{' '}
            biometria comportamental, device fingerprint, antifraude.
          </p>
          <p>
            Hoje sou <span className="text-cream">Engenheiro de Dados Sênior na CERC</span>. Atuo
            como profissional de dados ponta a ponta — ciência e engenharia — em torno de{' '}
            <span className="text-mint">arranjos de pagamento</span>, duplicata e demais ativos
            registrados na câmara. Toco projetos analíticos e de modelagem para grandes clientes de
            crédito do Brasil e aplico <span className="text-mint">agentes de IA / LLM</span> em
            análise e geração de reports.
          </p>
          <p>
            Em paralelo, fui instrutor e mentor na Awari por três anos, orientando dezenas de
            pessoas em transição para a área de dados.
          </p>
          <p className="text-cream/80 italic font-display text-lg sm:text-xl border-l-2 border-jade/50 pl-4">
            "Modelo bom é o que sobrevive à produção, ao drift e à conversa com o time de negócio."
          </p>
        </motion.div>
      </div>
    </section>
  )
}
