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
      'No PagBank, comecei construindo os pipelines de dados desses eventos. Depois passei a trabalhar nos modelos que usam esses dados para estimar o risco de cada acesso. Hoje sigo com modelos de fraude na CERC, agora no mundo dos arranjos de pagamento.',
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
      'Um aparelho conhecido costuma indicar um acesso legítimo. Um aparelho novo, ou um mesmo aparelho em várias contas, merece atenção. No PagBank, desenvolvi modelos de score de dispositivo com essas características para proteger as contas contra fraudes e ataques.',
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
      'No PagBank também fiz o modelo de previsão de TPV diário (o volume total de pagamentos) e as rotinas de monitoramento dos modelos. Hoje, na CERC, trabalho com o ciclo de crédito e com modelos de fraude dentro de arranjos de pagamento.',
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

export type ProjectCategory = 'credito' | 'fraude' | 'ia' | 'dados' | 'software'

export const projectCategories: { key: ProjectCategory; label: string }[] = [
  { key: 'credito', label: 'Crédito' },
  { key: 'fraude', label: 'Fraude e segurança' },
  { key: 'ia', label: 'IA e machine learning' },
  { key: 'dados', label: 'Engenharia de dados' },
  { key: 'software', label: 'Software' },
]

export type Project = {
  name: string
  tagline: string
  description: string
  /** onde foi feito: empresa, GitHub ou projeto pessoal */
  where: string
  categories: ProjectCategory[]
  url?: string
  tags: string[]
  year?: string
}

