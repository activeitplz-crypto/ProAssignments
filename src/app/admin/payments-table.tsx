
'use client';

import { useState, useEffect, useCallback } from 'react';
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
import { Skeleton } from '@/components/ui/skeleton';

export function PaymentsTable() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('payments')
      .select('*, profiles(name), plans(name)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching payments:', error);
      setPayments([]);
    } else {
      setPayments(data as any[]);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchPayments();

    const channel = supabase
      .channel('realtime-payments')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'payments' },
        (payload) => {
          fetchPayments(); // Refetch all data on any change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, fetchPayments]);

  if (loading) {
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
          {[...Array(3)].map((_, i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
              <TableCell><Skeleton className="h-6 w-[80px] rounded-full" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[90px]" /></TableCell>
              <TableCell><Skeleton className="h-8 w-[150px]" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

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
        {payments.length > 0 ? (
          payments.map((p) => (
            <TableRow key={p.id}>
              <TableCell>{p.profiles?.name || 'N/A'}</TableCell>
              <TableCell>{p.plans?.name || 'N/A'}</TableCell>
              <TableCell>{p.payment_uid}</TableCell>
              <TableCell><Badge variant={p.status === 'pending' ? 'secondary' : p.status === 'approved' ? 'default' : 'destructive'}>{p.status}</Badge></TableCell>
              <TableCell>{format(new Date(p.created_at), 'PPP')}</TableCell>
              <TableCell className="space-x-2">
                {p.status === 'pending' && <AdminActionForms paymentId={p.id} />}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="h-24 text-center">
              No payment requests found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
