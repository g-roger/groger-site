import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import * as pt from '../data'
import * as en from '../data.en'
import { LangProvider } from '../lib/i18n'
import Education from './Education'

const emIngles = () =>
  render(
    <LangProvider lang="en">
      <Education />
    </LangProvider>,
  )

describe('Education', () => {
  it('o título é "Minha formação", com o número 05', () => {
    const { container } = render(<Education />)
    expect(screen.getByRole('heading', { level: 2, name: 'Minha formação' })).toBeInTheDocument()
    expect(container.querySelector('section')).toHaveAttribute('id', 'formacao')
    expect(screen.getByText('05')).toBeInTheDocument()
  })

  it('mostra o MBA na FIAP e o bacharelado, com período e instituição', () => {
    render(<Education />)
    const mba = screen.getByRole('heading', { level: 3, name: 'MBA em Inteligência Artificial e Machine Learning' }).closest('article') as HTMLElement
    expect(within(mba).getByText('2021 a 2022')).toBeInTheDocument()
    expect(within(mba).getByText(/FIAP/)).toBeInTheDocument()

    const graduacao = screen.getByRole('heading', { level: 3, name: 'Bacharelado em Sistemas de Informação' }).closest('article') as HTMLElement
    expect(within(graduacao).getByText('2014 a 2017')).toBeInTheDocument()
    expect(within(graduacao).getByText('Universidade Municipal de São Caetano do Sul')).toBeInTheDocument()
  })

  it('o MBA lista os projetos feitos no curso', () => {
    render(<Education />)
    const mba = screen.getByRole('heading', { level: 3, name: /^MBA/ }).closest('article') as HTMLElement
    expect(within(mba).getByText('Projetos do curso')).toBeInTheDocument()
    for (const nome of ['analise-vegetativa-bemagro', 'fraud-pix-model', 'mouse_dynamics']) {
      expect(within(mba).getByText(nome)).toBeInTheDocument()
    }
  })

  it('lista todos os cursos do currículo, com ano e instituição', () => {
    render(<Education />)
    expect(screen.getByRole('heading', { level: 3, name: 'Cursos e certificações' })).toBeInTheDocument()
    const itens = screen.getAllByRole('listitem').filter((li) => li.closest('ol'))
    expect(itens).toHaveLength(pt.courses.length)
    pt.courses.forEach((c, i) => {
      expect(itens[i]).toHaveTextContent(c.year)
      expect(itens[i]).toHaveTextContent(c.name)
      expect(itens[i]).toHaveTextContent(c.school)
    })
  })

  it('mostra os idiomas com o nível de cada um', () => {
    render(<Education />)
    expect(screen.getByRole('heading', { level: 3, name: 'Idiomas' })).toBeInTheDocument()
    for (const l of pt.languages) {
      expect(screen.getByText(l.name).parentElement).toHaveTextContent(`${l.name} ${l.level}`)
    }
  })

  it('não tem links: os projetos com repositório já estão na seção de projetos', () => {
    const { container } = render(<Education />)
    expect(container.querySelectorAll('a')).toHaveLength(0)
  })
})

describe('Education em inglês', () => {
  it('usa o título, o id e os textos em inglês', () => {
    const { container } = emIngles()
    expect(screen.getByRole('heading', { level: 2, name: 'My education' })).toBeInTheDocument()
    expect(container.querySelector('section')).toHaveAttribute('id', 'education')
    expect(screen.getByRole('heading', { level: 3, name: "Bachelor's degree in Information Systems" })).toBeInTheDocument()
    expect(screen.getByText('Course projects')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Courses and certificates' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Languages' })).toBeInTheDocument()
    expect(screen.getByText('2014 to 2017')).toBeInTheDocument()
  })

  it('mostra todos os cursos em inglês', () => {
    emIngles()
    for (const c of en.courses) expect(screen.getByText(c.name)).toBeInTheDocument()
  })
})
