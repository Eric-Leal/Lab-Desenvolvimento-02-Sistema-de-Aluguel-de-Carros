# Design System Documentation: The Editorial Concierge

## 1. Overview & Creative North Star: "The Precision Concierge"

This design system move away from the utilitarian "SaaS dashboard" aesthetic and toward the world of high-end automotive editorial. Our Creative North Star is **"The Precision Concierge."** It combines the authoritative, high-contrast typography of a luxury car magazine with the seamless, layered functionality of a premium concierge service.

Instead of a rigid grid of boxes, we utilize intentional asymmetry, massive typographic scales, and tonal depth to guide the user through the car rental journey. We don't just "show" cars; we curate an experience where the interface recedes to let the vehicle's craftsmanship take center stage.

---

## 2. Colors: Tonal Architecture

We define space through light and color, not lines. Our palette is anchored in a deep, authoritative **Primary Blue** (`primary.700` → `#1A4DA8`) and a sophisticated range of cool-toned architectural neutrals.

### Global Palette

| Scale | Primary | Neutral |
|-------|---------|---------|
| 50 | `#F3F7FE` | `#F8F9FC` |
| 100 | `#E7EFFC` | `#F1F2F8` |
| 200 | `#CBDEF9` | `#E5E7F0` |
| 300 | `#9EBFF3` | `#CBD0DC` |
| 400 | `#689BEB` | `#9CA3B7` |
| 500 | `#387ADE` | `#757D93` |
| 600 | `#2663C7` | `#525B72` |
| 700 | `#1A4DA8` | `#363F52` |
| 800 | `#113A88` | `#222939` |
| 900 | `#0B2965` | `#181D2A` |
| 950 | — | `#10131F` |

### Semantic Tokens (Light Mode)

| Token | Value | Use |
|-------|-------|-----|
| `bg.page` | `neutral.50` → `#F8F9FC` | Background da página inteira |
| `bg.surface` | `neutral.0` → `#FFFFFF` | Cards, modais, sidebars |
| `bg.surface-2` | `neutral.100` → `#F1F2F8` | Inputs, tabelas zebradas, áreas internas |
| `bg.primary` | `primary.700` → `#1A4DA8` | Header da marca, botão primário |
| `bg.primary-subtle` | `primary.100` → `#E7EFFC` | Seções com destaque de marca sutil |
| `text.primary` | `neutral.950` → `#10131F` | Texto principal, títulos |
| `text.secondary` | `neutral.600` → `#525B72` | Labels, metadados, suporte |
| `text.disabled` | `neutral.400` → `#9CA3B7` | Campos desabilitados |
| `text.on-dark` | `neutral.0` → `#FFFFFF` | Texto sobre fundo escuro ou primário |
| `text.brand` | `primary.700` → `#1A4DA8` | Links, destaques de marca |
| `border.default` | `neutral.200` → `#E5E7F0` | Bordas de card e input padrão |
| `border.strong` | `neutral.300` → `#CBD0DC` | Bordas de separação mais visíveis |
| `border.brand` | `primary.500` → `#387ADE` | Input focado, card selecionado |
| `interactive.rest` | `primary.700` → `#1A4DA8` | Botão primário — repouso |
| `interactive.hover` | `primary.800` → `#113A88` | Botão primário — hover |
| `interactive.press` | `primary.900` → `#0B2965` | Botão primário — pressed |
| `interactive.subtle` | `primary.100` → `#E7EFFC` | Botão ghost com fundo sutil |

### Color Strategy

- **Primary (`#1A4DA8` / `primary.700`):** Signal color. Use as the "Golden Thread" — the path the user takes to complete a booking.
- **The "No-Line" Rule:** Prohibit 1px solid borders to define sections. Boundaries are created via background color shifts (e.g., `bg.surface-2` inside `bg.surface`).
- **Surface Hierarchy:**
  - **Page Background:** `bg.page` (`#F8F9FC`)
  - **Cards, modais:** `bg.surface` (`#FFFFFF`)
  - **Inputs, áreas internas:** `bg.surface-2` (`#F1F2F8`)
- **The "Glass & Gradient" Rule:** Floating elements (navbars, price calculators) use `backdrop-filter: blur(12px–20px)` with semi-transparent `bg.surface`.
- **Signature Texture:** For high-impact areas, apply a subtle linear gradient from `primary.700` (`#1A4DA8`) to `primary.600` (`#2663C7`) at 135° to add depth.

