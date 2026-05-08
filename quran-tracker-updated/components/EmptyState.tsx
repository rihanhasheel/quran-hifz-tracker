import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  emoji?: string;
}

export default function EmptyState({ icon: Icon, title, description, emoji }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {emoji ? (
        <div className="text-4xl mb-4">{emoji}</div>
      ) : Icon ? (
        <div className="w-14 h-14 rounded-2xl bg-bg-elevated border border-bg-border flex items-center justify-center mb-4">
          <Icon className="w-7 h-7 text-text-muted" />
        </div>
      ) : null}
      <h3 className="text-text-secondary font-medium mb-1">{title}</h3>
      {description && (
        <p className="text-text-muted text-sm max-w-xs">{description}</p>
      )}
    </div>
  );
}
