import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Navbar from '@/components/Navbar';
import StudentDashboardClient from './StudentDashboardClient';
import { getTodayString } from '@/utils/streak';

export default async function StudentDashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) redirect('/login');
  if (profile.role !== 'student') redirect('/dashboard/mentor');

  const today = getTodayString();

  // Fetch today's learning tasks
  const { data: learningTasks } = await supabase
    .from('assignments')
    .select('*')
    .eq('student_id', user.id)
    .eq('type', 'learn')
    .eq('status', 'pending')
    .order('date', { ascending: true });

  // Fetch pending revision tasks (due today or overdue)
  const { data: revisionTasks } = await supabase
    .from('assignments')
    .select('*')
    .eq('student_id', user.id)
    .eq('type', 'revise')
    .eq('status', 'pending')
    .lte('date', today)
    .order('date', { ascending: true });

  // Fetch upcoming revisions (future)
  const { data: upcomingRevisions } = await supabase
    .from('assignments')
    .select('*')
    .eq('student_id', user.id)
    .eq('type', 'revise')
    .eq('status', 'pending')
    .gt('date', today)
    .order('date', { ascending: true })
    .limit(5);

  // Fetch completed assignments
  const { data: completedAssignments } = await supabase
    .from('assignments')
    .select('*')
    .eq('student_id', user.id)
    .eq('status', 'completed')
    .order('created_at', { ascending: false })
    .limit(20);

  return (
    <div className="min-h-screen bg-bg-base geometric-bg">
      <Navbar profile={profile} />
      <StudentDashboardClient
        profile={profile}
        initialLearningTasks={learningTasks || []}
        initialRevisionTasks={revisionTasks || []}
        initialUpcomingRevisions={upcomingRevisions || []}
        initialCompletedAssignments={completedAssignments || []}
      />
    </div>
  );
}
