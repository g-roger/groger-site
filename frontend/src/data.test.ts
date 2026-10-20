import { describe, expect, it } from 'vitest'
import { careerStats, expertises, projectCategories, projects, techStack, timeline } from './data'

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

function startYear(period: string): number {
  return Number(period.slice(0, 4))
}

describe('estilo dos textos', () => {
  const textos = collectStrings([expertises, projects, timeline, techStack, careerStats()])

  it('não usa travessão nem meia-risca', () => {
    expect(textos.filter((t) => /[—–]/.test(t))).toEqual([])
  })

  it('não usa ponto mediano como separador', () => {
    expect(textos.filter((t) => t.includes('·'))).toEqual([])
  })

  it('não tem texto vazio nem espaços sobrando', () => {
    expect(textos.filter((t) => t.trim() === '' || t !== t.trim() || /\s{2,}/.test(t))).toEqual([])
  })
})

describe('áreas de atuação', () => {
  const ilustracoes = ['shield', 'mouse', 'credit', 'pipeline', 'llm', 'fingerprint']

  it('tem chaves e títulos únicos', () => {
    expect(new Set(expertises.map((e) => e.key)).size).toBe(expertises.length)
    expect(new Set(expertises.map((e) => e.title)).size).toBe(expertises.length)
  })

  it('cobre os temas principais do currículo', () => {
    const titulos = expertises.map((e) => e.title)
    expect(titulos).toEqual(
      expect.arrayContaining([
        'Segurança da conta',
        'Device fingerprint',
        'Biometria comportamental',
        'Ciclo de crédito',
        'Engenharia de dados',
        'Agentes de IA e LLM',
      ]),
    )
  })

  it.each(expertises.map((e) => [e.key, e] as const))('%s tem ilustração, cor e explicação', (_key, e) => {
    expect(ilustracoes).toContain(e.illustration)
    expect(e.color).toMatch(/^#[0-9a-f]{6}$/i)
    expect(e.short.length).toBeGreaterThan(10)
    expect(e.paragraphs.length).toBeGreaterThanOrEqual(1)
    expect(e.keywords.length).toBeGreaterThanOrEqual(1)
  })
})

describe('projetos', () => {
  it('tem nomes únicos', () => {
    expect(new Set(projects.map((p) => p.name)).size).toBe(projects.length)
  })

  it('só linka para repositórios do g-roger no GitHub', () => {
    const urls = projects.filter((p) => p.url).map((p) => p.url as string)
    expect(urls.length).toBeGreaterThan(0)
    for (const url of urls) expect(url).toMatch(/^https:\/\/github\.com\/g-roger\/[\w.-]+$/)
  })

  it('mantém os quatro projetos abertos do currículo com link', () => {
    const comLink = projects.filter((p) => p.url).map((p) => p.name)
    expect(comLink).toEqual(
      expect.arrayContaining(['fraud-pix-model', 'mouse_dynamics', 'analise-vegetativa-bemagro', 'moip-sdk-python']),
    )
  })

  it.each(projects.map((p) => [p.name, p] as const))('%s tem descrição, tags, origem, tema e ano válido', (_name, p) => {
    expect(p.tagline.length).toBeGreaterThan(5)
    expect(p.description.length).toBeGreaterThan(30)
    expect(p.tags.length).toBeGreaterThan(0)
    expect(['CERC', 'PagBank', 'Mastertech', 'GitHub', 'Projeto pessoal']).toContain(p.where)
    expect(p.categories.length).toBeGreaterThan(0)
    for (const c of p.categories) expect(projectCategories.map((x) => x.key)).toContain(c)
    if (p.year) expect(p.year).toMatch(/^\d{4}( a \d{4})?$/)
  })

  it('o GaJa não aparece, porque ainda não foi para o ar', () => {
    expect(projects.map((p) => p.name.toLowerCase()).join(' ')).not.toContain('gaja')
    expect(collectStrings(projects).join(' ')).not.toMatch(/saltitare|ballet/i)
  })

  it('projetos do trabalho não têm link: o código é das empresas', () => {
    for (const p of projects.filter((x) => ['CERC', 'PagBank', 'Mastertech'].includes(x.where))) {
      expect(p.url).toBeUndefined()
    }
  })

  it('todo projeto com link é do GitHub e todo projeto do GitHub tem link', () => {
    for (const p of projects) expect(Boolean(p.url)).toBe(p.where === 'GitHub')
  })

  it('mostra os projetos bancários do currículo', () => {
    const nomes = projects.map((p) => p.name)
    expect(nomes).toEqual(
      expect.arrayContaining([
        'Modelos de fraude em arranjos de pagamento',
        'Modelos do ciclo de crédito',
        'Previsão de TPV diário',
        'Score de dispositivo para segurança da conta',
        'Modelos de biometria comportamental',
      ]),
    )
  })

  it('o projeto de fraude é da CERC, onde ele trabalha hoje', () => {
    expect(projects.find((p) => p.name === 'Modelos de fraude em arranjos de pagamento')?.where).toBe('CERC')
  })

  it('os projetos atuais da CERC vêm primeiro', () => {
    expect(projects.slice(0, 3).every((p) => p.where === 'CERC')).toBe(true)
  })

  it('cada tema tem pelo menos dois projetos', () => {
    for (const c of projectCategories) {
      expect(projects.filter((p) => p.categories.includes(c.key)).length).toBeGreaterThanOrEqual(2)
    }
  })
})

describe('trajetória', () => {
  it('usa o formato "2022 a 2026" ou "2026 até hoje" nos períodos', () => {
    for (const t of timeline) expect(t.period).toMatch(/^\d{4}( até hoje| a \d{4})$/)
  })

  it('está em ordem cronológica, da mais recente para a mais antiga', () => {
    const anos = timeline.map((t) => startYear(t.period))
    expect(anos).toEqual([...anos].sort((a, b) => b - a))
  })

  it('o primeiro item é o cargo atual', () => {
    expect(timeline[0].period).toMatch(/até hoje$/)
    expect(timeline[0].place).toContain('CERC')
  })

  it('na CERC o cargo é tech lead e engenheiro de dados sênior', () => {
    const cerc = timeline.find((t) => t.place.includes('CERC'))
    expect(cerc?.role).toBe('Tech Lead e Engenheiro de Dados Sênior')
    expect(cerc?.bullets).toContain('Liderança técnica dos projetos de dados')
  })

  it('na CERC aparecem os modelos de fraude em arranjos de pagamento', () => {
    const cerc = timeline.find((t) => t.place.includes('CERC'))
    expect(cerc?.detail).toContain('modelos de fraude')
    expect(cerc?.bullets).toContain('Modelos de fraude em arranjos de pagamento')
  })

  it('na Mastertech o cargo é engenheiro de software back-end sênior, alcançado ao longo do tempo', () => {
    const mastertech = timeline.find((t) => t.place === 'Mastertech')
    expect(mastertech?.role).toBe('Engenheiro de Software Back-End Sênior')
    expect(mastertech?.detail.startsWith('Entrei como engenheiro de software back-end e cresci até sênior.')).toBe(true)
  })

  it('no PagBank aparecem os dois cargos, cientista sênior e engenheiro pleno', () => {
    const papeis = timeline.filter((t) => t.place.startsWith('PagBank')).map((t) => t.role)
    expect(papeis).toEqual(['Cientista de Dados Sênior', 'Engenheiro de Dados Pleno'])
  })

  it('a Awari é marcada como paralela ao PagBank', () => {
    expect(timeline.find((t) => t.place.startsWith('Awari'))?.place).toContain('em paralelo ao PagBank')
  })

  it('lista os clientes e parceiros da Mastertech', () => {
    const clientes = timeline.find((t) => t.place === 'Mastertech')?.clients ?? []
    for (const nome of [
      'Itaú',
      'Santander',
      'Vivo',
      'Porto',
      'Disney',
      'IBM',
      'Heineken',
      'Bayer',
      'C&A',
      'Icatu Seguros',
      'Banco Omni',
      'Sebrae',
      'ETEC',
    ]) {
      expect(clientes).toContain(nome)
    }
    expect(clientes.some((c) => c.startsWith('Globo') && c.includes('Projeto Globo Led'))).toBe(true)
    expect(clientes.some((c) => c.startsWith('Facebook') && c.includes('Projeto Estação Hack'))).toBe(true)
    expect(clientes).toContain('e outros')
    expect(new Set(clientes).size).toBe(clientes.length)
  })

  it('descreve a Mastertech como consultoria em grandes empresas, como design partner', () => {
    const mastertech = timeline.find((t) => t.place === 'Mastertech')
    expect(mastertech?.detail).toContain('consultoria para grandes empresas')
    expect(mastertech?.detail).toContain('design partner')
    const destaques = mastertech?.bullets?.join(' ') ?? ''
    expect(destaques).toContain('Prototipação de produtos')
    expect(destaques).toContain('big data')
    expect(destaques).toContain('educação')
    expect(destaques).toContain('adotar e inserir uma nova tecnologia')
  })

  it('só a Mastertech tem lista de clientes', () => {
    expect(timeline.filter((t) => t.clients).map((t) => t.place)).toEqual(['Mastertech'])
  })

  it('todo item tem cargo, local, descrição e tecnologias', () => {
    for (const t of timeline) {
      expect(t.role).not.toBe('')
      expect(t.place).not.toBe('')
      expect(t.detail.length).toBeGreaterThan(30)
      expect(t.tags?.length ?? 0).toBeGreaterThan(0)
    }
  })
})

describe('ferramentas', () => {
  it('tem categorias com nome único e itens sem repetição', () => {
    expect(new Set(techStack.map((c) => c.name)).size).toBe(techStack.length)
    for (const c of techStack) {
      expect(c.items.length).toBeGreaterThan(0)
      expect(new Set(c.items).size).toBe(c.items.length)
      expect(c.color).toMatch(/^#[0-9a-f]{6}$/i)
    }
  })

  it('inclui o que o currículo cita como base do dia a dia', () => {
    const todas = techStack.flatMap((c) => c.items)
    for (const tech of ['Python', 'SQL', 'PySpark', 'Databricks', 'Delta Lake', 'Airflow', 'Kafka', 'scikit-learn']) {
      expect(todas).toContain(tech)
    }
  })
})

describe('números da carreira', () => {
  it('conta os anos de carreira a partir de 2013', () => {
    expect(careerStats(new Date('2026-10-20'))[0].n).toBe(13)
    expect(careerStats(new Date('2027-01-02'))[0].n).toBe(14)
  })

  it('mantém os demais números do currículo', () => {
    const [, pagbank, empresas, awari] = careerStats(new Date('2026-10-20'))
    expect(pagbank.n).toBe(5)
    expect(empresas).toMatchObject({ n: 15, suffix: '+' })
    expect(awari.n).toBe(3)
  })

  it('conta as empresas da Mastertech a partir da própria lista de clientes', () => {
    const clientes = timeline.find((t) => t.place === 'Mastertech')?.clients ?? []
    const nomeados = clientes.filter((c) => c !== 'e outros').length
    expect(careerStats()[2].n).toBe(nomeados)
  })

  it('tem um rótulo para cada número', () => {
    for (const s of careerStats()) expect(s.label.length).toBeGreaterThan(10)
  })
})
