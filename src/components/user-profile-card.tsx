'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronRight } from 'lucide-react';

interface UserProfileCardProps {
  name: string;
  username: string;
}

export function UserProfileCard({ name, username }: UserProfileCardProps) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('');

  return (
    <div className="flex items-center justify-between rounded-lg bg-card p-4">
      <div className="flex items-center gap-4">
        <Avatar className="h-14 w-14 border-2 border-primary">
          <AvatarImage src="https://placehold.co/100x100.png" alt={`@${name}`} data-ai-hint="profile picture" />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-lg font-semibold">{name}</p>
          <p className="text-sm text-muted-foreground">@{username}</p>
        </div>
      </div>
      <ChevronRight className="h-6 w-6 text-muted-foreground" />
    </div>
  );
}
