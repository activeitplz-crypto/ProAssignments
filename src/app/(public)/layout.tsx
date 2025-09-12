
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-background/95 px-4 backdrop-blur-sm md:px-6">
        <Logo />
        <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
                <Link href="/login">Login</Link>
            </Button>
            <Button size="sm" asChild>
                <Link href="/signup">Sign Up</Link>
            </Button>
        </div>
      </header>
      <main className="flex-1 container mx-auto p-4 lg:p-6">{children}</main>
       <footer className="container mx-auto px-4 py-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} ProAssignment. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
