
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
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Zap, ClipboardList, Clock } from 'lucide-react';
import type { Plan, Payment } from '@/lib/types';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';

export default async function PlansPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('profiles')
    .select('current_plan')
    .eq('id', user?.id || '')
    .single();

  const { data: plans, error: plansError } = await supabase.from('plans').select('*').order('investment');
  const { data: payments, error: paymentsError } = await supabase
    .from('payments')
    .select('*, plans(name)')
    .eq('user_id', user?.id || '')
    .order('created_at', { ascending: false });

  if (plansError) {
    console.error('Error fetching plans:', plansError);
    return <div>Could not load plans. Please try again later.</div>
  }
  if (paymentsError) {
    console.error('Error fetching payments:', paymentsError);
    // Non-critical, so we can still render the rest of the page
  }

  // Create a map of pending payments for quick lookup
  const pendingPayments = new Map<string, boolean>();
  (payments as Payment[] || []).forEach(p => {
    if (p.status === 'pending' && p.plan_id) {
      pendingPayments.set(p.plan_id, true);
    }
  });
  
  const activePlanName = profile?.current_plan;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Investment Plans</h1>
        <p className="text-muted-foreground">
          Choose a plan that fits your goals. Payments are manually approved.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {(plans as Plan[]).map((plan) => {
          const isPending = pendingPayments.has(plan.id);
          const isActive = activePlanName === plan.name;

          return (
            <Card key={plan.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">{plan.name}</CardTitle>
                <CardDescription className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Investment</span>
                  <span className="text-3xl font-bold text-primary">PKR {plan.investment}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  <span>Daily Earning: PKR {plan.daily_earning.toFixed(2)}</span>
                </div>
                <div className="flex items-center">
                  <ClipboardList className="mr-2 h-4 w-4 text-primary" />
                  <span>Daily Assignments: {plan.daily_assignments}</span>
                </div>
              </CardContent>
              <CardFooter>
                 {isActive ? (
                    <Button className="w-full" disabled>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Active Plan
                    </Button>
                  ) : isPending ? (
                    <Button className="w-full" disabled variant="secondary">
                      <Clock className="mr-2 h-4 w-4" />
                      Pending Approval
                    </Button>
                  ) : (
                    <PurchasePlanDialog plan={plan} />
                  )}
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <PurchaseHistory payments={payments as any[] || []} />
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

function PurchaseHistory({ payments }: { payments: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Purchase History</CardTitle>
        <CardDescription>The status of your plan purchase requests.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Plan</TableHead>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.length > 0 ? (
              payments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.plans?.name || 'N/A'}</TableCell>
                  <TableCell>{p.payment_uid}</TableCell>
                  <TableCell>{format(new Date(p.created_at), 'PPP')}</TableCell>
                  <TableCell>
                    <Badge variant={p.status === 'pending' ? 'secondary' : p.status === 'approved' ? 'default' : 'destructive'}>
                      {p.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  You have not purchased any plans yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
