import type { Expertise, ProjectCategory, Project, Stat, TechCategory, TimelineItem } from './data'

// Versão em inglês de data.ts. Mesma estrutura, mesmos itens e mesma ordem: só o texto muda.
// O data.en.test.ts compara as duas versões para que uma não fique para trás da outra.

export const expertises: Expertise[] = [
  {
    key: 'account-security',
    title: 'Account security',
    short: 'Making sure the person signing in is the account owner.',
    color: '#e8c37a',
    illustration: 'shield',
    keywords: ['login', 'MFA', 'OTP', 'onboarding', 'anti-fraud'],
    paragraphs: [
      'Account security means making sure the person logging in, opening an account or changing a password is really the customer. That covers login, MFA, OTP and onboarding.',
      'At PagBank, I started by building the data pipelines for these events. Later I moved to the models that use that data to estimate the risk of each access. Today I keep working on fraud models at CERC, now in the world of payment arrangements.',
    ],
  },
  {
    key: 'device-fingerprint',
    title: 'Device fingerprint',
    short: "Each device's signature, used to recognize accesses.",
    color: '#8fb8a2',
    illustration: 'fingerprint',
    keywords: ['device', 'risk', 'fraud', 'attacks'],
    paragraphs: [
      'Every device has its own traits: the hardware, the system, the settings, the network, the way it is used. Putting those signals together makes it possible to build a signature and tell whether that device has already shown up on that account.',
      'A known device usually points to a legitimate access. A new device, or the same device across many accounts, deserves attention. At PagBank I developed device score models with these traits to protect accounts from fraud and attacks.',
    ],
  },
  {
    key: 'behavioral-biometrics',
    title: 'Behavioral biometrics',
    short: 'Everyone uses the mouse and the keyboard in their own way.',
    color: '#3f7a5b',
    illustration: 'mouse',
    keywords: ['mouse dynamics', 'continuous authentication', 'anomalies'],
    paragraphs: [
      "Each person moves the mouse and types in their own way: the speed, the path, the pauses, the rhythm. These patterns become data, and it is possible to measure how much a session looks like the account owner's.",
      'That is why it works as continuous authentication. Instead of checking the person only at login, the behavior is observed throughout the whole session. I studied the topic in mouse_dynamics, during my MBA at FIAP, and worked with it at PagBank.',
    ],
  },
  {
    key: 'credit-cycle',
    title: 'Credit cycle',
    short: 'From granting credit to following the customer over time.',
    color: '#d4a15a',
    illustration: 'credit',
    keywords: ['application', 'behavior', 'TPV', 'payment arrangements'],
    paragraphs: [
      'The credit cycle starts when credit is granted and goes on after that. Application models help decide who gets credit. Behavior models follow the customer over time, looking at how they behave.',
      'At PagBank I also built the daily TPV forecast model (the total volume of payments) and the routines that monitor the models. Today, at CERC, I work on the credit cycle and on fraud models inside payment arrangements.',
    ],
  },
  {
    key: 'data-engineering',
    title: 'Data engineering',
    short: 'Pipelines and platforms so the data arrives right.',
    color: '#b85c3d',
    illustration: 'pipeline',
    keywords: ['PySpark', 'Databricks', 'Delta Lake', 'Airflow', 'Kafka'],
    paragraphs: [
      'Data engineering is getting data to the right place, in the right format, at the right time. I have built ETL/ELT pipelines with Spark, Airflow and Kafka, and today I work with Databricks, PySpark and Delta Lake.',
      'I also took part in designing data lakes, data warehouses and data marts, always paying attention to data governance.',
    ],
  },
  {
    key: 'llm-agents',
    title: 'AI agents and LLMs',
    short: 'AI agents in LLM projects.',
    color: '#f2ead8',
    illustration: 'llm',
    keywords: ['LLM', 'AI agents', 'Vertex AI', 'MLOps'],
    paragraphs: [
      "At CERC I use AI agents in projects that involve LLMs, alongside the analyses and modeling I do on CERC's data.",
      'In 2026 I took the Generative AI and MLOps with Vertex AI course, at Google Cloud.',
    ],
  },
]

export const projectCategories: { key: ProjectCategory; label: string }[] = [
  { key: 'credito', label: 'Credit' },
  { key: 'fraude', label: 'Fraud and security' },
  { key: 'ia', label: 'AI and machine learning' },
  { key: 'dados', label: 'Data engineering' },
  { key: 'software', label: 'Software' },
]

