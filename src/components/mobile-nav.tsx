
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
            "md:hidden h-12 w-12 rounded-2xl transition-all duration-300 active:scale-90",
            dashboardMode 
              ? "bg-white/20 text-white hover:bg-white/30 border border-white/20 backdrop-blur-md shadow-lg" 
              : "bg-slate-900 text-white hover:bg-slate-800 shadow-xl"
          )}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col p-0 w-[85%] sm:max-w-sm border-l border-white/10 bg-slate-950 text-white overflow-hidden">
        {/* Decorative background light */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -mr-32 -mt-32" />
        
        <SheetHeader className="p-8 border-b border-white/5 relative z-10">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-3">
              <ProAssignmentIcon className="h-10 w-10 border border-white/20" />
              <div className="flex flex-col items-start">
                <span className="text-xl font-black tracking-tighter italic leading-none text-white">ProAssignment</span>
                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/40">Elite Partner Hub</span>
              </div>
            </SheetTitle>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto relative z-10 px-4 py-6 scrollbar-none">
          <div className="space-y-8">
            {/* Primary Nav Section */}
            <div className="space-y-2">
              <p className="px-4 text-[9px] font-black uppercase tracking-[0.2em] text-white/30 mb-4 flex items-center gap-2">
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
                        : 'text-white/60 hover:bg-white/5 hover:text-white'
                    )}
                  >
                    <item.icon className={cn("h-5 w-5 transition-transform duration-300 group-hover:scale-110", pathname === item.href ? "text-white" : "text-primary/60")} />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>

            {/* Actions Nav Section */}
            <div className="space-y-2">
              <p className="px-4 text-[9px] font-black uppercase tracking-[0.2em] text-white/30 mb-4">Operations Hub</p>
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
                        ? 'bg-white/10 text-white border-white/5' 
                        : 'text-white/40 hover:bg-white/5 hover:text-white'
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

        <div className="mt-auto p-6 border-t border-white/5 relative z-10 bg-slate-950/50 backdrop-blur-xl">
            <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className={cn(
                    'flex items-center gap-4 rounded-2xl px-5 py-4 mb-3 transition-all duration-300 border border-white/5',
                    pathname === '/profile' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-white/5 text-white/80'
                )}
            >
                <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                    <User className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                    <span className="text-xs font-black uppercase tracking-tight">Identity Profile</span>
                    <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Account Settings</span>
                </div>
            </Link>

            <form action={logout} className="w-full">
                <button type="submit" className="flex w-full items-center justify-center gap-3 rounded-2xl bg-red-500/10 border border-red-500/20 py-4 text-xs font-black uppercase tracking-[0.2em] text-red-500 hover:bg-red-50 hover:text-white transition-all duration-500">
                    <LogOut className="h-4 w-4" />
                    <span>Terminate Session</span>
                </button>
            </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
