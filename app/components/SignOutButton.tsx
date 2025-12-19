// app/components/SignOutButton.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

export default function SignOutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsLoggingOut(true);
      
      // Call the logout endpoint to delete the cookie server-side
      const response = await fetch('/api/logout', { 
        method: 'POST',
      });
      
      if (!response.ok) {
        toast.error('Logout failed');
        throw new Error('Logout failed');
      }
      
      // Redirect to home page
      router.push('/');
      router.refresh(); // Refresh to update server components
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Logout failed');
      setIsLoggingOut(false);
    }
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