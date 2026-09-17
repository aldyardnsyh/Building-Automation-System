'use client';

import { useState } from 'react';
import type { CleanWaterSlave, FireSystemSlave, WWTPSlave } from '@/types/bas';

interface PIDDiagramProps {
  type: 'wwtp' | 'clean-water' | 'fire-system';
  data?: WWTPSlave | CleanWaterSlave | FireSystemSlave | null;
}

function fmt(value: number, digits = 1): string {
  return value.toFixed(digits).replace('.', ',');
}

function fmtInt(value: number): string {
  return Math.round(value).toString();
}

/* Blok Desain (R-32, redesign):
- Skema memakai lembar terang (bukan panel gelap) agar selaras dengan tema terang seluruh website.
- Sinyal proses dibedakan dari sinyal listrik/PLC: pipa proses solid biru brand saat mengalir,
  garis sinyal PLC putus-putus tipis.
- Simbol instrumen memakai tag bulat ISA-style (FT, PT, AIT) agar terbaca sebagai gambar
  teknik, bukan ikon dekoratif.
- Jalur pipa dibelokkan siku (bukan menembus simbol) supaya alur pandang jelas kiri ke kanan,
  termasuk masuk dari atas kartu outlet agar tersambung rapi.
- Nomor tahap tetap dipakai karena proses ini memang berurutan (bukan eyebrow dekoratif). */

const PANEL = '#f8fafc';
const GRID = 'rgba(71,85,105,0.10)';
const LINE = '#475569';
const LINE_LIGHT = '#64748b';
const EQUIP = '#ffffff';
const EQUIP_BORDER = '#cbd5e1';
const PIPE_OFF = '#cbd5e1';
const PROCESS = '#1d4ed8';
const PROCESS_SOFT = 'rgba(29,78,216,0.10)';
const RUN = '#15803d';
const RUN_INK = '#166534';
const BAD = '#ef4444';
const BAD_INK = '#b91c1c';
const AMBER = '#b45309';
const INK = '#1e293b';
const MUTED = '#475569';
const MONO = "'Fira Code', monospace";

export default function PIDDiagram({ type, data }: PIDDiagramProps) {
  const [paused, setPaused] = useState(false);

  return (
    <div className="detail-section">
      <div className="detail-section-header flex items-center justify-between gap-3">
        <span>Skema Proses</span>
        <span className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-medium normal-case tracking-normal text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true" />
            Live
          </span>
          <button
            type="button"
            onClick={() => setPaused((v) => !v)}
            aria-pressed={paused}
            className="px-3 py-2 min-h-[44px] rounded-lg text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
          >
            {paused ? 'Putar animasi' : 'Jeda animasi'}
          </button>
        </span>
      </div>
      <div className="detail-section-body">
        {!data ? (
          <div role="status" className="pid-diagram flex-col gap-2 text-center">
            <p className="text-sm font-semibold text-slate-700">Menunggu data sensor...</p>
            <p className="text-xs text-slate-600">Diagram animasi muncul setelah PLC terhubung.</p>
          </div>
        ) : (
          <div className={paused ? 'mimic-paused' : ''}>
            <div className="rounded-xl overflow-hidden border border-slate-200" style={{ background: PANEL }}>
              {type === 'wwtp' && <WwtpMimic data={data as WWTPSlave} paused={paused} />}
              {type === 'clean-water' && <CleanWaterMimic data={data as CleanWaterSlave} paused={paused} />}
              {type === 'fire-system' && <FireMimic data={data as FireSystemSlave} paused={paused} />}
            </div>
            <MimicLegend type={type} />
          </div>
        )}
        <p className="pid-caption">Skematik sederhana, bukan gambar P&amp;ID standar ISA. Animasi menggambarkan status, bukan skala fisik.</p>
      </div>
    </div>
  );
}

