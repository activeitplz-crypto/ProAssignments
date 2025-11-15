
'use client';

import { useState, useEffect, useCallback, useTransition } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import type { Assignment } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { approveAssignment, rejectAssignment } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Check, ExternalLink, Loader2, X } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type EnrichedAssignment = Assignment & {
  profiles: { name: string | null; email: string | null } | null;
  tasks: { title: string | null } | null;
};

export function AssignmentsTable() {
  const [assignments, setAssignments] = useState<EnrichedAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchAssignments = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('assignments')
      .select('*, profiles(name, email), tasks(title)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching assignments:', error);
      setAssignments([]);
    } else {
      setAssignments(data as EnrichedAssignment[]);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchAssignments();

    const channel = supabase
      .channel('realtime-assignments-admin')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'assignments' },
        () => fetchAssignments()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, fetchAssignments]);

  if (loading) {
    return (
       <Card>
        <CardHeader>
          <CardTitle>Assignment Submissions</CardTitle>
          <CardDescription>Review and approve user task submissions.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Task Title</TableHead>
                    <TableHead>AI Feedback</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {[...Array(3)].map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[90px]" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-[80px] rounded-full" /></TableCell>
                        <TableCell className="space-x-2"><Skeleton className="h-8 w-[80px]" /><Skeleton className="h-8 w-[80px]" /></TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assignment Submissions</CardTitle>
        <CardDescription>Review and manually override AI-verified task submissions if necessary.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
            <TableHeader>
            <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Task Title</TableHead>
                <TableHead>AI Feedback</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
            </TableRow>
            </TableHeader>
            <TableBody>
            {assignments.length > 0 ? (
                assignments.map((a) => (
                    <AssignmentRow key={a.id} assignment={a} />
                ))
            ) : (
                <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                    No assignment submissions found.
                </TableCell>
                </TableRow>
            )}
            </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function AssignmentRow({ assignment }: { assignment: EnrichedAssignment }) {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const handleAction = async (action: (fd: FormData) => Promise<{error: string | null} | void>) => {
        const formData = new FormData();
        formData.append('assignmentId', assignment.id);

        startTransition(async () => {
            const result = await action(formData);
            if (result?.error) {
                toast({ variant: 'destructive', title: 'Action Failed', description: result.error });
            } else {
                 toast({ title: 'Success', description: 'Assignment status updated.' });
            }
        });
    }

    return (
        <TableRow>
            <TableCell>
                <div>{assignment.profiles?.name || 'N/A'}</div>
                <div className="text-xs text-muted-foreground">{assignment.profiles?.email}</div>
            </TableCell>
            <TableCell>{assignment.tasks?.title || assignment.title}</TableCell>
            <TableCell>{assignment.feedback || "N/A"}</TableCell>
            <TableCell>{format(new Date(assignment.created_at), 'PPP')}</TableCell>
            <TableCell>
                 <Badge
                    variant={
                        assignment.status === 'approved'
                        ? 'default'
                        : assignment.status === 'rejected'
                        ? 'destructive'
                        : 'secondary'
                    }
                    className={cn(
                        assignment.status === 'approved' && 'bg-green-500 hover:bg-green-600'
                    )}
                    >
                    {assignment.status}
                </Badge>
            </TableCell>
            <TableCell className="space-x-2">
                {assignment.status !== 'approved' && (
                    <Button size="sm" onClick={() => handleAction(approveAssignment)} disabled={isPending}>
                        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />} Approve
                    </Button>
                )}
                 {assignment.status !== 'rejected' && (
                    <Button size="sm" variant="destructive" onClick={() => handleAction(rejectAssignment)} disabled={isPending}>
                       {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <X className="mr-2 h-4 w-4" />} Reject
                    </Button>
                )}
            </TableCell>
        </TableRow>
    )
}
