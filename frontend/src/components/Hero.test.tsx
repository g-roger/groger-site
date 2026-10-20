import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Hero from './Hero'

describe('Hero', () => {
  it('o título apresenta tech lead, cientista e engenheiro de dados', () => {
    render(<Hero />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Tech lead, cientista e engenheiro de dados.',
    )
  })

  it('cumprimenta e conta onde trabalha hoje e onde passou antes', () => {
    render(<Hero />)
    expect(screen.getByText('Olá, eu sou o Gabriel')).toBeInTheDocument()
    expect(screen.getByText(/Hoje sou tech lead na CERC, em projetos de arranjos de pagamento e modelos de\s+fraude/)).toBeInTheDocument()
    expect(screen.getByText(/Antes passei cinco anos no PagBank/)).toBeInTheDocument()
  })

  it('mostra as empresas e a formação', () => {
    render(<Hero />)
    for (const texto of ['Tech lead na CERC', 'PagBank', 'Mastertech', 'MBA na FIAP']) {
      expect(screen.getByText(texto)).toBeInTheDocument()
    }
  })

  it('as empresas formam uma lista de quatro itens, sem traços soltos no celular', () => {
    render(<Hero />)
    const itens = screen.getAllByRole('listitem')
    expect(itens.map((li) => li.textContent)).toEqual(['Tech lead na CERC', 'PagBank', 'Mastertech', 'MBA na FIAP'])
    // o divisor só existe do sm em diante, e não depois do último item
    const divisores = itens.map((li) => li.querySelector('span.hidden.sm\\:block'))
    expect(divisores.map(Boolean)).toEqual([true, true, true, false])
  })

  it('o aviso "rolar" só aparece do sm em diante', () => {
    render(<Hero />)
    expect(screen.getByText('rolar').parentElement?.className).toContain('hidden sm:flex')
  })

  it('o link "O que eu faço" tem área de toque de pelo menos 44 px', () => {
    render(<Hero />)
    expect(screen.getByRole('link', { name: /o que eu faço/i }).className).toContain('min-h-[44px]')
  })

  it('os botões levam para projetos e para as áreas', () => {
    render(<Hero />)
    expect(screen.getByRole('link', { name: /ver projetos/i })).toHaveAttribute('href', '#projetos')
    expect(screen.getByRole('link', { name: /o que eu faço/i })).toHaveAttribute('href', '#expertise')
  })

  it('tem o retrato ilustrado', () => {
    const { container } = render(<Hero />)
    expect(container.querySelector('svg[aria-label="Retrato ilustrado"]')).not.toBeNull()
  })
})
