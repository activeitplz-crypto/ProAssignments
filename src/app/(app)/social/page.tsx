
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Share2, MessageCircle, ExternalLink, Sparkles } from 'lucide-react';
import type { SocialLink } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';

export default async function SocialPage() {
  const supabase = createClient();
  const { data: { session }} = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const { data: dbLinks, error } = await supabase
    .from('social_links')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching social links:', error);
  }

  const officialChannels = [
    {
      name: 'WhatsApp Channel',
      url: 'https://whatsapp.com/channel/0029Vb6EqdYLY6d5HhajEb3A',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg',
      color: 'bg-green-500',
      description: 'Get real-time task updates, announcements and community news.'
    },
    {
      name: 'Facebook Official',
      url: 'https://www.facebook.com/share/18R9WkiuqA/',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg',
      color: 'bg-blue-600',
      description: 'Join our growing community on Facebook for success stories.'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      {/* 1. Immersive Elite Header */}
      <div className="bg-primary pt-16 pb-20 px-6 relative rounded-b-[2.5rem] shadow-lg overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <div className="flex items-center justify-center gap-2">
              <span className="text-white/60 font-black uppercase text-[10px] tracking-[0.3em]">Network Terminal</span>
              <Sparkles className="h-3 w-3 text-yellow-400/60" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic text-white leading-none">
            Social <span className="text-white/80">Hub</span>
          </h1>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">Connect with the elite ProAssignment ecosystem</p>
        </div>
      </div>

      <div className="px-4 -mt-10 space-y-10 max-w-5xl mx-auto w-full pb-24 relative z-20">
        
        {/* Official Featured Channels */}
        <section className="space-y-6">
            <div className="flex items-center gap-2 px-2">
                <Share2 className="h-4 w-4 text-primary opacity-40" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Featured Official Channels</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {officialChannels.map((channel) => (
                    <Link key={channel.name} href={channel.url} target="_blank" className="group">
                        <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden transition-all duration-500 hover:translate-y-[-4px] hover:shadow-2xl">
                            <CardContent className="p-8 flex items-center gap-6">
                                <div className={`h-20 w-20 rounded-[1.8rem] ${channel.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500 shrink-0`}>
                                    <div className="relative h-12 w-12">
                                        <Image 
                                            src={channel.icon} 
                                            alt={channel.name} 
                                            fill 
                                            className="object-contain brightness-0 invert" 
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5 flex-1 min-w-0">
                                    <h4 className="text-xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">
                                        {channel.name}
                                    </h4>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase leading-relaxed tracking-tight line-clamp-2">
                                        {channel.description}
                                    </p>
                                    <div className="pt-2 flex items-center gap-2 text-primary">
                                        <span className="text-[9px] font-black uppercase tracking-widest">Connect Now</span>
                                        <ExternalLink className="h-3 w-3" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </section>

        {/* Community Hubs (Database Driven) */}
        <section className="space-y-6">
            <div className="flex items-center gap-2 px-2">
                <Share2 className="h-4 w-4 text-primary opacity-40" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Community Hubs</h3>
            </div>

            {dbLinks && dbLinks.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {(dbLinks as SocialLink[]).map((link) => (
                        <Link key={link.id} href={link.social_link} target="_blank" className="group">
                            <Card className="border-none shadow-lg rounded-[2rem] bg-white overflow-hidden text-center transition-all duration-500 hover:bg-slate-50">
                                <CardContent className="p-6 space-y-4">
                                    <div className="relative h-14 w-14 mx-auto overflow-hidden rounded-2xl bg-slate-50 p-3 group-hover:scale-110 transition-transform">
                                        <Image
                                            src={link.icon_url}
                                            alt={`${link.name} icon`}
                                            fill
                                            className="object-contain p-2"
                                            data-ai-hint="social icon"
                                        />
                                    </div>
                                    <span className="block text-[10px] font-black uppercase tracking-widest text-slate-900 truncate px-2">{link.name}</span>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="flex h-48 flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-white/50">
                    <p className="text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        Additional hubs will be updated soon.
                    </p>
                </div>
            )}
        </section>

        {/* Support Footer */}
        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-center space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
            <h4 className="text-white text-lg font-black uppercase italic tracking-tighter">Need Direct Assistance?</h4>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest leading-relaxed max-w-xs mx-auto">
                Our support terminals are active 24/7 on the official WhatsApp Channel.
            </p>
            <div className="pt-4">
                <Link href="https://whatsapp.com/channel/0029Vb6EqdYLY6d5HhajEb3A" target="_blank" className="inline-flex items-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">
                    Launch Support <MessageCircle className="h-4 w-4 text-green-500" />
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
}
