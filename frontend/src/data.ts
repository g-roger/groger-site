export type Expertise = {
  key: string
  title: string
  short: string
  color: string
  illustration: 'shield' | 'mouse' | 'credit' | 'pipeline' | 'llm' | 'fingerprint'
  paragraphs: string[]
  keywords: string[]
}

export const expertises: Expertise[] = [
  {
    key: 'account-security',
    title: 'Segurança da Conta',
    short: 'Onboarding, login, MFA e OTP com sinal em tempo real.',
    color: '#e8c37a',
    illustration: 'shield',
    keywords: ['MFA', 'OTP', 'onboarding', 'antifraude', 'account takeover'],
    paragraphs: [
      'Trabalho em toda a jornada de identidade — do onboarding ao login recorrente — combinando sinal transacional, device fingerprint e biometria comportamental para separar quem é o dono da conta de quem está tentando entrar.',
      'Na prática são pipelines que ingerem eventos de autenticação (login, MFA, OTP), enriquecem com features de dispositivo e comportamento, e alimentam modelos supervisionados/não supervisionados que decidem, em milissegundos, se o acesso é confiável.',
    ],
  },
  {
    key: 'device-fingerprint',
    title: 'Device Fingerprint',
    short: 'Assinatura única do dispositivo para prevenir fraude.',
    color: '#8fb8a2',
    illustration: 'fingerprint',
    keywords: ['fingerprint', 'device intelligence', 'reputation', 'takeover'],
    paragraphs: [
      'Cada dispositivo tem uma combinação única de sinais — hardware, rede, sensores, resolução, fontes, timezone. Junto esses atributos numa assinatura estável que sobrevive a limpezas de cache e trocas de IP.',
      'Uso essa assinatura para pontuar risco em tempo real, detectar contas espelhadas, prevenir account takeover e reduzir fricção pra quem já conheço. É um dos sinais mais fortes de antifraude quando bem calibrado.',
    ],
  },
  {
    key: 'behavioral-biometrics',
    title: 'Biometria Comportamental',
    short: 'Cada pessoa digita e move o mouse de um jeito.',
    color: '#3f7a5b',
    illustration: 'mouse',
    keywords: ['mouse dynamics', 'keystroke', 'autenticação contínua'],
    paragraphs: [
      'Cada pessoa tem um "jeito" — a curva do mouse, a cadência das teclas, o intervalo entre cliques. Biometria comportamental transforma esses padrões em vetores e mede o quanto uma sessão parece com o dono da conta.',
      'É autenticação contínua: em vez de perguntar uma senha só na entrada, o sinal comportamental é lido em background durante toda a sessão e dispara um step-up quando algo diverge do baseline.',
    ],
  },
  {
    key: 'credit-cycle',
    title: 'Ciclo de Crédito & Arranjos',
    short: 'Application, behavior, TPV, recebíveis, duplicata e arranjos.',
    color: '#d4a15a',
    illustration: 'credit',
    keywords: ['application', 'behavior', 'TPV', 'arranjos de pagamento', 'duplicata', 'recebíveis'],
    paragraphs: [
      'Modelagem do ciclo de crédito ponta a ponta: application (concessão), behavior (manutenção e comportamento) e previsão de TPV para calibrar apetite, política e limite ao longo do tempo.',
      'Hoje na CERC amplio para o mundo de recebíveis — arranjos de pagamento, duplicata e demais ativos — modelando risco e comportamento para grandes clientes de crédito do Brasil.',
    ],
  },
  {
    key: 'data-engineering',
    title: 'Engenharia de Dados',
    short: 'Pipelines que aguentam o tranco.',
    color: '#b85c3d',
    illustration: 'pipeline',
    keywords: ['PySpark', 'Databricks', 'Delta Lake', 'Airflow', 'Kafka', 'ETL/ELT'],
    paragraphs: [
      'Construo pipelines ETL/ELT em PySpark/Databricks com Delta Lake, orquestração em Airflow/Azure DevOps e ingestão via Kafka — servindo tanto times de risco quanto de segurança.',
      'A régua é sempre a mesma: qualidade, governança e custo sob controle. Dados confiáveis pipeados no tempo certo é o que faz modelo de crédito e antifraude funcionarem.',
    ],
  },
  {
    key: 'llm-agents',
    title: 'Agentes de IA & LLM',
    short: 'LLMs aplicados a análise, reports e automação.',
    color: '#f2ead8',
    illustration: 'llm',
    keywords: ['LLM', 'agentes', 'Vertex AI', 'RAG', 'automação analítica'],
    paragraphs: [
      'Uso LLMs e frameworks de agentes para escalar análises: agentes que exploram dados, montam reports para grandes clientes de crédito, respondem perguntas de negócio sobre bases enormes e automatizam análises que antes tomavam semanas.',
      'Também aplico IA generativa em produtos internos — do prototipagem à esteira de MLOps na Google Cloud (Vertex AI) — mantendo o cuidado com custo, latência e governança dos dados.',
    ],
  },
]

