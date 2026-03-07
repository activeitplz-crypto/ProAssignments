
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
  Sparkles,
} from 'lucide-react';
import { redirect } from 'next/navigation';
import { RecentWithdrawals } from './recent-withdrawals';
import { DownloadAppCard } from './download-app-card';
import Link from 'next/link';
import { RamzanBanner } from './ramzan-banner';
import { BlogCard } from './blog-card';
import { HousewifeBlogCard } from './housewife-blog-card';
import { PartTimeBlogCard } from './part-time-blog-card';
import { MemberReviews } from './member-reviews';
import { FaqSection } from './faq-section';
import { cn } from '@/lib/utils';

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
    return <div className="p-8 text-center font-black uppercase tracking-widest text-destructive">User Context Sync Error</div>;
  }

  const quickNav = [
    { href: '/tasks', label: 'Tasks', icon: ClipboardList, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { href: '/assignments', label: 'Submit', icon: FileCheck2, color: 'text-green-500', bg: 'bg-green-500/10' },
    { href: '/plans', label: 'Plans', icon: Zap, color: 'text-primary', bg: 'bg-primary/10' },
    { href: '/withdraw', label: 'Withdraw', icon: ArrowDownToLine, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { href: '/profile', label: 'Profile', icon: UserIcon, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      
      {/* 1. Immersive Elite Header */}
      <div className="bg-primary pt-24 pb-20 px-6 relative rounded-b-[3.5rem] shadow-2xl overflow-hidden">
        {/* Decorative elements for elite feel */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-32 -mt-32 blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/5 rounded-full -ml-20 -mb-20 blur-3xl" />
        
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-white space-y-8 text-center">
            <div className="flex flex-col items-center gap-1">
                <span className="text-white/50 font-black uppercase text-[10px] tracking-[0.4em]">Hello!</span>
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none text-white drop-shadow-lg">
                    {user.name?.split(' ')[0]}
                </h1>
            </div>

            {/* Integrated Central Balance Display */}
            <div className="flex flex-col items-center space-y-2 py-4">
                <span className="text-white/60 font-black uppercase text-[10px] tracking-[0.4em] opacity-70">Available Balance</span>
                <div className="flex items-baseline gap-3">
                    <span className="text-xl font-bold text-white/60 italic">PKR</span>
                    <span className="text-6xl md:text-7xl font-black tracking-tighter text-white drop-shadow-2xl">
                    {Math.floor(user.current_balance).toLocaleString()}
                    </span>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Overlapping Content Command Center */}
      <div className="px-4 -mt-12 space-y-6 max-w-5xl mx-auto w-full pb-32 relative z-20">
        
        {/* 3. High-End Integrated Navigation & Stats */}
        <Card className="border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden border border-white/20">
            <CardContent className="p-0">
                {/* Upper: Live Statistics - Tightened Spacing */}
                <div className="px-8 pt-8 pb-4 border-b border-slate-50 bg-slate-50/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <div className="h-16 w-16 rounded-[1.5rem] bg-green-500/10 flex items-center justify-center shadow-inner">
                            <TrendingUp className="h-8 w-8 text-green-600" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">Today's Earning</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-xs font-bold text-green-600/60">PKR</span>
                                <p className="text-2xl font-black text-green-600 leading-none">{user.today_earning.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lower: Elite 5-Button Command Grid */}
                <div className="grid grid-cols-5 gap-2 px-4 py-6 md:px-8 md:py-8">
                    {quickNav.map((item) => (
                        <Link key={item.href} href={item.href} className="flex flex-col items-center justify-center gap-3 p-2 rounded-[2rem] transition-all duration-500 hover:bg-slate-50 active:scale-90 group">
                            <div className={cn(
                                "h-12 w-12 md:h-16 md:w-16 flex items-center justify-center rounded-[1.25rem] shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:shadow-xl",
                                item.bg
                            )}>
                                <item.icon className={cn("h-5 w-5 md:h-7 md:w-7 transition-transform duration-500 group-hover:rotate-12", item.color)} />
                            </div>
                            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-900 transition-colors text-center">{item.label}</span>
                        </Link>
                    ))}
                </div>
            </CardContent>
        </Card>
        
        {/* Elite Promo Area */}
        <RamzanBanner />

        {/* Dynamic Desktop Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Main Feed Column */}
          <div className="md:col-span-7 space-y-6">
            <RecentWithdrawals />
            <BlogCard />
            <HousewifeBlogCard />
            <PartTimeBlogCard />
            <MemberReviews />
            <FaqSection />
          </div>

          {/* Secondary Info Column */}
          <div className="md:col-span-5 space-y-6">
            <div className="md:sticky md:top-24 space-y-6">
                <DownloadAppCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
