
import { createClient } from '@/lib/supabase/server';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { WithdrawForm } from './withdraw-form';
import { redirect } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import type { Withdrawal } from '@/lib/types';
import { Wallet, Clock, CheckCircle, Info, Sparkles, ArrowDownToLine, History } from 'lucide-react';
import { cn } from '@/lib/utils';

export default async function WithdrawPage() {
  const supabase = createClient();
  const { data: { session }} = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const { data: user, error: userError } = await supabase
    .from('profiles')
    .select('current_balance')
    .eq('id', session.user.id)
    .single();
  
  const { data: withdrawals, error: withdrawalsError } = await supabase
    .from('withdrawals')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false });

  if (userError || !user) {
    return <div className="p-12 text-center font-black uppercase tracking-widest text-destructive">User Context Sync Error</div>;
  }
   if (withdrawalsError) {
    console.error('Error fetching withdrawals:', withdrawalsError);
  }

  const availableBalance = user.current_balance;

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      {/* 1. Immersive Financial Header */}
      <div className="bg-primary pt-16 pb-20 px-6 relative rounded-b-[2.5rem] shadow-lg overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <div className="flex items-center justify-center gap-2">
              <span className="text-white/60 font-black uppercase text-[10px] tracking-[0.3em]">Capital Hub</span>
              <Sparkles className="h-3 w-3 text-yellow-400/60" />
          </div>
          
          <div className="space-y-2">
            <span className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">Available for Payout</span>
            <div className="flex items-baseline justify-center gap-2">
                <span className="text-xl font-bold text-white/60">PKR</span>
                <h1 className="text-6xl font-black tracking-tighter text-white leading-none italic">
                    {Math.floor(availableBalance).toLocaleString()}
                </h1>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
              <Info className="h-3 w-3 text-white/70" />
              <span className="text-[9px] font-bold text-white/90 uppercase tracking-widest">Min. Withdrawal: PKR 700</span>
          </div>
        </div>
      </div>

      {/* 2. Overlapping Page Content */}
      <div className="px-4 -mt-10 space-y-8 max-w-4xl mx-auto w-full pb-24 relative z-20">
        
        {/* Request Card */}
        <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex items-center gap-5">
            <div className="h-14 w-14 rounded-[1.5rem] bg-primary/5 flex items-center justify-center border border-primary/10">
                <ArrowDownToLine className="h-7 w-7 text-primary" />
            </div>
            <div className="space-y-1">
                <div className="flex items-center gap-2">
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-primary/60">Payout Gateway</span>
                </div>
                <h3 className="font-black text-slate-900 uppercase tracking-tighter text-xl leading-none">Request Withdrawal</h3>
            </div>
          </div>
          <CardContent className="p-8 lg:p-12">
            <WithdrawForm currentBalance={availableBalance} canWithdraw={true} />
          </CardContent>
        </Card>

        {/* History Section */}
        <div className="space-y-4">
            <div className="flex items-center gap-2 px-2">
                <History className="h-4 w-4 text-primary opacity-40" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Capital History</h3>
            </div>
            <WithdrawalHistory withdrawals={withdrawals || []} />
        </div>
      </div>
    </div>
  );
}

function WithdrawalHistory({ withdrawals }: { withdrawals: Withdrawal[] }) {
  return (
    <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="border-slate-50">
              <TableHead className="px-8 text-[10px] font-black uppercase tracking-widest h-14">Amount</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest h-14">Account</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest h-14">Date</TableHead>
              <TableHead className="px-8 text-[10px] font-black uppercase tracking-widest h-14 text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {withdrawals.length > 0 ? (
              withdrawals.map((w) => (
                <TableRow key={w.id} className="border-slate-50 hover:bg-slate-50/30 transition-colors">
                  <TableCell className="px-8 py-6">
                    <span className="text-sm font-black text-slate-900 tracking-tight">PKR {w.amount.toLocaleString()}</span>
                  </TableCell>
                  <TableCell className="py-6">
                    <div className="space-y-0.5">
                        <p className="text-[10px] font-bold text-slate-900 uppercase leading-none">{w.account_info.bank_name}</p>
                        <p className="text-[10px] font-medium text-muted-foreground font-mono">{w.account_info.account_number}</p>
                    </div>
                  </TableCell>
                  <TableCell className="py-6">
                    <p className="text-[10px] font-bold text-slate-500 uppercase">{format(new Date(w.created_at), 'MMM dd, yyyy')}</p>
                  </TableCell>
                  <TableCell className="px-8 py-6 text-right">
                     <Badge
                      variant="secondary"
                      className={cn(
                        "text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full",
                        w.status === 'approved' && 'bg-green-500/10 text-green-600 border border-green-500/10',
                        w.status === 'rejected' && 'bg-red-500/10 text-red-600 border border-red-500/10',
                        w.status === 'pending' && 'bg-orange-500/10 text-orange-600 border border-orange-500/10'
                      )}
                    >
                      {w.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-48 text-center">
                  <div className="flex flex-col items-center gap-3 opacity-20">
                    <Wallet className="h-8 w-8" />
                    <p className="text-[10px] font-black uppercase tracking-widest">No payout history found</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
