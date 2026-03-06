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
import { DollarSign, Zap, Briefcase, Wallet, User, Settings, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

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
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">Error loading profile. Please try refreshing.</p>
      </div>
    );
  }

  const stats = [
    { 
      title: 'Current Balance', 
      value: `PKR ${user.current_balance.toFixed(2)}`, 
      icon: Wallet,
      color: 'from-blue-500 to-cyan-400',
      description: 'Available for withdrawal'
    },
    { 
      title: "Today's Earnings", 
      value: `PKR ${user.today_earning.toFixed(2)}`, 
      icon: Zap,
      color: 'from-amber-500 to-orange-400',
      description: 'Earned in last 24h'
    },
    { 
      title: 'Total Earnings', 
      value: `PKR ${user.total_earning.toFixed(2)}`, 
      icon: DollarSign,
      color: 'from-green-500 to-emerald-400',
      description: 'Lifetime income'
    },
    { 
      title: 'Active Plan', 
      value: user.current_plan || 'No Plan', 
      icon: Briefcase,
      color: 'from-purple-500 to-pink-400',
      description: 'Your current status'
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-12">
      <UserProfileCard 
        name={user.name || 'Anonymous'}
        username={user.username || 'anonymous'}
        avatarUrl={user.avatar_url}
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="group relative overflow-hidden transition-all hover:shadow-lg">
            <div className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${stat.color}`} />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`rounded-lg bg-gradient-to-br ${stat.color} p-2 text-white shadow-md transition-transform group-hover:scale-110`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold tracking-tight">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Info Column */}
        <div className="space-y-8 lg:col-span-1">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <User className="h-5 w-5 text-primary" />
                Account Info
              </CardTitle>
              <CardDescription>Your public and private details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase text-muted-foreground">User ID</p>
                <p className="break-all font-mono text-sm bg-muted p-2 rounded border">{user.id}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase text-muted-foreground">Email Address</p>
                <p className="text-sm font-medium">{user.email || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase text-muted-foreground">Member Since</p>
                <p className="text-sm font-medium">
                  {user.plan_start ? new Date(user.plan_start).toLocaleDateString() : 'New User'}
                </p>
              </div>
              <Separator />
              <div className="flex items-center gap-2 text-green-600">
                <ShieldCheck className="h-5 w-5" />
                <span className="text-sm font-semibold">FBR & PSEB Verified</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Edit Column */}
        <div className="lg:col-span-2">
          <Card className="shadow-md border-t-4 border-t-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Settings className="h-5 w-5 text-primary" />
                Customize Profile
              </CardTitle>
              <CardDescription>Update your display name and profile identity.</CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm user={user} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
