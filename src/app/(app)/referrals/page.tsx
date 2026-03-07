import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users, CheckCircle, Gift, UserPlus, ArrowUpCircle } from 'lucide-react';
import type { Referral, Upline } from '@/lib/types';
import { format } from 'date-fns';
import { CopyButton } from './copy-button';
import { cn } from '@/lib/utils';

async function getUplineInfo(supabase: any, referrerId: string): Promise<Upline | null> {
    const { data: uplineProfile, error } = await supabase
        .from('profiles')
        .select('name, referral_code')
        .eq('id', referrerId)
        .single();
    
    if(error || !uplineProfile) {
        console.error('Could not fetch upline info:', error);
        return null;
    }

    return {
        name: uplineProfile.name || 'Anonymous',
        referral_code: uplineProfile.referral_code,
    }
}


export default async function ReferralsPage() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const { data: user, error: userError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (userError || !user) {
    return <div className="p-12 text-center font-black uppercase tracking-widest text-destructive">User Context Error</div>;
  }
  
  let uplineInfo: Upline | null = null;
  if (user.referred_by) {
    uplineInfo = await getUplineInfo(supabase, user.referred_by);
  }

  const { data: referrals, error: referralsError } = await supabase
    .from('profiles')
    .select('name, created_at, current_plan')
    .eq('referred_by', user.id)
    .order('created_at', { ascending: false });

  if (referralsError) {
    console.error('Error fetching referrals:', referralsError);
  }

  const referralLink = `${process.env.NEXT_PUBLIC_BASE_URL}/signup?ref=${user.referral_code}`;

  return (
    <div className="space-y-6">
      {uplineInfo && (
        <Card className="border-none shadow-xl rounded-[2rem] bg-white overflow-hidden">
            <CardHeader className="p-8 pb-4">
                <CardTitle className="font-black flex items-center gap-3 text-2xl tracking-tighter uppercase italic text-slate-900 leading-none">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <ArrowUpCircle className="h-6 w-6" />
                    </div>
                    My Upline
                </CardTitle>
                <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">The partner who introduced you to ProAssignment</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-4 grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-1">Upline Identity</p>
                    <p className="text-sm font-black text-slate-900 uppercase italic">{uplineInfo.name}</p>
                </div>
                 <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-1">Referral Code</p>
                    <p className="text-sm font-black text-slate-900 font-mono">{uplineInfo.referral_code}</p>
                </div>
            </CardContent>
        </Card>
      )}

      <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
        <CardHeader className="p-8 pb-4">
          <CardTitle className="font-black flex items-center gap-3 text-3xl tracking-tighter uppercase italic text-slate-900 leading-none">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Gift className="h-7 w-7" />
            </div>
            Referral Hub
          </CardTitle>
          <CardDescription className="text-xs font-medium uppercase tracking-widest text-muted-foreground pt-2">
            Share your link and earn 20% commission on activated plans.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-4 space-y-8">
          <div className="space-y-6 bg-slate-50 p-8 rounded-[2rem] border border-slate-100 shadow-inner">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 px-1">Network Gateway Link</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={referralLink}
                  className="flex h-14 w-full rounded-2xl border-none bg-white px-6 py-2 text-xs font-bold shadow-sm focus:ring-2 focus:ring-primary/20 transition-all truncate"
                />
                <CopyButton textToCopy={referralLink} />
              </div>
            </div>
             <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 px-1">Unique Identity Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={user.referral_code}
                  className="flex h-14 w-full rounded-2xl border-none bg-white px-6 py-2 text-sm font-black tracking-widest shadow-sm uppercase"
                />
                <CopyButton textToCopy={user.referral_code} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
             <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-lg flex flex-col items-center text-center gap-2">
                <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600 mb-2">
                    <Users className="h-5 w-5" />
                </div>
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Network Size</p>
                <div className="text-2xl font-black text-slate-900 leading-none">{referrals?.length || 0}</div>
             </div>
             <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-lg flex flex-col items-center text-center gap-2">
                <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-600 mb-2">
                    <CheckCircle className="h-5 w-5" />
                </div>
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Verified Partners</p>
                <div className="text-2xl font-black text-slate-900 leading-none">
                    {(referrals as Referral[])?.filter(r => r.current_plan).length || 0}
                </div>
             </div>
             <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-lg flex flex-col items-center text-center gap-2">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-2">
                    <Gift className="h-5 w-5" />
                </div>
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Network Bonus</p>
                <div className="text-2xl font-black text-primary italic leading-none">PKR {user.referral_bonus.toFixed(2)}</div>
             </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center gap-2 px-2">
            <UserPlus className="h-4 w-4 text-primary opacity-40" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Network History</h3>
        </div>
        <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="border-slate-50">
                  <TableHead className="px-8 h-14 text-[10px] font-black uppercase tracking-widest">Partner Name</TableHead>
                  <TableHead className="h-14 text-[10px] font-black uppercase tracking-widest">Joined Date</TableHead>
                  <TableHead className="px-8 h-14 text-right text-[10px] font-black uppercase tracking-widest">Plan Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {referrals && referrals.length > 0 ? (
                  (referrals as Referral[]).map((ref, index) => (
                    <TableRow key={index} className="border-slate-50 hover:bg-slate-50/30 transition-colors">
                      <TableCell className="px-8 py-6">
                        <span className="text-sm font-black text-slate-900 uppercase italic tracking-tight">{ref.name || 'Anonymous User'}</span>
                      </TableCell>
                      <TableCell className="py-6">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">{format(new Date(ref.created_at), 'MMM dd, yyyy')}</span>
                      </TableCell>
                      <TableCell className="px-8 py-6 text-right">
                        <Badge
                          variant={ref.current_plan ? 'default' : 'secondary'}
                          className={cn(
                            "text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full",
                            ref.current_plan ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-400'
                          )}
                        >
                          {ref.current_plan ? 'Verified' : 'Unverified'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="h-48 text-center">
                      <div className="flex flex-col items-center gap-3 opacity-20">
                        <Users className="h-8 w-8" />
                        <p className="text-[10px] font-black uppercase tracking-widest">No network partners found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}