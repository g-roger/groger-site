import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// O jsdom não tem IntersectionObserver, que o Framer Motion usa em `whileInView`.
// Este stub avisa na hora que o elemento está visível, então o conteúdo já aparece pronto.
class VisibleIntersectionObserver {
  private callback: IntersectionObserverCallback

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback
  }

  observe(target: Element) {
    this.callback(
      [{ isIntersecting: true, intersectionRatio: 1, target } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    )
  }

  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}

vi.stubGlobal('IntersectionObserver', VisibleIntersectionObserver)

// Algumas versões do jsdom não implementam scrollTo
window.scrollTo = vi.fn() as unknown as typeof window.scrollTo

afterEach(() => {
  cleanup()
  sessionStorage.clear()
  document.body.style.overflow = ''
})
