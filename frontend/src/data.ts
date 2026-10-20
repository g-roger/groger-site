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
    title: 'Segurança da conta',
    short: 'Garantir que quem entra na conta é o dono dela.',
    color: '#e8c37a',
    illustration: 'shield',
    keywords: ['login', 'MFA', 'OTP', 'onboarding', 'antifraude'],
    paragraphs: [
      'Segurança da conta é garantir que quem está fazendo login, abrindo uma conta ou trocando uma senha é mesmo o cliente. Isso passa por login, MFA, OTP e onboarding.',
      'No PagBank, comecei construindo os pipelines de dados desses eventos. Depois passei a trabalhar nos modelos que usam esses dados para estimar o risco de cada acesso.',
    ],
  },
  {
    key: 'device-fingerprint',
    title: 'Device fingerprint',
    short: 'A assinatura de cada dispositivo, usada para reconhecer acessos.',
    color: '#8fb8a2',
    illustration: 'fingerprint',
    keywords: ['dispositivo', 'risco', 'fraude', 'ataques'],
    paragraphs: [
      'Cada dispositivo tem características próprias: o aparelho, o sistema, as configurações, a rede, a forma como é usado. Juntando esses sinais dá para montar uma assinatura e saber se aquele dispositivo já apareceu antes naquela conta.',
      'Um aparelho conhecido costuma indicar um acesso legítimo. Um aparelho novo, ou um mesmo aparelho em várias contas, merece atenção. No PagBank, desenvolvi modelos com essas características para proteger as contas contra fraudes e ataques.',
    ],
  },
  {
    key: 'behavioral-biometrics',
    title: 'Biometria comportamental',
    short: 'Cada pessoa usa o mouse e o teclado de um jeito.',
    color: '#3f7a5b',
    illustration: 'mouse',
    keywords: ['mouse dynamics', 'autenticação contínua', 'anomalias'],
    paragraphs: [
      'Cada pessoa mexe no mouse e digita de um jeito: a velocidade, a trajetória, as pausas, o ritmo. Esses padrões viram dados, e dá para medir o quanto uma sessão se parece com a do dono da conta.',
      'Por isso funciona como autenticação contínua. Em vez de conferir a pessoa só no login, o comportamento é observado durante a sessão inteira. Estudei o tema no mouse_dynamics, durante o MBA na FIAP, e trabalhei com ele no PagBank.',
    ],
  },
  {
    key: 'credit-cycle',
    title: 'Ciclo de crédito',
    short: 'Da concessão ao acompanhamento do cliente.',
    color: '#d4a15a',
    illustration: 'credit',
    keywords: ['application', 'behavior', 'TPV', 'arranjos de pagamento'],
    paragraphs: [
      'O ciclo de crédito começa na concessão e continua depois dela. Os modelos de application ajudam a decidir quem recebe crédito. Os modelos de behavior acompanham o cliente ao longo do tempo, olhando como ele se comporta.',
      'No PagBank também fiz o modelo de previsão de TPV (o volume total de pagamentos) e as rotinas de monitoramento dos modelos. Hoje, na CERC, trabalho com o ciclo de crédito dentro de arranjos de pagamento.',
    ],
  },
  {
    key: 'data-engineering',
    title: 'Engenharia de dados',
    short: 'Pipelines e plataformas para os dados chegarem certos.',
    color: '#b85c3d',
    illustration: 'pipeline',
    keywords: ['PySpark', 'Databricks', 'Delta Lake', 'Airflow', 'Kafka'],
    paragraphs: [
      'Engenharia de dados é fazer o dado chegar no lugar certo, no formato certo e na hora certa. Já montei pipelines ETL/ELT com Spark, Airflow e Kafka, e hoje trabalho com Databricks, PySpark e Delta Lake.',
      'Também participei do desenho de data lakes, data warehouses e data marts, sempre com atenção à governança dos dados.',
    ],
  },
  {
    key: 'llm-agents',
    title: 'Agentes de IA e LLM',
    short: 'Agentes de IA em projetos com LLM.',
    color: '#f2ead8',
    illustration: 'llm',
    keywords: ['LLM', 'agentes de IA', 'Vertex AI', 'MLOps'],
    paragraphs: [
      'Na CERC uso agentes de IA em projetos que envolvem LLM, junto com as análises e a modelagem que faço sobre os dados da câmara.',
      'Em 2026 fiz o curso de IA Generativa e MLOps com Vertex AI, na Google Cloud.',
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
    name: 'fraud-pix-model',
    tagline: 'Detecção de fraude em transações PIX',
    description:
      'Modelo de machine learning que identifica transações fraudulentas em pagamentos instantâneos. Feito durante o MBA na FIAP.',
    url: 'https://github.com/g-roger/fraud-pix-model',
    tags: ['Python', 'Machine learning', 'Antifraude'],
    year: '2022',
  },
  {
    name: 'mouse_dynamics',
    tagline: 'Biometria comportamental com o mouse',
    description:
      'Estudo sobre como o movimento do mouse pode autenticar uma pessoa de forma contínua e apontar comportamentos fora do padrão. Feito durante o MBA na FIAP.',
    url: 'https://github.com/g-roger/mouse_dynamics',
    tags: ['Python', 'Biometria', 'Segurança'],
    year: '2022',
  },
  {
    name: 'GaJa',
    tagline: 'Gestão para escolas de ballet',
    description:
      'Sistema de gestão feito para a Escola Saltitare: alunas e responsáveis, turmas, agenda, chamada, leads de aula experimental e financeiro com boletos.',
    tags: ['FastAPI', 'React', 'SQLite'],
    year: '2026',
  },
  {
    name: 'track',
    tagline: 'Inteligência de mercado por região',
    description:
      'Painel que mapeia os estabelecimentos comerciais de uma região, mostra os concorrentes num mapa e ajuda a montar listas de prospecção. Usa os dados abertos de CNPJ da Receita Federal.',
    tags: ['FastAPI', 'React', 'Dados abertos'],
    year: '2026',
  },
  {
    name: 'finapp',
    tagline: 'Controle financeiro pessoal',
    description:
      'Sistema web de finanças pessoais em Python. Tem dashboard com widgets que cada usuário reorganiza e análise das faturas de cartão.',
    tags: ['Python', 'Tornado', 'Chart.js'],
    year: '2026',
  },
  {
    name: 'analise-vegetativa-bemagro',
    tagline: 'Visão computacional na agricultura',
    description:
      'Solução que analisa a saúde de plantações a partir de imagens. Desenvolvida no hackathon de Computer Vision in Digital Agriculture, da Bemagro.',
    url: 'https://github.com/g-roger/analise-vegetativa-bemagro',
    tags: ['Visão computacional', 'Python', 'Hackathon'],
    year: '2022',
  },
  {
    name: 'moip-sdk-python',
    tagline: 'SDK em Python para a API da Moip',
    description:
      'Biblioteca aberta para integrar aplicações Python com a API de pagamentos da Moip. Escrita na Mastertech.',
    url: 'https://github.com/g-roger/moip-sdk-python',
    tags: ['Python', 'SDK', 'Pagamentos'],
    year: '2018',
  },
]

