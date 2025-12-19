import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { toast } from 'react-toastify';

export default async function DashboardPage() {

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Your Statistics</h2>
      <p className="text-gray-600">
        Log in and complete tests to see your progress over time.
      </p>
    </section>
  );
}
