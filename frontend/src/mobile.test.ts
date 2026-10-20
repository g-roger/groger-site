import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

// Regras do layout de celular que são fáceis de quebrar sem perceber, lidas direto do código-fonte.

const SRC = __dirname

function arquivos(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const caminho = join(dir, e.name)
    if (e.isDirectory()) return arquivos(caminho)
    return /\.(tsx?|css)$/.test(e.name) && !/\.test\./.test(e.name) ? [caminho] : []
  })
}

const fontes = arquivos(SRC).map((f) => ({ f: f.replace(SRC + '/', ''), texto: readFileSync(f, 'utf8') }))

describe('layout de celular, regras no código', () => {
  it('nenhum texto abaixo de 11px', () => {
    const achados = fontes.flatMap(({ f, texto }) =>
      [...texto.matchAll(/text-\[(\d+(?:\.\d+)?)px\]/g)]
        .filter((m) => Number(m[1]) < 11)
        .map((m) => `${f}: ${m[0]}`),
    )
    expect(achados).toEqual([])
  })

  it('backdrop-blur só do sm em diante (pesa muito em celular), exceto na barra do topo', () => {
    const achados = fontes.flatMap(({ f, texto }) =>
      texto
        .split('\n')
        .filter((l) => /(^|[\s"'`])backdrop-blur/.test(l) && !/sm:backdrop-blur|md:backdrop-blur/.test(l))
        .map((l) => `${f}: ${l.trim()}`),
    )
    // a barra de navegação e os painéis de tela cheia são os únicos que podem borrar sempre
    const permitidos = achados.filter((a) => !/^components\/(Nav|Surprise|Expertise)\.tsx/.test(a))
    expect(permitidos).toEqual([])
  })

  it('a página não pode rolar para o lado: overflow-x contido no body', () => {
    const css = readFileSync(join(SRC, 'index.css'), 'utf8')
    expect(css).toMatch(/overflow-x:\s*(hidden|clip)/)
  })

  it('o index.html usa viewport-fit=cover para respeitar a área segura do iPhone', () => {
    const html = readFileSync(join(SRC, '..', 'index.html'), 'utf8')
    expect(html).toContain('viewport-fit=cover')
    expect(html).toContain('width=device-width')
  })

  it('o CSS marca as âncoras com scroll-margin para a barra fixa não cobrir os títulos', () => {
    const css = readFileSync(join(SRC, 'index.css'), 'utf8')
    expect(css).toMatch(/scroll-margin-top/)
    expect(css).toMatch(/scroll-behavior:\s*smooth/)
  })
})
