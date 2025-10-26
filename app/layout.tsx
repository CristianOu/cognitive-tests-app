// app/layout.tsx
import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Cognitive Tests App",
  description: "Test your cognitive performance and track progress.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-800">
        <header className="border-b bg-white shadow-sm">
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
        </header>
        <main className="max-w-5xl mx-auto p-6">{children}</main>
      </body>
    </html>
  );
}
