
import { createClient } from '@/lib/supabase/server';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { 
  TrendingUp,
  Zap,
  ArrowDownToLine,
  ClipboardList,
  FileCheck2,
  User as UserIcon,
} from 'lucide-react';
import { redirect } from 'next/navigation';
import { RecentWithdrawals } from './recent-withdrawals';
import { VideoTutorialCard } from './video-tutorial-card';
import { DownloadAppCard } from './download-app-card';
import Link from 'next/link';
import { RamzanBanner } from './ramzan-banner';
import { BlogCard } from './blog-card';
import { HousewifeBlogCard } from './housewife-blog-card';
import { PartTimeBlogCard } from './part-time-blog-card';
import { MemberReviews } from './member-reviews';
import { WithdrawalInfoCard } from './withdrawal-info-card';

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

  // Fetch the latest tutorial video for direct playback
  const { data: latestVideo } = await supabase
    .from('videos')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const quickNav = [
    { href: '/tasks', label: 'Tasks', icon: ClipboardList, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { href: '/assignments', label: 'Submit', icon: FileCheck2, color: 'text-green-500', bg: 'bg-green-500/10' },
    { href: '/plans', label: 'Plans', icon: Zap, color: 'text-primary', bg: 'bg-primary/10' },
    { href: '/withdraw', label: 'Withdraw', icon: ArrowDownToLine, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { href: '/profile', label: 'Profile', icon: UserIcon, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      
      {/* 1. Immersive Blue Header Section */}
      <div className="bg-primary pt-20 pb-20 px-6 relative rounded-b-[2.5rem] shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="text-white space-y-6 text-center">
            <div className="space-y-1">
                <h1 className="text-2xl font-black tracking-tighter uppercase italic">Hello, {user.name?.split(' ')[0]}</h1>
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
        
        {/* 3. New Integrated Navigation & Today Stats Card */}
        <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
            <CardContent className="p-0">
                {/* Upper: Today's Earning Stat */}
                <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-green-500/10 flex items-center justify-center">
                            <TrendingUp className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Today's Revenue</p>
                            <p className="text-xl font-black text-green-600">PKR {user.today_earning.toFixed(2)}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="bg-green-500/10 text-green-600 text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full">Active Now</span>
                    </div>
                </div>

                {/* Lower: 5-Button Navigation Grid */}
                <div className="grid grid-cols-5 gap-1 p-4">
                    {quickNav.map((item) => (
                        <Link key={item.href} href={item.href} className="flex flex-col items-center justify-center gap-2 p-2 rounded-2xl transition-all hover:bg-slate-50 active:scale-90">
                            <div className={`h-12 w-12 ${item.bg} flex items-center justify-center rounded-2xl shadow-sm`}>
                                <item.icon className={`h-5 w-5 ${item.color}`} />
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-tight text-slate-600">{item.label}</span>
                        </Link>
                    ))}
                </div>
            </CardContent>
        </Card>
        
        <RamzanBanner />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <RecentWithdrawals />
            <VideoTutorialCard video={latestVideo} />
            <WithdrawalInfoCard />
            <BlogCard />
            <HousewifeBlogCard />
            <PartTimeBlogCard />
            <MemberReviews />
          </div>
          <div className="space-y-4">
            <DownloadAppCard />
          </div>
        </div>
      </div>
    </div>
  );
}
