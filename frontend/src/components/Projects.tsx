import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { projectCategories, projects, type Project, type ProjectCategory } from '../data'
import { trackEvent } from '../lib/track'
import { CircuitLines, Sparkles } from './Illustrations'

type Filtro = 'todos' | ProjectCategory

// quantos cartões aparecem antes do "ver todos" quando nenhum filtro está ativo
export const PRIMEIROS = 9

function contar(filtro: Filtro) {
  return filtro === 'todos' ? projects.length : projects.filter((p) => p.categories.includes(filtro)).length
}

export default function Projects() {
  const [filtro, setFiltro] = useState<Filtro>('todos')
  const [expandido, setExpandido] = useState(false)

  const filtrados = filtro === 'todos' ? projects : projects.filter((p) => p.categories.includes(filtro))
  const visiveis = filtro === 'todos' && !expandido ? filtrados.slice(0, PRIMEIROS) : filtrados
  const escondidos = filtrados.length - visiveis.length

  function escolher(novo: Filtro) {
    setFiltro(novo)
    setExpandido(false)
    void trackEvent('project_filter', { category: novo })
  }

  const opcoes: { key: Filtro; label: string }[] = [{ key: 'todos', label: 'Todos' }, ...projectCategories]

  return (
    <section id="projetos" className="relative py-14 sm:py-32">
      <div className="absolute top-10 left-4 w-24 h-24 sm:w-32 sm:h-32 text-mint/20 pointer-events-none hidden sm:block">
        <CircuitLines className="w-full h-full" />
      </div>
      <div className="absolute bottom-20 right-4 w-16 h-16 sm:w-24 sm:h-24 text-gold/40 pointer-events-none">
        <Sparkles className="w-full h-full" />
      </div>

      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="mb-8 sm:mb-10 max-w-2xl">
          <span className="block text-gold uppercase tracking-[0.4em] text-[11px] sm:text-xs mb-3">05</span>
          <h2 className="section-heading text-4xl sm:text-6xl text-cream">
            Alguns <span className="italic text-mint">projetos</span>
          </h2>
          <p className="mt-4 text-cream/60 text-sm sm:text-base">
            Os do trabalho aparecem só com a descrição, porque o código é das empresas. Os que têm
            seta levam ao repositório no GitHub.
          </p>
        </div>

        {/* no celular é uma fileira que rola para o lado (sangra até a borda para mostrar que continua);
            do sm em diante os filtros quebram linha */}
        <div
          role="group"
          aria-label="Filtrar projetos por tema"
          className="mb-8 -mx-5 px-5 sm:mx-0 sm:px-0 flex gap-2 overflow-x-auto sm:overflow-visible sm:flex-wrap pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {opcoes.map((o) => {
            const ativo = filtro === o.key
            return (
              <button
                key={o.key}
                type="button"
                aria-pressed={ativo}
                onClick={(e) => {
                  escolher(o.key)
                  e.currentTarget.scrollIntoView?.({ inline: 'center', block: 'nearest', behavior: 'smooth' })
                }}
                className={`shrink-0 whitespace-nowrap min-h-[44px] rounded-full border px-4 text-sm transition ${
                  ativo
                    ? 'border-mint bg-mint text-forest'
                    : 'border-mint/25 text-cream/75 hover:border-mint/60 hover:text-cream'
                }`}
              >
                {o.label} <span className={ativo ? 'text-forest/70' : 'text-cream/40'}>({contar(o.key)})</span>
              </button>
            )
          })}
        </div>

        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {/* sem mode="popLayout": ele injeta uma tag <style>, que a CSP (style-src 'self') bloqueia */}
          <AnimatePresence initial={false}>
            {visiveis.map((p, i) => (
              <motion.div
                key={p.name}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.15 } }}
                transition={{ duration: 0.35, delay: Math.min(i, 8) * 0.03 }}
              >
                <Cartao projeto={p} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {escondidos > 0 && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setExpandido(true)}
              className="group inline-flex items-center gap-3 rounded-full border border-mint/40 px-6 py-3 text-sm text-cream/85 hover:border-mint hover:text-cream transition"
            >
              Ver todos os {filtrados.length} projetos
              <span className="w-6 h-px bg-cream/60 group-hover:w-10 transition-all" />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

function Cartao({ projeto: p }: { projeto: Project }) {
  const conteudo = (
    <>
      <div className="absolute -top-14 -right-14 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-50 transition bg-jade" />
      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <p className="text-[11px] uppercase tracking-[0.25em] text-gold/90">{p.where}</p>
          {p.url && <span className="text-cream/60 text-xl leading-none">↗</span>}
        </div>
        <h4 className={`mt-2 text-cream leading-tight ${p.url ? 'font-mono text-base sm:text-lg' : 'font-display text-lg sm:text-xl'}`}>
          {p.name}
        </h4>
        <p className="mt-1 text-sm text-mint/90 italic">{p.tagline}</p>
        <p className="mt-3 sm:mt-4 text-sm text-cream/75 leading-relaxed">{p.description}</p>
        <div className="mt-4 sm:mt-5 flex flex-wrap items-center gap-1.5">
          {p.year && (
            <span className="text-[11px] uppercase tracking-widest text-mint border border-mint/30 px-2 py-1 rounded-full">
              {p.year}
            </span>
          )}
          {p.tags.map((t) => (
            <span
              key={t}
              className="text-[11px] uppercase tracking-widest text-cream/70 border border-mint/15 px-2 py-1 rounded-full"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </>
  )

  const classes =
    'group block h-full rounded-2xl border border-mint/15 bg-moss/40 sm:backdrop-blur p-5 sm:p-6 hover:border-mint/40 hover:bg-moss/60 transition relative overflow-hidden'

  if (!p.url) return <div className={classes}>{conteudo}</div>

  return (
    <a
      href={p.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => void trackEvent('project_click', { name: p.name, url: p.url })}
      className={classes}
    >
      {conteudo}
    </a>
  )
}
