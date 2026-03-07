
'use client';

import { useEffect, useState } from 'react';
import { Moon, Star } from 'lucide-react';

const LanternIcon = ({ size, className }: { size: number; className?: string }) => (
  <svg 
    width={size} 
    height={size * 1.5} 
    viewBox="0 0 24 36" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
  >
    <path d="M12 2V5M12 31V34M6 10C6 6.68629 8.68629 4 12 4C15.3137 4 18 6.68629 18 10V26C18 29.3137 15.3137 32 12 32C8.68629 32 6 29.3137 6 26V10Z" stroke="currentColor" strokeWidth="2" />
    <path d="M6 12H18M6 24H18M12 4V32" stroke="currentColor" strokeWidth="1" />
    <circle cx="12" cy="18" r="3" fill="currentColor" fillOpacity="0.3" />
  </svg>
);

export function FloatingRamazanElements() {
  const [elements, setElements] = useState<{ id: number; x: number; size: number; delay: number; duration: number; type: 'moon' | 'star' | 'lantern'; color: string }[]>([]);

  useEffect(() => {
    // Generate festive elements on mount
    const newElements = Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      x: Math.random() * 95,
      size: Math.random() * (25 - 12) + 12,
      delay: Math.random() * 10,
      duration: Math.random() * (25 - 15) + 15,
      type: i % 3 === 0 ? 'lantern' : i % 3 === 1 ? 'moon' : 'star' as any,
      color: i % 2 === 0 ? 'text-emerald-500' : 'text-amber-400',
    }));
    setElements(newElements);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[100] select-none">
      {elements.map((el) => (
        <div
          key={el.id}
          className={`absolute bottom-[-100px] animate-float-up opacity-30 ${el.color}`}
          style={{
            left: `${el.x}%`,
            animationDelay: `${el.delay}s`,
            animationDuration: `${el.duration}s`,
          }}
        >
          {el.type === 'moon' && <Moon size={el.size} fill="currentColor" />}
          {el.type === 'star' && <Star size={el.size} fill="currentColor" />}
          {el.type === 'lantern' && <LanternIcon size={el.size} />}
        </div>
      ))}
      <style jsx global>{`
        @keyframes ramazan-float-above {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.3;
          }
          90% {
            opacity: 0.3;
          }
          100% {
            transform: translateY(-125vh) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-float-up {
          animation-name: ramazan-float-above;
          animation-iteration-count: infinite;
          animation-timing-function: linear;
        }
      `}</style>
    </div>
  );
}
