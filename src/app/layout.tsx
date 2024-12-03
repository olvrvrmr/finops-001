import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  OrganizationSwitcher
} from '@clerk/nextjs'
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Multi-tenant SaaS',
  description: 'A multi-tenant SaaS application with Clerk authentication',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <header className="flex justify-between items-center p-4 bg-gray-100">
            <h1 className="text-2xl font-bold">Multi-tenant SaaS</h1>
            <nav className="flex items-center space-x-4">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <OrganizationSwitcher 
                  hidePersonal
                  afterCreateOrganizationUrl="/dashboard"
                  afterLeaveOrganizationUrl="/select-org"
                  afterSelectOrganizationUrl="/dashboard"
                  appearance={{
                    elements: {
                      rootBox: "flex items-center",
                      organizationSwitcherTrigger: "bg-white border border-gray-300 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    }
                  }}
                />
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </nav>
          </header>
          <main className="p-4">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  )
}

