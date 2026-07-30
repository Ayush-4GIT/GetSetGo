import React from 'react';
import { Edit2, Archive, ArchiveRestore, Hash, CheckSquare } from 'lucide-react';

export const ActivityListItem = ({ activity, onEdit, onToggleArchive }) => {
  return (
    <div className={`glass-card list-item ${activity.archived ? 'archived' : ''}`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: activity.type === 'yesno' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(6, 182, 212, 0.15)',
            color: activity.type === 'yesno' ? '#818cf8' : '#22d3ee',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {activity.type === 'yesno' ? <CheckSquare size={18} /> : <Hash size={18} />}
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: '1rem' }}>
            {activity.name}
            {activity.archived && (
              <span style={{ fontSize: '0.75rem', color: '#9ca3af', marginLeft: 8 }}>(Archived)</span>
            )}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Type: {activity.type === 'yesno' ? 'Yes/No Toggle' : `Numeric (${activity.unit || 'no unit'})`}
          </div>
        </div>
      </div>

      <div className="action-btn-group">
        <button
          className="icon-btn"
          title="Edit Activity"
          onClick={() => onEdit(activity)}
        >
          <Edit2 size={16} />
        </button>

        <button
          className="icon-btn"
          title={activity.archived ? 'Restore Activity' : 'Archive Activity'}
          onClick={() => onToggleArchive(activity)}
        >
          {activity.archived ? <ArchiveRestore size={16} /> : <Archive size={16} />}
        </button>
      </div>
    </div>
  );
};
