import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import App from './App'

vi.mock('./lib/track', () => ({ trackEvent: vi.fn(), trackPageview: vi.fn() }))

const SECOES = ['top', 'about', 'expertise', 'stack', 'trajetoria', 'projetos', 'contato']

function normalizar(texto: string | null) {
  return (texto ?? '').replace(/\s+/g, ' ').trim()
}

describe('App, a página inteira', () => {
  it('tem todas as seções, cada uma uma única vez', () => {
    render(<App />)
    for (const id of SECOES) expect(document.querySelectorAll(`#${id}`)).toHaveLength(1)
  })

  it('os títulos das seções estão na ordem certa', () => {
    render(<App />)
    const titulos = screen.getAllByRole('heading', { level: 2 }).map((h) => normalizar(h.textContent))
    expect(titulos).toEqual([
      'Sobre mim',
      'O que eu faço',
      'O que eu uso',
      'Minha trajetória',
      'Alguns projetos',
      'Fale comigo',
    ])
  })

  it('a numeração das seções é sequencial, sem pular número', () => {
    render(<App />)
    const numeros = Array.from(document.querySelectorAll('span'))
      .map((s) => normalizar(s.textContent))
      .filter((t) => /^0[1-9]$/.test(t))
    expect(numeros).toEqual(['01', '02', '03', '04', '05', '06'])
  })

  it('todo link do menu leva a uma seção que existe', () => {
    render(<App />)
    const ancoras = Array.from(document.querySelectorAll('header a[href^="#"]')).map((a) => a.getAttribute('href') as string)
    expect(ancoras.length).toBeGreaterThanOrEqual(6)
    for (const href of ancoras) expect(document.getElementById(href.slice(1))).not.toBeNull()
  })

  it('apresenta o Gabriel como tech lead, cientista e engenheiro de dados', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Tech lead, cientista e engenheiro de dados.')
  })

  it('nunca chama o cargo atual só de "tech lead e engenheiro", sem cientista', () => {
    render(<App />)
    expect(document.body.textContent).not.toMatch(/tech lead e engenheiro/i)
  })

  it('não tem travessão nem meia-risca em nenhum texto da página', () => {
    render(<App />)
    expect(document.body.textContent).not.toMatch(/[—–]/)
  })

  it('não expõe e-mail, telefone nem links de contato direto', () => {
    const { container } = render(<App />)
    const texto = document.body.textContent ?? ''

    expect(texto).not.toMatch(/[\w.+-]+@[\w-]+\.[\w.-]+/)
    expect(texto).not.toMatch(/gmail/i)
    expect(texto).not.toMatch(/(\+?55\s?)?\(?\d{2}\)?\s?9?\d{4}[-\s]?\d{4}/)
    expect(container.querySelectorAll('a[href^="mailto:"], a[href^="tel:"], a[href^="https://wa.me"]')).toHaveLength(0)
  })

  it('os únicos links externos são LinkedIn, GitHub e projetos do g-roger', () => {
    render(<App />)
    const externos = Array.from(document.querySelectorAll('a[href^="http"]')).map((a) => a.getAttribute('href') as string)
    expect(externos.length).toBeGreaterThan(0)
    for (const href of externos) {
      expect(href).toMatch(/^https:\/\/(www\.linkedin\.com\/in\/gabriel-roger|github\.com\/g-roger(\/[\w.-]+)?)$/)
    }
  })

  it('todo link que abre em nova aba tem rel seguro', () => {
    render(<App />)
    for (const a of Array.from(document.querySelectorAll('a[target="_blank"]'))) {
      expect(a.getAttribute('rel')).toContain('noopener')
    }
  })
})
