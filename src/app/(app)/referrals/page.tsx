
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
import { ReferralLinkCard } from '@/components/referral-link-card';
import { redirect } from 'next/navigation';

export default async function ReferralsPage() {
  const supabase = createClient();
  const { data: { session }} = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const { data: user, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (error || !user) {
    console.error('Referrals Error:', error);
    return <div>Could not load user data.</div>;
  }
  
  // Note: Recent referrals data would need to be fetched from your database.
  // This is a placeholder as the logic for tracking who referred whom isn't fully implemented.
  const recentReferrals: { name: string; plan: string; bonus: number; date: string }[] = [];

  const referralLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002'}/signup?ref=${user.referral_code}`;

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
            <div className="text-2xl font-bold">{user.referral_count}</div>
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
            <div className="text-2xl font-bold">PKR {user.referral_bonus.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Total earnings from your referrals.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Recent Referrals</CardTitle>
           <CardDescription>Your recent successful referrals.</CardDescription>
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
