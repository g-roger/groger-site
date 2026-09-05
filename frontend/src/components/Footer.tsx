export default function Footer() {
  return (
    <footer className="relative border-t border-mint/10 py-10">
      <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cream/50">
        <p>© {new Date().getFullYear()} Gabriel Roger — feito à mão em São Paulo.</p>
        <p className="font-mono">
          desenhos, animações e código: autorais · deploy Fly.dev
        </p>
      </div>
    </footer>
  )
}
