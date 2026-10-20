import { createHash } from 'node:crypto'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Hero from './Hero'

vi.mock('../lib/track', () => ({ trackEvent: vi.fn(), trackPageview: vi.fn() }))

const SURPRESA = {
  mensagem: 'mensagem vinda do servidor',
  foto: 'data:image/jpeg;base64,AAAA',
  token: 'token-do-aparelho',
}

function resposta(status: number, corpo: unknown = {}) {
  return { status, ok: status === 200, json: async () => corpo }
}

const fetchOriginal = globalThis.fetch
const fetchMock = vi.fn()

beforeEach(() => {
  fetchMock.mockReset()
  globalThis.fetch = fetchMock as unknown as typeof fetch
  localStorage.clear()
})

afterEach(() => {
  globalThis.fetch = fetchOriginal
  vi.useRealTimers()
})

function tocar(alvo: HTMLElement, vezes: number) {
  for (let i = 0; i < vezes; i++) fireEvent.click(alvo)
}

describe('Surpresa escondida no retrato', () => {
  it.each(['retrato-mobile', 'retrato-desktop'])('5 toques no %s pedem a palavra secreta', (alvo) => {
    render(<Hero />)
    tocar(screen.getByTestId(alvo), 5)
    expect(screen.getByRole('dialog', { name: 'Surpresa' })).toBeInTheDocument()
    expect(screen.getByLabelText('palavra secreta')).toHaveAttribute('type', 'password')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('4 toques não abrem nada', () => {
    render(<Hero />)
    tocar(screen.getByTestId('retrato-mobile'), 4)
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('toques espaçados demais não abrem nada', () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    render(<Hero />)
    const retrato = screen.getByTestId('retrato-mobile')
    for (let i = 0; i < 5; i++) {
      fireEvent.click(retrato)
      vi.setSystemTime(Date.now() + 1000)
    }
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('a palavra certa mostra a foto e a mensagem que vêm do servidor', async () => {
    fetchMock.mockResolvedValue(resposta(200, SURPRESA))
    const user = userEvent.setup()
    render(<Hero />)
    tocar(screen.getByTestId('retrato-desktop'), 5)

    await user.type(screen.getByLabelText('palavra secreta'), 'nossa palavra')
    await user.click(screen.getByRole('button', { name: 'Abrir' }))

    expect(await screen.findByText(SURPRESA.mensagem)).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Nós dois' })).toHaveAttribute('src', SURPRESA.foto)
    expect(screen.getByText('Tech lead, cientista e engenheiro de dados.')).toBeInTheDocument()

    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('/api/surpresa')
    expect(init.method).toBe('POST')
    expect(JSON.parse(init.body)).toEqual({ senha: 'nossa palavra' })
  })

  it('depois de acertar, o aparelho é lembrado e abre direto da próxima vez', async () => {
    fetchMock.mockResolvedValue(resposta(200, SURPRESA))
    const user = userEvent.setup()
    const { unmount } = render(<Hero />)
    tocar(screen.getByTestId('retrato-mobile'), 5)
    await user.type(screen.getByLabelText('palavra secreta'), 'nossa palavra')
    await user.click(screen.getByRole('button', { name: 'Abrir' }))
    await screen.findByText(SURPRESA.mensagem)
    expect(localStorage.getItem('gr_surpresa')).toBe(SURPRESA.token)
    unmount()

    fetchMock.mockClear()
    render(<Hero />)
    tocar(screen.getByTestId('retrato-mobile'), 5)
    expect(await screen.findByText(SURPRESA.mensagem)).toBeInTheDocument()
    expect(screen.queryByLabelText('palavra secreta')).toBeNull()
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ token: SURPRESA.token })
  })

  it('token velho é esquecido e volta a pedir a palavra', async () => {
    localStorage.setItem('gr_surpresa', 'token-antigo')
    fetchMock.mockResolvedValue(resposta(401))
    render(<Hero />)
    tocar(screen.getByTestId('retrato-mobile'), 5)

    expect(await screen.findByLabelText('palavra secreta')).toBeInTheDocument()
    expect(localStorage.getItem('gr_surpresa')).toBeNull()
  })

  it.each([
    [401, 'Não é essa. Tenta de novo.'],
    [429, 'Muitas tentativas. Espera uns minutinhos.'],
    [404, 'Ainda não está pronta.'],
  ])('resposta %i mostra o aviso certo e não mostra foto', async (status, aviso) => {
    fetchMock.mockResolvedValue(resposta(status))
    const user = userEvent.setup()
    render(<Hero />)
    tocar(screen.getByTestId('retrato-mobile'), 5)
    await user.type(screen.getByLabelText('palavra secreta'), 'chute')
    await user.click(screen.getByRole('button', { name: 'Abrir' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(aviso)
    expect(screen.queryByRole('img', { name: 'Nós dois' })).toBeNull()
    expect(screen.getByLabelText('palavra secreta')).toHaveValue('')
    expect(localStorage.getItem('gr_surpresa')).toBeNull()
  })

  it('sem internet avisa e não quebra', async () => {
    fetchMock.mockRejectedValue(new Error('offline'))
    const user = userEvent.setup()
    render(<Hero />)
    tocar(screen.getByTestId('retrato-mobile'), 5)
    await user.type(screen.getByLabelText('palavra secreta'), 'chute')
    await user.click(screen.getByRole('button', { name: 'Abrir' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Sem conexão')
  })

  it('o botão Abrir fica desligado com o campo vazio', () => {
    render(<Hero />)
    tocar(screen.getByTestId('retrato-mobile'), 5)
    expect(screen.getByRole('button', { name: 'Abrir' })).toBeDisabled()
  })

  it('fecha com Escape, no botão e ao tocar fora', async () => {
    const user = userEvent.setup()
    render(<Hero />)
    const retrato = screen.getByTestId('retrato-mobile')

    tocar(retrato, 5)
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())

    tocar(retrato, 5)
    await user.click(screen.getByRole('button', { name: 'fechar' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())

    tocar(retrato, 5)
    await act(async () => {
      fireEvent.click(screen.getByRole('dialog').parentElement as HTMLElement)
    })
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  })
})

// Palavras que não podem aparecer no código público, guardadas só como SHA-256 para que
// este próprio teste não as revele.
const PALAVRAS_PROIBIDAS = new Set([
  '4081df7b72c0a9f11f5a8851a81ea552b948ef0c9de3430c51883cfbe30efeb7',
  'b1c1d73e5424eb64a8cc2d0949700541e78df8d6388441627f5dc0cbb1efbefe',
  '980045174dbdb33b054c18ffb0abe42cfd4732b38743a509f5dcd6f8e75d0137',
])

describe('Nada pessoal no código público', () => {
  it('nenhum arquivo do front tem o conteúdo da surpresa nem uma foto embutida', () => {
    const arquivos = import.meta.glob(['../**/*.{ts,tsx,css}', '!../**/*.test.{ts,tsx}'], {
      query: '?raw',
      import: 'default',
      eager: true,
    }) as Record<string, string>
    expect(Object.keys(arquivos).length).toBeGreaterThan(10)
    for (const [arquivo, conteudo] of Object.entries(arquivos)) {
      const palavras = new Set(conteudo.toLowerCase().match(/[a-zà-ÿ]+/g) ?? [])
      const achadas = [...palavras].filter((p) => PALAVRAS_PROIBIDAS.has(createHash('sha256').update(p).digest('hex')))
      expect({ arquivo, achadas }).toEqual({ arquivo, achadas: [] })
      expect({ arquivo, temFoto: /data:image\/jpe?g;base64,[A-Za-z0-9+/]{100}/.test(conteudo) }).toEqual({
        arquivo,
        temFoto: false,
      })
    }
  })
})
