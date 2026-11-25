import type { Metadata, Viewport } from 'next'
import { Manrope, Onest } from 'next/font/google'
import './globals.css'
import './pitfly-design.css'
import './old-metal.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'PITFLY — Физическая подготовка собак',
  description: 'Индивидуальные тренировки для собак. Услуги, расписание и онлайн-запись PITFLY.',
  icons: { apple: { url: '/icons/pitfly-180.png', sizes: '180x180', type: 'image/png' } },
  appleWebApp: { capable: true, title: 'PITFLY' },
}
export const viewport: Viewport = {themeColor: '#0e0e0e'}

const onest = Onest({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-onest',
  display: 'swap',
})
const manrope = Manrope({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-manrope',
  display: 'swap',
})

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="ru">
      <body className={`${onest.variable} ${manrope.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
