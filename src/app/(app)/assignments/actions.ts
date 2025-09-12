
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { verifyAssignment, type VerifyAssignmentInput } from '@/ai/flows/verify-assignment-flow';

const assignmentSchema = z.object({
  taskId: z.string().uuid('Invalid Task ID.'),
  title: z.string().min(1, 'Title is required.'),
  images: z.array(z.string()).min(1, 'At least one image is required.'),
});

async function updateUserEarnings(supabase: ReturnType<typeof createClient>, userId: string) {
    // 1. Get user's current plan
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('current_plan')
        .eq('id', userId)
        .single();
    
    if (profileError || !profile || !profile.current_plan) {
        console.error("Could not fetch user plan for earnings update", profileError);
        return; // Exit if no plan found
    }

    // 2. Get plan details (daily earning amount and task limit)
    const { data: plan, error: planError } = await supabase
        .from('plans')
        .select('daily_earning, daily_assignments')
        .eq('name', profile.current_plan)
        .single();

    if (planError || !plan) {
        console.error("Could not fetch plan details for earnings update", planError);
        return; // Exit if no plan details found
    }
    
    // 3. Count today's approved assignments for the user
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    const { count: approvedCount, error: countError } = await supabase
        .from('assignments')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', 'approved')
        .gte('created_at', today.toISOString());
    
    if (countError) {
        console.error("Could not count approved assignments", countError);
        return;
    }

    // 4. If approved count matches daily assignment limit, update earnings
    if (approvedCount !== null && approvedCount == plan.daily_assignments) {
       const { error: rpcError } = await supabase.rpc('add_daily_earnings', {
           p_user_id: userId,
           p_earnings_to_add: plan.daily_earning,
       });
       if(rpcError) {
           console.error("Failed to add daily earnings via RPC:", rpcError);
       }
    }
}


export async function submitAssignmentWithImages(formData: z.infer<typeof assignmentSchema>) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be logged in to submit an assignment.' };
  }
  
  // 1. Check for existing APPROVED submission for this task today
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Start of today
  const { data: existingSubmission, error: existingError } = await supabase
    .from('assignments')
    .select('id')
    .eq('user_id', user.id)
    .eq('task_id', formData.taskId)
    .eq('status', 'approved') // We only care about blocking re-submission for already approved tasks
    .gte('created_at', today.toISOString())
    .maybeSingle();

  if (existingError) {
    console.error('Server-side check error:', existingError);
    return { error: 'Could not verify your submission status.' };
  }
  
  // Block resubmission only if it's already approved
  if (existingSubmission) {
    return { error: 'You have already submitted and been approved for this task today.' };
  }

  // 2. Prepare data and call AI verification flow
  const aiInput: VerifyAssignmentInput = {
    taskTitle: formData.title,
    images: formData.images,
  };

  const aiResult = await verifyAssignment(aiInput);

  // 3. If AI verification is NOT approved, just return feedback without saving anything.
  if (!aiResult.isApproved) {
    return { 
        error: null, 
        aiFeedback: aiResult.reason, 
        isApproved: false 
    };
  }

  // 4. If AI verification IS approved, insert the assignment.
  // We use INSERT instead of UPSERT because we only save 'approved' status.
  // Any previous rejections were not saved, so there's nothing to update.
  const { error: insertError } = await supabase
    .from('assignments')
    .insert({
      user_id: user.id,
      task_id: formData.taskId,
      title: formData.title,
      urls: [], // URLs are no longer used, but schema might require it
      status: 'approved',
      feedback: aiResult.reason,
      created_at: new Date().toISOString(),
    });

  if (insertError) {
    console.error('Assignment Insert Error:', insertError);
    return { error: 'Failed to save your approved assignment.', aiFeedback: aiResult.reason };
  }
  
  // 5. Since it's approved, check if all daily tasks are done and update earnings
  await updateUserEarnings(supabase, user.id);
  
  revalidatePath('/assignments');
  revalidatePath('/dashboard');
  
  return { error: null, aiFeedback: aiResult.reason, isApproved: aiResult.isApproved };
}
