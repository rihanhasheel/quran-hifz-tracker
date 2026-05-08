import { format, isYesterday, parseISO } from 'date-fns';

export function calculateNewStreak(
  lastActiveDate: string | null,
  currentStreak: number
): number {
  if (!lastActiveDate) return 1;

  const lastDate = parseISO(lastActiveDate);
  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');

  // Already active today, no change
  if (lastActiveDate === todayStr) return currentStreak;

  // Was active yesterday, increment
  if (isYesterday(lastDate)) return currentStreak + 1;

  // Streak broken
  return 1;
}

export function getTodayString(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function addDaysToToday(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return format(date, 'yyyy-MM-dd');
}

export function formatDateDisplay(dateStr: string): string {
  const date = parseISO(dateStr);
  return format(date, 'dd MMM yyyy');
}

export function getStreakEmoji(streak: number): string {
  if (streak >= 30) return '🌟';
  if (streak >= 14) return '💎';
  if (streak >= 7) return '🔥';
  if (streak >= 3) return '✨';
  return '🌱';
}
