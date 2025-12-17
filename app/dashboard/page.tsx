import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { toast } from 'react-toastify';

export default async function DashboardPage() {
  const cookieStore = await cookies();  // Await the cookies
  const token = cookieStore.get('auth_token')?.value;

  if (!token) return null;

  let payload: any;

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    redirect('/login');
  }

  // const user = await getUserById(userId);

  const userId = payload.userId;
  console.log('user ID', userId);
  

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Your Statistics</h2>
      <p className="text-gray-600">
        Log in and complete tests to see your progress over time.
      </p>
    </section>
  );
}
