import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { abrirSurpresa, tokenGuardado, type Surpresa as DadosSurpresa } from '../lib/surpresa'
import { trackEvent } from '../lib/track'

type Estado = 'verificando' | 'senha' | 'aberta'

const AVISOS = {
  errada: 'Não é essa. Tenta de novo.',
  bloqueado: 'Muitas tentativas. Espera uns minutinhos.',
  indisponivel: 'Ainda não está pronta.',
  rede: 'Sem conexão. Tenta de novo.',
} as const

export default function Surprise({ aberta, onFechar }: { aberta: boolean; onFechar: () => void }) {
  return <AnimatePresence>{aberta && <Conteudo onFechar={onFechar} />}</AnimatePresence>
}

function Conteudo({ onFechar }: { onFechar: () => void }) {
  const [estado, setEstado] = useState<Estado>(() => (tokenGuardado() ? 'verificando' : 'senha'))
  const [surpresa, setSurpresa] = useState<DadosSurpresa | null>(null)
  const [aviso, setAviso] = useState<string | null>(null)
  const [senha, setSenha] = useState('')
  const [enviando, setEnviando] = useState(false)
  const campo = useRef<HTMLInputElement>(null)

  function abrir(dados: DadosSurpresa) {
    setSurpresa(dados)
    setEstado('aberta')
    void trackEvent('surpresa_aberta')
  }

  // aparelho já liberado: abre direto com o token guardado
  useEffect(() => {
    const token = tokenGuardado()
    if (!token) return
    let ativo = true
    void abrirSurpresa({ token }).then((r) => {
      if (!ativo) return
      if (r.ok) abrir(r.surpresa)
      else setEstado('senha')
    })
    return () => {
      ativo = false
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onFechar()
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onFechar])

  useEffect(() => {
    if (estado === 'senha') campo.current?.focus()
  }, [estado])

  async function enviar(e: React.FormEvent) {
    e.preventDefault()
    if (!senha.trim() || enviando) return
    setEnviando(true)
    setAviso(null)
    const r = await abrirSurpresa({ senha })
    setEnviando(false)
    if (r.ok) abrir(r.surpresa)
    else {
      setAviso(AVISOS[r.motivo])
      setSenha('')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] bg-forest/90 backdrop-blur-xl grid place-items-center p-4 overflow-y-auto"
      onClick={onFechar}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Surpresa"
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full ${estado === 'aberta' ? 'max-w-3xl' : 'max-w-sm'}`}
      >
        <button
          onClick={onFechar}
          aria-label="fechar"
          className="absolute -top-3 -right-1 sm:-right-3 z-20 w-10 h-10 rounded-full border border-mint/30 bg-forest/80 text-cream/80 hover:bg-mint hover:text-forest transition grid place-items-center"
        >
          ✕
        </button>

        {estado === 'verificando' && (
          <p className="text-center text-cream/70 py-16" role="status">
            Abrindo…
          </p>
        )}

        {estado === 'senha' && (
          <form
            onSubmit={enviar}
            className="rounded-3xl border border-mint/20 bg-gradient-to-br from-pine to-forest p-7 sm:p-8 space-y-5"
          >
            <div className="flex justify-center text-rose">
              <Coracao className="w-10 h-10" />
            </div>
            <p className="text-center font-display italic text-2xl text-cream">Tem uma surpresa aqui.</p>
            <div>
              <label htmlFor="palavra-secreta" className="text-xs uppercase tracking-widest text-cream/60">
                palavra secreta
              </label>
              <input
                ref={campo}
                id="palavra-secreta"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                autoComplete="off"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                className="mt-1 w-full rounded-xl bg-forest border border-mint/25 px-4 py-3 text-cream focus:outline-none focus:border-mint"
              />
            </div>
            {aviso && (
              <p className="text-rose text-sm text-center" role="alert">
                {aviso}
              </p>
            )}
            <button
              type="submit"
              disabled={enviando || !senha.trim()}
              className="w-full rounded-xl bg-jade text-cream py-3 font-medium hover:bg-jade/90 transition disabled:opacity-50"
            >
              {enviando ? 'Abrindo…' : 'Abrir'}
            </button>
          </form>
        )}

        {estado === 'aberta' && surpresa && <Banner surpresa={surpresa} />}
      </motion.div>
    </motion.div>
  )
}

function Banner({ surpresa }: { surpresa: DadosSurpresa }) {
  return (
    <div className="relative">
      <CoracoesFlutuando />
      <div className="relative grid gap-6 sm:gap-8 md:grid-cols-[1.15fr_1fr] items-center">
        <motion.figure
          initial={{ rotate: -6, y: 20, opacity: 0 }}
          animate={{ rotate: -2.5, y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="bg-cream p-3 pb-10 sm:p-4 sm:pb-14 rounded-sm shadow-2xl shadow-black/50 mx-auto max-w-md w-full"
        >
          <img src={surpresa.foto} alt="Nós dois" className="w-full h-auto rounded-[2px]" />
          <figcaption className="mt-3 text-center font-display italic text-forest/80 text-lg">nós dois</figcaption>
        </motion.figure>

        <div className="text-center md:text-left">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="uppercase tracking-[0.3em] text-[10px] sm:text-xs text-gold"
          >
            Tech lead, cientista e engenheiro de dados.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="mt-4 section-heading italic text-mint text-4xl sm:text-5xl leading-tight"
          >
            {surpresa.mensagem}
          </motion.p>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.25, 1] }}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="mt-5 inline-flex text-rose"
          >
            <Coracao className="w-9 h-9" />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function Coracao({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.6 1.2 4.3 2.6.7-1.4 2.2-2.6 4.3-2.6 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21z"
        fill="currentColor"
      />
    </svg>
  )
}

const CORACOES = [
  { x: '6%', tam: 'w-5 h-5', atraso: 0, dur: 6, cor: 'text-rose/80' },
  { x: '18%', tam: 'w-3 h-3', atraso: 1.2, dur: 7, cor: 'text-gold/70' },
  { x: '34%', tam: 'w-4 h-4', atraso: 2.4, dur: 5.5, cor: 'text-rose/60' },
  { x: '58%', tam: 'w-3 h-3', atraso: 0.6, dur: 6.5, cor: 'text-mint/70' },
  { x: '74%', tam: 'w-5 h-5', atraso: 1.8, dur: 7.5, cor: 'text-rose/70' },
  { x: '90%', tam: 'w-4 h-4', atraso: 3, dur: 6, cor: 'text-gold/60' },
]

function CoracoesFlutuando() {
  return (
    <div className="pointer-events-none absolute -inset-x-4 -inset-y-10 overflow-hidden" aria-hidden>
      {CORACOES.map((c, i) => (
        <motion.div
          key={i}
          className={`absolute bottom-0 ${c.cor}`}
          style={{ left: c.x }}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: [-10, -420], opacity: [0, 1, 0], rotate: [0, 12, -12, 0] }}
          transition={{ duration: c.dur, delay: c.atraso, repeat: Infinity, ease: 'easeOut' }}
        >
          <Coracao className={c.tam} />
        </motion.div>
      ))}
    </div>
  )
}
