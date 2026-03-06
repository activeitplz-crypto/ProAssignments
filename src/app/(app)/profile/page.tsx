
import { createClient } from '@/lib/supabase/server';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ProfileForm } from './profile-form';
import { redirect } from 'next/navigation';
import { 
  DollarSign, 
  Zap, 
  Briefcase, 
  Wallet, 
  Fingerprint, 
  Mail, 
  Calendar, 
  Bell, 
  ArrowDownToLine, 
  Users, 
  HelpCircle,
  Settings,
  ShieldCheck
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

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

  const initials = user.name?.split(' ').map((n) => n[0]).join('').toUpperCase() || 'U';

  const stats = [
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
    <div className="min-h-screen bg-background pb-24">
      {/* Immersive Blue Header */}
      <div className="bg-primary pt-12 pb-24 rounded-b-[2.5rem] px-6 relative shadow-2xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-white/30 shadow-lg">
              <AvatarImage src={user.avatar_url || ''} alt={user.name || ''} className="object-cover" />
              <AvatarFallback className="bg-white/20 text-white font-bold">{initials}</AvatarFallback>
            </Avatar>
            <div className="text-white">
              <h1 className="text-xl font-bold leading-tight">{user.name || 'Anonymous'}</h1>
              <p className="text-sm opacity-80 font-medium">@{user.username || 'user'}</p>
            </div>
          </div>
          <div className="bg-white/10 p-3 rounded-full text-white backdrop-blur-md border border-white/10 hover:bg-white/20 transition-all cursor-pointer">
            <Bell className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Overlapping Balance Card */}
      <div className="px-6 -mt-16 max-w-xl mx-auto">
        <Card className="rounded-[2.5rem] border-none shadow-2xl overflow-hidden bg-white">
          <CardContent className="p-8 space-y-8">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-medium">Available Balance</span>
              <span className="text-3xl font-black tracking-tight">
                PKR {user.current_balance.toFixed(2)}
              </span>
            </div>
            
            <Separator className="bg-muted/50" />

            <div className="grid grid-cols-4 gap-4">
              <Link href="/withdraw" className="flex flex-col items-center gap-3 group">
                <div className="bg-muted/50 p-4 rounded-full group-hover:bg-primary/10 transition-colors">
                  <ArrowDownToLine className="h-6 w-6 text-foreground group-hover:text-primary transition-colors" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground group-hover:text-foreground">Withdraw</span>
              </Link>
              
              <Link href="/plans" className="flex flex-col items-center gap-3 group">
                <div className="bg-muted/50 p-4 rounded-full group-hover:bg-primary/10 transition-colors">
                  <Zap className="h-6 w-6 text-foreground group-hover:text-primary transition-colors" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground group-hover:text-foreground">Plans</span>
              </Link>

              <Link href="/referrals" className="flex flex-col items-center gap-3 group">
                <div className="bg-muted/50 p-4 rounded-full group-hover:bg-primary/10 transition-colors">
                  <Users className="h-6 w-6 text-foreground group-hover:text-primary transition-colors" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground group-hover:text-foreground">Referrals</span>
              </Link>

              <Link href="/guide" className="flex flex-col items-center gap-3 group">
                <div className="bg-muted/50 p-4 rounded-full group-hover:bg-primary/10 transition-colors">
                  <HelpCircle className="h-6 w-6 text-foreground group-hover:text-primary transition-colors" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground group-hover:text-foreground">Guide</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-6 mt-10 space-y-10">
        
        {/* Compact Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.title} className="border-none bg-card/50 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-[10px] font-black uppercase text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-primary/60" />
              </CardHeader>
              <CardContent>
                <p className="text-xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Identity Info */}
          <div className="space-y-8 lg:col-span-4">
            <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
              <div className="h-1 bg-primary" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-bold">
                  <Fingerprint className="h-5 w-5 text-primary" />
                  IDENTITY
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-1">
                  <p className="text-[9px] font-bold text-muted-foreground uppercase">Unique System ID</p>
                  <p className="break-all font-mono text-[10px] bg-muted/30 p-3 rounded-xl border text-muted-foreground select-all">
                    {user.id}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary/10 text-primary">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-muted-foreground uppercase leading-none">Email</p>
                      <p className="text-xs font-bold">{user.email || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-muted-foreground uppercase leading-none">Joined</p>
                      <p className="text-xs font-bold">
                        {user.plan_start ? new Date(user.plan_start).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'New Member'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-muted">
                  <div className="flex items-center gap-3 bg-green-500/5 p-3 rounded-2xl border border-green-500/10">
                    <ShieldCheck className="h-5 w-5 text-green-600" />
                    <div className="text-[10px] font-bold text-green-700 leading-tight uppercase">
                      Certified Partner <br/>
                      <span className="opacity-70 text-[8px]">FBR & PSEB Verified</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Form Settings */}
          <div className="lg:col-span-8">
            <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-muted/30">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-2xl font-bold">SETTINGS</CardTitle>
                    <CardDescription className="text-xs">Update your public presence</CardDescription>
                  </div>
                  <Settings className="h-5 w-5 text-primary opacity-50" />
                </div>
              </CardHeader>
              <CardContent className="pt-8">
                <ProfileForm user={user} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
