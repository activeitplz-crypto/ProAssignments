
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { Logo } from '@/components/logo';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Logo />
        <nav className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Get Started <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="container mx-auto flex flex-col items-center justify-center space-y-8 px-4 py-12 text-center md:py-24 lg:py-32">
          <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Intelligent Investment, Simplified
          </h1>
          <p className="max-w-[700px] text-lg text-muted-foreground md:text-xl">
            Welcome to ProAssignment. We provide a clear path to grow your earnings through structured investment plans and a powerful referral system.
          </p>
          <Button size="lg" asChild>
            <Link href="/signup">
              Start Earning Today
              <TrendingUp className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </section>
        <section className="bg-white/50 py-12 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="font-headline mb-12 text-center text-3xl font-bold md:text-4xl">
              Why Choose ProAssignment?
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Structured Plans</CardTitle>
                  <CardDescription>
                    Choose from a variety of investment plans tailored to your financial goals. Clear terms, daily earnings, and predictable returns.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Daily Earnings</CardTitle>
                  <CardDescription>
                    Watch your investment grow every single day. Track your today's and total earnings transparently from your personal dashboard.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Powerful Referrals</CardTitle>
                  <CardDescription>
                    Maximize your income by inviting others. Our referral system rewards you for every new member who joins and invests through your link.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="container mx-auto px-4 py-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} ProAssignment. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
