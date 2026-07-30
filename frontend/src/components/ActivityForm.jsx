import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export const ActivityForm = ({ initialData, onSubmit, onClose }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [type, setType] = useState(initialData?.type || 'yesno');
  const [unit, setUnit] = useState(initialData?.unit || '');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a habit or activity name.');
      return;
    }

    onSubmit({
      name: name.trim(),
      type,
      unit: type === 'numeric' ? unit.trim() : null,
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3>{initialData ? 'Edit Habit / Activity' : 'Add New Habit / Activity'}</h3>
          <button className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.4)', padding: '10px 14px', borderRadius: 8, fontSize: '0.85rem', color: '#fca5a5', marginBottom: 16 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Activity Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Morning Workout, Water Intake, Read"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tracking Type</label>
            <select
              className="form-select"
              value={type}
              onChange={(e) => setType(e.target.value)}
              disabled={!!initialData} // Lock type on edit to keep history intact
            >
              <option value="yesno">Yes / No (Completion toggle)</option>
              <option value="numeric">Numeric Value (Number count, time, pages)</option>
            </select>
          </div>

          {type === 'numeric' && (
            <div className="form-group">
              <label className="form-label">Measurement Unit</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. mins, pages, L, km, cups"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              />
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
            <button type="button" className="date-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="primary-btn">
              {initialData ? 'Save Changes' : 'Create Activity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
