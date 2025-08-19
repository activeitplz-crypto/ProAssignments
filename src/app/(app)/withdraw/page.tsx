
import { createClient } from '@/lib/supabase/server';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { WithdrawForm } from './withdraw-form';
import type { UserProfile } from '@/lib/types';
import { redirect } from 'next/navigation';

export default async function WithdrawPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: userProfile } = await supabase
    .from('users')
    .select('current_balance')
    .eq('id', user.id)
    .single<Pick<UserProfile, 'current_balance'>>();

  const availableBalance = userProfile?.current_balance || 0;

  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Request Withdrawal</CardTitle>
          <CardDescription>
            Your current available balance is PKR {availableBalance.toFixed(2)}. Withdrawals are manually processed within 24 hours.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WithdrawForm currentBalance={availableBalance} />
        </CardContent>
      </Card>
    </div>
  );
}
