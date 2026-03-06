
'use client';

import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { CheckCircle2, Home as HomeIcon } from 'lucide-react';

export function HousewifeBlogCard() {
  const steps = [
    "Sign Up",
    "Purchase a Plan",
    "Complete Handwriting Tasks",
    "Get Paid Daily",
    "Withdraw to Easypaisa/JazzCash"
  ];

  return (
    <Card className="border-none bg-white shadow-xl rounded-[2.5rem] overflow-hidden group">
      <div className="relative h-48 w-full">
        <Image
          src="https://i.postimg.cc/HxmMB1xQ/German-Worksheets-For-Beginners-Free-Printable-PDFs.jpg"
          alt="Housewife Earning Opportunity"
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          data-ai-hint="handwritten assignment"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-6">
            <span className="bg-pink-500 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] text-white shadow-lg">Home Opportunity</span>
        </div>
      </div>
      
      <CardContent className="p-8 space-y-6">
        <div className="space-y-3">
          <h3 className="text-2xl font-black tracking-tighter uppercase leading-[0.9] italic text-slate-900">
            Housewives: Earn <span className="text-pink-500 italic">Independence</span>
          </h3>
          <p className="text-xs font-medium text-muted-foreground leading-relaxed">
            Being a housewife is a full-time job, but your free time can now become your earning time. Imagine earning PKR 4000 to 5000 daily while staying at home. By writing simple assignments by hand, you can contribute to your family’s income without leaving your house. It’s safe, flexible, and perfect for your schedule.
          </p>
        </div>

        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <HomeIcon className="h-4 w-4 text-pink-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Start Earning from Home</span>
            </div>
            
            <div className="grid gap-3">
                {steps.map((step, index) => (
                    <div key={index} className="flex items-center gap-3 bg-pink-50/30 p-3 rounded-2xl border border-pink-100 transition-colors hover:bg-pink-500/5">
                        <div className="h-6 w-6 rounded-full bg-pink-500/10 flex items-center justify-center shrink-0">
                            <span className="text-[10px] font-bold text-pink-500">{index + 1}</span>
                        </div>
                        <span className="text-xs font-bold text-slate-700">{step}</span>
                        <CheckCircle2 className="h-3 w-3 ml-auto text-pink-500 opacity-40" />
                    </div>
                ))}
            </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
            <p className="text-[10px] font-black text-center text-pink-500 uppercase tracking-widest animate-pulse">
                Support your family. Join today!
            </p>
        </div>
      </CardContent>
    </Card>
  );
}
