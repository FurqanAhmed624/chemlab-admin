'use client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { UserAvatarProfile } from '@/components/user-avatar-profile';
import { useRouter } from 'next/navigation';
import { IconLogout } from '@tabler/icons-react';
import * as React from 'react';

// This mock user object will be used directly by the component
const mockUser = {
  firstName: 'Guest',
  lastName: 'User',
  imageUrl: `https://avatar.vercel.sh/guest-user.png`,
  primaryEmailAddress: {
    emailAddress: 'guest@example.com'
  }
};

export function UserNav() {
  const router = useRouter();

  // No need for an 'if' check, since mockUser is always available.
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          {/* Pass the mockUser object to the avatar component */}
          {/*<UserAvatarProfile user={mockUser} />*/}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='w-56'
        align='end'
        sideOffset={10}
        forceMount
      >
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm leading-none font-medium'>
              {/* Correctly combine firstName and lastName */}
              {`${mockUser.firstName} ${mockUser.lastName}`}
            </p>
            <p className='text-muted-foreground text-xs leading-none'>
              {/* Correctly access the email address */}
              {mockUser.primaryEmailAddress.emailAddress}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>New Team</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => alert('Sign out clicked!')}>
          <IconLogout className='mr-2 h-4 w-4' />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}