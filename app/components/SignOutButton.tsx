// app/components/SignOutButton.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';

export default function SignOutButton() {
  const router = useRouter();
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOut = async () => {
    setIsLoggingOut(true);

    const result = await logout();

    if (!result.success) {
      toast.error(result.error || 'Logout failed');
      setIsLoggingOut(false);
      return;
    }

    // Redirect to home page
    router.push('/');
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={isLoggingOut}
      className="bg-red-600 text-white px-5 py-2 rounded-md font-medium hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoggingOut ? 'Logging out...' : 'Log Out'}
    </button>
  );
}