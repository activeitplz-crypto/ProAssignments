
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
import { useRef, useTransition, useState } from 'react';
import { Loader2, Upload } from 'lucide-react';
import { updateProfile } from './actions';
import { useRouter } from 'next/navigation';
import type { UserProfile } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
});

interface ProfileFormProps {
    user: UserProfile;
    onUpdate: (data: Partial<UserProfile>) => void;
}

export function ProfileForm({ user, onUpdate }: ProfileFormProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(user.avatarUrl || null);
  
  const initials = user.name?.split(' ').map((n) => n[0]).join('') || '';

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name || '',
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        onUpdate({ avatarUrl: result });
      };
      reader.readAsDataURL(file);
    }
  };

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
        onUpdate(values);
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Your full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-2">
            <FormLabel>Profile Picture</FormLabel>
            <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                    <AvatarImage src={preview || ''} alt="User avatar" data-ai-hint="user avatar" />
                    <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                 <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                   <Upload className="mr-2 h-4 w-4" />
                   Upload Image
                </Button>
                <Input 
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/png, image/jpeg, image/gif"
                  onChange={handleFileChange}
                />
            </div>
        </div>

        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </form>
    </Form>
  );
}
