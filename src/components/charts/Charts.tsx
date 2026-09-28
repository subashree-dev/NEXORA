// Clean SVG Chart Components for NEXORA
import React from 'react';

// Difficulty Distribution Donut / Bar
export const DifficultyBar: React.FC<{
  easy: number;
  medium: number;
  hard: number;
}> = ({ easy, medium, hard }) => {
  const total = easy + medium + hard || 1;
  const easyPct = Math.round((easy / total) * 100);
  const medPct = Math.round((medium / total) * 100);
  const hardPct = Math.max(0, 100 - easyPct - medPct);

  return (
    <div className="w-full space-y-2">
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-800">
        <div
          style={{ width: `${easyPct}%` }}
          className="bg-emerald-500 transition-all duration-500"
          title={`Easy: ${easy} (${easyPct}%)`}
        />
        <div
          style={{ width: `${medPct}%` }}
          className="bg-amber-500 transition-all duration-500"
          title={`Medium: ${medium} (${medPct}%)`}
        />
        <div
          style={{ width: `${hardPct}%` }}
          className="bg-rose-500 transition-all duration-500"
          title={`Hard: ${hard} (${hardPct}%)`}
        />
      </div>
      <div className="grid grid-cols-3 text-xs">
        <div className="flex items-center gap-1.5 text-slate-300">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span>Easy: <strong className="text-white">{easy}</strong> ({easyPct}%)</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-300">
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          <span>Medium: <strong className="text-white">{medium}</strong> ({medPct}%)</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-300">
          <span className="h-2 w-2 rounded-full bg-rose-500" />
          <span>Hard: <strong className="text-white">{hard}</strong> ({hardPct}%)</span>
        </div>
      </div>
    </div>
  );
};

// Activity Sparkline / Weekly trend
export const ActivitySparkline: React.FC<{
  data: number[];
  height?: number;
  strokeColor?: string;
  fillColor?: string;
}> = ({ data, height = 60, strokeColor = '#06b6d4', fillColor = 'rgba(6, 182, 212, 0.15)' }) => {
  if (!data || data.length === 0) {
    return <div className="text-xs text-slate-500 py-4">No recent activity data</div>;
  }

  const maxVal = Math.max(...data, 1);
  const width = 280;
  const padding = 6;
  const graphWidth = width - padding * 2;
  const graphHeight = height - padding * 2;

  const points = data.map((val, idx) => {
    const x = padding + (idx / (data.length - 1 || 1)) * graphWidth;
    const y = height - padding - (val / maxVal) * graphHeight;
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(' L ')}`;
  const closedPath = `${pathD} L ${width - padding},${height} L ${padding},${height} Z`;

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible"
        style={{ maxHeight: height }}
      >
        <defs>
          <linearGradient id={`grad-${strokeColor.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.3" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path d={closedPath} fill={`url(#grad-${strokeColor.replace('#', '')})`} />
        <path d={pathD} fill="none" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {data.map((val, idx) => {
          const x = padding + (idx / (data.length - 1 || 1)) * graphWidth;
          const y = height - padding - (val / maxVal) * graphHeight;
          return (
            <circle
              key={idx}
              cx={x}
              cy={y}
              r="3.5"
              className="fill-slate-950 stroke-cyan-400 stroke-2 hover:r-5 transition-all cursor-pointer"
            >
              <title>{`Week ${idx + 1}: ${val} problems solved`}</title>
            </circle>
          );
        })}
      </svg>
      <div className="flex justify-between text-[11px] text-slate-400 mt-1">
        <span>8 weeks ago</span>
        <span>Current Week</span>
      </div>
    </div>
  );
};

// Year-wise comparison bar chart
export const YearComparisonBarChart: React.FC<{
  data: { label: string; value: number; count: number; color: string }[];
}> = ({ data }) => {
  const maxVal = Math.max(...data.map((d) => d.value), 10);

  return (
    <div className="space-y-3">
      {data.map((item, idx) => {
        const pct = Math.min(100, Math.round((item.value / maxVal) * 100));
        return (
          <div key={idx} className="space-y-1">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-300">{item.label}</span>
              <div className="space-x-2">
                <span className="text-slate-400">{item.count} students</span>
                <span className="text-white font-semibold">{item.value} avg solved</span>
              </div>
            </div>
            <div className="h-3.5 w-full bg-slate-800/80 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, backgroundColor: item.color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Project Status Distribution Donut / Progress segments
export const ProjectStatusCards: React.FC<{
  distribution: Record<string, number>;
}> = ({ distribution }) => {
  const statuses = [
    { label: 'Completed', count: distribution['Completed'] || 0, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
    { label: 'Approved', count: distribution['Approved'] || 0, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' },
    { label: 'Under Review', count: distribution['Under Review'] || 0, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/30' },
    { label: 'Submitted', count: distribution['Submitted'] || 0, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
    { label: 'Needs Changes', count: distribution['Needs Changes'] || 0, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
      {statuses.map((s, i) => (
        <div key={i} className={`p-2.5 rounded-lg border ${s.bg} ${s.border} flex flex-col`}>
          <span className="text-[11px] text-slate-400">{s.label}</span>
          <span className={`text-lg font-bold ${s.color}`}>{s.count}</span>
        </div>
      ))}
    </div>
  );
};
