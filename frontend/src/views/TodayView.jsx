import React from 'react';
import { ChevronLeft, ChevronRight, Calendar, Sparkles, CheckCircle2 } from 'lucide-react';
import { useActivities } from '../context/ActivitiesContext';
import { ActivityInput } from '../components/ActivityInput';
import { Link } from 'react-router-dom';

const formatDateTitle = (dateStr) => {
  const d = new Date(dateStr + 'T00:00:00');
  const todayStr = new Date().toISOString().split('T')[0];

  if (dateStr === todayStr) {
    return 'Today, ' + d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
};

export const TodayView = () => {
  const { activities, selectedDate, setSelectedDate, entries, savingId, loading } = useActivities();

  const activeActivities = activities.filter((a) => !a.archived);

  // Calculate day completion percentage
  const totalActive = activeActivities.length;
  let loggedCount = 0;
  activeActivities.forEach((act) => {
    const val = entries[act.id];
    if (val !== undefined && val !== null && val !== '') {
      if (act.type === 'yesno') {
        if (val === '1') loggedCount++;
      } else {
        if (parseFloat(val) > 0) loggedCount++;
      }
    }
  });

  const completionRate = totalActive > 0 ? Math.round((loggedCount / totalActive) * 100) : 0;

  const navigateDate = (days) => {
    const d = new Date(selectedDate + 'T00:00:00');
    d.setDate(d.getDate() + days);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    setSelectedDate(`${y}-${m}-${day}`);
  };

  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  return (
    <div>
      {/* Date Navigator Header */}
      <div className="date-navigator">
        <button className="date-btn" onClick={() => navigateDate(-1)}>
          <ChevronLeft size={18} />
          <span>Previous</span>
        </button>

        <div className="date-display">
          <h2 className="date-title">{formatDateTitle(selectedDate)}</h2>
          <input
            type="date"
            className="date-picker-input"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          {!isToday && (
            <button
              className="stat-badge info"
              style={{ cursor: 'pointer', border: 'none' }}
              onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
            >
              Jump to Today
            </button>
          )}
        </div>

        <button className="date-btn" onClick={() => navigateDate(1)}>
          <span>Next</span>
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Daily Progress Banner */}
      <div className="today-summary">
        <div className="glass-card progress-ring-card">
          <div style={{ position: 'relative', width: 64, height: 64, flexShrink: 0 }}>
            <svg width="64" height="64" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="3.5"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="var(--accent-primary)"
                strokeWidth="3.5"
                strokeDasharray={`${completionRate}, 100`}
                strokeLinecap="round"
              />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 800 }}>
              {completionRate}%
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span className="stat-badge success">
                <Sparkles size={12} />
                Daily Pulse
              </span>
            </div>
            <h3 style={{ fontSize: '1.1rem' }}>
              {completionRate === 100
                ? 'All Habits Completed! 🎉'
                : completionRate >= 50
                ? 'Great progress so far!'
                : 'Keep pushing! Log your day.'}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {loggedCount} of {totalActive} active habits completed
            </p>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 4 }}>Tracking Status</div>
            <div style={{ fontWeight: 600, fontSize: '1.05rem', color: 'var(--text-main)' }}>
              Autosaving on change
            </div>
          </div>
          <Link to="/activities" className="date-btn">
            + Manage Habits
          </Link>
        </div>
      </div>

      {/* Activity Input Cards Grid */}
      {activeActivities.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <CheckCircle2 size={48} color="var(--text-muted)" style={{ marginBottom: 16 }} />
          <h3>No Active Habits Found</h3>
          <p style={{ color: 'var(--text-muted)', margin: '8px 0 20px' }}>
            Add your daily activities or unarchive existing ones to start tracking.
          </p>
          <Link to="/activities" className="primary-btn" style={{ display: 'inline-flex' }}>
            + Create First Habit
          </Link>
        </div>
      ) : (
        <div className="activity-grid">
          {activeActivities.map((activity) => (
            <ActivityInput
              key={activity.id}
              activity={activity}
              currentValue={entries[activity.id]}
              isSaving={savingId === activity.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};
