
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Home,
  Wallet,
  Users,
  ClipboardList,
  LogOut,
  User as UserIcon,
  Shield,
} from 'lucide-react';
import React from 'react';
import { cn } from '@/lib/utils';
import { JanzyIcon } from '@/components/janzy-icon';
import { MobileNav } from '@/components/mobile-nav';
import { logout } from '@/app/auth/actions';
import { UserNav } from '@/components/user-nav';
import { redirect } from 'next/navigation';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const { data: user, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (error || !user) {
    // This could happen if the profile wasn't created yet
    // or if there's a network error.
    console.error('Error fetching profile:', error);
    // You might want to handle this more gracefully
    return <div className="p-4">Error loading user profile. Please try logging out and back in.</div>
  }

  const navItems = [
    { href: '/dashboard', label: 'Home', icon: Home },
    { href: '/withdraw', label: 'Withdrawal', icon: Wallet },
    { href: '/referrals', label: 'Referral', icon: Users },
    { href: '/plans', label: 'Plans', icon: ClipboardList },
  ];

  const actionItems = [{ href: '/profile', label: 'Edit Profile', icon: UserIcon }];

  if (user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    navItems.push({ href: '/admin', label: 'Admin Panel', icon: Shield });
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground md:pl-60">
      <nav className="hidden md:fixed md:left-0 md:top-0 md:z-50 md:flex md:h-screen md:w-60 md:flex-col md:border-r">
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <JanzyIcon className="h-8 w-8" />
          <span className="text-xl font-bold">PlanBase</span>
        </div>
        <div className="flex flex-1 flex-col justify-between overflow-auto py-4">
          <div className="flex flex-col gap-2 px-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary'
                  // pathname is not available in server components easily, so active state is removed for now
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
          <div className="mt-auto flex flex-col gap-2 px-4">
             {actionItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary'
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
            <form action={logout}>
                <button type="submit" className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                    <LogOut className="h-5 w-5" />
                    <span>Log out</span>
                </button>
            </form>
          </div>
        </div>
      </nav>

       <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-background/95 px-4 backdrop-blur-sm md:justify-end md:px-6">
        <div className="flex items-center gap-2 md:hidden">
            <JanzyIcon className="h-7 w-7" />
            <span className="font-bold">PlanBase</span>
        </div>

        <div className="flex items-center gap-2">
            <UserNav name={user.name || ''} email={user.email || ''} avatarUrl={user.avatar_url} />
            <MobileNav navItems={navItems} actionItems={actionItems} />
        </div>
      </header>
      <main className="flex-1 p-4 lg:p-6">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 backdrop-blur-sm md:hidden">
        <div className="flex h-16 items-center justify-around">
          {navItems.map((item) => {
            if (item.href === '/admin' && user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
              return null;
            }
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-1 p-2 text-muted-foreground'
                )}
              >
                <item.icon className="h-6 w-6" />
                <span className="text-xs">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
