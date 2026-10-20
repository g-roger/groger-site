export default function Footer() {
  return (
    <footer className="relative border-t border-mint/10 py-10">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs text-cream/50">
        <p>© {new Date().getFullYear()} Gabriel Roger</p>
        <p className="font-mono">Feito com React e FastAPI, hospedado no Fly.dev</p>
      </div>
    </footer>
  )
}
