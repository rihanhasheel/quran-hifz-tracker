import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import LandingPage from './landing/page';

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role === 'mentor') redirect('/dashboard/mentor');
    else redirect('/dashboard/student');
  }

  return <LandingPage />;
}
