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

    // pares (x, y) de um atributo d, para medir o desenho
    const pontos = (d: string) => {
      const n = (d.match(/-?\d+(\.\d+)?/g) ?? []).map(Number)
      return Array.from({ length: Math.floor(n.length / 2) }, (_, i) => ({ x: n[2 * i], y: n[2 * i + 1] }))
    }

    it('o cabelo é alto em cima, com várias mechas, e curto nos lados', () => {
      const { container } = render(<Mascot />)
      const contorno = parte(container, 'cabelo')?.querySelector('path')?.getAttribute('d') ?? ''
      expect((contorno.match(/C/g) ?? []).length).toBeGreaterThanOrEqual(12)
      const ys = pontos(contorno).map((p) => p.y)
      // o topo sobe bem acima da linha da testa (y ~ 120)
      expect(Math.min(...ys)).toBeLessThanOrEqual(70)
    })

    it('tem olhos grandes, com íris castanha e brilho', () => {
      const { container } = render(<Mascot />)
      const olhos = parte(container, 'olhos')
      const iris = Array.from(olhos?.querySelectorAll('circle') ?? []).filter((c) => (c.getAttribute('fill') ?? '').startsWith('url(#iris'))
      expect(iris).toHaveLength(2)
      for (const c of iris) expect(Number(c.getAttribute('r'))).toBeGreaterThanOrEqual(9)
      const brilhos = Array.from(olhos?.querySelectorAll('circle[fill="#fff"]') ?? [])
      expect(brilhos.length).toBeGreaterThanOrEqual(4)
    })

    it('tem nariz pequeno', () => {
      const { container } = render(<Mascot />)
      const xs = Array.from(parte(container, 'nariz')?.querySelectorAll('path') ?? []).flatMap((p) =>
        pontos(p.getAttribute('d') ?? '').map((q) => q.x),
      )
      expect(Math.max(...xs) - Math.min(...xs)).toBeLessThanOrEqual(20)
    })

    it('tem barba cheia, das costeletas até abaixo do queixo, e bigode', () => {
      const { container } = render(<Mascot />)
      const barba = parte(container, 'barba')
      const contorno = barba?.querySelector('path')?.getAttribute('d') ?? ''
      const ys = pontos(contorno).map((p) => p.y)
      expect(Math.min(...ys)).toBeLessThanOrEqual(182)
      expect(Math.max(...ys)).toBeGreaterThanOrEqual(290)
      expect(barba?.querySelectorAll('path').length).toBeGreaterThanOrEqual(3)
    })

    it('tem sobrancelhas grossas e o sorriso mostra os dentes de cima', () => {
      const { container } = render(<Mascot />)
      expect(parte(container, 'sobrancelhas')?.querySelectorAll('path')).toHaveLength(2)
      expect(parte(container, 'sorriso')?.querySelector('path[fill="#fbf6ee"]')).not.toBeNull()
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
        const usados = Array.from(svg.querySelectorAll('[fill^="url(#"], [clip-path^="url(#"]')).map((el) =>
          (el.getAttribute('fill')?.startsWith('url(#') ? el.getAttribute('fill') : el.getAttribute('clip-path'))!.slice(5, -1),
        )
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
