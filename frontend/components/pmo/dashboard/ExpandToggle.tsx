import type { MouseEventHandler } from 'react';

type ExpandToggleProps = {
  expanded: boolean;
  onClick: MouseEventHandler<HTMLButtonElement | HTMLSpanElement>;
  label?: string;
  className?: string;
  ariaLabel?: string;
  as?: 'button' | 'span';
};

export default function ExpandToggle({
  expanded,
  onClick,
  label,
  className = '',
  ariaLabel,
  as = 'button',
}: ExpandToggleProps) {
  const Element = as;

  return (
    <Element
      type={as === 'button' ? 'button' : undefined}
      role={as === 'span' ? 'button' : undefined}
      tabIndex={as === 'span' ? 0 : undefined}
      onClick={onClick}
      onKeyDown={as === 'span' ? (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onClick(event as any);
        }
      } : undefined}
      aria-label={ariaLabel || label || 'Toggle expansion'}
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold text-slate-700 transition-colors duration-200 hover:bg-slate-100 ${className}`}
    >
      {label && <span>{label}</span>}
      <span
        className={`inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-transform duration-200 ${
          expanded ? 'rotate-90' : 'rotate-0'
        }`}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 5L16 12L8 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </Element>
  );
}
