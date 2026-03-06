
import { createClient } from '@/lib/supabase/server';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { UserProfileCard } from '@/components/user-profile-card';
import { Wallet, Video, Megaphone, Bell } from 'lucide-react';
import { redirect } from 'next/navigation';
import { RecentWithdrawals } from './recent-withdrawals';
import { OfferBanner } from './offer-banner';
import { DownloadAppCard } from './download-app-card';

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
    <div className="flex flex-col gap-6">
      <UserProfileCard name={userData.name} username={userData.username} avatarUrl={userData.avatarUrl} />
      
      {!hasPlan && <OfferBanner />}

      {/* Main Balance Card - Keep user motivated on Home */}
      <Card className="bg-primary text-primary-foreground overflow-hidden relative border-none shadow-xl">
        <div className="absolute top-0 right-0 p-4 opacity-10">
            <Wallet className="h-24 w-24" />
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium opacity-90 flex items-center gap-2">
            <Wallet className="h-4 w-4" /> Available Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">
            PKR {userData.current_balance.toFixed(2)}
          </p>
          <p className="text-xs mt-2 opacity-80">
            {hasPlan ? `Plan: ${userData.active_plan}` : "Purchase a plan to start earning"}
          </p>
        </CardContent>
      </Card>

      {/* Notice Board / Announcements */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Megaphone className="h-6 w-6 text-primary" />
            Notice Board
          </CardTitle>
          <CardDescription>Important updates and daily work instructions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 p-3 rounded-lg bg-muted/50 border">
            <Bell className="h-5 w-5 text-primary shrink-0 mt-1" />
            <div className="space-y-1">
                <p className="font-semibold text-sm">Welcome to ProAssignment!</p>
                <p className="text-sm text-muted-foreground">Complete your daily assignments to earn PKR based on your selected plan. Remember to upload clear images of your work.</p>
            </div>
          </div>
          <div className="flex gap-4 p-3 rounded-lg bg-muted/50 border">
            <Bell className="h-5 w-5 text-primary shrink-0 mt-1" />
            <div className="space-y-1">
                <p className="font-semibold text-sm">Withdrawal Policy</p>
                <p className="text-sm text-muted-foreground">Withdrawals are processed within 24 hours. The minimum withdrawal limit is PKR 700.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <RecentWithdrawals />

      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Video className="h-6 w-6 text-primary" />
            Tutorial Video
          </CardTitle>
          <CardDescription>
            Watch this video to understand how to complete and submit your assignments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="aspect-video overflow-hidden rounded-lg border">
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

      <DownloadAppCard />
    </div>
  );
}
