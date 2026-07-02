interface SectionHeadingProps {
  badge?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  center?: boolean;
}

export default function SectionHeading({
  badge,
  title,
  highlight,
  subtitle,
  center = true,
}: SectionHeadingProps) {
  const parts = highlight ? title.split(highlight) : [title];

  return (
    <div className={`mb-12 ${center ? "text-center" : "text-left"}`}>
      {badge && (
        <span className="mb-4 inline-block rounded-full border border-gold bg-surface px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-gold">
          {badge}
        </span>
      )}
      <h2 className="font-display text-3xl font-semibold text-text sm:text-4xl">
        {parts[0]}
        {highlight && <span className="text-gold">{highlight}</span>}
        {parts[1]}
      </h2>
      {subtitle && (
        <p className="mx-auto mt-4 max-w-xl text-base text-text-secondary">
          {subtitle}
        </p>
      )}
    </div>
  );
}