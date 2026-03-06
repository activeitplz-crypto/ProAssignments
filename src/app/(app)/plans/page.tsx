
import { createClient } from '@/lib/supabase/server';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Zap, ClipboardList, Clock, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import type { Plan, Payment } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { purchasePlan } from './actions';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { OfferCountdown } from './offer-countdown';

export default async function PlansPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('profiles')
    .select('current_plan')
    .eq('id', user?.id || '')
    .single();

  const { data: plans, error: plansError } = await supabase.from('plans').select('*').order('investment', { ascending: true });
  const { data: payments, error: paymentsError } = await supabase
    .from('payments')
    .select('*, plans(name)')
    .eq('user_id', user?.id || '')
    .order('created_at', { ascending: false });

  if (plansError) {
    console.error('Error fetching plans:', plansError);
    return <div className="p-12 text-center font-black uppercase tracking-widest text-destructive">Plan Sync Error</div>
  }

  const pendingPayments = new Map<string, boolean>();
  (payments as Payment[] || []).forEach(p => {
    if (p.status === 'pending' && p.plan_id) {
      pendingPayments.set(p.plan_id, true);
    }
  });
  
  const activePlanName = profile?.current_plan;

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      {/* 1. Immersive Header */}
      <div className="bg-primary pt-16 pb-24 px-6 relative rounded-b-[3.5rem] shadow-lg overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="max-w-6xl mx-auto text-center relative z-10 space-y-4">
          <div className="flex items-center justify-center gap-2">
              <span className="text-white/60 font-black uppercase text-[10px] tracking-[0.3em]">Capital Growth</span>
              <Sparkles className="h-3 w-3 text-yellow-400/60" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic text-white leading-none">
            Investment <span className="text-white/80">Plans</span>
          </h1>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] max-w-xs mx-auto">Select a certified plan to maximize your daily earning</p>
        </div>
      </div>

      {/* 2. Overlapping Plans Grid */}
      <div className="px-4 -mt-12 space-y-12 max-w-7xl mx-auto w-full pb-32 relative z-20">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {(plans as Plan[]).map((plan) => {
            const isPending = pendingPayments.has(plan.id);
            const isActive = activePlanName === plan.name;

            const isOfferValid = plan.offer_expires_at ? new Date(plan.offer_expires_at) > new Date() : false;
            const isOffer = plan.original_investment && plan.original_investment > plan.investment && isOfferValid;
            
            const displayPrice = isOffer ? plan.investment : (plan.original_investment || plan.investment);
            const originalPriceToShow = isOffer ? plan.original_investment : null;

            return (
                <div key={plan.id} className="flex flex-col group h-full">
                {isOffer && plan.offer_expires_at && <OfferCountdown expiresAt={plan.offer_expires_at} />}
                <Card className={cn(
                    "flex flex-col flex-1 border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden transition-all duration-500 hover:translate-y-[-8px] hover:shadow-2xl relative",
                    isOffer ? "ring-2 ring-primary/20" : "",
                    isOffer && plan.offer_expires_at ? "rounded-t-none" : ""
                )}>
                    {/* Visual Decor */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
                    
                    <CardHeader className="p-8 pb-4 relative z-10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="h-10 w-10 rounded-2xl bg-primary/5 flex items-center justify-center">
                            <Zap className={cn("h-5 w-5", isOffer ? "text-primary" : "text-slate-400")} />
                        </div>
                        {isOffer && (
                            <Badge className="bg-primary text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full animate-pulse">
                                {plan.offer_name || 'HOT OFFER'}
                            </Badge>
                        )}
                    </div>
                    <CardTitle className="text-2xl font-black tracking-tighter uppercase italic text-slate-900">{plan.name}</CardTitle>
                    <div className="space-y-1 pt-4">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Required Investment</p>
                        <div className="flex items-baseline gap-2">
                            {originalPriceToShow && (
                                <del className="text-sm font-bold text-muted-foreground/40 italic">
                                PKR {originalPriceToShow}
                                </del>
                            )}
                            <div className="flex items-baseline gap-1">
                                <span className="text-xs font-bold text-primary/60 italic">PKR</span>
                                <span className="text-4xl font-black tracking-tighter text-primary">{displayPrice.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                    </CardHeader>

                    <CardContent className="px-8 pb-8 pt-4 flex-1 space-y-4 relative z-10">
                        <div className="h-px bg-slate-50 w-full mb-6" />
                        <div className="flex items-center gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50 transition-colors group-hover:bg-white group-hover:border-slate-200">
                            <div className="h-8 w-8 rounded-xl bg-green-500/10 flex items-center justify-center">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                                <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Daily Earning</p>
                                <p className="text-sm font-black text-slate-900 italic leading-none">PKR {plan.daily_earning.toFixed(2)}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50 transition-colors group-hover:bg-white group-hover:border-slate-200">
                            <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
                                <ClipboardList className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Assignment</p>
                                <p className="text-sm font-black text-slate-900 italic leading-none">{plan.daily_assignments} Assignment</p>
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="p-8 pt-0 relative z-10">
                    {isActive ? (
                        <div className="w-full h-14 rounded-2xl bg-green-500 text-white flex items-center justify-center gap-2 shadow-lg shadow-green-500/20">
                            <ShieldCheck className="h-5 w-5" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Active Partner</span>
                        </div>
                        ) : isPending ? (
                        <div className="w-full h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center gap-2 border border-slate-200">
                            <Clock className="h-5 w-5" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-center">Awaiting Approval</span>
                        </div>
                        ) : (
                        <PurchasePlanDialog plan={{...plan, investment: displayPrice}} />
                        )}
                    </CardFooter>
                </Card>
                </div>
            );
            })}
        </div>

        {/* 3. Transaction History Section */}
        <div className="space-y-6 pt-12">
            <div className="flex items-center gap-2 px-2">
                <Clock className="h-4 w-4 text-primary opacity-40" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Activation History</h3>
            </div>
            <PurchaseHistory payments={payments as any[] || []} />
        </div>
      </div>
    </div>
  );
}

