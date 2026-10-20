import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { projectCategories, projects } from '../data'
import { trackEvent } from '../lib/track'
import Projects, { PRIMEIROS } from './Projects'

vi.mock('../lib/track', () => ({ trackEvent: vi.fn(), trackPageview: vi.fn() }))

const comLink = projects.filter((p) => p.url)

function titulosVisiveis() {
  return screen.getAllByRole('heading', { level: 4 }).map((h) => h.textContent)
}

async function verTodos(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: /Ver todos os/ }))
  await waitFor(() => expect(titulosVisiveis()).toHaveLength(projects.length))
}

describe('Projects', () => {
  beforeEach(() => {
    vi.mocked(trackEvent).mockClear()
  })

  it('o título é "Alguns projetos" e explica por que alguns não têm link', () => {
    render(<Projects />)
    expect(screen.getByRole('heading', { level: 2, name: 'Alguns projetos' })).toBeInTheDocument()
    expect(screen.getByText(/aparecem só com a descrição, porque o código é das empresas/)).toBeInTheDocument()
  })

  it(`começa mostrando só os ${PRIMEIROS} primeiros, com o botão de ver todos`, () => {
    render(<Projects />)
    expect(titulosVisiveis()).toEqual(projects.slice(0, PRIMEIROS).map((p) => p.name))
    expect(screen.getByRole('button', { name: `Ver todos os ${projects.length} projetos` })).toBeInTheDocument()
  })

  it('o botão de ver todos mostra a lista inteira e some', async () => {
    const user = userEvent.setup()
    render(<Projects />)
    await verTodos(user)
    expect(titulosVisiveis()).toEqual(projects.map((p) => p.name))
    expect(screen.queryByRole('button', { name: /Ver todos os/ })).toBeNull()
  })

  it('não mostra o GaJa', async () => {
    const user = userEvent.setup()
    render(<Projects />)
    await verTodos(user)
    expect(screen.queryByText(/GaJa/i)).toBeNull()
  })

  it('cada cartão diz onde o projeto foi feito', () => {
    render(<Projects />)
    const cartao = screen.getByRole('heading', { level: 4, name: 'Previsão de TPV diário' }).closest('div') as HTMLElement
    expect(within(cartao.parentElement as HTMLElement).getByText('PagBank')).toBeInTheDocument()
  })

  describe('filtros', () => {
    it('tem um botão para cada tema, com a contagem, e "Todos" começa ativo', () => {
      render(<Projects />)
      const grupo = screen.getByRole('group', { name: 'Filtrar projetos por tema' })
      expect(within(grupo).getByRole('button', { name: `Todos (${projects.length})` })).toHaveAttribute('aria-pressed', 'true')
      for (const c of projectCategories) {
        const n = projects.filter((p) => p.categories.includes(c.key)).length
        expect(within(grupo).getByRole('button', { name: `${c.label} (${n})` })).toHaveAttribute('aria-pressed', 'false')
      }
    })

    it.each(projectCategories.map((c) => [c.label, c.key] as const))('"%s" mostra só os projetos daquele tema', async (label, key) => {
      const user = userEvent.setup()
      render(<Projects />)
      await user.click(screen.getByRole('button', { name: new RegExp(`^${label} \\(`) }))

      const esperados = projects.filter((p) => p.categories.includes(key)).map((p) => p.name)
      await waitFor(() => expect(titulosVisiveis()).toEqual(esperados))
      expect(screen.getByRole('button', { name: new RegExp(`^${label} \\(`) })).toHaveAttribute('aria-pressed', 'true')
      expect(screen.queryByRole('button', { name: /Ver todos os/ })).toBeNull()
    })

    it('o filtro de fraude traz o trabalho da CERC e do PagBank', async () => {
      const user = userEvent.setup()
      render(<Projects />)
      await user.click(screen.getByRole('button', { name: /^Fraude e segurança/ }))

      // espera a animação de saída tirar os cartões dos outros temas
      await waitFor(() => expect(titulosVisiveis()).not.toContain('Previsão de TPV diário'))
      expect(titulosVisiveis()).toContain('Modelos de fraude em arranjos de pagamento')
      expect(titulosVisiveis()).toContain('Score de dispositivo para segurança da conta')
    })

    it('registra o filtro escolhido', async () => {
      const user = userEvent.setup()
      render(<Projects />)
      await user.click(screen.getByRole('button', { name: /^Crédito/ }))
      expect(trackEvent).toHaveBeenCalledWith('project_filter', { category: 'credito' })
    })

    it('voltar para "Todos" recolhe a lista de novo', async () => {
      const user = userEvent.setup()
      render(<Projects />)
      await verTodos(user)
      await user.click(screen.getByRole('button', { name: /^Crédito/ }))
      await user.click(screen.getByRole('button', { name: /^Todos/ }))
      await waitFor(() => expect(titulosVisiveis()).toHaveLength(PRIMEIROS))
    })
  })

  describe('links', () => {
    it('projetos sem endereço não viram link', async () => {
      const user = userEvent.setup()
      render(<Projects />)
      await verTodos(user)
      for (const p of projects.filter((x) => !x.url)) {
        expect(screen.getByRole('heading', { level: 4, name: p.name }).closest('a')).toBeNull()
      }
    })

    it.each(comLink.map((p) => [p.name, p] as const))('"%s" abre o GitHub em nova aba, com rel seguro', async (_nome, p) => {
      const user = userEvent.setup()
      render(<Projects />)
      await verTodos(user)
      const link = screen.getByRole('heading', { level: 4, name: p.name }).closest('a') as HTMLAnchorElement
      expect(link).toHaveAttribute('href', p.url)
      expect(link).toHaveAttribute('target', '_blank')
      expect(link.getAttribute('rel')).toContain('noopener')
      expect(link.getAttribute('rel')).toContain('noreferrer')
    })

    it('registra o clique em um projeto com o nome e o endereço', async () => {
      const user = userEvent.setup()
      render(<Projects />)
      await verTodos(user)

      const link = screen.getByRole('heading', { level: 4, name: 'fraud-pix-model' }).closest('a') as HTMLAnchorElement
      link.addEventListener('click', (e) => e.preventDefault()) // o jsdom não navega
      await user.click(link)

      expect(trackEvent).toHaveBeenCalledWith('project_click', {
        name: 'fraud-pix-model',
        url: 'https://github.com/g-roger/fraud-pix-model',
      })
    })
  })
})
