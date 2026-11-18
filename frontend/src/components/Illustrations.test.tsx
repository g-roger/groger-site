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

  describe('retrato: parecido com o Gabriel e com cara de desenho feito à mão', () => {
    const parte = (container: HTMLElement, nome: string) => container.querySelector(`[data-parte="${nome}"]`)
    // pares (x, y) de um atributo d, para medir o desenho
    const pontos = (d: string) => {
      const n = (d.match(/-?\d+(\.\d+)?/g) ?? []).map(Number)
      return Array.from({ length: Math.floor(n.length / 2) }, (_, i) => ({ x: n[2 * i], y: n[2 * i + 1] }))
    }
    const caixa = (d: string) => {
      const ps = pontos(d)
      const xs = ps.map((p) => p.x)
      const ys = ps.map((p) => p.y)
      return { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) }
    }

    it('é montado por partes, do fundo para a frente', () => {
      const { container } = render(<Mascot />)
      const nomes = Array.from(container.querySelectorAll('[data-parte]')).map((g) => g.getAttribute('data-parte'))
      expect(nomes).toEqual(['fundo', 'corpo', 'orelhas', 'rosto', 'barba', 'sorriso', 'bigode', 'nariz', 'olhos', 'sobrancelhas', 'cabelo'])
    })

    it('não usa degradês: cores chapadas, como ilustração impressa', () => {
      const { container } = render(<Mascot />)
      expect(container.querySelectorAll('linearGradient, radialGradient, filter')).toHaveLength(0)
    })

    it('o traço é de pincel: contornos são formas cheias, não linhas de espessura fixa', () => {
      const { container } = render(<Mascot />)
      const comStroke = Array.from(parte(container, 'cabelo')!.querySelectorAll('path')).filter((p) => p.getAttribute('stroke'))
      expect(comStroke).toHaveLength(0)
    })

    it('o cabelo é alto em cima e tem mechas desenhadas', () => {
      const { container } = render(<Mascot />)
      const caminhos = Array.from(parte(container, 'cabelo')!.querySelectorAll('path'))
      const contorno = caminhos[0].getAttribute('d') ?? ''
      expect((contorno.match(/C/g) ?? []).length).toBeGreaterThanOrEqual(20)
      expect(caixa(contorno).y0).toBeLessThanOrEqual(40)
      expect(caminhos.length).toBeGreaterThanOrEqual(10)
    })

    it('os olhos são apertados de quem está rindo, com pupila e brilho', () => {
      const { container } = render(<Mascot />)
      const olhos = parte(container, 'olhos')!
      const aberturas = Array.from(olhos.querySelectorAll('clipPath path')).map((p) => caixa(p.getAttribute('d') ?? ''))
      expect(aberturas).toHaveLength(2)
      for (const a of aberturas) expect((a.y1 - a.y0) / (a.x1 - a.x0)).toBeLessThan(0.35)
      expect(olhos.querySelectorAll('circle[fill="#fff"]')).toHaveLength(2)
    })

    it('o nariz é discreto: mais estreito que um quarto do rosto', () => {
      const { container } = render(<Mascot />)
      const rosto = caixa(parte(container, 'rosto')!.querySelector('path')!.getAttribute('d') ?? '')
      const xs = Array.from(parte(container, 'nariz')!.querySelectorAll('path')).flatMap((p) => pontos(p.getAttribute('d') ?? '').map((q) => q.x))
      expect(Math.max(...xs) - Math.min(...xs)).toBeLessThan((rosto.x1 - rosto.x0) / 4)
    })

    it('a barba é cheia: das costeletas até abaixo da boca, com centenas de fios', () => {
      const { container } = render(<Mascot />)
      const barba = parte(container, 'barba')!
      const contorno = caixa(barba.querySelector('path')!.getAttribute('d') ?? '')
      const boca = caixa(parte(container, 'sorriso')!.querySelector('path')!.getAttribute('d') ?? '')
      expect(contorno.y0).toBeLessThan(boca.y0 - 40)
      expect(contorno.y1).toBeGreaterThan(boca.y1 + 30)
      const fios = Array.from(barba.querySelectorAll('path')).reduce((n, p) => n + (p.getAttribute('d')?.match(/M/g) ?? []).length, 0)
      expect(fios).toBeGreaterThanOrEqual(300)
      expect(parte(container, 'bigode')).not.toBeNull()
    })

    it('o sorriso é aberto e mostra os dentes de cima', () => {
      const { container } = render(<Mascot />)
      expect(parte(container, 'sorriso')!.querySelector('path[fill="#f4ecdf"]')).not.toBeNull()
    })

    it('tem sobrancelhas grossas', () => {
      const { container } = render(<Mascot />)
      expect(parte(container, 'sobrancelhas')!.querySelectorAll('path').length).toBeGreaterThanOrEqual(2)
    })

    it('não usa óculos', () => {
      const { container } = render(<Mascot />)
      expect(parte(container, 'oculos')).toBeNull()
      const aros = Array.from(container.querySelectorAll('circle')).filter((c) => {
        const r = Number(c.getAttribute('r'))
        return c.getAttribute('fill') === 'none' && r > 10 && r < 30
      })
      expect(aros).toHaveLength(0)
    })

    it('veste a jaqueta verde com frisos claros e a alça da bolsa', () => {
      const { container } = render(<Mascot />)
      const corpo = parte(container, 'corpo')!
      expect(corpo.querySelector('path[fill="#1f4d3b"]')).not.toBeNull()
      expect(corpo.querySelectorAll('path[fill="#f2ead8"]').length).toBeGreaterThanOrEqual(6)
      expect(corpo.querySelector('path[fill="#141414"]')).not.toBeNull()
    })

    it('é uma imagem para leitores de tela', () => {
      const { container } = render(<Mascot />)
      expect(container.querySelector('svg')).toHaveAttribute('role', 'img')
    })

    it('dois retratos na mesma página não dividem os ids dos recortes dos olhos', () => {
      const { container } = render(
        <div>
          <Mascot />
          <Mascot />
        </div>,
      )
      const ids = Array.from(container.querySelectorAll('[id]')).map((el) => el.id)
      expect(ids).toHaveLength(4)
      expect(new Set(ids).size).toBe(ids.length)
      for (const svg of Array.from(container.querySelectorAll('svg'))) {
        const proprios = new Set(Array.from(svg.querySelectorAll('[id]')).map((el) => el.id))
        const usados = Array.from(svg.querySelectorAll('[clip-path^="url(#"]')).map((el) => (el.getAttribute('clip-path') ?? '').slice(5, -1))
        expect(usados).toHaveLength(2)
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
