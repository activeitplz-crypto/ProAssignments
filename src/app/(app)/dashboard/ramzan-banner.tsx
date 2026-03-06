
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Moon, Star, Zap } from 'lucide-react';
import Link from 'next/link';

export function RamzanBanner() {
  return (
    <Link href="/plans">
      <Card className="border-none bg-gradient-to-r from-emerald-600 to-teal-700 text-white overflow-hidden relative group cursor-pointer active:scale-95 transition-all shadow-lg rounded-[1.5rem]">
        <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:scale-110 transition-transform">
          <Moon className="h-20 w-20 rotate-12" />
        </div>
        <div className="absolute bottom-0 left-10 p-2 opacity-10">
          <Star className="h-10 w-10" />
        </div>
        <CardContent className="p-6 relative z-10 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Limited Time</span>
              <div className="flex text-yellow-300">
                <Star className="h-3 w-3 fill-current" />
                <Star className="h-3 w-3 fill-current" />
                <Star className="h-3 w-3 fill-current" />
              </div>
            </div>
            <h3 className="text-xl font-black tracking-tight uppercase">Ramzan Special Offer</h3>
            <p className="text-sm font-medium opacity-90">Get up to 20% extra daily earnings this month!</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md shrink-0">
            <Zap className="h-6 w-6 text-yellow-300" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
