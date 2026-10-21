import { describe, expect, it } from 'vitest'
import { strings } from './strings'
import { trechosEmPortugues } from './test/portugues'

type Folha = { caminho: string; valor: unknown }

function folhas(valor: unknown, caminho = ''): Folha[] {
  if (Array.isArray(valor)) return valor.flatMap((v, i) => folhas(v, `${caminho}[${i}]`))
  if (valor && typeof valor === 'object') {
    return Object.entries(valor).flatMap(([k, v]) => folhas(v, caminho ? `${caminho}.${k}` : k))
  }
  return [{ caminho, valor }]
}

const pt = folhas(strings.pt)
const en = folhas(strings.en)

// textos que são iguais nos dois idiomas de propósito (nomes próprios, termos técnicos, ids)
const IGUAIS_DE_PROPOSITO = new Set([
  'anchors.about',
  'anchors.expertise',
  'anchors.stack',
  'nav.menu', // "Menu" é igual nos dois
  'hero.titleLead', // "Tech lead,"
  'hero.places[1]', // PagBank
  'hero.places[2]', // Mastertech
  'language.pt',
  'language.en',
])
// termos técnicos da fileira de tecnologias
const MARQUEE_IGUAL = /^marquee\[/

describe('strings: português e inglês', () => {
  it('têm exatamente os mesmos textos, na mesma estrutura', () => {
    expect(en.map((f) => f.caminho)).toEqual(pt.map((f) => f.caminho))
  })

  it('nenhum texto do inglês ficou igual ao português sem ser de propósito', () => {
    const iguais = pt
      .filter((f, i) => typeof f.valor === 'string' && f.valor === en[i].valor)
      .map((f) => f.caminho)
      .filter((c) => !IGUAIS_DE_PROPOSITO.has(c) && !MARQUEE_IGUAL.test(c))
    expect(iguais).toEqual([])
  })

  it('só "Agentes de IA" muda na fileira de tecnologias', () => {
    const diferentes = strings.pt.marquee.filter((p, i) => p !== strings.en.marquee[i])
    expect(diferentes).toEqual(['Agentes de IA'])
    expect(strings.en.marquee).toContain('AI agents')
  })

  it('o inglês não tem trechos em português', () => {
    const textos = en.flatMap((f) => (typeof f.valor === 'string' ? [f.valor] : []))
    textos.push(strings.en.projects.showAll(12))
    // "Português" é o nome do idioma escrito no próprio idioma
    const achados = textos
      .filter((t) => t !== 'Português')
      .flatMap((t) => trechosEmPortugues(t).map((p) => `"${p}" em: ${t.slice(0, 60)}`))
    expect(achados).toEqual([])
  })

  it.each(['pt', 'en'] as const)('"%s": sem travessão, sem espaço sobrando e com os destaques bem fechados', (lang) => {
    const textos = folhas(strings[lang]).flatMap((f) => (typeof f.valor === 'string' ? [f.valor] : []))
    expect(textos.filter((t) => /[—–]/.test(t))).toEqual([])
    expect(textos.filter((t) => t.trim() !== t || /\s{2,}/.test(t))).toEqual([])
    // cada *destaque* abre e fecha: quantidade par de asteriscos
    expect(textos.filter((t) => (t.match(/\*/g) ?? []).length % 2 !== 0)).toEqual([])
  })

  it.each(['pt', 'en'] as const)('"%s": os ids das seções são únicos e válidos', (lang) => {
    const ids = Object.values(strings[lang].anchors)
    expect(new Set(ids).size).toBe(ids.length)
    for (const id of ids) expect(id).toMatch(/^[a-z][a-z-]*$/)
  })

  it('os ids em português continuam os de sempre (links antigos seguem funcionando)', () => {
    expect(strings.pt.anchors).toEqual({
      about: 'about',
      expertise: 'expertise',
      stack: 'stack',
      career: 'trajetoria',
      projects: 'projetos',
      contact: 'contato',
    })
  })

  it('cada idioma declara o próprio <html lang>, título e descrição', () => {
    expect(strings.pt.htmlLang).toBe('pt-BR')
    expect(strings.en.htmlLang).toBe('en')
    expect(strings.pt.meta.title).toBe('Gabriel Roger | Tech Lead, Cientista e Engenheiro de Dados')
    expect(strings.en.meta.title).toBe('Gabriel Roger | Tech Lead, Data Scientist and Data Engineer')
    expect(strings.en.meta.description.length).toBeGreaterThan(60)
    expect(strings.en.meta.description.length).toBeLessThanOrEqual(200)
  })

  it('o contador de projetos fala a língua certa', () => {
    expect(strings.pt.projects.showAll(23)).toBe('Ver todos os 23 projetos')
    expect(strings.en.projects.showAll(23)).toBe('Show all 23 projects')
  })
})
