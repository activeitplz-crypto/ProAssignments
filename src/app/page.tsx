
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, TrendingUp, Award, MessageSquare, HelpCircle } from 'lucide-react';
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
           <h1 className="font-display text-5xl font-bold tracking-wider text-foreground md:text-7xl flex flex-col items-center">
            <span>Assignment</span>
            <span className="text-primary">Work</span>
          </h1>
          <p className="max-w-[700px] text-lg text-muted-foreground md:text-xl">
            Welcome to ProAssignment. We provide a clear path to grow your earnings through structured investment plans and completing daily assignments.
          </p>
          <Button size="lg" asChild>
            <Link href="/signup">
              Start Earning Today
              <TrendingUp className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </section>

        <section className="bg-muted py-12 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="font-headline mb-12 text-center text-3xl font-bold md:text-4xl">
              Explore Our Platform
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <Card className="flex flex-col text-center items-center">
                <CardHeader>
                  <Award className="h-10 w-10 text-primary mx-auto mb-4" />
                  <CardTitle>Top Users</CardTitle>
                  <CardDescription>
                    See screenshots from our top earners and get motivated by their success.
                  </CardDescription>
                </CardHeader>
                 <CardContent>
                  <Button variant="outline" asChild>
                    <Link href="/top-users">View Top Users</Link>
                  </Button>
                </CardContent>
              </Card>
              <Card className="flex flex-col text-center items-center">
                <CardHeader>
                  <MessageSquare className="h-10 w-10 text-primary mx-auto mb-4" />
                  <CardTitle>User Reviews</CardTitle>
                  <CardDescription>
                    Read testimonials from our community to see what they're saying about us.
                  </CardDescription>
                </CardHeader>
                 <CardContent>
                  <Button variant="outline" asChild>
                    <Link href="/reviews">Read Reviews</Link>
                  </Button>
                </CardContent>
              </Card>
               <Card className="flex flex-col text-center items-center">
                <CardHeader>
                    <HelpCircle className="h-10 w-10 text-primary mx-auto mb-4" />
                  <CardTitle>Full Guide</CardTitle>
                  <CardDescription>
                    Learn everything you need to know about how to use the platform effectively.
                  </CardDescription>
                </CardHeader>
                 <CardContent>
                  <Button variant="outline" asChild>
                    <Link href="/guide">Read the Guide</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="bg-background py-12 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="font-headline mb-12 text-center text-3xl font-bold md:text-4xl">
              How It Works
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Choose Your Plan</CardTitle>
                  <CardDescription>
                    Select an investment plan that fits your goals. Each plan unlocks a specific number of daily tasks and earnings potential.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Complete Daily Tasks</CardTitle>
                  <CardDescription>
                    Log in each day to view and complete your assigned tasks. The more tasks your plan includes, the more you can earn.
                  </CardDescription>
                </CardHeader>
              </Card>
               <Card>
                <CardHeader>
                  <CardTitle>Earn & Withdraw</CardTitle>
                  <CardDescription>
                    Your earnings are updated daily. Track your balance on your dashboard and withdraw your earnings directly.
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