export const projects: Project[] = [
  {
    name: 'Fraud models in payment arrangements',
    tagline: 'Fraud in the receivables world',
    description:
      'Fraud models inside payment arrangements, built on the receivables data registered at CERC.',
    where: 'CERC',
    categories: ['fraude', 'ia'],
    tags: ['Python', 'PySpark', 'Databricks', 'Machine learning'],
    year: '2026',
  },
  {
    name: 'Modeling of arrangements, duplicatas and other assets',
    tagline: 'Analyses for large credit clients',
    description:
      "Modeling on CERC's data as a whole, such as trade receivables (duplicatas), payment arrangements and other assets, with analyses and reports for large credit clients in Brazil.",
    where: 'CERC',
    categories: ['credito', 'dados'],
    tags: ['Databricks', 'PySpark', 'Delta Lake', 'Python'],
    year: '2026',
  },
  {
    name: 'AI agents with LLMs',
    tagline: 'Generative AI applied to analyses',
    description:
      "AI agents in projects that involve LLMs, supporting the analyses and reports built on CERC's data.",
    where: 'CERC',
    categories: ['ia'],
    tags: ['LLM', 'AI agents', 'Python'],
    year: '2026',
  },
  {
    name: 'Credit cycle models',
    tagline: 'Application and behavior',
    description:
      "Application models, which support the decision to grant credit, and behavior models, which follow the customer's behavior after credit is granted. Includes the automation of the modeling and the performance monitoring of the models.",
    where: 'PagBank',
    categories: ['credito', 'ia'],
    tags: ['Python', 'scikit-learn', 'SHAP', 'PySpark', 'AWS SageMaker'],
    year: '2022 to 2026',
  },
  {
    name: 'Daily TPV forecast',
    tagline: 'Payment volume, day by day',
    description:
      "A model that forecasts, day by day, the customers' TPV (total payment volume), used to support credit policies and business decisions.",
    where: 'PagBank',
    categories: ['credito', 'ia'],
    tags: ['Python', 'Time series', 'Machine learning'],
    year: '2022 to 2026',
  },
  {
    name: 'Device score for account security',
    tagline: 'Device fingerprint against fraud and attacks',
    description:
      'Supervised and unsupervised models that give a score to each device, based on the unique traits of the hardware and on usage patterns, to protect accounts from fraud and attacks.',
    where: 'PagBank',
    categories: ['fraude', 'ia'],
    tags: ['Device fingerprint', 'Python', 'scikit-learn', 'PySpark'],
    year: '2022 to 2026',
  },
  {
    name: 'Behavioral biometrics models',
    tagline: 'The way of using as one more layer of protection',
    description:
      "Models that compare the behavior of each session with the account owner's pattern, as one more layer of protection against fraud in account security.",
    where: 'PagBank',
    categories: ['fraude', 'ia'],
    tags: ['Behavioral biometrics', 'Python', 'Machine learning'],
    year: '2022 to 2026',
  },
  {
    name: 'Customer segmentation',
    tagline: 'Behavior studies in credit',
    description:
      'Analytical reports and behavior studies to segment customers in the Credit BU.',
    where: 'PagBank',
    categories: ['credito'],
    tags: ['Python', 'SQL', 'Data analysis'],
    year: '2022 to 2026',
  },
  {
    name: 'Authentication and onboarding data',
    tagline: 'Login, MFA, OTP and account opening',
    description:
      'ETL/ELT pipelines and data platforms for account security, with the login, MFA, OTP and customer onboarding events, in data lakes, data warehouses and data marts.',
    where: 'PagBank',
    categories: ['dados', 'fraude'],
    tags: ['PySpark', 'Kafka', 'Airflow', 'Redshift'],
    year: '2021 to 2022',
  },
  {
    name: 'fraud-pix-model',
    tagline: 'Fraud detection in PIX transactions',
    description:
      'Compares Random Forest and XGBoost to find fraudulent transactions, handles the imbalance between fraud and normal transactions and prioritizes recall, because missing a fraud costs more than a false positive. Includes an API to serve the model.',
    where: 'GitHub',
    categories: ['fraude', 'ia'],
    url: 'https://github.com/g-roger/fraud-pix-model',
    tags: ['Python', 'XGBoost', 'Random Forest', 'API'],
    year: '2022',
  },
  {
    name: 'mouse_dynamics',
    tagline: 'Behavioral biometrics with the mouse',
    description:
      'Uses the Balabit Mouse Dynamics Challenge dataset to recognize an account owner by the way they move the mouse, with clustering and neural networks, and to flag sessions that are not theirs.',
    where: 'GitHub',
    categories: ['fraude', 'ia'],
    url: 'https://github.com/g-roger/mouse_dynamics',
    tags: ['Python', 'Neural networks', 'Clustering'],
    year: '2022',
  },
  {
    name: 'german-loan-eda',
    tagline: 'Credit analysis in R',
    description:
      'Explores 1,000 loan applications to understand the profile of the people who ask for credit and uses a random forest classifier to indicate whether the loan should be granted.',
    where: 'GitHub',
    categories: ['credito', 'ia'],
    url: 'https://github.com/g-roger/german-loan-eda',
    tags: ['R', 'Random Forest', 'Credit risk'],
    year: '2023',
  },
  {
    name: 'time_series_studies',
    tagline: 'Sales forecasting with time series',
    description:
      'Studies from the Kaggle Store Sales competition: trend, seasonality, time series as features and forecasting with machine learning.',
    where: 'GitHub',
    categories: ['ia'],
    url: 'https://github.com/g-roger/time_series_studies',
    tags: ['Python', 'Time series', 'Kaggle'],
    year: '2024',
  },
  {
    name: 'nlp-disaster-tweets-competition',
    tagline: 'NLP in a Kaggle competition',
    description:
      'Classifies whether a tweet is about a real disaster or not, in the Kaggle competition Natural Language Processing with Disaster Tweets.',
    where: 'GitHub',
    categories: ['ia'],
    url: 'https://github.com/g-roger/nlp-disaster-tweets-competition',
    tags: ['Python', 'NLP', 'Kaggle'],
    year: '2023',
  },
  {
    name: 'heart-attack-analysis',
    tagline: 'Heart disease risk',
    description:
      'Machine learning models that estimate the ten-year risk of coronary heart disease, using the data from the Framingham study.',
    where: 'GitHub',
    categories: ['ia'],
    url: 'https://github.com/g-roger/heart-attack-analysis',
    tags: ['Python', 'Classification', 'Health'],
    year: '2023',
  },
  {
    name: 'analise-vegetativa-bemagro',
    tagline: 'Computer vision in agriculture',
    description:
      'At the Bemagro hackathon, I analyzed NDVI images of crops in Mato Grosso do Sul to tell whether the planting was ahead or behind schedule and to find areas that were not developing.',
    where: 'GitHub',
    categories: ['ia'],
    url: 'https://github.com/g-roger/analise-vegetativa-bemagro',
    tags: ['Computer vision', 'Python', 'Hackathon'],
    year: '2022',
  },
  {
    name: 'post-graduation-deep-learning',
    tagline: 'Deep learning in the FIAP MBA',
    description:
      'Autoencoders, convolutional networks and recurrent networks trained during the AI MBA, with MNIST, CIFAR-10 and a spam filter.',
    where: 'GitHub',
    categories: ['ia'],
    url: 'https://github.com/g-roger/post-graduation-deep-learning',
    tags: ['Deep learning', 'Keras', 'CNN', 'RNN'],
    year: '2021',
  },
  {
    name: 'EDA-housing',
    tagline: 'House price prediction',
    description:
      'Linear regression to predict house prices in California, with outlier handling and evaluation by R², MSE and RMSE.',
    where: 'GitHub',
    categories: ['ia'],
    url: 'https://github.com/g-roger/EDA-housing',
    tags: ['Python', 'Regression', 'Exploratory analysis'],
    year: '2021',
  },
  {
    name: 'bigquery_natality_analysis',
    tagline: 'Data analysis in BigQuery',
    description:
      "Exploratory analysis of the BigQuery public natality dataset, on Google Cloud, to understand what influences babies' birth weight.",
    where: 'GitHub',
    categories: ['dados'],
    url: 'https://github.com/g-roger/bigquery_natality_analysis',
    tags: ['BigQuery', 'Google Cloud', 'Python'],
    year: '2023',
  },
  {
    name: 'Corporate education platforms',
    tagline: 'Learning management for large companies',
    description:
      'Learning management software used in the corporate education projects that Mastertech did with large companies.',
    where: 'Mastertech',
    categories: ['software'],
    tags: ['Python', 'Flask', 'Django REST', 'MongoDB'],
    year: '2018 to 2021',
  },
  {
    name: 'moip-sdk-python',
    tagline: 'Python SDK for the Moip API',
    description:
      'Open library to integrate Python applications with the Moip payments API: customers, orders and payments. Written at Mastertech.',
    where: 'GitHub',
    categories: ['software'],
    url: 'https://github.com/g-roger/moip-sdk-python',
    tags: ['Python', 'SDK', 'Payments'],
    year: '2018',
  },
  {
    name: 'track',
    tagline: 'Market intelligence by region',
    description:
      'Dashboard that maps the commercial establishments of a region, shows the competitors on a map and helps build prospecting lists. Uses the open CNPJ data from the Brazilian Federal Revenue Service.',
    where: 'Personal project',
    categories: ['software', 'dados'],
    tags: ['FastAPI', 'React', 'Open data'],
    year: '2026',
  },
  {
    name: 'finapp',
    tagline: 'Personal finance control',
    description:
      'Personal finance web system in Python, with a widget dashboard that each user rearranges and an analysis of credit card statements.',
    where: 'Personal project',
    categories: ['software'],
    tags: ['Python', 'Tornado', 'Chart.js'],
    year: '2026',
  },
]

