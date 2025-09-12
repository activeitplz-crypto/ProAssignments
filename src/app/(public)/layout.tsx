
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Logo } from '@/components/logo';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="container mx-auto flex h-16 items-center justify-between border-b px-4 md:px-6">
        <Logo />
        <nav className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign Up <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1 bg-muted/20">
        {children}
      </main>
      <footer className="container mx-auto bg-background px-4 py-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} ProAssignment. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
