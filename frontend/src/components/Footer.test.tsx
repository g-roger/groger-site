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

  it('diz como o site foi feito e onde está hospedado', () => {
    render(<Footer />)
    expect(screen.getByText('Feito com React e FastAPI, hospedado no Fly.dev')).toBeInTheDocument()
  })
})
