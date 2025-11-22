// app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-amber-900 via-amber-700 to-amber-600 text-white px-12 py-24 text-center shadow-xl">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">
            Measure Your Cognitive Performance
          </h1>
          <p className="text-lg mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">
            CogniTest offers a suite of scientifically-backed cognitive tests to help you understand and improve your mental abilities. Track your progress and gain insights into your cognitive health.
          </p>
          <Link
            href="/cognitive-tests/reaction-test"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors shadow-lg"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Why Choose CogniTest Section */}
      <section className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-4 text-gray-900">
          Why Choose CogniTest?
        </h2>
        <p className="text-gray-600 mb-12 max-w-3xl">
          Our tests are designed by experts to provide accurate and reliable results. With CogniTest, you can:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white border border-gray-200 rounded-lg p-8 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 mb-4 flex items-center justify-center">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">
              Assess Your Cognitive Skills
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Evaluate your memory, attention, and problem-solving abilities with our comprehensive tests.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-gray-200 rounded-lg p-8 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 mb-4 flex items-center justify-center">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">
              Track Your Progress Over Time
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Monitor your cognitive performance and identify areas for improvement.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-gray-200 rounded-lg p-8 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 mb-4 flex items-center justify-center">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">
              Gain Valuable Insights
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Receive personalized feedback and recommendations to enhance your cognitive health.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
