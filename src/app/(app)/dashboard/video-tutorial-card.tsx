'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Play, Video, Sparkles } from 'lucide-react';
import Link from 'next/link';

export function VideoTutorialCard() {
  return (
    <Link href="/watch" className="block group">
      <Card className="border-none bg-gradient-to-br from-indigo-600 to-violet-800 text-white overflow-hidden relative active:scale-[0.98] transition-all shadow-xl rounded-[2.5rem]">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/20 rounded-full blur-xl -ml-8 -mb-8" />
        
        <CardContent className="p-6 relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500">
                <Play className="h-6 w-6 text-white fill-white" />
            </div>
            <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/60">Guidelines</span>
                    <Sparkles className="h-3 w-3 text-yellow-300/60" />
                </div>
                <h3 className="text-lg font-black tracking-tighter uppercase italic leading-none">Play Tutorial Video</h3>
                <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Master the platform in minutes</p>
            </div>
          </div>
          
          <div className="bg-white/10 p-2 rounded-full border border-white/10">
            <Video className="h-4 w-4 text-white/80" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