function SheetGrid({ id }: { id: string }) {
  return (
    <defs>
      <pattern id={id} width="24" height="24" patternUnits="userSpaceOnUse">
        <path d="M24 0H0V24" fill="none" stroke={GRID} strokeWidth="1" />
      </pattern>
    </defs>
  );
}

function StageTag({ x, y, num, title }: { x: number; y: number; num: string; title: string }) {
  return (
    <g>
      <rect x={x} y={y - 12} width={20} height={16} rx={3} fill="none" stroke={LINE_LIGHT} strokeWidth={1.3} />
      <text x={x + 10} y={y} textAnchor="middle" fontSize={10} fontWeight={700} fontFamily={MONO} fill={PROCESS}>{num}</text>
      <text x={x + 26} y={y} fontSize={10} fontWeight={600} letterSpacing={0.6} fill={MUTED}>{title}</text>
    </g>
  );
}

function InstrumentTag({ cx, cy, r = 20, tag, value, ok }: { cx: number; cy: number; r?: number; tag: string; value: string; ok: boolean }) {
  const ring = ok ? RUN : BAD;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={EQUIP} stroke={ring} strokeWidth={2} />
      <text x={cx} y={cy - 2} textAnchor="middle" fontSize={10.5} fontWeight={700} fontFamily={MONO} fill={ring}>{tag}</text>
      <text x={cx} y={cy + 11} textAnchor="middle" fontSize={9.5} fontFamily={MONO} fill={MUTED}>{value}</text>
    </g>
  );
}

/** Pipa dengan belokan siku (elbow), bukan garis lurus menembus simbol. */
function Elbow({
  points, flowing, speed = 1.2, fine = false,
}: { points: [number, number][]; flowing: boolean; speed?: number; fine?: boolean }) {
  const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ');
  const [lx, ly] = points[points.length - 1];
  const [px, py] = points[points.length - 2];
  const angle = Math.atan2(ly - py, lx - px) * (180 / Math.PI);
  return (
    <g>
      <path d={d} fill="none" stroke={PIPE_OFF} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
      {flowing ? (
        <path
          d={d}
          fill="none"
          stroke={PROCESS}
          strokeWidth={7}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={fine ? 'mimic-flow-fine' : 'mimic-flow'}
          style={{ animationDuration: `${speed}s` }}
          aria-hidden="true"
        />
      ) : null}
      <polygon
        points="-3,-6 8,0 -3,6"
        fill={flowing ? PROCESS : LINE}
        transform={`translate(${lx} ${ly}) rotate(${angle})`}
        aria-hidden="true"
      />
    </g>
  );
}

function PumpSymbol({ cx, cy, on, label, sub }: { cx: number; cy: number; on: boolean; label: string; sub: string }) {
  const ring = on ? RUN : LINE_LIGHT;
  return (
    <g>
      <circle cx={cx} cy={cy} r={24} fill={EQUIP} stroke={ring} strokeWidth={2.3} />
      <g
        className={on ? 'mimic-rotor' : ''}
        style={on ? { transformBox: 'view-box', transformOrigin: `${cx}px ${cy}px` } : undefined}
        aria-hidden="true"
      >
        {[0, 60, 120].map((a) => (
          <line
            key={a}
            x1={cx}
            y1={cy - 16}
            x2={cx}
            y2={cy + 16}
            stroke={ring}
            strokeWidth={6}
            strokeLinecap="round"
            transform={`rotate(${a} ${cx} ${cy})`}
          />
        ))}
      </g>
      <circle cx={cx} cy={cy} r={5} fill={ring} />
      <text x={cx} y={cy + 41} textAnchor="middle" fontSize={11.5} fontWeight={700} fontFamily={MONO} fill={INK}>{label}</text>
      <text x={cx} y={cy + 55} textAnchor="middle" fontSize={9.5} fontWeight={600} fill={on ? RUN_INK : MUTED}>{sub}</text>
    </g>
  );
}

