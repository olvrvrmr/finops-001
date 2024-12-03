import Link from 'next/link'

const Navigation = () => {
  return (
    <nav>
      <ul className="flex space-x-4">
        <li>
          <Link href="/" className="hover:text-gray-300">
            Home
          </Link>
        </li>
        <li>
          <Link href="/dashboard" className="hover:text-gray-300">
            Dashboard
          </Link>
        </li>
        <li>
          <Link href="/reports" className="hover:text-gray-300">
            Reports
          </Link>
        </li>
        <li>
          <Link href="/settings" className="hover:text-gray-300">
            Settings
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navigation

