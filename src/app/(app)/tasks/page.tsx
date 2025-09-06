
import { createClient } from '@/lib/supabase/server';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ListTodo, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default async function TasksPage() {
  const supabase = createClient();
  const { data: tasks, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching tasks:', error);
    // Display a friendly error to the user
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Daily Tasks</h1>
        <p className="text-muted-foreground">
          Complete the tasks below. New tasks may be added daily.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <ListTodo className="h-6 w-6 text-primary" />
            Available Tasks
          </CardTitle>
          <CardDescription>Click the button to view and complete each task.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {tasks && tasks.length > 0 ? (
            tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between rounded-lg border bg-card p-4"
              >
                <p className="font-semibold">({task.title})</p>
                <Button asChild>
                  <Link href={task.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Task
                  </Link>
                </Button>
              </div>
            ))
          ) : (
            <div className="flex h-24 flex-col items-center justify-center rounded-lg border-2 border-dashed bg-muted">
              <p className="text-center text-muted-foreground">
                Tasks will be updated soon. Please check back later.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
