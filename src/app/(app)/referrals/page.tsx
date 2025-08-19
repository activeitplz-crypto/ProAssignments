
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Users, DollarSign } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ReferralLinkCard } from '@/components/referral-link-card';
import { MOCK_USERS } from '@/lib/mock-data';
import { useState, useEffect } from 'react';
import type { UserProfile } from '@/lib/types';
import { getSession } from '@/lib/session';

export default function ReferralsPage() {
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
  
  const recentReferrals: { name: string; plan: string; bonus: number; date: string }[] = [
    { name: 'Ali Khan', plan: 'Standard Plan', bonus: 300.00, date: '2023-10-26' },
    { name: 'Fatima Ahmed', plan: 'Basic Plan', bonus: 200.00, date: '2023-10-25' },
    { name: 'Zainab Bibi', plan: 'Premium Plan', bonus: 600.00, date: '2023-10-22' },
  ];

  if (!user) {
    return <div>Loading referrals...</div>;
  }

  const referralLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002'}/signup?ref=${user.referral_code}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Referrals</h1>
        <p className="text-muted-foreground">
          Invite friends and earn rewards when they invest.
        </p>
      </div>

      <ReferralLinkCard referralLink={referralLink} />
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Successful Referrals</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.referral_count}</div>
            <p className="text-xs text-muted-foreground">
              Total friends who joined and invested.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Referral Bonus</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">PKR {user.referral_bonus.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Total earnings from your referrals.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Recent Referrals</CardTitle>
           <CardDescription>Your recent successful referrals.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Plan Purchased</TableHead>
                <TableHead>Bonus Earned</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentReferrals.length > 0 ? recentReferrals.map((ref, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{ref.name}</TableCell>
                  <TableCell>{ref.plan}</TableCell>
                  <TableCell>PKR {ref.bonus.toFixed(2)}</TableCell>
                  <TableCell>{ref.date}</TableCell>
                </TableRow>
              )) : (
                <TableRow>
                    <TableCell colSpan={4} className="text-center">No recent referrals yet.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
