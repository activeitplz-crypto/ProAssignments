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
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useTransition } from 'react';
import { Loader2, Camera, Link as LinkIcon, Save } from 'lucide-react';
import { updateProfile } from './actions';
import { useRouter } from 'next/navigation';
import type { Profile } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  username: z.string().min(3, { message: 'Username must be at least 3 characters.' }).regex(/^[a-z0-9_]+$/, { message: 'Username can only contain lowercase letters, numbers, and underscores.' }),
  avatar_url: z.string().url({ message: 'Please enter a valid URL.' }).nullable().or(z.literal('')),
});

interface ProfileFormProps {
    user: Profile;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  
  const initials = user.name?.split(' ').map((n) => n[0]).join('').toUpperCase() || 'U';

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name || '',
      username: user.username || '',
      avatar_url: user.avatar_url || '',
    },
  });
  
  const avatarUrlPreview = form.watch('avatar_url');

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const result = await updateProfile(values);
      if (result?.error) {
        toast({
          variant: 'destructive',
          title: 'Update Failed',
          description: result.error,
        });
      } else {
        toast({
          title: 'Success',
          description: 'Your profile has been updated.',
        });
        router.refresh();
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="flex flex-col items-center gap-4">
            <FormLabel className="text-center font-bold uppercase tracking-widest text-muted-foreground">Photo</FormLabel>
            <div className="group relative">
              <Avatar className="h-32 w-32 border-4 border-primary/10 transition-transform group-hover:scale-105 shadow-md">
                  <AvatarImage src={avatarUrlPreview || ''} alt="User avatar" className="object-cover" data-ai-hint="user avatar" />
                  <AvatarFallback className="bg-primary/5 text-3xl font-bold text-primary">{initials}</AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <Camera className="h-8 w-8 text-white" />
              </div>
            </div>
            <Button type="button" variant="outline" size="sm" asChild className="w-full">
                <Link href="https://postimages.org/" target="_blank" className="flex items-center gap-2">
                  <LinkIcon className="h-4 w-4" />
                  Host Image
                </Link>
            </Button>
          </div>

          <div className="flex-1 space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your real name" {...field} className="bg-muted/30 focus:bg-background transition-colors" />
                  </FormControl>
                  <FormDescription>Your name as it appears on official documents.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Username</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
                      <Input placeholder="your_unique_id" {...field} value={field.value || ''} className="pl-8 bg-muted/30 focus:bg-background transition-colors" />
                    </div>
                  </FormControl>
                  <FormDescription>Used for your unique referral link.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="avatar_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Profile Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://i.postimg.cc/..." {...field} value={field.value || ''} className="bg-muted/30 focus:bg-background transition-colors" />
                  </FormControl>
                  <FormDescription>Paste a direct link to your image.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button type="submit" disabled={isPending} className="px-8 shadow-lg shadow-primary/20">
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Profile Changes
          </Button>
        </div>
      </form>
    </Form>
  );
}
