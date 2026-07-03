import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  title: 'GermanLearn - Learn German A0 to B2',
  description: 'Master German from absolute beginner to B2 with personalized lessons, spaced repetition, and AI-powered tutoring.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'GermanLearn',
  },
  applicationName: 'GermanLearn',
  keywords: ['German', 'learn German', 'Deutsch lernen', 'language learning', 'A1', 'A2', 'B1', 'B2', 'CEFR'],
  authors: [{ name: 'GermanLearn' }],
  openGraph: {
    title: 'GermanLearn',
    description: 'Master German from A0 to B2',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#2563EB',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
