'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApolloClient } from '@apollo/client';
import { Button } from '@/components/ui/button';
import { IconLoader2, IconLogout } from '@tabler/icons-react';
import {
  DropdownMenuItem
} from '@/components/ui/dropdown-menu'; // Assuming you use this in a dropdown
import { clearAuthSession } from '@/features/auth/actions/auth-actions';

export function LogoutButton() {
  const router = useRouter();
  const apolloClient = useApolloClient();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    console.log('Logout started');

    try {

      console.log('Resetting Apollo cache...');
      await apolloClient.resetStore();
      console.log('Apollo cache reset done');

      console.log('Calling clearAuthSession...');
      await clearAuthSession();
      console.log('clearAuthSession done');


      console.log('Pushing to /auth/login');
      router.push('/auth/login');
      console.log('router.push called');

      // Optional: add a small delay to see if it helps navigation
      // await new Promise(res => setTimeout(res, 1000));
      // console.log('Delay done');

    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoggingOut(false);
    }
  };



  return (
    <Button onClick={handleLogout} disabled={isLoggingOut} variant="outline" className="flex items-center">
      {isLoggingOut ? (
        <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <IconLogout className="mr-2 h-4 w-4" />
      )}
      <span>Log out</span>
    </Button>

  );
}