import type { Metadata, Viewport } from 'next'
import { Manrope, Oswald } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = { title: 'PITFLY — Физическая подготовка собак', description: 'Индивидуальные тренировки для собак. Услуги, расписание и онлайн-запись PITFLY.' }
export const viewport: Viewport = {themeColor: '#0a0a0a'}

const oswald = Oswald({
  weight: ['600', '700'],
  subsets: ['cyrillic', 'latin'],
  variable: '--font-oswald',
  display: 'swap',
})
const manrope = Manrope({
  weight: ['400', '500', '600', '700'],
  subsets: ['cyrillic', 'latin'],
  variable: '--font-manrope',
  display: 'swap',
})

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="ru">
      <body className={`${oswald.variable} ${manrope.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
