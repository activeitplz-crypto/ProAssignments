import { createClient } from '@/lib/supabase/server';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clipboard, Gift, Users, DollarSign } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default async function ReferralsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const userId = user?.id;
  const referralLink = userId
    ? `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002'}/signup?ref=${userId}`
    : 'Loading...';

  // Mock data
  const referralStats = {
    count: 12,
    bonus: 300.00,
  };

  const recentReferrals = [
    { name: 'Jane Doe', plan: 'Standard', bonus: 15.00, date: '2023-10-26' },
    { name: 'Peter Jones', plan: 'Basic', bonus: 5.00, date: '2023-10-24' },
    { name: 'Sam Wilson', plan: 'Premium', bonus: 50.00, date: '2023-10-22' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Referrals</h1>
        <p className="text-muted-foreground">
          Invite friends and earn rewards when they invest.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Your Unique Referral Link</CardTitle>
          <CardDescription>
            Share this link with your friends. You'll earn a bonus for each friend who signs up and purchases a plan.
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
            }}
          >
            <Clipboard className="mr-2 h-4 w-4" /> Copy Link
          </Button>
        </CardContent>
      </Card>
      
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
            <div className="text-2xl font-bold">${referralStats.bonus.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Total earnings from your referrals.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Recent Referrals</CardTitle>
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
              {recentReferrals.map((ref, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{ref.name}</TableCell>
                  <TableCell>{ref.plan}</TableCell>
                  <TableCell>${ref.bonus.toFixed(2)}</TableCell>
                  <TableCell>{ref.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
