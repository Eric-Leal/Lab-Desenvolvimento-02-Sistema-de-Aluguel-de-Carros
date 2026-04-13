import Link from 'next/link'
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler'

const colorScale = [
  { token: 'primary.50', value: '#F3F7FE' },
  { token: 'primary.100', value: '#E7EFFC' },
  { token: 'primary.200', value: '#CBDEF9' },
  { token: 'primary.300', value: '#9EBFF3' },
  { token: 'primary.400', value: '#689BEB' },
  { token: 'primary.500', value: '#387ADE' },
  { token: 'primary.600', value: '#2663C7' },
  { token: 'primary.700', value: '#1A4DA8' },
  { token: 'primary.800', value: '#113A88' },
  { token: 'primary.900', value: '#0B2965' },
  { token: 'neutral.0', value: '#FFFFFF' },
  { token: 'neutral.50', value: '#F8F9FC' },
  { token: 'neutral.100', value: '#F1F2F8' },
  { token: 'neutral.200', value: '#E5E7F0' },
  { token: 'neutral.300', value: '#CBD0DC' },
  { token: 'neutral.400', value: '#9CA3B7' },
  { token: 'neutral.500', value: '#757D93' },
  { token: 'neutral.600', value: '#525B72' },
  { token: 'neutral.700', value: '#363F52' },
  { token: 'neutral.800', value: '#222939' },
  { token: 'neutral.900', value: '#181D2A' },
  { token: 'neutral.950', value: '#10131F' },
  { token: 'accent.100', value: '#FFF2D4' },
  { token: 'accent.300', value: '#FDCB70' },
  { token: 'accent.500', value: '#D98704' },
  { token: 'accent.700', value: '#804C00' },
]

const semanticTokens = [
  {
    token: 'bg.page',
    descricao: 'Plano de fundo principal do produto.',
    light: '#F8F9FC',
    dark: '#10131F',
  },
  {
    token: 'bg.surface',
    descricao: 'Cards, modais e painéis principais.',
    light: '#FFFFFF',
    dark: '#181D2A',
  },
  {
    token: 'bg.surface-2',
    descricao: 'Inputs, áreas internas e camadas secundárias.',
    light: '#F1F2F8',
    dark: '#222939',
  },
  {
    token: 'bg.primary',
    descricao: 'CTA principal e destaques de jornada.',
    light: '#1A4DA8',
    dark: '#2663C7',
  },
  {
    token: 'bg.primary-subtle',
    descricao: 'Realces suaves ligados à marca.',
    light: '#E7EFFC',
    dark: 'rgba(38, 99, 199, 0.18)',
  },
  {
    token: 'text.primary',
    descricao: 'Texto principal e títulos.',
    light: '#10131F',
    dark: '#F8F9FC',
  },
  {
    token: 'text.secondary',
    descricao: 'Texto de apoio, labels e metadados.',
    light: '#525B72',
    dark: '#9CA3B7',
  },
  {
    token: 'text.brand',
    descricao: 'Links e trechos de ênfase da marca.',
    light: '#1A4DA8',
    dark: '#689BEB',
  },
  {
    token: 'border.default',
    descricao: 'Borda padrão de inputs e contêineres.',
    light: '#E5E7F0',
    dark: '#363F52',
  },
  {
    token: 'border.strong',
    descricao: 'Separações mais explícitas quando necessárias.',
    light: '#CBD0DC',
    dark: '#525B72',
  },
  {
    token: 'border.brand',
    descricao: 'Foco, seleção e destaque interativo.',
    light: '#387ADE',
    dark: '#689BEB',
  },
  {
    token: 'interactive.hover',
    descricao: 'Estado hover do botão primário.',
    light: '#113A88',
    dark: '#689BEB',
  },
  {
    token: 'interactive.press',
    descricao: 'Estado pressed do botão primário.',
    light: '#0B2965',
    dark: '#9EBFF3',
  },
  {
    token: 'accent.default',
    descricao: 'Preço, métricas monetárias e CTA secundário.',
    light: '#D98704',
    dark: '#FDCB70',
  },
]