export const timeline: TimelineItem[] = [
  {
    period: '2026 to present',
    role: 'Tech Lead, Data Scientist and Data Engineer',
    place: 'CERC, Receivables Registry Chamber',
    detail:
      "I'm a tech lead and work in both data science and engineering. I work with payment arrangements, on credit projects and fraud models that involve large credit clients in Brazil.",
    bullets: [
      'Technical leadership of the data projects',
      'Fraud models in payment arrangements',
      'Analyses and reports for large credit clients',
      "Modeling on CERC's data: duplicatas, arrangements and other assets",
      'AI agents in LLM projects',
      'Pipelines in Databricks, PySpark and Delta Lake',
    ],
    tags: ['Databricks', 'PySpark', 'Delta Lake', 'Python', 'LLM', 'Azure DevOps'],
  },
  {
    period: '2022 to 2026',
    role: 'Senior Data Scientist',
    place: 'PagBank (PagSeguro)',
    detail: 'I worked on two fronts: the Credit BU and the Account Security BU.',
    bullets: [
      'Credit: application and behavior models and daily TPV forecasting, to support credit policies and business decisions',
      'Account security: supervised and unsupervised behavioral biometrics and device score (device fingerprint) models, to prevent fraud and attacks',
      'Automation of the modeling process and performance monitoring of the models',
      'Reports and behavior studies for customer segmentation',
    ],
    tags: ['Python', 'scikit-learn', 'TensorFlow', 'Keras', 'PySpark', 'SHAP', 'AWS SageMaker', 'Kafka'],
  },
  {
    period: '2022 to 2025',
    role: 'Data Instructor and Mentor',
    place: 'Awari, alongside PagBank',
    detail:
      'I taught data science and data engineering classes and did one-on-one mentoring with students who wanted to get into the field.',
    bullets: [
      'Classes on data pipelines, machine learning models and data modeling',
      'Career mentoring for people moving into data',
    ],
    tags: ['Teaching', 'Mentoring', 'Python', 'SQL'],
  },
  {
    period: '2021 to 2022',
    role: 'Mid-level Data Engineer',
    place: 'PagBank (PagSeguro)',
    detail:
      'I worked with account security and authentication data: login, MFA, OTP and customer onboarding.',
    bullets: [
      'ETL/ELT pipelines with data governance throughout the process',
      'Design, creation and management of data lakes, data warehouses and data marts',
      'Integration of transactional data with the software engineering teams',
      'Statistical analyses for microservices and interactive dashboards',
    ],
    tags: ['Python', 'Flask', 'Django', 'PySpark', 'Kafka', 'Airflow', 'Redshift', 'MySQL', 'Pentaho', 'Power BI'],
  },
  {
    period: '2017 to 2021',
    role: 'Senior Back-End Software Engineer',
    place: 'Mastertech',
    detail:
      "I joined as a back-end software engineer and grew to senior. I was the lead developer of the company's software, both the products sold to clients and the internal systems. I also worked in consulting for large companies, on software, data and education projects. I was placed at the client, developing the project as a design partner, or inside Mastertech, together with the company, supporting the team on the solutions.",
    bullets: [
      'Product prototyping in every project and development in the ones that called for it',
      'Big data analysis',
      'Education projects, such as corporate education platforms, and support for professionals adopting and introducing a new technology',
      'REST APIs and microservices in Python, with Flask, Django REST Framework and PyMongo, with Scrum and CI/CD',
      'Author of moip-sdk-python, an open SDK for the Moip payments API',
      "Training in Python, PySpark, REST APIs and microservices for the clients' teams",
    ],
    clients: [
      'Itaú',
      'Santander',
      'Vivo',
      'Porto',
      'Globo (Globo Led project)',
      'Disney',
      'Facebook (Estação Hack project)',
      'IBM',
      'Heineken',
      'Bayer',
      'C&A',
      'Icatu Seguros',
      'Banco Omni',
      'Sebrae',
      'ETEC',
      'and others',
    ],
    tags: ['Consulting', 'Design partner', 'Prototyping', 'Big data', 'Python', 'Flask', 'Django REST', 'PySpark', 'MongoDB', 'Scrum', 'CI/CD'],
  },
  {
    period: '2017 to 2018',
    role: 'Software Development Intern',
    place: 'Ponte21',
    detail:
      'Front-end and back-end of educational systems, e-commerce and management APIs, alongside senior engineers.',
    bullets: ['Took part in every stage, from conception to testing'],
    tags: ['C#', 'ASP.NET Core', 'Entity Framework', 'MySQL', 'JavaScript', 'Azure'],
  },
  {
    period: '2013 to 2017',
    role: 'Computer Instructor',
    place: 'Grupo All Net',
    detail:
      "I taught Microsoft Office (with a focus on Excel), hardware, programming logic and website building. I also created the class content and adapted the teaching to each student's profile.",
    tags: ['Teaching', 'Excel', 'Programming logic'],
  },
]

