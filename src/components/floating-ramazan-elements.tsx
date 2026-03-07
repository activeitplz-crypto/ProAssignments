
'use client';

import { useEffect, useState } from 'react';
import { Moon, Star } from 'lucide-react';

export function FloatingRamazanElements() {
  const [elements, setElements] = useState<{ id: number; x: number; size: number; delay: number; duration: number; type: 'moon' | 'star' }[]>([]);

  useEffect(() => {
    // Generate festive elements on mount
    const newElements = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * (20 - 10) + 10,
      delay: Math.random() * 10,
      duration: Math.random() * (25 - 15) + 15,
      type: Math.random() > 0.4 ? 'star' : 'moon' as 'star' | 'moon',
    }));
    setElements(newElements);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {elements.map((el) => (
        <div
          key={el.id}
          className="absolute bottom-[-100px] animate-float-up opacity-[0.08] text-emerald-600"
          style={{
            left: `${el.x}%`,
            animationDelay: `${el.delay}s`,
            animationDuration: `${el.duration}s`,
          }}
        >
          {el.type === 'moon' ? (
            <Moon size={el.size} fill="currentColor" />
          ) : (
            <Star size={el.size} fill="currentColor" />
          )}
        </div>
      ))}
      <style jsx global>{`
        @keyframes ramazan-float {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.1;
          }
          90% {
            opacity: 0.1;
          }
          100% {
            transform: translateY(-125vh) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-float-up {
          animation-name: ramazan-float;
          animation-iteration-count: infinite;
          animation-timing-function: linear;
        }
      `}</style>
    </div>
  );
}
