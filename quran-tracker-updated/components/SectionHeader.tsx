interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  count?: number;
  children?: React.ReactNode;
}

export default function SectionHeader({ title, subtitle, count, children }: SectionHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
          {count !== undefined && (
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-2 py-0.5 rounded-full font-medium">
              {count}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-text-muted text-sm mt-0.5">{subtitle}</p>
        )}
      </div>
      {children && <div>{children}</div>}
    </div>
  );
}
