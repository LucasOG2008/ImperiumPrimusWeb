/* =============================================================================
   IMPERIUM PRIMUS — CONTEÚDO (fonte única)
   Edite aqui: copy, serviços, processo, contato. Nada de dado fictício
   apresentado como real — placeholders vêm marcados com PLACEHOLDER.
   ============================================================================= */

export const brand = {
  name: "Imperium Primus",
  short: "IP",
  // Frase de posicionamento — curta, própria, sem clichê corporativo.
  positioning: "Entender antes de resolver.",
  tagline:
    "Software, aplicativos e design construídos com engenharia e cuidado — para entregar o que o seu projeto realmente precisa.",
} as const;

export const nav = [
  { id: "manifesto", label: "Manifesto" },
  { id: "principios", label: "Princípios" },
  { id: "servicos", label: "Serviços" },
  { id: "processo", label: "Processo" },
  { id: "projetos", label: "Projetos" },
  { id: "contato", label: "Contato" },
] as const;

export const hero = {
  eyebrow: "Estúdio de produto digital",
  lines: ["Entender", "antes de", "resolver."],
  lead:
    "A Imperium Primus projeta e constrói software, aplicativos e identidade digital. A gente começa entendendo o problema de verdade — e só então propõe a solução certa.",
  primaryCta: { label: "Começar uma conversa", href: "#contato" },
  secondaryCta: { label: "Como trabalhamos", href: "#processo" },
} as const;

export const manifesto = {
  eyebrow: "Manifesto",
  num: "01",
  title: "Uma empresa começa pela forma como trata quem confia nela.",
  paragraphs: [
    "A Imperium Primus nasceu de um incômodo: bons projetos travam quando ninguém para para escutar. Prazos viram desculpa, o cliente vira ticket, e o que se entrega é o pedido — raramente a solução.",
    "A gente decidiu trabalhar ao contrário. Primeiro entender a pessoa, o negócio e o problema. Depois desenhar. Só então construir. Cada decisão tem intenção, cada detalhe tem motivo.",
    "Somos novos, e isso é uma vantagem: dá para fazer certo desde a primeira linha. Educação, transparência e cuidado não são diferencial — são o mínimo. O diferencial é fazer isso sem abrir mão de qualidade técnica.",
  ],
  signature: "— É por isso que existimos.",
} as const;

/* Missão · Visão · Valores — três "estações" ao longo da fita, não três cards. */
export const principles = {
  eyebrow: "Princípios",
  num: "02",
  stations: [
    {
      key: "missao",
      label: "Missão",
      headline:
        "Atender com qualidade real e fazer cada cliente se sentir ouvido, valorizado e no controle.",
      body:
        "Buscar o melhor resultado possível em cada projeto — não o mais rápido de fechar, e sim o que resolve. Presença do começo ao fim.",
    },
    {
      key: "visao",
      label: "Visão",
      headline:
        "Crescer até virar um verdadeiro Imperium: admirado pelos projetos e pela forma de tratar as pessoas.",
      body:
        "Reconhecimento construído em cima de profissionalismo, transparência e cuidado — o que anda cada vez mais raro no mercado.",
    },
    {
      key: "valores",
      label: "Valores",
      headline:
        "Educação, respeito, transparência, qualidade, responsabilidade e atenção aos detalhes.",
      body:
        "E o compromisso de entregar o que o cliente precisa — não apenas o que ele achou que queria no início.",
    },
  ],
} as const;

export const services = {
  eyebrow: "Serviços",
  num: "03",
  title: "Duas frentes, uma mesma obsessão por precisão.",
  intro:
    "Do primeiro rascunho ao produto em produção. Você pode chegar com um problema aberto — a gente ajuda a definir o escopo certo.",
  groups: [
    {
      key: "dev",
      label: "Desenvolvimento",
      items: [
        {
          name: "Sites & Landing Pages",
          desc: "Presença digital rápida, acessível e feita para converter — sem template genérico.",
        },
        {
          name: "Sistemas Web / SaaS",
          desc: "Plataformas sob medida, escaláveis e mantíveis, com arquitetura pensada para durar.",
        },
        {
          name: "Aplicativos",
          desc: "Apps que as pessoas realmente usam: fluxo claro, performance e cuidado no detalhe.",
        },
        {
          name: "Integrações & APIs",
          desc: "Sistemas que conversam entre si — pagamentos, dados e serviços conectados com segurança.",
        },
      ],
    },
    {
      key: "design",
      label: "Design",
      items: [
        {
          name: "Identidade & Branding",
          desc: "A construção de uma marca coerente, do símbolo à aplicação, com significado por trás.",
        },
        {
          name: "UI/UX de Produto",
          desc: "Interfaces que reduzem esforço e transmitem qualidade em cada interação.",
        },
        {
          name: "Design System",
          desc: "Um sistema de componentes e regras que mantém tudo consistente enquanto o produto cresce.",
        },
      ],
    },
  ],
} as const;

