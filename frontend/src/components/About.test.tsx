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
    expect(screen.getByText(/cientista e engenheiro de dados\. Comecei em 2013/)).toBeInTheDocument()
    expect(screen.getAllByText(/tech lead/i).length).toBeGreaterThanOrEqual(2)
  })

  it('conta que passou boa parte da carreira dentro de grandes empresas', () => {
    render(<About />)
    expect(
      screen.getByText(
        /passei boa parte da carreira dentro de grandes empresas: primeiro como engenheiro de software sênior, em projetos de consultoria, e desde 2021 em dados/,
      ),
    ).toBeInTheDocument()
  })

  it('descreve o trabalho na CERC com as palavras certas', () => {
    render(<About />)
    expect(screen.getByText(/Na CERC sou tech lead e engenheiro de dados sênior/)).toBeInTheDocument()
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
