
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, Sparkles } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Review } from '@/lib/types';
import { redirect } from 'next/navigation';

export default async function ReviewsPage() {
  const supabase = await createClient();
  const { data: { session }} = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }
  
  const { data: reviews, error } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reviews:', error);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-6">
      <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Identity Hub</span>
              <Sparkles className="h-4 w-4 text-yellow-500" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic text-white leading-none bg-primary py-12 rounded-b-[3rem] shadow-2xl">
            Success <span className="text-white/80">Terminal</span>
          </h1>
          <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] pt-4">Verified experiences from our network</p>
      </div>

      <div className="space-y-8 px-4">
        {reviews && reviews.length > 0 ? (
          reviews.map((review: Review) => (
            <Card key={review.id} className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden group">
              <CardContent className="p-10 flex flex-col items-center text-center space-y-6">
                <Avatar className="h-20 w-20 border-4 border-primary/10 shadow-md">
                    <AvatarImage src={review.avatar_url || ''} alt={review.name} className="object-cover" />
                    <AvatarFallback className="bg-primary/5 font-bold text-primary">
                        {review.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                </Avatar>
                
                <div className="space-y-3">
                    <cite className="text-lg not-italic font-black uppercase tracking-tight text-slate-900">
                      {review.name}
                    </cite>
                    <blockquote className="max-w-xl">
                      <p className="text-base font-medium italic text-slate-600 leading-relaxed">
                        "{review.content}"
                      </p>
                    </blockquote>
                </div>
                <div className="pt-2">
                    <span className="bg-green-500/10 text-green-600 text-[8px] font-black uppercase tracking-[0.3em] px-3 py-1 rounded-full">Verified Identity</span>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="flex h-64 flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed bg-muted/30">
              <MessageSquare className="h-12 w-12 text-muted-foreground/20 mb-4" />
              <p className="text-center text-muted-foreground font-black uppercase tracking-widest text-[10px]">
                  Identity logs are refreshing...
              </p>
          </div>
        )}
      </div>
    </div>
  );
}
