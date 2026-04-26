'use client';

interface StatusIndicatorProps {
  id: string;
  label: string;
  isActive: boolean;
}

export default function StatusIndicator({ id, label, isActive }: StatusIndicatorProps) {
  return (
    <div
      id={id}
      className={`indicator-card ${isActive ? 'active' : 'inactive'}`}
    >
      <span className={`status-dot ${isActive ? 'active' : 'inactive'}`} />
      <span className="indicator-text">{label}</span>
    </div>
  );
}