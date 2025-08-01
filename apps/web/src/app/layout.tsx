import './globals.css' // This line is the most important for styling.
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/context/AuthContext'
import { Header } from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Lookalike Finder',
  description: 'Find your celebrity lookalike!',
}

const Footer = () => (
  <footer className="bg-primary p-6 text-center text-text mt-auto">
    <p>Lookalike Finder © 2024</p>
  </footer>
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="light bg-background">
      <body className={`${inter.className} text-text`}>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
