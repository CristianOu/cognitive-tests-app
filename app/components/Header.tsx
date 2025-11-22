import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <nav className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-gray-900 hover:text-gray-700 transition-colors">
          <span className="text-2xl">🧠</span>
          <span>CogniTest</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-8">
          <Link href="/cognitive-tests/reaction-test" className="text-gray-700 hover:text-gray-900 transition-colors font-medium">
            Tests
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-gray-900 transition-colors font-medium">
            About
          </Link>
          <Link href="/contact" className="text-gray-700 hover:text-gray-900 transition-colors font-medium">
            Contact
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/register"
            className="bg-blue-600 text-white px-5 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            Sign Up
          </Link>
          <Link
            href="/login"
            className="bg-white text-gray-900 px-5 py-2 rounded-md font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Log In
          </Link>
        </div>
      </nav>
    </header>
  );
}