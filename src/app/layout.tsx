import './globals.css'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { validateEnv } from '@/lib/env'

const inter = Inter({ subsets: ['latin'] })

validateEnv();

export const metadata = {
  title: 'FinOps App',
  description: 'Manage your financial operations efficiently',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  )
}

