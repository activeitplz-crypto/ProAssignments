import { createClient } from '@/lib/supabase/server';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

async function submitWithdrawal(formData: FormData) {
  'use server';
  // Server action logic will go here
  console.log('Withdrawal submitted');
}

export default async function WithdrawPage() {
  const supabase = createClient();

  // In a real app, you would fetch the user's available balance
  const availableBalance = 1250.75;

  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Request Withdrawal</CardTitle>
          <CardDescription>
            Your current available balance is ${availableBalance.toFixed(2)}. Withdrawals are processed within 24 hours.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={submitWithdrawal} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input id="amount" name="amount" type="number" step="0.01" placeholder="e.g., 50.00" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bank_name">Bank / Service Name</Label>
              <Input id="bank_name" name="bank_name" placeholder="e.g., Easypaisa, JazzCash, Bank Al-Habib" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="holder_name">Account Holder Name</Label>
              <Input id="holder_name" name="holder_name" placeholder="e.g., John Doe" required />
            </div>
            <Button type="submit" className="w-full">Submit Withdrawal Request</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
