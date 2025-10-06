import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from 'next-themes'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import Script from 'next/script'

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
      <body className={`${inter.className} bg-background text-foreground flex flex-col min-h-screen`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SpeedInsights/>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
          <Analytics/>
          <Script id="voiceflow-chat-widget" strategy="afterInteractive">{`
  (function(d, t) {
      var v = d.createElement(t), s = d.getElementsByTagName(t)[0];
      v.onload = function() {
        var detectedLocale = typeof window !== 'undefined' ? navigator.language || navigator.languages[0] || 'en-US' : 'en-US';
        console.log('Detected Voiceflow locale:', detectedLocale);
        window.voiceflow.chat.load({
          verify: { projectID: '68c671ed563ae0917ad696cc' },
          url: 'https://general-runtime.voiceflow.com',
          versionID: 'staging',
          assistantID: 'localStorage',
          voice: {
            url: "https://runtime-api.voiceflow.com"
          },
          launch: {
            event: {
              'type': 'launch',
              'payload': {
                'locale': detectedLocale,
                'companyName': 'AutomationDFY'
              }
            }
          }
        }).then(() => {
      window.voiceflow.chat.proactive.push(  
        { type: 'text', payload: { message: 'Hey, we sell lots of hats!' } },  
        { type: 'text', payload: { message: 'Want recommendations?' } }  
      )
    });

      }
      v.src = "https://cdn.voiceflow.com/widget-next/bundle.mjs"; v.type = "text/javascript"; s.parentNode.insertBefore(v, s);
  })(document, 'script');
          `}</Script>
        </ThemeProvider>
      </body>
    </html>
  )
} 