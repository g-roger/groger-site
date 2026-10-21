// Textos da interface nos dois idiomas. O conteúdo longo (projetos, trajetória, áreas) fica em
// data.ts e data.en.ts. O inglês é tipado como `typeof pt`: esquecer uma chave não compila.
//
// Nos textos, *assim* marca um trecho em destaque (o componente Rich troca por <span>).

const pt = {
  htmlLang: 'pt-BR',
  meta: {
    title: 'Gabriel Roger | Tech Lead, Cientista e Engenheiro de Dados',
    description:
      'Gabriel Roger é tech lead, cientista e engenheiro de dados em São Paulo. Trabalha com ciclo de crédito, segurança de contas, biometria comportamental e arranjos de pagamento.',
  },

  // ids das seções. Em inglês a URL fica /en#projects em vez de /en#projetos.
  anchors: {
    about: 'about',
    expertise: 'expertise',
    stack: 'stack',
    career: 'trajetoria',
    projects: 'projetos',
    contact: 'contato',
  },

  nav: {
    brandRole: 'tech lead, cientista e engenheiro de dados',
    sections: 'Seções',
    menu: 'Menu',
    openMenu: 'Abrir menu',
    closeMenu: 'Fechar menu',
    links: {
      about: 'sobre',
      expertise: 'áreas',
      stack: 'ferramentas',
      career: 'trajetória',
      projects: 'projetos',
      contact: 'contato',
    },
  },

  language: {
    group: 'Idioma',
    pt: 'Português',
    en: 'English',
  },

  hero: {
    greeting: 'Olá, eu sou o Gabriel',
    titleLead: 'Tech lead,',
    titleAccent: 'cientista e engenheiro de dados.',
    intro:
      'Hoje sou tech lead na CERC, em projetos de arranjos de pagamento e modelos de fraude. Antes passei cinco anos no PagBank, com segurança de contas e modelos de crédito.',
    seeProjects: 'Ver projetos',
    whatIDo: 'O que eu faço',
    places: ['Tech lead na CERC', 'PagBank', 'Mastertech', 'MBA na FIAP'],
    portraitCaption: 'eu, em desenho',
    portraitLabel: 'Retrato ilustrado',
    scroll: 'rolar',
  },

  about: {
    heading: { lead: 'Sobre', accent: 'mim' },
    paragraphs: [
      'Sou *tech lead*, cientista e engenheiro de dados, e cheguei aqui passo a passo. Comecei em 2013 dando aula de informática, fiz estágio em desenvolvimento na Ponte21 e, na Mastertech, cresci até engenheiro de software sênior, em projetos de consultoria dentro de grandes empresas. Em 2021 mudei para dados: entrei no PagBank como engenheiro de dados pleno e me tornei cientista de dados sênior, trabalhando com *crédito e segurança de contas*.',
      'Hoje, na CERC, sou tech lead, cientista e engenheiro de dados, em projetos de *arranjos de pagamento* que envolvem grandes clientes de crédito do Brasil. Desenvolvo *modelos de fraude*, faço análises e reports para esses clientes, modelagem sobre os dados da CERC, como duplicata e arranjos, e uso *agentes de IA* em projetos com LLM.',
      'Na Mastertech, de 2017 a 2021, entrei em projetos de empresas como *Itaú, Santander, Vivo, Globo, Disney, Facebook e IBM*. Atuava como design partner, alocado no cliente ou junto com a equipe dele dentro da Mastertech, e os projetos passavam por prototipação de produtos, desenvolvimento, análise de dados em big data, educação e adoção de novas tecnologias pelos profissionais.',
      'Ensinar sempre fez parte do caminho. Dei aula no Grupo All Net, fiz projetos de educação e treinamentos pela Mastertech e fui instrutor e mentor de dados na Awari de 2022 a 2025.',
    ],
  },

  numbersLocale: 'pt-BR',

  expertise: {
    heading: { lead: 'O que eu', accent: 'faço' },
    hint: 'Clique em uma área para ver a animação e uma explicação rápida.',
    open: 'abrir',
    close: 'fechar',
    area: 'área',
  },

  marquee: [
    'Python', 'PySpark', 'Databricks', 'Delta Lake', 'Airflow', 'Kafka',
    'FastAPI', 'scikit-learn', 'TensorFlow', 'Keras', 'SHAP', 'AWS SageMaker',
    'Redshift', 'MongoDB', 'Vertex AI', 'Agentes de IA', 'Docker', 'Fly.dev',
    'Power BI', 'React', 'TypeScript',
  ],

  stack: {
    heading: { lead: 'O que eu', accent: 'uso' },
    intro: 'Linguagens, bibliotecas e plataformas com as quais trabalho, separadas por área.',
  },

  career: {
    heading: { lead: 'Minha', accent: 'trajetória' },
    intro: 'Onde trabalhei e o que fiz em cada lugar.',
    clients: 'Clientes e parceiros',
  },

  projects: {
    heading: { lead: 'Alguns', accent: 'projetos' },
    intro:
      'Os do trabalho aparecem só com a descrição, porque o código é das empresas. Os que têm seta levam ao repositório no GitHub.',
    filterLabel: 'Filtrar projetos por tema',
    all: 'Todos',
    showAll: (n: number) => `Ver todos os ${n} projetos`,
  },

  contact: {
    heading: { lead: 'Fale', accent: 'comigo' },
    intro: 'O melhor jeito de falar comigo é pelo LinkedIn. Os projetos abertos estão no GitHub.',
    linkedinShort: 'Abrir meu LinkedIn',
    location: 'São Paulo, Brasil',
  },
}

