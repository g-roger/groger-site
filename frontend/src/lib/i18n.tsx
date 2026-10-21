import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react'
import * as dataPt from '../data'
import * as dataEn from '../data.en'
import { strings, type Strings } from '../strings'

export type Lang = 'pt' | 'en'

export const LANGS: Lang[] = ['pt', 'en']

// A URL é a fonte da verdade: "/" é português e "/en" é inglês. Assim cada versão tem o seu
// endereço para compartilhar, e o idioma não depende de cookie nem de localStorage.
export function langFromPath(pathname: string): Lang {
  return /^\/en(\/|$)/.test(pathname) ? 'en' : 'pt'
}

export function pathFor(lang: Lang): string {
  return lang === 'en' ? '/en' : '/'
}

/** O hash de uma seção (#projetos) vira o da mesma seção no outro idioma (#projects). */
export function translateHash(hash: string, from: Lang, to: Lang): string {
  if (!hash || from === to) return hash
  const id = hash.replace(/^#/, '')
  const key = (Object.keys(strings[from].anchors) as (keyof Strings['anchors'])[]).find(
    (k) => strings[from].anchors[k] === id,
  )
  return key ? `#${strings[to].anchors[key]}` : hash
}

const conteudo = { pt: dataPt, en: dataEn }
export type Content = typeof dataPt

type Contexto = { lang: Lang; onSwitch?: (lang: Lang) => void }

const LangContext = createContext<Contexto>({ lang: 'pt' })

/**
 * Define o idioma da página e mantém <html lang>, o título e a descrição em sincronia.
 * Sem este provider tudo cai em português, que é o que os componentes mostravam antes.
 */
export function LangProvider({
  lang,
  onSwitch,
  children,
}: {
  lang: Lang
  onSwitch?: (lang: Lang) => void
  children: ReactNode
}) {
  const ui = strings[lang]

  useEffect(() => {
    document.documentElement.lang = ui.htmlLang
    document.title = ui.meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', ui.meta.description)
  }, [ui])

  const value = useMemo(() => ({ lang, onSwitch }), [lang, onSwitch])
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang(): Lang {
  return useContext(LangContext).lang
}

/** Troca de idioma sem recarregar a página. Fica indefinido fora de um roteador (nos testes, por exemplo). */
export function useOnSwitchLang() {
  return useContext(LangContext).onSwitch
}

export function useStrings(): Strings {
  return strings[useLang()]
}

export function useContent(): Content {
  return conteudo[useLang()]
}