// Projetos do trabalho aparecem só com a descrição: o código é das empresas.
// Tudo aqui sai do currículo, do que o Gabriel contou ou do próprio repositório no GitHub.
export const projects: Project[] = [
  {
    name: 'Modelos de fraude em arranjos de pagamento',
    tagline: 'Fraude no mundo dos recebíveis',
    description:
      'Modelos de fraude dentro de arranjos de pagamento, construídos sobre os dados de recebíveis registrados na CERC.',
    where: 'CERC',
    categories: ['fraude', 'ia'],
    tags: ['Python', 'PySpark', 'Databricks', 'Machine learning'],
    year: '2026',
  },
  {
    name: 'Modelagem de arranjos, duplicata e outros ativos',
    tagline: 'Análises para grandes clientes de crédito',
    description:
      'Modelagem sobre os dados da CERC como um todo, como duplicata, arranjos de pagamento e outros ativos, com análises e reports para grandes clientes de crédito do Brasil.',
    where: 'CERC',
    categories: ['credito', 'dados'],
    tags: ['Databricks', 'PySpark', 'Delta Lake', 'Python'],
    year: '2026',
  },
  {
    name: 'Agentes de IA com LLM',
    tagline: 'IA generativa aplicada às análises',
    description:
      'Agentes de IA em projetos que envolvem LLM, apoiando as análises e os reports feitos sobre os dados da CERC.',
    where: 'CERC',
    categories: ['ia'],
    tags: ['LLM', 'Agentes de IA', 'Python'],
    year: '2026',
  },
  {
    name: 'Modelos do ciclo de crédito',
    tagline: 'Application e behavior',
    description:
      'Modelos de application, que apoiam a decisão de conceder crédito, e de behavior, que acompanham o comportamento do cliente depois da concessão. Inclui a automação da modelagem e o monitoramento de performance dos modelos.',
    where: 'PagBank',
    categories: ['credito', 'ia'],
    tags: ['Python', 'scikit-learn', 'SHAP', 'PySpark', 'AWS SageMaker'],
    year: '2022 a 2026',
  },
  {
    name: 'Previsão de TPV diário',
    tagline: 'O volume de pagamentos, dia a dia',
    description:
      'Modelo que prevê, dia a dia, o TPV (volume total de pagamentos) dos clientes, usado para apoiar políticas de crédito e decisões de negócio.',
    where: 'PagBank',
    categories: ['credito', 'ia'],
    tags: ['Python', 'Séries temporais', 'Machine learning'],
    year: '2022 a 2026',
  },
  {
    name: 'Score de dispositivo para segurança da conta',
    tagline: 'Device fingerprint contra fraudes e ataques',
    description:
      'Modelos supervisionados e não supervisionados que dão um score para cada dispositivo, a partir das características únicas do aparelho e dos padrões de uso, para proteger as contas contra fraudes e ataques.',
    where: 'PagBank',
    categories: ['fraude', 'ia'],
    tags: ['Device fingerprint', 'Python', 'scikit-learn', 'PySpark'],
    year: '2022 a 2026',
  },
  {
    name: 'Modelos de biometria comportamental',
    tagline: 'O jeito de usar como mais uma camada de proteção',
    description:
      'Modelos que comparam o comportamento de cada sessão com o padrão do dono da conta, como mais uma camada de proteção contra fraudes na segurança da conta.',
    where: 'PagBank',
    categories: ['fraude', 'ia'],
    tags: ['Biometria comportamental', 'Python', 'Machine learning'],
    year: '2022 a 2026',
  },
  {
    name: 'Segmentação de clientes',
    tagline: 'Estudos de comportamento no crédito',
    description:
      'Relatórios analíticos e estudos de comportamento para segmentar clientes na BU de Crédito.',
    where: 'PagBank',
    categories: ['credito'],
    tags: ['Python', 'SQL', 'Análise de dados'],
    year: '2022 a 2026',
  },
  {
    name: 'Dados de autenticação e onboarding',
    tagline: 'Login, MFA, OTP e abertura de conta',
    description:
      'Pipelines ETL/ELT e plataformas de dados para a segurança da conta, com os eventos de login, MFA, OTP e onboarding de clientes, em data lakes, data warehouses e data marts.',
    where: 'PagBank',
    categories: ['dados', 'fraude'],
    tags: ['PySpark', 'Kafka', 'Airflow', 'Redshift'],
    year: '2021 a 2022',
  },
  {
    name: 'fraud-pix-model',
    tagline: 'Detecção de fraude em transações PIX',
    description:
      'Compara Random Forest e XGBoost para achar transações fraudulentas, trata o desbalanceamento entre fraudes e transações normais e prioriza o recall, porque deixar passar uma fraude custa mais que um falso positivo. Tem uma API para servir o modelo.',
    where: 'GitHub',
    categories: ['fraude', 'ia'],
    url: 'https://github.com/g-roger/fraud-pix-model',
    tags: ['Python', 'XGBoost', 'Random Forest', 'API'],
    year: '2022',
  },
  {
    name: 'mouse_dynamics',
    tagline: 'Biometria comportamental com o mouse',
    description:
      'Usa o dataset do Balabit Mouse Dynamics Challenge para reconhecer o dono de uma conta pelo jeito de mover o mouse, com agrupamento e redes neurais, e apontar sessões que não são dele.',
    where: 'GitHub',
    categories: ['fraude', 'ia'],
    url: 'https://github.com/g-roger/mouse_dynamics',
    tags: ['Python', 'Redes neurais', 'Clustering'],
    year: '2022',
  },
  {
    name: 'german-loan-eda',
    tagline: 'Análise de crédito em R',
    description:
      'Explora 1.000 pedidos de empréstimo para entender o perfil de quem pede crédito e usa um classificador random forest para indicar se o empréstimo deve ser concedido.',
    where: 'GitHub',
    categories: ['credito', 'ia'],
    url: 'https://github.com/g-roger/german-loan-eda',
    tags: ['R', 'Random Forest', 'Risco de crédito'],
    year: '2023',
  },
  {
    name: 'time_series_studies',
    tagline: 'Previsão de vendas com séries temporais',
    description:
      'Estudos da competição Store Sales do Kaggle: tendência, sazonalidade, séries temporais como features e previsão com machine learning.',
    where: 'GitHub',
    categories: ['ia'],
    url: 'https://github.com/g-roger/time_series_studies',
    tags: ['Python', 'Séries temporais', 'Kaggle'],
    year: '2024',
  },
  {
    name: 'nlp-disaster-tweets-competition',
    tagline: 'NLP numa competição do Kaggle',
    description:
      'Classifica se um tweet fala de um desastre real ou não, na competição Natural Language Processing with Disaster Tweets, do Kaggle.',
    where: 'GitHub',
    categories: ['ia'],
    url: 'https://github.com/g-roger/nlp-disaster-tweets-competition',
    tags: ['Python', 'NLP', 'Kaggle'],
    year: '2023',
  },
  {
    name: 'heart-attack-analysis',
    tagline: 'Risco de doença cardíaca',
    description:
      'Modelos de machine learning que estimam o risco de doença coronariana em dez anos, usando a base do estudo de Framingham.',
    where: 'GitHub',
    categories: ['ia'],
    url: 'https://github.com/g-roger/heart-attack-analysis',
    tags: ['Python', 'Classificação', 'Saúde'],
    year: '2023',
  },
  {
    name: 'analise-vegetativa-bemagro',
    tagline: 'Visão computacional na agricultura',
    description:
      'No hackathon da Bemagro, analisei imagens NDVI de lavouras no Mato Grosso do Sul para saber se a plantação estava adiantada ou atrasada e encontrar áreas que não se desenvolviam.',
    where: 'GitHub',
    categories: ['ia'],
    url: 'https://github.com/g-roger/analise-vegetativa-bemagro',
    tags: ['Visão computacional', 'Python', 'Hackathon'],
    year: '2022',
  },
  {
    name: 'post-graduation-deep-learning',
    tagline: 'Deep learning no MBA da FIAP',
    description:
      'Autoencoders, redes convolucionais e redes recorrentes treinados durante o MBA em IA, com MNIST, CIFAR-10 e um filtro de spam.',
    where: 'GitHub',
    categories: ['ia'],
    url: 'https://github.com/g-roger/post-graduation-deep-learning',
    tags: ['Deep learning', 'Keras', 'CNN', 'RNN'],
    year: '2021',
  },
  {
    name: 'EDA-housing',
    tagline: 'Previsão de preço de imóveis',
    description:
      'Regressão linear para prever o preço de casas na Califórnia, com tratamento de outliers e avaliação por R², MSE e RMSE.',
    where: 'GitHub',
    categories: ['ia'],
    url: 'https://github.com/g-roger/EDA-housing',
    tags: ['Python', 'Regressão', 'Análise exploratória'],
    year: '2021',
  },
  {
    name: 'bigquery_natality_analysis',
    tagline: 'Análise de dados no BigQuery',
    description:
      'Análise exploratória da base pública de natalidade do BigQuery, no Google Cloud, para entender o que influencia o peso dos bebês ao nascer.',
    where: 'GitHub',
    categories: ['dados'],
    url: 'https://github.com/g-roger/bigquery_natality_analysis',
    tags: ['BigQuery', 'Google Cloud', 'Python'],
    year: '2023',
  },
  {
    name: 'Plataformas de educação corporativa',
    tagline: 'Gestão de aprendizagem para grandes empresas',
    description:
      'Softwares de gestão de aprendizagem usados nos projetos de educação corporativa que a Mastertech fazia com grandes empresas.',
    where: 'Mastertech',
    categories: ['software'],
    tags: ['Python', 'Flask', 'Django REST', 'MongoDB'],
    year: '2018 a 2021',
  },
  {
    name: 'moip-sdk-python',
    tagline: 'SDK em Python para a API da Moip',
    description:
      'Biblioteca aberta para integrar aplicações Python com a API de pagamentos da Moip: clientes, pedidos e pagamentos. Escrita na Mastertech.',
    where: 'GitHub',
    categories: ['software'],
    url: 'https://github.com/g-roger/moip-sdk-python',
    tags: ['Python', 'SDK', 'Pagamentos'],
    year: '2018',
  },
  {
    name: 'track',
    tagline: 'Inteligência de mercado por região',
    description:
      'Painel que mapeia os estabelecimentos comerciais de uma região, mostra os concorrentes num mapa e ajuda a montar listas de prospecção. Usa os dados abertos de CNPJ da Receita Federal.',
    where: 'Projeto pessoal',
    categories: ['software', 'dados'],
    tags: ['FastAPI', 'React', 'Dados abertos'],
    year: '2026',
  },
  {
    name: 'finapp',
    tagline: 'Controle financeiro pessoal',
    description:
      'Sistema web de finanças pessoais em Python, com dashboard de widgets que cada usuário reorganiza e análise das faturas de cartão.',
    where: 'Projeto pessoal',
    categories: ['software'],
    tags: ['Python', 'Tornado', 'Chart.js'],
    year: '2026',
  },
]

