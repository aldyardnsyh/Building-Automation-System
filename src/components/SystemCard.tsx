'use client';

import { ReactNode } from 'react';

interface SystemCardProps {
  title: string;
  subtitle?: string;
  icon: string;
  iconBg?: string;
  children: ReactNode;
  isAlert?: boolean;
}

export default function SystemCard({ title, subtitle, icon, iconBg = 'bg-blue-50', children, isAlert }: SystemCardProps) {
  return (
    <div className={`system-card ${isAlert ? 'alert' : ''}`}>
      <div className="card-header">
        <div className={`card-icon ${iconBg}`}>
          {icon}
        </div>
        <div>
          <h2>{title}</h2>
          {subtitle && <div className="subtitle">{subtitle}</div>}
        </div>
      </div>
      <div className="card-body">
        {children}
      </div>
    </div>
  );
}