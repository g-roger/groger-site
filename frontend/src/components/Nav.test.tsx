import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { LangProvider } from '../lib/i18n'
import { strings } from '../strings'
import Nav, { navLinks } from './Nav'

const SECOES = [
  ['sobre', '#about'],
  ['áreas', '#expertise'],
  ['ferramentas', '#stack'],
  ['trajetória', '#trajetoria'],
  ['projetos', '#projetos'],
  ['contato', '#contato'],
] as const

afterEach(() => {
  document.body.style.overflow = ''
})

describe('Nav', () => {
  it('mostra o cargo ao lado da marca', () => {
    render(<Nav />)
    expect(screen.getByText('tech lead, cientista e engenheiro de dados')).toBeInTheDocument()
  })

  it('a marca leva ao topo da página', () => {
    render(<Nav />)
    expect(screen.getByRole('link', { name: /g·r/ })).toHaveAttribute('href', '#top')
  })

  it('a lista de seções tem as seis seções, na ordem da página', () => {
    expect(navLinks(strings.pt).map((l) => [l.label, l.href])).toEqual(SECOES.map((s) => [...s]))
  })

  it.each(SECOES)('o link "%s" da barra aponta para %s', (nome, href) => {
    render(<Nav />)
    const barra = screen.getByRole('navigation', { name: 'Seções' })
    expect(within(barra).getByRole('link', { name: nome })).toHaveAttribute('href', href)
  })
})

describe('Nav: menu do celular', () => {
  it('começa fechado, com o botão de abrir e sem o painel', () => {
    render(<Nav />)
    const botao = screen.getByRole('button', { name: 'Abrir menu' })
    expect(botao).toHaveAttribute('aria-expanded', 'false')
    expect(botao).toHaveAttribute('aria-controls', 'menu-celular')
    expect(screen.queryByRole('navigation', { name: 'Menu' })).toBeNull()
  })

  it('abre com as seis seções numeradas, todas com alvo de toque grande', async () => {
    const user = userEvent.setup()
    render(<Nav />)
    await user.click(screen.getByRole('button', { name: 'Abrir menu' }))

    const painel = screen.getByRole('navigation', { name: 'Menu' })
    expect(painel).toHaveAttribute('id', 'menu-celular')
    const itens = within(painel).getAllByRole('link')
    expect(itens.map((a) => a.getAttribute('href'))).toEqual(SECOES.map((s) => s[1]))
    expect(itens.map((a) => a.textContent)).toEqual(SECOES.map(([nome], i) => `0${i + 1}${nome}`))
    for (const a of itens) expect(a.className).toContain('min-h-[64px]')

    const botao = screen.getByRole('button', { name: 'Fechar menu' })
    expect(botao).toHaveAttribute('aria-expanded', 'true')
  })

  it('trava a rolagem da página enquanto está aberto', async () => {
    const user = userEvent.setup()
    render(<Nav />)
    await user.click(screen.getByRole('button', { name: 'Abrir menu' }))
    expect(document.body.style.overflow).toBe('hidden')
  })

  it.each(SECOES)('tocar em "%s" fecha o menu e libera a rolagem', async (nome) => {
    const user = userEvent.setup()
    render(<Nav />)
    await user.click(screen.getByRole('button', { name: 'Abrir menu' }))
    const painel = screen.getByRole('navigation', { name: 'Menu' })
    await user.click(within(painel).getByRole('link', { name: new RegExp(nome) }))

    await waitFor(() => expect(screen.queryByRole('navigation', { name: 'Menu' })).toBeNull())
    expect(document.body.style.overflow).toBe('')
    expect(screen.getByRole('button', { name: 'Abrir menu' })).toHaveAttribute('aria-expanded', 'false')
  })

  it('fecha com Escape', async () => {
    const user = userEvent.setup()
    render(<Nav />)
    await user.click(screen.getByRole('button', { name: 'Abrir menu' }))
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('navigation', { name: 'Menu' })).toBeNull())
    expect(document.body.style.overflow).toBe('')
  })

  it('fecha no segundo toque no botão', async () => {
    const user = userEvent.setup()
    render(<Nav />)
    await user.click(screen.getByRole('button', { name: 'Abrir menu' }))
    await user.click(screen.getByRole('button', { name: 'Fechar menu' }))
    await waitFor(() => expect(screen.queryByRole('navigation', { name: 'Menu' })).toBeNull())
  })

  it('fecha sozinho se a tela passar a ser de computador', async () => {
    const user = userEvent.setup()
    render(<Nav />)
    await user.click(screen.getByRole('button', { name: 'Abrir menu' }))

    Object.defineProperty(window, 'innerWidth', { value: 1024, configurable: true })
    window.dispatchEvent(new Event('resize'))

    await waitFor(() => expect(screen.queryByRole('navigation', { name: 'Menu' })).toBeNull())
    Object.defineProperty(window, 'innerWidth', { value: 1024, configurable: true })
  })

  it('o botão do menu tem área de toque de pelo menos 44 px', () => {
    render(<Nav />)
    const botao = screen.getByRole('button', { name: 'Abrir menu' })
    expect(botao.className).toContain('w-12')
    expect(botao.className).toContain('h-12')
  })
})

describe('Nav em inglês', () => {
  const SECOES_EN = [
    ['about', '#about'],
    ['expertise', '#expertise'],
    ['tools', '#stack'],
    ['career', '#career'],
    ['projects', '#projects'],
    ['contact', '#contact'],
  ] as const

  const renderEn = () =>
    render(
      <LangProvider lang="en">
        <Nav />
      </LangProvider>,
    )

  it('a lista de seções usa os nomes e os ids em inglês', () => {
    expect(navLinks(strings.en).map((l) => [l.label, l.href])).toEqual(SECOES_EN.map((s) => [...s]))
  })

  it('mostra o cargo em inglês ao lado da marca', () => {
    renderEn()
    expect(screen.getByText('tech lead, data scientist and data engineer')).toBeInTheDocument()
  })

  it.each(SECOES_EN)('o link "%s" da barra aponta para %s', (nome, href) => {
    renderEn()
    const barra = screen.getByRole('navigation', { name: 'Sections' })
    expect(within(barra).getByRole('link', { name: nome })).toHaveAttribute('href', href)
  })

  it('o menu do celular tem rótulos e itens em inglês', async () => {
    const user = userEvent.setup()
    renderEn()
    await user.click(screen.getByRole('button', { name: 'Open menu' }))
    const painel = screen.getByRole('navigation', { name: 'Menu' })
    expect(within(painel).getAllByRole('link').map((a) => a.textContent)).toEqual(
      SECOES_EN.map(([nome], i) => `0${i + 1}${nome}`),
    )
    expect(screen.getByRole('button', { name: 'Close menu' })).toHaveAttribute('aria-expanded', 'true')
  })

  it('o seletor de idioma fica na barra, ao lado do botão do menu', () => {
    renderEn()
    const barra = screen.getByRole('banner')
    expect(within(barra).getByRole('group', { name: 'Language' })).toBeInTheDocument()
  })
})

describe('Nav: seletor de idioma no topo', () => {
  it('aparece na barra em português também, antes do botão do menu', () => {
    render(<Nav />)
    const grupo = screen.getByRole('group', { name: 'Idioma' })
    const botao = screen.getByRole('button', { name: 'Abrir menu' })
    expect(grupo.compareDocumentPosition(botao) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })
})
