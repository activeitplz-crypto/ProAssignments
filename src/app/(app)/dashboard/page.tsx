
import { createClient } from '@/lib/supabase/server';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { UserProfileCard } from '@/components/user-profile-card';
import { DollarSign, Zap, Briefcase, Wallet } from 'lucide-react';
import type { UserProfile } from '@/lib/types';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: userProfile, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single<UserProfile>();

  // If there's an error and it's not a "not found" error, log it.
  // A "not found" error is expected for new users.
  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching user profile:', error);
  }

  const userData = {
    name: userProfile?.name || user?.user_metadata?.name || 'Anonymous',
    username: user.email?.split('@')[0] || 'anonymous',
    total_earning: userProfile?.total_earning || 0,
    today_earning: userProfile?.today_earning || 0,
    active_plan: userProfile?.current_plan || 'None',
    current_balance: userProfile?.current_balance || 0,
  };

  return (
    <div className="flex flex-col gap-6">
      <UserProfileCard name={userData.name} username={userData.username} />

      <div className="grid grid-cols-1 gap-4">
        <Card className="bg-card/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-normal text-muted-foreground">
              Total Earnings
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              PKR {userData.total_earning.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-normal text-muted-foreground">
              Today's Earnings
            </CardTitle>
             <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              PKR {userData.today_earning.toFixed(2)}
            </p>
          </CardContent>
        </Card>
         <Card className="bg-card/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-normal text-muted-foreground">
              Active Plan
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {userData.active_plan}
            </p>
          </CardContent>
        </Card>
         <Card className="bg-card/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-normal text-muted-foreground">
              Current Balance
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
             PKR {userData.current_balance.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
