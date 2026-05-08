'use client';

import { useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { BookOpen, RotateCcw, CheckCircle2, Calendar, Clock } from 'lucide-react';
import type { Profile, Assignment } from '@/lib/supabase/database.types';
import { calculateNewStreak, getTodayString, addDaysToToday, formatDateDisplay } from '@/utils/streak';
import StreakBadge from '@/components/StreakBadge';
import SuccessToast from '@/components/SuccessToast';
import EmptyState from '@/components/EmptyState';
import SectionHeader from '@/components/SectionHeader';

interface StudentDashboardClientProps {
  profile: Profile;
  initialLearningTasks: Assignment[];
  initialRevisionTasks: Assignment[];
  initialUpcomingRevisions: Assignment[];
  initialCompletedAssignments: Assignment[];
}

export default function StudentDashboardClient({
  profile,
  initialLearningTasks,
  initialRevisionTasks,
  initialUpcomingRevisions,
  initialCompletedAssignments,
}: StudentDashboardClientProps) {
  const supabase = createClient();

  const [learningTasks, setLearningTasks] = useState(initialLearningTasks);
  const [revisionTasks, setRevisionTasks] = useState(initialRevisionTasks);
  const [upcomingRevisions, setUpcomingRevisions] = useState(initialUpcomingRevisions);
  const [completedAssignments, setCompletedAssignments] = useState(initialCompletedAssignments);
  const [streak, setStreak] = useState(profile.streak);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [activeTab, setActiveTab] = useState<'learn' | 'revise' | 'history'>('learn');

  const updateStreak = useCallback(async (userId: string, currentStreak: number, lastActiveDate: string | null) => {
    const newStreak = calculateNewStreak(lastActiveDate, currentStreak);
    const today = getTodayString();
    if (lastActiveDate === today) return newStreak;

    await supabase
      .from('profiles')
      .update({ streak: newStreak, last_active_date: today })
      .eq('id', userId);

    setStreak(newStreak);
    return newStreak;
  }, [supabase]);

  const handleMarkLearned = async (assignment: Assignment) => {
    setLoadingId(assignment.id);

    const today = getTodayString();

    // Update assignment to completed
    await supabase
      .from('assignments')
      .update({ status: 'completed' })
      .eq('id', assignment.id);

    // Create revision schedule: +1, +3, +7 days
    const revisionDays = [1, 3, 7];
    const revisionInserts = revisionDays.map((days) => ({
      student_id: assignment.student_id,
      mentor_id: assignment.mentor_id,
      surah: assignment.surah,
      ayah_start: assignment.ayah_start,
      ayah_end: assignment.ayah_end,
      type: 'revise' as const,
      status: 'pending' as const,
      date: addDaysToToday(days),
    }));

    await supabase.from('assignments').insert(revisionInserts);

    // Update streak
    await updateStreak(assignment.student_id, streak, profile.last_active_date);

    // Update local state
    const completedAssignment = { ...assignment, status: 'completed' as const };
    setLearningTasks((prev) => prev.filter((t) => t.id !== assignment.id));
    setCompletedAssignments((prev) => [completedAssignment, ...prev]);

    setLoadingId(null);
    setShowToast(true);
  };

  const handleMarkRevised = async (assignment: Assignment) => {
    setLoadingId(assignment.id);

    await supabase
      .from('assignments')
      .update({ status: 'completed' })
      .eq('id', assignment.id);

    await updateStreak(assignment.student_id, streak, profile.last_active_date);

    const completedAssignment = { ...assignment, status: 'completed' as const };
    setRevisionTasks((prev) => prev.filter((t) => t.id !== assignment.id));
    setCompletedAssignments((prev) => [completedAssignment, ...prev]);

    setLoadingId(null);
    setShowToast(true);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Sabahul Khair';
    if (hour < 17) return 'Assalamu Alaikum';
    return 'Masaa Al-Khair';
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header greeting */}
      <div className="mb-8 animate-slide-up">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-1">
          {getGreeting()},{' '}
          <span className="gradient-text">{profile.name.split(' ')[0]}</span> 👋
        </h1>
        <p className="text-text-muted text-sm mb-3">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
        <StreakBadge streak={streak} size="md" />
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3 mb-8 animate-slide-up">
        <StatCard
          icon="📖"
          label="To Learn"
          value={learningTasks.length}
          color="emerald"
        />
        <StatCard
          icon="🔄"
          label="To Revise"
          value={revisionTasks.length}
          color="gold"
        />
        <StatCard
          icon="✅"
          label="Completed"
          value={completedAssignments.length}
          color="muted"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-bg-surface border border-bg-border rounded-xl p-1 mb-6">
        {[
          { key: 'learn', label: "Today's Learning", icon: BookOpen, count: learningTasks.length },
          { key: 'revise', label: 'Revision', icon: RotateCcw, count: revisionTasks.length },
          { key: 'history', label: 'History', icon: CheckCircle2, count: completedAssignments.length },
        ].map(({ key, label, icon: Icon, count }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as typeof activeTab)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === key
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            <Icon className="w-3.5 h-3.5 hidden sm:block" />
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden">{label.split(' ')[label.split(' ').length > 1 ? 1 : 0]}</span>
            {count > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === key
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-bg-elevated text-text-muted'
              }`}>
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="animate-fade-in">
        {activeTab === 'learn' && (
          <div>
            <SectionHeader
              title="Today's Learning"
              subtitle="Complete these to schedule automatic revisions"
              count={learningTasks.length}
            />
            {learningTasks.length === 0 ? (
              <EmptyState
                emoji="🎉"
                title="All done for today!"
                description="You've completed all your learning tasks. Come back tomorrow for more."
              />
            ) : (
              <div className="space-y-3">
                {learningTasks.map((task) => (
                  <LearningCard
                    key={task.id}
                    assignment={task}
                    onMark={handleMarkLearned}
                    isLoading={loadingId === task.id}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'revise' && (
          <div>
            <SectionHeader
              title="Revision Tasks"
              subtitle="Due today — strengthen your memory"
              count={revisionTasks.length}
            />
            {revisionTasks.length === 0 ? (
              <EmptyState
                emoji="🌿"
                title="No revisions due today"
                description="You're all caught up. Keep learning to schedule future revisions."
              />
            ) : (
              <div className="space-y-3">
                {revisionTasks.map((task) => (
                  <RevisionCard
                    key={task.id}
                    assignment={task}
                    onMark={handleMarkRevised}
                    isLoading={loadingId === task.id}
                  />
                ))}
              </div>
            )}

            {/* Upcoming revisions */}
            {upcomingRevisions.length > 0 && (
              <div className="mt-8">
                <SectionHeader
                  title="Upcoming Revisions"
                  subtitle="Scheduled for the coming days"
                />
                <div className="space-y-2">
                  {upcomingRevisions.map((task) => (
                    <UpcomingCard key={task.id} assignment={task} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div>
            <SectionHeader
              title="Learned History"
              subtitle="Your completed portions"
              count={completedAssignments.length}
            />
            {completedAssignments.length === 0 ? (
              <EmptyState
                emoji="📚"
                title="Your journey begins here"
                description="Complete your first assignment to see your history."
              />
            ) : (
              <div className="space-y-2">
                {completedAssignments.map((assignment) => (
                  <HistoryCard key={assignment.id} assignment={assignment} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <SuccessToast show={showToast} onHide={() => setShowToast(false)} />
    </div>
  );
}

// Sub-components

function StatCard({ icon, label, value, color }: { icon: string; label: string; value: number; color: string }) {
  const colorMap = {
    emerald: 'border-emerald-500/20 bg-emerald-500/5',
    gold: 'border-gold/20 bg-gold/5',
    muted: 'border-bg-border bg-bg-card',
  };
  const textMap = {
    emerald: 'text-emerald-400',
    gold: 'text-gold',
    muted: 'text-text-muted',
  };

  return (
    <div className={`rounded-xl border p-4 ${colorMap[color as keyof typeof colorMap]}`}>
      <div className="text-2xl mb-1">{icon}</div>
      <div className={`text-2xl font-bold ${textMap[color as keyof typeof textMap]}`}>{value}</div>
      <div className="text-text-muted text-xs mt-0.5">{label}</div>
    </div>
  );
}

function LearningCard({
  assignment,
  onMark,
  isLoading,
}: {
  assignment: Assignment;
  onMark: (a: Assignment) => void;
  isLoading: boolean;
}) {
  return (
    <div className="card card-hover border-emerald-500/10 bg-gradient-to-r from-emerald-500/5 to-transparent">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <BookOpen className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="min-w-0">
            <span className="badge-learn">New Learning</span>
            <h3 className="text-text-primary font-semibold mt-1.5 text-base">
              {assignment.surah}
            </h3>
            <p className="text-text-secondary text-sm">
              Ayah {assignment.ayah_start} – {assignment.ayah_end}
              <span className="text-text-muted ml-2">
                ({assignment.ayah_end - assignment.ayah_start + 1} verses)
              </span>
            </p>
            <div className="flex items-center gap-1 mt-1.5 text-xs text-text-muted">
              <Calendar className="w-3 h-3" />
              <span>Assigned {formatDateDisplay(assignment.date)}</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => onMark(assignment)}
          disabled={isLoading}
          className="btn-primary flex items-center gap-1.5 flex-shrink-0 text-xs sm:text-sm"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <CheckCircle2 className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">{isLoading ? 'Saving...' : 'Mark Learned'}</span>
          <span className="sm:hidden">{isLoading ? '...' : 'Done'}</span>
        </button>
      </div>
    </div>
  );
}

function RevisionCard({
  assignment,
  onMark,
  isLoading,
}: {
  assignment: Assignment;
  onMark: (a: Assignment) => void;
  isLoading: boolean;
}) {
  const isOverdue = assignment.date < getTodayString();

  return (
    <div className={`card card-hover ${isOverdue ? 'border-gold/20 bg-gold/5' : ''}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <RotateCcw className="w-5 h-5 text-gold" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="badge-revise">Revision</span>
              {isOverdue && (
                <span className="text-xs text-gold bg-gold/10 border border-gold/20 px-2 py-0.5 rounded-full">
                  Overdue
                </span>
              )}
            </div>
            <h3 className="text-text-primary font-semibold mt-1.5">
              {assignment.surah}
            </h3>
            <p className="text-text-secondary text-sm">
              Ayah {assignment.ayah_start} – {assignment.ayah_end}
            </p>
            <div className="flex items-center gap-1 mt-1.5 text-xs text-text-muted">
              <Calendar className="w-3 h-3" />
              <span>Due {formatDateDisplay(assignment.date)}</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => onMark(assignment)}
          disabled={isLoading}
          className="flex items-center gap-1.5 bg-gold/10 hover:bg-gold/20 border border-gold/20 hover:border-gold/40 text-gold font-semibold py-2 px-4 rounded-lg text-sm transition-all duration-200 flex-shrink-0"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
          ) : (
            <CheckCircle2 className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">{isLoading ? 'Saving...' : 'Mark Revised'}</span>
          <span className="sm:hidden">{isLoading ? '...' : 'Done'}</span>
        </button>
      </div>
    </div>
  );
}

function UpcomingCard({ assignment }: { assignment: Assignment }) {
  return (
    <div className="flex items-center gap-3 py-2.5 px-4 rounded-lg bg-bg-surface border border-bg-border">
      <Clock className="w-4 h-4 text-text-muted flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <span className="text-text-secondary text-sm font-medium">
          {assignment.surah}
        </span>
        <span className="text-text-muted text-sm ml-2">
          Ayah {assignment.ayah_start}–{assignment.ayah_end}
        </span>
      </div>
      <span className="text-text-muted text-xs flex-shrink-0">
        {formatDateDisplay(assignment.date)}
      </span>
    </div>
  );
}

function HistoryCard({ assignment }: { assignment: Assignment }) {
  return (
    <div className="flex items-center gap-3 py-3 px-4 rounded-lg bg-bg-card border border-bg-border hover:border-emerald-500/10 transition-colors">
      <CheckCircle2 className="w-4 h-4 text-emerald-500/50 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-text-secondary text-sm font-medium">
            {assignment.surah}
          </span>
          <span className="text-text-muted text-xs">
            Ayah {assignment.ayah_start}–{assignment.ayah_end}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {assignment.type === 'learn' ? (
          <span className="badge-learn text-xs">Learned</span>
        ) : (
          <span className="badge-revise text-xs">Revised</span>
        )}
        <span className="text-text-muted text-xs">
          {formatDateDisplay(assignment.date)}
        </span>
      </div>
    </div>
  );
}
