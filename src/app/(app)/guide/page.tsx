
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { HelpCircle, ShieldCheck, Zap, Wallet, Users, Info, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function GuidePage() {
    const supabase = createClient();
    const { data: { session }} = await supabase.auth.getSession();

    if (!session) {
        redirect('/login');
    }

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      {/* 1. Immersive Elite Header */}
      <div className="bg-primary pt-16 pb-20 px-6 relative rounded-b-[2.5rem] shadow-lg overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <div className="flex items-center justify-center gap-2">
              <span className="text-white/60 font-black uppercase text-[10px] tracking-[0.3em]">Knowledge Base</span>
              <HelpCircle className="h-3 w-3 text-yellow-400/60" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic text-white leading-none">
            Platform <span className="text-white/80">Guidelines</span>
          </h1>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">Master the ecosystem and maximize your revenue</p>
        </div>
      </div>

      {/* 2. Overlapping FAQ Content */}
      <div className="px-4 -mt-10 space-y-8 max-w-4xl mx-auto w-full pb-24 relative z-20">
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

              <AccordionItem value="item-2" className="border-none bg-slate-50 rounded-[1.5rem] px-6 transition-all data-[state=open]:bg-primary/5">
                <AccordionTrigger className="py-6 text-sm font-black uppercase tracking-tight text-slate-900 hover:no-underline text-left">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                        <ShieldCheck className="h-5 w-5 text-primary" />
                    </div>
                    <span>Why is an initial investment required?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-xs font-bold text-muted-foreground leading-relaxed pb-8 pl-14 uppercase tracking-wide opacity-70">
                  The investment fee acts as a security deposit and filters for serious partners. It covers the maintenance of our high-speed AI verification servers and allows us to provide a reliable pool of assignments for all active members.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border-none bg-slate-50 rounded-[1.5rem] px-6 transition-all data-[state=open]:bg-primary/5">
                <AccordionTrigger className="py-6 text-sm font-black uppercase tracking-tight text-slate-900 hover:no-underline text-left">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                        <Wallet className="h-5 w-5 text-primary" />
                    </div>
                    <span>What is the payout timeline?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-xs font-bold text-muted-foreground leading-relaxed pb-8 pl-14 uppercase tracking-wide opacity-70">
                  Once you request a withdrawal, our finance department manually verifies the request for security. Funds are typically dispatched to your Easypaisa or JazzCash account within 24 hours of approval.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border-none bg-slate-50 rounded-[1.5rem] px-6 transition-all data-[state=open]:bg-primary/5">
                <AccordionTrigger className="py-6 text-sm font-black uppercase tracking-tight text-slate-900 hover:no-underline text-left">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                        <Zap className="h-5 w-5 text-primary" />
                    </div>
                    <span>When do tasks refresh?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-xs font-bold text-muted-foreground leading-relaxed pb-8 pl-14 uppercase tracking-wide opacity-70">
                  The assignment hub resets every 24 hours. Your daily goal count depends on your activated plan level. Make sure to complete all pending tasks before the daily reset to maximize your revenue.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border-none bg-slate-50 rounded-[1.5rem] px-6 transition-all data-[state=open]:bg-primary/5">
                <AccordionTrigger className="py-6 text-sm font-black uppercase tracking-tight text-slate-900 hover:no-underline text-left">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                        <ShieldCheck className="h-5 w-5 text-primary" />
                    </div>
                    <span>Is ProAssignment officially registered?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-xs font-bold text-muted-foreground leading-relaxed pb-8 pl-14 uppercase tracking-wide opacity-70">
                  Yes. We operate as a verified partner under PSEB and FBR guidelines. Our mission is to provide a legitimate, secure environment for digital workers and students to monetize their handwriting skills.
                </AccordionContent>
              </AccordionItem>

            </Accordion>
          </CardContent>
        </Card>

        {/* Quick Contact Footer */}
        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-center space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
            <h4 className="text-white text-lg font-black uppercase italic tracking-tighter">Still have questions?</h4>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest leading-relaxed max-w-xs mx-auto">
                Visit our Social station to connect with our elite community and support team.
            </p>
            <div className="pt-4">
                <a href="/social" className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">
                    Support Channels <ArrowRight className="h-4 w-4" />
                </a>
            </div>
        </div>
      </div>
    </div>
  );
}
