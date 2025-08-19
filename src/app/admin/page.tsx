
'use client';

import { useSearchParams } from 'next/navigation';
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
import type { Payment, Withdrawal, Profile as UserProfile, Plan } from '@/lib/types';
import { format } from 'date-fns';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useEffect, useState, useTransition } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ManagePlansForm } from './manage-plans-form';

export default function AdminPage() {
  const defaultTab = useSearchParams().get('tab') || 'payments';
  const supabase = createClient();
  const [isPending, startTransition] = useTransition();

  const [payments, setPayments] = useState<Payment[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  
  const fetchData = async () => {
    const { data: paymentsData } = await supabase.from('payments').select('*, profiles(name), plans(name)');
    const { data: withdrawalsData } = await supabase.from('withdrawals').select('*, profiles(name)');
    const { data: usersData } = await supabase.from('profiles').select('*');
    const { data: plansData } = await supabase.from('plans').select('*').order('investment');
    
    setPayments(paymentsData as any || []);
    setWithdrawals(withdrawalsData as any || []);
    setUsers(usersData || []);
    setPlans(plansData || []);
  };

  useEffect(() => {
    fetchData();

    const channel = supabase.channel('realtime admin')
      .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
        fetchData();
      }).subscribe();
      
    return () => {
        supabase.removeChannel(channel);
    };
  }, []);

  const handleAction = () => {
    startTransition(() => {
        fetchData();
    });
  };

  return (
    <Tabs defaultValue={defaultTab} className="w-full">
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
                <TableCell>{p.profiles?.name}</TableCell>
                <TableCell>{p.plans?.name}</TableCell>
                <TableCell>{p.payment_uid}</TableCell>
                <TableCell><Badge variant={p.status === 'pending' ? 'secondary' : p.status === 'approved' ? 'default' : 'destructive'}>{p.status}</Badge></TableCell>
                <TableCell>{format(new Date(p.created_at), 'PPP')}</TableCell>
                <TableCell className="space-x-2">
                  {p.status === 'pending' && (
                    <>
                      <form action={approvePayment} className="inline-block" onSubmit={handleAction}><input type="hidden" name="paymentId" value={p.id}/><Button size="sm" type="submit" disabled={isPending}>Approve</Button></form>
                      <form action={rejectPayment} className="inline-block" onSubmit={handleAction}><input type="hidden" name="paymentId" value={p.id}/><Button size="sm" variant="destructive" type="submit" disabled={isPending}>Reject</Button></form>
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
                <TableCell>{w.profiles?.name}</TableCell>
                <TableCell>PKR {w.amount.toFixed(2)}</TableCell>
                <TableCell>{w.account_info.bank_name} - {w.account_info.holder_name}</TableCell>
                 <TableCell><Badge variant={w.status === 'pending' ? 'secondary' : w.status === 'approved' ? 'default' : 'destructive'}>{w.status}</Badge></TableCell>
                <TableCell>{format(new Date(w.created_at), 'PPP')}</TableCell>
                <TableCell className="space-x-2">
                   {w.status === 'pending' && (
                    <>
                      <form action={approveWithdrawal} className="inline-block" onSubmit={handleAction}><input type="hidden" name="withdrawalId" value={w.id}/><Button size="sm" type="submit" disabled={isPending}>Approve</Button></form>
                      <form action={rejectWithdrawal} className="inline-block" onSubmit={handleAction}><input type="hidden" name="withdrawalId" value={w.id}/><Button size="sm" variant="destructive" type="submit" disabled={isPending}>Reject</Button></form>
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
        <ManagePlansForm plans={plans} />
      </TabsContent>
    </Tabs>
  );
}
