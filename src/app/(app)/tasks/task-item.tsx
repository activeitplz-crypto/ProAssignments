
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
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
    <div className="rounded-lg border bg-card p-4 transition-colors hover:bg-muted/50">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                {taskNumber}
            </div>
            <p className="font-semibold">{task.title}</p>
        </div>
        <Button asChild onClick={handleViewClick} className={cn(isViewed && 'bg-blue-600 hover:bg-blue-700 text-white')}>
          <Link href={task.url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            View Task
          </Link>
        </Button>
      </div>
    </div>
  );
}
