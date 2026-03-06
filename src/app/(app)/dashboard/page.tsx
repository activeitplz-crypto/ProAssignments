
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
      <div className="bg-primary pt-6 pb-24 px-6 relative rounded-b-[2.5rem] shadow-lg">
        <div className="max-w-4xl mx-auto">
          {/* Top Bar with Notification Bell only - Logo is in global header */}
          <div className="flex items-center justify-end text-white mb-8">
            <div className="h-11 w-11 rounded-full bg-white/10 flex items-center justify-center text-white backdrop-blur-md cursor-pointer border border-white/10 hover:bg-white/20 transition-all shadow-inner">
               <Bell className="h-5 w-5" />
            </div>
          </div>

          <div className="text-white space-y-8 text-center">
            <div className="space-y-1">
                <h1 className="text-3xl font-black tracking-tighter uppercase italic">Hello, {user.name?.split(' ')[0]}</h1>
                <p className="text-[10px] opacity-70 font-black uppercase tracking-[0.3em]">Work Command Center</p>
            </div>

            {/* Integrated Balance Display (as in Profile) */}
            <div className="flex flex-col items-center space-y-3 py-4">
                <span className="text-white/60 font-bold uppercase text-[10px] tracking-[0.3em]">Total Available Balance</span>
                <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-white/80">PKR</span>
                    <span className="text-6xl font-black tracking-tighter text-white">
                    {Math.floor(user.current_balance).toLocaleString()}
                    </span>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Overlapping Content Area */}
      <div className="px-4 -mt-16 space-y-6 max-w-4xl mx-auto w-full pb-24 relative z-20">
        
        {/* 3. Promo Banner Section - Now Overlapping instead of the Balance Card */}
        <RamzanBanner />

        {/* 4. Earnings Stats Summary */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="border-none shadow-xl rounded-[2rem] bg-white overflow-hidden group hover:translate-y-[-2px] transition-all">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Today</p>
                <p className="text-base font-black text-green-600">PKR {user.today_earning.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-xl rounded-[2rem] bg-white overflow-hidden group hover:translate-y-[-2px] transition-all">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                <Wallet className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Lifetime</p>
                <p className="text-base font-black text-blue-600">PKR {user.total_earning.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 5. Notice Board (Styled like Recently Booked) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground">Notice Board</h2>
            <Link href="/guide" className="text-[11px] font-black text-primary uppercase border-b-2 border-primary/20 hover:border-primary transition-all">See All</Link>
          </div>
          
          <div className="space-y-3">
            {[
              { title: 'System Update', desc: 'Experience our ultra-modern interface.', icon: Megaphone, color: 'bg-indigo-50 text-indigo-600' },
              { title: 'Fast Withdrawals', desc: 'All payments processed within 24h.', icon: Zap, color: 'bg-amber-50 text-amber-600' },
              { title: 'Identity Verification', desc: 'PSEB & FBR registered platform.', icon: Info, color: 'bg-emerald-50 text-emerald-600' },
            ].map((news, i) => (
              <Card key={i} className="border-none shadow-md rounded-[1.8rem] bg-white overflow-hidden hover:shadow-xl hover:translate-x-1 transition-all cursor-pointer group">
                <CardContent className="p-5 flex items-center gap-5">
                  <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm", news.color)}>
                    <news.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-sm text-foreground uppercase tracking-tight group-hover:text-primary transition-colors">{news.title}</p>
                    <p className="text-[11px] text-muted-foreground font-bold mt-0.5">{news.desc}</p>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-muted/30 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-all" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RecentWithdrawals />
          <DownloadAppCard />
        </div>
      </div>
    </div>
  );
}
