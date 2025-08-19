
'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { UserProfileCard } from '@/components/user-profile-card';
import { DollarSign, Zap, Briefcase, Wallet } from 'lucide-react';
import { MOCK_USERS } from '@/lib/mock-data';
import { useEffect, useState } from 'react';
import type { UserProfile } from '@/lib/types';
import { getSession } from '@/lib/session';


export default function DashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const session = await getSession();
      if (session?.email) {
        // Find the base user from mock data
        const baseUser = MOCK_USERS.find(u => u.email === session.email);
        
        // Check local storage for any client-side updates (like name or avatar)
        const storedUserStr = localStorage.getItem(`user-profile-${session.email}`);
        const storedUser = storedUserStr ? JSON.parse(storedUserStr) : {};

        // Merge base user with stored updates
        if (baseUser) {
           setUser({ ...baseUser, ...storedUser });
        }
      }
    };
    fetchUser();
  }, []);

  if (!user) {
    return <div>Loading dashboard...</div>;
  }

  const userData = {
    name: user.name || 'Anonymous',
    username: user.email?.split('@')[0] || 'anonymous',
    avatarUrl: user.avatarUrl,
    total_earning: user.total_earning,
    today_earning: user.today_earning,
    active_plan: user.current_plan || 'None',
    current_balance: user.current_balance,
  };

  return (
    <div className="flex flex-col gap-6">
      <UserProfileCard name={userData.name} username={userData.username} avatarUrl={userData.avatarUrl} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-normal text-muted-foreground">
              Total Earnings
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              PKR {userData.total_earning.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-normal text-muted-foreground">
              Today's Earnings
            </CardTitle>
             <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              PKR {userData.today_earning.toFixed(2)}
            </p>
          </CardContent>
        </Card>
         <Card className="bg-card/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-normal text-muted-foreground">
              Active Plan
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {userData.active_plan}
            </p>
          </CardContent>
        </Card>
         <Card className="bg-card/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-normal text-muted-foreground">
              Current Balance
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
             PKR {userData.current_balance.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

