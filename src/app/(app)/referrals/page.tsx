
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users, CheckCircle, Gift, UserPlus, ArrowUpCircle } from 'lucide-react';
import type { Referral, Upline } from '@/lib/types';
import { format } from 'date-fns';
import { CopyButton } from './copy-button';

async function getUplineInfo(supabase: ReturnType<typeof createClient>, referrerId: string): Promise<Upline | null> {
    const { data: uplineProfile, error } = await supabase
        .from('profiles')
        .select('name, referral_code')
        .eq('id', referrerId)
        .single();
    
    if(error || !uplineProfile) {
        // This is not a critical error if the upline is not found, so just log it.
        console.error('Could not fetch upline info:', error);
        return null;
    }

    return {
        name: uplineProfile.name || 'Anonymous',
        referral_code: uplineProfile.referral_code,
    }
}


export default async function ReferralsPage() {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const { data: user, error: userError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (userError || !user) {
    return <div>Could not load your referral data. Please try again.</div>;
  }
  
  let uplineInfo: Upline | null = null;
  if (user.referred_by) {
    uplineInfo = await getUplineInfo(supabase, user.referred_by);
  }

  const { data: referrals, error: referralsError } = await supabase
    .from('profiles')
    .select('name, created_at, current_plan')
    .eq('referred_by', user.id)
    .order('created_at', { ascending: false });

  if (referralsError) {
    console.error('Error fetching referrals:', referralsError);
    // Don't return, just show an empty table.
  }

  const referralLink = `${process.env.NEXT_PUBLIC_BASE_URL}/signup?ref=${user.referral_code}`;

  return (
    <div className="space-y-6">
      {uplineInfo && (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2 text-2xl">
                    <ArrowUpCircle className="h-7 w-7 text-primary" />
                    My Upline
                </CardTitle>
                <CardDescription>This is the person who referred you to the platform.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Upline Name</p>
                    <p className="font-semibold">{uplineInfo.name}</p>
                </div>
                 <div>
                    <p className="text-sm font-medium text-muted-foreground">Upline Referral Code</p>
                    <p className="font-semibold">{uplineInfo.referral_code}</p>
                </div>
            </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2 text-3xl">
            <Gift className="h-8 w-8 text-primary" />
            Invite Friends, Earn Rewards
          </CardTitle>
          <CardDescription>
            Share your unique referral link or code with friends. When they sign up and
            purchase a plan, you'll earn a bonus!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4 rounded-lg border bg-muted p-4">
            <div className="space-y-2">
              <label
                htmlFor="referral-link"
                className="text-sm font-medium text-muted-foreground"
              >
                Your Unique Referral Link
              </label>
              <div className="flex gap-2">
                <input
                  id="referral-link"
                  type="text"
                  readOnly
                  value={referralLink}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
                <CopyButton textToCopy={referralLink} />
              </div>
            </div>
             <div className="space-y-2">
              <label
                htmlFor="referral-code"
                className="text-sm font-medium text-muted-foreground"
              >
                Your Unique Referral Code
              </label>
              <div className="flex gap-2">
                <input
                  id="referral-code"
                  type="text"
                  readOnly
                  value={user.referral_code}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-semibold"
                />
                <CopyButton textToCopy={user.referral_code} />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
             <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{referrals?.length || 0}</div>
                </CardContent>
             </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Verified Referrals</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {(referrals as Referral[])?.filter(r => r.current_plan).length || 0}
                    </div>
                </CardContent>
             </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Referral Earnings</CardTitle>
                    <Gift className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">PKR {user.referral_bonus.toFixed(2)}</div>
                </CardContent>
             </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <UserPlus className="h-6 w-6 text-primary" />
            Your Referral History
          </CardTitle>
          <CardDescription>
            Here is a list of users who have signed up using your link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User Name</TableHead>
                <TableHead>Signup Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {referrals && referrals.length > 0 ? (
                (referrals as Referral[]).map((ref, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{ref.name || 'Anonymous User'}</TableCell>
                    <TableCell>
                      {format(new Date(ref.created_at), 'PPP')}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={ref.current_plan ? 'default' : 'secondary'}
                        className={ref.current_plan ? 'bg-green-500' : ''}
                      >
                        {ref.current_plan
                          ? 'Verified'
                          : 'Unverified'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No one has signed up with your referral link yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
