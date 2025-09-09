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
import { useState, useTransition } from 'react';
import { Loader2, Image as ImageIcon, Trash2 } from 'lucide-react';
import { submitAssignmentWithImages } from './actions';
import { useRouter } from 'next/navigation';
import type { Task } from '@/lib/types';
import Image from 'next/image';

const formSchema = z.object({
  taskId: z.string(),
  title: z.string().min(3, { message: 'Title must be at least 3 characters long.' }),
  images: z.array(z.string()).min(1, 'Please upload at least one image.').max(5, 'You can upload a maximum of 5 images.'),
});

interface AssignmentFormProps {
  task: Task;
}

export function AssignmentForm({ task }: AssignmentFormProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      taskId: task.id,
      title: task.title || '',
      images: [],
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (files.length + imagePreviews.length > 5) {
        toast({
            variant: 'destructive',
            title: 'Too many files',
            description: 'You can upload a maximum of 5 images.',
        });
        return;
    }
    
    const imagePromises = files.map(file => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then(base64Images => {
      const newImages = [...form.getValues('images'), ...base64Images];
      form.setValue('images', newImages, { shouldValidate: true });
      setImagePreviews(newImages);
    });
  };
  
  const removeImage = (index: number) => {
    const newImages = form.getValues('images').filter((_, i) => i !== index);
    form.setValue('images', newImages, { shouldValidate: true });
    setImagePreviews(newImages);
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const result = await submitAssignmentWithImages(values);
      if (result?.error) {
        toast({
          variant: 'destructive',
          title: 'Submission Failed',
          description: result.error,
        });
      } else {
        toast({
          variant: result.isApproved ? 'default' : 'destructive',
          title: `AI Verification: ${result.isApproved ? 'Approved' : 'Rejected'}`,
          description: result.aiFeedback,
        });
        form.reset({
            taskId: task.id,
            title: task.title,
            images: [],
        });
        setImagePreviews([]);
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
              <FormLabel>Assignment Title (auto-filled)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Daily Education Tasks" {...field} readOnly />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-primary">Upload Images (Required)</FormLabel>
              <FormControl>
                <div className="relative">
                    <Input
                        id={`file-upload-${task.id}`}
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        multiple
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                        onChange={handleImageChange}
                        disabled={isPending}
                    />
                    <label htmlFor={`file-upload-${task.id}`} className="flex cursor-pointer items-center justify-center gap-2 rounded-md border-2 border-dashed border-primary bg-muted p-6 text-center text-primary transition-colors hover:bg-primary/10">
                        <ImageIcon className="h-6 w-6" />
                        <span>Click to upload or drag & drop</span>
                    </label>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
                {imagePreviews.map((src, index) => (
                    <div key={index} className="relative aspect-square overflow-hidden rounded-md border">
                        <Image src={src} alt={`Preview ${index + 1}`} layout="fill" objectFit="cover" />
                         <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6"
                            onClick={() => removeImage(index)}
                            disabled={isPending}
                            >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>
        )}

        <Button type="submit" disabled={isPending || imagePreviews.length === 0} className="w-full sm:w-auto">
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit for AI Approval
        </Button>
      </form>
    </Form>
  );
}
