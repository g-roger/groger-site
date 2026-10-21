import { render, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import * as dataEn from '../data.en'
import * as dataPt from '../data'
import { strings } from '../strings'
import { LangProvider, langFromPath, pathFor, translateHash, useContent, useLang, useStrings, type Lang } from './i18n'

describe('langFromPath', () => {
  it.each([
    ['/', 'pt'],
    ['/en', 'en'],
    ['/en/', 'en'],
    ['/en/qualquer', 'en'],
    ['/admin', 'pt'],
    ['/english', 'pt'],
    ['/energia', 'pt'],
    ['/pt', 'pt'],
    ['', 'pt'],
  ] as const)('%s é %s', (caminho, esperado) => {
    expect(langFromPath(caminho)).toBe(esperado)
  })
})

describe('pathFor', () => {
  it('português fica na raiz e inglês em /en', () => {
    expect(pathFor('pt')).toBe('/')
    expect(pathFor('en')).toBe('/en')
  })

  it.each(['pt', 'en'] as const)('é o contrário de langFromPath em "%s"', (lang) => {
    expect(langFromPath(pathFor(lang))).toBe(lang)
  })
})

describe('translateHash', () => {
  it.each([
    ['#trajetoria', 'pt', 'en', '#career'],
    ['#projetos', 'pt', 'en', '#projects'],
    ['#contato', 'pt', 'en', '#contact'],
    ['#about', 'pt', 'en', '#about'],
    ['#career', 'en', 'pt', '#trajetoria'],
    ['#projects', 'en', 'pt', '#projetos'],
    ['#contact', 'en', 'pt', '#contato'],
  ] as const)('%s (%s) vira %s em %s', (hash, de, para, esperado) => {
    expect(translateHash(hash, de, para)).toBe(esperado)
  })

  it('deixa quieto o que não é uma seção, ou quando o idioma não muda', () => {
    expect(translateHash('', 'pt', 'en')).toBe('')
    expect(translateHash('#top', 'pt', 'en')).toBe('#top')
    expect(translateHash('#qualquer-coisa', 'pt', 'en')).toBe('#qualquer-coisa')
    expect(translateHash('#projetos', 'pt', 'pt')).toBe('#projetos')
  })
})

describe('LangProvider', () => {
  let descricao: HTMLMetaElement

  beforeEach(() => {
    descricao = document.createElement('meta')
    descricao.name = 'description'
    descricao.content = 'original'
    document.head.appendChild(descricao)
  })

  afterEach(() => {
    descricao.remove()
    document.documentElement.lang = ''
  })

  it.each(['pt', 'en'] as const)('em "%s" ajusta o <html lang>, o título e a descrição', (lang: Lang) => {
    render(<LangProvider lang={lang}>{null}</LangProvider>)
    expect(document.documentElement.lang).toBe(strings[lang].htmlLang)
    expect(document.title).toBe(strings[lang].meta.title)
    expect(descricao.content).toBe(strings[lang].meta.description)
  })

  it('acompanha a troca de idioma', () => {
    const { rerender } = render(<LangProvider lang="pt">{null}</LangProvider>)
    rerender(<LangProvider lang="en">{null}</LangProvider>)
    expect(document.documentElement.lang).toBe('en')
    expect(document.title).toBe('Gabriel Roger | Tech Lead, Data Scientist and Data Engineer')
    rerender(<LangProvider lang="pt">{null}</LangProvider>)
    expect(document.documentElement.lang).toBe('pt-BR')
  })

  it('não quebra se a página não tiver <meta name="description">', () => {
    descricao.remove()
    expect(() => render(<LangProvider lang="en">{null}</LangProvider>)).not.toThrow()
  })
})

describe('hooks', () => {
  const com = (lang: Lang) => ({ children }: { children: ReactNode }) => <LangProvider lang={lang}>{children}</LangProvider>

  it('sem provider tudo cai em português', () => {
    expect(renderHook(() => useLang()).result.current).toBe('pt')
    expect(renderHook(() => useStrings()).result.current).toBe(strings.pt)
    expect(renderHook(() => useContent()).result.current.expertises).toBe(dataPt.expertises)
  })

  it('em inglês entregam os textos e o conteúdo em inglês', () => {
    expect(renderHook(() => useLang(), { wrapper: com('en') }).result.current).toBe('en')
    expect(renderHook(() => useStrings(), { wrapper: com('en') }).result.current).toBe(strings.en)
    expect(renderHook(() => useContent(), { wrapper: com('en') }).result.current.projects).toBe(dataEn.projects)
  })
})
