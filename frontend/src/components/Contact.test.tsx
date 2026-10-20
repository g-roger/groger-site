import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { trackEvent } from '../lib/track'
import Contact from './Contact'

vi.mock('../lib/track', () => ({ trackEvent: vi.fn(), trackPageview: vi.fn() }))

describe('Contact', () => {
  beforeEach(() => {
    vi.mocked(trackEvent).mockClear()
  })

  it('o título é "Fale comigo" e indica o LinkedIn como canal', () => {
    render(<Contact />)
    expect(screen.getByRole('heading', { level: 2, name: 'Fale comigo' })).toBeInTheDocument()
    expect(screen.getByText(/O melhor jeito de falar comigo é pelo LinkedIn/)).toBeInTheDocument()
  })

  it('no celular o botão mostra um texto curto, e o endereço completo fica para telas maiores', () => {
    render(<Contact />)
    const link = screen.getByRole('link', { name: /linkedin\.com\/in\/gabriel-roger/ })
    const curto = screen.getByText('Abrir meu LinkedIn')
    const completo = screen.getByText('linkedin.com/in/gabriel-roger')
    expect(link).toContainElement(curto)
    expect(curto.className).toContain('sm:hidden')
    expect(completo.className).toContain('hidden')
    expect(completo.className).toContain('sm:inline')
    expect(link.className).toContain('min-h-[56px]')
  })

  it('o link do GitHub tem área de toque de pelo menos 48 px', () => {
    render(<Contact />)
    expect(screen.getByRole('link', { name: /github\.com\/g-roger/ }).className).toContain('min-h-[48px]')
  })

  it('o LinkedIn abre em nova aba', () => {
    render(<Contact />)
    const link = screen.getByRole('link', { name: /linkedin\.com\/in\/gabriel-roger/ })
    expect(link).toHaveAttribute('href', 'https://www.linkedin.com/in/gabriel-roger')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link.getAttribute('rel')).toContain('noopener')
  })

  it('o GitHub abre em nova aba', () => {
    render(<Contact />)
    const link = screen.getByRole('link', { name: /github\.com\/g-roger/ })
    expect(link).toHaveAttribute('href', 'https://github.com/g-roger')
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('não expõe e-mail nem telefone: só LinkedIn e GitHub', () => {
    const { container } = render(<Contact />)
    expect(container.querySelectorAll('a[href^="mailto:"], a[href^="tel:"]')).toHaveLength(0)
    expect(screen.getAllByRole('link')).toHaveLength(2)
  })

  it('registra o clique no LinkedIn e no GitHub', async () => {
    const user = userEvent.setup()
    render(<Contact />)

    for (const [nome, canal] of [
      [/linkedin\.com/, 'linkedin'],
      [/github\.com/, 'github'],
    ] as const) {
      const link = screen.getByRole('link', { name: nome })
      link.addEventListener('click', (e) => e.preventDefault())
      await user.click(link)
      expect(trackEvent).toHaveBeenCalledWith('contact_click', { channel: canal })
    }
  })

  it('mostra só a cidade', () => {
    render(<Contact />)
    expect(screen.getByText('São Paulo, Brasil')).toBeInTheDocument()
  })
})