// Mesmos números de data.ts: só os rótulos mudam.
export function careerStats(now: Date = new Date()): Stat[] {
  const mastertech = timeline.find((t) => t.place === 'Mastertech')
  const nomeados = (mastertech?.clients ?? []).filter((c) => c !== 'and others').length

  return [
    { n: now.getFullYear() - 2013, suffix: '', label: 'years of career, since 2013' },
    { n: 5, suffix: '', label: 'years at PagBank, from 2021 to 2026' },
    { n: nomeados, suffix: '+', label: 'companies and institutions served by Mastertech' },
    { n: 3, suffix: '', label: 'years as an instructor and mentor at Awari' },
  ]
}

export const techStack: TechCategory[] = [
  {
    name: 'Languages',
    color: '#e8c37a',
    items: ['Python', 'SQL', 'JavaScript', 'TypeScript', 'C#'],
  },
  {
    name: 'Data science and ML',
    color: '#8fb8a2',
    items: ['scikit-learn', 'TensorFlow', 'Keras', 'Pandas', 'SHAP'],
  },
  {
    name: 'Data engineering',
    color: '#3f7a5b',
    items: ['PySpark', 'Databricks', 'Delta Lake', 'Airflow', 'Kafka', 'Pentaho', 'Power BI'],
  },
  {
    name: 'Cloud',
    color: '#d4a15a',
    items: ['AWS (S3, EMR, EC2, SageMaker, Glue)', 'Azure DevOps', 'Google Cloud (Vertex AI)', 'Fly.dev'],
  },
  {
    name: 'Generative AI',
    color: '#f2ead8',
    items: ['LLMs', 'AI agents', 'Vertex AI'],
  },
  {
    name: 'Web and APIs',
    color: '#b85c3d',
    items: ['FastAPI', 'Flask', 'Django REST Framework', 'ASP.NET Core', 'React'],
  },
  {
    name: 'Databases',
    color: '#8fb8a2',
    items: ['Redshift', 'MySQL', 'MongoDB', 'SQLite'],
  },
  {
    name: 'DevOps',
    color: '#e8c37a',
    items: ['Git', 'Jenkins', 'Docker', 'CI/CD'],
  },
]