### Accent

| Token | Light | Dark |
|-------|-------|------|
| `accent.default` | `accent.500` → `#D98704` | `accent.300` → `#FDCB70` |
| `accent.bg` | `accent.100` → `#FFF2D4` | `accent.700` → `#804C00` |

Use accent for preços, valores monetários e CTAs secundários.

---

## 3. Typography: Editorial Authority

The contrast between **DM Serif Display** and **DM Sans** is the heartbeat of this system.

| Token | Family | Style | Size | Use |
|-------|--------|-------|------|-----|
| `display` | DM Serif Display | Italic | 48px | Hero sections, páginas de entrada, títulos de campanha |
| `h1` | DM Serif Display | Regular | 36px | Título principal de página |
| `h2` | DM Sans | Bold | 28px | Seções internas, títulos de card grande |
| `h3` | DM Sans | Bold | 22px | Títulos de card, modal, sidebar |
| `h4` | DM Sans | Medium | 18px | Subtítulos, grupos de formulário |
| `body-lg` | DM Sans | Regular | 16px | Parágrafos principais, descrições |
| `body` | DM Sans | Regular | 14px | Corpo de texto padrão, tabelas, formulários |
| `caption` | DM Sans | Regular | 12px | Timestamps, metadados, notas de rodapé |
| `label` | DM Sans | Medium | 12px | Badges de status, botões pequenos, rótulos de campo |

- **DM Serif Display** para nomes de carros, títulos e declarações de alto impacto. A serifa transmite herança, luxo e confiança.
- **DM Sans** para todo o resto. Alta legibilidade, neutro. Use `body-lg` para descrições de veículos e termos; `label` para specs técnicas (combustível, câmbio).
- Use DM Serif Display também para números de destaque (ex.: diárias) para que a precificação pareça "desenhada".

---

## 4. Spacing

| Token | Value |
|-------|-------|
| `spacing.4` | 4px |
| `spacing.8` | 8px |
| `spacing.12` | 12px |
| `spacing.16` | 16px |
| `spacing.24` | 24px |
| `spacing.32` | 32px |
| `spacing.48` | 48px |
| `spacing.64` | 64px |

Use espaçamento generoso. Se parecer suficiente, adicione mais `spacing.16`.

---

## 5. Border Radius

| Token | Value | Use |
|-------|-------|-----|
| `radius.sm` | 4px | Badges, pills pequenos |
| `radius.md` | 8px | Botões, inputs, containers padrão |
| `radius.lg` | 12px | Cards, modais |
| `radius.xl` | 16px | Painéis grandes |
| `radius.full` | 999px | Tags completamente arredondadas |

Use `radius.md` (8px) como padrão para todos os containers.

---

## 6. Elevation & Depth: Tonal Layering

Profundidade é criada por sobreposição de superfícies, não por sombras.

- **Layering Principle:** Coloque um card `bg.surface` (`#FFFFFF`) sobre uma seção `bg.surface-2` (`#F1F2F8`). A diferença sutil de tom cria um "soft lift" mais sofisticado que drop shadows.
- **Ambient Shadows:** Para elementos flutuantes (sticky bar "Reservar agora"), use `box-shadow` com primary tintado: `rgba(26, 77, 168, 0.06)` com blur de 40px.
- **Ghost Border Fallback:** Se um divisor for obrigatório por acessibilidade, use `border.default` (`#E5E7F0`) a 15% de opacidade. Deve ser sentido, não visto.
- **Glassmorphism:** Para overlays flutuantes, `backdrop-filter: blur(12px)` com `bg.surface` semi-transparente. Permite que as fotos dos veículos "sangrem" pela UI.

---

## 7. Components: Functional Elegance

### Buttons & Interaction

- **Primary Button:** Background `interactive.rest` (`#1A4DA8`). Hover: `interactive.hover` (`#113A88`). Press: `interactive.press` (`#0B2965`). Radius `radius.md`. Sem borda. Texto `text.on-dark` (`#FFFFFF`).
- **Ghost Button:** Background transparente. Borda `border.default` a 20% de opacidade, transicionando para `interactive.subtle` (`#E7EFFC`) no hover.

### Status Mapping (The Feedback Loop)

