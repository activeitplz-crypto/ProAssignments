
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Timer, Zap } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Plan } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

export function OfferBanner() {
  const [activeOffer, setActiveOffer] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const fetchActiveOffer = async () => {
      const supabase = createClient();
      const { data: plans } = await supabase
        .from('plans')
        .select('*')
        .not('original_investment', 'is', null)
        .not('offer_expires_at', 'is', null)
        .order('investment', { ascending: true });
        
      const now = new Date();
      const firstActiveOffer = (plans || []).find(
        (plan) => plan.offer_expires_at && new Date(plan.offer_expires_at) > now
      );

      setActiveOffer(firstActiveOffer || null);
      setLoading(false);
    };

    fetchActiveOffer();
  }, []);

  useEffect(() => {
    if (!activeOffer?.offer_expires_at) return;

    const interval = setInterval(() => {
      const difference = +new Date(activeOffer.offer_expires_at!) - +new Date();
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        let countdownString = '';
        if (days > 0) countdownString += `${days}d `;
        countdownString += `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
        
        setTimeLeft(countdownString);
      } else {
        setTimeLeft('Offer Ended');
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeOffer]);

  if (loading) {
    return <Skeleton className="h-24 w-full" />;
  }

  if (!activeOffer || timeLeft === 'Offer Ended') {
    // If no offer, show a generic prompt to buy a plan
    return (
       <Alert className="border-primary bg-primary/5">
        <Zap className="h-4 w-4" />
        <AlertTitle className="font-headline">Get Started!</AlertTitle>
        <AlertDescription>
          You don't have an active plan. Purchase one to start earning today.
           <Button asChild size="sm" className="ml-4">
              <Link href="/plans">View Plans</Link>
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert className="border-green-500 bg-green-500/10">
        <Timer className="h-4 w-4 text-green-700" />
        <AlertTitle className="font-headline text-green-800">Special Offer Active!</AlertTitle>
        <AlertDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
           <div>
            <p className="text-green-700">Limited-time prices are available. Don't miss out!</p>
            <p className="font-mono text-sm font-semibold text-green-800">
                Ends in: {timeLeft}
            </p>
           </div>
           <Button asChild size="sm" className="mt-2 sm:mt-0 bg-green-600 hover:bg-green-700">
              <Link href="/plans">View Offer</Link>
          </Button>
        </AlertDescription>
      </Alert>
  );
}
