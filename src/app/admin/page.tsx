
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import type { Plan, Profile as UserProfile } from '@/lib/types';
import { createClient } from '@/lib/supabase/server';
import { ManagePlansForm } from './manage-plans-form';
import { PaymentsTable } from './payments-table';
import { WithdrawalsTable } from './withdrawals-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { tab: string | undefined };
}) {
  const defaultTab = searchParams.tab || 'payments';
  const supabase = createClient();
  
  const { data: paymentsData } = await supabase.from('payments').select('*, profiles(name), plans(name)').order('created_at', { ascending: false });
  const { data: withdrawalsData } = await supabase.from('withdrawals').select('*, profiles(name)').order('created_at', { ascending: false });
  const { data: usersData } = await supabase.from('profiles').select('*');
  const { data: plansData } = await supabase.from('plans').select('*').order('investment');

  const payments = paymentsData as any[] || [];
  const withdrawals = withdrawalsData as any[] || [];
  const users = usersData || [];
  const plans = plansData || [];

  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList>
        <TabsTrigger value="payments">Plan Payments</TabsTrigger>
        <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
        <TabsTrigger value="users">All Users</TabsTrigger>
        <TabsTrigger value="plans">Manage Plans</TabsTrigger>
      </TabsList>

      <TabsContent value="payments">
        <PaymentsTable serverPayments={payments} />
      </TabsContent>

      <TabsContent value="withdrawals">
        <WithdrawalsTable serverWithdrawals={withdrawals} />
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
        <ManagePlansForm plans={plans} />
      </TabsContent>
    </Tabs>
  );
}
