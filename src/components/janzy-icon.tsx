
import { cn } from '@/lib/utils';
import Image from 'next/image';

export function JanzyIcon({ className }: { className?: string }) {
  // TODO: Replace this placeholder with your icon URL from postimages
  const iconUrl = "https://placehold.co/40x40.png";

  return (
    <div className={cn("relative", className)}>
       <Image 
         src={iconUrl} 
         alt="Janzy Icon"
         width={40}
         height={40}
         className="object-contain"
         data-ai-hint="app icon"
        />
    </div>
  );
}
