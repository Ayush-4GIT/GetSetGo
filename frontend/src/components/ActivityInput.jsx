import React, { useState, useEffect, useRef } from 'react';
import { Check, X, Minus, Plus, Loader2 } from 'lucide-react';
import { useActivities } from '../context/ActivitiesContext';

export const ActivityInput = ({ activity, currentValue, isSaving }) => {
  const { saveEntry } = useActivities();
  const [localNumeric, setLocalNumeric] = useState(currentValue ?? '');
  const debounceTimer = useRef(null);

  // Sync local input with external changes (e.g. date switch)
  useEffect(() => {
    setLocalNumeric(currentValue ?? '');
  }, [currentValue]);

  const handleYesNoClick = (val) => {
    saveEntry(activity.id, val);
  };

  const handleNumericChange = (newVal) => {
    setLocalNumeric(newVal);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      saveEntry(activity.id, newVal);
    }, 500);
  };

  const handleStep = (delta) => {
    const currentNum = parseFloat(localNumeric) || 0;
    const nextVal = Math.max(0, currentNum + delta);
    setLocalNumeric(String(nextVal));
    saveEntry(activity.id, String(nextVal));
  };

  return (
    <div className="glass-card activity-card">
      <div className="activity-header">
        <div className="activity-title">
          <span>{activity.name}</span>
          <span className="type-pill">{activity.type}</span>
        </div>

        {isSaving && (
          <div className="saving-indicator">
            <Loader2 size={14} className="spin" />
            <span>Saving...</span>
          </div>
        )}
      </div>

      <div className="activity-body">
        {activity.type === 'yesno' ? (
          <div className="toggle-group">
            <button
              type="button"
              className={`toggle-btn ${
                currentValue === '1' ? 'active-yes' : ''
              }`}
              onClick={() => handleYesNoClick('1')}
            >
              <Check size={16} style={{ display: 'inline', marginRight: 4 }} />
              Yes
            </button>

            <button
              type="button"
              className={`toggle-btn ${
                currentValue === '0' ? 'active-no' : ''
              }`}
              onClick={() => handleYesNoClick('0')}
            >
              <X size={16} style={{ display: 'inline', marginRight: 4 }} />
              No
            </button>

            <button
              type="button"
              className={`toggle-btn ${
                !currentValue ? 'active-none' : ''
              }`}
              onClick={() => handleYesNoClick('')}
            >
              Skip
            </button>
          </div>
        ) : (
          <div className="numeric-input-group">
            <button
              type="button"
              className="step-btn"
              onClick={() => handleStep(-1)}
            >
              <Minus size={16} />
            </button>

            <div className="numeric-field-wrapper">
              <input
                type="number"
                min="0"
                step="any"
                className="numeric-input"
                value={localNumeric}
                placeholder="0"
                onChange={(e) => handleNumericChange(e.target.value)}
              />
              {activity.unit && <span className="unit-tag">{activity.unit}</span>}
            </div>

            <button
              type="button"
              className="step-btn"
              onClick={() => handleStep(1)}
            >
              <Plus size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
