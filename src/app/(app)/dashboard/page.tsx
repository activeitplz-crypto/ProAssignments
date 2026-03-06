
import { createClient } from '@/lib/supabase/server';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { 
  Megaphone, 
  Bell, 
  Info, 
  Zap, 
  ClipboardList, 
  ArrowUpRight, 
  Users, 
  HelpCircle,
  TrendingUp,
  ArrowDownToLine,
  Eye,
  Wallet
} from 'lucide-react';
import { redirect } from 'next/navigation';
import { RecentWithdrawals } from './recent-withdrawals';
import { DownloadAppCard } from './download-app-card';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { RamzanBanner } from './ramzan-banner';

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { session }} = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const { data: user, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();
  
  if (error || !user) {
    return <div className="p-8 text-center">Could not load user data. Please try refreshing.</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 1. Immersive Blue Header Section */}
      <div className="bg-primary pt-4 pb-24 px-6 relative">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* User Info & Bell */}
          <div className="flex items-center justify-between">
            <div className="text-white">
              <h1 className="text-2xl font-bold tracking-tight">{user.name}</h1>
              <p className="text-sm opacity-70 font-medium">@{user.username || 'user'}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white backdrop-blur-md cursor-pointer border border-white/10 hover:bg-white/20 transition-all">
               <Bell className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Content Area with Overlapping Balance Card */}
      <div className="px-4 -mt-16 space-y-6 max-w-4xl mx-auto w-full pb-20">
        
        {/* Overlapping Balloon Balance Card */}
        <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
          <CardContent className="p-8 space-y-8">
            <div className="flex items-center justify-between">
              <p className="text-base font-semibold text-muted-foreground">My Balance</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black tracking-tighter">
                  PKR {Math.floor(user.current_balance).toLocaleString()}
                </span>
                <Eye className="h-4 w-4 text-muted-foreground/50" />
              </div>
            </div>
            
            <div className="h-px w-full bg-muted" />

            {/* Quick Action Grid - Balloon Style */}
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Tasks', icon: ClipboardList, href: '/tasks' },
                { label: 'Withdraw', icon: ArrowDownToLine, href: '/withdraw' },
                { label: 'Referrals', icon: Users, href: '/referrals' },
                { label: 'Guide', icon: HelpCircle, href: '/guide' },
              ].map((item) => (
                <Link key={item.label} href={item.href} className="flex flex-col items-center gap-3 group">
                  <div className="h-14 w-14 rounded-full bg-muted/50 flex items-center justify-center transition-all group-hover:bg-primary/10 group-active:scale-90 border border-transparent group-hover:border-primary/20">
                    <item.icon className="h-6 w-6 text-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <span className="text-[11px] font-bold text-center leading-tight">{item.label}</span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 3. Ramzan Offer Banner */}
        <RamzanBanner />

        {/* 4. Stats Summary */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-10 w-10 rounded-2xl bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Today</p>
                <p className="text-sm font-bold text-green-600">PKR {user.today_earning.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-10 w-10 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                <Wallet className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Lifetime</p>
                <p className="text-sm font-bold text-blue-600">PKR {user.total_earning.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 5. Statistics & News */}
        <div className="space-y-4">
          <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground px-2">Notice Board</h2>
          <Card className="border-none shadow-xl rounded-[2rem] overflow-hidden bg-white">
            <CardContent className="p-2 space-y-1">
              <div className="flex items-center gap-4 p-4 rounded-3xl hover:bg-muted/30 transition-colors">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Megaphone className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">System Update</p>
                    <p className="text-[10px] text-muted-foreground truncate">Explore our premium new interface.</p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-30" />
              </div>

              <div className="flex items-center gap-4 p-4 rounded-3xl hover:bg-muted/30 transition-colors">
                <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                    <Info className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">Fast Withdrawals</p>
                    <p className="text-[10px] text-muted-foreground truncate">All payments processed under 24h.</p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-30" />
              </div>

              <div className="flex items-center gap-4 p-4 rounded-3xl hover:bg-muted/30 transition-colors">
                <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                    <Zap className="h-5 w-5 text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">Handwriting Proof</p>
                    <p className="text-[10px] text-muted-foreground truncate">Ensure your assignment notes are clear.</p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-30" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RecentWithdrawals />
          <DownloadAppCard />
        </div>
      </div>
    </div>
  );
}
