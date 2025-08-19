
import { createClient } from '@/lib/supabase/server';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { WithdrawForm } from './withdraw-form';
import { redirect } from 'next/navigation';

export default async function WithdrawPage() {
  const supabase = createClient();
  const { data: { session }} = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const { data: user, error } = await supabase
    .from('profiles')
    .select('current_balance')
    .eq('id', session.user.id)
    .single();

  if (error || !user) {
    return <div>Loading...</div>;
  }

  const availableBalance = user.current_balance;

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