function ValveSymbol({ x, y, open, label, sub }: { x: number; y: number; open: boolean; label: string; sub: string }) {
  const ring = open ? RUN : BAD;
  return (
    <g>
      <polygon points={`${x - 18},${y - 12} ${x - 18},${y + 12} ${x},${y}`} fill={EQUIP} stroke={INK} strokeWidth={1.6} strokeLinejoin="round" />
      <polygon points={`${x + 18},${y - 12} ${x + 18},${y + 12} ${x},${y}`} fill={EQUIP} stroke={INK} strokeWidth={1.6} strokeLinejoin="round" />
      <line x1={x} y1={y} x2={x} y2={y - 22} stroke={LINE_LIGHT} strokeWidth={2} />
      <rect x={x - 11} y={y - 30} width={22} height={8} rx={3} fill={ring} />
      <text x={x} y={y + 32} textAnchor="middle" fontSize={11.5} fontWeight={700} fontFamily={MONO} fill={INK}>{label}</text>
      <text x={x} y={y + 46} textAnchor="middle" fontSize={9.5} fontWeight={600} fill={open ? RUN_INK : BAD_INK}>{sub}</text>
    </g>
  );
}

function Readout({ x, y, width, title, value, tone }: { x: number; y: number; width: number; title: string; value: string; tone?: 'bad' | 'run' }) {
  const color = tone === 'bad' ? BAD_INK : tone === 'run' ? RUN_INK : INK;
  return (
    <g>
      <rect x={x} y={y} width={width} height={40} rx={6} fill={EQUIP} stroke={EQUIP_BORDER} strokeWidth={1.3} />
      <text x={x + width / 2} y={y + 15} textAnchor="middle" fontSize={9} fontWeight={600} letterSpacing={0.6} fill={MUTED}>{title}</text>
      <text x={x + width / 2} y={y + 31} textAnchor="middle" fontSize={12.5} fontWeight={700} fontFamily={MONO} fill={color}>{value}</text>
    </g>
  );
}

function PlcStrip({ y, text }: { y: number; text: string }) {
  return (
    <g>
      <rect x={12} y={y} width={616} height={26} rx={5} fill="#f1f5f9" stroke={EQUIP_BORDER} strokeWidth={1.2} />
      <text x={24} y={y + 17} fontSize={9.5} fontWeight={500} fontFamily={MONO} fill={MUTED}>{text}</text>
    </g>
  );
}

function Tank({ x, y, w, h, level }: { x: number; y: number; w: number; h: number; level: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} fill={EQUIP} stroke={LINE_LIGHT} strokeWidth={1.8} />
      <rect x={x + 4} y={y + 4 + (h - 8) * (1 - level)} width={w - 8} height={(h - 8) * level} rx={5} fill={PROCESS_SOFT} aria-hidden="true" />
      <line x1={x + 4} y1={y + 4 + (h - 8) * (1 - level)} x2={x + w - 4} y2={y + 4 + (h - 8) * (1 - level)} stroke={PROCESS} strokeWidth={1.5} aria-hidden="true" />
      {[0.25, 0.5, 0.75].map((t) => (
        <line key={t} x1={x + w - 10} y1={y + h * (1 - t)} x2={x + w - 4} y2={y + h * (1 - t)} stroke={LINE} strokeWidth={1} aria-hidden="true" />
      ))}
    </g>
  );
}