export type Strings = typeof pt

const en: Strings = {
  htmlLang: 'en',
  meta: {
    title: 'Gabriel Roger | Tech Lead, Data Scientist and Data Engineer',
    description:
      'Gabriel Roger is a tech lead, data scientist and data engineer in São Paulo. He works on the credit cycle, account security, behavioral biometrics and payment arrangements.',
  },

  anchors: {
    about: 'about',
    expertise: 'expertise',
    stack: 'stack',
    career: 'career',
    projects: 'projects',
    contact: 'contact',
  },

  nav: {
    brandRole: 'tech lead, data scientist and data engineer',
    sections: 'Sections',
    menu: 'Menu',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    links: {
      about: 'about',
      expertise: 'expertise',
      stack: 'tools',
      career: 'career',
      projects: 'projects',
      contact: 'contact',
    },
  },

  language: {
    group: 'Language',
    pt: 'Português',
    en: 'English',
  },

  hero: {
    greeting: "Hi, I'm Gabriel",
    titleLead: 'Tech lead,',
    titleAccent: 'data scientist and data engineer.',
    intro:
      "Today I'm a tech lead at CERC, working on payment arrangements and fraud models. Before that, I spent five years at PagBank, on account security and credit models.",
    seeProjects: 'See projects',
    whatIDo: 'What I do',
    places: ['Tech lead at CERC', 'PagBank', 'Mastertech', 'MBA at FIAP'],
    portraitCaption: 'me, in a drawing',
    portraitLabel: 'Illustrated portrait',
    scroll: 'scroll',
  },

  about: {
    heading: { lead: 'About', accent: 'me' },
    paragraphs: [
      "I'm a *tech lead*, data scientist and data engineer, and I got here step by step. I started in 2013 teaching computer classes, did a software development internship at Ponte21 and, at Mastertech, grew into a senior software engineer, on consulting projects inside large companies. In 2021 I moved into data: I joined PagBank as a mid-level data engineer and became a senior data scientist, working on *credit and account security*.",
      "Today, at CERC, I'm a tech lead, data scientist and data engineer, on *payment arrangements* projects that involve large credit clients in Brazil. I build *fraud models*, run analyses and reports for those clients, model CERC's data, such as trade receivables (duplicatas) and arrangements, and use *AI agents* in LLM projects.",
      'At Mastertech, from 2017 to 2021, I joined projects for companies like *Itaú, Santander, Vivo, Globo, Disney, Facebook and IBM*. I worked as a design partner, either placed at the client or alongside their team inside Mastertech, and the projects covered product prototyping, development, big data analysis, education and helping professionals adopt new technologies.',
      'Teaching has always been part of the path. I taught at Grupo All Net, worked on education projects and trainings at Mastertech, and was a data instructor and mentor at Awari from 2022 to 2025.',
    ],
  },

  numbersLocale: 'en-US',

  expertise: {
    heading: { lead: 'What I', accent: 'do' },
    hint: 'Click an area to see the animation and a quick explanation.',
    open: 'open',
    close: 'close',
    area: 'area',
  },

  marquee: [
    'Python', 'PySpark', 'Databricks', 'Delta Lake', 'Airflow', 'Kafka',
    'FastAPI', 'scikit-learn', 'TensorFlow', 'Keras', 'SHAP', 'AWS SageMaker',
    'Redshift', 'MongoDB', 'Vertex AI', 'AI agents', 'Docker', 'Fly.dev',
    'Power BI', 'React', 'TypeScript',
  ],

  stack: {
    heading: { lead: 'What I', accent: 'use' },
    intro: 'Languages, libraries and platforms I work with, grouped by area.',
  },

  career: {
    heading: { lead: 'My', accent: 'journey' },
    intro: "Where I've worked and what I did at each place.",
    clients: 'Clients and partners',
  },

  projects: {
    heading: { lead: 'Selected', accent: 'projects' },
    intro:
      'The ones from work appear with a description only, because the code belongs to the companies. The ones with an arrow link to the repository on GitHub.',
    filterLabel: 'Filter projects by topic',
    all: 'All',
    showAll: (n: number) => `Show all ${n} projects`,
  },

  contact: {
    heading: { lead: 'Get in', accent: 'touch' },
    intro: 'The best way to reach me is on LinkedIn. My open projects are on GitHub.',
    linkedinShort: 'Open my LinkedIn',
    location: 'São Paulo, Brazil',
  },
}

export const strings = { pt, en }
