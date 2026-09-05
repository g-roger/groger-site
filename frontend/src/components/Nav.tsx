import { motion } from 'framer-motion'

const links = [
  { href: '#about', label: 'sobre' },
  { href: '#expertise', label: 'especialidades' },
  { href: '#stack', label: 'stack' },
  { href: '#trajetoria', label: 'trajetória' },
  { href: '#projetos', label: 'projetos' },
  { href: '#contato', label: 'contato' },
]

export default function Nav() {
  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-forest/70 border-b border-mint/10"
    >
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 group">
          <span className="text-2xl font-display font-bold tracking-tight text-mint">g·r</span>
          <span className="text-xs uppercase tracking-[0.3em] text-cream/50 hidden sm:inline">
            dados · crédito · segurança
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-1 sm:gap-3">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="relative px-2 py-1 text-xs sm:text-sm text-cream/70 hover:text-cream transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <nav className="md:hidden flex items-center gap-3 text-xs text-cream/70">
          <a href="#projetos" className="hover:text-cream">projetos</a>
          <a href="#contato" className="hover:text-cream">contato</a>
        </nav>
      </div>
    </motion.header>
  )
}
