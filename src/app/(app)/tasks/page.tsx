import { createClient } from '@/lib/supabase/server';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { ListTodo, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { redirect } from 'next/navigation';
import { TaskItem } from './task-item';

export default async function TasksPage() {
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

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <div className="bg-primary pt-16 pb-20 px-6 relative rounded-b-[2.5rem] shadow-lg overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <div className="flex items-center justify-center gap-2">
              <span className="text-white/60 font-black uppercase text-[10px] tracking-[0.3em]">Work Station</span>
              <Sparkles className="h-3 w-3 text-yellow-400/60" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic text-white leading-none">
            Your Daily <span className="text-white/80">Tasks</span>
          </h1>
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
              <Clock className="h-3 w-3 text-white/70" />
              <span className="text-[9px] font-bold text-white/90 uppercase tracking-widest">Resets in 24 Hours</span>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-10 space-y-6 max-w-4xl mx-auto w-full pb-24 relative z-20">
        <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
            <CardContent className="p-8 flex items-center justify-between">
                <div className="space-y-1">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none">Today's Goal</p>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-slate-900 leading-none">{tasks?.length || 0}</span>
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-tighter">Assignments</span>
                    </div>
                </div>
                <div className="h-14 w-14 rounded-2xl bg-green-500/10 flex items-center justify-center">
                    <CheckCircle2 className="h-7 w-7 text-green-600" />
                </div>
            </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center gap-2 px-2">
              <ListTodo className="h-4 w-4 text-primary opacity-40" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Task Queue</h3>
          </div>

          {tasks && tasks.length > 0 ? (
            <div className="grid gap-4">
              {tasks.map((task, index) => (
                <TaskItem 
                  key={task.id} 
                  task={task} 
                  taskNumber={index + 1}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 gap-4 bg-white rounded-[2.5rem] shadow-sm border border-slate-100">
              {dailyTaskLimit > 0 ? (
                <p className="text-center text-muted-foreground font-bold uppercase text-[10px] tracking-widest">
                  Tasks will be updated soon. Check back later.
                </p>
              ) : (
                <Alert variant="default" className="border-none bg-transparent max-w-xs mx-auto text-center p-0">
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <span className="h-6 w-6">i</span>
                    </div>
                    <div className="space-y-1">
                        <AlertTitle className="text-sm font-black uppercase tracking-tight">Access Restricted</AlertTitle>
                        <AlertDescription className="text-[10px] font-medium text-muted-foreground leading-relaxed">
                            You need an active investment plan to view and complete assignments.
                        </AlertDescription>
                    </div>
                  </div>
                </Alert>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
