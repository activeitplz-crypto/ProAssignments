
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { HelpCircle, ShieldCheck, Zap, Wallet, Users, Info, ArrowRight, BookOpen, Star, Target, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function GuidePage() {
    const supabase = await createClient();
    const { data: { session }} = await supabase.auth.getSession();

    if (!session) {
        redirect('/login');
    }

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <div className="bg-primary pt-16 pb-20 px-6 relative rounded-b-[2.5rem] shadow-lg overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <div className="flex items-center justify-center gap-2">
              <span className="text-white/60 font-black uppercase text-[10px] tracking-[0.3em]">Knowledge Base</span>
              <HelpCircle className="h-3 w-3 text-yellow-400/60" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic text-white leading-none">
            Master <span className="text-white/80">Guide</span>
          </h1>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">The complete roadmap to your digital earning journey</p>
        </div>
      </div>

      <div className="px-4 -mt-10 space-y-8 max-w-4xl mx-auto w-full pb-24 relative z-20">
        <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
            <div className="p-10 space-y-6">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-0.5">
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">Platform Overview</span>
                        <h2 className="text-2xl font-black tracking-tighter italic text-slate-900 leading-none">What is <span className="text-primary">ProAssignment?</span></h2>
                    </div>
                </div>
                <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                    ProAssignment is a premier digital work ecosystem designed to monetize handwriting skills. Our platform bridges the gap between digital assignments and physical effort, providing students, housewives, and professionals a secure way to earn daily income from the comfort of their homes.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex gap-4">
                        <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0">
                            <Target className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase text-slate-900">Daily Revenue</p>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase leading-tight">Complete tasks and get paid every single day.</p>
                        </div>
                    </div>
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex gap-4">
                        <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0">
                            <Star className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase text-slate-900">AI Verification</p>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase leading-tight">Advanced AI scans ensure fair and fast approval.</p>
                        </div>
                    </div>
                </div>
            </div>
        </Card>

        <div className="space-y-4">
            <div className="flex items-center gap-2 px-2">
                <Target className="h-4 w-4 text-primary opacity-40" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Path to Success</h3>
            </div>
            <div className="grid gap-4">
                {[
                    { title: "Plan Activation", desc: "Select and activate an investment plan. Higher plans unlock more tasks and higher daily revenue potential.", icon: Zap },
                    { title: "Task Station", desc: "Visit the Tasks page daily. Each assignment provides a specific link or instruction for your work.", icon: Target },
                    { title: "Physical Writing", desc: "Write the assigned work by hand on paper. This physical effort is what makes your contribution valuable.", icon: BookOpen },
                    { title: "Proof Upload", desc: "Scan or photograph your handwritten work and upload it to the Assignments station for AI scanning.", icon: CheckCircle2 },
                    { title: "Fast Withdrawal", desc: "Once approved, your earnings are added to your balance. Withdraw to Easypaisa or JazzCash instantly.", icon: Wallet },
                ].map((step, idx) => (step && (
                    <div key={idx} className="bg-white p-6 rounded-[2rem] shadow-lg border border-slate-50 flex items-center gap-6 group hover:translate-x-1 transition-all duration-300">
                        <div className="h-14 w-14 rounded-2xl bg-primary/5 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                            <step.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[8px] font-black text-primary/40 uppercase tracking-widest">Step 0{idx + 1}</span>
                                <h4 className="text-sm font-black uppercase tracking-tight text-slate-900">{step.title}</h4>
                            </div>
                            <p className="text-[11px] font-medium text-muted-foreground leading-relaxed uppercase opacity-70 tracking-tight">{step.desc}</p>
                        </div>
                    </div>
                )))}
            </div>
        </div>

        <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex items-center gap-5">
            <div className="h-14 w-14 rounded-[1.5rem] bg-primary/5 flex items-center justify-center border border-primary/10">
                <Info className="h-7 w-7 text-primary" />
            </div>
            <div className="space-y-1">
                <div className="flex items-center gap-2">
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-primary/60">Identity Support</span>
                </div>
                <h3 className="font-black text-slate-900 uppercase tracking-tighter text-xl leading-none">Key Questions & Answers</h3>
            </div>
          </div>
          
          <CardContent className="p-8 lg:p-12">
            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem value="item-1" className="border-none bg-slate-50 rounded-[1.5rem] px-6 transition-all data-[state=open]:bg-primary/5">
                <AccordionTrigger className="py-6 text-sm font-black uppercase tracking-tight text-slate-900 hover:no-underline text-left">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                        <Users className="h-5 w-5 text-primary" />
                    </div>
                    <span>Is referral mandatory for withdrawal?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-xs font-bold text-muted-foreground leading-relaxed pb-8 pl-14 uppercase tracking-wide opacity-70">
                  Absolutely not. ProAssignment is built on transparency. You can withdraw your balance as soon as you reach PKR 700, regardless of your referral count. We do not force members to add others to get their own earnings.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