export type TimelineItem = {
  period: string
  role: string
  place: string
  detail: string
  bullets?: string[]
  tags?: string[]
}

export const timeline: TimelineItem[] = [
  {
    period: '2026 até hoje',
    role: 'Engenheiro de Dados Sênior',
    place: 'CERC, Câmara de Registro de Recebíveis',
    detail:
      'Trabalho com o ciclo de crédito dentro de arranjos de pagamento e atuo tanto em ciência de dados quanto em engenharia. Os projetos envolvem grandes clientes de crédito do Brasil.',
    bullets: [
      'Análises e reports para grandes clientes de crédito',
      'Modelagem sobre os dados da CERC: duplicata, arranjos e outros ativos',
      'Agentes de IA em projetos com LLM',
      'Pipelines em Databricks, PySpark e Delta Lake',
    ],
    tags: ['Databricks', 'PySpark', 'Delta Lake', 'Python', 'LLM', 'Azure DevOps'],
  },
  {
    period: '2022 a 2026',
    role: 'Cientista de Dados Sênior',
    place: 'PagBank (PagSeguro)',
    detail: 'Atuei em duas frentes: a BU de Crédito e a BU de Segurança da Conta.',
    bullets: [
      'Crédito: modelos de application e behavior e previsão de TPV, para apoiar políticas de crédito e decisões de negócio',
      'Segurança da conta: modelos supervisionados e não supervisionados de biometria comportamental e device fingerprint, para prevenir fraudes e ataques',
      'Automação do processo de modelagem e monitoramento de performance dos modelos',
      'Relatórios e estudos de comportamento para segmentação de clientes',
    ],
    tags: ['Python', 'scikit-learn', 'TensorFlow', 'Keras', 'PySpark', 'SHAP', 'AWS SageMaker', 'Kafka'],
  },
  {
    period: '2022 a 2025',
    role: 'Instrutor e Mentor de Dados',
    place: 'Awari, em paralelo ao PagBank',
    detail:
      'Dei aulas de ciência de dados e de engenharia de dados e fiz mentorias individuais com estudantes que queriam entrar na área.',
    bullets: [
      'Aulas sobre pipelines de dados, modelos de machine learning e modelagem de dados',
      'Mentoria de carreira para quem estava migrando para dados',
    ],
    tags: ['Ensino', 'Mentoria', 'Python', 'SQL'],
  },
  {
    period: '2021 a 2022',
    role: 'Engenheiro de Dados Pleno',
    place: 'PagBank (PagSeguro)',
    detail:
      'Trabalhei com os dados de segurança da conta e autenticação: login, MFA, OTP e onboarding de clientes.',
    bullets: [
      'Pipelines ETL/ELT com governança dos dados em todo o processo',
      'Desenho, criação e gestão de data lakes, data warehouses e data marts',
      'Integração de dados transacionais com os times de engenharia de software',
      'Análises estatísticas para microsserviços e dashboards interativos',
    ],
    tags: ['Python', 'Flask', 'Django', 'PySpark', 'Kafka', 'Airflow', 'Redshift', 'MySQL', 'Pentaho', 'Power BI'],
  },
  {
    period: '2017 a 2021',
    role: 'Engenheiro de Software Back-End',
    place: 'Mastertech',
    detail:
      'Fui o desenvolvedor principal dos softwares da empresa, tanto dos produtos vendidos a clientes quanto dos sistemas internos. No período da noite, dava aulas e treinamentos para empresas.',
    bullets: [
      'APIs REST e microsserviços em Python, com Flask, Django REST Framework e PyMongo',
      'Scrum e CI/CD',
      'Autor do moip-sdk-python, um SDK aberto para a API de pagamentos da Moip',
      'Plataformas de educação corporativa para gestão de aprendizagem',
      'Treinamentos de Python, PySpark, APIs REST e microsserviços para Santander, Itaú, Facebook (Projeto Estação Hack), Icatu Seguros, Banco Omni, Bayer, IBM e outras empresas',
    ],
    tags: ['Python', 'Flask', 'Django REST', 'PySpark', 'MongoDB', 'CI/CD', 'Scrum'],
  },
  {
    period: '2017 a 2018',
    role: 'Estagiário em Desenvolvimento de Software',
    place: 'Ponte21',
    detail:
      'Front-end e back-end de sistemas educacionais, e-commerce e APIs de gestão, junto com engenheiros sêniores.',
    bullets: ['Participação em todas as etapas, da concepção aos testes'],
    tags: ['C#', 'ASP.NET Core', 'Entity Framework', 'MySQL', 'JavaScript', 'Azure'],
  },
  {
    period: '2013 a 2017',
    role: 'Instrutor de Informática',
    place: 'Grupo All Net',
    detail:
      'Ensinava Microsoft Office (com foco em Excel), hardware, lógica de programação e criação de sites. Também criava o conteúdo das aulas e adaptava o ensino a cada perfil de aluno.',
    tags: ['Ensino', 'Excel', 'Lógica de programação'],
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
    items: ['Python', 'SQL', 'JavaScript', 'TypeScript', 'C#'],
  },
  {
    name: 'Ciência de dados e ML',
    color: '#8fb8a2',
    items: ['scikit-learn', 'TensorFlow', 'Keras', 'Pandas', 'SHAP'],
  },
  {
    name: 'Engenharia de dados',
    color: '#3f7a5b',
    items: ['PySpark', 'Databricks', 'Delta Lake', 'Airflow', 'Kafka', 'Pentaho', 'Power BI'],
  },
  {
    name: 'Nuvem',
    color: '#d4a15a',
    items: ['AWS (S3, EMR, EC2, SageMaker, Glue)', 'Azure DevOps', 'Google Cloud (Vertex AI)', 'Fly.dev'],
  },
  {
    name: 'IA generativa',
    color: '#f2ead8',
    items: ['LLMs', 'Agentes de IA', 'Vertex AI'],
  },
  {
    name: 'Web e APIs',
    color: '#b85c3d',
    items: ['FastAPI', 'Flask', 'Django REST Framework', 'ASP.NET Core', 'React'],
  },
  {
    name: 'Bancos de dados',
    color: '#8fb8a2',
    items: ['Redshift', 'MySQL', 'MongoDB', 'SQLite'],
  },
  {
    name: 'DevOps',
    color: '#e8c37a',
    items: ['Git', 'Jenkins', 'Docker', 'CI/CD'],
  },
]
