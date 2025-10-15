
'use client';

import { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';

interface OfferCountdownProps {
  expiresAt: string;
}

export function OfferCountdown({ expiresAt }: OfferCountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(expiresAt) - +new Date();
      let newTimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

      if (difference > 0) {
        newTimeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
        setTimeLeft(newTimeLeft);
        setIsExpired(false);
      } else {
        setIsExpired(true);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [expiresAt]);

  if (isExpired) {
    return (
        <div className="flex items-center justify-center gap-2 rounded-t-md bg-destructive/10 p-2 text-sm font-semibold text-destructive">
            <Timer className="h-4 w-4" />
            <span>Offer Expired!</span>
        </div>
    );
  }

  return (
    <div className="rounded-t-md bg-primary/10 p-2 text-center text-sm font-semibold text-primary">
      <div className="flex items-center justify-center gap-2">
        <Timer className="h-4 w-4" />
        <span>Offer ends in:</span>
      </div>
      <div className="font-mono text-lg">
        {timeLeft.days > 0 && <span>{timeLeft.days}d </span>}
        <span>{String(timeLeft.hours).padStart(2, '0')}h </span>
        <span>{String(timeLeft.minutes).padStart(2, '0')}m </span>
        <span>{String(timeLeft.seconds).padStart(2, '0')}s</span>
      </div>
    </div>
  );
}
