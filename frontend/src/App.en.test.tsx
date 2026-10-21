import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import App from './App'
import { LangProvider } from './lib/i18n'
import { trechosEmPortugues } from './test/portugues'
import * as en from './data.en'

vi.mock('./lib/track', () => ({ trackEvent: vi.fn(), trackPageview: vi.fn() }))

const SECOES = ['top', 'about', 'expertise', 'stack', 'career', 'projects', 'contact']

const normalizar = (texto: string | null) => (texto ?? '').replace(/\s+/g, ' ').trim()

function pagina() {
  return render(
    <LangProvider lang="en">
      <App />
    </LangProvider>,
  )
}

// o texto que a pessoa lê e os rótulos que o leitor de tela lê
function tudoQueSeLe(): string[] {
  const rotulos = Array.from(document.querySelectorAll('[aria-label]'))
    .map((el) => el.getAttribute('aria-label') as string)
    // "Português" é o nome do idioma escrito no próprio idioma
    .filter((r) => r !== 'Português')
  return [document.body.textContent ?? '', ...rotulos]
}

describe('App em inglês, a página inteira', () => {
  it('tem todas as seções, cada uma uma única vez, com ids em inglês', () => {
    pagina()
    for (const id of SECOES) expect(document.querySelectorAll(`#${id}`)).toHaveLength(1)
    for (const idAntigo of ['trajetoria', 'projetos', 'contato']) expect(document.getElementById(idAntigo)).toBeNull()
  })

  it('os títulos das seções estão na ordem certa', () => {
    pagina()
    const titulos = screen.getAllByRole('heading', { level: 2 }).map((h) => normalizar(h.textContent))
    expect(titulos).toEqual(['About me', 'What I do', 'What I use', 'My journey', 'Selected projects', 'Get in touch'])
  })

  it('a numeração das seções é sequencial, sem pular número', () => {
    pagina()
    const numeros = Array.from(document.querySelectorAll('span'))
      .map((s) => normalizar(s.textContent))
      .filter((t) => /^0[1-9]$/.test(t))
    expect(numeros).toEqual(['01', '02', '03', '04', '05', '06'])
  })

  it('todo link de seção, no menu e no hero, leva a uma seção que existe', () => {
    pagina()
    const ancoras = Array.from(document.querySelectorAll('a[href^="#"]')).map((a) => a.getAttribute('href') as string)
    expect(ancoras.length).toBeGreaterThanOrEqual(8)
    for (const href of ancoras) expect(document.getElementById(href.slice(1))).not.toBeNull()
  })

  it('apresenta o Gabriel como tech lead, cientista e engenheiro de dados', () => {
    pagina()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Tech lead, data scientist and data engineer.')
    expect(screen.getByText("Hi, I'm Gabriel")).toBeInTheDocument()
    expect(document.body.textContent).not.toMatch(/tech lead and (data )?engineer/i)
  })

  it('não sobrou nenhum trecho em português, nem no texto nem nos rótulos de acessibilidade', () => {
    pagina()
    const achados = tudoQueSeLe().flatMap((t) => trechosEmPortugues(t))
    expect(achados).toEqual([])
  })

  it('também sem português depois de abrir a lista completa de projetos', async () => {
    const user = userEvent.setup()
    pagina()
    await user.click(screen.getByRole('button', { name: `Show all ${en.projects.length} projects` }))
    await waitFor(() => expect(screen.getAllByRole('heading', { level: 4 })).toHaveLength(en.projects.length))
    expect(tudoQueSeLe().flatMap((t) => trechosEmPortugues(t))).toEqual([])
  })

  it('não tem travessão nem meia-risca em nenhum texto da página', () => {
    pagina()
    expect(document.body.textContent).not.toMatch(/[—–]/)
  })

  it('não expõe e-mail, telefone nem links de contato direto', () => {
    const { container } = pagina()
    const texto = document.body.textContent ?? ''
    expect(texto).not.toMatch(/[\w.+-]+@[\w-]+\.[\w.-]+/)
    expect(texto).not.toMatch(/gmail/i)
    expect(texto).not.toMatch(/(\+?55\s?)?\(?\d{2}\)?\s?9?\d{4}[-\s]?\d{4}/)
    expect(container.querySelectorAll('a[href^="mailto:"], a[href^="tel:"], a[href^="https://wa.me"]')).toHaveLength(0)
  })

  it('os únicos links externos são LinkedIn, GitHub e projetos do g-roger, com rel seguro', () => {
    pagina()
    const externos = Array.from(document.querySelectorAll('a[href^="http"]'))
    expect(externos.length).toBeGreaterThan(0)
    for (const a of externos) {
      expect(a.getAttribute('href')).toMatch(/^https:\/\/(www\.linkedin\.com\/in\/gabriel-roger|github\.com\/g-roger(\/[\w.-]+)?)$/)
      expect(a.getAttribute('rel')).toContain('noopener')
    }
  })

  it('os links do seletor de idioma são os únicos internos fora das âncoras', () => {
    pagina()
    const internos = Array.from(document.querySelectorAll('a[href^="/"]')).map((a) => a.getAttribute('href'))
    expect(internos).toEqual(['/', '/en'])
  })
})