function PurchasePlanDialog({ plan }: { plan: Plan }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full h-14 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all bg-primary hover:bg-primary/90 text-white group">
          <span>Select Plan</span>
          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden">
        <div className="bg-primary p-8 text-white relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16" />
            <DialogHeader>
                <div className="flex items-center gap-2 mb-2 opacity-60">
                    <ShieldCheck className="h-3 w-3" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Security Gate</span>
                </div>
                <DialogTitle className="text-3xl font-black tracking-tighter uppercase italic leading-none">Activate<br/>{plan.name}</DialogTitle>
                <DialogDescription className="text-white/60 text-xs font-medium uppercase tracking-tight pt-2">
                    Submit your transaction identity to initiate activation.
                </DialogDescription>
            </DialogHeader>
        </div>
        
        <div className="p-8 space-y-8">
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4 shadow-inner">
            <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Gateway</span>
                <span className="text-xs font-black text-slate-900 uppercase">Easypaisa</span>
            </div>
            <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Account</span>
                <span className="text-xs font-black text-slate-900 uppercase">03140147525</span>
            </div>
            <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Holder</span>
                <span className="text-xs font-black text-slate-900 uppercase">Jahanzaib</span>
            </div>
            <div className="pt-2 border-t border-slate-200/50 flex items-center justify-between">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">Amount Due</span>
                <span className="text-lg font-black text-primary italic">PKR {plan.investment.toLocaleString()}</span>
            </div>
          </div>

          <form action={purchasePlan} className="space-y-6">
            <input type="hidden" name="plan_id" value={plan.id} />
            <div className="space-y-3">
              <Label htmlFor="payment_uid" className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Transaction Identity (ID)</Label>
              <Input 
                id="payment_uid" 
                name="payment_uid" 
                required 
                placeholder="Enter 11-digit ID" 
                className="h-14 bg-slate-50 border-none rounded-2xl px-6 font-bold shadow-inner focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <Button type="submit" className="w-full h-16 rounded-3xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-primary/30 active:scale-[0.98] transition-all">
                Submit for Verification
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PurchaseHistory({ payments }: { payments: any[] }) {
  return (
    <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="border-slate-50">
              <TableHead className="px-8 text-[10px] font-black uppercase tracking-widest h-14">Plan Level</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest h-14">Identity ID</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest h-14">Timestamp</TableHead>
              <TableHead className="px-8 text-[10px] font-black uppercase tracking-widest h-14 text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.length > 0 ? (
              payments.map((p) => (
                <TableRow key={p.id} className="border-slate-50 hover:bg-slate-50/30 transition-colors">
                  <TableCell className="px-8 py-6">
                    <span className="text-sm font-black text-slate-900 uppercase italic tracking-tight">{p.plans?.name || 'Standard Plan'}</span>
                  </TableCell>
                  <TableCell className="py-6">
                    <code className="text-[10px] bg-slate-100 px-3 py-1.5 rounded-lg font-bold text-slate-600 uppercase tracking-widest">{p.payment_uid}</code>
                  </TableCell>
                  <TableCell className="py-6">
                    <p className="text-[10px] font-bold text-slate-500 uppercase">{format(new Date(p.created_at), 'MMM dd, yyyy')}</p>
                  </TableCell>
                  <TableCell className="px-8 py-6 text-right">
                     <Badge
                      variant="secondary"
                      className={cn(
                        "text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full",
                        p.status === 'approved' && 'bg-green-500/10 text-green-600 border border-green-500/10',
                        p.status === 'rejected' && 'bg-red-500/10 text-red-600 border border-red-500/10',
                        p.status === 'pending' && 'bg-orange-500/10 text-orange-600 border border-orange-500/10'
                      )}
                    >
                      {p.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-48 text-center">
                  <div className="flex flex-col items-center gap-3 opacity-20">
                    <Zap className="h-8 w-8" />
                    <p className="text-[10px] font-black uppercase tracking-widest">No plan activations found</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