function WwtpMimic({ data, paused }: { data: WWTPSlave; paused: boolean }) {
  const pumpOn = data.pump_status === 1;
  const valveOpen = data.valve_status === 1;
  const flowing = pumpOn && valveOpen && data.flow > 5;
  const speed = Math.min(2.2, Math.max(0.5, 2.2 - data.flow / 300));
  const phBad = data.ph < 6 || data.ph > 8.5;
  const inletLevel = 0.3 + Math.min(0.6, data.flow / 500);
  const treatLevel = 0.45 + Math.min(0.4, data.pressure / 10);
  const summary = `Skema IPAL. Pompa ${pumpOn ? 'aktif' : 'mati'}, katup ${valveOpen ? 'terbuka' : 'tertutup'}, laju alir ${fmtInt(data.flow)} liter per menit, tekanan ${fmt(data.pressure)} bar, pH ${fmt(data.ph)} ${phBad ? 'di luar batas aman' : 'normal'}.`;

  return (
    <svg viewBox="0 0 640 348" className="w-full h-auto block" role="img" aria-label={paused ? summary + ' Animasi dijeda.' : summary}>
      <SheetGrid id="mgrid-wwtp" />
      <rect x={0} y={0} width={640} height={348} fill="url(#mgrid-wwtp)" aria-hidden="true" />

      {/* 01 Bak Inlet */}
      <StageTag x={16} y={26} num="01" title="BAK INLET" />
      <Tank x={16} y={38} w={98} h={116} level={inletLevel} />
      <text x={65} y={100} textAnchor="middle" fontSize={9.5} fill={MUTED}>Air limbah</text>
      <Readout x={16} y={164} width={98} title="LAJU ALIR" value={`${fmtInt(data.flow)} L/min`} />

      {/* 02 Pompa */}
      <StageTag x={140} y={26} num="02" title="POMPA" />
      <Elbow points={[[114, 96], [175, 96]]} flowing={pumpOn && data.flow > 5} speed={speed} fine />
      <PumpSymbol cx={200} cy={96} on={pumpOn} label="P-101" sub={pumpOn ? 'Aktif' : 'Mati'} />
      <Elbow points={[[224, 96], [258, 96]]} flowing={pumpOn && data.flow > 5} speed={speed} fine />

      {/* 03 Bak Pengolahan */}
      <StageTag x={268} y={26} num="03" title="PENGOLAHAN" />
      <Tank x={258} y={38} w={128} h={116} level={treatLevel} />
      {flowing && !paused && (
        <g fill={PROCESS} aria-hidden="true">
          <circle cx={295} cy={108} r={3.5} className="mimic-bubble" />
          <circle cx={320} cy={120} r={2.8} className="mimic-bubble" style={{ animationDelay: '0.4s' }} />
          <circle cx={347} cy={108} r={3.5} className="mimic-bubble" style={{ animationDelay: '0.8s' }} />
        </g>
      )}
      <text x={322} y={88} textAnchor="middle" fontSize={9.5} fill={MUTED}>Aerasi</text>
      <Readout x={258} y={164} width={128} title="TEKANAN" value={`${fmt(data.pressure)} bar`} />

      {/* 04 Sensor pH + Katup */}
      <StageTag x={402} y={26} num="04" title="SENSOR + KATUP" />
      <Elbow points={[[386, 96], [412, 96]]} flowing={flowing} speed={speed} fine />
      <InstrumentTag cx={438} cy={96} tag="AIT" value={fmt(data.ph)} ok={!phBad} />
      <text x={438} y={128} textAnchor="middle" fontSize={8.5} fill={MUTED}>pH 6,0-8,5</text>
      <Elbow points={[[458, 96], [478, 96]]} flowing={flowing} speed={speed} fine />
      <ValveSymbol x={494} y={96} open={valveOpen} label="V-102" sub={valveOpen ? 'Terbuka' : 'Tertutup'} />

      {/* 05 Outlet: pipa dibelokkan masuk dari atas kartu agar tersambung rapi */}
      <StageTag x={544} y={26} num="05" title="OUTLET" />
      <Elbow points={[[512, 96], [572, 96], [572, 124]]} flowing={flowing} speed={speed} fine />
      <rect x={532} y={124} width={88} height={52} rx={7} fill={flowing ? '#f0fdf4' : EQUIP} stroke={flowing ? RUN : LINE_LIGHT} strokeWidth={1.8} />
      <text x={576} y={146} textAnchor="middle" fontSize={10} fill={MUTED}>Air olahan</text>
      <text x={576} y={162} textAnchor="middle" fontSize={11} fontWeight={700} fill={flowing ? RUN_INK : MUTED}>{flowing ? 'Mengalir' : 'Berhenti'}</text>

      {/* Sinyal PLC */}
      <line x1={200} y1={176} x2={200} y2={288} stroke={LINE} strokeWidth={1.3} strokeDasharray="4 4" />
      <line x1={438} y1={140} x2={438} y2={288} stroke={LINE} strokeWidth={1.3} strokeDasharray="4 4" />
      <line x1={494} y1={175} x2={494} y2={288} stroke={LINE} strokeWidth={1.3} strokeDasharray="4 4" />
      <PlcStrip y={288} text="PLC UNIT 1 · %MW100 · garis putus-putus = sinyal" />
    </svg>
  );
}

