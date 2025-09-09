
import { cn } from '@/lib/utils';
import Image from 'next/image';

export function ProAssignmentIcon({ className }: { className?: string }) {
  // A valid default icon is used here to prevent crashes.
  // To use your own icon, upload it to a service like Postimages.org,
  // get the "Direct Link", and paste it here.
  const iconUrl = "https://i.postimg.cc/VNmhm0H5/IMG-20250819-WA0033.jpg";

  return (
    <div className={cn("relative overflow-hidden rounded-full", className)}>
       <Image 
         src={iconUrl} 
         alt="ProAssignment Icon"
         width={40}
         height={40}
         className="object-cover"
         data-ai-hint="app icon"
        />
    </div>
  );
}
