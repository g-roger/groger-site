import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import App from './App'
import { LangProvider, langFromPath, pathFor, translateHash, type Lang } from './lib/i18n'

// "/" é o site em português e "/en" é o mesmo site em inglês. A troca é uma navegação de verdade
// (a URL muda), mas sem recarregar: a pessoa continua no mesmo ponto da página.
export default function Site() {
  const { pathname, hash } = useLocation()
  const navigate = useNavigate()
  const lang = langFromPath(pathname)
  const trocar = useCallback(
    // o hash vem também da janela: alguns navegadores não avisam o roteador ao clicar numa âncora
    (para: Lang) => navigate({ pathname: pathFor(para), hash: translateHash(window.location.hash || hash, lang, para) }),
    [navigate, hash, lang],
  )
  return (
    <LangProvider lang={lang} onSwitch={trocar}>
      <App />
    </LangProvider>
  )
}
