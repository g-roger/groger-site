import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Admin from './Admin'

const metricas = {
  totals: { views: 1234, unique_visitors: 56, events: 7, sessions: 56 },
  last_24h: { views: 12, unique_visitors: 9 },
  top_paths: [{ path: '/', views: 1000 }],
  top_referrers: [{ referrer: 'https://www.linkedin.com/', views: 40 }],
  top_events: [{ name: 'project_click', count: 5 }],
  daily: [{ day: '2026-10-19', views: 3, unique: 2 }],
  recent: [{ at: '2026-10-20T16:50:00+00:00', path: '/', referrer: null, country: null, user_agent: null }],
}

function resposta(status: number, corpo: unknown = {}) {
  return { status, ok: status >= 200 && status < 300, json: async () => corpo }
}

const fetchOriginal = globalThis.fetch
const fetchMock = vi.fn()

beforeEach(() => {
  fetchMock.mockReset()
  fetchMock.mockResolvedValue(resposta(200, metricas))
  globalThis.fetch = fetchMock as unknown as typeof fetch
})

afterEach(() => {
  globalThis.fetch = fetchOriginal
})

async function entrar(user: ReturnType<typeof userEvent.setup>, usuario = 'gabriel', senha = 'segredo') {
  const campoUsuario = screen.getByLabelText('usuário')
  await user.clear(campoUsuario)
  await user.type(campoUsuario, usuario)
  await user.type(screen.getByLabelText('senha'), senha)
  await user.click(screen.getByRole('button', { name: 'entrar' }))
}

describe('Admin: login', () => {
  it('mostra o formulário quando não há sessão e não chama a API', () => {
    render(<Admin />)
    expect(screen.getByRole('heading', { name: 'Métricas' })).toBeInTheDocument()
    expect(screen.getByLabelText('usuário')).toHaveValue('admin')
    expect(screen.getByLabelText('senha')).toHaveAttribute('type', 'password')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('envia usuário e senha como Basic auth', async () => {
    const user = userEvent.setup()
    render(<Admin />)
    await entrar(user)

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))
    expect(fetchMock).toHaveBeenCalledWith('/api/admin/metrics', {
      headers: { Authorization: `Basic ${btoa('gabriel:segredo')}` },
    })
  })

  it('guarda a sessão na aba e mostra as métricas', async () => {
    const user = userEvent.setup()
    render(<Admin />)
    await entrar(user)

    expect(await screen.findByRole('heading', { name: 'Métricas do site' })).toBeInTheDocument()
    expect(sessionStorage.getItem('gr_auth')).toBe(`Basic ${btoa('gabriel:segredo')}`)
  })

  it('credenciais inválidas voltam ao formulário com aviso e limpam a sessão', async () => {
    fetchMock.mockResolvedValue(resposta(401))
    const user = userEvent.setup()
    render(<Admin />)
    await entrar(user, 'gabriel', 'errada')

    expect(await screen.findByText('Credenciais inválidas.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'entrar' })).toBeInTheDocument()
    expect(sessionStorage.getItem('gr_auth')).toBeNull()
  })

  it('entra direto quando já existe sessão na aba', async () => {
    sessionStorage.setItem('gr_auth', 'Basic abc123')
    render(<Admin />)

    expect(await screen.findByRole('heading', { name: 'Métricas do site' })).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledWith('/api/admin/metrics', { headers: { Authorization: 'Basic abc123' } })
  })

  it('sair limpa a sessão e volta ao formulário', async () => {
    sessionStorage.setItem('gr_auth', 'Basic abc123')
    const user = userEvent.setup()
    render(<Admin />)

    await screen.findByRole('heading', { name: 'Métricas do site' })
    await user.click(screen.getByRole('button', { name: 'sair' }))

    expect(screen.getByRole('button', { name: 'entrar' })).toBeInTheDocument()
    expect(sessionStorage.getItem('gr_auth')).toBeNull()
  })
})

describe('Admin: painel', () => {
  beforeEach(() => {
    sessionStorage.setItem('gr_auth', 'Basic abc123')
  })

  it('mostra os totais formatados em português', async () => {
    render(<Admin />)
    await screen.findByRole('heading', { name: 'Métricas do site' })

    expect(screen.getByText('Views totais').nextElementSibling).toHaveTextContent('1.234')
    expect(screen.getByText('Visitantes únicos').nextElementSibling).toHaveTextContent('56')
    expect(screen.getByText('Views 24h').nextElementSibling).toHaveTextContent('12')
    expect(screen.getByText('Únicos 24h').nextElementSibling).toHaveTextContent('9')
  })

  it('lista páginas, origens e eventos', async () => {
    render(<Admin />)
    await screen.findByRole('heading', { name: 'Métricas do site' })

    expect(screen.getByText('https://www.linkedin.com/')).toBeInTheDocument()
    expect(screen.getByText('project_click')).toBeInTheDocument()
    expect(screen.getByText('1000')).toBeInTheDocument()
  })

  it('a coluna de origem se chama "região" e valores ausentes aparecem como hífen', async () => {
    render(<Admin />)
    await screen.findByRole('heading', { name: 'Métricas do site' })

    expect(screen.getByRole('columnheader', { name: 'região' })).toBeInTheDocument()
    expect(screen.queryByRole('columnheader', { name: 'país' })).toBeNull()
    expect(screen.getAllByText('-')).toHaveLength(3)
  })

  it('recarregar busca as métricas de novo', async () => {
    const user = userEvent.setup()
    render(<Admin />)
    await screen.findByRole('heading', { name: 'Métricas do site' })

    await user.click(screen.getByRole('button', { name: 'recarregar' }))
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2))
  })

  it('mostra o erro quando a rede falha', async () => {
    fetchMock.mockRejectedValue(new Error('rede caiu'))
    render(<Admin />)
    expect(await screen.findByText('rede caiu')).toBeInTheDocument()
  })

  it('mostra erro quando o servidor responde 500', async () => {
    fetchMock.mockResolvedValue(resposta(500))
    render(<Admin />)
    expect(await screen.findByText('erro 500')).toBeInTheDocument()
  })

  it('mostra mensagens de vazio quando ainda não há dados', async () => {
    fetchMock.mockResolvedValue(
      resposta(200, {
        totals: { views: 0, unique_visitors: 0, events: 0, sessions: 0 },
        last_24h: { views: 0, unique_visitors: 0 },
        top_paths: [],
        top_referrers: [],
        top_events: [],
        daily: [],
        recent: [],
      }),
    )
    render(<Admin />)

    expect(await screen.findByText('nenhum ainda')).toBeInTheDocument()
    expect(screen.getByText('direto/desconhecido')).toBeInTheDocument()
    expect(screen.getByText('sem dados ainda.')).toBeInTheDocument()
  })
})
