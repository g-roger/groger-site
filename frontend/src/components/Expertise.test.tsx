import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { expertises } from '../data'
import { trackEvent } from '../lib/track'
import ExpertiseSection from './Expertise'

vi.mock('../lib/track', () => ({ trackEvent: vi.fn(), trackPageview: vi.fn() }))

const primeira = expertises[0]

async function abrir(user: ReturnType<typeof userEvent.setup>, titulo: string) {
  await user.click(screen.getByRole('button', { name: new RegExp(titulo) }))
  return screen.findByRole('dialog')
}

async function esperarFechar() {
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull(), { timeout: 3000 })
}

describe('Expertise', () => {
  beforeEach(() => {
    vi.mocked(trackEvent).mockClear()
  })

  it('o título é "O que eu faço"', () => {
    render(<ExpertiseSection />)
    expect(screen.getByRole('heading', { level: 2, name: 'O que eu faço' })).toBeInTheDocument()
  })

  it('mostra um cartão para cada área, com o resumo', () => {
    render(<ExpertiseSection />)
    expect(screen.getAllByRole('button')).toHaveLength(expertises.length)
    for (const e of expertises) {
      expect(screen.getByRole('heading', { level: 3, name: e.title })).toBeInTheDocument()
      expect(screen.getByText(e.short)).toBeInTheDocument()
    }
  })

  it('começa sem nenhum modal aberto', () => {
    render(<ExpertiseSection />)
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('abre o modal com a explicação da área e registra o evento', async () => {
    const user = userEvent.setup()
    render(<ExpertiseSection />)

    const dialog = await abrir(user, primeira.title)

    expect(within(dialog).getByRole('heading', { name: primeira.title })).toBeInTheDocument()
    for (const p of primeira.paragraphs) expect(within(dialog).getByText(p)).toBeInTheDocument()
    expect(trackEvent).toHaveBeenCalledWith('expertise_open', { key: primeira.key })
  })

  it.each(expertises.map((e) => [e.title, e] as const))('abre a explicação de "%s"', async (_titulo, e) => {
    const user = userEvent.setup()
    render(<ExpertiseSection />)

    const dialog = await abrir(user, e.title)
    expect(within(dialog).getByText(e.paragraphs[0])).toBeInTheDocument()
  })

  it('trava a rolagem da página enquanto o modal está aberto e libera ao fechar', async () => {
    const user = userEvent.setup()
    render(<ExpertiseSection />)

    await abrir(user, primeira.title)
    expect(document.body.style.overflow).toBe('hidden')

    await user.keyboard('{Escape}')
    await esperarFechar()
    expect(document.body.style.overflow).toBe('')
  })

  it('fecha com a tecla Escape', async () => {
    const user = userEvent.setup()
    render(<ExpertiseSection />)

    await abrir(user, primeira.title)
    await user.keyboard('{Escape}')
    await esperarFechar()
  })

  it('fecha no botão de fechar', async () => {
    const user = userEvent.setup()
    render(<ExpertiseSection />)

    const dialog = await abrir(user, primeira.title)
    await user.click(within(dialog).getByRole('button', { name: 'fechar' }))
    await esperarFechar()
  })

  it('fecha ao clicar fora do modal, mas não ao clicar dentro', async () => {
    const user = userEvent.setup()
    render(<ExpertiseSection />)

    const dialog = await abrir(user, primeira.title)
    await user.click(within(dialog).getByText(primeira.paragraphs[0]))
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await user.click(dialog.parentElement as HTMLElement)
    await esperarFechar()
  })
})
