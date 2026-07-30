import React from 'react';
import { Calendar } from 'lucide-react';

export const DateRangePicker = ({ rangePreset, setRangePreset, customFrom, customTo, setCustomFrom, setCustomTo }) => {
  return (
    <div className="glass-card" style={{ padding: '16px 20px', marginBottom: 28, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Calendar size={20} color="var(--accent-primary)" />
        <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Time Horizon:</span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
        {['7days', '30days', 'thisMonth', 'custom'].map((preset) => {
          const labels = {
            '7days': 'Last 7 Days',
            '30days': 'Last 30 Days',
            'thisMonth': 'This Month',
            'custom': 'Custom Range',
          };
          return (
            <button
              key={preset}
              className={`date-btn ${rangePreset === preset ? 'primary-btn' : ''}`}
              style={{ padding: '6px 14px', fontSize: '0.85rem' }}
              onClick={() => setRangePreset(preset)}
            >
              {labels[preset]}
            </button>
          );
        })}
      </div>

      {rangePreset === 'custom' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <input
            type="date"
            className="date-picker-input"
            value={customFrom}
            onChange={(e) => setCustomFrom(e.target.value)}
          />
          <span style={{ color: 'var(--text-muted)' }}>to</span>
          <input
            type="date"
            className="date-picker-input"
            value={customTo}
            onChange={(e) => setCustomTo(e.target.value)}
          />
        </div>
      )}
    </div>
  );
};
