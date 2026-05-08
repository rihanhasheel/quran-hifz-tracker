'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { BookOpen, LogOut, Menu, X } from 'lucide-react';
import type { Profile } from '@/lib/supabase/database.types';

interface NavbarProps {
  profile: Profile;
}

export default function Navbar({ profile }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <nav className="border-b border-bg-border bg-bg-surface/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <BookOpen className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="hidden sm:block">
              <span className="heading-display text-sm font-bold gradient-text">
                Quran Tracker
              </span>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Role badge */}
            <span
              className={`hidden sm:inline-flex text-xs font-medium px-2.5 py-1 rounded-full border ${
                profile.role === 'mentor'
                  ? 'bg-gold/10 text-gold border-gold/20'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              }`}
            >
              {profile.role === 'mentor' ? '🎓 Mentor' : '📖 Student'}
            </span>

            {/* User name */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                <span className="text-emerald-400 text-xs font-bold">
                  {profile.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-text-secondary text-sm">{profile.name}</span>
            </div>

            {/* Sign out button */}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 text-text-muted hover:text-red-400 transition-colors text-sm px-3 py-1.5 rounded-lg hover:bg-red-500/10"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
