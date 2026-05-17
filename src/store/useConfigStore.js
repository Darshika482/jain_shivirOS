import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useConfigStore = create(
  persist(
    (set) => ({
      supabaseUrl: '',
      supabaseAnonKey: '',
      campName: '',
      campCity: '',
      campStartDate: '',
      campEndDate: '',
      campTotalDays: 7,
      adminPassword: '',
      coinkeeperPin: '',
      isSetupComplete: false,

      saveSupabaseConfig: (cfg) => set(cfg),
      saveCampConfig: (cfg) => set(cfg),
      completeSetup: () => set({ isSetupComplete: true }),
      resetConfig: () => set({
        supabaseUrl: '', supabaseAnonKey: '', campName: '', campCity: '',
        campStartDate: '', campEndDate: '', campTotalDays: 7,
        adminPassword: '', coinkeeperPin: '', isSetupComplete: false,
      }),
    }),
    { name: 'shiviros-config' }
  )
);
