import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { trackEvent } from './lib/track'
import Site from './Site'

vi.mock('./lib/track', () => ({ trackEvent: vi.fn(), trackPageview: vi.fn() }))

function Local() {
  const { pathname, hash } = useLocation()
  return <output data-testid="local">{pathname + hash}</output>
}

function montar(entrada: string) {
  return render(
    <MemoryRouter initialEntries={[entrada]}>
      <Local />
      <Routes>
        <Route path="/" element={<Site />} />
        <Route path="/en" element={<Site />} />
      </Routes>
    </MemoryRouter>,
  )
}

const local = () => screen.getByTestId('local').textContent
const titulo = () => screen.getByRole('heading', { level: 1 })

describe('Site: idioma pela URL', () => {
  beforeEach(() => {
    vi.mocked(trackEvent).mockClear()
  })

  it('"/" abre em português', () => {
    montar('/')
    expect(titulo()).toHaveTextContent('Tech lead, cientista e engenheiro de dados.')
    expect(document.documentElement.lang).toBe('pt-BR')
    expect(document.title).toBe('Gabriel Roger | Tech Lead, Cientista e Engenheiro de Dados')
  })

  it('"/en" abre em inglês', () => {
    montar('/en')
    expect(titulo()).toHaveTextContent('Tech lead, data scientist and data engineer.')
    expect(document.documentElement.lang).toBe('en')
    expect(document.title).toBe('Gabriel Roger | Tech Lead, Data Scientist and Data Engineer')
  })

  it('"/en/" (com barra no fim) também abre em inglês', () => {
    montar('/en/')
    expect(titulo()).toHaveTextContent('Tech lead, data scientist and data engineer.')
  })

  it('o idioma atual aparece marcado no seletor', () => {
    montar('/en')
    expect(screen.getByRole('link', { name: 'English' })).toHaveAttribute('aria-current', 'true')
    expect(screen.getByRole('link', { name: 'Português' })).not.toHaveAttribute('aria-current')
  })
})

describe('Site: trocar de idioma', () => {
  beforeEach(() => {
    vi.mocked(trackEvent).mockClear()
  })

  it('de português para inglês muda a URL e o texto, sem recarregar', async () => {
    const user = userEvent.setup()
    montar('/')

    await user.click(screen.getByRole('link', { name: 'English' }))

    await waitFor(() => expect(local()).toBe('/en'))
    expect(titulo()).toHaveTextContent('Tech lead, data scientist and data engineer.')
    expect(document.documentElement.lang).toBe('en')
    expect(screen.getByRole('heading', { level: 2, name: 'About me' })).toBeInTheDocument()
    expect(trackEvent).toHaveBeenCalledWith('language_switch', { to: 'en' })
  })

  it('de inglês para português volta para a raiz', async () => {
    const user = userEvent.setup()
    montar('/en')

    await user.click(screen.getByRole('link', { name: 'Português' }))

    await waitFor(() => expect(local()).toBe('/'))
    expect(titulo()).toHaveTextContent('Tech lead, cientista e engenheiro de dados.')
    expect(document.documentElement.lang).toBe('pt-BR')
    expect(trackEvent).toHaveBeenCalledWith('language_switch', { to: 'pt' })
  })

  it('a seção do hash acompanha: #projetos vira #projects', async () => {
    const user = userEvent.setup()
    montar('/#projetos')

    await user.click(screen.getByRole('link', { name: 'English' }))

    await waitFor(() => expect(local()).toBe('/en#projects'))
    expect(document.getElementById('projects')).not.toBeNull()
  })

  it('usa o hash da janela quando o roteador não ficou sabendo da âncora (Safari)', async () => {
    const user = userEvent.setup()
    montar('/')
    window.history.replaceState(null, '', '/#projetos')

    await user.click(screen.getByRole('link', { name: 'English' }))

    await waitFor(() => expect(local()).toBe('/en#projects'))
    window.history.replaceState(null, '', '/')
  })

  it('e de volta: #career vira #trajetoria', async () => {
    const user = userEvent.setup()
    montar('/en#career')

    await user.click(screen.getByRole('link', { name: 'Português' }))

    await waitFor(() => expect(local()).toBe('/#trajetoria'))
    expect(document.getElementById('trajetoria')).not.toBeNull()
  })

  it('ida e volta deixa a página como estava', async () => {
    const user = userEvent.setup()
    montar('/')
    // só as seções de texto: os contadores dos números ainda estão animando
    const texto = () =>
      ['about', 'expertise', 'stack', 'trajetoria', 'projetos', 'contato']
        .map((id) => document.getElementById(id)?.textContent)
        .join('|')
    const antes = texto()

    await user.click(screen.getByRole('link', { name: 'English' }))
    await waitFor(() => expect(local()).toBe('/en'))
    await user.click(screen.getByRole('link', { name: 'Português' }))
    await waitFor(() => expect(local()).toBe('/'))

    expect(texto()).toBe(antes)
  })

  it('tocar no idioma que já está ativo não navega', async () => {
    const user = userEvent.setup()
    montar('/en')
    await user.click(screen.getByRole('link', { name: 'English' }))
    expect(local()).toBe('/en')
    expect(trackEvent).not.toHaveBeenCalled()
  })
})
