import type { Metadata } from 'next'
import { DM_Sans, DM_Serif_Display, Geist } from 'next/font/google'
import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { AuthProvider } from '@/components/providers/auth-provider'
import './globals.css'
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans', preload: false })

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  preload: false,
})

const dmSerifDisplay = DM_Serif_Display({
  variable: '--font-dm-serif',
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  preload: false,
})

export const metadata: Metadata = {
  title: 'Sistema de Aluguel de Carros',
  description: 'Client Next.js com design system editorial automotivo e suporte a light e dark mode.',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={cn("h-full", "scroll-smooth", dmSans.variable, dmSerifDisplay.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <Toaster position="top-right" richColors />
            <div className="flex min-h-screen flex-col">
              <Header />
              <div className="flex-1">{children}</div>
              <Footer />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
