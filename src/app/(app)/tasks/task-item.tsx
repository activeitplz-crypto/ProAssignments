
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ExternalLink, PlayCircle, Eye, Sparkles } from 'lucide-react';
import type { Task } from '@/lib/types';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  task: Task;
  taskNumber: number;
}

export function TaskItem({ task, taskNumber }: TaskItemProps) {
  const [isViewed, setIsViewed] = useState(false);

  const handleViewClick = () => {
    setIsViewed(true);
  };

  return (
    <div className="group relative overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-sm transition-all duration-500 hover:shadow-xl hover:translate-y-[-2px] active:scale-[0.99]">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        
        <div className="flex items-center gap-5">
            {/* Elegant Circular Numbering */}
            <div className="relative">
                <div className="h-14 w-14 rounded-[1.5rem] bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-primary group-hover:border-primary transition-all duration-500">
                    <span className="text-xl font-black text-slate-900 group-hover:text-white leading-none transition-colors">{taskNumber}</span>
                </div>
                {isViewed && (
                    <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
                        <PlayCircle className="h-3 w-3 text-white" />
                    </div>
                )}
            </div>

            <div className="space-y-1">
                <div className="flex items-center gap-2">
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-primary">Standard Task</span>
                    <Sparkles className="h-2.5 w-2.5 text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="font-black text-slate-900 uppercase tracking-tighter text-lg leading-none">{task.title}</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-50 tracking-widest">Handwritten Proof Required</p>
            </div>
        </div>

        <Button 
          asChild 
          onClick={handleViewClick} 
          className={cn(
            "h-14 px-8 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all duration-500 shadow-lg",
            isViewed 
                ? "bg-slate-900 hover:bg-slate-800 text-white" 
                : "bg-primary hover:bg-primary/90 text-white shadow-primary/20"
          )}
        >
          <Link href={task.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
            {isViewed ? (
                <>
                    <Eye className="h-4 w-4" />
                    <span>Review Task</span>
                </>
            ) : (
                <>
                    <ExternalLink className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                    <span>Launch Task</span>
                </>
            )}
          </Link>
        </Button>
      </div>

      {/* Modern Background Accents */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -mr-12 -mt-12 transition-opacity opacity-0 group-hover:opacity-100" />
    </div>
  );
}
