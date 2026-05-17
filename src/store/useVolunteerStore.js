import { create } from 'zustand';
import { supabase } from '../lib/supabase.js';

export const useVolunteerStore = create((set, get) => ({
  volunteers: [],
  loading: true,

  fetchVolunteers: async () => {
    set({ loading: true });
    const { data, error } = await supabase.from('volunteers').select('*').order('name');
    if (!error) set({ volunteers: data || [] });
    set({ loading: false });
  },

  addVolunteer: async (v) => {
    const newV = { ...v, id: `v${Date.now()}` };
    const { error } = await supabase.from('volunteers').insert(newV);
    if (!error) set(state => ({ volunteers: [...state.volunteers, newV] }));
  },

  updateVolunteer: async (id, updates) => {
    const { error } = await supabase.from('volunteers').update(updates).eq('id', id);
    if (!error) set(state => ({
      volunteers: state.volunteers.map(v => v.id === id ? { ...v, ...updates } : v)
    }));
  },

  deleteVolunteer: async (id) => {
    const { error } = await supabase.from('volunteers').delete().eq('id', id);
    if (!error) set(state => ({ volunteers: state.volunteers.filter(v => v.id !== id) }));
  },

  getByPin: (pin) => get().volunteers.find(v => v.pin === pin),
}));
