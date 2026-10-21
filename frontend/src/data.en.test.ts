import { describe, expect, it } from 'vitest'
import * as pt from './data'
import * as en from './data.en'
import { trechosEmPortugues } from './test/portugues'

// campos que não são texto de tela (identificadores, cores, links e sufixo numérico opcional)
const NAO_E_TEXTO = new Set(['key', 'color', 'illustration', 'url', 'suffix'])

function collectStrings(value: unknown, out: string[] = []): string[] {
  if (typeof value === 'string') out.push(value)
  else if (Array.isArray(value)) value.forEach((v) => collectStrings(v, out))
  else if (value && typeof value === 'object') {
    for (const [chave, v] of Object.entries(value)) if (!NAO_E_TEXTO.has(chave)) collectStrings(v, out)
  }
  return out
}

// "2022 to 2026" e "2026 to present" são o mesmo período de "2022 a 2026" e "2026 até hoje"
function periodoEmPortugues(period: string): string {
  return period.replace(' to present', ' até hoje').replace(' to ', ' a ')
}

const ONDE: Record<string, string> = { 'Personal project': 'Projeto pessoal' }

describe('estilo dos textos em inglês', () => {
  const textos = collectStrings([en.expertises, en.projects, en.timeline, en.techStack, en.careerStats()])

  it('não usa travessão nem meia-risca', () => {
    expect(textos.filter((t) => /[—–]/.test(t))).toEqual([])
  })

  it('não usa ponto mediano como separador', () => {
    expect(textos.filter((t) => t.includes('·'))).toEqual([])
  })

  it('não tem texto vazio nem espaços sobrando', () => {
    expect(textos.filter((t) => t.trim() === '' || t !== t.trim() || /\s{2,}/.test(t))).toEqual([])
  })

  it('não sobrou nenhum trecho em português', () => {
    const achados = textos.flatMap((t) => trechosEmPortugues(t).map((p) => `"${p}" em: ${t.slice(0, 60)}`))
    expect(achados).toEqual([])
  })

  it('não conta com que tecnologia o site foi feito', () => {
    expect(textos.join(' ')).not.toMatch(/GaJa|Saltitare|ballet/i)
  })
})

describe('inglês acompanha o português', () => {
  it('áreas: mesmas chaves, ilustrações, cores e quantidade de parágrafos e palavras-chave', () => {
    expect(en.expertises.map((e) => e.key)).toEqual(pt.expertises.map((e) => e.key))
    pt.expertises.forEach((p, i) => {
      const e = en.expertises[i]
      expect([e.illustration, e.color, e.paragraphs.length, e.keywords.length]).toEqual([
        p.illustration,
        p.color,
        p.paragraphs.length,
        p.keywords.length,
      ])
    })
    expect(new Set(en.expertises.map((e) => e.title)).size).toBe(en.expertises.length)
  })

  it('temas de projeto: mesmas chaves, na mesma ordem', () => {
    expect(en.projectCategories.map((c) => c.key)).toEqual(pt.projectCategories.map((c) => c.key))
  })

  it('projetos: mesma quantidade, ordem, links, temas, tags e anos', () => {
    expect(en.projects).toHaveLength(pt.projects.length)
    pt.projects.forEach((p, i) => {
      const e = en.projects[i]
      expect({ url: e.url, categories: e.categories, tags: e.tags.length }).toEqual({
        url: p.url,
        categories: p.categories,
        tags: p.tags.length,
      })
      expect(ONDE[e.where] ?? e.where).toBe(p.where)
      expect(e.year && periodoEmPortugues(e.year)).toBe(p.year)
    })
  })

  it('projetos: nomes únicos, e os do GitHub mantêm o nome do repositório', () => {
    expect(new Set(en.projects.map((p) => p.name)).size).toBe(en.projects.length)
    pt.projects.forEach((p, i) => {
      if (p.url) expect(en.projects[i].name).toBe(p.name)
    })
  })

  it('projetos: só os do GitHub têm link, e só para repositórios do g-roger', () => {
    for (const p of en.projects) {
      expect(Boolean(p.url)).toBe(p.where === 'GitHub')
      if (p.url) expect(p.url).toMatch(/^https:\/\/github\.com\/g-roger\/[\w.-]+$/)
    }
  })

  it('projetos: os da CERC vêm primeiro e cada tema tem pelo menos dois', () => {
    expect(en.projects.slice(0, 3).every((p) => p.where === 'CERC')).toBe(true)
    for (const c of en.projectCategories) {
      expect(en.projects.filter((p) => p.categories.includes(c.key)).length).toBeGreaterThanOrEqual(2)
    }
  })

  it('trajetória: mesma quantidade, períodos, destaques, clientes e tecnologias', () => {
    expect(en.timeline).toHaveLength(pt.timeline.length)
    pt.timeline.forEach((p, i) => {
      const e = en.timeline[i]
      expect(periodoEmPortugues(e.period)).toBe(p.period)
      expect([e.bullets?.length, e.clients?.length, e.tags?.length]).toEqual([
        p.bullets?.length,
        p.clients?.length,
        p.tags?.length,
      ])
    })
  })

  it('trajetória: os nomes dos clientes são os mesmos, só o "e outros" e os projetos mudam', () => {
    const clientes = (t: { clients?: string[] }) => t.clients ?? []
    const ptNomes = clientes(pt.timeline.find((t) => t.place === 'Mastertech')!)
    const enNomes = clientes(en.timeline.find((t) => t.place === 'Mastertech')!)
    ptNomes.forEach((nome, i) => {
      if (nome === 'e outros') expect(enNomes[i]).toBe('and others')
      else if (nome.includes('(')) expect(enNomes[i].split(' (')[0]).toBe(nome.split(' (')[0])
      else expect(enNomes[i]).toBe(nome)
    })
    expect(enNomes.some((c) => c.startsWith('Globo') && c.includes('Globo Led project'))).toBe(true)
    expect(enNomes.some((c) => c.startsWith('Facebook') && c.includes('Estação Hack project'))).toBe(true)
    expect(new Set(enNomes).size).toBe(enNomes.length)
  })

  it('ferramentas: mesmas categorias, cores e itens (só "Agentes de IA" muda de nome)', () => {
    expect(en.techStack).toHaveLength(pt.techStack.length)
    pt.techStack.forEach((c, i) => {
      const e = en.techStack[i]
      expect(e.color).toBe(c.color)
      expect(e.items.map((item) => item)).toEqual(c.items.map((item) => (item === 'Agentes de IA' ? 'AI agents' : item)))
    })
    expect(new Set(en.techStack.map((c) => c.name)).size).toBe(en.techStack.length)
  })

  it('números da carreira: os mesmos valores, com rótulos em inglês', () => {
    for (const quando of [new Date('2026-10-20'), new Date('2027-01-02')]) {
      const a = pt.careerStats(quando).map(({ n, suffix }) => ({ n, suffix }))
      const b = en.careerStats(quando).map(({ n, suffix }) => ({ n, suffix }))
      expect(b).toEqual(a)
    }
    for (const s of en.careerStats()) expect(s.label.length).toBeGreaterThan(10)
  })
})

