
import { createClient } from '@/lib/supabase/server';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AssignmentForm } from './assignment-form';
import { redirect } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import type { Assignment } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileCheck2, History } from 'lucide-react';

export default async function AssignmentsPage() {
  const supabase = createClient();
  const { data: { session }} = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }
  
  const { data: user, error: userError } = await supabase
    .from('profiles')
    .select('id, name')
    .eq('id', session.user.id)
    .single();

  if (userError || !user) {
    console.error('Assignments page error:', userError);
    return <div>Could not load user data.</div>;
  }
  
  const { data: assignments, error: assignmentsError } = await supabase
    .from('assignments')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false });

   if (assignmentsError) {
    console.error('Error fetching assignments:', assignmentsError);
    // Non-critical, so we can still render the rest of the page
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <FileCheck2 className="h-6 w-6 text-primary" />
            Submit Your Assignment
          </CardTitle>
          <CardDescription>
            Provide the links to your completed tasks below. At least one URL is required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AssignmentForm user={user} />
        </CardContent>
      </Card>
      
      <AssignmentHistory assignments={assignments || []} />
    </div>
  );
}

function AssignmentHistory({ assignments }: { assignments: Assignment[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
            <History className="h-6 w-6 text-primary"/>
            Assignment History
        </CardTitle>
        <CardDescription>The status of your recent assignment submissions.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assignments.length > 0 ? (
              assignments.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.title}</TableCell>
                  <TableCell>{format(new Date(a.created_at), 'PPP')}</TableCell>
                  <TableCell>
                    <Badge variant={a.status === 'pending' ? 'secondary' : a.status === 'approved' ? 'default' : 'destructive'}>
                      {a.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  You have not submitted any assignments yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
