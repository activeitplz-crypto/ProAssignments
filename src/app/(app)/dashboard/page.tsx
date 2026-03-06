
import { createClient } from '@/lib/supabase/server';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { 
  Wallet, 
  Video, 
  Megaphone, 
  Bell, 
  Info, 
  ShieldCheck, 
  Zap, 
  ClipboardList, 
  ArrowUpRight, 
  Users, 
  HelpCircle,
  TrendingUp,
  ArrowDownToLine,
  Eye
} from 'lucide-react';
import { redirect } from 'next/navigation';
import { RecentWithdrawals } from './recent-withdrawals';
import { OfferBanner } from './offer-banner';
import { DownloadAppCard } from './download-app-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
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
    return <div className="p-8 text-center">Could not load user data. Please try refreshing.</div>;
  }
  
  const firstName = user.name?.split(' ')[0] || 'User';
  const initials = user.name?.split(' ').map((n) => n[0]).join('').toUpperCase() || 'U';

  const hasPlan = !!user.current_plan;

  // Helper for greeting based on time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto pb-10">
      
      {/* Top Greeting Section */}
      <div className="flex items-center justify-between px-2 mb-2">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 border-2 border-primary/10 shadow-sm">
            <AvatarImage src={user.avatar_url || ''} alt={user.name || ''} className="object-cover" />
            <AvatarFallback className="bg-primary/10 text-primary font-bold">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-xs text-muted-foreground font-medium">{greeting}</p>
            <h1 className="text-xl font-bold tracking-tight">{user.name}</h1>
          </div>
        </div>
        <div className="h-10 w-10 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground">
           <Bell className="h-5 w-5" />
        </div>
      </div>

      {!hasPlan && <OfferBanner />}

      {/* Main Balance Card - Styled like DNBC */}
      <div className="relative group">
        <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-[2rem] -z-10 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
        <Card className="border-none shadow-2xl bg-gradient-to-br from-primary via-blue-500 to-blue-600 text-primary-foreground rounded-[2rem] overflow-hidden">
          <div className="p-1 flex">
            <div className="flex-1 bg-white/10 backdrop-blur-md py-3 text-center text-xs font-bold uppercase tracking-wider rounded-tl-[1.8rem] rounded-tr-[0.5rem] border-b-2 border-white/20">
              Business
            </div>
            <div className="flex-1 py-3 text-center text-xs font-bold uppercase tracking-wider opacity-50">
              Personal
            </div>
          </div>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-70">Active Plan</p>
              <h3 className="text-xl font-bold tracking-tight">{user.current_plan || "No Active Plan"}</h3>
            </div>
            
            <div className="h-px w-full bg-white/10" />

            <div className="flex items-end justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-70">Available Balance</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold opacity-80">PKR</span>
                  <span className="text-4xl font-black tracking-tighter">
                    {Math.floor(user.current_balance).toLocaleString()}
                  </span>
                  <Eye className="h-4 w-4 ml-2 opacity-50 cursor-pointer" />
                </div>
              </div>
              <Link href="/withdraw" className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-full backdrop-blur-md">
                Withdrawal <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Summary - Incoming/Outgoing Style */}
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
              <ArrowDownToLine className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Lifetime</p>
              <p className="text-sm font-bold text-blue-600">PKR {user.total_earning.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Favorite Functions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Favorite functions</h2>
          <button className="text-[10px] font-bold text-primary flex items-center gap-1 uppercase tracking-tighter">
            Customize <Zap className="h-3 w-3" />
          </button>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'Daily Tasks', icon: ClipboardList, href: '/tasks', color: 'text-blue-500', bg: 'bg-blue-50' },
            { label: 'Withdraw', icon: ArrowDownToLine, href: '/withdraw', color: 'text-orange-500', bg: 'bg-orange-50' },
            { label: 'Referrals', icon: Users, href: '/referrals', color: 'text-purple-500', bg: 'bg-purple-50' },
            { label: 'Guide', icon: HelpCircle, href: '/guide', color: 'text-cyan-500', bg: 'bg-cyan-50' },
          ].map((item) => (
            <Link key={item.label} href={item.href} className="flex flex-col items-center gap-2 group">
              <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center transition-all group-hover:scale-105 group-active:scale-95 shadow-sm border border-black/5", item.bg)}>
                <item.icon className={cn("h-6 w-6", item.color)} />
              </div>
              <span className="text-[10px] font-bold text-center leading-tight px-1">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Notice Board - Statistics Style */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Statistics & News</h2>
        </div>
        <Card className="border-none shadow-xl rounded-[2rem] overflow-hidden bg-white">
          <CardContent className="p-2 space-y-1">
            <div className="flex items-center gap-4 p-4 rounded-3xl hover:bg-muted/30 transition-colors">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Megaphone className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">Welcome Update</p>
                  <p className="text-[10px] text-muted-foreground truncate">Explore the new dashboard interface.</p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-30" />
            </div>

            <div className="flex items-center gap-4 p-4 rounded-3xl hover:bg-muted/30 transition-colors">
              <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                  <Info className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">Withdrawal Schedule</p>
                  <p className="text-[10px] text-muted-foreground truncate">Requests processed within 24 hours.</p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-30" />
            </div>

            <div className="flex items-center gap-4 p-4 rounded-3xl hover:bg-muted/30 transition-colors">
              <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                  <Zap className="h-5 w-5 text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">Task Instruction</p>
                  <p className="text-[10px] text-muted-foreground truncate">Ensure handwritten notes are clear.</p>
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

      {/* Tutorial Video Section */}
      <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white mt-4">
        <div className="p-6 pb-4 border-b border-muted flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-red-500/10 flex items-center justify-center">
              <Video className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <CardTitle className="text-base font-bold uppercase tracking-tight">Platform Tutorial</CardTitle>
              <CardDescription className="text-[10px] uppercase font-bold text-muted-foreground">Learn how to work</CardDescription>
            </div>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-inner border border-muted">
            <iframe
              src="https://www.youtube.com/embed/GGu-mLeZg4U?autoplay=1&mute=1&rel=0&modestbranding=1"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="h-full w-full"
            ></iframe>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
