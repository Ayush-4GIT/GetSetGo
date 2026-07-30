import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const NumericTrendChart = ({ activity, entries, dateList }) => {
  // Map entries into full date sequence
  const entryMap = {};
  entries.forEach((e) => {
    const val = parseFloat(e.value);
    if (!isNaN(val)) entryMap[e.date] = val;
  });

  const chartData = dateList.map((d) => ({
    date: d.slice(5), // "MM-DD"
    fullDate: d,
    val: entryMap[d] ?? 0,
  }));

  const values = Object.values(entryMap);
  const total = values.reduce((sum, v) => sum + v, 0);
  const avg = values.length > 0 ? (total / values.length).toFixed(1) : 0;
  const max = values.length > 0 ? Math.max(...values) : 0;

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h4 style={{ fontSize: '1.1rem', marginBottom: 2 }}>{activity.name}</h4>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Numeric Trend ({activity.unit || 'units'})
          </span>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Avg</div>
            <div style={{ fontWeight: 700, color: 'var(--accent-secondary)' }}>
              {avg} {activity.unit}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total</div>
            <div style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>
              {total} {activity.unit}
            </div>
          </div>
        </div>
      </div>

      <div style={{ height: 180, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={`grad-${activity.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" stroke="#6b7280" tick={{ fontSize: 11 }} />
            <YAxis stroke="#6b7280" tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff' }}
              formatter={(val) => [`${val} ${activity.unit || ''}`, activity.name]}
            />
            <Area
              type="monotone"
              dataKey="val"
              stroke="#06b6d4"
              strokeWidth={3}
              fillOpacity={1}
              fill={`url(#grad-${activity.id})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-around', paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.85rem' }}>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>Max Daily: </span>
          <strong style={{ color: '#06b6d4' }}>
            {max} {activity.unit}
          </strong>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>Logged Days: </span>
          <strong>{values.length} d</strong>
        </div>
      </div>
    </div>
  );
};
