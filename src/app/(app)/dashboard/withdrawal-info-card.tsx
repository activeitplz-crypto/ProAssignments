
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ShieldCheck, Zap, CheckCircle2 } from 'lucide-react';

export function WithdrawalInfoCard() {
  return (
    <Card className="border-none bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent shadow-xl rounded-[2rem] overflow-hidden border border-emerald-500/10">
      <CardContent className="p-8 space-y-6">
        <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <div className="space-y-0.5">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">Withdrawal Policy</span>
                <h3 className="text-xl font-black tracking-tighter uppercase italic text-slate-900 leading-none">Payout <span className="text-emerald-600">Guaranteed</span></h3>
            </div>
        </div>

        <div className="space-y-4">
            <div className="flex items-start gap-3">
                <div className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                <p className="text-[13px] font-black uppercase tracking-tight text-slate-700 leading-none">No referral is needed for withdrawal.</p>
            </div>
            <div className="flex items-start gap-3">
                <div className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                <p className="text-[13px] font-black uppercase tracking-tight text-slate-700 leading-none">You can withdraw without adding any member.</p>
            </div>
            <div className="flex items-start gap-3">
                <div className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                <p className="text-[13px] font-black uppercase tracking-tight text-slate-700 leading-none">Get 20% commission on your referral's activated plan.</p>
            </div>
        </div>

        <div className="pt-2">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/10">
                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-700 text-center">Verified Transparent Policy</span>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
