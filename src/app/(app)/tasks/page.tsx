
import { createClient } from '@/lib/supabase/server';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ListTodo, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { redirect } from 'next/navigation';
import type { Task } from '@/lib/types';
import { TaskItem } from './task-item';

export default async function TasksPage() {
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

  let dailyTaskLimit = 0;
  if (profile?.current_plan) {
    const { data: plan } = await supabase
      .from('plans')
      .select('daily_assignments')
      .eq('name', profile.current_plan)
      .single();
    dailyTaskLimit = plan?.daily_assignments || 0;
  }

  const { data: tasks, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: true })
    .limit(dailyTaskLimit);

  if (error) {
    console.error('Error fetching tasks:', error);
  }
  
  // Get assignments submitted today
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Start of today
  const { data: submittedTasks, error: submittedTasksError } = await supabase
    .from('assignments')
    .select('task_id')
    .eq('user_id', session.user.id)
    .gte('created_at', today.toISOString());

   if (submittedTasksError) {
       console.error('Error fetching submitted tasks:', submittedTasksError);
   }

  const submittedTaskIds = new Set(submittedTasks?.map(t => t.task_id) || []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Daily Tasks</h1>
        <p className="text-muted-foreground">
          Complete and submit the tasks below based on your active plan. You have {dailyTaskLimit} task(s) available today.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <ListTodo className="h-6 w-6 text-primary" />
            Available Tasks for Submission
          </CardTitle>
          <CardDescription>View each task, then paste the completion URL to submit your proof.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {tasks && tasks.length > 0 ? (
            tasks.map((task, index) => (
              <TaskItem 
                key={task.id} 
                task={task} 
                taskNumber={index + 1}
                isSubmitted={submittedTaskIds.has(task.id)}
              />
            ))
          ) : (
            <div className="flex h-24 flex-col items-center justify-center rounded-lg border-2 border-dashed bg-muted">
              {dailyTaskLimit > 0 ? (
                <p className="text-center text-muted-foreground">
                  Tasks will be updated soon. Please check back later.
                </p>
              ) : (
                <Alert variant="default" className="border-primary">
                  <Info className="h-4 w-4" />
                  <AlertTitle>No Tasks Available</AlertTitle>
                  <AlertDescription>
                    You need to purchase an investment plan to view and complete tasks.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
