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
import { DollarSign, Zap, Briefcase, Wallet, User, Settings, ShieldCheck, Fingerprint, Mail, Calendar } from 'lucide-react';
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
      color: 'from-[#4F46E5] to-[#06B6D4]',
      description: 'Available for withdrawal'
    },
    { 
      title: "Today's Earnings", 
      value: `PKR ${user.today_earning.toFixed(2)}`, 
      icon: Zap,
      color: 'from-[#F59E0B] to-[#F97316]',
      description: 'Earned in last 24h'
    },
    { 
      title: 'Total Earnings', 
      value: `PKR ${user.total_earning.toFixed(2)}`, 
      icon: DollarSign,
      color: 'from-[#10B981] to-[#059669]',
      description: 'Lifetime income'
    },
    { 
      title: 'Active Plan', 
      value: user.current_plan || 'No Plan', 
      icon: Briefcase,
      color: 'from-[#8B5CF6] to-[#D946EF]',
      description: 'Your current status'
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-10 pb-20">
      {/* Hero Header */}
      <div className="relative">
        <UserProfileCard 
          name={user.name || 'Anonymous'}
          username={user.username || 'anonymous'}
          avatarUrl={user.avatar_url}
        />
      </div>

      {/* Modern Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="group relative overflow-hidden border-none bg-card/40 shadow-xl backdrop-blur-md transition-all hover:shadow-2xl hover:-translate-y-1">
            <div className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${stat.color} opacity-50 group-hover:opacity-100 transition-opacity`} />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70">
                {stat.title}
              </CardTitle>
              <div className={`rounded-full bg-gradient-to-br ${stat.color} p-2 text-white shadow-lg shadow-primary/20`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="font-display text-3xl text-foreground">
                {stat.value}
              </p>
              <p className="mt-1 text-[10px] font-medium text-muted-foreground italic">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* Identity & Security Column */}
        <div className="space-y-8 lg:col-span-4">
          <Card className="border-none bg-card/30 shadow-2xl backdrop-blur-xl overflow-hidden rounded-3xl">
            <div className="h-1.5 bg-gradient-to-r from-primary to-purple-500" />
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl font-black italic tracking-tighter">
                <Fingerprint className="h-6 w-6 text-primary" />
                IDENTITY
              </CardTitle>
              <CardDescription className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">Verified Member Credentials</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-black text-primary/70 uppercase">
                  <Fingerprint className="h-3 w-3" />
                  Unique System ID
                </div>
                <div className="group relative">
                  <p className="break-all font-mono text-[10px] bg-muted/20 p-4 rounded-2xl border border-white/5 text-muted-foreground select-all transition-colors group-hover:bg-muted/40">
                    {user.id}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 group">
                  <div className="p-3 rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-muted-foreground/60 uppercase">Email Contact</p>
                    <p className="text-sm font-bold text-foreground">{user.email || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500 transition-transform group-hover:scale-110">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-muted-foreground/60 uppercase">Member Since</p>
                    <p className="text-sm font-bold text-foreground">
                      {user.plan_start ? new Date(user.plan_start).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'New Member'}
                    </p>
                  </div>
                </div>
              </div>

              <Separator className="bg-white/5" />

              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/5 p-5 border border-green-500/20">
                <div className="absolute -right-4 -bottom-4 opacity-10">
                  <ShieldCheck className="h-20 w-20 text-green-500" />
                </div>
                <div className="flex items-center gap-3 relative z-10">
                  <div className="bg-green-500 shadow-lg shadow-green-500/40 rounded-full p-2">
                    <ShieldCheck className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-green-700 uppercase tracking-tighter">Certified Partner</p>
                    <p className="text-[10px] text-green-600/80 font-bold">FBR & PSEB Registered</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Form Settings Column */}
        <div className="lg:col-span-8">
          <Card className="border-none bg-card/40 shadow-2xl backdrop-blur-2xl rounded-3xl overflow-hidden">
            <CardHeader className="pb-10 pt-8 border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="font-display text-4xl text-foreground tracking-tight">SETTINGS</CardTitle>
                  <CardDescription className="text-xs font-medium text-muted-foreground/80">Manage your public presence and account visibility.</CardDescription>
                </div>
                <div className="p-3 rounded-full bg-primary/10 border border-primary/20">
                  <Settings className="h-6 w-6 text-primary animate-[spin_10s_linear_infinite]" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-10">
              <ProfileForm user={user} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
