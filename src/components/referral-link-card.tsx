
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Copy, Check } from 'lucide-react';

interface ReferralLinkCardProps {
  referralLink: string;
}

export function ReferralLinkCard({ referralLink }: ReferralLinkCardProps) {
  const [hasCopied, setHasCopied] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink).then(
      () => {
        toast({ title: 'Copied!', description: 'Referral link copied to clipboard.' });
        setHasCopied(true);
        setTimeout(() => setHasCopied(false), 2000); // Reset icon after 2 seconds
      },
      (err) => {
        toast({ variant: 'destructive', title: 'Failed to copy', description: 'Could not copy the link.' });
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Your Referral Link</CardTitle>
        <CardDescription>
          Share this link with your friends. When they sign up and invest, you earn a bonus!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex w-full items-center space-x-2">
          <Input value={referralLink} readOnly className="flex-1" />
          <Button type="button" size="icon" onClick={copyToClipboard} aria-label="Copy referral link">
            {hasCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
