# Imperium Primus — Site

Site institucional/portfólio da **Imperium Primus**. Conceito: toda a página é
**uma única fita contínua** derivada da geometria da logo (monograma IP de fitas
dobradas, isométrico, com rim-light azul). Estética premium, mono preto/branco +
acento azul-frio, movimento coerente e conteúdo próprio (sem clichê corporativo).

## Stack

- **Vite + React + TypeScript** — base leve, deploy 100% estático.
- **GSAP + ScrollTrigger** — desenho da fita conduzido pelo scroll.
- **Three.js + React-Three-Fiber** — hero 3D: a **logo real extrudada**. O
  `src/assets/ip-mark-trace.svg` é a **vetorização fiel** de `public/ip-mark.png`
  (gerada por `scripts/trace-logo.mjs` com potrace); o `SVGLoader` a transforma em
  formas 3D com volume e rim-light azul. Fica em **chunk separado e lazy**: só
  carrega em desktop com WebGL, fora de `prefers-reduced-motion`.
  Mobile/reduced-motion usam a **PNG real** da logo (`mix-blend-mode: screen`).
  Force a experiência 3D mesmo com reduced-motion no SO via **`?motion=full`**.

  Regerar o vetor da logo (se a logo mudar): `node scripts/trace-logo.mjs 120`
  (o número é o limiar de corte; 120 costuma dar o traço mais fiel).
- **@fontsource** (Space Grotesk + Inter, variáveis) — fontes self-hosted, sem CDN.

## Rodar

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # gera dist/ (estático)
npm run preview    # serve o build
```

Testar no celular na mesma rede: `npm run dev -- --host` e abrir o IP mostrado.

## Publicar

`npm run build` gera `dist/`. Suba em qualquer host estático (Vercel, Netlify,
Cloudflare Pages, GitHub Pages). Sem servidor/backend.

## Onde editar (fonte única de conteúdo)

Quase tudo vive em **`src/content/site.ts`**:

- **Contato** — `contact.email`, `contact.instagram` já reais. Trocar os
  placeholders marcados: `whatsapp`, `linkedin`.
- **Serviços** — `services.groups` (nomes e descrições).
- **Processo, Princípios (MVV), Diferenciais, Manifesto** — textos.
- **Projetos** — array `projects`. Está **vazio de propósito** (estado vazio
  honesto). Para publicar cases, adicione objetos no formato comentado no arquivo;
  o grid aparece automaticamente quando houver ao menos 1 projeto.

Outros pontos de edição:

- **Domínio / OG / SEO** — `index.html` (metas `og:url`, `og:image`). Trocar o
  placeholder do domínio e adicionar `public/og.png` (1200×630).
- **Tokens de design** (cores, tipografia, espaçamento, motion) — `src/styles/tokens.css`.
- **Trajetória da fita** — `src/ribbon/ribbonPath.ts` (âncoras do percurso).

## Estrutura

```
src/
  content/site.ts        Conteúdo (edite aqui)
  styles/                tokens.css · global.css · sections.css
  ribbon/                RibbonLayer (SVG fixo) + ribbonPath (gerador do caminho)
  three/RibbonHero.tsx   Hero 3D (lazy)
  sections/              Hero, Manifesto, Principles, Services, Process,
                         Differentiators, Projects, Contact, Footer
  components/            Header, IpMark, SectionHeading
  lib/                   gsap (registro), useReducedMotion
```

## Acessibilidade & Performance

- HTML semântico, foco visível, skip-link, contraste controlado, alvos ≥44px.
- `prefers-reduced-motion`: fita estática, sem 3D animado, revelações instantâneas.
- Animações só em `transform`/`opacity` (GPU). 3D e GSAP em chunks separados.
```
