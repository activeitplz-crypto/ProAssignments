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
import { DollarSign, Zap, Briefcase, Wallet, User, Settings, ShieldCheck } from 'lucide-react';
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
      {/* Hero Section */}
      <UserProfileCard 
        name={user.name || 'Anonymous'}
        username={user.username || 'anonymous'}
        avatarUrl={user.avatar_url}
      />

      {/* Financial Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="group relative overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 border-none shadow-md">
            <div className={`absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b ${stat.color}`} />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`rounded-xl bg-gradient-to-br ${stat.color} p-2 text-white shadow-lg transition-transform group-hover:scale-110`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold tracking-tight text-foreground">
                {stat.value}
              </p>
              <p className="mt-1 text-[10px] font-medium text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Info Column */}
        <div className="space-y-8 lg:col-span-1">
          <Card className="shadow-lg border-none overflow-hidden">
            <div className="h-2 bg-primary/20" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-bold">
                <User className="h-5 w-5 text-primary" />
                Identity Details
              </CardTitle>
              <CardDescription>Your unique account identification.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Unique User ID</p>
                <p className="break-all font-mono text-xs bg-muted/50 p-3 rounded-lg border border-border/50 text-muted-foreground select-all">
                  {user.id}
                </p>
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Email Account</p>
                <p className="text-sm font-semibold text-foreground">{user.email || 'N/A'}</p>
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Account Since</p>
                <p className="text-sm font-semibold text-foreground">
                  {user.plan_start ? new Date(user.plan_start).toLocaleDateString('en-US', { month: 'long', year: 'numeric', day: 'numeric' }) : 'New Member'}
                </p>
              </div>
              <Separator className="opacity-50" />
              <div className="flex items-center gap-3 rounded-xl bg-green-500/10 p-4 border border-green-500/20">
                <div className="bg-green-500 rounded-full p-1.5">
                  <ShieldCheck className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-green-700">Verified Platform</p>
                  <p className="text-[10px] text-green-600/80 font-medium">FBR & PSEB Approved Partner</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Edit Column */}
        <div className="lg:col-span-2">
          <Card className="shadow-2xl border-none overflow-hidden bg-card/50 backdrop-blur-sm">
            <div className="h-2 bg-gradient-to-r from-primary via-purple-500 to-pink-500" />
            <CardHeader className="pb-8">
              <CardTitle className="flex items-center gap-2 text-2xl font-black italic tracking-tighter">
                <Settings className="h-6 w-6 text-primary" />
                PROFILE SETTINGS
              </CardTitle>
              <CardDescription className="text-base font-medium">Update your public identity and showcase your verified status.</CardDescription>
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
