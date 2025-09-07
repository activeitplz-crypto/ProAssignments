
'use client';

import { useTransition } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
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
import { Loader2, PlusCircle, Trash2 } from 'lucide-react';
import { saveSocialLink, deleteSocialLink } from './actions';
import type { SocialLink } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const socialLinkSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  icon_url: z.string().url({ message: 'Please enter a valid URL for the icon.' }),
  social_link: z.string().url({ message: 'Please enter a valid URL for the social page.' }),
});

const formSchema = z.object({
  socials: z.array(socialLinkSchema),
});

interface ManageSocialsFormProps {
  socials: SocialLink[];
}

export function ManageSocialsForm({ socials: initialSocials }: ManageSocialsFormProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      socials: initialSocials || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'socials',
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      let successCount = 0;
      for (const social of values.socials) {
        const result = await saveSocialLink(social);
        if (result?.error) {
          toast({
            variant: 'destructive',
            title: `Failed to save "${social.name}"`,
            description: result.error,
          });
        } else {
          successCount++;
        }
      }
      if (successCount > 0) {
        toast({
          title: 'Success',
          description: 'Social link changes have been saved.',
        });
      }
    });
  }

  const handleRemove = (index: number) => {
    const social = fields[index];
    if (social.id) {
      startTransition(async () => {
        const formData = new FormData();
        formData.append('id', social.id as string);
        const result = await deleteSocialLink(formData);
        if (result?.error) {
          toast({ variant: 'destructive', title: 'Deletion Failed', description: result.error });
        } else {
          remove(index);
          toast({ title: 'Social Link Deleted' });
        }
      });
    } else {
      remove(index);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Social Media Links</CardTitle>
        <CardDescription>
          Add, edit, or delete social media links that appear on the "Social" page.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              {fields.map((field, index) => (
                <Card key={field.id} className="relative p-4">
                  <div className="space-y-4">
                    <input
                      type="hidden"
                      {...form.register(`socials.${index}.id`)}
                    />
                    <FormField
                      control={form.control}
                      name={`socials.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Facebook" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`socials.${index}.icon_url`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Icon URL</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://.../icon.png"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`socials.${index}.social_link`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Social Account Link</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://facebook.com/your-page"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 text-destructive"
                    onClick={() => handleRemove(index)}
                    disabled={isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </Card>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  append({ name: '', icon_url: '', social_link: '' }, { shouldFocus: true })
                }
                disabled={isPending}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Social Link
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save All Changes
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
