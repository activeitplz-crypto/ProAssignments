
import { createClient } from '@/lib/supabase/server';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Zap } from 'lucide-react';
import type { Plan } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { purchasePlan } from './actions';

const initialPlans: Omit<Plan, 'id' | 'created_at'>[] = [
  { name: 'Basic Plan', investment: 1000, daily_earning: 200, period_days: 90, total_return: 18000, referral_bonus: 200 },
  { name: 'Standard Plan', investment: 1500, daily_earning: 300, period_days: 90, total_return: 27000, referral_bonus: 300 },
  { name: 'Advanced Plan', investment: 2000, daily_earning: 400, period_days: 90, total_return: 36000, referral_bonus: 400 },
  { name: 'Premium Plan', investment: 3000, daily_earning: 600, period_days: 90, total_return: 54000, referral_bonus: 600 },
  { name: 'Elite Plan', investment: 4500, daily_earning: 900, period_days: 90, total_return: 81000, referral_bonus: 900 },
  { name: 'Pro Plan', investment: 7000, daily_earning: 1400, period_days: 90, total_return: 126000, referral_bonus: 1400 },
  { name: 'Business Plan', investment: 10000, daily_earning: 2000, period_days: 90, total_return: 180000, referral_bonus: 2000 },
  { name: 'Ultimate Plan', investment: 40000, daily_earning: 8000, period_days: 90, total_return: 720000, referral_bonus: 8000 },
];


export default async function PlansPage() {
  const supabase = createClient();

  // Let's check if plans exist. If not, we can seed them.
  let { data: plans, error: fetchError } = await supabase.from('plans').select('*').order('investment', { ascending: true });

  if(fetchError) console.error("Error fetching plans", fetchError);

  if (!plans || plans.length === 0) {
    console.log("No plans found, seeding initial plans.");
    const { error: insertError } = await supabase.from('plans').insert(initialPlans);
    if (insertError) {
        console.error("Error seeding plans:", insertError);
    } else {
        // Refetch plans after seeding
        const { data: refetchedPlans, error: refetchError } = await supabase.from('plans').select('*').order('investment', { ascending: true });
        if (refetchError) console.error("Error refetching plans:", refetchError);
        plans = refetchedPlans;
    }
  }


  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Investment Plans</h1>
        <p className="text-muted-foreground">
          Choose a plan that fits your goals. Payments are manually approved.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {(plans as Plan[] || []).map((plan) => (
          <Card key={plan.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">{plan.name}</CardTitle>
              <CardDescription>
                <span className="text-3xl font-bold text-primary">PKR {plan.investment.toLocaleString()}</span>
                <span className="text-muted-foreground"> one-time</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <div className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                <span>Daily Earning: PKR {plan.daily_earning.toFixed(2)}</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                <span>Period: {plan.period_days} Days</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                <span>Total Return: PKR {plan.total_return.toFixed(2)}</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                <span>Referral Bonus: PKR {plan.referral_bonus.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <PurchasePlanDialog plan={plan} />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

function PurchasePlanDialog({ plan }: { plan: Plan }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Zap className="mr-2 h-4 w-4" />
          Select Plan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Purchase {plan.name} Plan</DialogTitle>
          <DialogDescription>
            To activate this plan, send PKR {plan.investment} to the account below and submit your payment Transaction ID.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="rounded-lg border bg-muted p-4">
            <h3 className="font-semibold">Payment Details</h3>
            <p><strong>Method:</strong> Easypaisa</p>
            <p><strong>Account Holder:</strong> Jahanzaib</p>
            <p><strong>Account Number:</strong> 03140147525</p>
          </div>
          <form action={purchasePlan}>
            <input type="hidden" name="plan_id" value={plan.id} />
            <input type="hidden" name="plan_name" value={plan.name} />
            <div className="space-y-2">
              <Label htmlFor="payment_uid">Payment Transaction ID (UID)</Label>
              <Input id="payment_uid" name="payment_uid" required placeholder="e.g., 12345678901" />
            </div>
            <Button type="submit" className="mt-4 w-full">Submit for Approval</Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
