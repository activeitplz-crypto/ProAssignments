
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { UserProfileCard } from '@/components/user-profile-card';
import { DollarSign, Zap, Briefcase, Wallet } from 'lucide-react';
import { MOCK_USER } from '@/lib/mock-data';

export default async function DashboardPage() {
  // In a real app, you'd fetch this data. Here we use mocks.
  const userData = {
    name: MOCK_USER.name || 'Anonymous',
    username: MOCK_USER.email?.split('@')[0] || 'anonymous',
    total_earning: MOCK_USER.total_earning,
    today_earning: MOCK_USER.today_earning,
    active_plan: MOCK_USER.current_plan || 'None',
    current_balance: MOCK_USER.current_balance,
  };

  return (
    <div className="flex flex-col gap-6">
      <UserProfileCard name={userData.name} username={userData.username} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
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
