import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from 'next-themes'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AutomationDFY - Unlock New Channels With AI Marketing Solutions',
  description: 'Boost your growth while you sleep. Our AI-powered platform helps founders and marketing managers automate campaigns across channels.',
  icons: {
    icon: 'https://yrasqdvnkyxnhjxftjak.supabase.co/storage/v1/object/public/automationdfy-assets//favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-lightBg text-gray-900 flex flex-col min-h-screen`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
} 