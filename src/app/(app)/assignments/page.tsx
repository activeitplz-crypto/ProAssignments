
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FileCheck2, Info, CheckCircle, Clock } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AssignmentForm } from './assignment-form';
import type { Task, Assignment } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

// This component now only shows "Approved" or "Pending"
function getStatusBadge(isApproved: boolean) {
    if (isApproved) {
        return (
            <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                <CheckCircle className="mr-2 h-4 w-4" /> AI Approved
            </Badge>
        );
    }
    return (
        <Badge variant="secondary">
            <Clock className="mr-2 h-4 w-4" /> Pending Submission
        </Badge>
    );
}


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

  // Fetch today's APPROVED submissions to check status
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const { data: approved_assignments, error: submissionsError } = await supabase
    .from('assignments')
    .select('task_id') // We only need the task_id
    .eq('user_id', session.user.id)
    .eq('status', 'approved')
    .gte('created_at', today.toISOString());

  if (submissionsError) {
      console.error('Error fetching submissions:', submissionsError);
      return <div>Could not load submission status.</div>
  }

  const approvedTaskIds = new Set<string>();
    (approved_assignments as Pick<Assignment, 'task_id'>[]).forEach(a => {
        if(a.task_id) {
            approvedTaskIds.add(a.task_id);
        }
    });


  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Submit Your Assignments</h1>
        <p className="text-muted-foreground">
          Upload images of your handwritten assignments for AI verification.
        </p>
      </div>

      {tasks && tasks.length > 0 ? (
        <div className="space-y-8">
          {(tasks as Task[]).map((task, index) => {
            const isApproved = approvedTaskIds.has(task.id);
            
            // Description changes based on approval status. Rejection is now handled client-side in the form.
            const description = isApproved
                ? "You have already been approved for this task today."
                : "Upload your handwritten assignment image(s). Ensure the title matches exactly.";

            return (
              <Card key={task.id}>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <CardTitle className="font-headline flex items-center gap-2">
                        <FileCheck2 className="h-6 w-6 text-primary" />
                        Task {index + 1}: {task.title}
                    </CardTitle>
                    {getStatusBadge(isApproved)}
                  </div>
                  <CardDescription>
                   {description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                    {isApproved ? (
                         <Alert variant="default" className="border-green-500 bg-green-50">
                            <Info className="h-4 w-4 text-green-600" />
                            <AlertTitle className="text-green-700">Submission Approved</AlertTitle>
                            <AlertDescription className="text-green-600">
                                This task has been successfully verified for today.
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
