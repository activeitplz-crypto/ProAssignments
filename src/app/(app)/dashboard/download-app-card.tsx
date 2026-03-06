
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Smartphone, Download, Sparkles } from 'lucide-react';
import Link from 'next/link';

export function DownloadAppCard() {
  return (
    <Link href="https://web2apkpro.com/public_download.php?project_id=2547&token=e3a1121a43" target="_blank" className="block group h-full">
      <Card className="border-none bg-slate-900 text-white overflow-hidden relative active:scale-[0.98] transition-all shadow-2xl rounded-[2.5rem] h-full border border-white/5">
        {/* Immersive background lighting effects */}
        <div className="absolute top-[-20%] right-[-10%] w-[200px] h-[200px] bg-primary/20 rounded-full blur-[80px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[150px] h-[150px] bg-indigo-500/10 rounded-full blur-[60px]" />
        
        {/* Subtle grid pattern overlay for texture */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />

        <CardContent className="p-8 relative z-10 flex flex-col justify-between h-full min-h-[240px]">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full backdrop-blur-md">
                    <Smartphone className="h-3 w-3 text-primary" />
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/70">Mobile App</span>
                </div>
                <Sparkles className="h-4 w-4 text-yellow-400/40 animate-pulse" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-3xl font-black tracking-tighter uppercase leading-[0.9] italic">
                WORK SMARTER<br/>
                <span className="text-primary">ANYWHERE</span>
              </h3>
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest leading-relaxed max-w-[220px]">
                Unleash the full potential of ProAssignment with our native mobile experience.
              </p>
            </div>
          </div>
          
          <div className="mt-8 flex items-center justify-between">
            <div className="inline-flex items-center gap-2 bg-white text-slate-950 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.15em] shadow-xl group-hover:px-8 transition-all duration-500">
              Download App <Download className="h-4 w-4" />
            </div>
            
            <div className="flex flex-col items-end opacity-20">
                <span className="text-[8px] font-black uppercase tracking-tighter">Build</span>
                <span className="text-xs font-black">v2.5.0</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
