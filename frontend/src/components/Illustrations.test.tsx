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

  it('nenhum desenho fica com path sem forma (d vazio ou "undefined")', () => {
    const { container } = render(
      <div>
        <Mascot />
        <BlobShape />
        <CircuitLines />
        <WaveScribble />
        <ArrowScribble />
        <LeafSprig />
        {expertises.map((e) => (
          <IllustrationFor key={e.key} kind={e.illustration} />
        ))}
      </div>,
    )
    const ruins = Array.from(container.querySelectorAll('path')).filter((p) => {
      const d = p.getAttribute('d')
      return !d || d === 'undefined' || !/^\s*[Mm]/.test(d)
    })
    expect(ruins).toHaveLength(0)
  })

  it('o retrato tem descrição para leitores de tela', () => {
    const { container } = render(<Mascot />)
    expect(container.querySelector('svg')).toHaveAttribute('aria-label', 'Retrato ilustrado')
  })

  describe('retrato: parecido com o Gabriel', () => {
    const parte = (container: HTMLElement, nome: string) => container.querySelector(`[data-parte="${nome}"]`)

    it('o cabelo é arrepiado: o contorno de cima tem várias mechas', () => {
      const { container } = render(<Mascot />)
      const contorno = parte(container, 'cabelo')?.querySelector('path')?.getAttribute('d') ?? ''
      // cada mecha são duas curvas (sobe até a ponta e desce até o vão)
      expect((contorno.match(/C/g) ?? []).length).toBeGreaterThanOrEqual(14)
    })

    it('tem barba cheia com fios desenhados e bigode', () => {
      const { container } = render(<Mascot />)
      const barba = parte(container, 'barba')
      expect(barba).not.toBeNull()
      const fios = Array.from(barba?.querySelectorAll('path') ?? []).map((p) => (p.getAttribute('d')?.match(/M/g) ?? []).length)
      expect(Math.max(...fios)).toBeGreaterThanOrEqual(100)
    })

    it('tem sobrancelhas grossas, olhos sorrindo e o sorriso mostra os dentes', () => {
      const { container } = render(<Mascot />)
      expect(parte(container, 'sobrancelhas')?.querySelectorAll('path')).toHaveLength(2)
      expect(parte(container, 'olhos')).not.toBeNull()
      const sorriso = parte(container, 'sorriso')
      expect(sorriso?.querySelector('path[fill="#fbf6ee"]')).not.toBeNull()
    })

    it('não usa óculos', () => {
      const { container } = render(<Mascot />)
      expect(parte(container, 'oculos')).toBeNull()
      // nada de aro: nenhum círculo vazado em volta dos olhos
      const aros = Array.from(container.querySelectorAll('circle')).filter((c) => {
        const r = Number(c.getAttribute('r'))
        return c.getAttribute('fill') === 'none' && r > 10 && r < 30
      })
      expect(aros).toHaveLength(0)
    })

    it('usa a jaqueta verde com frisos brancos e a alça da bolsa', () => {
      const { container } = render(<Mascot />)
      expect(parte(container, 'jaqueta')?.querySelectorAll('path[stroke="#f2ead8"]')).toHaveLength(2)
      expect(parte(container, 'alca')).not.toBeNull()
    })

    it('é uma imagem para leitores de tela', () => {
      const { container } = render(<Mascot />)
      expect(container.querySelector('svg')).toHaveAttribute('role', 'img')
    })

    it('dois retratos na mesma página não dividem os ids dos gradientes', () => {
      const { container } = render(
        <div>
          <Mascot />
          <Mascot />
        </div>,
      )
      const ids = Array.from(container.querySelectorAll('[id]')).map((el) => el.id)
      expect(ids.length).toBeGreaterThan(0)
      expect(new Set(ids).size).toBe(ids.length)
      // e cada retrato só aponta para os próprios gradientes
      for (const svg of Array.from(container.querySelectorAll('svg'))) {
        const proprios = new Set(Array.from(svg.querySelectorAll('[id]')).map((el) => el.id))
        const usados = Array.from(svg.querySelectorAll('[fill^="url(#"]')).map((el) => (el.getAttribute('fill') ?? '').slice(5, -1))
        expect(usados.length).toBeGreaterThan(0)
        for (const u of usados) expect(proprios.has(u)).toBe(true)
      }
    })

    it('os ids não têm ":" (quebraria o url(#...) em alguns navegadores)', () => {
      const { container } = render(<Mascot />)
      for (const el of Array.from(container.querySelectorAll('[id]'))) expect(el.id).not.toContain(':')
    })
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
