'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

interface SystemCardProps {
  title: string;
  subtitle?: string;
  // Properti lama dipertahankan agar modul yang sudah ada tidak rusak secara tipe.
  icon?: string;
  iconBg?: string;
  // Properti baru: inisial netral dan nada status untuk aksen kiri.
  initial?: string;
  tone?: 'normal' | 'danger';
  detailHref?: string;
  detailLabel?: string;
  children: ReactNode;
  isAlert?: boolean;
}

function resolveInitial(icon?: string, initial?: string, title?: string, iconBg?: string): string {
  if (initial) return initial;
  // Pemetaan kompatibilitas lama via iconBg agar tidak perlu mencocokkan karakter emoji di kode.
  if (iconBg) {
    if (iconBg.includes('amber')) return 'W';
    if (iconBg.includes('cyan')) return 'A';
    if (iconBg.includes('red')) return 'F';
  }
  if (icon) {
    const trimmed = icon.trim();
    // Hanya terima inisial ASCII satu huruf, selain itu abaikan agar tidak ada emoji yang dirender.
    if (/^[A-Za-z]$/.test(trimmed)) return trimmed.toUpperCase();
  }
  const first = title?.trim().charAt(0);
  return first ? first.toUpperCase() : '?';
}

export default function SystemCard({
  title,
  subtitle,
  icon,
  iconBg,
  initial,
  tone,
  detailHref,
  detailLabel,
  children,
  isAlert,
}: SystemCardProps) {
  const effectiveTone: 'normal' | 'danger' = tone ?? (isAlert ? 'danger' : 'normal');
  const mark = resolveInitial(icon, initial, title, iconBg);

  return (
    <div className={`system-card ${isAlert ? 'alert' : ''}`}>
      <div className={`card-header ${isAlert ? 'bg-red-50' : ''}`}>
        <div className="card-header-left">
          {/* Alasan: satu gaya netral slate-100 agar hierarki dibaca dari aksen kiri, bukan warna latar beda per kartu. */}
          <div
            aria-hidden="true"
            className={`flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-base font-bold text-slate-700 border-l-[3px] ${
              effectiveTone === 'danger' ? 'border-l-red-500' : 'border-l-emerald-500'
            }`}
          >
            {mark}
          </div>
          <div>
            <h2>{title}</h2>
            {subtitle && <div className="subtitle">{subtitle}</div>}
          </div>
        </div>
        {detailHref && detailLabel && (
          <Link href={detailHref} className="text-sm font-medium text-blue-600 hover:text-blue-800">
            {detailLabel} <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>
      <div className="card-body">{children}</div>
    </div>
  );
}
