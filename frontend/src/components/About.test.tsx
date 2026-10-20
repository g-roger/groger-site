import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import About from './About'

describe('About', () => {
  it('o título é lido como "Sobre mim", com espaço entre as palavras', () => {
    render(<About />)
    expect(screen.getByRole('heading', { level: 2, name: 'Sobre mim' })).toBeInTheDocument()
  })

  it('se apresenta como tech lead, cientista e engenheiro de dados', () => {
    render(<About />)
    expect(screen.getByText(/cientista e engenheiro de dados, e cheguei aqui passo a passo/)).toBeInTheDocument()
    expect(screen.getAllByText(/tech lead/i).length).toBeGreaterThanOrEqual(2)
  })

  it('mostra que chegou à senioridade passando por cada etapa, em ordem', () => {
    render(<About />)
    const texto = screen.getByText(/cheguei aqui passo a passo/).textContent ?? ''
    const etapas = [
      'Comecei em 2013 dando aula de informática',
      'fiz estágio em desenvolvimento na Ponte21',
      'na Mastertech, cresci até engenheiro de software sênior',
      'em projetos de consultoria dentro de grandes empresas',
      'Em 2021 mudei para dados',
      'entrei no PagBank como engenheiro de dados pleno',
      'me tornei cientista de dados sênior',
    ]
    const posicoes = etapas.map((e) => texto.indexOf(e))
    expect(posicoes.every((p) => p >= 0)).toBe(true)
    expect(posicoes).toEqual([...posicoes].sort((a, b) => a - b))
  })

  it('não dá a entender que começou sênior', () => {
    const { container } = render(<About />)
    expect(container.textContent).not.toMatch(/primeiro como engenheiro de software sênior/)
  })

  it('descreve o trabalho na CERC com as palavras certas', () => {
    render(<About />)
    expect(screen.getByText(/Hoje, na CERC, sou tech lead e engenheiro de dados sênior/)).toBeInTheDocument()
    expect(screen.getByText('arranjos de pagamento')).toBeInTheDocument()
    expect(screen.getByText('modelos de fraude')).toBeInTheDocument()
    expect(screen.getByText('agentes de IA')).toBeInTheDocument()
  })

  it('conta a atuação na Mastertech como design partner em grandes empresas', () => {
    render(<About />)
    expect(screen.getByText(/Na Mastertech, de 2017 a 2021, entrei em projetos de empresas como/)).toBeInTheDocument()
    expect(screen.getByText('Itaú, Santander, Vivo, Globo, Disney, Facebook e IBM')).toBeInTheDocument()
    expect(screen.getByText(/Atuava como design partner/)).toBeInTheDocument()
    expect(screen.getByText(/prototipação de produtos, desenvolvimento,\s+análise de dados em big data/)).toBeInTheDocument()
  })

  it('conta que ensinou e fez mentoria', () => {
    render(<About />)
    expect(screen.getByText(/instrutor e mentor de dados na Awari de 2022 a\s+2025/)).toBeInTheDocument()
  })
})
