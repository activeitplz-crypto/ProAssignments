
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Moon, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function RamzanBanner() {
  return (
    <Link href="/plans" className="block group">
      <Card className="border-none bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-800 text-white overflow-hidden relative active:scale-[0.98] transition-all shadow-xl rounded-[2.5rem]">
        {/* Modern decorative elements */}
        <div className="absolute top-[-20px] right-[-20px] w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-30px] left-[-30px] w-40 h-40 bg-black/10 rounded-full blur-2xl" />
        
        <div className="absolute top-6 right-8 opacity-20 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
          <Moon className="h-20 w-20" />
        </div>
        
        <CardContent className="p-8 relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-white/20 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] backdrop-blur-md border border-white/10">Best Offer</span>
            <div className="flex gap-0.5 text-yellow-300">
              <Star className="h-3 w-3 fill-current" />
              <Star className="h-3 w-3 fill-current" />
              <Star className="h-3 w-3 fill-current" />
            </div>
          </div>
          
          <div className="space-y-2 max-w-[75%]">
            <h3 className="text-4xl font-black tracking-tighter leading-none uppercase">
              20% EXTRA<br/>
              <span className="text-emerald-200">REWARDS</span>
            </h3>
            <p className="text-[11px] font-bold text-white/80 uppercase tracking-tight">Ramzan special earning program is live!</p>
          </div>
          
          <div className="mt-8 flex">
            <div className="inline-flex items-center gap-2 bg-white text-emerald-800 px-6 py-3 rounded-full text-[11px] font-black uppercase tracking-widest shadow-xl group-hover:px-8 transition-all duration-300">
              Claim Now <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