export type Project = {
  name: string
  tagline: string
  description: string
  url?: string
  tags: string[]
  year?: string
}

export const projects: Project[] = [
  {
    name: 'GaJa · Escola Saltitare',
    tagline: 'App de gestão para escola de ballet',
    description:
      'Plataforma FastAPI + React para gestão de alunas, turmas, mensalidades e apresentações.',
    tags: ['FastAPI', 'React', 'SaaS'],
    year: '2026',
  },
  {
    name: 'track · Inteligência de Mercado',
    tagline: 'Painel de concorrentes por região',
    description:
      'Painel com dados CNPJ/Receita Federal para inteligência de mercado por região, com deploy em Fly.dev.',
    tags: ['FastAPI', 'React', 'Fly.dev'],
    year: '2026',
  },
  {
    name: 'finapp',
    tagline: 'Finanças pessoais com automação',
    description:
      'Aplicação para acompanhamento financeiro e automações — deploy contínuo.',
    tags: ['Automação', 'Finanças'],
    year: '2026',
  },
  {
    name: 'mouse_dynamics',
    tagline: 'Biometria comportamental do mouse',
    description:
      'Estudo de biometria comportamental a partir de dinâmica de movimentação do mouse para autenticação contínua e detecção de anomalias.',
    url: 'https://github.com/g-roger/mouse_dynamics',
    tags: ['Python', 'Biometria', 'Segurança'],
    year: '2022',
  },
  {
    name: 'fraud-pix-model',
    tagline: 'ML para detecção de fraude em PIX',
    description:
      'Modelo de machine learning para identificação de transações fraudulentas em pagamentos instantâneos, desenvolvido no MBA.',
    url: 'https://github.com/g-roger/fraud-pix-model',
    tags: ['Python', 'ML', 'Antifraude'],
    year: '2022',
  },
  {
    name: 'analise-vegetativa-bemagro',
    tagline: 'Visão computacional para agricultura',
    description:
      'Solução de visão computacional para análise de saúde de plantações a partir de imagens — hackathon Bemagro.',
    url: 'https://github.com/g-roger/analise-vegetativa-bemagro',
    tags: ['Computer Vision', 'Python', 'Hackathon'],
    year: '2022',
  },
  {
    name: 'moip-sdk-python',
    tagline: 'SDK Python para a API Moip',
    description:
      'Biblioteca open source em Python para integração com a API de pagamentos Moip.',
    url: 'https://github.com/g-roger/moip-sdk-python',
    tags: ['Python', 'SDK', 'Pagamentos'],
    year: '2018',
  },
]

export type TimelineItem = {
  period: string
  role: string
  place: string
  city?: string
  detail: string
  bullets?: string[]
  tags?: string[]
}

