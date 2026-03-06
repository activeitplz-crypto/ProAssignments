'use client';

import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Award, Sparkles, CheckCircle2 } from 'lucide-react';

const topEarners = [
  "https://i.postimg.cc/6p71NnhM/Whats_App_Image_2026_02_19_at_22_15_07.jpg",
  "https://i.postimg.cc/cLVk1CDX/Whats_App_Image_2026_02_19_at_22_15_08.jpg",
  "https://i.postimg.cc/vZp28TPP/Whats_App_Image_2026_02_19_at_22_15_09.jpg",
  "https://i.postimg.cc/bwKVYr6F/Whats_App_Image_2026_02_19_at_22_15_10.jpg",
  "https://i.postimg.cc/K8dpcj9p/Whats_App_Image_2026_02_19_at_22_15_11.jpg",
  "https://i.postimg.cc/DZfr7KKc/Whats_App_Image_2026_02_19_at_22_15_01.jpg"
];

export function TopEarnersCard() {
  return (
    <Card className="border-none bg-white shadow-xl rounded-[2.5rem] overflow-hidden group">
      <CardContent className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-primary">Verified Success</span>
                <Sparkles className="h-3 w-3 text-yellow-500" />
            </div>
            <h3 className="text-2xl font-black tracking-tighter uppercase italic leading-none">
              Top <span className="text-primary">Earners</span>
            </h3>
          </div>
          <div className="h-10 w-10 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10">
            <Award className="h-5 w-5 text-primary" />
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <p className="text-[10px] font-bold text-slate-600 leading-relaxed text-center uppercase tracking-tight">
                These are real dashboard screenshots from some of our top earners.
            </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {topEarners.map((url, index) => (
            <div key={index} className="relative aspect-[3/4] rounded-3xl overflow-hidden border-2 border-slate-50 shadow-sm group/img transition-all duration-500 hover:shadow-xl hover:translate-y-[-4px]">
              <Image
                src={url}
                alt={`Top Earner ${index + 1}`}
                fill
                className="object-cover transition-transform duration-700 group-hover/img:scale-110"
                data-ai-hint="dashboard screenshot"
              />
              <div className="absolute top-2 right-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 fill-white shadow-sm" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity flex items-end p-3">
                 <span className="text-[8px] font-black text-white uppercase tracking-widest">Verified Proof</span>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-center">
            <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] animate-pulse">
                Join our top earners today!
            </p>
        </div>
      </CardContent>
    </Card>
  );
}
