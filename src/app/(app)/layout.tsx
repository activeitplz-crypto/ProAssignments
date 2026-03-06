
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
  Zap,
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
        <div className="flex min-h-screen w-full items-center justify-center bg-[#F8FAFC]">
            <div className="flex flex-col items-center gap-4">
                <ProAssignmentIcon className="h-16 w-16 animate-pulse" />
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
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

  const actionItems = [
    { href: '/plans', label: 'Invest Plans', icon: Zap },
    { href: '/referrals', label: 'My Network', icon: Users },
    { href: '/guide', label: 'Master Guide', icon: HelpCircle },
    { href: '/watch', label: 'Tutorials', icon: Video },
    { href: '/feedbacks', label: 'Feedbacks', icon: MessageSquare },
    { href: '/social', label: 'Social Hub', icon: Share2 },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#F8FAFC] text-foreground md:pl-64">
      {/* 1. Desktop Sidebar (Hidden on Mobile) */}
      <nav className="hidden md:fixed md:left-0 md:top-0 md:z-50 md:flex md:h-screen md:w-64 md:flex-col md:border-r md:bg-white md:shadow-2xl md:shadow-slate-200/50">
        <div className="flex h-20 items-center gap-3 border-b px-8">
          <ProAssignmentIcon className="h-9 w-9" />
          <div className="flex flex-col">
            <span className="text-sm font-black uppercase tracking-tighter leading-none italic">PRO<span className="text-primary">ASSIGNMENT</span></span>
            <span className="text-[7px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-50">Identity Portal</span>
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-between overflow-y-auto py-8">
          <div className="flex flex-col gap-1.5 px-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-4 rounded-2xl px-4 py-3.5 text-xs font-black uppercase tracking-tight transition-all duration-300 group',
                  pathname === item.href 
                    ? 'bg-primary text-white shadow-xl shadow-primary/20' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-primary'
                )}
              >
                <item.icon className={cn("h-5 w-5 transition-transform duration-300 group-hover:scale-110", pathname === item.href ? "text-white" : "text-slate-400")} />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
          
          <div className="px-4 mt-8">
             <div className="h-px bg-slate-100 w-full mb-8" />
             <div className="flex flex-col gap-1.5">
                {actionItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                    'flex items-center gap-4 rounded-2xl px-4 py-3 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 border border-transparent',
                    pathname === item.href 
                        ? 'bg-slate-900 text-white shadow-lg' 
                        : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'
                    )}
                >
                    <item.icon className="h-4 w-4 opacity-60" />
                    <span>{item.label}</span>
                </Link>
                ))}
             </div>
          </div>

          <div className="mt-auto px-4 pt-8">
            <form action={logout}>
                <button type="submit" className="flex w-full items-center gap-4 rounded-2xl px-4 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all duration-500 group">
                    <div className="h-8 w-8 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-red-500/10">
                        <LogOut className="h-4 w-4" />
                    </div>
                    <span>Terminate Session</span>
                </button>
            </form>
          </div>
        </div>
      </nav>

       {/* 2. Global Mobile/Desktop Adaptive Header */}
       {!isProfilePage && (
         <header className={cn(
           "flex h-20 shrink-0 items-center justify-between px-6 md:justify-end transition-all border-none z-50",
           !isDashboard ? "sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm" : "absolute top-0 left-0 right-0 bg-transparent"
         )}>
          <div className={cn("flex items-center gap-2 md:hidden", isDashboard ? "text-white" : "text-slate-900")}>
              <ProAssignmentIcon className="h-8 w-8" />
              <div className="flex flex-col">
                <span className={cn("text-xs font-black uppercase tracking-tighter leading-none italic", isDashboard ? "text-white" : "text-slate-900")}>
                  PROASSIGNMENT
                </span>
                <span className={cn("text-[6px] font-black uppercase tracking-[0.3em] opacity-50", isDashboard ? "text-white/60" : "text-slate-500")}>
                  Mobile Station
                </span>
              </div>
          </div>

          <div className="flex items-center gap-4">
              <div className="hidden md:flex">
                  <UserNav name={user.name || ''} email={user.email || ''} avatarUrl={user.avatar_url} />
              </div>
              <MobileNav navItems={navItems} actionItems={actionItems} dashboardMode={isDashboard} />
          </div>
        </header>
       )}

      <main className={cn(
        "flex-1 pb-12", 
        !isProfilePage && "p-4 md:p-8 lg:p-10",
        isDashboard && "pt-0 p-0 md:p-0 lg:p-0"
      )}>{children}</main>
    </div>
  );
}
