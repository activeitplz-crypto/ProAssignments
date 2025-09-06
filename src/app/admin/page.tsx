
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { createClient } from '@/lib/supabase/server';
import { ManagePlansForm } from './manage-plans-form';
import { PaymentsTable } from './payments-table';
import { WithdrawalsTable } from './withdrawals-table';
import { UsersTable } from './users-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ManageTasksForm } from './manage-tasks-form';
import { AssignmentsTable } from './assignments-table';

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { tab: string | undefined };
}) {
  const defaultTab = searchParams.tab || 'assignments';
  const supabase = createClient();
  
  const { data: plansData } = await supabase.from('plans').select('*').order('investment');
  const plans = plansData || [];

  const { data: tasksData } = await supabase.from('tasks').select('*').order('created_at');
  const tasks = tasksData || [];


  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList className="grid w-full grid-cols-6">
        <TabsTrigger value="assignments">Assignments</TabsTrigger>
        <TabsTrigger value="payments">Plan Payments</TabsTrigger>
        <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
        <TabsTrigger value="users">All Users</TabsTrigger>
        <TabsTrigger value="plans">Manage Plans</TabsTrigger>
        <TabsTrigger value="tasks">Manage Tasks</TabsTrigger>
      </TabsList>

      <TabsContent value="assignments">
        <AssignmentsTable />
      </TabsContent>

      <TabsContent value="payments">
        <PaymentsTable />
      </TabsContent>

      <TabsContent value="withdrawals">
        <WithdrawalsTable />
      </TabsContent>
      
      <TabsContent value="users">
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>A complete list of all registered users in the system.</CardDescription>
          </CardHeader>
          <CardContent>
            <UsersTable />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="plans">
        <ManagePlansForm plans={plans} />
      </TabsContent>

      <TabsContent value="tasks">
        <ManageTasksForm tasks={tasks} />
      </TabsContent>
    </Tabs>
  );
}
