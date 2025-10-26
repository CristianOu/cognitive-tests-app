// app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <section className="text-center mt-16">
      <h1 className="text-3xl font-bold mb-4">Welcome to CogniTest</h1>
      <p className="text-gray-600 mb-8">
        Try different cognitive tests and track your cognitive performance over time.
      </p>

      <div className="space-x-4">
        <Link
          href="/cognitive-tests/memory"
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Try Memory Test
        </Link>
        <Link
          href="/cognitive-tests/attention"
          className="bg-green-600 text-white px-4 py-2 rounded-md"
        >
          Try Attention Test
        </Link>
      </div>
    </section>
  );
}
