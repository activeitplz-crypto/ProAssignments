
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
import { Skeleton } from '@/components/ui/skeleton';
import type { Payment } from '@/lib/types';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type EnrichedPayment = Payment & {
  profiles: { name: string | null } | null;
  plans: { name: string | null } | null;
};

export function PaymentsTable() {
  const [payments, setPayments] = useState<EnrichedPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('payments')
      .select('*, profiles(name), plans(name)')
      .eq('status', 'pending') // Only fetch pending payments
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching payments:', error);
      setPayments([]);
    } else {
      setPayments(data as EnrichedPayment[]);
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
          // Refetch the list of pending payments when any payment record changes
          fetchPayments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, fetchPayments]);

  if (loading) {
    return (
       <Card>
        <CardHeader>
          <CardTitle>Pending Plan Payments</CardTitle>
          <CardDescription>Review and approve new plan purchase requests.</CardDescription>
        </CardHeader>
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
                <TableCell className="space-x-2"><Skeleton className="h-8 w-[80px]" /><Skeleton className="h-8 w-[80px]" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Plan Payments</CardTitle>
        <CardDescription>Review and approve new plan purchase requests. Approved requests will be removed from this list.</CardDescription>
      </CardHeader>
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
                <TableCell><Badge variant='secondary'>{p.status}</Badge></TableCell>
                <TableCell>{format(new Date(p.created_at), 'PPP')}</TableCell>
                <TableCell className="space-x-2">
                  <AdminActionForms paymentId={p.id} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No pending payment requests found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}

