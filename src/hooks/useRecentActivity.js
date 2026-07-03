import { useState, useCallback } from 'react';

const ACTIVITIES_KEY = 'apex_catalog_activities';
const MAX_LOGS = 15;

const INITIAL_ACTIVITIES = [
  {
    id: 'act-1',
    type: 'info',
    message: 'Catalog database initialized with pre-seeded demo items.',
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString() // 3 hours ago
  },
  {
    id: 'act-2',
    type: 'edit',
    message: 'Default products marked as active in local storage state.',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString() // 2 hours ago
  }
];

export function useRecentActivity() {
  const [activities, setActivities] = useState(() => {
    try {
      const stored = window.localStorage.getItem(ACTIVITIES_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      window.localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(INITIAL_ACTIVITIES));
      return INITIAL_ACTIVITIES;
    } catch (error) {
      console.error('Failed to parse recent activities:', error);
      return INITIAL_ACTIVITIES;
    }
  });

  const logActivity = useCallback((message, type = 'info') => {
    setActivities((prev) => {
      const newActivity = {
        id: `act-${Math.random().toString(36).substring(2, 9)}`,
        type,
        message,
        timestamp: new Date().toISOString()
      };
      
      const updated = [newActivity, ...prev].slice(0, MAX_LOGS);
      try {
        window.localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to save activities to localStorage:', error);
      }
      return updated;
    });
  }, []);

  const clearActivities = useCallback(() => {
    setActivities([]);
    try {
      window.localStorage.setItem(ACTIVITIES_KEY, JSON.stringify([]));
    } catch (error) {
      console.error('Failed to clear activities from localStorage:', error);
    }
  }, []);

  return { activities, logActivity, clearActivities };
}