export const timeline: TimelineItem[] = [
  {
    period: '2026 — hoje',
    role: 'Engenheiro de Dados Sênior',
    place: 'CERC — Câmara de Registro de Recebíveis',
    detail:
      'Atuo como profissional de dados ponta a ponta — ciência e engenharia — em torno de arranjos de pagamento e recebíveis. Trabalho com projetos analíticos e de modelagem sobre a base da CERC (duplicata, arranjo e demais ativos), reports para grandes clientes de crédito do Brasil e agentes de IA aplicados a análise.',
    bullets: [
      'Modelagem do ciclo de crédito no domínio de arranjos de pagamento',
      'Agentes de IA / LLM para análise e geração de reports',
      'Reports analíticos para grandes clientes de crédito',
      'Pipelines em Databricks / PySpark / Delta Lake / Azure DevOps',
    ],
    tags: ['Databricks', 'PySpark', 'Delta Lake', 'Python', 'LLM', 'Azure DevOps'],
  },
  {
    period: '2022 — 2026',
    role: 'Cientista de Dados Sênior',
    place: 'PagBank (PagSeguro)',
    detail:
      'Duas frentes: BU de Crédito (modelos de application, behavior e previsão de TPV, apoiando políticas e decisões de negócio) e BU de Segurança da Conta (biometria comportamental, device fingerprint e antifraude).',
    bullets: [
      'Modelos supervisionados e não supervisionados de biometria comportamental e device fingerprint',
      'Application e behavior scoring para o ciclo de crédito',
      'Previsão de TPV (Total Payment Volume)',
      'Automação de modelagem e monitoramento de performance',
    ],
    tags: ['Python', 'scikit-learn', 'TensorFlow', 'Keras', 'PySpark', 'SHAP', 'AWS SageMaker', 'Kafka'],
  },
  {
    period: '2021 — 2022',
    role: 'Engenheiro de Dados Pleno',
    place: 'PagBank (PagSeguro)',
    detail:
      'Foco em segurança da conta e autenticação (login, MFA, OTP) e onboarding. Pipelines ETL/ELT com governança, ambientes de dados (Data Lake, DW, Data Marts) e modelagem/federação de dados.',
    bullets: [
      'Pipelines de dados para login, MFA e OTP',
      'Design e gestão de Data Lakes, Data Warehouses e Data Marts',
      'Análises estatísticas para microsserviços e dashboards interativos',
    ],
    tags: ['Python', 'Flask', 'Django', 'PySpark', 'Kafka', 'Airflow', 'Redshift', 'MySQL', 'Pentaho', 'Power BI'],
  },
  {
    period: '2022 — 2025',
    role: 'Instrutor e Mentor de Dados',
    place: 'Awari',
    detail:
      'Aulas de Ciência de Dados e Engenharia de Dados com foco em pipelines, modelos de ML e modelagem de dados. Mentorias individuais orientando estudantes em transição para o mercado.',
    bullets: [
      'Aulas de Ciência de Dados e Engenharia de Dados',
      'Mentorias individuais de carreira',
    ],
    tags: ['Ensino', 'Mentoria', 'Python', 'SQL'],
  },
  {
    period: '2017 — 2021',
    role: 'Engenheiro de Software Back-End',
    place: 'Mastertech',
    detail:
      'Desenvolvedor principal em produtos comerciais e sistemas internos. Criei APIs REST, microsserviços e aplicações em Python (Flask, Django REST Framework, PyMongo) com Scrum e CI/CD. Publiquei o moip-sdk-python (SDK aberto para a API Moip). Em paralelo, ministrei treinamentos corporativos para Santander, Itaú, Facebook (Projeto Estação Hack), Icatu Seguros, Banco Omni, Bayer e IBM.',
    bullets: [
      'APIs REST e microsserviços em Python (Flask, DRF, PyMongo)',
      'Autoria do SDK aberto moip-sdk-python',
      'Plataformas de educação corporativa para gestão de aprendizagem',
      'Treinamentos in-company para Santander, Itaú, Facebook, IBM, Bayer e outros',
    ],
    tags: ['Python', 'Flask', 'Django REST', 'PySpark', 'MongoDB', 'CI/CD', 'Scrum'],
  },
  {
    period: '2017 — 2018',
    role: 'Estagiário — Desenvolvimento de Software',
    place: 'Ponte21',
    detail:
      'Front-end e back-end em C# / ASP.NET Core / Entity Framework para sistemas educacionais, e-commerce e APIs de gestão.',
    bullets: [
      'Ciclo completo: concepção, implementação e testes',
      'Colaboração direta com engenheiros sêniores',
    ],
    tags: ['C#', 'ASP.NET Core', 'Entity Framework', 'MySQL', 'JavaScript', 'Azure'],
  },
  {
    period: '2013 — 2017',
    role: 'Instrutor de Informática',
    place: 'Grupo All Net',
    detail:
      'Ministrei aulas e criei conteúdo educacional sobre Microsoft Office (foco em Excel), hardware, lógica de programação e criação de sites — adaptando a didática a diferentes perfis de alunos. Foi onde comecei minha carreira ensinando.',
    bullets: [
      'Aulas de Excel avançado, hardware e lógica',
      'Criação de conteúdo didático',
    ],
    tags: ['Ensino', 'Excel', 'Lógica'],
  },
]

export type TechCategory = {
  name: string
  color: string
  items: string[]
}

export const techStack: TechCategory[] = [
  {
    name: 'Linguagens',
    color: '#e8c37a',
    items: ['Python', 'SQL', 'TypeScript', 'JavaScript', 'C#'],
  },
  {
    name: 'Ciência de Dados & ML',
    color: '#8fb8a2',
    items: ['scikit-learn', 'TensorFlow', 'Keras', 'Pandas', 'NumPy', 'SHAP', 'Statsmodels'],
  },
  {
    name: 'Engenharia de Dados',
    color: '#3f7a5b',
    items: ['PySpark', 'Databricks', 'Delta Lake', 'Airflow', 'Kafka', 'Pentaho'],
  },
  {
    name: 'Cloud & Plataformas',
    color: '#d4a15a',
    items: ['AWS (S3, EMR, EC2, SageMaker, Glue)', 'Redshift', 'Azure DevOps', 'Google Cloud · Vertex AI', 'Fly.dev'],
  },
  {
    name: 'IA Generativa & LLM',
    color: '#f2ead8',
    items: ['LLMs', 'Agentes', 'Vertex AI', 'RAG', 'Prompt engineering'],
  },
  {
    name: 'Backend & APIs',
    color: '#b85c3d',
    items: ['FastAPI', 'Flask', 'Django REST', 'ASP.NET Core', 'PyMongo'],
  },
  {
    name: 'Bancos',
    color: '#8fb8a2',
    items: ['PostgreSQL', 'MySQL', 'Redshift', 'MongoDB', 'SQLite'],
  },
  {
    name: 'DevOps / MLOps',
    color: '#e8c37a',
    items: ['Docker', 'Git', 'Jenkins', 'CI/CD', 'Azure DevOps', 'Fly.dev'],
  },
  {
    name: 'BI & Viz',
    color: '#3f7a5b',
    items: ['Power BI', 'matplotlib', 'seaborn', 'Plotly'],
  },
]
