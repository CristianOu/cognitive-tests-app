interface TestPageProps {
  params: { testId: string };
}

export default async function TestPage({ params }: TestPageProps) {
  const { testId } = await params;
  
  return (
    <section className="text-center mt-16">
      <h2 className="text-2xl font-semibold mb-4">
        {testId ? testId.toUpperCase() : ''} Test
      </h2>
      <p className="text-gray-600 mb-8">
        Interactive test will be implemented here soon.
      </p>
    </section>
  );
}