function CleanWaterMimic({ data, paused }: { data: CleanWaterSlave; paused: boolean }) {
  const on = data.dist_status === 1;
  const flowing = on && data.flow > 10;
  const speed = Math.min(2.2, Math.max(0.5, 2.2 - data.flow / 500));
  const level = 0.35 + Math.min(0.55, data.pressure / 12);
  const summary = `Skema air bersih. Distribusi ${on ? 'aktif' : 'nonaktif'}, laju alir ${fmtInt(data.flow)} liter per menit, tekanan ${fmt(data.pressure)} bar.`;

  return (
    <svg viewBox="0 0 640 348" className="w-full h-auto block" role="img" aria-label={paused ? summary + ' Animasi dijeda.' : summary}>
      <SheetGrid id="mgrid-cw" />
      <rect x={0} y={0} width={640} height={348} fill="url(#mgrid-cw)" aria-hidden="true" />

      {/* 01 Reservoir */}
      <StageTag x={16} y={26} num="01" title="RESERVOIR" />
      <Tank x={16} y={38} w={98} h={150} level={level} />
      <text x={65} y={116} textAnchor="middle" fontSize={9.5} fill={MUTED}>{fmt(level * 100, 0)}%</text>

      {/* 02 Pompa */}
      <StageTag x={140} y={26} num="02" title="POMPA" />
      <Elbow points={[[114, 113], [175, 113]]} flowing={flowing} speed={speed} fine />
      <PumpSymbol cx={200} cy={113} on={on} label="P-201" sub={on ? 'Aktif' : 'Mati'} />
      <Elbow points={[[224, 113], [248, 113]]} flowing={flowing} speed={speed} fine />

      {/* 03 Meter alir */}
      <StageTag x={252} y={26} num="03" title="METER ALIR" />
      <InstrumentTag cx={280} cy={113} tag="FT" value={fmtInt(data.flow)} ok />
      <Elbow points={[[300, 113], [320, 113]]} flowing={flowing} speed={speed} fine />

      {/* 04 Sensor tekanan */}
      <StageTag x={332} y={26} num="04" title="TEKANAN" />
      <InstrumentTag cx={360} cy={113} tag="PT" value={fmt(data.pressure)} ok />
      <Elbow points={[[380, 113], [412, 113]]} flowing={flowing} speed={speed} fine />

      {/* 05 Distribusi */}
      <StageTag x={428} y={26} num="05" title="DISTRIBUSI" />
      <line x1={412} y1={78} x2={412} y2={234} stroke={on ? PROCESS : PIPE_OFF} strokeWidth={4} strokeLinecap="round" />
      {(['Gedung A', 'Gedung B', 'Gedung C'] as const).map((name, i) => {
        const y = 92 + i * 63;
        return (
          <g key={name}>
            <Elbow points={[[412, y], [452, y]]} flowing={flowing} speed={speed} fine />
            <rect x={452} y={y - 22} width={172} height={44} rx={7} fill={on ? '#f0fdf4' : EQUIP} stroke={on ? RUN : LINE_LIGHT} strokeWidth={1.6} />
            <circle cx={472} cy={y} r={6} fill={on ? RUN : LINE_LIGHT} />
            <text x={488} y={y - 3} fontSize={10.5} fontWeight={700} fontFamily={MONO} fill={INK}>{name}</text>
            <text x={488} y={y + 12} fontSize={9.5} fontWeight={600} fill={on ? RUN_INK : MUTED}>{on ? 'Terisi' : 'Berhenti'}</text>
          </g>
        );
      })}

      <line x1={200} y1={154} x2={200} y2={288} stroke={LINE} strokeWidth={1.3} strokeDasharray="4 4" />
      <line x1={360} y1={135} x2={360} y2={288} stroke={LINE} strokeWidth={1.3} strokeDasharray="4 4" />
      <PlcStrip y={288} text="PLC UNIT 2 · %MW200 · FT %MW200 · PT %MW201" />
    </svg>
  );
}

