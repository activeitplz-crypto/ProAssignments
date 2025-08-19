
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
import type { Payment } from '@/lib/types';

interface PaymentsTableProps {
  serverPayments: Payment[];
}

export function PaymentsTable({ serverPayments }: PaymentsTableProps) {
  const [payments, setPayments] = useState(serverPayments);
  const supabase = createClient();

  useEffect(() => {
    setPayments(serverPayments);
  }, [serverPayments]);

  useEffect(() => {
    const channel = supabase
      .channel('realtime-payments')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'payments' },
        async (payload) => {
          const { data: updatedPayments, error } = await supabase
            .from('payments')
            .select('*, profiles(name), plans(name)')
            .order('created_at', { ascending: false });

          if (error) {
            console.error('Error refetching payments:', error);
          } else {
            setPayments(updatedPayments as any[]);
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
              {p.status === 'pending' && <AdminActionForms paymentId={p.id} />}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
