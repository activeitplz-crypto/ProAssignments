
'use client';

import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { CheckCircle2, Sparkles } from 'lucide-react';

export function BlogCard() {
  const steps = [
    "Sign Up",
    "Purchase a Plan",
    "Complete the Assignment Task",
    "Get Paid",
    "Withdraw Your Earnings"
  ];

  return (
    <Card className="border-none bg-white shadow-xl rounded-[2.5rem] overflow-hidden group">
      <div className="relative h-48 w-full">
        <Image
          src="https://i.postimg.cc/BQzqJ52D/cd37690721182845c25065045c96363f.jpg"
          alt="Earning Opportunity"
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          data-ai-hint="student working"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-6">
            <span className="bg-primary px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] text-white shadow-lg">New Opportunity</span>
        </div>
      </div>
      
      <CardContent className="p-8 space-y-6">
        <div className="space-y-3">
          <h3 className="text-2xl font-black tracking-tighter uppercase leading-[0.9] italic text-slate-900">
            Earn PKR 5000+ <span className="text-primary italic">Daily</span>
          </h3>
          <p className="text-xs font-medium text-muted-foreground leading-relaxed">
            Nowadays every student wants to earn money while studying. Imagine earning PKR 4000 to 5000 daily just by writing simple assignments by hand. It’s an easy opportunity where students can work from home, complete small tasks, and start building their daily income.
          </p>
        </div>

        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-yellow-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Start in 5 Easy Steps</span>
            </div>
            
            <div className="grid gap-3">
                {steps.map((step, index) => (
                    <div key={index} className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100 transition-colors hover:bg-primary/5">
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <span className="text-[10px] font-bold text-primary">{index + 1}</span>
                        </div>
                        <span className="text-xs font-bold text-slate-700">{step}</span>
                        <CheckCircle2 className="h-3 w-3 ml-auto text-green-500 opacity-40" />
                    </div>
                ))}
            </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
            <p className="text-[10px] font-black text-center text-primary uppercase tracking-widest animate-pulse">
                Don’t wait! Purchase a plan today.
            </p>
        </div>
      </CardContent>
    </Card>
  );
}
