'use client';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail
} from '@/components/ui/sidebar';
// import { UserAvatarProfile } from '@/components/user-avatar-profile';
// import { navItems } from '@/constants/data';
import { useMediaQuery } from '@/hooks/use-media-query';
// REMOVED: import { useUser } from '@clerk/nextjs';
import { IconChevronRight, IconPhotoUp } from '@tabler/icons-react';
// REMOVED: import { SignOutButton } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';
import { Icons } from '../icons';
import { OrgSwitcher } from '../org-switcher';
import { useQuery } from '@apollo/client';
import {
  PENDING_REPORTS_COUNT_QUERY,
  PendingReportsCountData
} from '@/features/reports/graphql/queries';
import { navItems as staticNavItems } from '@/constants/data';
import { useState } from 'react';

export const company = {
  name: 'Acme Inc',
  logo: IconPhotoUp,
  plan: 'Enterprise'
};

const tenants = [
  { id: '1', name: 'Acme Inc' },
  { id: '2', name: 'Beta Corp' },
  { id: '3', name: 'Gamma Ltd' }
];

// const mockUser = {
//   firstName: 'Guest',
//   lastName: 'User',
//   imageUrl: `https://avatar.vercel.sh/guest-user.png`, // Using a dynamic placeholder avatar
//   primaryEmailAddress: {
//     emailAddress: 'guest@example.com'
//   }
// };

export default function AppSidebar() {
  const pathname = usePathname();
  const { isOpen } = useMediaQuery();
  // REMOVED: const { user } = useUser();

  const [navItems, setNavItems] = useState(staticNavItems);

  const { data: countData } = useQuery<PendingReportsCountData>(
    PENDING_REPORTS_COUNT_QUERY,
    {
      // Optional: Refetch on window focus or set a polling interval if you want it to be near real-time
      // pollInterval: 30000, // e.g., refetch every 30 seconds
    }
  );

  // --- NEW: useEffect to update the nav items when the count data arrives ---
  React.useEffect(() => {
    if (countData && countData.pendingChemicalReportsCount !== undefined) {
      const count = countData.pendingChemicalReportsCount;

      // Create a new array with the updated badge count
      const updatedNavItems = staticNavItems.map((item) => {
        if (item.title === 'Chemical Reports') {
          return { ...item, badgeCount: count };
        }
        return item;
      });

      setNavItems(updatedNavItems);
    }
  }, [countData]);

  const handleSwitchTenant = (_tenantId: string) => {
    // Tenant switching functionality would be implemented here
  };

  const activeTenant = tenants[0];

  React.useEffect(() => {
    // Side effects based on sidebar state changes
  }, [isOpen]);

  return (
    <Sidebar collapsible='icon'>
      <SidebarHeader>
        <OrgSwitcher
          tenants={tenants}
          defaultTenant={activeTenant}
          onTenantSwitch={handleSwitchTenant}
        />
      </SidebarHeader>
      <SidebarContent className='overflow-x-hidden'>
        <SidebarGroup>
          <SidebarGroupLabel>Overview</SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => {
              const Icon = item.icon ? Icons[item.icon] : Icons.logo;
              return item?.items && item?.items?.length > 0 ? (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={item.isActive}
                  className='group/collapsible'
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        isActive={pathname === item.url}
                      >
                        {item.icon && <Icon />}
                        <span>{item.title}</span>
                        <IconChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={pathname === subItem.url}
                            >
                              <Link href={subItem.url}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={pathname === item.url}
                  >
                    <Link href={item.url}>
                      <Icon />
                      <span>{item.title}</span>
                      {item.badgeCount && item.badgeCount > 0 && (
                        <span className='ml-auto inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white'>
                          {item.badgeCount}
                        </span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}