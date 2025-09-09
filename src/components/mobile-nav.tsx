
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, Menu, User } from 'lucide-react';
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
}

export function MobileNav({ navItems, actionItems }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const allItems = [
    ...navItems,
    ...actionItems,
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col p-0">
        <SheetHeader className="border-b p-4">
          <SheetTitle className="flex items-center gap-2">
            <ProAssignmentIcon className="h-8 w-8" />
            <span className="text-xl font-bold">ProAssignment</span>
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto">
          <nav className="flex flex-col gap-1 p-4">
            {allItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                target={item.target}
                rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                  pathname === item.href && 'bg-primary text-primary-foreground hover:text-primary/90'
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
             <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                    pathname === '/profile' && 'bg-primary text-primary-foreground hover:text-primary/90'
                )}
                >
                <User className="h-5 w-5" />
                <span>Edit Profile</span>
            </Link>
          </nav>
        </div>
        <div className="mt-auto border-t p-4">
            <form action={logout} className="w-full">
                <button type="submit" className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                    <LogOut className="h-5 w-5" />
                    <span>Log out</span>
                </button>
            </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
