
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
import type { Profile } from '@/lib/types';

const formSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters long.' }),
  url1: z.string().url({ message: 'Please provide a valid URL.' }),
  url2: z.string().url().optional().or(z.literal('')),
  url3: z.string().url().optional().or(z.literal('')),
  url4: z.string().url().optional().or(z.literal('')),
  url5: z.string().url().optional().or(z.literal('')),
});

interface AssignmentFormProps {
  user: Pick<Profile, 'id' | 'name'>;
}

export function AssignmentForm({ user }: AssignmentFormProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      url1: '',
      url2: '',
      url3: '',
      url4: '',
      url5: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
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
          title: 'Success',
          description: 'Your assignment has been submitted for review.',
        });
        form.reset();
        router.refresh();
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
         <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
             <div className="rounded-lg border bg-muted p-3">
                <FormLabel>Your Name</FormLabel>
                <p className="font-semibold text-foreground">{user.name || 'N/A'}</p>
            </div>
            <div className="rounded-lg border bg-muted p-3">
                <FormLabel>Your User ID</FormLabel>
                <p className="font-semibold text-foreground">{user.id}</p>
            </div>
         </div>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assignment Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Week 1 Social Media Tasks" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-3">
            <FormField
            control={form.control}
            name="url1"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Task URL 1 (Required)</FormLabel>
                <FormControl>
                    <Input placeholder="https://..." {...field} />
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
                <FormLabel>Task URL 2 (Optional)</FormLabel>
                <FormControl>
                    <Input placeholder="https://..." {...field} />
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
                <FormLabel>Task URL 3 (Optional)</FormLabel>
                <FormControl>
                    <Input placeholder="https://..." {...field} />
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
                <FormLabel>Task URL 4 (Optional)</FormLabel>
                <FormControl>
                    <Input placeholder="https://..." {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
             <FormField
            control={form.control}
            name="url5"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Task URL 5 (Optional)</FormLabel>
                <FormControl>
                    <Input placeholder="https://..." {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit Assignment
        </Button>
      </form>
    </Form>
  );
}
