import { useCallback, useRef } from 'react'

// Nada pessoal fica neste código (o repositório é público): a foto e a mensagem vêm do
// servidor, e só depois que a palavra secreta confere.

export type Surpresa = { mensagem: string; foto: string; token: string }

export type Resultado =
  | { ok: true; surpresa: Surpresa }
  | { ok: false; motivo: 'errada' | 'bloqueado' | 'indisponivel' | 'rede' }

const CHAVE_TOKEN = 'gr_surpresa'

export function tokenGuardado(): string | null {
  try {
    return localStorage.getItem(CHAVE_TOKEN)
  } catch {
    return null
  }
}

function guardarToken(token: string | null) {
  try {
    if (token) localStorage.setItem(CHAVE_TOKEN, token)
    else localStorage.removeItem(CHAVE_TOKEN)
  } catch {
    /* navegação anônima: só não lembra o aparelho */
  }
}

export async function abrirSurpresa(credencial: { senha: string } | { token: string }): Promise<Resultado> {
  let r: Response
  try {
    r = await fetch('/api/surpresa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credencial),
    })
  } catch {
    return { ok: false, motivo: 'rede' }
  }

  if (r.status === 200) {
    const surpresa = (await r.json()) as Surpresa
    guardarToken(surpresa.token)
    return { ok: true, surpresa }
  }
  if ('token' in credencial) guardarToken(null) // token velho: esquece e pede a palavra
  if (r.status === 429) return { ok: false, motivo: 'bloqueado' }
  if (r.status === 404) return { ok: false, motivo: 'indisponivel' }
  return { ok: false, motivo: 'errada' }
}

/** Chama `onLiberar` quando o elemento recebe `toques` cliques/toques dentro de `janelaMs`. */
export function useToquesSecretos(onLiberar: () => void, toques = 5, janelaMs = 3000) {
  const momentos = useRef<number[]>([])
  return useCallback(() => {
    const agora = Date.now()
    momentos.current = [...momentos.current.filter((t) => agora - t < janelaMs), agora]
    if (momentos.current.length >= toques) {
      momentos.current = []
      onLiberar()
    }
  }, [onLiberar, toques, janelaMs])
}