const typography = [
  {
    token: 'display',
    family: 'DM Serif Display',
    sampleClass: 'ds-display',
    description: 'Hero, manchetes e chamadas de impacto.',
    size: '48px a 88px responsivo',
    text: 'Precisão editorial para aluguel premium',
  },
  {
    token: 'h1',
    family: 'DM Serif Display',
    sampleClass: 'ds-h1',
    description: 'Título principal de página.',
    size: '40px a 60px responsivo',
    text: 'Arquitetura visual do sistema',
  },
  {
    token: 'h2',
    family: 'DM Sans',
    sampleClass: 'ds-h2',
    description: 'Seções e blocos principais.',
    size: '28px a 36px',
    text: 'Tonalidade, ritmo e clareza operacional',
  },
  {
    token: 'h3',
    family: 'DM Sans',
    sampleClass: 'ds-h3',
    description: 'Títulos de cards e painéis.',
    size: '22px',
    text: 'Estados de interface',
  },
  {
    token: 'h4',
    family: 'DM Sans',
    sampleClass: 'ds-h4',
    description: 'Subtítulos e grupos de formulário.',
    size: '18px',
    text: 'Hierarquia de apoio',
  },
  {
    token: 'body-lg',
    family: 'DM Sans',
    sampleClass: 'ds-body-lg',
    description: 'Parágrafos de abertura e conteúdo descritivo.',
    size: '16px',
    text: 'Use este estilo quando a leitura precisar de mais respiro, como explicações de fluxo e contexto operacional.',
  },
  {
    token: 'body',
    family: 'DM Sans',
    sampleClass: 'ds-body',
    description: 'Corpo padrão, tabelas e textos de interface.',
    size: '14px',
    text: 'Texto padrão do produto com legibilidade neutra e alta compatibilidade com telas densas.',
  },
  {
    token: 'caption',
    family: 'DM Sans',
    sampleClass: 'ds-caption',
    description: 'Metadados, horários e notas rápidas.',
    size: '12px',
    text: 'Atualizado há 3 minutos',
  },
  {
    token: 'label',
    family: 'DM Sans',
    sampleClass: 'ds-label',
    description: 'Etiquetas, tags e cabeçalhos compactos.',
    size: '12px',
    text: 'status operacional',
  },
]

const spacing = ['4px', '8px', '12px', '16px', '24px', '32px', '48px', '64px']
const radii = ['4px', '8px', '12px', '16px', '999px']

function ColorChip({ value }: { value: string }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="h-10 w-10 rounded-md border border-border"
        style={{ backgroundColor: value.startsWith('rgba') ? '#00000000' : value, backgroundImage: value.startsWith('rgba') ? `linear-gradient(135deg, ${value}, transparent)` : undefined }}
        aria-hidden="true"
      />
      <span className="text-sm font-medium text-text-primary">{value}</span>
    </div>
  )
}

