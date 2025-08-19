
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { AdminActionForms } from './admin-action-forms';
import type { Withdrawal } from '@/lib/types';

interface WithdrawalsTableProps {
  serverWithdrawals: Withdrawal[];
}

export function WithdrawalsTable({ serverWithdrawals }: WithdrawalsTableProps) {
  const [withdrawals, setWithdrawals] = useState(serverWithdrawals);
  const supabase = createClient();

  useEffect(() => {
    setWithdrawals(serverWithdrawals);
  }, [serverWithdrawals]);

  useEffect(() => {
    const channel = supabase
      .channel('realtime-withdrawals')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'withdrawals' },
        async (payload) => {
           const { data: updatedWithdrawals, error } = await supabase
            .from('withdrawals')
            .select('*, profiles(name)')
            .order('created_at', { ascending: false });

          if (error) {
            console.error('Error refetching withdrawals:', error);
          } else {
            setWithdrawals(updatedWithdrawals as any[]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return (
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
              {w.status === 'pending' && <AdminActionForms withdrawalId={w.id} />}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
