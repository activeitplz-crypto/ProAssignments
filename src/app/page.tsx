
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, TrendingUp, ShieldCheck, FileCheck2, Sparkles } from 'lucide-react';
import { Logo } from '@/components/logo';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] overflow-x-hidden relative">
      
      <header className="sticky top-0 z-50 w-full bg-[#F8FAFC]/80 backdrop-blur-md border-b border-slate-100">
        <div className="container mx-auto flex h-20 items-center justify-between px-2 sm:px-4 md:px-6">
          <div className="shrink-0 scale-[0.65] sm:scale-90 md:scale-100 origin-left">
            <Logo />
          </div>
          <nav className="flex items-center">
            <div className="flex items-center gap-1 sm:gap-2">
              <Button variant="ghost" asChild className="font-bold text-slate-600 px-2 sm:px-4 text-[9px] sm:text-xs md:text-sm h-8 sm:h-10">
                  <Link href="/login">Login</Link>
              </Button>
              <Button asChild className="rounded-full px-2.5 sm:px-5 h-8 sm:h-9 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 font-black uppercase tracking-widest text-[7px] sm:text-[9px] shrink-0">
                  <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          </nav>
        </div>
      </header>

      <main className="flex-1 relative z-10">
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
            <p className="max-w-[600px] mx-auto text-sm font-medium text-muted-foreground md:text-base leading-relaxed px-4">
              Monetize your handwriting skills through our secure digital ecosystem. Join thousands of students and professionals earning daily income.
            </p>
          </div>

          <div className="flex flex-col items-center gap-8 w-full max-w-md px-4">
            <Button asChild className="h-11 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-primary/30 group w-full max-w-[220px]">
              <Link href="/signup" className="flex items-center justify-center">
                  Start Earning Now
                  <TrendingUp className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </section>

        <section className="py-24 bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-black tracking-tighter text-center mb-16 uppercase italic text-slate-900 md:text-5xl">
              Work <span className="text-primary">Roadmap</span>
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                { title: "Choose Plan", desc: "Select a certified investment plan that matches your goals. Higher plans unlock more daily assignments.", icon: TrendingUp },
                { title: "Complete Assignment", desc: "Write assigned work by hand and upload proof. Validation ensures your work meets the required standards.", icon: FileCheck2 },
                { title: "Get Paid", desc: "Earnings are added instantly to your balance. Withdraw to Easypaisa or JazzCash daily without referral requirements.", icon: ShieldCheck }
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
        
        <section className="py-24 bg-white/50">
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

        <footer className="container mx-auto px-4 py-12 text-center">
          <div className="flex flex-col items-center gap-6">
              <Logo />
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">&copy; {new Date().getFullYear()} ProAssignment. All Rights Reserved.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
