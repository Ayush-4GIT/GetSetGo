import React, { useState, useEffect, useMemo } from 'react';
import { Award, CheckCircle, TrendingUp, Activity } from 'lucide-react';
import { useActivities } from '../context/ActivitiesContext';
import { DateRangePicker } from '../components/DateRangePicker';
import { PieCompletionChart } from '../components/PieCompletionChart';
import { NumericTrendChart } from '../components/NumericTrendChart';
import { api } from '../api/client';

const getDateRange = (preset, customFrom, customTo) => {
  const toDate = new Date();
  let fromDate = new Date();

  if (preset === '7days') {
    fromDate.setDate(toDate.getDate() - 6);
  } else if (preset === '30days') {
    fromDate.setDate(toDate.getDate() - 29);
  } else if (preset === 'thisMonth') {
    fromDate = new Date(toDate.getFullYear(), toDate.getMonth(), 1);
  } else if (preset === 'custom' && customFrom && customTo) {
    return { from: customFrom, to: customTo };
  }

  const format = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  return { from: format(fromDate), to: format(toDate) };
};

const generateDateList = (fromStr, toStr) => {
  const list = [];
  let curr = new Date(fromStr + 'T00:00:00');
  const end = new Date(toStr + 'T00:00:00');

  while (curr <= end) {
    const y = curr.getFullYear();
    const m = String(curr.getMonth() + 1).padStart(2, '0');
    const d = String(curr.getDate()).padStart(2, '0');
    list.push(`${y}-${m}-${d}`);
    curr.setDate(curr.getDate() + 1);
  }

  return list;
};

export const ProgressView = () => {
  const { activities } = useActivities();
  const [rangePreset, setRangePreset] = useState('7days');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [rangeEntries, setRangeEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const { from, to } = useMemo(
    () => getDateRange(rangePreset, customFrom, customTo),
    [rangePreset, customFrom, customTo]
  );

  const dateList = useMemo(() => generateDateList(from, to), [from, to]);
  const totalDays = dateList.length;

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    api
      .get(`/entries?from=${from}&to=${to}`)
      .then((data) => {
        if (isMounted) setRangeEntries(data);
      })
      .catch((err) => console.error('Failed to fetch range entries:', err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [from, to]);

  const activeActivities = activities.filter((a) => !a.archived);

  // Stats Calculations
  const yesNoActivities = activeActivities.filter((a) => a.type === 'yesno');
  const numericActivities = activeActivities.filter((a) => a.type === 'numeric');

  const totalCheckIns = rangeEntries.filter(
    (e) => e.value !== '0' && e.value !== '' && e.value !== null
  ).length;

  // Find most consistent activity
  let topHabitName = 'N/A';
  let maxCompletions = -1;
  yesNoActivities.forEach((act) => {
    const count = rangeEntries.filter(
      (e) => e.activityId === act.id && e.value === '1'
    ).length;
    if (count > maxCompletions) {
      maxCompletions = count;
      topHabitName = act.name;
    }
  });

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.6rem', marginBottom: 4 }}>Progress & Analytics</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Overview of your completion trends and numeric performance over time.
        </p>
      </div>

      {/* Date Range Selector */}
      <DateRangePicker
        rangePreset={rangePreset}
        setRangePreset={setRangePreset}
        customFrom={customFrom}
        customTo={customTo}
        setCustomFrom={setCustomFrom}
        setCustomTo={setCustomTo}
      />

      {/* Top KPI Cards */}
      <div className="progress-grid">
        <div className="glass-card kpi-card">
          <div className="kpi-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Check-Ins</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{totalCheckIns}</div>
          </div>
        </div>

        <div className="glass-card kpi-card">
          <div className="kpi-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
            <Award size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Most Consistent</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {topHabitName}
            </div>
          </div>
        </div>

        <div className="glass-card kpi-card">
          <div className="kpi-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Time Span</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{totalDays} Days</div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {yesNoActivities.map((act) => {
          const actEntries = rangeEntries.filter((e) => e.activityId === act.id);
          return (
            <PieCompletionChart
              key={act.id}
              activity={act}
              entries={actEntries}
              totalDays={totalDays}
            />
          );
        })}

        {numericActivities.map((act) => {
          const actEntries = rangeEntries.filter((e) => e.activityId === act.id);
          return (
            <NumericTrendChart
              key={act.id}
              activity={act}
              entries={actEntries}
              dateList={dateList}
            />
          );
        })}
      </div>
    </div>
  );
};
