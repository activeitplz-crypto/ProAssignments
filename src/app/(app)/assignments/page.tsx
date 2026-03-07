import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Info, CheckCircle, Clock, Sparkles, ShieldCheck } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AssignmentForm } from './assignment-form';
import type { Task, Assignment } from '@/lib/types';
import { cn } from '@/lib/utils';

function getStatusBadge(isApproved: boolean) {
    if (isApproved) {
        return (
            <div className="flex items-center gap-2 bg-green-500/10 text-green-600 px-4 py-1.5 rounded-full border border-green-500/10">
                <CheckCircle className="h-3 w-3" />
                <span className="text-[10px] font-black uppercase tracking-widest">Assignment is Verified</span>
            </div>
        );
    }
    return (
        <div className="flex items-center gap-2 bg-slate-100 text-slate-400 px-4 py-1.5 rounded-full border border-slate-200">
            <Clock className="h-3 w-3" />
            <span className="text-[10px] font-black uppercase tracking-widest">Pending Submission</span>
        </div>
    );
}

export default async function AssignmentsPage() {
  const supabase = await createClient();
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
      <div className="p-6">
        <Alert variant="default" className="border-primary bg-white rounded-[2rem] shadow-xl p-8">
            <div className="flex flex-col items-center text-center gap-4">
                <div className="h-16 w-16 rounded-[1.5rem] bg-primary/10 flex items-center justify-center text-primary">
                    <ShieldCheck className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                    <AlertTitle className="text-xl font-black uppercase tracking-tighter italic">No Active Plan Found</AlertTitle>
                    <AlertDescription className="text-sm font-medium text-muted-foreground leading-relaxed">
                    You must activate an elite investment plan to unlock the assignment verification portal.
                    </AlertDescription>
                </div>
            </div>
        </Alert>
      </div>
    );
  }
  
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
    return <div className="p-12 text-center font-black uppercase tracking-widest text-destructive">System Interface Error</div>;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const { data: approved_assignments, error: submissionsError } = await supabase
    .from('assignments')
    .select('task_id')
    .eq('user_id', session.user.id)
    .eq('status', 'approved')
    .gte('created_at', today.toISOString());

  if (submissionsError) {
      console.error('Error fetching submissions:', submissionsError);
      return <div className="p-12 text-center font-black uppercase tracking-widest text-destructive">Data Sync Error</div>
  }

  const approvedTaskIds = new Set<string>();
    (approved_assignments as Pick<Assignment, 'task_id'>[]).forEach(a => {
        if(a.task_id) {
            approvedTaskIds.add(a.task_id);
        }
    });

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <div className="bg-primary pt-16 pb-20 px-6 relative rounded-b-[2.5rem] shadow-lg overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <div className="flex items-center justify-center gap-2">
              <span className="text-white/60 font-black uppercase text-[10px] tracking-[0.3em]">AI Verification</span>
              <Sparkles className="h-3 w-3 text-yellow-400/60" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic text-white leading-none">
            Proof <span className="text-white/80">Submission</span>
          </h1>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">Upload handwritten work for real-time validation</p>
        </div>
      </div>

      <div className="px-4 -mt-10 space-y-8 max-w-4xl mx-auto w-full pb-24 relative z-20">
        {tasks && tasks.length > 0 ? (
          <div className="space-y-8">
            {(tasks as Task[]).map((task, index) => {
              const isApproved = approvedTaskIds.has(task.id);
              return (
                <Card key={task.id} className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden group">
                  <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-5">
                        <div className="h-14 w-14 rounded-[1.5rem] bg-slate-50 flex items-center justify-center border border-slate-100 transition-all duration-500 group-hover:bg-primary/5 group-hover:border-primary/20">
                            <span className="text-xl font-black text-slate-900 leading-none">{index + 1}</span>
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-black text-slate-900 uppercase tracking-tighter text-lg leading-none">{task.title}</h3>
                        </div>
                    </div>
                    {getStatusBadge(isApproved)}
                  </div>

                  <CardContent className="p-8">
                      {isApproved ? (
                         <div className="flex flex-col items-center justify-center py-10 gap-4 bg-green-50/30 rounded-[2rem] border border-green-100">
                            <div className="h-16 w-16 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/20">
                                <CheckCircle className="h-8 w-8 text-white" />
                            </div>
                            <div className="text-center space-y-1">
                                <p className="text-lg font-black uppercase tracking-tighter text-green-700 leading-none">Task Finalized</p>
                                <p className="text-[10px] font-bold text-green-600/60 uppercase tracking-widest">Earnings added to your balance</p>
                            </div>
                         </div>
                      ) : (
                        <AssignmentForm task={task} />
                      )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 gap-6 bg-white rounded-[2.5rem] shadow-xl border border-slate-100">
            <div className="h-20 w-20 rounded-[2rem] bg-slate-50 flex items-center justify-center text-slate-300">
                <Info className="h-10 w-10" />
            </div>
            <div className="text-center space-y-2">
                <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900">Submission Queue Empty</h3>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest max-w-[240px] leading-relaxed">
                    Check the Tasks station to launch new assignments for verification.
                </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
