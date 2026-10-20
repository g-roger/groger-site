import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Footer from './Footer'

describe('Footer', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('mostra o nome e o ano atual', () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2030-05-05T12:00:00Z'))

    render(<Footer />)
    expect(screen.getByText('© 2030 Gabriel Roger')).toBeInTheDocument()
  })

  it('não conta com que tecnologia o site foi feito nem onde está hospedado', () => {
    const { container } = render(<Footer />)
    expect(container.textContent).not.toMatch(/React|FastAPI|Fly|hospedado/i)
  })
})
