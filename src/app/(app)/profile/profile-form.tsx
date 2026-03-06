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
import { useTransition, useRef } from 'react';
import { Loader2, Camera, Link as LinkIcon, Save, ExternalLink } from 'lucide-react';
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
  const avatarUrlInputRef = useRef<HTMLInputElement>(null);
  
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
          title: 'Profile Updated!',
          description: 'Your changes have been saved successfully.',
        });
        router.refresh();
      }
    });
  }

  const handleAvatarClick = () => {
    // Focus the URL input when clicking the avatar area
    const input = document.getElementById('avatar_url_input');
    if (input) {
        input.focus();
        input.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
        <div className="flex flex-col gap-10 md:flex-row items-start">
          {/* Interactive Avatar Area */}
          <div className="flex flex-col items-center gap-6 w-full md:w-auto">
            <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary via-purple-500 to-pink-500 opacity-75 blur transition duration-1000 group-hover:opacity-100 group-hover:duration-200" />
              <Avatar className="h-40 w-40 border-4 border-background relative shadow-2xl transition-transform group-hover:scale-[1.02]">
                  <AvatarImage src={avatarUrlPreview || ''} alt="User avatar" className="object-cover" data-ai-hint="user avatar" />
                  <AvatarFallback className="bg-muted text-4xl font-black text-primary/40">{initials}</AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                <Camera className="h-10 w-10 text-white mb-1" />
                <span className="text-[10px] font-black text-white tracking-widest uppercase">Update Photo</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-2 w-full max-w-[200px]">
                <Button type="button" variant="outline" size="sm" asChild className="w-full bg-muted/30 hover:bg-primary/10 border-primary/20 hover:border-primary transition-all rounded-xl py-6 h-auto">
                    <Link href="https://postimages.org/" target="_blank" className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-2">
                        <LinkIcon className="h-4 w-4 text-primary" />
                        <span className="font-bold text-xs uppercase tracking-tighter">Get Image URL</span>
                      </div>
                      <span className="text-[9px] text-muted-foreground font-medium">Use Postimages.org</span>
                    </Link>
                </Button>
                <p className="text-[9px] text-center text-muted-foreground px-2 leading-tight">
                    Upload your photo to Postimages, copy the <strong>Direct Link</strong>, and paste it below.
                </p>
            </div>
          </div>

          <div className="flex-1 space-y-8 w-full">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="text-xs font-black uppercase tracking-widest text-primary/70">Legal Full Name</FormLabel>
                    <FormControl>
                        <Input placeholder="Enter your real name" {...field} className="bg-muted/30 border-none h-14 text-base font-semibold focus:ring-2 focus:ring-primary/20 rounded-xl" />
                    </FormControl>
                    <FormDescription className="text-[10px] font-medium">Matches your ID for verification.</FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="text-xs font-black uppercase tracking-widest text-primary/70">Public Username</FormLabel>
                    <FormControl>
                        <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-primary">@</span>
                        <Input placeholder="your_unique_id" {...field} value={field.value || ''} className="pl-10 bg-muted/30 border-none h-14 text-base font-semibold focus:ring-2 focus:ring-primary/20 rounded-xl" />
                        </div>
                    </FormControl>
                    <FormDescription className="text-[10px] font-medium">This defines your referral identity.</FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            
            <FormField
              control={form.control}
              name="avatar_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-black uppercase tracking-widest text-primary/70">Profile Image Direct Link</FormLabel>
                  <FormControl>
                    <div className="relative group">
                        <Input 
                            id="avatar_url_input"
                            placeholder="https://i.postimg.cc/your-image.jpg" 
                            {...field} 
                            value={field.value || ''} 
                            className="bg-muted/30 border-none h-14 text-sm font-mono focus:ring-2 focus:ring-primary/20 rounded-xl pr-12" 
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            <LinkIcon className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        </div>
                    </div>
                  </FormControl>
                  <FormDescription className="flex items-center gap-1.5 text-[10px] font-medium">
                    Paste the Direct Link here. 
                    <Link href="https://postimages.org" target="_blank" className="text-primary hover:underline flex items-center gap-0.5">
                        Open Hosting Site <ExternalLink className="h-2 w-2" />
                    </Link>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-dashed">
          <Button type="submit" disabled={isPending} className="px-10 h-14 rounded-2xl font-black tracking-widest uppercase shadow-xl shadow-primary/30 transition-all active:scale-95">
            {isPending ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Save className="mr-2 h-5 w-5" />
            )}
            Save Profile Changes
          </Button>
        </div>
      </form>
    </Form>
  );
}
