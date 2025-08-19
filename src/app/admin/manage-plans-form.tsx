
'use client';

import { useState, useTransition } from 'react';
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
  period_days: z.coerce.number().int().positive('Period must be a positive integer'),
  total_return: z.coerce.number().positive('Total return must be a positive number'),
  referral_bonus: z.coerce.number().positive('Referral bonus must be a positive number'),
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
      plans: initialPlans || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'plans',
  });
  
  // Watch for changes to automatically calculate total_return
  const watchedFields = form.watch('plans');

  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      for (const plan of values.plans) {
        const result = await savePlan(plan);
        if (result?.error) {
          toast({
            variant: 'destructive',
            title: `Failed to save ${plan.name || 'new plan'}`,
            description: result.error,
          });
          return; // Stop on first error
        }
      }
      toast({
        title: 'Success',
        description: 'All plan changes have been saved.',
      });
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Investment Plans</CardTitle>
        <CardDescription>
          Add, edit, and save investment plans. Total Return is calculated automatically.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {fields.map((field, index) => {
               const dailyEarning = watchedFields[index]?.daily_earning || 0;
               const periodDays = watchedFields[index]?.period_days || 0;
               const totalReturn = dailyEarning * periodDays;
               
               // Set the value in the form state
               form.setValue(`plans.${index}.total_return`, totalReturn);

              return (
              <Card key={field.id} className="relative p-4">
                <div className="grid grid-cols-2 gap-4">
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
                    name={`plans.${index}.investment`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Investment (PKR)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="1000" {...field} />
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
                          <Input type="number" placeholder="200" {...field} />
                        </FormControl>
                         <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`plans.${index}.period_days`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Period (Days)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="90" {...field} />
                        </FormControl>
                         <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`plans.${index}.referral_bonus`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Referral Bonus (PKR)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="200" {...field} />
                        </FormControl>
                         <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name={`plans.${index}.total_return`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Return (Calculated)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} readOnly className="bg-muted"/>
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
            )})}
            <div className="flex items-center gap-4">
                <Button
                type="button"
                variant="outline"
                onClick={() => append({ name: '', investment: 0, daily_earning: 0, period_days: 0, total_return: 0, referral_bonus: 0 })}
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
