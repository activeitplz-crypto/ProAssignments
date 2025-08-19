import { createClient } from '@/lib/supabase/server';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { UserProfileCard } from '@/components/user-profile-card';
import { DollarSign, Zap, Briefcase, Wallet } from 'lucide-react';

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Mock data for demonstration. Replace with actual Supabase query.
  const userData = {
    name: user?.user_metadata.name || 'Sophia Carter',
    username: user?.email?.split('@')[0] || 'sophia.carter',
    total_earning: 7890.12,
    today_earning: 157.89,
    active_plan: 'Premium',
    current_balance: 1234.56,
  };

  return (
    <div className="flex flex-col gap-6">
      <UserProfileCard name={userData.name} username={userData.username} />

      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-card/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-normal text-muted-foreground">
              Total Earnings
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              ${userData.total_earning.toFixed(2)}
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
              ${userData.today_earning.toFixed(2)}
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
              ${userData.current_balance.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
