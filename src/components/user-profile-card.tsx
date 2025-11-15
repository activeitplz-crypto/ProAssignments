
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface UserProfileCardProps {
  name: string;
  username: string;
  avatarUrl?: string | null;
}

export function UserProfileCard({ name, username, avatarUrl }: UserProfileCardProps) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('');

  return (
    <div className="relative rounded-lg p-px bg-gradient-to-r from-primary/50 to-accent/50">
        <div className="flex items-center justify-between rounded-[calc(var(--radius)-1px)] bg-card p-4">
            <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14 border-2 border-primary">
                <AvatarImage src={avatarUrl || ''} alt={`@${username}`} data-ai-hint="profile picture" />
                <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div>
                <p className="text-lg font-semibold">{name}</p>
                <p className="text-sm text-muted-foreground">@{username}</p>
                </div>
            </div>
        </div>
    </div>
  );
}
