import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

const AuthButtons = () => {
  return (
    <div>
      <SignedOut>
        <SignInButton>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Sign In
          </button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
    </div>
  )
}

export default AuthButtons