Badges no formato "pill" (`radius.full`) com fundo sutil e texto de alto contraste:

| Status | Background | Text |
|--------|-----------|------|
| `RASCUNHO` | `status.neutral-bg` → `neutral.200` | `status.neutral-fg` → `neutral.700` |
| `SUBMETIDO` | `primary.100` → `#E7EFFC` | `primary.800` → `#113A88` |
| `PENDENTE_LOCADOR` | `status.warning-bg` → `#FFF5CE` | `status.warning-fg` → `#8F5600` |
| `APROVADO_LOCADOR` | `primary.200` → `#CBDEF9` | `primary.900` → `#0B2965` |
| `REPROVADO_LOCADOR` | `status.danger-bg` → `#FDE4E4` | `status.danger-fg` → `#881515` |
| `EM_ANALISE_BANCO` | `accent.100` → `#FFF2D4` | `accent.700` → `#804C00` |
| `CONTRATO_FECHADO` | `status.success-bg` → `#DAFAE7` | `status.success-fg` → `#0C673D` |
| `REPROVADO_BANCO` | `status.danger-bg` → `#FDE4E4` | `status.danger-fg` → `#881515` |
| `CANCELADO` | `status.neutral-bg` → `neutral.200` | `status.neutral-fg` → `neutral.700` |

### Car Cards & Lists

- **No Dividers:** Nunca use linhas horizontais para separar itens. Use gap de `spacing.24` ou fundo alternado `bg.surface-2`.
- **Image Dominance:** A imagem do carro deve ocupar ~60% da área do card, levemente sobrepondo o container de texto para quebrar o visual "em caixas".

### Input Fields

- **Soft Field:** Background `bg.surface-2` (`#F1F2F8`) sem borda. No foco, adicionar apenas `border-bottom: 2px solid` com `border.brand` (`#387ADE`). Mantém o formulário leve e editorial.

---

## 8. Do's and Don'ts

### Do
- **Do** usar espaçamento extremo. Se parecer suficiente, adicione `spacing.16` a mais.
- **Do** usar DM Serif Display para números de destaque (ex.: valores de diária).
- **Do** usar `radius.md` (8px) para todos os containers como padrão.
- **Do** usar `text.primary` (`#10131F`) como cor de texto principal — nunca preto puro (`#000000`).

### Don't
- **Don't** usar preto puro (`#000000`). Use `text.primary` (`#10131F`) para melhor conforto visual.
- **Don't** usar dropdowns nativos `<select>`. Crie menus "Tonal Layer" customizados e full-width que deslizam para cima.
- **Don't** usar bordas `1px solid` para separar header do conteúdo. Use mudança de fundo (`bg.primary` no header vs. `bg.page` no conteúdo) ou backdrop-blur.
- **Don't** usar mais de dois tamanhos de fonte por seção — mantenha a hierarquia clara com os tokens definidos.

---

## 9. Dark Mode Tokens

| Token | Value |
|-------|-------|
| `bg.page` | `neutral.950` → `#10131F` |
| `bg.surface` | `neutral.900` → `#181D2A` |
| `bg.surface-2` | `neutral.800` → `#222939` |
| `bg.primary` | `primary.600` → `#2663C7` |
| `text.primary` | `neutral.50` → `#F8F9FC` |
| `text.secondary` | `neutral.400` → `#9CA3B7` |
| `text.brand` | `primary.400` → `#689BEB` |
| `border.default` | `neutral.700` → `#363F52` |
| `border.strong` | `neutral.600` → `#525B72` |
| `interactive.rest` | `primary.500` → `#387ADE` |
| `interactive.hover` | `primary.400` → `#689BEB` |
| `interactive.press` | `primary.300` → `#9EBFF3` |
| `accent.default` | `accent.300` → `#FDCB70` |
| `accent.bg` | `accent.700` → `#804C00` |

---

## 10. Quick Reference: Token Summary

- **Corner Radius padrão:** `radius.md` = 8px
- **Primary Base (rest):** `primary.700` = `#1A4DA8`
- **Page Background:** `bg.page` = `#F8F9FC`
- **Tipografia Headings:** DM Serif Display
- **Tipografia Body:** DM Sans
- **Accent (preços/CTAs):** `accent.500` = `#D98704` (light) / `accent.300` = `#FDCB70` (dark)
