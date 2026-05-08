import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Navbar from '@/components/Navbar';
import MentorDashboardClient from './MentorDashboardClient';

export default async function MentorDashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) redirect('/login');
  if (profile.role !== 'mentor') redirect('/dashboard/student');

  // Fetch all students assigned to this mentor
  const { data: students } = await supabase
    .from('profiles')
    .select('*')
    .eq('mentor_id', user.id)
    .eq('role', 'student')
    .order('name', { ascending: true });

  // Fetch all assignments for this mentor's students
  const { data: assignments } = await supabase
    .from('assignments')
    .select('*')
    .eq('mentor_id', user.id)
    .order('created_at', { ascending: false })
    .limit(100);

  return (
    <div className="min-h-screen bg-bg-base geometric-bg">
      <Navbar profile={profile} />
      <MentorDashboardClient
        profile={profile}
        initialStudents={students || []}
        initialAssignments={assignments || []}
      />
    </div>
  );
}
