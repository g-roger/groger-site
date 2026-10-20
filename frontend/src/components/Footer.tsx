export default function Footer() {
  return (
    <footer className="relative border-t border-mint/10 py-10">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 flex items-center justify-center text-xs text-cream/50">
        <p>© {new Date().getFullYear()} Gabriel Roger</p>
      </div>
    </footer>
  )
}
