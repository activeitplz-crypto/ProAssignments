'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Moon, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function RamzanBanner() {
  return (
    <Link href="/plans" className="block group">
      <Card className="border-none bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-800 text-white overflow-hidden relative active:scale-[0.98] transition-all shadow-lg rounded-[2rem]">
        {/* Modern decorative elements */}
        <div className="absolute top-[-10px] right-[-10px] w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute bottom-[-20px] left-[-20px] w-24 h-24 bg-black/10 rounded-full blur-xl" />
        
        <div className="absolute top-4 right-6 opacity-20 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
          <Moon className="h-14 w-14" />
        </div>
        
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-[0.2em] backdrop-blur-md border border-white/10">RAMAZAN MUBARAK</span>
            <div className="flex gap-0.5 text-yellow-300">
              <Star className="h-2.5 w-2.5 fill-current" />
              <Star className="h-2.5 w-2.5 fill-current" />
              <Star className="h-2.5 w-2.5 fill-current" />
            </div>
          </div>
          
          <div className="space-y-1.5 max-w-[80%]">
            <h3 className="text-2xl font-black tracking-tighter leading-none uppercase">
              RAMAZAN SPECIAL<br/>
              <span className="text-emerald-200">OFFER</span>
            </h3>
            <p className="text-[10px] font-bold text-white/80 uppercase tracking-tight">GET 20% OFF ON ALL THE PLANS</p>
          </div>
          
          <div className="mt-5 flex">
            <div className="inline-flex items-center gap-2 bg-white text-emerald-800 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md group-hover:px-6 transition-all duration-300">
              Claim Now <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
