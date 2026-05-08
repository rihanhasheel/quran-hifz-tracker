'use client';

import { useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Users, Plus, BookOpen, RotateCcw, CheckCircle2,
  TrendingUp, ChevronDown, Loader2, Calendar, X, Link
} from 'lucide-react';
import type { Profile, Assignment } from '@/lib/supabase/database.types';
import { SURAHS } from '@/utils/surahs';
import { getTodayString, formatDateDisplay } from '@/utils/streak';
import SectionHeader from '@/components/SectionHeader';
import EmptyState from '@/components/EmptyState';
import SuccessToast from '@/components/SuccessToast';

interface MentorDashboardClientProps {
  profile: Profile;
  initialStudents: Profile[];
  initialAssignments: Assignment[];
}

export default function MentorDashboardClient({
  profile,
  initialStudents,
  initialAssignments,
}: MentorDashboardClientProps) {
  const supabase = createClient();

  const [students, setStudents] = useState(initialStudents);
  const [assignments, setAssignments] = useState(initialAssignments);
  const [activeTab, setActiveTab] = useState<'students' | 'assign' | 'progress'>('students');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Assign task form state
  const [form, setForm] = useState({
    student_id: '',
    surah: '',
    ayah_start: '',
    ayah_end: '',
    type: 'learn' as 'learn' | 'revise',
    date: getTodayString(),
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Link student form
  const [linkEmail, setLinkEmail] = useState('');
  const [linkLoading, setLinkLoading] = useState(false);
  const [linkError, setLinkError] = useState('');

  const handleAssignTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');

    if (!form.student_id) {
      setFormError('Please select a student');
      setFormLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('assignments')
      .insert({
        student_id: form.student_id,
        mentor_id: profile.id,
        surah: form.surah,
        ayah_start: parseInt(form.ayah_start),
        ayah_end: parseInt(form.ayah_end),
        type: form.type,
        status: 'pending',
        date: form.date,
      })
      .select()
      .single();

    if (error) {
      setFormError(error.message);
      setFormLoading(false);
      return;
    }

    if (data) {
      setAssignments((prev) => [data, ...prev]);
    }

    // Reset form
    setForm({
      student_id: form.student_id,
      surah: '',
      ayah_start: '',
      ayah_end: '',
      type: 'learn',
      date: getTodayString(),
    });

    setFormLoading(false);
    setToastMessage('Task assigned successfully! Barakallahu feek 🌿');
    setShowToast(true);
  };

  const handleLinkStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLinkLoading(true);
    setLinkError('');

    // Find student by email via profiles
    const { data: studentProfiles, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'student')
      .is('mentor_id', null);

    if (error) {
      setLinkError('Failed to search for student');
      setLinkLoading(false);
      return;
    }

    // We can't search by email directly from profiles (no email field)
    // Instead look up the auth user — we'll need to match by profile ID
    // In a real app, you'd add email to profiles or use a different approach
    // For now, let's find by name (simple demo approach)
    const matchingStudent = studentProfiles?.find(
      (s) => s.name.toLowerCase().includes(linkEmail.toLowerCase())
    );

    if (!matchingStudent) {
      setLinkError('No unassigned student found with that name. Make sure they have registered.');
      setLinkLoading(false);
      return;
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ mentor_id: profile.id })
      .eq('id', matchingStudent.id);

    if (updateError) {
      setLinkError(updateError.message);
      setLinkLoading(false);
      return;
    }

    setStudents((prev) => [...prev, matchingStudent]);
    setLinkEmail('');
    setLinkLoading(false);
    setToastMessage(`${matchingStudent.name} has been linked to you! 🎓`);
    setShowToast(true);
  };

  // Get assignments for selected student
  const studentAssignments = useMemo(() => {
    if (!selectedStudentId) return { completed: [], pending: [] };
    const filtered = assignments.filter((a) => a.student_id === selectedStudentId);
    return {
      completed: filtered.filter((a) => a.status === 'completed'),
      pending: filtered.filter((a) => a.status === 'pending'),
    };
  }, [selectedStudentId, assignments]);

  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  // Stats
  const totalPending = assignments.filter((a) => a.status === 'pending').length;
  const totalCompleted = assignments.filter((a) => a.status === 'completed').length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8 animate-slide-up">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-1">
          Mentor Dashboard
        </h1>
        <p className="text-text-muted text-sm">
          Guide your students on their Quran journey
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-8 animate-slide-up">
        <div className="card text-center">
          <div className="text-2xl font-bold text-emerald-400">{students.length}</div>
          <div className="text-text-muted text-xs mt-0.5">Students</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-gold">{totalPending}</div>
          <div className="text-text-muted text-xs mt-0.5">Pending Tasks</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-emerald-400/60">{totalCompleted}</div>
          <div className="text-text-muted text-xs mt-0.5">Completed</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-bg-surface border border-bg-border rounded-xl p-1 mb-6">
        {[
          { key: 'students', label: 'My Students', icon: Users },
          { key: 'assign', label: 'Assign Task', icon: Plus },
          { key: 'progress', label: 'Progress', icon: TrendingUp },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as typeof activeTab)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === key
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      <div className="animate-fade-in">
        {/* Students Tab */}
        {activeTab === 'students' && (
          <div className="space-y-6">
            {/* Link student */}
            <div className="card">
              <SectionHeader
                title="Add a Student"
                subtitle="Link a student to your account by their registered name"
              />
              <form onSubmit={handleLinkStudent} className="flex gap-3">
                <input
                  type="text"
                  value={linkEmail}
                  onChange={(e) => setLinkEmail(e.target.value)}
                  placeholder="Student's registered name"
                  className="input-dark flex-1 rounded-lg px-4 py-2.5 text-sm"
                  required
                />
                <button
                  type="submit"
                  disabled={linkLoading}
                  className="btn-primary flex items-center gap-2 whitespace-nowrap"
                >
                  {linkLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  Link Student
                </button>
              </form>
              {linkError && (
                <p className="text-red-400 text-sm mt-2">{linkError}</p>
              )}
            </div>

            {/* Student list */}
            <div>
              <SectionHeader title="Your Students" count={students.length} />
              {students.length === 0 ? (
                <EmptyState
                  emoji="👥"
                  title="No students yet"
                  description="Link your first student using their registered name above."
                />
              ) : (
                <div className="grid sm:grid-cols-2 gap-3">
                  {students.map((student) => {
                    const studentAssigns = assignments.filter((a) => a.student_id === student.id);
                    const completed = studentAssigns.filter((a) => a.status === 'completed').length;
                    const pending = studentAssigns.filter((a) => a.status === 'pending').length;

                    return (
                      <div key={student.id} className="card card-hover">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-emerald-400 font-bold text-sm">
                              {student.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-text-primary font-semibold">{student.name}</h3>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-text-muted text-xs">
                                🔥 {student.streak} day streak
                              </span>
                            </div>
                            <div className="flex gap-3 mt-2">
                              <span className="text-xs text-emerald-400">
                                ✓ {completed} done
                              </span>
                              <span className="text-xs text-gold">
                                ⏳ {pending} pending
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-bg-border flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedStudentId(student.id);
                              setActiveTab('progress');
                            }}
                            className="btn-ghost text-xs py-1.5 px-3 flex-1"
                          >
                            View Progress
                          </button>
                          <button
                            onClick={() => {
                              setForm((f) => ({ ...f, student_id: student.id }));
                              setActiveTab('assign');
                            }}
                            className="btn-primary text-xs py-1.5 px-3 flex-1"
                          >
                            Assign Task
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Assign Task Tab */}
        {activeTab === 'assign' && (
          <div className="max-w-xl">
            <div className="card">
              <SectionHeader
                title="Assign a Task"
                subtitle="Create a learning or revision assignment for a student"
              />

              {formError && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {formError}
                </div>
              )}

              <form onSubmit={handleAssignTask} className="space-y-4">
                {/* Student */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">
                    Student
                  </label>
                  {students.length === 0 ? (
                    <p className="text-text-muted text-sm p-3 rounded-lg bg-bg-surface border border-bg-border">
                      No students linked yet. Go to &quot;My Students&quot; tab to add students.
                    </p>
                  ) : (
                    <div className="relative">
                      <select
                        value={form.student_id}
                        onChange={(e) => setForm({ ...form, student_id: e.target.value })}
                        required
                        className="input-dark w-full rounded-lg px-4 py-2.5 text-sm appearance-none pr-10"
                      >
                        <option value="">Select a student...</option>
                        {students.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                    </div>
                  )}
                </div>

                {/* Task type */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Task Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, type: 'learn' })}
                      className={`flex items-center gap-2 p-3 rounded-xl border transition-all duration-200 ${
                        form.type === 'learn'
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                          : 'border-bg-border bg-bg-surface text-text-muted hover:border-bg-elevated'
                      }`}
                    >
                      <BookOpen className="w-4 h-4" />
                      <span className="text-sm font-medium">Learn</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, type: 'revise' })}
                      className={`flex items-center gap-2 p-3 rounded-xl border transition-all duration-200 ${
                        form.type === 'revise'
                          ? 'border-gold bg-gold/10 text-gold'
                          : 'border-bg-border bg-bg-surface text-text-muted hover:border-bg-elevated'
                      }`}
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span className="text-sm font-medium">Revise</span>
                    </button>
                  </div>
                </div>

                {/* Surah */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">
                    Surah
                  </label>
                  <div className="relative">
                    <select
                      value={form.surah}
                      onChange={(e) => setForm({ ...form, surah: e.target.value })}
                      required
                      className="input-dark w-full rounded-lg px-4 py-2.5 text-sm appearance-none pr-10"
                    >
                      <option value="">Select Surah...</option>
                      {SURAHS.map((s) => (
                        <option key={s.number} value={s.name}>
                          {s.number}. {s.name} ({s.ayahs} ayahs)
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                  </div>
                </div>

                {/* Ayah range */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">
                      Ayah From
                    </label>
                    <input
                      type="number"
                      value={form.ayah_start}
                      onChange={(e) => setForm({ ...form, ayah_start: e.target.value })}
                      placeholder="e.g. 1"
                      min="1"
                      required
                      className="input-dark w-full rounded-lg px-4 py-2.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">
                      Ayah To
                    </label>
                    <input
                      type="number"
                      value={form.ayah_end}
                      onChange={(e) => setForm({ ...form, ayah_end: e.target.value })}
                      placeholder="e.g. 10"
                      min="1"
                      required
                      className="input-dark w-full rounded-lg px-4 py-2.5 text-sm"
                    />
                  </div>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    required
                    className="input-dark w-full rounded-lg px-4 py-2.5 text-sm"
                    style={{ colorScheme: 'dark' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={formLoading || students.length === 0}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {formLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Assigning...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Assign Task
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Recent assignments */}
            {assignments.length > 0 && (
              <div className="mt-6">
                <SectionHeader title="Recent Assignments" />
                <div className="space-y-2">
                  {assignments.slice(0, 8).map((a) => {
                    const student = students.find((s) => s.id === a.student_id);
                    return (
                      <div key={a.id} className="flex items-center gap-3 py-2.5 px-4 rounded-lg bg-bg-card border border-bg-border">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          a.status === 'completed' ? 'bg-emerald-500' : 'bg-gold'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <span className="text-text-secondary text-sm font-medium">
                            {student?.name || 'Student'}
                          </span>
                          <span className="text-text-muted text-sm mx-1">—</span>
                          <span className="text-text-muted text-sm">
                            {a.surah} {a.ayah_start}:{a.ayah_end}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {a.type === 'learn' ? (
                            <span className="badge-learn">Learn</span>
                          ) : (
                            <span className="badge-revise">Revise</span>
                          )}
                          {a.status === 'completed' ? (
                            <span className="badge-completed">Done</span>
                          ) : (
                            <span className="text-xs text-text-muted">{formatDateDisplay(a.date)}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Progress Tab */}
        {activeTab === 'progress' && (
          <div>
            {/* Student selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Select a student to view progress
              </label>
              <div className="relative max-w-sm">
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="input-dark w-full rounded-lg px-4 py-2.5 text-sm appearance-none pr-10"
                >
                  <option value="">Choose student...</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
              </div>
            </div>

            {!selectedStudentId ? (
              <EmptyState
                emoji="📊"
                title="Select a student"
                description="Choose a student above to view their detailed progress."
              />
            ) : (
              <div className="animate-fade-in">
                {/* Student info */}
                <div className="card mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                      <span className="text-emerald-400 font-bold text-xl">
                        {selectedStudent?.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-text-primary font-bold text-lg">{selectedStudent?.name}</h2>
                      <p className="text-text-muted text-sm">
                        🔥 {selectedStudent?.streak || 0} day streak
                      </p>
                    </div>
                    <div className="ml-auto grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-emerald-400 font-bold text-xl">
                          {studentAssignments.completed.length}
                        </div>
                        <div className="text-text-muted text-xs">Completed</div>
                      </div>
                      <div>
                        <div className="text-gold font-bold text-xl">
                          {studentAssignments.pending.length}
                        </div>
                        <div className="text-text-muted text-xs">Pending</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                {(studentAssignments.completed.length + studentAssignments.pending.length) > 0 && (
                  <div className="card mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-text-secondary">Overall Progress</span>
                      <span className="text-emerald-400 font-medium">
                        {Math.round(
                          (studentAssignments.completed.length /
                            (studentAssignments.completed.length + studentAssignments.pending.length)) *
                            100
                        )}%
                      </span>
                    </div>
                    <div className="w-full bg-bg-surface rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.round(
                            (studentAssignments.completed.length /
                              (studentAssignments.completed.length + studentAssignments.pending.length)) *
                              100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Pending */}
                  <div>
                    <SectionHeader
                      title="Pending Tasks"
                      count={studentAssignments.pending.length}
                    />
                    {studentAssignments.pending.length === 0 ? (
                      <EmptyState
                        emoji="✨"
                        title="All caught up!"
                        description="No pending tasks for this student."
                      />
                    ) : (
                      <div className="space-y-2">
                        {studentAssignments.pending.map((a) => (
                          <div key={a.id} className="flex items-center gap-3 py-2.5 px-3 rounded-lg bg-bg-card border border-bg-border">
                            {a.type === 'learn' ? (
                              <BookOpen className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                            ) : (
                              <RotateCcw className="w-4 h-4 text-gold flex-shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="text-text-secondary text-sm font-medium">
                                {a.surah}
                              </div>
                              <div className="text-text-muted text-xs">
                                Ayah {a.ayah_start}–{a.ayah_end}
                              </div>
                            </div>
                            <span className="text-text-muted text-xs flex-shrink-0">
                              {formatDateDisplay(a.date)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Completed */}
                  <div>
                    <SectionHeader
                      title="Completed"
                      count={studentAssignments.completed.length}
                    />
                    {studentAssignments.completed.length === 0 ? (
                      <EmptyState
                        emoji="📖"
                        title="Nothing completed yet"
                        description="Completed tasks will appear here."
                      />
                    ) : (
                      <div className="space-y-2">
                        {studentAssignments.completed.map((a) => (
                          <div key={a.id} className="flex items-center gap-3 py-2.5 px-3 rounded-lg bg-bg-card border border-bg-border">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500/50 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="text-text-secondary text-sm font-medium">
                                {a.surah}
                              </div>
                              <div className="text-text-muted text-xs">
                                Ayah {a.ayah_start}–{a.ayah_end}
                              </div>
                            </div>
                            {a.type === 'learn' ? (
                              <span className="badge-learn">Learned</span>
                            ) : (
                              <span className="badge-revise">Revised</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <SuccessToast
        show={showToast}
        onHide={() => setShowToast(false)}
        message={toastMessage}
      />
    </div>
  );
}
