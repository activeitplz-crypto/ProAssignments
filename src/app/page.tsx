
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, TrendingUp, ShieldCheck, Video, Sparkles } from 'lucide-react';
import { Logo } from '@/components/logo';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { getYouTubeEmbedUrl } from '@/lib/utils';

export default async function LandingPage() {
  const supabase = await createClient();
  
  const { data: latestVideo } = await supabase
    .from('videos')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const embedUrl = latestVideo ? getYouTubeEmbedUrl(latestVideo.url) : null;

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <header className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Logo />
        <nav className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild className="font-bold text-slate-600">
                <Link href="/login">Login</Link>
            </Button>
            <Button asChild className="rounded-full px-6 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 font-black uppercase tracking-widest text-[10px]">
                <Link href="/signup">Get Started <ArrowRight className="ml-2 h-3.5 w-3.5" /></Link>
            </Button>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto flex flex-col items-center justify-center space-y-10 px-4 py-16 text-center md:py-24 lg:py-32">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/10 px-4 py-1.5 rounded-full">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Official Handwriting Platform</span>
            </div>
            <h1 className="font-display text-6xl font-bold tracking-tight text-slate-900 md:text-8xl flex flex-col items-center leading-none">
              <span>Assignment</span>
              <span className="text-primary italic">Work</span>
            </h1>
            <p className="max-w-[600px] mx-auto text-sm font-medium text-muted-foreground md:text-base leading-relaxed">
              Monetize your handwriting skills through our secure digital ecosystem. Join thousands of students and professionals earning daily income.
            </p>
          </div>

          <div className="flex flex-col items-center gap-8 w-full max-w-md">
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                <Button size="lg" asChild className="h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-xs shadow-2xl shadow-primary/30 group">
                <Link href="/signup">
                    Start Earning Today
                    <TrendingUp className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                </Button>
            </div>
          </div>
        </section>

        {/* Video Tutorial Section */}
        <section className="py-20 bg-slate-900 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -mr-48 -mt-48" />
            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto space-y-12">
                    <div className="text-center space-y-3">
                        <div className="flex items-center justify-center gap-2">
                            <span className="text-primary font-black uppercase text-[10px] tracking-[0.3em]">Work Station Guide</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic text-white">How to Work on <span className="text-primary">ProAssignment</span></h2>
                        <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest">Watch the complete workflow to maximize your daily success</p>
                    </div>

                    <div className="relative aspect-video rounded-[2.5rem] overflow-hidden border-8 border-white/5 shadow-2xl bg-black/40">
                        <iframe
                            src="https://www.youtube.com/embed/QosrndbuZQk"
                            title="Work Tutorial"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="h-full w-full"
                        ></iframe>
                    </div>
                </div>
            </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-black tracking-tighter text-center mb-16 uppercase italic text-slate-900 md:text-5xl">
              Path to <span className="text-primary">Revenue</span>
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                { title: "Choose Plan", desc: "Select a certified investment plan that matches your goals. Higher plans unlock more daily assignments.", icon: TrendingUp },
                { title: "Complete Tasks", desc: "Write assigned work by hand and upload proof. Our AI scans ensure instant verification.", icon: Video },
                { title: "Get Paid", desc: "Earnings are added instantly to your balance. Withdraw to Easypaisa or JazzCash daily.", icon: ShieldCheck }
              ].map((item, i) => (
                <Card key={i} className="border-none shadow-xl rounded-[2.5rem] bg-slate-50 overflow-hidden group hover:bg-primary transition-all duration-500">
                  <CardHeader className="p-10 space-y-6">
                    <div className="h-16 w-16 rounded-2xl bg-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                        <item.icon className="h-8 w-8 text-primary" />
                    </div>
                    <div className="space-y-2">
                        <CardTitle className="text-2xl font-black uppercase tracking-tighter italic text-slate-900 group-hover:text-white transition-colors">{item.title}</CardTitle>
                        <CardDescription className="text-sm font-medium leading-relaxed group-hover:text-white/70 transition-colors">
                            {item.desc}
                        </CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* Compliance Section */}
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid items-center gap-16 md:grid-cols-2">
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-4xl font-black tracking-tighter uppercase italic text-slate-900 leading-tight">
                                Officially Recognized <br/>
                                <span className="text-primary">& Secure</span>
                            </h2>
                            <p className="text-base font-medium text-muted-foreground leading-relaxed">
                                ProAssignment is a registered platform operating under the guidelines of FBR (Federal Board of Revenue) and PSEB (Pakistan Software Export Board). We provide a legitimate ecosystem for digital handwriting monetization.
                            </p>
                        </div>
                        
                        <div className="grid gap-4">
                            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl shadow-sm border border-slate-100">
                                <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-600">
                                    <ShieldCheck className="h-5 w-5" />
                                </div>
                                <span className="text-xs font-black uppercase tracking-tight text-slate-700">FBR Registered Business</span>
                            </div>
                            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl shadow-sm border border-slate-100">
                                <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600">
                                    <ShieldCheck className="h-5 w-5" />
                                </div>
                                <span className="text-xs font-black uppercase tracking-tight text-slate-700">PSEB Verified Member</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-primary/10 rounded-[3rem] blur-2xl group-hover:bg-primary/20 transition-all" />
                            <Image 
                                src="https://i.postimg.cc/vBn0tJ9N/IMG-20250930-WA0001.jpg" 
                                alt="FBR and PSEB Approval" 
                                width={450} 
                                height={450}
                                className="rounded-[2.5rem] shadow-2xl relative z-10 border-8 border-white"
                                data-ai-hint="approval document"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* App CTA */}
        <section className="py-24 container mx-auto px-4">
            <div className="bg-primary rounded-[3.5rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-primary/30">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -mr-48 -mt-48" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/5 rounded-full blur-[80px] -ml-32 -mb-32" />
                
                <div className="max-w-2xl mx-auto space-y-8 relative z-10">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-md">
                            <Sparkles className="h-3.5 w-3.5 text-white" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white">Mobile Terminal</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase italic leading-none">Download Our <br/>Mobile App</h2>
                        <p className="text-white/60 text-sm md:text-base font-medium">Get the elite experience with native notifications and faster AI verification.</p>
                    </div>
                    <Button asChild size="lg" className="h-16 px-12 rounded-2xl bg-white text-primary hover:bg-slate-50 font-black uppercase tracking-[0.2em] text-[11px] shadow-xl group">
                        <Link href="https://web2apkpro.com/public_download.php?project_id=2547&token=e3a1121a43" target="_blank">
                            Download Now <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
      </main>

      <footer className="container mx-auto px-4 py-12 text-center">
        <div className="flex flex-col items-center gap-6">
            <Logo />
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">&copy; {new Date().getFullYear()} ProAssignment. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
