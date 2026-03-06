
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Moon, Star, ArrowRight, Timer } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { Plan } from '@/lib/types';

export function RamzanBanner() {
  const [activeOffer, setActiveOffer] = useState<Plan | null>(null);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const fetchOffer = async () => {
      const supabase = createClient();
      const { data: plans } = await supabase
        .from('plans')
        .select('*')
        .not('offer_expires_at', 'is', null)
        .order('offer_expires_at', { ascending: true });

      const now = new Date();
      // Find the first offer that hasn't expired yet
      const firstValidOffer = (plans || []).find(
        (p) => p.offer_expires_at && new Date(p.offer_expires_at) > now
      );
      
      setActiveOffer(firstValidOffer || null);
    };

    fetchOffer();
  }, []);

  useEffect(() => {
    if (!activeOffer?.offer_expires_at) return;

    const interval = setInterval(() => {
      const difference = +new Date(activeOffer.offer_expires_at!) - +new Date();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeOffer]);

  // Only show if there is an active offer with an expiry date
  if (!activeOffer) return null;

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
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
                <span className="bg-white/20 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-[0.2em] backdrop-blur-md border border-white/10">RAMAZAN MUBARAK</span>
                <div className="flex gap-0.5 text-yellow-300">
                  <Star className="h-2.5 w-2.5 fill-current" />
                  <Star className="h-2.5 w-2.5 fill-current" />
                  <Star className="h-2.5 w-2.5 fill-current" />
                </div>
            </div>

            {/* Live Countdown Badge */}
            <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/5 shadow-inner">
                <Timer className="h-3 w-3 text-emerald-300 animate-pulse" />
                <div className="font-mono text-[10px] font-black flex gap-1">
                    <span className="w-5 text-center">{String(timeLeft.days).padStart(2, '0')}d</span>
                    <span className="opacity-30">:</span>
                    <span className="w-5 text-center">{String(timeLeft.hours).padStart(2, '0')}h</span>
                    <span className="opacity-30">:</span>
                    <span className="w-5 text-center">{String(timeLeft.minutes).padStart(2, '0')}m</span>
                    <span className="opacity-30">:</span>
                    <span className="w-5 text-center text-emerald-300">{String(timeLeft.seconds).padStart(2, '0')}s</span>
                </div>
            </div>
          </div>
          
          <div className="space-y-1.5 max-w-[80%]">
            <h3 className="text-2xl font-black tracking-tighter leading-[0.9] uppercase italic">
              {activeOffer.offer_name || 'RAMAZAN SPECIAL'}<br/>
              <span className="text-emerald-200">OFFER</span>
            </h3>
            <p className="text-[10px] font-bold text-white/80 uppercase tracking-tight">LIMITED TIME DISCOUNT ON ALL THE PLANS</p>
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
