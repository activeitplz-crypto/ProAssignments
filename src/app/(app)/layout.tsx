
'use client';

import { createClient } from '@/lib/supabase/client';
import { redirect } from 'next/navigation';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Home,
  LayoutDashboard,
  Wallet,
  Users,
  Building,
  MoreHorizontal,
  Menu,
  List
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import type { User } from '@supabase/supabase-js';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { UserNav } from '@/components/user-nav';

const navItems = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/withdraw', label: 'Withdrawal', icon: Wallet },
  { href: '/referrals', label: 'Referral', icon: Users },
  { href: '/plans', label: 'Plans', icon: List },
];

function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-sm md:hidden">
      <div className="grid h-16 grid-cols-4 items-center">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center justify-center gap-1 text-muted-foreground',
              pathname === item.href && 'text-primary'
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b bg-background/95 px-4 backdrop-blur-sm md:px-6">
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
        </Button>
        <Logo />
        <UserNav name={user.user_metadata.name ?? 'User'} email={user.email ?? ''} />
      </header>
      <main className="flex-1 p-4 lg:p-6">{children}</main>
      <div className="h-16 md:hidden" />
      <BottomNav />
    </div>
  );
}
