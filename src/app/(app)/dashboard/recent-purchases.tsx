'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const staticPurchases = [
  { name: 'Zohaib', plan: 'Premium Plan', time: '2 mins ago' },
  { name: 'Kiran', plan: 'Ultimate Plan', time: '5 mins ago' },
  { name: 'Sajid', plan: 'Business Plan', time: '8 mins ago' },
  { name: 'Mehak', plan: 'Elite Plan', time: '12 mins ago' },
  { name: 'Bilal', plan: 'Pro Plan', time: '15 mins ago' },
  { name: 'Ayesha', plan: 'Premium Plan', time: '18 mins ago' },
  { name: 'Hamza', plan: 'Basic Plan', time: '22 mins ago' },
  { name: 'Nida', plan: 'Advanced Plan', time: '25 mins ago' },
];

export function RecentPurchases() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % staticPurchases.length);
    }, 5000); 

    return () => clearInterval(interval);
  }, []);

  const current = staticPurchases[currentIndex];

  return (
    <Card className="border-none bg-white shadow-xl rounded-[2rem] overflow-hidden">
      <div className="bg-muted/30 px-6 py-4 flex items-center justify-between border-b border-muted">
        <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">New Activations</h3>
        </div>
        <Badge variant="outline" className="text-[8px] font-black uppercase bg-white border-blue-200 text-blue-600">Active Now</Badge>
      </div>
      <CardContent className="p-6">
        <div className="relative h-16 overflow-hidden">
            <div
              key={currentIndex}
              className="absolute inset-0 flex items-center gap-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-700 ease-out"
            >
              <div className="h-12 w-12 rounded-2xl bg-blue-500/5 flex items-center justify-center shrink-0 border border-blue-500/5">
                <span className="text-lg font-black text-blue-600/40 leading-none">
                    {current.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1 space-y-0.5">
                <p className="text-sm font-black text-foreground uppercase tracking-tight">{current.name}</p>
                <div className="flex items-center gap-2">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Activated {current.plan}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                    {current.time}
                </p>
              </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
