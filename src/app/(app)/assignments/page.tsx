
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FileCheck2, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AssignmentForm } from './assignment-form';

export default async function AssignmentsPage() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('current_plan')
    .eq('id', session.user.id)
    .single();

  const hasActivePlan = !!profile?.current_plan;

  let dailyLimit = 0;
  let submittedCount = 0;

  if (hasActivePlan) {
    const { data: plan } = await supabase
      .from('plans')
      .select('daily_assignments')
      .eq('name', profile.current_plan!)
      .single();
    dailyLimit = plan?.daily_assignments || 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    const { count } = await supabase
      .from('assignments')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', session.user.id)
      .gte('created_at', today.toISOString());
    submittedCount = count || 0;
  }

  const canSubmit = hasActivePlan && submittedCount < dailyLimit;
  const submissionsLeft = dailyLimit - submittedCount;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Submit Your Tasks</h1>
        <p className="text-muted-foreground">
          Fill out the form below to submit your completed tasks for review.
        </p>
      </div>

      {!hasActivePlan ? (
        <Alert variant="default" className="border-primary">
          <Info className="h-4 w-4" />
          <AlertTitle>No Active Plan</AlertTitle>
          <AlertDescription>
            You need to purchase an investment plan to submit assignments.
          </AlertDescription>
        </Alert>
      ) : canSubmit ? (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <FileCheck2 className="h-6 w-6 text-primary" />
              New Assignment Submission
            </CardTitle>
            <CardDescription>
              You have {submissionsLeft} submission(s) left for today. Paste the proof URLs from the tasks you've completed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AssignmentForm />
          </CardContent>
        </Card>
      ) : (
         <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Daily Limit Reached</AlertTitle>
          <AlertDescription>
            You have already submitted your maximum number of assignments for today. Please check back tomorrow.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
