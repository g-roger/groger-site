import { render, screen, within } from '@testing-library/react'
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
