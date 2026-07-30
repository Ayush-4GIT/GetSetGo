import React, { useState } from 'react';
import { Plus, Sliders, Eye, EyeOff } from 'lucide-react';
import { useActivities } from '../context/ActivitiesContext';
import { ActivityListItem } from '../components/ActivityListItem';
import { ActivityForm } from '../components/ActivityForm';

export const ManageActivitiesView = () => {
  const { activities, addActivity, editActivity, deleteActivity } = useActivities();
  const [showArchived, setShowArchived] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);

  const activeCount = activities.filter((a) => !a.archived).length;
  const archivedCount = activities.filter((a) => a.archived).length;

  const displayedActivities = showArchived
    ? activities
    : activities.filter((a) => !a.archived);

  const handleOpenCreate = () => {
    setEditingActivity(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (activity) => {
    setEditingActivity(activity);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    if (editingActivity) {
      await editActivity(editingActivity.id, formData);
    } else {
      await addActivity(formData);
    }
    setIsModalOpen(false);
    setEditingActivity(null);
  };

  const handleToggleArchive = async (activity) => {
    await editActivity(activity.id, { archived: !activity.archived });
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 style={{ fontSize: '1.6rem', marginBottom: 4 }}>Manage Habits & Activities</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {activeCount} Active • {archivedCount} Archived
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button
            className="date-btn"
            onClick={() => setShowArchived(!showArchived)}
          >
            {showArchived ? <EyeOff size={16} /> : <Eye size={16} />}
            <span>{showArchived ? 'Hide Archived' : 'Show Archived'}</span>
          </button>

          <button className="primary-btn" onClick={handleOpenCreate}>
            <Plus size={18} />
            <span>Add Habit</span>
          </button>
        </div>
      </div>

      <div className="activity-list">
        {displayedActivities.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: 'var(--text-muted)' }}>No activities found.</p>
          </div>
        ) : (
          displayedActivities.map((activity) => (
            <ActivityListItem
              key={activity.id}
              activity={activity}
              onEdit={handleOpenEdit}
              onToggleArchive={handleToggleArchive}
            />
          ))
        )}
      </div>

      {isModalOpen && (
        <ActivityForm
          initialData={editingActivity}
          onSubmit={handleFormSubmit}
          onClose={() => {
            setIsModalOpen(false);
            setEditingActivity(null);
          }}
        />
      )}
    </div>
  );
};
