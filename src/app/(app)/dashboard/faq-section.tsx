
'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { HelpCircle, ShieldCheck, Zap, Wallet, Info } from 'lucide-react';

export function FaqSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-2">
        <HelpCircle className="h-4 w-4 text-primary opacity-40" />
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Platform Guidelines</h3>
      </div>

      <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
        <CardContent className="p-6">
          <Accordion type="single" collapsible className="w-full space-y-3">
            
            <AccordionItem value="item-2" className="border-none bg-slate-50 rounded-[1.5rem] px-5 transition-all data-[state=open]:bg-primary/5">
              <AccordionTrigger className="py-5 text-[11px] font-black uppercase tracking-tight text-slate-900 hover:no-underline text-left">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                      <ShieldCheck className="h-4 w-4 text-primary" />
                  </div>
                  <span>Why is an initial investment required?</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-[10px] font-bold text-muted-foreground leading-relaxed pb-6 pl-11 uppercase tracking-wide opacity-70">
                The investment fee acts as a security deposit and filters for serious partners. It covers the maintenance of our high-speed AI verification servers and reliable assignment pool.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border-none bg-slate-50 rounded-[1.5rem] px-5 transition-all data-[state=open]:bg-primary/5">
              <AccordionTrigger className="py-5 text-[11px] font-black uppercase tracking-tight text-slate-900 hover:no-underline text-left">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                      <Wallet className="h-4 w-4 text-primary" />
                  </div>
                  <span>What is the payout timeline?</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-[10px] font-bold text-muted-foreground leading-relaxed pb-6 pl-11 uppercase tracking-wide opacity-70">
                Once you request a withdrawal, our finance department verifies the request. Funds are typically dispatched to your Easypaisa or JazzCash account within 24 hours.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border-none bg-slate-50 rounded-[1.5rem] px-5 transition-all data-[state=open]:bg-primary/5">
              <AccordionTrigger className="py-5 text-[11px] font-black uppercase tracking-tight text-slate-900 hover:no-underline text-left">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                      <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <span>When do tasks refresh?</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-[10px] font-bold text-muted-foreground leading-relaxed pb-6 pl-11 uppercase tracking-wide opacity-70">
                The assignment hub resets every 24 hours. Your daily goal count depends on your activated plan level. Complete tasks before reset to maximize revenue.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border-none bg-slate-50 rounded-[1.5rem] px-5 transition-all data-[state=open]:bg-primary/5">
              <AccordionTrigger className="py-5 text-[11px] font-black uppercase tracking-tight text-slate-900 hover:no-underline text-left">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                      <ShieldCheck className="h-4 w-4 text-primary" />
                  </div>
                  <span>Is ProAssignment officially registered?</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-[10px] font-bold text-muted-foreground leading-relaxed pb-6 pl-11 uppercase tracking-wide opacity-70">
                Yes. We operate as a verified partner under PSEB and FBR guidelines. Our mission is to provide a legitimate environment for digital handwriting monetization.
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