describe('App em inglês, seção por seção', () => {
  it('Hero: botões, empresas e legenda do retrato', () => {
    pagina()
    const hero = document.getElementById('top') as HTMLElement
    expect(within(hero).getByRole('link', { name: /see projects/i })).toHaveAttribute('href', '#projects')
    expect(within(hero).getByRole('link', { name: /what i do/i })).toHaveAttribute('href', '#expertise')
    for (const texto of ['Tech lead at CERC', 'PagBank', 'Mastertech', 'MBA at FIAP']) {
      expect(within(hero).getByText(texto)).toBeInTheDocument()
    }
    expect(within(hero).getByText('me, in a drawing')).toBeInTheDocument()
    expect(document.querySelectorAll('svg[aria-label="Illustrated portrait"]').length).toBeGreaterThanOrEqual(1)
  })

  it('Sobre: a trajetória passo a passo, em ordem, com os destaques', () => {
    pagina()
    const sobre = document.getElementById('about') as HTMLElement
    const texto = within(sobre).getByText(/I got here step by step/).textContent ?? ''
    const etapas = [
      'I started in 2013 teaching computer classes',
      'did a software development internship at Ponte21',
      'at Mastertech, grew into a senior software engineer',
      'In 2021 I moved into data',
      'I joined PagBank as a mid-level data engineer',
      'became a senior data scientist',
    ]
    const posicoes = etapas.map((e) => texto.indexOf(e))
    expect(posicoes.every((p) => p >= 0)).toBe(true)
    expect(posicoes).toEqual([...posicoes].sort((a, b) => a - b))
    for (const destaque of ['tech lead', 'credit and account security', 'payment arrangements', 'fraud models', 'AI agents']) {
      expect(within(sobre).getByText(destaque)).toBeInTheDocument()
    }
    expect(within(sobre).getByText('Itaú, Santander, Vivo, Globo, Disney, Facebook and IBM')).toBeInTheDocument()
  })

  it('Números: rótulos em inglês', () => {
    pagina()
    for (const stat of en.careerStats()) expect(screen.getByText(stat.label)).toBeInTheDocument()
  })

  it('O que eu faço: cartões em inglês e o modal abre e fecha com rótulos em inglês', async () => {
    const user = userEvent.setup()
    pagina()
    const secao = document.getElementById('expertise') as HTMLElement
    expect(within(secao).getByText('Click an area to see the animation and a quick explanation.')).toBeInTheDocument()
    for (const e of en.expertises) expect(within(secao).getByRole('heading', { level: 3, name: e.title })).toBeInTheDocument()

    await user.click(within(secao).getByRole('button', { name: /Behavioral biometrics/ }))
    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getByText('area')).toBeInTheDocument()
    for (const p of en.expertises[2].paragraphs) expect(within(dialog).getByText(p)).toBeInTheDocument()

    await user.click(within(dialog).getByRole('button', { name: 'close' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull(), { timeout: 3000 })
  })

  it('Ferramentas: categorias em inglês', () => {
    pagina()
    const secao = document.getElementById('stack') as HTMLElement
    for (const c of en.techStack) expect(within(secao).getByRole('heading', { level: 3, name: c.name })).toBeInTheDocument()
    expect(within(secao).getByText('AI agents')).toBeInTheDocument()
  })

  it('Trajetória: cargos em inglês, na ordem dos dados, e os clientes da Mastertech', () => {
    pagina()
    const secao = document.getElementById('career') as HTMLElement
    expect(within(secao).getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual(en.timeline.map((t) => t.role))
    expect(within(secao).getByText('Clients and partners')).toBeInTheDocument()
    expect(within(secao).getByText('and others')).toBeInTheDocument()
    expect(within(secao).getByText('2026 to present')).toBeInTheDocument()
  })

  it('Projetos: filtros em inglês, e escolher um tema mostra só os projetos dele', async () => {
    const user = userEvent.setup()
    pagina()
    const grupo = screen.getByRole('group', { name: 'Filter projects by topic' })
    expect(within(grupo).getByRole('button', { name: `All (${en.projects.length})` })).toHaveAttribute('aria-pressed', 'true')

    await user.click(within(grupo).getByRole('button', { name: /^Fraud and security/ }))
    const esperados = en.projects.filter((p) => p.categories.includes('fraude')).map((p) => p.name)
    await waitFor(() => expect(screen.getAllByRole('heading', { level: 4 }).map((h) => h.textContent)).toEqual(esperados))
  })

  it('Projetos: "Personal project" aparece nos projetos pessoais', async () => {
    const user = userEvent.setup()
    pagina()
    await user.click(screen.getByRole('button', { name: /Show all/ }))
    await waitFor(() => expect(screen.getAllByRole('heading', { level: 4 })).toHaveLength(en.projects.length))
    expect(screen.getAllByText('Personal project')).toHaveLength(2)
  })

  it('Contato: textos em inglês, só LinkedIn e GitHub', () => {
    pagina()
    expect(screen.getByRole('heading', { level: 2, name: 'Get in touch' })).toBeInTheDocument()
    expect(screen.getByText('The best way to reach me is on LinkedIn. My open projects are on GitHub.')).toBeInTheDocument()
    expect(screen.getByText('Open my LinkedIn')).toBeInTheDocument()
    expect(screen.getByText('São Paulo, Brazil')).toBeInTheDocument()
  })

  it('Rodapé: só o nome e o ano', () => {
    pagina()
    expect(screen.getByText(`© ${new Date().getFullYear()} Gabriel Roger`)).toBeInTheDocument()
  })
})
