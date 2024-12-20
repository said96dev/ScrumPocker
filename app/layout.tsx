import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import Providers from './providers'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Scrum Poker | Free Online Planning Poker Tool',
  description:
    'Scrum Poker Online - A free, easy-to-use tool for agile teams to estimate and plan their work efficiently. Perfect for remote teams and distributed planning sessions.',
  keywords: [
    'Scrum Poker',
    'Planning Poker',
    'Agile Estimation',
    'Scrum Tool',
    'Team Planning',
  ],
  authors: [{ name: 'Said Al Hendi' }],
  creator: 'Said Al Hendi',
  publisher: 'Said Al Hendi',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Scrum Poker | Free Online Planning Poker Tool',
    description:
      'Streamline your agile planning with our free online Scrum Poker tool. Perfect for remote teams and distributed planning sessions.',
    siteName: 'Scrum Poker Online',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Scrum Poker | Free Online Planning Poker Tool',
    description:
      'Streamline your agile planning with our free online Scrum Poker tool. Perfect for remote teams and distributed planning sessions.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang='en' suppressHydrationWarning>
        <body className={inter.className}>
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}
