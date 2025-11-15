
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
    <div className="relative rounded-lg p-6 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500"
         style={{ backgroundSize: '200% 200%', animation: 'gradient-bg 5s ease infinite' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 border-2 border-primary-foreground/50">
            <AvatarImage src={avatarUrl || ''} alt={`@${username}`} data-ai-hint="profile picture" />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-lg font-semibold text-primary-foreground">{name}</p>
            <p className="text-sm text-primary-foreground/80">@{username}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
