import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { projects } from '../data'
import { trackEvent } from '../lib/track'
import Projects from './Projects'

vi.mock('../lib/track', () => ({ trackEvent: vi.fn(), trackPageview: vi.fn() }))

const comLink = projects.filter((p) => p.url)
const semLink = projects.filter((p) => !p.url)

describe('Projects', () => {
  beforeEach(() => {
    vi.mocked(trackEvent).mockClear()
  })

  it('o título é "Alguns projetos" e avisa que o resto é privado', () => {
    render(<Projects />)
    expect(screen.getByRole('heading', { level: 2, name: 'Alguns projetos' })).toBeInTheDocument()
    expect(screen.getByText(/A maior parte do que faço no trabalho é privada/)).toBeInTheDocument()
  })

  it('mostra todos os projetos', () => {
    render(<Projects />)
    for (const p of projects) expect(screen.getByRole('heading', { level: 4, name: p.name })).toBeInTheDocument()
  })

  it('só os projetos com endereço viram link', () => {
    render(<Projects />)
    expect(screen.getAllByRole('link')).toHaveLength(comLink.length)
  })

  it.each(comLink.map((p) => [p.name, p] as const))('"%s" abre em nova aba, com rel seguro', (_nome, p) => {
    render(<Projects />)
    const link = screen.getByRole('link', { name: new RegExp(p.name) })
    expect(link).toHaveAttribute('href', p.url)
    expect(link).toHaveAttribute('target', '_blank')
    expect(link.getAttribute('rel')).toContain('noopener')
    expect(link.getAttribute('rel')).toContain('noreferrer')
  })

  it.each(semLink.map((p) => [p.name, p] as const))('"%s" não vira link', (_nome, p) => {
    render(<Projects />)
    expect(screen.getByRole('heading', { level: 4, name: p.name }).closest('a')).toBeNull()
  })

  it('registra o clique em um projeto com o nome e o endereço', async () => {
    const user = userEvent.setup()
    render(<Projects />)

    const link = screen.getByRole('link', { name: /mouse_dynamics/ })
    link.addEventListener('click', (e) => e.preventDefault()) // o jsdom não navega
    await user.click(link)

    expect(trackEvent).toHaveBeenCalledWith('project_click', {
      name: 'mouse_dynamics',
      url: 'https://github.com/g-roger/mouse_dynamics',
    })
  })

  it('mostra ano e tecnologias de cada projeto', () => {
    render(<Projects />)
    for (const p of projects) {
      for (const tag of p.tags) expect(screen.getAllByText(tag).length).toBeGreaterThanOrEqual(1)
    }
    expect(screen.getAllByText('2022').length).toBe(projects.filter((p) => p.year === '2022').length)
  })
})
