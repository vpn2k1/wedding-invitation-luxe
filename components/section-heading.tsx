type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'center' | 'left';
};

export function SectionHeading({ eyebrow, title, description, align = 'center' }: SectionHeadingProps) {
  return (
    <div className={`${align === 'center' ? 'mx-auto text-center' : 'text-left'} mb-12 max-w-3xl`}>
      {eyebrow ? (
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.42em] text-dune">{eyebrow}</p>
      ) : null}
      <h2 className="font-display text-5xl leading-none text-plum md:text-7xl">{title}</h2>
      {description ? <p className="mt-5 text-base leading-8 text-ink/65 md:text-lg">{description}</p> : null}
    </div>
  );
}
