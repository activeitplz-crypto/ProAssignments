
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Home,
  Wallet,
  Users,
  ClipboardList,
  MoreVertical,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { JanzyIcon } from '@/components/janzy-icon';
import { MobileNav } from '@/components/mobile-nav';
import { logout } from '@/app/auth/actions';
import { MOCK_USER } from '@/lib/mock-data';

const navItems = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/withdraw', label: 'Withdrawal', icon: Wallet },
  { href: '/referrals', label: 'Referral', icon: Users },
  { href: '/plans', label: 'Plans', icon: ClipboardList },
];

const actionItems = [
    { href: '/profile', label: 'Edit Profile', icon: UserIcon },
];

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground md:pl-60">
      {/* Static sidebar for larger screens */}
      <nav className="hidden md:fixed md:left-0 md:top-0 md:z-50 md:flex md:h-screen md:w-60 md:flex-col md:border-r">
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <JanzyIcon className="h-8 w-8" />
          <span className="text-xl font-bold">Janzy</span>
        </div>
        <div className="flex flex-1 flex-col justify-between overflow-auto py-4">
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
          <div className="mt-auto flex flex-col gap-2 px-4">
             {actionItems.map((item) => (
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
            <span className="font-bold">Janzy</span>
        </div>

        <div className="flex items-center gap-2">
            <MobileNav navItems={navItems} actionItems={actionItems} />
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