describe('fatos da carreira em inglês', () => {
  const place = (nome: string) => en.timeline.find((t) => t.place === nome || t.place.startsWith(nome))

  it('na CERC o cargo é tech lead, cientista e engenheiro de dados', () => {
    const cerc = place('CERC')
    expect(cerc?.period).toBe('2026 to present')
    expect(cerc?.role).toBe('Tech Lead, Data Scientist and Data Engineer')
    expect(cerc?.bullets).toContain('Technical leadership of the data projects')
    expect(cerc?.bullets).toContain('Fraud models in payment arrangements')
    expect(cerc?.detail).toContain('fraud models')
  })

  it('na Mastertech o cargo é sênior, alcançado ao longo do tempo, em consultoria como design partner', () => {
    const m = place('Mastertech')
    expect(m?.role).toBe('Senior Back-End Software Engineer')
    expect(m?.detail.startsWith('I joined as a back-end software engineer and grew to senior.')).toBe(true)
    expect(m?.detail).toContain('consulting for large companies')
    expect(m?.detail).toContain('design partner')
  })

  it('no PagBank aparecem os dois cargos, cientista sênior e engenheiro pleno', () => {
    const papeis = en.timeline.filter((t) => t.place.startsWith('PagBank')).map((t) => t.role)
    expect(papeis).toEqual(['Senior Data Scientist', 'Mid-level Data Engineer'])
  })

  it('a Awari é marcada como paralela ao PagBank', () => {
    expect(place('Awari')?.place).toContain('alongside PagBank')
  })

  it('o projeto de fraude é da CERC e os bancários do currículo estão presentes', () => {
    const nomes = en.projects.map((p) => p.name)
    expect(en.projects.find((p) => p.name === 'Fraud models in payment arrangements')?.where).toBe('CERC')
    expect(nomes).toEqual(
      expect.arrayContaining([
        'Credit cycle models',
        'Daily TPV forecast',
        'Device score for account security',
        'Behavioral biometrics models',
      ]),
    )
  })

  it('as áreas cobrem os temas principais do currículo', () => {
    expect(en.expertises.map((e) => e.title)).toEqual(
      expect.arrayContaining([
        'Account security',
        'Device fingerprint',
        'Behavioral biometrics',
        'Credit cycle',
        'Data engineering',
        'AI agents and LLMs',
      ]),
    )
  })
})
