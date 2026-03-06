'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Video, Sparkles, AlertCircle } from 'lucide-react';
import type { Video as VideoType } from '@/lib/types';
import { getYouTubeEmbedUrl } from '@/lib/utils';

interface VideoTutorialCardProps {
  video: VideoType | null;
}

export function VideoTutorialCard({ video }: VideoTutorialCardProps) {
  const embedUrl = video ? getYouTubeEmbedUrl(video.url) : null;

  return (
    <Card className="border-none bg-gradient-to-br from-indigo-600 to-violet-800 text-white overflow-hidden relative shadow-xl rounded-[2rem]">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/20 rounded-full blur-xl -ml-8 -mb-8" />
      
      <div className="p-6 relative z-10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/60">Work Guidelines</span>
                  <Sparkles className="h-3 w-3 text-yellow-300/60" />
              </div>
              <h3 className="text-lg font-black tracking-tighter uppercase italic leading-none">
                {video?.title || "How to Work on ProAssignment"}
              </h3>
          </div>
          <div className="bg-white/10 p-2 rounded-full border border-white/10">
            <Video className="h-4 w-4 text-white/80" />
          </div>
        </div>

        <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/20 shadow-inner border border-white/5">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={video?.title || "Tutorial Video"}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            ></iframe>
          ) : (
            <div className="h-full w-full flex flex-col items-center justify-center gap-2 text-white/40">
              <AlertCircle className="h-8 w-8" />
              <span className="text-[10px] font-bold uppercase tracking-widest">No Tutorial Available</span>
            </div>
          )}
        </div>
        
        <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest text-center">
          Master the assignment process by watching the tutorial above
        </p>
      </div>
    </Card>
  );
}
