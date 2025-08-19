import { createClient } from '@/lib/supabase/server';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { UserProfileCard } from '@/components/user-profile-card';

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
    assignment: 30,
  };

  return (
    <div className="flex flex-col gap-6">
      <UserProfileCard name={userData.name} username={userData.username} />

      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-card/80">
          <CardHeader>
            <CardTitle className="text-sm font-normal text-muted-foreground">
              Total Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              ${userData.total_earning.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card/80">
          <CardHeader>
            <CardTitle className="text-sm font-normal text-muted-foreground">
              Today's Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              ${userData.today_earning.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/80">
        <CardHeader>
          <CardTitle className="text-sm font-normal text-muted-foreground">
            Assignment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{userData.assignment}</p>
        </CardContent>
      </Card>
    </div>
  );
}
