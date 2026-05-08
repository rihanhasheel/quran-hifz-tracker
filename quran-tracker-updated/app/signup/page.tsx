'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { BookOpen, Eye, EyeOff, Loader2, GraduationCap, Users, Mail } from 'lucide-react';

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
      email,
      password,
      options: {
        data: { name, role },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        name,
        role,
        streak: 0,
        last_active_date: null,
      });

      if (profileError) {
        setError('Failed to create profile. Please try again.');
        setLoading(false);
        return;
      }

      if (role === 'mentor') {
        router.push('/dashboard/mentor');
      } else {
        router.push('/dashboard/student');
      }
    }
  };

  const handleGoogleSignup = async () => {
    setOauthLoading(true);
    setError('');

    // Store the selected role in localStorage so the callback can use it
    localStorage.setItem('signup_role', role);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?role=${role}`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      setError(error.message);
      setOauthLoading(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      setError('Please enter your name and email first.');
      return;
    }
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?role=${role}&name=${encodeURIComponent(name)}`,
        data: { name, role },
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccessMsg('Magic link sent! Check your email to complete sign-up.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-bg-base geometric-bg flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-4 shadow-emerald">
            <BookOpen className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="heading-display text-2xl font-bold gradient-text mb-1">
            Quran Learning Tracker
          </h1>
          <p className="text-text-muted text-sm">
            اقْرَأْ بِاسْمِ رَبِّكَ — Read in the name of your Lord
          </p>
        </div>

        <div className="bg-bg-card border border-bg-border rounded-2xl p-8 shadow-card">
          <h2 className="text-xl font-semibold text-text-primary mb-1">
            Begin your journey
          </h2>
          <p className="text-text-muted text-sm mb-6">
            Create your account to start tracking
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-scale-in">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm animate-scale-in">
              {successMsg}
            </div>
          )}

          {/* Role selection — shown first so it applies to any method */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-text-secondary mb-2">
              I am joining as
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200 ${
                  role === 'student'
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-emerald'
                    : 'border-bg-border bg-bg-surface text-text-muted hover:border-bg-elevated'
                }`}
              >
                <GraduationCap className="w-6 h-6" />
                <span className="text-sm font-medium">Student</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('mentor')}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200 ${
                  role === 'mentor'
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-emerald'
                    : 'border-bg-border bg-bg-surface text-text-muted hover:border-bg-elevated'
                }`}
              >
                <Users className="w-6 h-6" />
                <span className="text-sm font-medium">Mentor</span>
              </button>
            </div>
          </div>

          {/* Google OAuth */}
          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={oauthLoading || loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg border border-bg-border bg-bg-surface text-text-secondary hover:border-emerald-500/40 hover:text-text-primary hover:bg-bg-elevated transition-all duration-200 text-sm font-medium mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {oauthLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            Sign up with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-bg-border" />
            <span className="text-text-muted text-xs">or with email</span>
            <div className="flex-1 h-px bg-bg-border" />
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Full name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
                className="input-dark w-full rounded-lg px-4 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="input-dark w-full rounded-lg px-4 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  required
                  minLength={8}
                  className="input-dark w-full rounded-lg px-4 py-2.5 text-sm pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || oauthLoading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </button>
          </form>

          {/* Magic link alternative */}
          <div className="mt-3">
            <button
              type="button"
              onClick={handleMagicLink}
              disabled={loading || oauthLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-bg-border bg-bg-surface text-text-muted hover:border-emerald-500/30 hover:text-emerald-400 transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Mail className="w-4 h-4" />
              Sign up with magic link instead
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-text-muted text-sm">
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-text-muted text-xs mt-6">
          May Allah grant you knowledge and wisdom 📖
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}
