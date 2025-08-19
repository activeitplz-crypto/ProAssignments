
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { WithdrawForm } from './withdraw-form';
import { MOCK_USER } from '@/lib/mock-data';

export default async function WithdrawPage() {
  const availableBalance = MOCK_USER.current_balance;

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
