
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Video, Sparkles } from 'lucide-react';
import type { Video as VideoType } from '@/lib/types';
import { getYouTubeEmbedUrl } from '@/lib/utils';

export default async function WatchVideosPage() {
  const supabase = await createClient();
  const { data: { session }} = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const { data: videos, error } = await supabase
    .from('videos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching videos:', error);
    return <div className="p-12 text-center font-black uppercase tracking-widest text-destructive">Video Synchronization Error</div>
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <div className="bg-primary pt-16 pb-20 px-6 relative rounded-b-[2.5rem] shadow-lg overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <div className="flex items-center justify-center gap-2">
              <span className="text-white/60 font-black uppercase text-[10px] tracking-[0.3em]">Master Class</span>
              <Sparkles className="h-3 w-3 text-yellow-400/60" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic text-white leading-none">
            Video <span className="text-white/80">Tutorials</span>
          </h1>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">Step-by-step visual guides for platform success</p>
        </div>
      </div>

      <div className="px-4 -mt-10 space-y-8 max-w-6xl mx-auto w-full pb-24 relative z-20">
        {videos && videos.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {(videos as VideoType[]).map((video) => {
              const embedUrl = getYouTubeEmbedUrl(video.url);
              return (
                <Card key={video.id} className="border-none shadow-xl rounded-[2rem] bg-white overflow-hidden group hover:translate-y-[-4px] transition-all">
                  {embedUrl ? (
                      <div className="aspect-video relative overflow-hidden">
                          <iframe
                              src={embedUrl}
                              title={video.title}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="h-full w-full"
                          ></iframe>
                      </div>
                  ) : (
                      <div className="aspect-video bg-muted flex items-center justify-center">
                          <p className="text-destructive text-[10px] font-bold uppercase p-4">Invalid video URL</p>
                      </div>
                  )}
                  <CardHeader className="p-6">
                    <CardTitle className="text-sm font-black uppercase tracking-tight text-slate-900">{video.title}</CardTitle>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        ) : (
          <div className="flex h-64 flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed bg-white shadow-sm">
              <Video className="h-12 w-12 text-slate-200 mb-4" />
              <p className="text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Tutorial library is being synchronized.
              </p>
          </div>
        )}
      </div>
    </div>
  );
}
