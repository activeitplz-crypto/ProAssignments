
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
import { Loader2, Image as ImageIcon, Trash2, FileCheck2 } from 'lucide-react';
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
          title: `Submission Received!`,
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <input type="hidden" {...form.register('taskId')} />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Task Identity</FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g., Daily Education Tasks" 
                  {...field} 
                  readOnly 
                  className="bg-slate-50 border-none h-14 rounded-2xl font-bold text-slate-900 shadow-inner"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Handwritten Proof (Required)</FormLabel>
              <FormControl>
                <div className="relative group">
                    <Input
                        id={`file-upload-${task.id}`}
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        multiple
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0 z-20"
                        onChange={handleImageChange}
                        disabled={isPending}
                    />
                    <div className="flex flex-col items-center justify-center gap-4 rounded-[2.5rem] border-2 border-dashed border-primary/20 bg-primary/5 p-12 text-center transition-all group-hover:bg-primary/10 group-hover:border-primary/40 group-active:scale-[0.99]">
                        <div className="h-16 w-16 rounded-[1.5rem] bg-white flex items-center justify-center shadow-xl shadow-primary/5 group-hover:scale-110 transition-transform duration-500">
                            <ImageIcon className="h-8 w-8 text-primary" />
                        </div>
                        <div className="space-y-1.5">
                            <p className="text-sm font-black uppercase tracking-tighter text-slate-900">Select Assignment Photos</p>
                            <p className="text-[9px] font-bold text-muted-foreground uppercase opacity-50 tracking-widest">PNG, JPG or WebP • Max 5 Files</p>
                        </div>
                    </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {imagePreviews.map((src, index) => (
                    <div key={index} className="relative aspect-square overflow-hidden rounded-[1.5rem] border-4 border-white shadow-xl group/img">
                        <Image src={src} alt={`Preview ${index + 1}`} layout="fill" objectFit="cover" className="transition-transform duration-700 group-hover/img:scale-110" />
                         <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-8 w-8 rounded-full shadow-lg opacity-0 group-hover/img:opacity-100 transition-all duration-300 transform translate-y-[-10px] group-hover/img:translate-y-0"
                            onClick={() => removeImage(index)}
                            disabled={isPending}
                            >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>
        )}

        <div className="pt-4">
            <Button 
              type="submit" 
              disabled={isPending || imagePreviews.length === 0} 
              className="w-full h-16 rounded-[2rem] font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl shadow-primary/30 transition-all active:scale-[0.98] group overflow-hidden relative bg-primary hover:bg-primary/90 text-white"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <div className="relative z-10 flex items-center justify-center gap-3">
                {isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <FileCheck2 className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                )}
                <span>Submit Assignment</span>
              </div>
            </Button>
        </div>
      </form>
    </Form>
  );
}
