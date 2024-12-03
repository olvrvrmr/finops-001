import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import AuthButtons from '@/components/AuthButtons'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Timesheet Application',
  description: 'Manage your timesheets effectively',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} min-h-screen flex flex-col`}>
          <Toaster position="top-right" />
          <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
            <Navigation />
            <AuthButtons />
          </header>
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <footer className="bg-gray-800 text-white p-4 text-center">
            © 2024 IGNYTE
          </footer>
        </body>
      </html>
    </ClerkProvider>
  )
}

