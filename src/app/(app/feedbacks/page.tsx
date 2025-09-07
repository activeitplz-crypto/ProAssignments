
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Video } from 'lucide-react';
import type { FeedbackVideo as FeedbackVideoType } from '@/lib/types';

function getYouTubeEmbedUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    let videoId: string | null = null;

    if (urlObj.hostname.includes('youtube.com')) {
      if (urlObj.pathname.startsWith('/shorts/')) {
        videoId = urlObj.pathname.substring('/shorts/'.length);
      } else if (urlObj.pathname.startsWith('/live/')) {
        videoId = urlObj.pathname.substring('/live/'.length);
      } else {
        videoId = urlObj.searchParams.get('v');
      }
    } else if (urlObj.hostname.includes('youtu.be')) {
      videoId = urlObj.pathname.slice(1);
    }
    
    // Clean up potential query parameters from the videoId
    if (videoId) {
        const queryIndex = videoId.indexOf('?');
        if (queryIndex !== -1) {
            videoId = videoId.substring(0, queryIndex);
        }
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  } catch (error) {
    console.error("Invalid URL for embedding:", url);
    return null;
  }
  return null;
}


export default async function FeedbacksPage() {
  const supabase = createClient();
  const { data: { session }} = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const { data: videos, error } = await supabase
    .from('feedback_videos')
    .select('*')
    .order('created_at', { ascending: false });

   if (error) {
    console.error('Error fetching feedback videos:', error);
    return <div>Could not load feedback videos. Please try again later.</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2 text-3xl">
            <MessageSquare className="h-8 w-8 text-primary" />
            User Feedbacks
          </CardTitle>
          <CardDescription>
            Watch video testimonials from our satisfied users.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {videos && videos.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {(videos as FeedbackVideoType[]).map((video) => {
                const embedUrl = getYouTubeEmbedUrl(video.url);
                return (
                  <Card key={video.id} className="overflow-hidden">
                    {embedUrl ? (
                        <div className="aspect-video">
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
                            <p className="text-destructive text-sm p-4">Invalid video URL</p>
                        </div>
                    )}
                    <CardHeader>
                      <CardTitle className="text-lg">{video.title}</CardTitle>
                    </CardHeader>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="flex h-48 flex-col items-center justify-center rounded-lg border-2 border-dashed bg-muted">
                <p className="text-center text-muted-foreground">
                    No feedback videos have been added yet.
                    <br />
                    Check back later to see what our users are saying!
                </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
