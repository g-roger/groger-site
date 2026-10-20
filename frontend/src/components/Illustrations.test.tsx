import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { expertises } from '../data'
import {
  ArrowScribble,
  BarChart,
  BlobShape,
  Chip,
  CircuitLines,
  ConcentricRings,
  DotGrid,
  IllustrationFor,
  LeafSprig,
  Mascot,
  Sparkles,
  StarBurst,
  WaveScribble,
} from './Illustrations'

describe('Illustrations', () => {
  it.each(expertises.map((e) => [e.title, e.illustration] as const))('desenha a ilustração de "%s"', (_titulo, tipo) => {
    const { container } = render(<IllustrationFor kind={tipo} />)
    expect(container.querySelector('svg')).not.toBeNull()
  })

  it('o retrato tem descrição para leitores de tela', () => {
    const { container } = render(<Mascot />)
    expect(container.querySelector('svg')).toHaveAttribute('aria-label', 'Retrato ilustrado')
  })

  it('o cabelo do retrato é arrepiado, com várias pontas', () => {
    const { container } = render(<Mascot />)
    const cabelo = Array.from(container.querySelectorAll('path')).find((p) => p.getAttribute('fill') === '#1a1611')
    expect(cabelo).toBeDefined()
    const pontas = (cabelo?.getAttribute('d') ?? '').match(/L/g) ?? []
    expect(pontas.length).toBeGreaterThanOrEqual(15)
  })

  it.each([
    ['ArrowScribble', ArrowScribble],
    ['BarChart', BarChart],
    ['BlobShape', BlobShape],
    ['Chip', Chip],
    ['CircuitLines', CircuitLines],
    ['ConcentricRings', ConcentricRings],
    ['DotGrid', DotGrid],
    ['LeafSprig', LeafSprig],
    ['Sparkles', Sparkles],
    ['StarBurst', StarBurst],
    ['WaveScribble', WaveScribble],
  ])('o enfeite %s é decorativo e não atrapalha leitores de tela', (_nome, Componente) => {
    const { container } = render(<Componente className="x" />)
    const svg = container.querySelector('svg')
    expect(svg).not.toBeNull()
    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(svg).toHaveClass('x')
  })
})
