
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

  // Real data fetching logic
  const { data: paymentsData } = await supabase
    .from('payments')
    .select('*, users(name), plans(name)');
  
  const { data: withdrawalsData } = await supabase
    .from('withdrawals')
    .select('*, users(name)');

  const { data: usersData } = await supabase.from('users').select('*');

  const payments = paymentsData as Payment[] || [];
  const withdrawals = withdrawalsData as (Omit<Withdrawal, 'account_info'> & { account_info: any })[] || [];
  const users = usersData as UserProfile[] || [];


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
    </Tabs>
  );
}
