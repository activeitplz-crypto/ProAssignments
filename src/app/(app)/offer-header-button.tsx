
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Timer } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Plan } from '@/lib/types';
import { cn } from '@/lib/utils';

export function OfferHeaderButton() {
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
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft(
          `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
            2,
            '0'
          )}:${String(seconds).padStart(2, '0')}`
        );
      } else {
        setTimeLeft('Offer Ended');
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeOffer]);

  if (loading) {
    return <Skeleton className="h-9 w-32" />;
  }

  if (activeOffer && timeLeft !== 'Offer Ended') {
    return (
      <Button variant="default" size="sm" className="animate-pulse bg-green-600 text-white hover:bg-green-700" asChild>
        <Link href="/plans">
          Special Offer! {timeLeft}
        </Link>
      </Button>
    );
  }

  // Render the standard plans button if no offer is active
  return (
    <Button variant="outline" size="sm" asChild>
      <Link href="/plans">Plans</Link>
    </Button>
  );
}
