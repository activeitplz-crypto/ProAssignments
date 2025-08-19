
import { createClient } from '@/lib/supabase/server';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Users, DollarSign } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { UserProfile } from '@/lib/types';
import { ReferralLinkCard } from '@/components/referral-link-card';

export default async function ReferralsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const userId = user?.id;
  const referralLink = userId
    ? `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002'}/signup?ref=${userId}`
    : 'Loading...';

  // Fetch real data
  const { data: userProfile, error: profileError } = await supabase
    .from('users')
    .select('referral_count, referral_bonus')
    .eq('id', userId)
    .single<Pick<UserProfile, 'referral_count' | 'referral_bonus'>>();

  const referralStats = {
    count: userProfile?.referral_count || 0,
    bonus: userProfile?.referral_bonus || 0,
  };
  
  // Mock recent referrals for now as referral tracking logic is complex
  // In a real app, you would have a 'referrals' table to query from.
  const recentReferrals: { name: string; plan: string; bonus: number; date: string }[] = [
    // { name: 'Jane Doe', plan: 'Standard', bonus: 15.00, date: '2023-10-26' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Referrals</h1>
        <p className="text-muted-foreground">
          Invite friends and earn rewards when they invest.
        </p>
      </div>

      <ReferralLinkCard referralLink={referralLink} />
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Successful Referrals</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{referralStats.count}</div>
            <p className="text-xs text-muted-foreground">
              Total friends who joined and invested.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Referral Bonus</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">PKR {referralStats.bonus.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Total earnings from your referrals.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Recent Referrals</CardTitle>
           <CardDescription>This section is a placeholder for now.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Plan Purchased</TableHead>
                <TableHead>Bonus Earned</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentReferrals.length > 0 ? recentReferrals.map((ref, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{ref.name}</TableCell>
                  <TableCell>{ref.plan}</TableCell>
                  <TableCell>PKR {ref.bonus.toFixed(2)}</TableCell>
                  <TableCell>{ref.date}</TableCell>
                </TableRow>
              )) : (
                <TableRow>
                    <TableCell colSpan={4} className="text-center">No recent referrals yet.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