function FireMimic({ data, paused }: { data: FireSystemSlave; paused: boolean }) {
  const alarm = data.status === 1;
  const tempRatio = Math.min(1, Math.max(0, data.temp / 100));
  const smokeRatio = Math.min(1, Math.max(0, data.smoke / 1023));
  const tempColor = data.temp >= 60 ? BAD_INK : data.temp >= 45 ? AMBER : PROCESS;
  const smokeBad = data.smoke > 500;
  const summary = `Skema proteksi kebakaran Zona A. Suhu ${fmtInt(data.temp)} derajat, asap ${fmtInt(data.smoke)} dari 1023, status ${alarm ? 'kebakaran' : 'normal'}.`;

  return (
    <svg viewBox="0 0 640 348" className="w-full h-auto block" role="img" aria-label={paused ? summary + ' Animasi dijeda.' : summary}>
      <SheetGrid id="mgrid-fire" />
      <rect x={0} y={0} width={640} height={348} fill="url(#mgrid-fire)" aria-hidden="true" />

      {/* 01 Zona */}
      <StageTag x={16} y={26} num="01" title="ZONA A" />
      <rect x={16} y={38} width={232} height={196} rx={8} fill={alarm ? '#fef2f2' : EQUIP} stroke={alarm ? BAD : LINE_LIGHT} strokeWidth={1.8} />

      <InstrumentTag cx={54} cy={78} r={17} tag="TT" value={`${fmtInt(data.temp)}°`} ok={data.temp < 45} />
      <InstrumentTag cx={116} cy={78} r={17} tag="AIT" value={fmtInt(data.smoke)} ok={!smokeBad} />

      <g className="mimic-haze" opacity={0.15 + smokeRatio * 0.55} aria-hidden="true">
        <ellipse cx={138} cy={138} rx={50} ry={16} fill="#64748b" />
        <ellipse cx={162} cy={168} rx={38} ry={13} fill="#64748b" />
        <ellipse cx={118} cy={196} rx={30} ry={11} fill="#64748b" />
      </g>

      <rect x={36} y={116} width={20} height={98} rx={10} fill={EQUIP} stroke={LINE_LIGHT} strokeWidth={1.8} />
      <rect x={39} y={119 + 92 * (1 - tempRatio)} width={14} height={92 * tempRatio} rx={7} fill={tempColor} aria-hidden="true" />
      <text x={70} y={158} fontSize={16} fontWeight={700} fontFamily={MONO} fill={INK}>{fmtInt(data.temp)}°C</text>
      <text x={70} y={175} fontSize={9.5} fill={MUTED}>Ambang 45 / 60</text>
      <text x={70} y={202} fontSize={9.5} fontWeight={600} fill={smokeBad ? BAD_INK : MUTED}>Asap {fmtInt(data.smoke)} / ambang 500</text>

      <line x1={248} y1={96} x2={288} y2={96} stroke={LINE} strokeWidth={1.5} strokeDasharray="4 4" />
      <line x1={248} y1={176} x2={288} y2={176} stroke={LINE} strokeWidth={1.5} strokeDasharray="4 4" />

      {/* 02 Panel */}
      <StageTag x={296} y={26} num="02" title="PANEL KONTROL" />
      <rect x={288} y={38} width={146} height={196} rx={8} fill={EQUIP} stroke={alarm ? BAD : LINE_LIGHT} strokeWidth={1.8} />
      <text x={361} y={66} textAnchor="middle" fontSize={11} fontWeight={700} fontFamily={MONO} fill={alarm ? BAD_INK : INK}>PANEL KONTROL</text>
      <rect x={306} y={80} width={110} height={32} rx={6} fill={alarm ? '#fef2f2' : '#f0fdf4'} stroke={alarm ? BAD : RUN} strokeWidth={1.4} />
      <text x={361} y={101} textAnchor="middle" fontSize={11.5} fontWeight={700} fill={alarm ? BAD_INK : RUN_INK}>{alarm ? 'KEBAKARAN' : 'NORMAL'}</text>
      <text x={361} y={140} textAnchor="middle" fontSize={9.5} fontFamily={MONO} fill={MUTED}>UNIT 3 · %MW300</text>
      <text x={361} y={156} textAnchor="middle" fontSize={9.5} fill={MUTED}>Suhu + asap</text>
      <text x={361} y={196} textAnchor="middle" fontSize={9.5} fill={MUTED}>Bit alarm %MW302:X0</text>

      <line x1={434} y1={136} x2={470} y2={136} stroke={alarm ? BAD : LINE} strokeWidth={2} />

      {/* 03 Sirene */}
      <StageTag x={480} y={26} num="03" title="SIRENE" />
      <g className={alarm && !paused ? 'mimic-blink' : ''}>
        <rect x={480} y={38} width={134} height={196} rx={8} fill={alarm ? '#fef2f2' : EQUIP} stroke={alarm ? BAD : LINE_LIGHT} strokeWidth={2.2} />
        <path d="M528 92 a23 23 0 0 1 33 0 l7 29 h-47 z" fill="none" stroke={alarm ? BAD : MUTED} strokeWidth={2.2} strokeLinejoin="round" />
        <line x1={544} y1={85} x2={544} y2={76} stroke={alarm ? BAD : MUTED} strokeWidth={2.2} strokeLinecap="round" />
        <text x={545} y={156} textAnchor="middle" fontSize={11.5} fontWeight={700} fontFamily={MONO} fill={alarm ? BAD_INK : INK}>SIRENE</text>
        <text x={545} y={172} textAnchor="middle" fontSize={9.5} fontWeight={600} fill={alarm ? BAD_INK : MUTED}>{alarm ? 'Berbunyi' : 'Siaga'}</text>
        <text x={545} y={198} textAnchor="middle" fontSize={9.5} fontFamily={MONO} fill={MUTED}>ZONA A</text>
      </g>

      <PlcStrip y={288} text="PLC UNIT 3 · %MW300 · suhu %MW300 · asap %MW301" />
    </svg>
  );
}

function MimicLegend({ type }: { type: PIDDiagramProps['type'] }) {
  const note = type === 'wwtp' ? 'Pompa dan katup mengikuti bit PLC.' : type === 'clean-water' ? 'Cabang aktif hanya saat distribusi aktif.' : 'Sirene berkedip hanya saat status kebakaran aktif.';
  return (
    <div className="mt-3 rounded-lg bg-slate-50 border border-slate-200 px-3 py-2.5 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-slate-600">
      <span className="flex items-center gap-2">
        <span className="inline-block w-6 h-0 border-t-[3px] border-solid" style={{ borderColor: PROCESS }} aria-hidden="true" />
        Proses mengalir
      </span>
      <span className="flex items-center gap-2">
        <span className="inline-block w-6 h-0 border-t-[3px] border-solid border-slate-300" aria-hidden="true" />
        Berhenti
      </span>
      <span className="flex items-center gap-2">
        <span className="inline-block w-6 h-0 border-t-2 border-dashed border-slate-400" aria-hidden="true" />
        Sinyal PLC
      </span>
      <span>{note}</span>
    </div>
  );
}