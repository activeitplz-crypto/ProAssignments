
'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { ExternalLink, CheckCircle, Loader2 } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { submitSingleTask } from './actions';
import type { Task } from '@/lib/types';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  proof_url: z.string().url({ message: 'Please provide a valid proof URL.' }),
  task_id: z.string(),
  task_title: z.string(),
});

interface TaskItemProps {
  task: Task;
  taskNumber: number;
  isSubmitted: boolean;
}

export function TaskItem({ task, taskNumber, isSubmitted: initiallySubmitted }: TaskItemProps) {
  const [isPending, startTransition] = useTransition();
  const [isSubmitted, setIsSubmitted] = useState(initiallySubmitted);
  const [isViewed, setIsViewed] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      proof_url: '',
      task_id: task.id,
      task_title: task.title,
    },
  });

  const handleViewClick = () => {
    setIsViewed(true);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const result = await submitSingleTask(values);
      if (result?.error) {
        toast({
          variant: 'destructive',
          title: 'Submission Failed',
          description: result.error,
        });
      } else {
        toast({
          title: 'Success!',
          description: `Task #${taskNumber} submitted for review.`,
        });
        setIsSubmitted(true);
        form.reset();
      }
    });
  }

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

      <div className="mt-4">
        {isSubmitted ? (
          <div className="flex items-center justify-center gap-2 rounded-md border-2 border-dashed border-green-500 bg-green-500/10 p-6 text-green-700">
            <CheckCircle className="h-6 w-6" />
            <p className="font-semibold">Task #{taskNumber} Already Submitted</p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-end gap-2 sm:flex-row">
              <FormField
                control={form.control}
                name="proof_url"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="sr-only">Proof URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Paste proof URL here (e.g., screenshot link)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Proof
              </Button>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
}
