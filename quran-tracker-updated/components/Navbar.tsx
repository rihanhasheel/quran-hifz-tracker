'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { BookOpen, LogOut, Menu, X } from 'lucide-react';
import type { Profile } from '@/lib/supabase/database.types';

interface NavbarProps { profile: Profile; }

export default function Navbar({ profile }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <nav className="border-b sticky top-0 z-50 backdrop-blur-md" style={{background:'rgba(6,10,14,0.85)', borderColor:'var(--bg-border)'}}>
      <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:'rgba(13,148,136,0.1)', border:'1px solid rgba(13,148,136,0.2)'}}>
            <BookOpen className="w-4 h-4" style={{color:'var(--teal-light)'}} />
          </div>
          <span className="font-display font-semibold gradient-text hidden sm:block">Quran Hifz Tracker</span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex text-xs font-medium px-2.5 py-1 rounded-full"
            style={profile.role === 'mentor'
              ? {background:'rgba(201,168,76,0.1)', color:'var(--gold-light)', border:'1px solid rgba(201,168,76,0.2)'}
              : {background:'rgba(13,148,136,0.1)', color:'var(--teal-light)', border:'1px solid rgba(13,148,136,0.2)'}
            }>
            {profile.role === 'mentor' ? '🎓 Mentor' : '📖 Student'}
          </span>

          <div className="hidden sm:flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{background:'rgba(13,148,136,0.15)', border:'1px solid rgba(13,148,136,0.25)'}}>
              <span className="text-xs font-bold" style={{color:'var(--teal-light)'}}>
                {profile.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-sm" style={{color:'var(--text-secondary)'}}>{profile.name}</span>
          </div>

          <button onClick={handleSignOut}
            className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-all"
            style={{color:'var(--text-muted)'}}
            onMouseOver={e=>{(e.currentTarget as HTMLButtonElement).style.color='#f87171';(e.currentTarget as HTMLButtonElement).style.background='rgba(239,68,68,0.08)';}}
            onMouseOut={e=>{(e.currentTarget as HTMLButtonElement).style.color='var(--text-muted)';(e.currentTarget as HTMLButtonElement).style.background='transparent';}}>
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
