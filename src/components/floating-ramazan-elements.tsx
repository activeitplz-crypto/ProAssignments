
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
    const newElements = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 95,
      size: Math.random() * (25 - 12) + 12,
      delay: Math.random() * 10,
      duration: Math.random() * (25 - 15) + 15,
      type: (i % 3 === 0 ? 'lantern' : i % 3 === 1 ? 'moon' : 'star') as 'moon' | 'star' | 'lantern',
      color: i % 2 === 0 ? 'text-emerald-500' : 'text-amber-400',
    }));
    setElements(newElements);
  }, []);

  return (
    <>
      {/* Festive floating particles in background layer */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[90] select-none">
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
      </div>

      {/* FIXED Central Floating Message - Stays visible during scroll */}
      <div className="fixed top-[100px] left-1/2 -translate-x-1/2 z-[150] pointer-events-none select-none flex flex-col items-center animate-float-msg">
          <div className="bg-emerald-600/10 backdrop-blur-[8px] border border-emerald-500/20 px-6 py-2.5 rounded-full shadow-[0_20px_50px_-12px_rgba(0,0,0,0.2)] flex items-center gap-3">
              <Moon className="h-3 w-3 text-emerald-500 fill-emerald-500" />
              <div className="flex flex-col items-center">
                <span className="text-[7px] font-black uppercase tracking-[0.4em] text-emerald-600/60 leading-none mb-0.5">Mubarak</span>
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-700 leading-none">Ramazan Kareem</span>
              </div>
              <Star className="h-2.5 w-2.5 text-amber-400 fill-amber-400" />
          </div>
      </div>

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
        @keyframes ramazan-float-msg {
          0%, 100% { transform: translate(-50%, 0); }
          50% { transform: translate(-50%, -10px); }
        }
        .animate-float-up {
          animation-name: ramazan-float-above;
          animation-iteration-count: infinite;
          animation-timing-function: linear;
        }
        .animate-float-msg {
          animation: ramazan-float-msg 4s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
