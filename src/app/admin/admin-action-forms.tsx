
'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { approvePayment, rejectPayment, approveWithdrawal, rejectWithdrawal } from './actions';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AdminActionFormsProps {
  paymentId?: string;
  withdrawalId?: string;
}

export function AdminActionForms({ paymentId, withdrawalId }: AdminActionFormsProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleAction = (action: (formData: FormData) => Promise<void>) => {
    const formData = new FormData();
    if (paymentId) formData.append('paymentId', paymentId);
    if (withdrawalId) formData.append('withdrawalId', withdrawalId);
    
    startTransition(async () => {
      await action(formData);
      // We don't need to manually refresh, revalidatePath in actions handles it
    });
  };

  if (paymentId) {
    return (
      <>
        <Button size="sm" onClick={() => handleAction(approvePayment)} disabled={isPending}>
          {isPending && <Loader2 className="animate-spin" />} Approve
        </Button>
        <Button size="sm" variant="destructive" onClick={() => handleAction(rejectPayment)} disabled={isPending}>
          {isPending && <Loader2 className="animate-spin" />} Reject
        </Button>
      </>
    );
  }

  if (withdrawalId) {
    return (
      <>
        <Button size="sm" onClick={() => handleAction(approveWithdrawal)} disabled={isPending}>
           {isPending && <Loader2 className="animate-spin" />} Approve
        </Button>
        <Button size="sm" variant="destructive" onClick={() => handleAction(rejectWithdrawal)} disabled={isPending}>
           {isPending && <Loader2 className="animate-spin" />} Reject
        </Button>
      </>
    );
  }

  return null;
}
