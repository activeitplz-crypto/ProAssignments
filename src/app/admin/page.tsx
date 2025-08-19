
import { createClient } from '@/lib/supabase/server';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { approvePayment, rejectPayment, approveWithdrawal, rejectWithdrawal, seedInitialPlans } from './actions';
import type { Payment, Withdrawal, UserProfile, Plan } from '@/lib/types';
import { format } from 'date-fns';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

type AdminPageProps = {
  searchParams: {
    tab: 'payments' | 'withdrawals' | 'users' | 'plans';
  };
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const supabase = createClient();
  const currentTab = searchParams.tab || 'payments';

  // Real data fetching logic
  const { data: paymentsData } = await supabase
    .from('payments')
    .select('*, users(name), plans(name)');
  
  const { data: withdrawalsData } = await supabase
    .from('withdrawals')
    .select('*, users(name)');

  const { data: usersData } = await supabase.from('users').select('*');
  const { data: plansData } = await supabase.from('plans').select('*').order('investment');


  const payments = paymentsData as Payment[] || [];
  const withdrawals = withdrawalsData as (Omit<Withdrawal, 'account_info'> & { account_info: any })[] || [];
  const users = usersData as UserProfile[] || [];
  const plans = plansData as Plan[] || [];


  return (
    <Tabs defaultValue={currentTab} className="w-full">
      <TabsList>
        <TabsTrigger value="payments">Plan Payments</TabsTrigger>
        <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
        <TabsTrigger value="users">All Users</TabsTrigger>
        <TabsTrigger value="plans">Manage Plans</TabsTrigger>
      </TabsList>

      <TabsContent value="payments">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Payment UID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments?.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.users?.name}</TableCell>
                <TableCell>{p.plans?.name}</TableCell>
                <TableCell>{p.payment_uid}</TableCell>
                <TableCell><Badge variant={p.status === 'pending' ? 'secondary' : p.status === 'approved' ? 'default' : 'destructive'}>{p.status}</Badge></TableCell>
                <TableCell>{format(new Date(p.created_at), 'PPP')}</TableCell>
                <TableCell className="space-x-2">
                  {p.status === 'pending' && (
                    <>
                      <form action={approvePayment} className="inline-block"><input type="hidden" name="paymentId" value={p.id}/><input type="hidden" name="userId" value={p.user_id}/><input type="hidden" name="planId" value={p.plan_id}/><Button size="sm" type="submit">Approve</Button></form>
                      <form action={rejectPayment} className="inline-block"><input type="hidden" name="paymentId" value={p.id}/><Button size="sm" variant="destructive" type="submit">Reject</Button></form>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TabsContent>

      <TabsContent value="withdrawals">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Bank Info</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {withdrawals?.map((w) => (
              <TableRow key={w.id}>
                <TableCell>{w.users?.name}</TableCell>
                <TableCell>PKR {w.amount.toFixed(2)}</TableCell>
                <TableCell>{w.account_info.bank_name} - {w.account_info.holder_name}</TableCell>
                 <TableCell><Badge variant={w.status === 'pending' ? 'secondary' : w.status === 'approved' ? 'default' : 'destructive'}>{w.status}</Badge></TableCell>
                <TableCell>{format(new Date(w.created_at), 'PPP')}</TableCell>
                <TableCell className="space-x-2">
                   {w.status === 'pending' && (
                    <>
                      <form action={approveWithdrawal} className="inline-block"><input type="hidden" name="withdrawalId" value={w.id}/><Button size="sm" type="submit">Approve</Button></form>
                      <form action={rejectWithdrawal} className="inline-block"><input type="hidden" name="withdrawalId" value={w.id}/><Button size="sm" variant="destructive" type="submit">Reject</Button></form>
                    </>
                   )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TabsContent>
      
      <TabsContent value="users">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Total Earnings</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell><Badge variant="secondary">{u.current_plan || 'None'}</Badge></TableCell>
                <TableCell>PKR {u.current_balance.toFixed(2)}</TableCell>
                <TableCell>PKR {u.total_earning.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TabsContent>

      <TabsContent value="plans">
        <Card>
            <CardHeader>
                <CardTitle>Manage Investment Plans</CardTitle>
                <CardDescription>View, add, or edit investment plans. Be careful, changes here are live.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Investment</TableHead>
                            <TableHead>Daily Earning</TableHead>
                            <TableHead>Period</TableHead>
                            <TableHead>Total Return</TableHead>
                            <TableHead>Referral Bonus</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {plans.length > 0 ? plans.map((p) => (
                             <TableRow key={p.id}>
                                <TableCell>{p.name}</TableCell>
                                <TableCell>PKR {p.investment}</TableCell>
                                <TableCell>PKR {p.daily_earning}</TableCell>
                                <TableCell>{p.period_days} days</TableCell>
                                <TableCell>PKR {p.total_return}</TableCell>
                                <TableCell>PKR {p.referral_bonus}</TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">No plans found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter>
                {plans.length === 0 && (
                    <form action={seedInitialPlans}>
                        <Button>Seed Initial Plans</Button>
                    </form>
                )}
            </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
