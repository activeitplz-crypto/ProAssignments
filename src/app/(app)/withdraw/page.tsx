
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { WithdrawForm } from './withdraw-form';
import { MOCK_USERS } from '@/lib/mock-data';
import { useState, useEffect } from 'react';
import { getSession } from '@/lib/session';
import type { UserProfile } from '@/lib/types';


export default function WithdrawPage() {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const session = await getSession();
      if (session?.email) {
        setUser(MOCK_USERS.find(u => u.email === session.email) || null);
      }
    };
    fetchUser();
  }, []);

  if (!user) {
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
