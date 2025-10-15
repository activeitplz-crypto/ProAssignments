
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
import { savePlan } from './actions';
import type { Plan } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const planSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Plan name is required'),
  investment: z.coerce.number().positive('Investment must be a positive number'),
  daily_earning: z.coerce.number().positive('Daily earning must be a positive number'),
  daily_assignments: z.coerce.number().int().positive('Daily assignments must be a positive integer'),
  original_investment: z.coerce.number().nullable().optional(),
  offer_name: z.string().nullable().optional(),
  offer_expires_at: z.string().nullable().optional(),
});


const formSchema = z.object({
  plans: z.array(planSchema),
});

interface ManagePlansFormProps {
  plans: Plan[];
}

export function ManagePlansForm({ plans: initialPlans }: ManagePlansFormProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      plans: initialPlans.map(p => ({
          ...p, 
          original_investment: p.original_investment || null, 
          offer_name: p.offer_name || null,
          offer_expires_at: p.offer_expires_at ? new Date(p.offer_expires_at).toISOString().substring(0, 16) : null,
        })) || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'plans',
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      let hasError = false;
      for (const plan of values.plans) {
        // Here, we ensure that if original_investment has a value, it's the higher one.
        if (plan.original_investment && plan.original_investment < plan.investment) {
            toast({
                variant: 'destructive',
                title: `Invalid Price for "${plan.name}"`,
                description: 'Original Investment cannot be less than the Sale Price.',
            });
            hasError = true;
            continue; // Skip saving this plan
        }

        const result = await savePlan(plan);
        if (result?.error) {
          toast({
            variant: 'destructive',
            title: `Failed to save ${plan.name || 'new plan'}`,
            description: result.error,
          });
          hasError = true;
        }
      }
      if (!hasError) {
        toast({
            title: 'Success',
            description: 'All plan changes have been saved.',
        });
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Investment Plans</CardTitle>
        <CardDescription>
          Add, edit, and create special offers for investment plans.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {fields.map((field, index) => (
              <Card key={field.id} className="relative p-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <input
                    type="hidden"
                    {...form.register(`plans.${index}.id`)}
                  />
                  <FormField
                    control={form.control}
                    name={`plans.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Plan Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Basic Plan" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name={`plans.${index}.daily_assignments`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Daily Assignments</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="1" {...field} />
                        </FormControl>
                         <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name={`plans.${index}.daily_earning`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Daily Earning (PKR)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="50" {...field} />
                        </FormControl>
                         <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name={`plans.${index}.investment`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Investment / Sale Price (PKR)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="1000" {...field} />
                        </FormControl>
                         <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name={`plans.${index}.original_investment`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Original Investment (Optional)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g. 1500 (old price)" {...field} value={field.value ?? ''} />
                        </FormControl>
                         <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name={`plans.${index}.offer_name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Offer Name (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Eid Offer" {...field} value={field.value ?? ''} />
                        </FormControl>
                         <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`plans.${index}.offer_expires_at`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Offer Expires At (Optional)</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} value={field.value ?? ''} />
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
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
              </Card>
            ))}
            <div className="flex items-center gap-4">
                <Button
                type="button"
                variant="outline"
                onClick={() => append({ name: '', investment: 0, daily_earning: 0, daily_assignments: 1, original_investment: null, offer_name: null, offer_expires_at: null })}
                >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Plan
                </Button>
                <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save All Changes
                </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
