
'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
} from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';
import { Zap, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NoPlanPopupProps {
  hasPlan: boolean;
}

export function NoPlanPopup({ hasPlan }: NoPlanPopupProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Show after 5 seconds delay when the user logs in
    if (!hasPlan) {
      const showTimer = setTimeout(() => {
        setOpen(true);
      }, 5000);
      
      return () => clearTimeout(showTimer);
    }
  }, [hasPlan]);

  useEffect(() => {
    // Auto-close after 5 seconds of visibility as requested
    let hideTimer: NodeJS.Timeout;
    if (open) {
      hideTimer = setTimeout(() => {
        setOpen(false);
      }, 5000);
    }
    return () => clearTimeout(hideTimer);
  }, [open]);

  // If user has a plan, don't even render the component logic
  if (hasPlan) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden max-w-[400px] animate-in fade-in zoom-in-95 duration-500 [&>button]:text-white [&>button]:opacity-100 [&>button]:hover:bg-white/10 [&>button]:p-2 [&>button]:rounded-full [&>button]:transition-all [&>button]:z-50">
        {/* Header Section */}
        <div className="bg-primary p-10 text-white relative text-center">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-black/10 rounded-full blur-xl -ml-10 -mb-10" />
            
            <div className="flex flex-col items-center gap-4 relative z-10">
                <div className="h-20 w-20 rounded-[1.8rem] bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xl animate-bounce">
                    <ShieldAlert className="h-10 w-10 text-white" />
                </div>
                <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Status: Restricted</span>
                    <h2 className="text-3xl font-black tracking-tighter uppercase italic leading-none">No Active<br/>Plan Found</h2>
                </div>
            </div>
        </div>
        
        {/* Content Section */}
        <div className="p-10 space-y-8 text-center">
          <DialogDescription className="text-slate-600 text-sm font-medium leading-relaxed uppercase tracking-tight">
            Welcome to the terminal. To unlock daily assignments and start generating revenue, you must activate a certified investment plan.
          </DialogDescription>

          <div className="space-y-4">
            <Button 
                onClick={() => {
                    setOpen(false);
                    router.push('/plans');
                }}
                className="w-full h-16 rounded-[2rem] bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-primary/30 active:scale-[0.98] transition-all flex items-center justify-center gap-3 border-none"
            >
                <Zap className="h-4 w-4" />
                <span>Go to Plans Station</span>
            </Button>
            
            <button 
                onClick={() => setOpen(false)}
                className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors w-full py-2"
            >
                Continue as Guest
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
