import { createClient } from '@/lib/supabase/server';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { 
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { redirect } from 'next/navigation';
import { RecentWithdrawals } from './recent-withdrawals';
import { RecentPurchases } from './recent-purchases';
import { VideoTutorialCard } from './video-tutorial-card';
import { DownloadAppCard } from './download-app-card';
import Link from 'next/link';
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
      <div className="bg-primary pt-10 pb-20 px-6 relative rounded-b-[2.5rem] shadow-lg">
        <div className="max-w-4xl mx-auto">
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

        {/* 4. Earnings Stats & Quick Actions Summary */}
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
          
          <Link href="/withdraw" className="block">
            <Card className="border-none shadow-md rounded-3xl bg-white overflow-hidden group hover:translate-y-[-2px] transition-all cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Wallet className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Request</p>
                  <p className="text-sm font-black text-blue-600 uppercase">Withdraw</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <RecentPurchases />
            <RecentWithdrawals />
            <VideoTutorialCard />
          </div>
          <DownloadAppCard />
        </div>
      </div>
    </div>
  );
}
