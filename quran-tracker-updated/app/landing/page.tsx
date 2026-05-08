'use client';

import Link from 'next/link';
import { BookOpen, Users, TrendingUp, CheckCircle, Star, ArrowRight, Moon, Flame } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-base overflow-x-hidden">

      {/* ── Nav ── */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-bg-border bg-bg-base/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal/10 border border-teal/20 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-teal-light" style={{color:'var(--teal-light)'}} />
            </div>
            <span className="font-display text-lg font-semibold gradient-text">Quran Hifz Tracker</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-text-secondary hover:text-text-primary transition-colors px-4 py-2">
              Sign in
            </Link>
            <Link href="/signup" className="btn-primary-new text-sm px-5 py-2 rounded-lg">
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="hero-gradient star-bg pt-32 pb-24 px-6 relative">
        <div className="absolute inset-0 geo-bg opacity-50 pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative">

          {/* Arabic ayah */}
          <div className="animate-fade-up inline-flex items-center gap-2 px-4 py-2 rounded-full border border-bg-border bg-bg-surface/60 backdrop-blur-sm mb-8">
            <Moon className="w-3.5 h-3.5" style={{color:'var(--gold)'}} />
            <span className="text-xs text-text-secondary tracking-wider">اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ</span>
            <Moon className="w-3.5 h-3.5" style={{color:'var(--gold)'}} />
          </div>

          <h1 className="animate-fade-up-1 font-display text-5xl sm:text-7xl font-light leading-tight mb-6" style={{color:'var(--text-primary)'}}>
            Your Quran journey,{' '}
            <span className="gradient-text font-semibold italic">tracked with care</span>
          </h1>

          <p className="animate-fade-up-2 text-lg text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
            A sacred space for students and mentors to track Hifz progress, manage revision schedules, and stay consistent — together.
          </p>

          <div className="animate-fade-up-3 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="btn-primary-new inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-base font-medium w-full sm:w-auto justify-center">
              Begin your journey
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/login" className="btn-ghost inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-base w-full sm:w-auto justify-center">
              I have an account
            </Link>
          </div>

          {/* Stats bar */}
          <div className="animate-fade-up-4 mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto">
            {[
              { num: '114', label: 'Surahs' },
              { num: '6,236', label: 'Ayahs' },
              { num: '∞', label: 'Blessings' },
            ].map(({ num, label }) => (
              <div key={label} className="text-center">
                <div className="font-display text-2xl font-semibold gradient-text">{num}</div>
                <div className="text-xs text-text-muted mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-24 px-6" style={{background:'linear-gradient(180deg, var(--bg-base) 0%, var(--bg-surface) 50%, var(--bg-base) 100%)'}}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-widest mb-3" style={{color:'var(--teal-light)'}}>How it works</p>
            <h2 className="font-display text-4xl font-light" style={{color:'var(--text-primary)'}}>Simple. Structured. <span className="gradient-text italic">Sacred.</span></h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                icon: <Users className="w-5 h-5" />,
                title: 'Mentor assigns',
                desc: 'Your teacher assigns surahs and ayahs for you to learn, with a target date and revision plan.',
              },
              {
                step: '02',
                icon: <BookOpen className="w-5 h-5" />,
                title: 'Student learns',
                desc: 'You memorise the assigned portion and mark it complete. The app automatically schedules your revision.',
              },
              {
                step: '03',
                icon: <TrendingUp className="w-5 h-5" />,
                title: 'Track progress',
                desc: 'Both mentor and student see progress in real-time. Streaks keep you motivated every single day.',
              },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} className="feature-card rounded-2xl p-8 relative">
                <div className="absolute top-6 right-6 font-display text-4xl font-bold opacity-10" style={{color:'var(--teal-light)'}}>{step}</div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5" style={{background:'rgba(13,148,136,0.1)', border:'1px solid rgba(13,148,136,0.2)', color:'var(--teal-light)'}}>
                  {icon}
                </div>
                <h3 className="font-display text-xl font-semibold mb-3" style={{color:'var(--text-primary)'}}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{color:'var(--text-secondary)'}}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 px-6 geo-bg">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-widest mb-3" style={{color:'var(--gold)'}}>Features</p>
            <h2 className="font-display text-4xl font-light" style={{color:'var(--text-primary)'}}>Everything you need to <span className="gradient-text italic">stay consistent</span></h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: <Flame className="w-5 h-5" />, title: 'Daily Streaks', desc: 'Stay motivated with streak tracking. Miss a day, reset to zero — consistency is key.' },
              { icon: <CheckCircle className="w-5 h-5" />, title: 'Smart Revision', desc: 'Spaced repetition built-in: 1 day, 3 days, 7 days after learning — proven memory science.' },
              { icon: <Users className="w-5 h-5" />, title: 'Mentor Dashboard', desc: 'Teachers get a full overview of all students, assignments, and completion rates.' },
              { icon: <Star className="w-5 h-5" />, title: 'Progress History', desc: 'Every completed surah and ayah is recorded. Watch your Hifz grow over time.' },
              { icon: <BookOpen className="w-5 h-5" />, title: 'All 114 Surahs', desc: 'Full Quran surah database with ayah counts built in — no manual entry needed.' },
              { icon: <Moon className="w-5 h-5" />, title: 'Beautiful & Focused', desc: 'Distraction-free design so your focus stays on what matters — the words of Allah.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="card-hover flex gap-4 p-6 rounded-xl border" style={{background:'var(--bg-card)', borderColor:'var(--bg-border)'}}>
                <div className="w-9 h-9 shrink-0 rounded-lg flex items-center justify-center" style={{background:'rgba(13,148,136,0.08)', color:'var(--teal-light)'}}>
                  {icon}
                </div>
                <div>
                  <h4 className="font-medium mb-1 text-sm" style={{color:'var(--text-primary)'}}>{title}</h4>
                  <p className="text-xs leading-relaxed" style={{color:'var(--text-secondary)'}}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who is it for ── */}
      <section className="py-24 px-6" style={{background:'var(--bg-surface)'}}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display text-4xl font-light" style={{color:'var(--text-primary)'}}>Built for <span className="gradient-text italic">students & mentors</span></h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Student */}
            <div className="rounded-2xl p-8" style={{background:'linear-gradient(135deg, rgba(13,148,136,0.06), rgba(13,148,136,0.02))', border:'1px solid rgba(13,148,136,0.15)'}}>
              <div className="text-3xl mb-4">📖</div>
              <h3 className="font-display text-2xl font-semibold mb-4" style={{color:'var(--teal-light)'}}>For Students</h3>
              <ul className="space-y-3">
                {[
                  'See your daily learning & revision tasks',
                  'Mark ayahs as memorised with one tap',
                  'Track your daily streak',
                  'View your complete Hifz history',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2.5 text-sm" style={{color:'var(--text-secondary)'}}>
                    <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" style={{color:'var(--teal-light)'}} />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/signup?role=student" className="mt-8 btn-primary-new inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm">
                Join as Student <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Mentor */}
            <div className="rounded-2xl p-8" style={{background:'linear-gradient(135deg, rgba(201,168,76,0.06), rgba(201,168,76,0.02))', border:'1px solid rgba(201,168,76,0.15)'}}>
              <div className="text-3xl mb-4">🎓</div>
              <h3 className="font-display text-2xl font-semibold mb-4" style={{color:'var(--gold-light)'}}>For Mentors</h3>
              <ul className="space-y-3">
                {[
                  'Add and manage your students',
                  'Assign new surahs & ayahs easily',
                  'Monitor each student\'s progress',
                  'See all pending and completed tasks',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2.5 text-sm" style={{color:'var(--text-secondary)'}}>
                    <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" style={{color:'var(--gold-light)'}} />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/signup?role=mentor" className="mt-8 inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all" style={{background:'rgba(201,168,76,0.1)', border:'1px solid rgba(201,168,76,0.3)', color:'var(--gold-light)'}}>
                Join as Mentor <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-28 px-6 star-bg relative">
        <div className="absolute inset-0 hero-gradient pointer-events-none" />
        <div className="max-w-2xl mx-auto text-center relative">
          <p className="font-display text-lg italic mb-3" style={{color:'var(--gold)'}}>
            &ldquo;وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ&rdquo;
          </p>
          <p className="text-xs mb-10" style={{color:'var(--text-muted)'}}>And We have certainly made the Quran easy to remember — Al-Qamar 54:17</p>
          <h2 className="font-display text-4xl font-light mb-8" style={{color:'var(--text-primary)'}}>
            Start your <span className="gradient-text italic">Hifz journey</span> today
          </h2>
          <Link href="/signup" className="btn-primary-new inline-flex items-center gap-2 px-10 py-4 rounded-xl text-base font-medium">
            Create free account
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t py-8 px-6 text-center" style={{borderColor:'var(--bg-border)'}}>
        <div className="flex items-center justify-center gap-2 mb-2">
          <BookOpen className="w-4 h-4" style={{color:'var(--teal-light)'}} />
          <span className="font-display font-semibold gradient-text">Quran Hifz Tracker</span>
        </div>
        <p className="text-xs" style={{color:'var(--text-muted)'}}>May Allah make it easy for you. بارك الله فيك</p>
      </footer>
    </div>
  );
}
