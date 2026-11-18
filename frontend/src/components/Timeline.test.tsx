import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { timeline } from '../data'
import TimelineSection from './Timeline'

describe('Timeline', () => {
  it('o título é "Minha trajetória"', () => {
    render(<TimelineSection />)
    expect(screen.getByRole('heading', { level: 2, name: 'Minha trajetória' })).toBeInTheDocument()
  })

  it('mostra um cartão por cargo, na ordem dos dados', () => {
    render(<TimelineSection />)
    const cargos = screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)
    expect(cargos).toEqual(timeline.map((t) => t.role))
  })

  it.each(timeline.map((t) => [`${t.role} (${t.place})`, t] as const))('%s mostra período, local e descrição', (_nome, t) => {
    render(<TimelineSection />)
    expect(screen.getAllByText(t.period).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText(t.place).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(t.detail)).toBeInTheDocument()
  })

  it('destaca o cargo atual como tech lead', () => {
    render(<TimelineSection />)
    expect(screen.getByRole('heading', { level: 3, name: 'Tech Lead, Cientista e Engenheiro de Dados' })).toBeInTheDocument()
    expect(screen.getByText('Liderança técnica dos projetos de dados')).toBeInTheDocument()
  })

  it('mostra a Mastertech como cargo sênior', () => {
    render(<TimelineSection />)
    expect(screen.getByRole('heading', { level: 3, name: 'Engenheiro de Software Back-End Sênior' })).toBeInTheDocument()
  })

  it('lista os clientes e parceiros só no cartão da Mastertech', () => {
    render(<TimelineSection />)
    expect(screen.getAllByText('Clientes e parceiros')).toHaveLength(1)

    const mastertech = timeline.find((t) => t.place === 'Mastertech')
    for (const cliente of mastertech?.clients ?? []) {
      expect(screen.getByText(cliente, { selector: 'li' })).toBeInTheDocument()
    }
  })

  it('mostra os destaques de cada cargo', () => {
    render(<TimelineSection />)
    for (const t of timeline) {
      for (const destaque of t.bullets ?? []) expect(screen.getByText(destaque)).toBeInTheDocument()
    }
  })

  it('mostra as tecnologias de cada cargo', () => {
    render(<TimelineSection />)
    const cartao = screen.getByRole('heading', { level: 3, name: 'Engenheiro de Software Back-End Sênior' }).closest('article') as HTMLElement
    for (const tag of ['Consultoria', 'Design partner', 'Prototipação', 'Big data', 'Python']) {
      expect(within(cartao).getByText(tag)).toBeInTheDocument()
    }
  })
})

describe('Timeline no celular', () => {
  it('cada cargo com destaques tem um botão "Ver o que fiz", só no celular', () => {
    render(<TimelineSection />)
    const botoes = screen.getAllByRole('button', { name: 'Ver o que fiz' })
    expect(botoes).toHaveLength(timeline.filter((t) => t.bullets?.length || t.tags?.length).length)
    for (const b of botoes) {
      expect(b.className).toContain('sm:hidden')
      expect(b.className).toContain('min-h-[44px]')
      expect(b).toHaveAttribute('aria-expanded', 'false')
    }
  })

  it('os destaques começam recolhidos no celular e sempre visíveis do sm em diante', () => {
    render(<TimelineSection />)
    const botao = screen.getAllByRole('button', { name: 'Ver o que fiz' })[0]
    const detalhes = document.getElementById(botao.getAttribute('aria-controls') as string) as HTMLElement
    expect(detalhes).toContainElement(screen.getByText('Liderança técnica dos projetos de dados'))
    expect(detalhes.className).toContain('hidden')
    expect(detalhes.className).toContain('sm:block')
  })

  it('tocar no botão abre e fecha os destaques daquele cargo', async () => {
    const user = userEvent.setup()
    render(<TimelineSection />)
    const botao = screen.getAllByRole('button', { name: 'Ver o que fiz' })[0]
    const detalhes = document.getElementById(botao.getAttribute('aria-controls') as string) as HTMLElement

    await user.click(botao)
    expect(botao).toHaveAttribute('aria-expanded', 'true')
    expect(botao).toHaveTextContent('Mostrar menos')
    expect(detalhes.className).not.toContain('hidden')
    // os outros cargos continuam recolhidos
    expect(screen.getAllByRole('button', { name: 'Ver o que fiz' }).length).toBeGreaterThan(0)

    await user.click(botao)
    expect(botao).toHaveAttribute('aria-expanded', 'false')
    expect(detalhes.className).toContain('hidden')
  })

  it('os clientes da Mastertech ficam à vista mesmo com os destaques recolhidos', () => {
    render(<TimelineSection />)
    const clientes = screen.getByText('Clientes e parceiros').parentElement as HTMLElement
    expect(clientes.closest('.hidden')).toBeNull()
    expect(within(clientes).getByText('Itaú')).toBeInTheDocument()
  })
})

