interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function SectionHeader({ title, description, action }: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="mb-2 flex items-center gap-2">
          <span className="h-4 w-1 rounded-full bg-gradient-to-b from-accent to-cyan" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-3">
            بخش
          </span>
        </div>
        <h2 className="font-display text-xl font-bold tracking-tight text-ink sm:text-[22px]">
          {title}
        </h2>
        {description && (
          <p className="mt-1.5 max-w-2xl text-[13.5px] leading-relaxed text-ink-2">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
