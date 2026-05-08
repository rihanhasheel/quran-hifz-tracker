-- ============================================================
-- Quran Learning Tracker - Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. PROFILES TABLE
-- Extends Supabase auth.users with app-specific data
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'mentor')),
  mentor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  streak INTEGER NOT NULL DEFAULT 0,
  last_active_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. ASSIGNMENTS TABLE
CREATE TABLE IF NOT EXISTS public.assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  mentor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  surah TEXT NOT NULL,
  ayah_start INTEGER NOT NULL,
  ayah_end INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('learn', 'revise')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on both tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Mentors can view profiles of their students
CREATE POLICY "Mentors can view student profiles"
  ON public.profiles FOR SELECT
  USING (
    auth.uid() = mentor_id
    OR auth.uid() = id
  );

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Allow profile creation on signup
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Mentors can update mentor_id of students (to link them)
CREATE POLICY "Anyone can view unlinked student profiles for linking"
  ON public.profiles FOR SELECT
  USING (
    role = 'student'
    OR auth.uid() = id
    OR auth.uid() = mentor_id
  );

-- ASSIGNMENTS POLICIES

-- Students can view their own assignments
CREATE POLICY "Students can view own assignments"
  ON public.assignments FOR SELECT
  USING (auth.uid() = student_id);

-- Mentors can view assignments they created
CREATE POLICY "Mentors can view own assignments"
  ON public.assignments FOR SELECT
  USING (auth.uid() = mentor_id);

-- Mentors can insert assignments
CREATE POLICY "Mentors can create assignments"
  ON public.assignments FOR INSERT
  WITH CHECK (auth.uid() = mentor_id);

-- Students can update their own assignments (mark completed)
CREATE POLICY "Students can update own assignments"
  ON public.assignments FOR UPDATE
  USING (auth.uid() = student_id);

-- Students can insert revision assignments (auto-created on completion)
CREATE POLICY "Students can insert revision assignments"
  ON public.assignments FOR INSERT
  WITH CHECK (auth.uid() = student_id);

-- ============================================================
-- INDEXES for performance
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_assignments_student_id ON public.assignments(student_id);
CREATE INDEX IF NOT EXISTS idx_assignments_mentor_id ON public.assignments(mentor_id);
CREATE INDEX IF NOT EXISTS idx_assignments_status ON public.assignments(status);
CREATE INDEX IF NOT EXISTS idx_assignments_date ON public.assignments(date);
CREATE INDEX IF NOT EXISTS idx_assignments_type ON public.assignments(type);
CREATE INDEX IF NOT EXISTS idx_profiles_mentor_id ON public.profiles(mentor_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- ============================================================
-- HELPER: Auto-create profile on signup (optional trigger)
-- You can use this OR handle profile creation in the app code
-- The app code approach (in signup page) is already implemented
-- ============================================================

-- CREATE OR REPLACE FUNCTION public.handle_new_user()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   INSERT INTO public.profiles (id, name, role)
--   VALUES (
--     NEW.id,
--     COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
--     COALESCE(NEW.raw_user_meta_data->>'role', 'student')
--   );
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql SECURITY DEFINER;

-- CREATE OR REPLACE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
