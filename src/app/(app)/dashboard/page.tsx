
import { createClient } from '@/lib/supabase/server';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { UserProfileCard } from '@/components/user-profile-card';
import { Wallet, Video, Megaphone, Bell, Info, ShieldCheck, Zap } from 'lucide-react';
import { redirect } from 'next/navigation';
import { RecentWithdrawals } from './recent-withdrawals';
import { OfferBanner } from './offer-banner';
import { DownloadAppCard } from './download-app-card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
    return <div>Could not load user data. Please try refreshing.</div>;
  }
  
  const userData = {
    name: user.name || 'Anonymous',
    username: user.username || 'anonymous',
    avatarUrl: user.avatar_url,
    current_balance: user.current_balance,
    active_plan: user.current_plan,
  };

  const hasPlan = !!user.current_plan;

  return (
    <div className="flex flex-col gap-8">
      {/* Dynamic User Welcome */}
      <UserProfileCard name={userData.name} username={userData.username} avatarUrl={userData.avatarUrl} />
      
      {!hasPlan && <OfferBanner />}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Balance Motivation - Left Side on Desktop */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-gradient-to-br from-primary via-blue-600 to-indigo-700 text-primary-foreground overflow-hidden relative border-none shadow-2xl h-full min-h-[200px] flex flex-col justify-center">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Wallet className="h-32 w-32 rotate-12" />
            </div>
            <CardHeader className="pb-2 relative z-10">
              <CardTitle className="text-xs font-bold uppercase tracking-widest opacity-80 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" /> Secure Balance
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex items-baseline gap-2">
                <span className="text-lg opacity-70">PKR</span>
                <p className="text-5xl font-black tracking-tighter">
                  {Math.floor(userData.current_balance).toLocaleString()}
                </p>
              </div>
              <p className="text-xs mt-4 font-medium py-1 px-3 bg-white/10 rounded-full inline-block backdrop-blur-md">
                {hasPlan ? `Active: ${userData.active_plan}` : "No Active Plan"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Notice Board - Center/Right Side on Desktop */}
        <div className="lg:col-span-2">
          <Card className="border-none shadow-xl bg-card overflow-hidden h-full">
            <div className="bg-primary/5 border-b p-4 flex items-center justify-between">
               <div className="flex items-center gap-2 text-primary font-bold">
                  <Megaphone className="h-5 w-5" />
                  <span>DAILY NOTICE BOARD</span>
               </div>
               <span className="text-[10px] font-bold text-muted-foreground uppercase">Updated: Today</span>
            </div>
            <CardContent className="p-6 space-y-4">
              <div className="flex gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Bell className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-1">
                    <p className="font-bold text-sm">Welcome to the New Interface!</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">We've updated our dashboard to give you a smoother experience. Complete your assignments daily to ensure consistent growth.</p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-2xl bg-green-500/5 border border-green-500/10 hover:bg-green-500/10 transition-colors">
                <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                    <Info className="h-5 w-5 text-green-600" />
                </div>
                <div className="space-y-1">
                    <p className="font-bold text-sm text-green-800">Withdrawal Schedule</p>
                    <p className="text-xs text-green-700/80 leading-relaxed">Requests submitted today will be processed within 24 hours. Minimum limit remains PKR 700. Thank you for your trust.</p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 hover:bg-amber-500/10 transition-colors">
                <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                    <Zap className="h-5 w-5 text-amber-600" />
                </div>
                <div className="space-y-1">
                    <p className="font-bold text-sm text-amber-800">Task Instruction</p>
                    <p className="text-xs text-amber-700/80 leading-relaxed">Ensure your handwritten assignments are clear and the title matches exactly. AI verification requires readable images.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentWithdrawals />
        <DownloadAppCard />
      </div>

      <Card className="border-none shadow-xl overflow-hidden bg-card">
        <CardHeader className="bg-primary/5 border-b">
          <CardTitle className="font-bold text-base flex items-center gap-2">
            <Video className="h-5 w-5 text-primary" />
            PLATFORM TUTORIAL
          </CardTitle>
          <CardDescription className="text-xs">
            New here? Watch this short video to master the assignment submission process.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="aspect-video w-full">
            <iframe
              src="https://www.youtube.com/embed/GGu-mLeZg4U?autoplay=1&mute=1&rel=0"
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
