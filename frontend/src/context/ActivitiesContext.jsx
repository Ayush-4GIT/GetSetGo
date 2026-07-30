import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';

const ActivitiesContext = createContext();

const getTodayString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const ActivitiesProvider = ({ children }) => {
  const [activities, setActivities] = useState([]);
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [entries, setEntries] = useState({}); // { [activityId]: value }
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  // Load all activities (including archived when needed)
  const fetchActivities = useCallback(async (includeArchived = true) => {
    try {
      const data = await api.get(`/activities?includeArchived=${includeArchived}`);
      setActivities(data);
    } catch (err) {
      console.error('Error loading activities:', err);
    }
  }, []);

  // Fetch entries for a specific date
  const fetchEntriesForDate = useCallback(async (date) => {
    try {
      setLoading(true);
      const data = await api.get(`/entries?date=${date}`);
      const entryMap = {};
      data.forEach((e) => {
        entryMap[e.activityId] = e.value;
      });
      setEntries(entryMap);
    } catch (err) {
      console.error(`Error loading entries for ${date}:`, err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  useEffect(() => {
    fetchEntriesForDate(selectedDate);
  }, [selectedDate, fetchEntriesForDate]);

  // Upsert entry with optimistic UI update
  const saveEntry = async (activityId, value) => {
    setSavingId(activityId);
    setEntries((prev) => ({ ...prev, [activityId]: String(value) }));

    try {
      await api.put('/entries', {
        activityId,
        date: selectedDate,
        value,
      });
    } catch (err) {
      console.error('Failed to save entry:', err);
      // Revert if error
      fetchEntriesForDate(selectedDate);
    } finally {
      setTimeout(() => setSavingId(null), 300);
    }
  };

  const addActivity = async (newActivity) => {
    const created = await api.post('/activities', newActivity);
    setActivities((prev) => [...prev, created]);
    return created;
  };

  const editActivity = async (id, updateData) => {
    const updated = await api.patch(`/activities/${id}`, updateData);
    setActivities((prev) => prev.map((a) => (a.id === id ? updated : a)));
    return updated;
  };

  const deleteActivity = async (id) => {
    await api.delete(`/activities/${id}`);
    setActivities((prev) =>
      prev.map((a) => (a.id === id ? { ...a, archived: true } : a))
    );
  };

  return (
    <ActivitiesContext.Provider
      value={{
        activities,
        selectedDate,
        setSelectedDate,
        entries,
        loading,
        savingId,
        saveEntry,
        addActivity,
        editActivity,
        deleteActivity,
        fetchActivities,
        fetchEntriesForDate,
      }}
    >
      {children}
    </ActivitiesContext.Provider>
  );
};

export const useActivities = () => useContext(ActivitiesContext);
