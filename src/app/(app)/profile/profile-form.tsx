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
import { Loader2, Camera, Link as LinkIcon, Save, ExternalLink, Image as ImageIcon } from 'lucide-react';
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
          title: 'Profile Synchronized',
          description: 'Your identity updates have been applied.',
        });
        router.refresh();
      }
    });
  }

  const handleAvatarClick = () => {
    const input = document.getElementById('avatar_url_input');
    if (input) {
        input.focus();
        input.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
        <div className="flex flex-col gap-12 md:flex-row items-center md:items-start">
          {/* Futuristic Avatar Interactive Area */}
          <div className="flex flex-col items-center gap-8 w-full md:w-auto">
            <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
              <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-primary via-purple-500 to-pink-500 opacity-20 blur-xl group-hover:opacity-60 transition duration-500 animate-pulse" />
              <div className="absolute -inset-0.5 rounded-full bg-gradient-to-tr from-primary to-pink-500 opacity-40 group-hover:opacity-100 transition duration-500" />
              
              <Avatar className="h-44 w-44 border-[6px] border-card relative shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] z-10 overflow-hidden bg-muted">
                  <AvatarImage src={avatarUrlPreview || ''} alt="User avatar" className="object-cover" data-ai-hint="user avatar" />
                  <AvatarFallback className="bg-gradient-to-br from-muted to-muted/50 text-5xl font-black text-primary/30">{initials}</AvatarFallback>
              </Avatar>

              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-full bg-black/40 backdrop-blur-[2px] opacity-0 transition-all duration-300 group-hover:opacity-100">
                <Camera className="h-12 w-12 text-white/90 mb-2 transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300" />
                <span className="text-[9px] font-black text-white tracking-[0.3em] uppercase">Change Photo</span>
              </div>
            </div>
            
            <div className="space-y-3 w-full max-w-[220px]">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  asChild 
                  className="w-full h-auto py-4 px-6 rounded-2xl bg-white/5 border-white/10 hover:bg-primary/10 hover:border-primary/50 transition-all group"
                >
                    <Link href="https://postimages.org/" target="_blank" className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
                        <span className="font-black text-[10px] uppercase tracking-wider">Host New Image</span>
                      </div>
                      <span className="text-[8px] text-muted-foreground/70 font-bold uppercase">Via Postimages.org</span>
                    </Link>
                </Button>
                <p className="text-[9px] text-center text-muted-foreground/60 px-4 leading-relaxed font-medium italic">
                    Tap your photo or use the button above to get a direct link.
                </p>
            </div>
          </div>

          {/* Form Fields with High-End Styling */}
          <div className="flex-1 space-y-10 w-full">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem className="space-y-3">
                    <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/80">Legal Full Name</FormLabel>
                    <FormControl>
                        <Input 
                          placeholder="Your identity name" 
                          {...field} 
                          className="bg-muted/30 border-none h-14 text-base font-bold focus:ring-2 focus:ring-primary/20 rounded-2xl transition-all shadow-inner" 
                        />
                    </FormControl>
                    <FormDescription className="text-[10px] font-bold text-muted-foreground/50 italic">Must match your withdrawal documents.</FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                    <FormItem className="space-y-3">
                    <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/80">Network Identity</FormLabel>
                    <FormControl>
                        <div className="relative group">
                          <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-primary/40 transition-colors group-focus-within:text-primary">@</span>
                          <Input 
                            placeholder="unique_handle" 
                            {...field} 
                            value={field.value || ''} 
                            className="pl-12 bg-muted/30 border-none h-14 text-base font-bold focus:ring-2 focus:ring-primary/20 rounded-2xl transition-all shadow-inner" 
                          />
                        </div>
                    </FormControl>
                    <FormDescription className="text-[10px] font-bold text-muted-foreground/50 italic">Your public identifier for referrals.</FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            
            <FormField
              control={form.control}
              name="avatar_url"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/80">Avatar Source URL</FormLabel>
                  <FormControl>
                    <div className="relative group">
                        <Input 
                            id="avatar_url_input"
                            placeholder="https://i.postimg.cc/image.jpg" 
                            {...field} 
                            value={field.value || ''} 
                            className="bg-muted/30 border-none h-14 text-xs font-mono focus:ring-2 focus:ring-primary/20 rounded-2xl pr-14 transition-all shadow-inner" 
                        />
                        <div className="absolute right-5 top-1/2 -translate-y-1/2">
                            <LinkIcon className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-all" />
                        </div>
                    </div>
                  </FormControl>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <FormDescription className="text-[10px] font-bold text-muted-foreground/50 italic">
                      Direct Link format only (ends in .jpg, .png, etc.)
                    </FormDescription>
                    <Link 
                      href="https://postimages.org" 
                      target="_blank" 
                      className="text-[10px] font-black text-primary hover:text-primary/80 uppercase tracking-tighter flex items-center gap-1 border-b border-primary/20"
                    >
                        Hosting Portal <ExternalLink className="h-2 w-2" />
                    </Link>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Elegant Action Footer */}
        <div className="flex justify-end pt-10 border-t border-white/5">
          <Button 
            type="submit" 
            disabled={isPending} 
            className="group relative overflow-hidden px-12 h-16 rounded-2xl font-black tracking-[0.2em] uppercase shadow-2xl shadow-primary/20 transition-all active:scale-95 bg-primary hover:bg-primary/90"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            {isPending ? (
              <Loader2 className="mr-3 h-5 w-5 animate-spin" />
            ) : (
              <Save className="mr-3 h-5 w-5 group-hover:rotate-12 transition-transform" />
            )}
            COMMIT CHANGES
          </Button>
        </div>
      </form>
    </Form>
  );
}
