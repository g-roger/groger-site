export default function Footer() {
  return (
    <footer className="relative border-t border-mint/10 pt-10 pb-[max(2.5rem,env(safe-area-inset-bottom))]">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 flex items-center justify-center text-xs text-cream/50">
        <p>© {new Date().getFullYear()} Gabriel Roger</p>
      </div>
    </footer>
  )
}
