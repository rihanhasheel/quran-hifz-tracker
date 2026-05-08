import { getStreakEmoji } from '@/utils/streak';

interface StreakBadgeProps {
  streak: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function StreakBadge({ streak, size = 'md' }: StreakBadgeProps) {
  const emoji = getStreakEmoji(streak);

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  const numberSize = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  if (streak === 0) {
    return (
      <div className={`inline-flex items-center gap-1.5 bg-bg-elevated border border-bg-border rounded-full ${sizeClasses[size]}`}>
        <span>🌱</span>
        <span className="text-text-muted font-medium">Start your streak</span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500/10 to-gold/10 border border-emerald-500/20 rounded-full ${sizeClasses[size]}`}>
      <span className="streak-number">{emoji}</span>
      <span className="text-text-primary font-medium">
        Your consistency:{' '}
        <span className={`font-bold text-emerald-400 ${numberSize[size]}`}>
          {streak}
        </span>{' '}
        {streak === 1 ? 'day' : 'days'}
      </span>
    </div>
  );
}
