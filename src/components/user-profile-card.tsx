'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2 } from 'lucide-react';

interface UserProfileCardProps {
  name: string;
  username: string;
  avatarUrl?: string | null;
  isVerified?: boolean;
}

export function UserProfileCard({ name, username, avatarUrl, isVerified = true }: UserProfileCardProps) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8 shadow-2xl">
      {/* Decorative background elements */}
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-pink-400/20 blur-3xl" />
      
      <div className="relative flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
        <div className="relative">
          <Avatar className="h-24 w-24 border-4 border-white/30 shadow-xl md:h-28 md:w-28">
            <AvatarImage src={avatarUrl || ''} alt={`@${username}`} className="object-cover" data-ai-hint="user avatar" />
            <AvatarFallback className="bg-white/20 text-2xl font-bold text-white backdrop-blur-md">
              {initials}
            </AvatarFallback>
          </Avatar>
          {isVerified && (
            <div className="absolute -right-1 bottom-1 rounded-full bg-white p-1 shadow-lg">
              <CheckCircle2 className="h-6 w-6 text-blue-500 fill-blue-50" />
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            {name}
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
            <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-md border-none">
              @{username}
            </Badge>
            <Badge variant="secondary" className="bg-green-400/20 text-green-100 border-none backdrop-blur-md">
              Verified Partner
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
