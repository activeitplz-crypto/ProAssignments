'use client';

import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Zap, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const names = [
  'Zohaib', 'Kiran', 'Sajid', 'Mehak', 'Bilal', 'Ayesha', 'Hamza', 'Nida', 
  'Usman', 'Hina', 'Farhan', 'Iqra', 'Saad', 'Laiba', 'Shahzaib', 'Mahnoor', 
  'Rabia', 'Arsalan', 'Komal', 'Junaid', 'Saba', 'Rehan', 'Mishal', 'Kamran', 
  'Zoya', 'Imran', 'Mahira'
];

const plans = [
  'Basic Plan', 'Standard Plan', 'Advanced Plan', 'Premium Plan', 
  'Elite Plan', 'Pro Plan', 'Business Plan', 'Ultimate Plan'
];

const times = [
  'just now', '5 seconds ago', '2 minutes ago', '10 minutes ago', 
  '45 minutes ago', '1 hour ago', '3 hours ago', '5 hours ago', '8 hours ago'
];

export function PurchaseNotification() {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState({ name: '', plan: '', time: '' });
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const checkDisplayEligibility = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      // Rule: "dont show to those have account"
      if (session) return;

      // Rule: "show once in 8 hour"
      const lastShownKey = 'pro_assignment_notify_timestamp';
      const lastShown = localStorage.getItem(lastShownKey);
      const now = Date.now();
      const eightHours = 8 * 60 * 60 * 1000;

      if (lastShown && (now - parseInt(lastShown)) < eightHours) {
        return;
      }

      setShouldRender(true);

      // Rule: "show only when someone spend 15 second on website"
      const timer = setTimeout(() => {
        // Pick random data
        const name = names[Math.floor(Math.random() * names.length)];
        const plan = plans[Math.floor(Math.random() * plans.length)];
        const time = times[Math.floor(Math.random() * times.length)];
        
        setData({ name, plan, time });
        setVisible(true);
        localStorage.setItem(lastShownKey, now.toString());

        // Rule: "must be for 4 second"
        setTimeout(() => {
          setVisible(false);
        }, 4000);
      }, 15000);

      return () => clearTimeout(timer);
    };

    checkDisplayEligibility();
  }, []);

  if (!shouldRender) return null;

  return (
    <div
      className={cn(
        "fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-[340px] transition-all duration-700 ease-in-out transform",
        visible ? "translate-y-0 opacity-100" : "-translate-y-12 opacity-0 pointer-events-none"
      )}
    >
      <div className="bg-white/95 backdrop-blur-xl border border-primary/20 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] rounded-2xl p-3 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 shadow-inner">
          <Zap className="h-5 w-5 text-primary animate-pulse" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-black uppercase tracking-tight text-slate-900 truncate">
            {data.name} <span className="text-primary/60 font-bold">activated</span>
          </p>
          <div className="flex items-center gap-1.5">
            <p className="text-[10px] font-black text-slate-900 italic tracking-tighter truncate">
              {data.plan}
            </p>
            <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest leading-none shrink-0">
              • {data.time}
            </span>
          </div>
        </div>
        <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center shrink-0 border border-green-500/10">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
        </div>
      </div>
    </div>
  );
}
