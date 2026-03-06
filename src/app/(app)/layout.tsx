'use client';

import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import {
  Home,
  Wallet,
  ClipboardList,
  LogOut,
  User as UserIcon,
  Loader2,
  FileCheck2,
  ImageIcon,
  Users,
  MessageSquare,
  HelpCircle,
  Video,
  Share2,
  Download,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ProAssignmentIcon } from '@/components/pro-assignment-icon';
import { MobileNav } from '@/components/mobile-nav';
import { logout } from '@/app/auth/actions';
import { UserNav } from '@/components/user-nav';
import { useRouter, usePathname } from 'next/navigation';
import type { Profile } from '@/lib/types';
import type { Session } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const isProfilePage = pathname === '/profile';
  const isDashboard = pathname === '/dashboard';

  useEffect(() => {
    const getSessionData = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      
      if (!currentSession) {
        router.push('/login');
        return;
      }
      
      if (currentSession.user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        router.push('/admin');
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentSession.user.id)
        .single();
      
      if (error || !profile) {
        toast({
          variant: 'destructive',
          title: 'User Profile Not Found',
          description: 'Your account data is missing. Please sign up again.',
        });
        await supabase.auth.signOut();
        router.push('/signup');
        return;
      } else {
        setUser(profile);
      }
      setLoading(false);
    };

    getSessionData();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (!session) {
            router.push('/login');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [router, supabase, supabase.auth, toast]);


  if (loading) {
    return (
        <div className="flex min-h-screen w-full items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin" />
        </div>
    )
  }
  
  if (!session || !user) {
    return null;
  }
  
  const navItems = [
    { href: '/dashboard', label: 'Home', icon: Home },
    { href: '/tasks', label: 'Tasks', icon: ClipboardList },
    { href: '/assignments', label: 'Assignments', icon: FileCheck2 },
    { href: '/withdraw', label: 'Withdrawal', icon: Wallet },
  ];

  const bottomNavItems = [
    ...navItems,
    { href: '/profile', label: 'Profile', icon: UserIcon },
  ];

  const actionItems = [
    { href: '/referrals', label: 'Referrals', icon: Users },
    { href: '/watch', label: 'Guidelines', icon: Video },
    { href: '/feedbacks', label: 'Feedbacks', icon: MessageSquare },
    { href: '/social', label: 'Social', icon: Share2 },
    { href: '/reviews', label: 'Reviews', icon: MessageSquare },
    { href: '/guide', label: 'Guide', icon: HelpCircle },
    { href: 'https://postimages.org/', label: 'Postimages', icon: ImageIcon, target: '_blank' },
    { href: 'https://web2apkpro.com/public_download.php?project_id=2547&token=e3a1121a43', label: 'Our App', icon: Download, target: '_blank' },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground md:pl-60">
      <nav className="hidden md:fixed md:left-0 md:top-0 md:z-50 md:flex md:h-screen md:w-60 md:flex-col md:border-r">
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <ProAssignmentIcon className="h-8 w-8" />
          <span className="text-sm font-bold">ProAssignment</span>
        </div>
        <div className="flex flex-1 flex-col justify-between overflow-y-auto py-4">
          <div className="flex flex-col gap-2 px-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                  pathname === item.href && 'bg-primary text-primary-foreground hover:text-primary-foreground/90'
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
                target={item.target}
                rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
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

       {!isProfilePage && (
         <header className={cn(
           "flex h-16 shrink-0 items-center justify-between px-4 md:justify-end md:px-6 transition-all border-none shadow-none",
           !isDashboard ? "sticky top-0 z-40 bg-card border-b shadow-sm" : "absolute top-0 left-0 right-0 z-50 bg-transparent"
         )}>
          <div className={cn("flex items-center gap-2 md:hidden", isDashboard && "text-white")}>
              <ProAssignmentIcon className="h-7 w-7" />
              <span className="font-bold">ProAssignment</span>
          </div>

          <div className="flex items-center gap-4">
              {!isDashboard && (
                <div className="hidden md:flex">
                    <UserNav name={user.name || ''} email={user.email || ''} avatarUrl={user.avatar_url} />
                </div>
              )}
              <MobileNav navItems={navItems} actionItems={actionItems} dashboardMode={isDashboard} />
          </div>
        </header>
       )}
      <main className={cn(
        "flex-1 pb-28 md:pb-4", 
        !isProfilePage && "p-4 lg:p-6",
        isDashboard && "pt-0 p-0 lg:p-0"
      )}>{children}</main>

      {/* Modern Floating Bottom Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-[400px] z-50 md:hidden">
        <div className="h-16 rounded-[2rem] border border-white/20 bg-background/80 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex items-center justify-around px-3">
          {bottomNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative flex flex-col items-center justify-center flex-1 h-12 transition-all duration-500 rounded-2xl',
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-primary/10 rounded-2xl animate-in zoom-in-95 duration-300" />
                )}
                <item.icon className={cn('h-5 w-5 transition-all duration-300 mb-0.5', isActive && 'scale-110')} />
                <span className={cn(
                  'text-[8px] font-black uppercase tracking-widest transition-all duration-300', 
                  isActive ? 'opacity-100 translate-y-0' : 'opacity-60'
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
