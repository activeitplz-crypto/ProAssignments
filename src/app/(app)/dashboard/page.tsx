
import { createClient } from '@/lib/supabase/server';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { 
  Megaphone, 
  Bell, 
  Info, 
  Zap, 
  ArrowUpRight, 
  TrendingUp,
  Wallet,
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
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      
      {/* 1. Immersive Blue Header Section */}
      <div className="bg-primary pt-6 pb-20 px-6 relative rounded-b-[2.5rem] shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-end text-white mb-6">
            <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white backdrop-blur-md cursor-pointer border border-white/10 hover:bg-white/20 transition-all shadow-inner">
               <Bell className="h-5 w-5" />
            </div>
          </div>

          <div className="text-white space-y-6 text-center">
            <div className="space-y-1">
                <h1 className="text-2xl font-black tracking-tighter uppercase italic">Hello, {user.name?.split(' ')[0]}</h1>
                <p className="text-[9px] opacity-70 font-black uppercase tracking-[0.3em]">Work Command Center</p>
            </div>

            {/* Integrated Balance Display */}
            <div className="flex flex-col items-center space-y-2 py-2">
                <span className="text-white/60 font-bold uppercase text-[9px] tracking-[0.3em]">Available Balance</span>
                <div className="flex items-baseline gap-2">
                    <span className="text-sm font-bold text-white/80">PKR</span>
                    <span className="text-5xl font-black tracking-tighter text-white">
                    {Math.floor(user.current_balance).toLocaleString()}
                    </span>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Overlapping Content Area */}
      <div className="px-4 -mt-12 space-y-5 max-w-4xl mx-auto w-full pb-24 relative z-20">
        
        <RamzanBanner />

        {/* 4. Earnings Stats Summary */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="border-none shadow-md rounded-3xl bg-white overflow-hidden group hover:translate-y-[-2px] transition-all">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Today</p>
                <p className="text-sm font-black text-green-600">PKR {user.today_earning.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-md rounded-3xl bg-white overflow-hidden group hover:translate-y-[-2px] transition-all">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Wallet className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Lifetime</p>
                <p className="text-sm font-black text-blue-600">PKR {user.total_earning.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 5. Notice Board */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Notice Board</h2>
            <Link href="/guide" className="text-[10px] font-black text-primary uppercase border-b border-primary/20 hover:border-primary transition-all">See All</Link>
          </div>
          
          <div className="space-y-2">
            {[
              { title: 'System Update', desc: 'New ultra-modern interface.', icon: Megaphone, color: 'bg-indigo-50 text-indigo-600' },
              { title: 'Fast Withdrawals', desc: 'Payments processed within 24h.', icon: Zap, color: 'bg-amber-50 text-amber-600' },
              { title: 'Identity Verification', desc: 'PSEB & FBR registered.', icon: Info, color: 'bg-emerald-50 text-emerald-600' },
            ].map((news, i) => (
              <Card key={i} className="border-none shadow-sm rounded-2xl bg-white overflow-hidden hover:shadow-md hover:translate-x-1 transition-all cursor-pointer group">
                <CardContent className="p-3.5 flex items-center gap-4">
                  <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm", news.color)}>
                    <news.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-xs text-foreground uppercase tracking-tight group-hover:text-primary transition-colors">{news.title}</p>
                    <p className="text-[10px] text-muted-foreground font-bold mt-0.5">{news.desc}</p>
                  </div>
                  <div className="h-7 w-7 rounded-full bg-muted/30 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <ArrowUpRight className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-all" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RecentWithdrawals />
          <DownloadAppCard />
        </div>
      </div>
    </div>
  );
}
