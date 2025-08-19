"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clipboard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ReferralLinkCardProps {
  referralLink: string;
}

export function ReferralLinkCard({ referralLink }: ReferralLinkCardProps) {
  const { toast } = useToast();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      toast({
        title: "Copied to clipboard!",
        description: "Your referral link has been copied.",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Failed to copy",
        description: "Could not copy the link to your clipboard.",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Your Referral Link</CardTitle>
        <CardDescription>
          Share this link to invite others and earn bonuses.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center gap-4">
        <input
          readOnly
          value={referralLink}
          className="flex-1 rounded-md border bg-muted px-3 py-2 text-sm"
        />
        <Button
          variant="outline"
          onClick={copyToClipboard}
        >
          <Clipboard className="mr-2 h-4 w-4" /> Copy
        </Button>
      </CardContent>
    </Card>
  );
}
