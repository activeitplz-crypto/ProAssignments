
'use client';

import { createClient } from '@/lib/supabase/client';
import { redirect, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Home,
  Wallet,
  Users,
  ClipboardList,
  MoreVertical,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import type { User } from '@supabase/supabase-js';
import { cn } from '@/lib/utils';
import { UserNav } from '@/components/user-nav';
import { JanzyIcon } from '@/components/janzy-icon';
import { MobileNav } from '@/components/mobile-nav';

const navItems = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/withdraw', label: 'Withdrawal', icon: Wallet },
  { href: '/referrals', label: 'Referral', icon: Users },
  { href: '/plans', label: 'Plans', icon: ClipboardList },
];

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        redirect('/login');
        return;
      }
      setUser(user);
      setLoading(false);
    };

    fetchUser();
  }, []);

  if (loading) {
    // You can return a loading spinner here
    return <div>Loading...</div>;
  }

  if (!user) {
    // This should theoretically not be reached due to the redirect inside useEffect,
    // but it's good practice for robustness.
    return null;
  }

  return (
    <div className="flex min-h-screen w-full flex-col md:pl-60">
      {/* Static sidebar for larger screens */}
      <nav className="hidden md:fixed md:left-0 md:top-0 md:z-50 md:flex md:h-screen md:w-60 md:flex-col md:border-r">
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <JanzyIcon className="h-8 w-8" />
          <span className="text-xl font-bold">Janzy</span>
        </div>
        <div className="flex-1 overflow-auto py-4">
          <div className="flex flex-col gap-2 px-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                  pathname === item.href && 'bg-muted text-primary'
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

       <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-background/95 px-4 backdrop-blur-sm md:justify-end md:px-6">
        <div className="flex items-center gap-2 md:hidden">
            <JanzyIcon className="h-7 w-7" />
            <span className="font-bold">Janzy</span>
        </div>

        <div className="flex items-center gap-2">
            <UserNav name={user.user_metadata.name ?? 'User'} email={user.email ?? ''} />
            <MobileNav navItems={navItems} />
        </div>
      </header>
      <main className="flex-1 p-4 lg:p-6">{children}</main>

       {/* Mobile Bottom Navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 backdrop-blur-sm md:hidden">
        <div className="flex h-16 items-center justify-around">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 p-2 text-muted-foreground',
                pathname === item.href ? 'text-primary' : 'hover:text-primary'
              )}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-xs">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
