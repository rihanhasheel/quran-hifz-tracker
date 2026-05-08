import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const role = (searchParams.get('role') as 'student' | 'mentor') ?? 'student';
  const name = searchParams.get('name') ?? '';

  if (code) {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Check if profile already exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (!existingProfile) {
        // New user — create profile using role/name from query params or user metadata
        const userName =
          name ||
          data.user.user_metadata?.full_name ||
          data.user.user_metadata?.name ||
          data.user.email?.split('@')[0] ||
          'User';

        const userRole: 'student' | 'mentor' =
          role ||
          data.user.user_metadata?.role ||
          'student';

        await supabase.from('profiles').insert({
          id: data.user.id,
          name: userName,
          role: userRole,
          streak: 0,
          last_active_date: null,
        });

        const redirectPath = userRole === 'mentor' ? '/dashboard/mentor' : '/dashboard/student';
        return NextResponse.redirect(`${origin}${redirectPath}`);
      }

      // Existing user — redirect based on stored role
      const redirectPath =
        existingProfile.role === 'mentor' ? '/dashboard/mentor' : '/dashboard/student';
      return NextResponse.redirect(`${origin}${redirectPath}`);
    }
  }

  // Auth failed — send back to login with an error
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
