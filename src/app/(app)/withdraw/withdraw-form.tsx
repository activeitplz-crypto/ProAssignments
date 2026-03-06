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
import { Loader2, ArrowRight, Wallet, User as UserIcon, Building2, Smartphone } from 'lucide-react';
import { requestWithdrawal } from './actions';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  amount: z.coerce
    .number({ invalid_type_error: 'Please enter a valid number.' })
    .min(700, { message: 'Minimum withdrawal amount is 700 RS.' }),
  bank_name: z.string().min(2, { message: 'Bank/Service name is required.' }),
  holder_name: z.string().min(2, { message: 'Account holder name is required.' }),
  account_number: z.string().min(11, { message: 'Account number is required.'}),
});

interface WithdrawFormProps {
    currentBalance: number;
    canWithdraw: boolean;
}

export function WithdrawForm({ currentBalance, canWithdraw }: WithdrawFormProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: '' as any,
      bank_name: '',
      holder_name: '',
      account_number: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
     if (values.amount > currentBalance) {
      form.setError("amount", {
        type: "manual",
        message: "Amount cannot exceed your current balance.",
      });
      return;
    }

    startTransition(async () => {
      const result = await requestWithdrawal(values);
      if (result?.error) {
        toast({
          variant: 'destructive',
          title: 'Transaction Error',
          description: result.error,
        });
      } else {
        toast({
          title: 'Identity Verified',
          description: 'Your withdrawal request is being processed.',
        });
        form.reset();
        router.refresh();
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
                <FormItem className="space-y-3">
                <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Amount to Transfer</FormLabel>
                <FormControl>
                    <div className="relative">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-400 text-xs">PKR</div>
                        <Input 
                            type="number" 
                            step="0.01" 
                            placeholder="e.g., 1500" 
                            {...field} 
                            className="bg-slate-50 border-none h-14 pl-16 rounded-2xl font-bold text-slate-900 shadow-inner"
                        />
                    </div>
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <FormField
            control={form.control}
            name="bank_name"
            render={({ field }) => (
                <FormItem className="space-y-3">
                <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Provider Service</FormLabel>
                <FormControl>
                    <div className="relative">
                        <div className="absolute right-5 top-1/2 -translate-y-1/2">
                            <Building2 className="h-4 w-4 text-slate-300" />
                        </div>
                        <Input 
                            placeholder="Easypaisa / JazzCash" 
                            {...field} 
                            className="bg-slate-50 border-none h-14 rounded-2xl font-bold text-slate-900 shadow-inner px-6"
                        />
                    </div>
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <FormField
            control={form.control}
            name="holder_name"
            render={({ field }) => (
                <FormItem className="space-y-3">
                <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Account Holder</FormLabel>
                <FormControl>
                    <div className="relative">
                        <div className="absolute right-5 top-1/2 -translate-y-1/2">
                            <UserIcon className="h-4 w-4 text-slate-300" />
                        </div>
                        <Input 
                            placeholder="Full Name" 
                            {...field} 
                            className="bg-slate-50 border-none h-14 rounded-2xl font-bold text-slate-900 shadow-inner px-6"
                        />
                    </div>
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <FormField
            control={form.control}
            name="account_number"
            render={({ field }) => (
                <FormItem className="space-y-3">
                <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Account Number</FormLabel>
                <FormControl>
                    <div className="relative">
                        <div className="absolute right-5 top-1/2 -translate-y-1/2">
                            <Smartphone className="h-4 w-4 text-slate-300" />
                        </div>
                        <Input 
                            placeholder="Account Number" 
                            {...field} 
                            className="bg-slate-50 border-none h-14 rounded-2xl font-bold text-slate-900 shadow-inner px-6"
                        />
                    </div>
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <div className="pt-4">
            <Button 
              type="submit" 
              disabled={isPending || !canWithdraw} 
              className="w-full h-16 rounded-[2rem] font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl shadow-primary/30 transition-all active:scale-[0.98] group overflow-hidden relative bg-primary hover:bg-primary/90 text-white"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <div className="relative z-10 flex items-center justify-center gap-3">
                {isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Wallet className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                    <span>Withdraw</span>
                    <ArrowRight className="h-4 w-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                  </>
                )}
              </div>
            </Button>
            {!canWithdraw && (
                <p className="text-center text-[9px] font-bold text-destructive uppercase tracking-widest mt-4">Verification Required: 5 Referrals Needed</p>
            )}
        </div>
      </form>
    </Form>
  );
}
