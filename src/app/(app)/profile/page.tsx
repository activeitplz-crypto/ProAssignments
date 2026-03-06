
import { createClient } from '@/lib/supabase/server';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { UserProfileCard } from '@/components/user-profile-card';
import { ProfileForm } from './profile-form';
import { redirect } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { DollarSign, Zap, Briefcase, Wallet } from 'lucide-react';

export default async function ProfilePage() {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const { data: user, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();
  
  if (error || !user) {
    return <div>Error loading profile. Please try again.</div>;
  }

  const stats = [
    { title: 'Total Earnings', value: `PKR ${user.total_earning.toFixed(2)}`, icon: DollarSign },
    { title: 'Current Balance', value: `PKR ${user.current_balance.toFixed(2)}`, icon: Wallet },
    { title: "Today's Earnings", value: `PKR ${user.today_earning.toFixed(2)}`, icon: Zap },
    { title: 'Active Plan', value: user.current_plan || 'None', icon: Briefcase },
  ];

  return (
    <div className="space-y-6">
      <UserProfileCard 
        name={user.name || 'Anonymous'}
        username={user.username || 'anonymous'}
        avatarUrl={user.avatar_url}
      />

      {/* Earning Details moved here */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="transform transition-transform duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-normal text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

       <Card>
        <CardHeader>
          <CardTitle>Your Information</CardTitle>
          <CardDescription>
            These are your account details. Some fields can be edited below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <p className="rounded-md border bg-muted px-3 py-2 text-sm text-foreground">
              {user.name || 'N/A'}
            </p>
          </div>
          <div className="space-y-2">
            <Label>Username</Label>
            <p className="rounded-md border bg-muted px-3 py-2 text-sm text-foreground">
              {user.username || 'N/A'}
            </p>
          </div>
           <div className="space-y-2">
            <Label>Email Address</Label>
             <p className="rounded-md border bg-muted px-3 py-2 text-sm text-foreground">
              {user.email || 'N/A'}
            </p>
          </div>
           <div className="space-y-2">
            <Label>User ID</Label>
            <p className="break-all rounded-md border bg-muted px-3 py-2 text-sm text-foreground">
              {user.id}
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
          <CardDescription>Update your name, username, and profile picture here.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm user={user} />
        </CardContent>
      </Card>
    </div>
  );
}
