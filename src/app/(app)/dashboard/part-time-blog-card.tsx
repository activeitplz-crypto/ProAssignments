
'use client';

import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Clock, CheckCircle2, Zap } from 'lucide-react';

export function PartTimeBlogCard() {
  const steps = [
    "Quick Sign Up",
    "Select Your Plan",
    "Work 1-3 Hours Daily",
    "Fast Payouts",
    "Flexible Schedule"
  ];

  return (
    <Card className="border-none bg-white shadow-xl rounded-[2.5rem] overflow-hidden group">
      <div className="relative h-48 w-full">
        <Image
          src="https://i.postimg.cc/8P8hCYMy/96c403f95f0097d3b69941e44a185972.jpg"
          alt="Part Time Earning"
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          data-ai-hint="part time work"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-6">
            <span className="bg-indigo-600 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] text-white shadow-lg">Part Time</span>
        </div>
      </div>
      
      <CardContent className="p-8 space-y-6">
        <div className="space-y-3">
          <h3 className="text-2xl font-black tracking-tighter uppercase leading-[0.9] italic text-slate-900">
            Work Only <span className="text-indigo-600 italic">1-3 Hours</span>
          </h3>
          <p className="text-xs font-medium text-muted-foreground leading-relaxed">
            Value your time! Our platform is designed for busy individuals. It only takes 1 to 3 hours to complete your daily assignments. Whether you are a professional looking for side income or someone with a busy schedule, you can easily fit this work into your day and start earning consistently.
          </p>
        </div>

        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-indigo-600" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Time Efficient Work</span>
            </div>
            
            <div className="grid gap-3">
                {steps.map((step, index) => (
                    <div key={index} className="flex items-center gap-3 bg-indigo-50/30 p-3 rounded-2xl border border-indigo-100 transition-colors hover:bg-indigo-600/5">
                        <div className="h-6 w-6 rounded-full bg-indigo-600/10 flex items-center justify-center shrink-0">
                            <span className="text-[10px] font-bold text-indigo-600">{index + 1}</span>
                        </div>
                        <span className="text-xs font-bold text-slate-700">{step}</span>
                        <CheckCircle2 className="h-3 w-3 ml-auto text-indigo-600 opacity-40" />
                    </div>
                ))}
            </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
            <p className="text-[10px] font-black text-center text-indigo-600 uppercase tracking-widest animate-pulse">
                Make every hour count. Join now!
            </p>
        </div>
      </CardContent>
    </Card>
  );
}
