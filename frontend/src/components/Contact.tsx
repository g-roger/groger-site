import { motion } from 'framer-motion'
import { trackEvent } from '../lib/track'
import { WaveScribble } from './Illustrations'

export default function Contact() {
  return (
    <section id="contato" className="relative py-32">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="block text-gold uppercase tracking-[0.4em] text-xs mb-3"
        >
          ·07
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="section-heading text-5xl sm:text-7xl text-cream"
        >
          Vamos <span className="italic text-mint">conversar?</span>
        </motion.h2>
        <WaveScribble className="mt-6 w-56 mx-auto text-jade" />
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="mt-6 text-cream/70 text-lg max-w-xl mx-auto"
        >
          Se você trabalha com crédito, segurança ou dados — ou tá pensando em contratar, ensinar
          junto ou só bater papo — o LinkedIn é o canal.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-12 inline-flex flex-col sm:flex-row items-center gap-6"
        >
          <a
            href="https://www.linkedin.com/in/gabriel-roger"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => void trackEvent('contact_click', { channel: 'linkedin' })}
            className="group inline-flex items-center gap-4 rounded-full bg-cream text-forest px-8 py-4 font-medium hover:bg-mint hover:text-forest transition"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden>
              <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.24 8h4.52V24H.24V8zm7.4 0h4.34v2.19h.06c.6-1.14 2.07-2.34 4.26-2.34 4.56 0 5.4 3 5.4 6.9V24h-4.52v-7.13c0-1.7-.03-3.89-2.37-3.89-2.37 0-2.73 1.85-2.73 3.77V24H7.64V8z" />
            </svg>
            linkedin.com/in/gabriel-roger
            <span className="w-6 h-px bg-current group-hover:w-10 transition-all" />
          </a>
          <a
            href="https://github.com/g-roger"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => void trackEvent('contact_click', { channel: 'github' })}
            className="inline-flex items-center gap-2 text-cream/70 hover:text-cream transition text-sm"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden>
              <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-1.93c-3.2.69-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.72 0c2.19-1.49 3.15-1.18 3.15-1.18.63 1.59.24 2.76.12 3.05.73.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.25 5.67.41.35.78 1.05.78 2.11v3.13c0 .31.21.66.8.55A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
            </svg>
            github.com/g-roger
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-cream/40 text-xs uppercase tracking-widest"
        >
          são paulo · brasil
        </motion.p>
      </div>
    </section>
  )
}
