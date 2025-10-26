interface TestPageProps {
  params: { testId: string };
}

export default function TestPage({ params }: TestPageProps) {
  return (
    <section className="text-center mt-16">
      <h2 className="text-2xl font-semibold mb-4">
        {params.testId.toUpperCase()} Test
      </h2>
      <p className="text-gray-600 mb-8">
        Interactive test will be implemented here soon.
      </p>
    </section>
  );
}
