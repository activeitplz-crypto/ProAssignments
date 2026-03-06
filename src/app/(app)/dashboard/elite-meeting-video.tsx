
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Users, Sparkles } from 'lucide-react';

export function EliteMeetingVideo() {
  return (
    <Card className="border-none bg-slate-900 text-white overflow-hidden relative shadow-xl rounded-[2rem]">
      {/* Decorative lighting */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-16 -mt-16" />
      
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/60">Community Proof</span>
                  <Sparkles className="h-3 w-3 text-yellow-400/60" />
              </div>
              <h3 className="text-lg font-black tracking-tighter uppercase italic leading-none">
                Meeting with <span className="text-primary">Elite Partners</span>
              </h3>
          </div>
          <div className="bg-white/10 p-2 rounded-full border border-white/5">
            <Users className="h-4 w-4 text-primary" />
          </div>
        </div>

        {/* Vertical Video Container */}
        <div className="relative rounded-2xl overflow-hidden bg-black/40 shadow-inner border border-white/5" style={{ padding: '176.67% 0 0 0' }}>
            <iframe 
                src="https://player.vimeo.com/video/1171151985?badge=0&autopause=0&player_id=0&app_id=58479" 
                frameBorder="0" 
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" 
                className="absolute top-0 left-0 w-full h-full"
                title="Meeting with Elite Plan Members"
            ></iframe>
        </div>
        
        <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest text-center leading-relaxed">
          Exclusive meeting with our high-tier assignment workers
        </p>
      </CardContent>
    </Card>
  );
}
