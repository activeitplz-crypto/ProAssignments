
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, Menu, User, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ProAssignmentIcon } from '@/components/pro-assignment-icon';
import { cn } from '@/lib/utils';
import { logout } from '@/app/auth/actions';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  target?: string;
}

interface MobileNavProps {
  navItems: NavItem[];
  actionItems: NavItem[];
  dashboardMode?: boolean;
}

export function MobileNav({ navItems, actionItems, dashboardMode }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn(
            "md:hidden h-12 w-12 rounded-2xl transition-all duration-300 active:scale-90 bg-[#9bd7dd] text-slate-900 hover:bg-[#9bd7dd]/90 shadow-lg border-none"
          )}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col p-0 w-[85%] sm:max-w-sm border-l border-slate-900/5 bg-[#9bd7dd] text-slate-900 overflow-hidden">
        {/* Decorative background light - adjusted for light theme */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/40 rounded-full blur-[80px] -mr-32 -mt-32" />
        
        <SheetHeader className="p-8 border-b border-slate-900/5 relative z-10">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-3">
              <ProAssignmentIcon className="h-10 w-10 border border-slate-900/10 shadow-sm" />
              <div className="flex flex-col items-start">
                <span className="text-xl font-black tracking-tighter italic leading-none text-slate-900">ProAssignment</span>
                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-900/40">Elite Partner Hub</span>
              </div>
            </SheetTitle>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto relative z-10 px-4 py-6 scrollbar-none">
          <div className="space-y-8">
            {/* Primary Nav Section */}
            <div className="space-y-2">
              <p className="px-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-900/30 mb-4 flex items-center gap-2">
                Main Terminal <Sparkles className="h-2 w-2 text-primary" />
              </p>
              <nav className="grid gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'flex items-center gap-4 rounded-[1.25rem] px-5 py-4 text-sm font-black uppercase tracking-tight transition-all duration-300 group',
                      pathname === item.href 
                        ? 'bg-primary text-white shadow-xl shadow-primary/20' 
                        : 'text-slate-900/60 hover:bg-white/30 hover:text-slate-900'
                    )}
                  >
                    <item.icon className={cn("h-5 w-5 transition-transform duration-300 group-hover:scale-110", pathname === item.href ? "text-white" : "text-primary")} />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>

            {/* Actions Nav Section */}
            <div className="space-y-2">
              <p className="px-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-900/30 mb-4">Operations Hub</p>
              <nav className="grid gap-1">
                {actionItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    target={item.target}
                    rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'flex items-center gap-4 rounded-[1.25rem] px-5 py-3.5 text-xs font-bold uppercase tracking-widest transition-all duration-300 group border border-transparent',
                      pathname === item.href 
                        ? 'bg-slate-900 text-white shadow-md' 
                        : 'text-slate-900/40 hover:bg-white/30 hover:text-slate-900'
                    )}
                  >
                    <item.icon className="h-4 w-4 opacity-60 group-hover:opacity-100 transition-opacity" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>

        <div className="mt-auto p-6 border-t border-slate-900/5 relative z-10 bg-white/20 backdrop-blur-xl">
            <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className={cn(
                    'flex items-center gap-4 rounded-2xl px-5 py-4 mb-3 transition-all duration-300 border border-slate-900/5',
                    pathname === '/profile' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-white/40 text-slate-900/80 shadow-sm'
                )}
            >
                <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-inner">
                    <User className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                    <span className="text-xs font-black uppercase tracking-tight">Identity Profile</span>
                    <span className="text-[9px] font-bold text-slate-900/40 uppercase tracking-widest">Account Settings</span>
                </div>
            </Link>

            <form action={logout} className="w-full">
                <button type="submit" className="flex w-full items-center justify-center gap-3 rounded-2xl bg-red-500 text-white py-4 text-xs font-black uppercase tracking-[0.2em] hover:bg-red-600 transition-all duration-500 shadow-lg">
                    <LogOut className="h-4 w-4" />
                    <span>Terminate Session</span>
                </button>
            </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
