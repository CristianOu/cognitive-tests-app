
import Link from "next/link";

export default function Header() {
  return (
<div className="border-b shadow-sm">
          <nav className="max-w-5xl mx-auto flex justify-between items-center p-4">
            <Link href="/" className="text-xl font-semibold text-blue-600">
              🧠 CogniTest
            </Link>
            <div className="space-x-4 text-blue-600">
              <Link href="/login">Login</Link>
              <Link href="/register">Register</Link>
              <Link href="/dashboard">Dashboard</Link>
            </div>
          </nav>
        </div>
  )
}