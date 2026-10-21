import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { LangProvider, type Lang } from '../lib/i18n'
import { trackEvent } from '../lib/track'
import LanguageSwitch from './LanguageSwitch'

vi.mock('../lib/track', () => ({ trackEvent: vi.fn(), trackPageview: vi.fn() }))

function montar(lang: Lang, onSwitch?: (l: Lang) => void) {
  return render(
    <LangProvider lang={lang} onSwitch={onSwitch}>
      <LanguageSwitch />
    </LangProvider>,
  )
}

// Dispara um clique e diz se o link foi impedido de navegar. Depois de ler, impede de qualquer jeito,
// porque o jsdom não sabe navegar e só reclamaria.
function clicar(el: Element, init: MouseEventInit = {}): boolean {
  let impedido = false
  const ler = (e: Event) => {
    impedido = e.defaultPrevented
    e.preventDefault()
  }
  document.addEventListener('click', ler)
  el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, ...init }))
  document.removeEventListener('click', ler)
  return impedido
}

describe('LanguageSwitch', () => {
  beforeEach(() => {
    vi.mocked(trackEvent).mockClear()
  })

  it('mostra PT e EN como links para "/" e "/en"', () => {
    montar('pt')
    const grupo = screen.getByRole('group', { name: 'Idioma' })
    expect(within(grupo).getByRole('link', { name: 'Português' })).toHaveAttribute('href', '/')
    expect(within(grupo).getByRole('link', { name: 'English' })).toHaveAttribute('href', '/en')
    expect(within(grupo).getAllByRole('link').map((a) => a.textContent)).toEqual(['pt', 'en'])
  })

  it('o nome do grupo acompanha o idioma da página', () => {
    montar('en')
    expect(screen.getByRole('group', { name: 'Language' })).toBeInTheDocument()
  })

  it.each([
    ['pt', 'Português', 'English'],
    ['en', 'English', 'Português'],
  ] as const)('em "%s" só o idioma atual fica marcado', (lang, atual, outro) => {
    montar(lang)
    expect(screen.getByRole('link', { name: atual })).toHaveAttribute('aria-current', 'true')
    expect(screen.getByRole('link', { name: outro })).not.toHaveAttribute('aria-current')
  })

  it('cada link declara o idioma da versão para a qual leva', () => {
    montar('pt')
    expect(screen.getByRole('link', { name: 'Português' })).toHaveAttribute('hreflang', 'pt-BR')
    expect(screen.getByRole('link', { name: 'English' })).toHaveAttribute('hreflang', 'en')
    expect(screen.getByRole('link', { name: 'English' })).toHaveAttribute('lang', 'en')
  })

  it('tocar no outro idioma troca sem recarregar e registra o evento', async () => {
    const user = userEvent.setup()
    const trocar = vi.fn()
    montar('pt', trocar)

    await user.click(screen.getByRole('link', { name: 'English' }))

    expect(trocar).toHaveBeenCalledExactlyOnceWith('en')
    expect(trackEvent).toHaveBeenCalledWith('language_switch', { to: 'en' })
  })

  it('tocar no idioma que já está ativo não faz nada', async () => {
    const user = userEvent.setup()
    const trocar = vi.fn()
    montar('en', trocar)

    await user.click(screen.getByRole('link', { name: 'English' }))

    expect(trocar).not.toHaveBeenCalled()
    expect(trackEvent).not.toHaveBeenCalled()
  })

  it.each([{ ctrlKey: true }, { metaKey: true }, { shiftKey: true }])(
    'clique com %o abre a outra versão em nova aba, como qualquer link',
    (modificador) => {
      const trocar = vi.fn()
      montar('pt', trocar)

      expect(clicar(screen.getByRole('link', { name: 'English' }), modificador)).toBe(false)
      expect(trocar).not.toHaveBeenCalled()
    },
  )

  it('um clique normal impede a navegação do link (a troca é feita pelo roteador)', () => {
    montar('pt', vi.fn())
    expect(clicar(screen.getByRole('link', { name: 'English' }))).toBe(true)
  })

  it('fora de um roteador o link funciona como link comum', () => {
    montar('pt')
    expect(clicar(screen.getByRole('link', { name: 'English' }))).toBe(false)
    expect(trackEvent).not.toHaveBeenCalled()
  })

  it('cada opção tem área de toque de pelo menos 44 px', () => {
    montar('pt')
    for (const a of screen.getAllByRole('link')) {
      expect(a.className).toContain('min-w-[44px]')
      expect(a.className).toContain('min-h-[44px]')
    }
  })
})
