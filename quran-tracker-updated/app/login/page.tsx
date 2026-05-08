'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { BookOpen, Eye, EyeOff, Loader2, Mail } from 'lucide-react';

type LoginMethod = 'password' | 'magic-link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('password');
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    if (loginMethod === 'magic-link') {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccessMsg('Check your email — we sent you a magic link to sign in.');
      }
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profile?.role === 'mentor') {
        router.push('/dashboard/mentor');
      } else {
        router.push('/dashboard/student');
      }
    }
  };

  const handleGoogleLogin = async () => {
    setOauthLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
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

  return (
    <div className="min-h-screen bg-bg-base geometric-bg flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
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
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
        </div>

        <div className="bg-bg-card border border-bg-border rounded-2xl p-8 shadow-card">
          <h2 className="text-xl font-semibold text-text-primary mb-1">
            Welcome back
          </h2>
          <p className="text-text-muted text-sm mb-6">
            Continue your learning journey
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

          {/* Google OAuth button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={oauthLoading || loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg border border-bg-border bg-bg-surface text-text-secondary hover:border-emerald-500/40 hover:text-text-primary hover:bg-bg-elevated transition-all duration-200 text-sm font-medium mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {oauthLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-bg-border" />
            <span className="text-text-muted text-xs">or</span>
            <div className="flex-1 h-px bg-bg-border" />
          </div>

          {/* Login method toggle */}
          <div className="flex rounded-lg border border-bg-border bg-bg-surface p-1 gap-1 mb-4">
            <button
              type="button"
              onClick={() => { setLoginMethod('password'); setError(''); setSuccessMsg(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-medium transition-all duration-200 ${
                loginMethod === 'password'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Password
            </button>
            <button
              type="button"
              onClick={() => { setLoginMethod('magic-link'); setError(''); setSuccessMsg(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-medium transition-all duration-200 ${
                loginMethod === 'magic-link'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              Magic Link
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
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

            {loginMethod === 'password' && (
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
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
            )}

            {loginMethod === 'magic-link' && (
              <p className="text-xs text-text-muted bg-bg-surface border border-bg-border rounded-lg px-3 py-2.5">
                ✨ We&apos;ll email you a one-click sign-in link. No password needed.
              </p>
            )}

            <button
              type="submit"
              disabled={loading || oauthLoading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {loginMethod === 'magic-link' ? 'Sending link...' : 'Signing in...'}
                </>
              ) : loginMethod === 'magic-link' ? (
                <>
                  <Mail className="w-4 h-4" />
                  Send magic link
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-text-muted text-sm">
              Don&apos;t have an account?{' '}
              <Link
                href="/signup"
                className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-text-muted text-xs mt-6">
          May Allah bless your journey with the Quran 🌿
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
