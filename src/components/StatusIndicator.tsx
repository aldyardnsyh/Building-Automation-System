'use client';

interface StatusIndicatorProps {
  id: string;
  label: string;
  isActive: boolean;
  ariaLabel?: string;
}

export default function StatusIndicator({ id, label, isActive, ariaLabel }: StatusIndicatorProps) {
  return (
    <div
      id={id}
      role="status"
      aria-label={ariaLabel ?? label}
      tabIndex={0}
      className={`indicator-card ${isActive ? 'active' : 'inactive'} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600`}
    >
      <span aria-hidden="true" className={`status-dot ${isActive ? 'active' : 'inactive'}`} />
      <span className="indicator-text">{label}</span>
    </div>
  );
}
