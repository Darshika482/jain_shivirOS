import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useScheduleStore = create(
  persist(
    (set, get) => ({
      schedule: {},
      selectedDay: 1,

      setDay: (day) => set({ selectedDay: day }),

      getActivitiesForDay: (day) => get().schedule[day] || [],

      addSpecialActivity: (day, activity) => {
        const id = `special_${Date.now()}`;
        const newActivity = { ...activity, id, day, type: 'special' };
        set(state => ({
          schedule: {
            ...state.schedule,
            [day]: [...(state.schedule[day] || []), newActivity]
          }
        }));
      },

      updateActivity: (day, id, updates) => {
        set(state => ({
          schedule: {
            ...state.schedule,
            [day]: state.schedule[day].map(a => a.id === id ? { ...a, ...updates } : a)
          }
        }));
      },

      deleteSpecialActivity: (day, id) => {
        set(state => ({
          schedule: {
            ...state.schedule,
            [day]: state.schedule[day].filter(a => a.id !== id || a.type === 'base')
          }
        }));
      },

      // Event plans keyed by activity id
      eventPlans: {},

      updateEventPlan: (activityId, plan) => {
        set(state => ({
          eventPlans: { ...state.eventPlans, [activityId]: plan }
        }));
      },
    }),
    {
      name: 'shivir-schedule',
      version: 4,
      migrate: (persistedState, version) => {
        if (!persistedState || typeof persistedState !== 'object') return persistedState;
        if (version >= 4) return persistedState;
        // Strip mock-seeded base activities (IDs like sch1_d1, sch2_d3, …).
        // Keep any special/custom activities the admin actually added.
        const isMockId = (id) => /^sch\d+(_d\d+)?$/.test(String(id || ''));
        const oldSchedule = persistedState.schedule || {};
        const cleaned = {};
        for (const [day, acts] of Object.entries(oldSchedule)) {
          const kept = Array.isArray(acts) ? acts.filter(a => !isMockId(a.id)) : [];
          if (kept.length) cleaned[day] = kept;
        }
        return { ...persistedState, schedule: cleaned };
      },
    }
  )
);