export type TimelineItem = {
  period: string
  role: string
  place: string
  detail: string
  bullets?: string[]
  clients?: string[]
  tags?: string[]
}

export const timeline: TimelineItem[] = [
  {
    period: '2026 até hoje',
    role: 'Tech Lead, Cientista e Engenheiro de Dados',
    place: 'CERC, Câmara de Registro de Recebíveis',
    detail:
      'Sou tech lead e atuo tanto em ciência de dados quanto em engenharia. Trabalho com arranjos de pagamento, em projetos de crédito e de modelos de fraude que envolvem grandes clientes de crédito do Brasil.',
    bullets: [
      'Liderança técnica dos projetos de dados',
      'Modelos de fraude em arranjos de pagamento',
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
      'Crédito: modelos de application e behavior e previsão de TPV diário, para apoiar políticas de crédito e decisões de negócio',
      'Segurança da conta: modelos supervisionados e não supervisionados de biometria comportamental e de score de dispositivo (device fingerprint), para prevenir fraudes e ataques',
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
    role: 'Engenheiro de Software Back-End Sênior',
    place: 'Mastertech',
    detail:
      'Entrei como engenheiro de software back-end e cresci até sênior. Fui o desenvolvedor principal dos softwares da empresa, tanto dos produtos vendidos a clientes quanto dos sistemas internos. Também atuei em consultoria para grandes empresas, em projetos de software, de dados e de educação. Ficava alocado no cliente, desenvolvendo o projeto como design partner, ou dentro da Mastertech, junto com a empresa, apoiando a equipe nas soluções.',
    bullets: [
      'Prototipação de produtos em todos os projetos e desenvolvimento nos que pediam',
      'Análises de dados em big data',
      'Projetos de educação, como plataformas de educação corporativa, e apoio a profissionais para adotar e inserir uma nova tecnologia',
      'APIs REST e microsserviços em Python, com Flask, Django REST Framework e PyMongo, com Scrum e CI/CD',
      'Autor do moip-sdk-python, um SDK aberto para a API de pagamentos da Moip',
      'Treinamentos de Python, PySpark, APIs REST e microsserviços para as equipes dos clientes',
    ],
    clients: [
      'Itaú',
      'Santander',
      'Vivo',
      'Porto',
      'Globo (Projeto Globo Led)',
      'Disney',
      'Facebook (Projeto Estação Hack)',
      'IBM',
      'Heineken',
      'Bayer',
      'C&A',
      'Icatu Seguros',
      'Banco Omni',
      'Sebrae',
      'ETEC',
      'e outros',
    ],
    tags: ['Consultoria', 'Design partner', 'Prototipação', 'Big data', 'Python', 'Flask', 'Django REST', 'PySpark', 'MongoDB', 'Scrum', 'CI/CD'],
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

export type Stat = {
  n: number
  suffix: string
  label: string
}

// Todos os números saem do currículo e do que o Gabriel contou: 2013 (início no Grupo All Net),
// PagBank de 2021 a 2026, as empresas e instituições citadas nos projetos da Mastertech
// (contadas a partir da própria lista, sem o "e outros") e Awari de 2022 a 2025.
export function careerStats(now: Date = new Date()): Stat[] {
  const mastertech = timeline.find((t) => t.place === 'Mastertech')
  const nomeados = (mastertech?.clients ?? []).filter((c) => c !== 'e outros').length

  return [
    { n: now.getFullYear() - 2013, suffix: '', label: 'anos de carreira, desde 2013' },
    { n: 5, suffix: '', label: 'anos no PagBank, de 2021 a 2026' },
    { n: nomeados, suffix: '+', label: 'empresas e instituições atendidas pela Mastertech' },
    { n: 3, suffix: '', label: 'anos como instrutor e mentor na Awari' },
  ]
}

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
