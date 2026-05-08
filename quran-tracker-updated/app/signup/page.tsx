'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { BookOpen, Eye, EyeOff, Loader2, GraduationCap, Users, Mail, ArrowLeft } from 'lucide-react';

type Role = 'student' | 'mentor';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<Role>('student');
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error: signUpError } = await supabase.auth.signUp({
      email, password,
      options: { data: { name, role } },
    });

    if (signUpError) { setError(signUpError.message); setLoading(false); return; }

    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id, name, role, streak: 0, last_active_date: null,
      });
      if (profileError) { setError('Failed to create profile. Please try again.'); setLoading(false); return; }
      if (role === 'mentor') router.push('/dashboard/mentor');
      else router.push('/dashboard/student');
    }
  };

  const handleGoogleSignup = async () => {
    setOauthLoading(true);
    setError('');
    localStorage.setItem('signup_role', role);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?role=${role}`,
        queryParams: { access_type: 'offline', prompt: 'consent' },
      },
    });
    if (error) { setError(error.message); setOauthLoading(false); }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) { setError('Please enter your name and email first.'); return; }
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?role=${role}&name=${encodeURIComponent(name)}`,
        data: { name, role },
      },
    });
    if (error) setError(error.message);
    else setSuccessMsg('Magic link sent! Check your email to complete sign-up.');
    setLoading(false);
  };

  return (
    <div className="min-h-screen geo-bg flex" style={{background:'var(--bg-base)'}}>
      {/* Left decorative panel */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 p-12 border-r star-bg" style={{background:'linear-gradient(160deg, var(--bg-surface) 0%, var(--bg-base) 100%)', borderColor:'var(--bg-border)'}}>
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{background:'rgba(13,148,136,0.1)', border:'1px solid rgba(13,148,136,0.2)'}}>
            <BookOpen className="w-4 h-4" style={{color:'var(--teal-light)'}} />
          </div>
          <span className="font-display font-semibold gradient-text">Quran Hifz Tracker</span>
        </Link>

        <div>
          <p className="font-display text-3xl font-light leading-snug mb-6" style={{color:'var(--text-primary)'}}>
            &ldquo;Whoever recites a letter from the Book of Allah, he will receive one good deed.&rdquo;
          </p>
          <p className="text-sm" style={{color:'var(--text-muted)'}}>— Prophet Muhammad ﷺ (Tirmidhi)</p>
        </div>

        <div className="p-5 rounded-2xl" style={{background:'rgba(13,148,136,0.05)', border:'1px solid rgba(13,148,136,0.12)'}}>
          <p className="text-sm leading-relaxed" style={{color:'var(--text-secondary)'}}>
            Join as a <span style={{color:'var(--teal-light)'}}>Student</span> to track your Hifz with your teacher, or as a <span style={{color:'var(--gold-light)'}}>Mentor</span> to guide your students.
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md animate-fade-up">

          <Link href="/" className="inline-flex items-center gap-1.5 text-sm mb-8 transition-colors" style={{color:'var(--text-muted)'}}>
            <ArrowLeft className="w-3.5 h-3.5" /> Back to home
          </Link>

          <h1 className="font-display text-4xl font-light mb-1" style={{color:'var(--text-primary)'}}>Begin your journey</h1>
          <p className="text-sm mb-8" style={{color:'var(--text-secondary)'}}>اقْرَأْ — Create your account to start tracking</p>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl text-sm" style={{background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', color:'#f87171'}}>
              {error}
            </div>
          )}
          {successMsg && (
            <div className="mb-5 p-3.5 rounded-xl text-sm" style={{background:'rgba(13,148,136,0.08)', border:'1px solid rgba(13,148,136,0.2)', color:'var(--teal-light)'}}>
              {successMsg}
            </div>
          )}

          {/* Role selector */}
          <div className="mb-6">
            <p className="text-xs font-medium mb-2.5" style={{color:'var(--text-secondary)'}}>I am joining as</p>
            <div className="grid grid-cols-2 gap-3">
              {([
                { r: 'student' as Role, icon: <GraduationCap className="w-5 h-5" />, label: 'Student', color: 'teal' },
                { r: 'mentor'  as Role, icon: <Users className="w-5 h-5" />,         label: 'Mentor',  color: 'gold' },
              ]).map(({ r, icon, label, color }) => (
                <button key={r} onClick={() => setRole(r)}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all"
                  style={role === r
                    ? { background: color==='teal' ? 'rgba(13,148,136,0.1)' : 'rgba(201,168,76,0.1)',
                        border: `1px solid ${color==='teal' ? 'rgba(13,148,136,0.4)' : 'rgba(201,168,76,0.4)'}`,
                        color: color==='teal' ? 'var(--teal-light)' : 'var(--gold-light)' }
                    : { background: 'var(--bg-surface)', border: '1px solid var(--bg-border)', color: 'var(--text-muted)' }
                  }
                >
                  {icon}
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Google */}
          <button onClick={handleGoogleSignup} disabled={oauthLoading || loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-sm font-medium mb-5 transition-all"
            style={{background:'var(--bg-surface)', border:'1px solid var(--bg-border)', color:'var(--text-secondary)'}}
            onMouseOver={e=>{(e.currentTarget as HTMLButtonElement).style.borderColor='rgba(13,148,136,0.35)';(e.currentTarget as HTMLButtonElement).style.color='var(--text-primary)';}}
            onMouseOut={e=>{(e.currentTarget as HTMLButtonElement).style.borderColor='var(--bg-border)';(e.currentTarget as HTMLButtonElement).style.color='var(--text-secondary)';}}
          >
            {oauthLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <GoogleIcon />}
            Sign up with Google
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 divider" />
            <span className="text-xs" style={{color:'var(--text-muted)'}}>or with email</span>
            <div className="flex-1 divider" />
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{color:'var(--text-secondary)'}}>Full name</label>
              <input type="text" value={name} onChange={e=>setName(e.target.value)}
                placeholder="Your name" required className="input-dark w-full rounded-xl px-4 py-3 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{color:'var(--text-secondary)'}}>Email address</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
                placeholder="you@example.com" required className="input-dark w-full rounded-xl px-4 py-3 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{color:'var(--text-secondary)'}}>Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password}
                  onChange={e=>setPassword(e.target.value)} placeholder="Min. 8 characters"
                  required minLength={8} className="input-dark w-full rounded-xl px-4 py-3 text-sm pr-11" />
                <button type="button" onClick={()=>setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{color:'var(--text-muted)'}}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading||oauthLoading}
              className="btn-primary-new w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Creating account...</> : 'Create account'}
            </button>
          </form>

          <button onClick={handleMagicLink} disabled={loading||oauthLoading}
            className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm transition-all"
            style={{background:'var(--bg-surface)', border:'1px solid var(--bg-border)', color:'var(--text-muted)'}}
            onMouseOver={e=>{(e.currentTarget as HTMLButtonElement).style.borderColor='rgba(13,148,136,0.3)';(e.currentTarget as HTMLButtonElement).style.color='var(--teal-light)';}}
            onMouseOut={e=>{(e.currentTarget as HTMLButtonElement).style.borderColor='var(--bg-border)';(e.currentTarget as HTMLButtonElement).style.color='var(--text-muted)';}}
          >
            <Mail className="w-4 h-4" /> Sign up with magic link instead
          </button>

          <p className="mt-6 text-center text-sm" style={{color:'var(--text-muted)'}}>
            Already have an account?{' '}
            <Link href="/login" className="font-medium" style={{color:'var(--teal-light)'}}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}