export const process = {
  eyebrow: "Processo",
  num: "04",
  title: "Um caminho, seis dobras.",
  intro: "A fita não anda sozinha. Cada etapa existe para reduzir risco e aumentar clareza.",
  steps: [
    { n: "01", name: "Escutar", desc: "Entender o problema, o negócio e as pessoas antes de qualquer proposta." },
    { n: "02", name: "Desenhar", desc: "Planejar escopo, arquitetura e experiência — decisões antes de código." },
    { n: "03", name: "Erguer", desc: "Construir com qualidade técnica, em entregas visíveis e frequentes." },
    { n: "04", name: "Provar", desc: "Validar com dados e uso real. Ajustar enquanto ainda é barato ajustar." },
    { n: "05", name: "Entregar", desc: "Colocar no ar com cuidado, documentação e transferência de conhecimento." },
    { n: "06", name: "Evoluir", desc: "Acompanhar, medir e melhorar. Software bom nunca fica parado." },
  ],
} as const;

export const differentiators = {
  eyebrow: "Diferença",
  num: "05",
  title: "A gente não entrega o pedido. Entrega a solução.",
  body:
    "Muita empresa executa exatamente o que foi pedido — mesmo sabendo que existe um caminho melhor. A gente prefere a conversa difícil no começo do que o retrabalho no fim. Entender o problema de verdade é o que separa um fornecedor de um parceiro.",
  points: [
    { k: "Clareza", v: "Você sempre sabe onde o projeto está e por que cada decisão foi tomada." },
    { k: "Proximidade", v: "Trato direto, sem intermediário e sem jargão para inflar orçamento." },
    { k: "Rigor", v: "Qualidade técnica e visual tratada como parte do resultado, não como enfeite." },
    { k: "Honestidade", v: "Se algo não faz sentido para você, a gente diz — mesmo que dê menos trabalho para nós." },
  ],
} as const;

/* Portfólio — funciona com poucos e com muitos projetos. Estado vazio honesto. */
export type Project = {
  slug: string;
  name: string;
  category: string;
  year: string;
  summary: string;
  tags: string[];
};

export const projects: Project[] = [
  // Ainda sem cases publicados. Estrutura pronta — basta preencher.
  // Exemplo de formato (remover ao adicionar reais):
  // {
  //   slug: "nome-do-projeto",
  //   name: "Nome do Projeto",
  //   category: "Sistema Web",
  //   year: "2026",
  //   summary: "Uma frase sobre o desafio e o resultado.",
  //   tags: ["React", "Design System", "API"],
  // },
];

export const projectsCopy = {
  eyebrow: "Projetos",
  num: "06",
  title: "Os primeiros cases estão sendo construídos.",
  emptyLead:
    "Somos uma empresa nova — e este site é o nosso primeiro case. Se o cuidado aqui te agradou, imagine no seu projeto.",
  emptyCta: { label: "Quero ser um dos primeiros", href: "#contato" },
} as const;

export const contact = {
  eyebrow: "Contato",
  num: "07",
  title: "Vamos entender o seu problema.",
  lead:
    "Conte, sem formalidade, o que você quer resolver. A primeira conversa é para escutar — não para vender.",
  // Dados reais fornecidos pelo cliente:
  email: "imperiumprimusdev@gmail.com",
  instagram: { label: "@imperiumprimus", href: "https://www.instagram.com/imperiumprimus" },
  // PLACEHOLDER — trocar quando o cliente enviar:
  whatsapp: { label: "WhatsApp", href: "#", placeholder: true },
  linkedin: { label: "LinkedIn", href: "#", placeholder: true },
} as const;

export const footer = {
  blurb: "Estúdio de produto digital. Engenharia e cuidado em cada detalhe.",
  year: new Date().getFullYear(),
} as const;
