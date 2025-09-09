
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
import type { Task } from '@/lib/types';

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

  if (!profile?.current_plan) {
    return (
      <Alert variant="default" className="border-primary">
        <Info className="h-4 w-4" />
        <AlertTitle>No Active Plan</AlertTitle>
        <AlertDescription>
          You need to purchase an investment plan to submit assignments.
        </AlertDescription>
      </Alert>
    );
  }
  
  // Fetch the user's daily tasks
  const { data: plan } = await supabase
    .from('plans')
    .select('daily_assignments')
    .eq('name', profile.current_plan)
    .single();
  
  const dailyTaskLimit = plan?.daily_assignments || 0;

  const { data: tasks, error: tasksError } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: true })
    .limit(dailyTaskLimit);
    
  if (tasksError) {
    console.error('Error fetching tasks for assignments:', tasksError);
    return <div>Could not load tasks. Please try again.</div>;
  }

  // Fetch today's submissions to check which tasks are already submitted
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const { data: submitted_assignments, error: submissionsError } = await supabase
    .from('assignments')
    .select('task_id')
    .eq('user_id', session.user.id)
    .gte('created_at', today.toISOString());

  if (submissionsError) {
      console.error('Error fetching submissions:', submissionsError);
      return <div>Could not load submission status.</div>
  }

  const submittedTaskIds = new Set(submitted_assignments.map(a => a.task_id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Submit Your Tasks</h1>
        <p className="text-muted-foreground">
          Submit proof for each task you have completed today.
        </p>
      </div>

      {tasks && tasks.length > 0 ? (
        <div className="space-y-8">
          {(tasks as Task[]).map((task, index) => {
            const isSubmitted = submittedTaskIds.has(task.id);
            return (
              <Card key={task.id}>
                <CardHeader>
                  <CardTitle className="font-headline flex items-center gap-2">
                    <FileCheck2 className="h-6 w-6 text-primary" />
                    Task {index + 1}: {task.title}
                  </CardTitle>
                  <CardDescription>
                    {isSubmitted 
                        ? "You have already submitted this task for today." 
                        : "Paste the proof URLs from the task you've completed."
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                    {isSubmitted ? (
                         <Alert variant="default" className="border-green-500 bg-green-50">
                            <Info className="h-4 w-4 text-green-600" />
                            <AlertTitle className="text-green-700">Submission Received</AlertTitle>
                            <AlertDescription className="text-green-600">
                                We are reviewing your submission for this task.
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <AssignmentForm task={task} />
                    )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
         <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>No Tasks Available</AlertTitle>
          <AlertDescription>
            There are no tasks assigned for you to submit today. Please check back later.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