export default function DesignPage() {
  return (
    <main className="flex-1 py-8 sm:py-10 lg:py-14">
      <div className="ds-shell space-y-8 lg:space-y-12">
        <section className="ds-panel px-6 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl space-y-5">
              <p className="ds-kicker">Documentação do design system</p>
              <h1 className="ds-display text-text-primary">CarFlow</h1>
              <p className="ds-body-lg max-w-2xl">
                Esta página centraliza as decisões visuais do client do sistema de aluguel de carros.
                Ela foi pensada para consulta rápida durante implementação de telas, componentes e estados.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-end">
              <AnimatedThemeToggler />
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-md border border-border bg-surface px-4 py-3 text-sm font-medium text-text-primary transition hover:bg-primary-soft"
              >
                Voltar ao painel
              </Link>
            </div>
          </div>
        </section>

        <section className="space-y-5">
          <div>
            <p className="ds-kicker">Paleta base</p>
            <h2 className="ds-h2 mt-2 text-text-primary">Escala cromática</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {colorScale.map((color) => (
              <article key={color.token} className="ds-card p-4">
                <div
                  className="h-24 rounded-md border border-border"
                  style={{ backgroundColor: color.value }}
                  aria-hidden="true"
                />
                <p className="mt-4 text-sm font-semibold text-text-primary">{color.token}</p>
                <p className="mt-1 ds-caption">{color.value}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <div>
            <p className="ds-kicker">Tokens semânticos</p>
            <h2 className="ds-h2 mt-2 text-text-primary">Light e dark lado a lado</h2>
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-surface">
            <div className="grid gap-px bg-border md:grid-cols-[1.2fr_1.5fr_1fr_1fr]">
              <div className="bg-surface px-5 py-4 text-sm font-semibold text-text-primary">Token</div>
              <div className="bg-surface px-5 py-4 text-sm font-semibold text-text-primary">Uso</div>
              <div className="bg-surface px-5 py-4 text-sm font-semibold text-text-primary">Light</div>
              <div className="bg-surface px-5 py-4 text-sm font-semibold text-text-primary">Dark</div>
              {semanticTokens.map((item) => (
                <div key={item.token} className="contents">
                  <div className="bg-surface px-5 py-4 text-sm font-semibold text-text-primary">
                    {item.token}
                  </div>
                  <div className="bg-surface px-5 py-4 ds-body">
                    {item.descricao}
                  </div>
                  <div className="bg-surface px-5 py-4">
                    <ColorChip value={item.light} />
                  </div>
                  <div className="bg-surface px-5 py-4">
                    <ColorChip value={item.dark} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-5">
          <div>
            <p className="ds-kicker">Tipografia</p>
            <h2 className="ds-h2 mt-2 text-text-primary">Fontes e tamanhos disponíveis</h2>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <article className="ds-card p-6">
              <p className="ds-label text-text-brand">Famílias</p>
              <div className="mt-5 space-y-5">
                <div>
                  <p className="ds-h3 text-text-primary">DM Serif Display</p>
                  <p className="mt-2 ds-body">Usada para títulos, manchetes, números de destaque e trechos de alto impacto.</p>
                </div>
                <div>
                  <p className="ds-h3 text-text-primary">DM Sans</p>
                  <p className="mt-2 ds-body">Base de leitura do sistema: navegação, formulários, cards, tabelas e textos de apoio.</p>
                </div>
              </div>
            </article>

            <article className="ds-card p-6">
              <p className="ds-label text-text-brand">Regras</p>
              <ul className="mt-5 space-y-3 ds-body">
                <li>Use DM Serif Display apenas em pontos de alto contraste visual.</li>
                <li>Use DM Sans para todo conteúdo funcional e leitura contínua.</li>
                <li>Evite misturar mais de dois níveis tipográficos fortes na mesma seção.</li>
                <li>Prefira variações de tamanho e peso antes de introduzir novas famílias.</li>
              </ul>
            </article>
          </div>

          <div className="grid gap-5">
            {typography.map((item) => (
              <article key={item.token} className="ds-card p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="ds-label text-text-brand">{item.token}</p>
                    <p className="mt-2 text-sm font-medium text-text-primary">{item.family}</p>
                    <p className="mt-1 ds-caption">{item.size}</p>
                  </div>
                  <p className="max-w-xl ds-body">{item.description}</p>
                </div>
                <div className="mt-6 rounded-lg bg-surface-2 px-5 py-6">
                  <p className={`${item.sampleClass} text-text-primary`}>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <article className="ds-card p-6">
            <p className="ds-kicker">Spacing</p>
            <h2 className="ds-h3 mt-3 text-text-primary">Escala de espaçamento</h2>
            <div className="mt-6 space-y-4">
              {spacing.map((item) => (
                <div key={item} className="flex items-center gap-4">
                  <span className="w-14 text-sm font-medium text-text-primary">{item}</span>
                  <span className="h-4 rounded-full bg-primary" style={{ width: item }} aria-hidden="true" />
                </div>
              ))}
            </div>
          </article>

          <article className="ds-card p-6">
            <p className="ds-kicker">Radii</p>
            <h2 className="ds-h3 mt-3 text-text-primary">Arredondamentos padrão</h2>
            <div className="mt-6 flex flex-wrap gap-4">
              {radii.map((item) => (
                <div key={item} className="flex flex-col items-center gap-3">
                  <span
                    className="h-16 w-24 border border-border bg-surface-2"
                    style={{ borderRadius: item }}
                    aria-hidden="true"
                  />
                  <span className="ds-caption">{item}</span>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="space-y-5">
          <div>
            <p className="ds-kicker">Logos</p>
            <h2 className="ds-h2 mt-2 text-text-primary">Versões da marca (Light / Dark)</h2>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            <article className="ds-card p-6">
              <p className="ds-label text-text-brand">Horizontal (principal)</p>
              <div className="mt-4 flex items-center justify-center gap-6">
                <div className="text-center">
                  <img src="/images/logos/carflow_horizontal_light_fixed.png" alt="CarFlow (light)" className="max-w-full h-auto" />
                  <p className="mt-2 ds-caption">Light</p>
                </div>
                <div className="text-center">
                  <img src="/images/logos/carflow_horizontal_dark_fixed.png" alt="CarFlow (dark)" className="max-w-full h-auto" />
                  <p className="mt-2 ds-caption">Dark</p>
                </div>
              </div>
              <p className="mt-4 ds-caption">Uso: header desktop, páginas públicas e materiais de marca.</p>
            </article>

            <article className="ds-card p-6">
              <p className="ds-label text-text-brand">Empilhada</p>
              <div className="mt-4 flex items-center justify-center gap-6">
                <div className="text-center">
                  <img src="/images/logos/carflow_vertical_light_fixed.png" alt="CarFlow stacked (light)" className="max-w-full h-auto" />
                  <p className="mt-2 ds-caption">Light</p>
                </div>
                <div className="text-center">
                  <img src="/images/logos/carflow_vertical_dark_fixed.png" alt="CarFlow stacked (dark)" className="max-w-full h-auto" />
                  <p className="mt-2 ds-caption">Dark</p>
                </div>
              </div>
              <p className="mt-4 ds-caption">Uso: telas de login, mobile quando o espaço horizontal for limitado.</p>
            </article>

            <article className="ds-card p-6">
              <p className="ds-label text-text-brand">Marca (ícone)</p>
              <div className="mt-4 flex items-center justify-center gap-6">
                <div className="text-center">
                  <img src="/images/logos/carflow_icon_only_light_fixed.png" alt="CarFlow mark (light)" className="w-20 h-auto mx-auto" />
                  <p className="mt-2 ds-caption">Light</p>
                </div>
                <div className="text-center">
                  <img src="/images/logos/carflow_icon_only_dark_fixed.png" alt="CarFlow mark (dark)" className="w-20 h-auto mx-auto" />
                  <p className="mt-2 ds-caption">Dark</p>
                </div>
              </div>
              <p className="mt-4 ds-caption">Uso: favicon, botões, avatars e contextos de espaço reduzido.</p>
            </article>
          </div>

          <article className="ds-card p-6">
            <p className="ds-label text-text-brand">Regras rápidas</p>
            <ul className="mt-4 space-y-2 ds-body">
              <li>Use a variante <strong>light</strong> em fundos claros e a variante <strong>dark</strong> em fundos escuros.</li>
              <li>Mantenha a área de respiro mínima (altura da letra &quot;F&quot;).</li>
              <li>Preferir SVG para novas exportações; estes PNGs são as versões finais aprovadas pelo design team.</li>
            </ul>
          </article>
        </section>
      </div>

      <div className="fixed bottom-6 right-6 z-50">
        <div className="rounded-full border border-border bg-surface p-2 height-10 w-10 flex items-center justify-center shadow-lg">
          <AnimatedThemeToggler aria-label="Alternar tema" />
        </div>
      </div>
    </main>
  )
}