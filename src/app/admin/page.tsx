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
import { approvePayment, rejectPayment, approveWithdrawal, rejectWithdrawal } from './actions';
import type { Payment, Withdrawal, UserProfile } from '@/lib/types';
import { format } from 'date-fns';

type AdminPageProps = {
  searchParams: {
    tab: 'payments' | 'withdrawals' | 'users';
  };
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const supabase = createClient();
  const currentTab = searchParams.tab || 'payments';

  // Mock data - replace with actual queries
  const payments: Payment[] = [
    { id: 'p1', user_id: 'u1', plan_id: 'pl1', payment_uid: '123456', status: 'pending', created_at: new Date().toISOString(), users: { name: 'Alice' } as UserProfile, plans: { name: 'Basic' } },
  ];
  const withdrawals: Withdrawal[] = [
    { id: 'w1', user_id: 'u2', amount: 50, bank_name: 'Easypaisa', holder_name: 'Bob', status: 'pending', created_at: new Date().toISOString(), users: { name: 'Bob' } as UserProfile },
  ];
  const users: UserProfile[] = [
    { id: 'u1', name: 'Alice', email: 'alice@example.com', current_plan: 'Basic', total_earning: 100, today_earning: 5, plan_start: new Date().toISOString(), plan_end: new Date().toISOString(), referral_bonus: 10, referral_count: 2 },
    { id: 'u2', name: 'Bob', email: 'bob@example.com', current_plan: 'Standard', total_earning: 250, today_earning: 10, plan_start: new Date().toISOString(), plan_end: new Date().toISOString(), referral_bonus: 20, referral_count: 4 },
  ];

  /*
  // Real data fetching logic
  const { data: payments } = await supabase
    .from('payments')
    .select('*, users(name), plans(name)')
    .eq('status', 'pending');
  
  const { data: withdrawals } = await supabase
    .from('withdrawals')
    .select('*, users(name)')
    .eq('status', 'pending');

  const { data: users } = await supabase.from('users').select('*');
  */

  return (
    <Tabs defaultValue={currentTab} className="w-full">
      <TabsList>
        <TabsTrigger value="payments">Plan Payments</TabsTrigger>
        <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
        <TabsTrigger value="users">All Users</TabsTrigger>
      </TabsList>

      <TabsContent value="payments">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Payment UID</TableHead>
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
                <TableCell>{format(new Date(p.created_at), 'PPP')}</TableCell>
                <TableCell className="space-x-2">
                  <form action={approvePayment} className="inline-block"><input type="hidden" name="paymentId" value={p.id}/><input type="hidden" name="userId" value={p.user_id}/><input type="hidden" name="planId" value={p.plan_id}/><Button size="sm" type="submit">Approve</Button></form>
                  <form action={rejectPayment} className="inline-block"><input type="hidden" name="paymentId" value={p.id}/><Button size="sm" variant="destructive" type="submit">Reject</Button></form>
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
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {withdrawals?.map((w) => (
              <TableRow key={w.id}>
                <TableCell>{w.users?.name}</TableCell>
                <TableCell>${w.amount.toFixed(2)}</TableCell>
                <TableCell>{w.bank_name} - {w.holder_name}</TableCell>
                <TableCell>{format(new Date(w.created_at), 'PPP')}</TableCell>
                <TableCell className="space-x-2">
                  <form action={approveWithdrawal} className="inline-block"><input type="hidden" name="withdrawalId" value={w.id}/><Button size="sm" type="submit">Approve</Button></form>
                  <form action={rejectWithdrawal} className="inline-block"><input type="hidden" name="withdrawalId" value={w.id}/><Button size="sm" variant="destructive" type="submit">Reject</Button></form>
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
              <TableHead>Total Earnings</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell><Badge variant="secondary">{u.current_plan || 'None'}</Badge></TableCell>
                <TableCell>${u.total_earning.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TabsContent>
    </Tabs>
  );
}
