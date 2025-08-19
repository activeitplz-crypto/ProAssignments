import { createClient } from '@/lib/supabase/server';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowUpRight,
  DollarSign,
  Users,
  Building,
  Clipboard,
} from 'lucide-react';
import Link from 'next/link';

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Mock data for demonstration. Replace with actual Supabase query.
  const userData = {
    total_earning: 1250.75,
    today_earning: 55.20,
    current_plan: 'Standard Plan',
    referral_count: 12,
    referral_bonus: 300.00,
  };

  const userId = user?.id;
  const referralLink = userId
    ? `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002'}/signup?ref=${userId}`
    : 'Loading...';
  
  // In a real app, you would fetch this data from your 'users' table
  // const { data: userData, error } = await supabase
  //   .from('users')
  //   .select('*')
  //   .eq('id', user!.id)
  //   .single();
  // if (error) console.error("Error fetching user data", error);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-2xl font-bold md:text-3xl">
          Dashboard
        </h1>
        <Button asChild>
          <Link href="/plans">Buy Plan</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earning</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${userData.total_earning.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Earning</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              +${userData.today_earning.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Plan</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userData.current_plan}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{userData.referral_count}</div>
            <p className="text-xs text-muted-foreground">
              +${userData.referral_bonus.toFixed(2)} bonus earned
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Your Referral Link</CardTitle>
          <CardDescription>
            Share this link to invite others and earn bonuses.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <input
            readOnly
            value={referralLink}
            className="flex-1 rounded-md border bg-muted px-3 py-2 text-sm"
          />
          <Button
            variant="outline"
            onClick={async () => {
              await navigator.clipboard.writeText(referralLink);
              // Consider adding a toast notification here for feedback
            }}
          >
            <Clipboard className="mr-2 h-4 w-4" /> Copy
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
