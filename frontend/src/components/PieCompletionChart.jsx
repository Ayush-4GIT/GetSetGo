import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Flame, CheckCircle2 } from 'lucide-react';

const COLORS = ['#10b981', '#ef4444', '#374151'];

export const PieCompletionChart = ({ activity, entries, totalDays }) => {
  // Calculate completed ("1"), missed ("0"), and unlogged days
  const completedCount = entries.filter((e) => e.value === '1').length;
  const missedCount = entries.filter((e) => e.value === '0').length;
  const unloggedCount = Math.max(0, totalDays - (completedCount + missedCount));

  const data = [
    { name: 'Completed', value: completedCount },
    { name: 'Missed', value: missedCount },
    { name: 'Not Logged', value: unloggedCount },
  ].filter((d) => d.value > 0);

  const completionPct = totalDays > 0 ? Math.round((completedCount / totalDays) * 100) : 0;

  // Streak calculation (consecutive completed days ending today/latest)
  let currentStreak = 0;
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));
  for (const item of sorted) {
    if (item.value === '1') {
      currentStreak++;
    } else if (item.value === '0') {
      break;
    }
  }

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h4 style={{ fontSize: '1.1rem', marginBottom: 2 }}>{activity.name}</h4>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Yes / No Habit</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '4px 10px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600 }}>
          <Flame size={14} fill="currentColor" />
          <span>{currentStreak} Day Streak</span>
        </div>
      </div>

      <div style={{ height: 180, width: '100%', position: 'relative' }}>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => {
                  const color = entry.name === 'Completed' ? '#10b981' : entry.name === 'Missed' ? '#ef4444' : '#374151';
                  return <Cell key={`cell-${index}`} fill={color} stroke="transparent" />;
                })}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No log data in range
          </div>
        )}

        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>{completionPct}%</div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Completion</div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-around', paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.85rem' }}>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>Done: </span>
          <strong style={{ color: '#10b981' }}>{completedCount} d</strong>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>Missed: </span>
          <strong style={{ color: '#ef4444' }}>{missedCount} d</strong>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>Total: </span>
          <strong>{totalDays} d</strong>
        </div>
      </div>
    </div>
  );
};
