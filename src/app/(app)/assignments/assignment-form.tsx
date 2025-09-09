
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useTransition } from 'react';
import { Loader2 } from 'lucide-react';
import { submitAssignment } from './actions';
import { useRouter } from 'next/navigation';
import type { Task } from '@/lib/types';

const formSchema = z.object({
  taskId: z.string(),
  title: z.string().min(3, { message: 'Title must be at least 3 characters long.' }),
  url1: z.string().url({ message: 'A valid URL is required.' }),
  url2: z.string().url().optional().or(z.literal('')),
  url3: z.string().url().optional().or(z.literal('')),
  url4: z.string().url().optional().or(z.literal('')),
});

interface AssignmentFormProps {
    task: Task;
}

export function AssignmentForm({ task }: AssignmentFormProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      taskId: task.id,
      title: task.title || '',
      url1: '',
      url2: '',
      url3: '',
      url4: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const result = await submitAssignment(values);
      if (result?.error) {
        toast({
          variant: 'destructive',
          title: 'Submission Failed',
          description: result.error,
        });
      } else {
        toast({
          title: 'Success!',
          description: `Your submission for "${task.title}" has been received.`,
        });
        form.reset();
        router.refresh(); 
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <input type="hidden" {...form.register('taskId')} />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assignment Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Daily Education Tasks" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
            control={form.control}
            name="url1"
            render={({ field }) => (
                <FormItem>
                <FormLabel className="font-semibold text-primary">Task Proof URL 1 (Required)</FormLabel>
                <FormControl>
                    <Input placeholder="Paste proof URL here..." {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="url2"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Task Proof URL 2</FormLabel>
                <FormControl>
                    <Input placeholder="Paste proof URL here..." {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="url3"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Task Proof URL 3</FormLabel>
                <FormControl>
                    <Input placeholder="Paste proof URL here..." {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
             <FormField
            control={form.control}
            name="url4"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Task Proof URL 4</FormLabel>
                <FormControl>
                    <Input placeholder="Paste proof URL here..." {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit Task
        </Button>
      </form>
    </Form>
  );
}
