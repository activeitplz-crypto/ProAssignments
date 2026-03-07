
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Video } from 'lucide-react';
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
    <div className="space-y-6">
      <Card className="border-none shadow-xl rounded-[2rem] bg-white overflow-hidden">
        <CardHeader className="p-8 pb-4">
          <CardTitle className="font-black flex items-center gap-3 text-3xl tracking-tighter uppercase italic text-slate-900 leading-none">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Video className="h-6 w-6" />
            </div>
            Guidelines
          </CardTitle>
          <CardDescription className="text-xs font-medium uppercase tracking-widest text-muted-foreground pt-2">
            Watch helpful videos and tutorials about using the platform.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-4">
          {videos && videos.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {(videos as VideoType[]).map((video) => {
                const embedUrl = getYouTubeEmbedUrl(video.url);
                return (
                  <Card key={video.id} className="overflow-hidden border-none shadow-lg rounded-[2rem] bg-slate-50 group hover:translate-y-[-4px] transition-all">
                    {embedUrl ? (
                        <div className="aspect-video relative rounded-t-[2rem] overflow-hidden">
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
                        <div className="aspect-video bg-muted flex items-center justify-center rounded-t-[2rem]">
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
            <div className="flex h-64 flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed bg-slate-50">
                <p className="text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    No videos have been uploaded yet.
                    <br />
                    Check back soon for tutorials and other content!
                </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
