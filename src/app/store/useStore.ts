import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';

// ── Types ────────────────────────────────────────────────────────────────
export type Gender = 'Laki-Laki' | 'Perempuan';
export type Mazhab = 'NU' | 'Muhammadiyah';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  gender?: Gender;
  mazhab?: Mazhab;
  age?: number;
  city?: string;
  isProfileComplete: boolean;
  createdAt?: string;
}

export interface ImsakiyahEntry {
  id: number;
  hari_ke: number;
  tanggal_masehi: string;
  imsak: string;
  shubuh: string;
  terbit: string;
  dhuha: string;
  zhuhur: string;
  ashar: string;
  maghrib: string;
  isya: string;
}

export type SholatWajib = 'subuh' | 'zuhur' | 'asar' | 'magrib' | 'isya' | 'jumat';
export type SholatSunnah = 'dhuha' | 'tarawih' | 'tahajud' | 'witir';

export interface SholatRecord {
  id: string;
  user_id?: string;
  date: string;
  type: 'wajib' | 'sunnah';
  name: SholatWajib | SholatSunnah;
  completed: boolean;
  rakaat?: number;
  alasan?: string;
}

export interface PuasaRecord {
  id: string;
  user_id?: string;
  date: string;
  completed: boolean;
  sahurTime?: string;
  sahurPhoto?: string;
  alasan?: string;
}

export interface TilawahRecord {
  id: string;
  user_id?: string;
  date: string;
  surah?: string;
  halaman?: number;
  juz?: number;
  ayat?: number;
  duration?: number;
}

export interface ZakatRecord {
  id: string;
  user_id?: string;
  date: string;
  time: string;
  jumlahOrang: number;
  hargaBeras: number;
  totalNominal: number;
  bentuk: 'beras' | 'uang';
  metodePenyaluran: string;
  buktiUrl?: string;
  notes?: string;
}

export interface SedekahRecord {
  id: string;
  user_id?: string;
  date: string;
  nominal: number;
  tujuan: string;
  kategori: string;
  notes?: string;
}

export type MoodType = 'sangat-baik' | 'baik' | 'biasa' | 'kurang-baik' | 'buruk';

export interface JournalEntry {
  id: string;
  user_id?: string;
  date: string;
  mood: MoodType;
  story: string;
  evaluasi: string;
  gratitude?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface AgendaEntry {
  id: string;
  user_id?: string;
  title: string;
  date: string;
  time: string;
  category: 'ibadah' | 'kajian' | 'sosial';
  location?: string;
  reminder: boolean;
  notes?: string;
}

export interface ReminderSettings {
  sholatReminder: boolean;
  sholatTimes: string[];
  sahurReminder: boolean;
  sahurTime: string;
  tilawahReminder: boolean;
  tilawahTime: string;
  emailNotification: boolean;
  email?: string;
}

export const getTodayDateString = () => {
  const now = new Date();
  return new Intl.DateTimeFormat('sv-SE', { 
    timeZone: 'Asia/Jakarta' 
  }).format(now);
};


// ── Store Interface ──────────────────────────────────────────────────────
interface AppState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  loading: boolean;
  isInitialized: boolean;

  // Jadwal & Imsakiyah
  imsakiyahData: ImsakiyahEntry[];
  prayerTimes: Record<string, string> | null;
  fetchImsakiyah: () => Promise<void>;
  fetchPrayerTimes: () => Promise<void>;

  initialize: () => () => void;
  login: (email: string, password: string) => Promise<any>;
  loginWithGoogle: () => Promise<any>;
  logout: () => Promise<void>;
  setUser: (user: UserProfile) => void;

  fetchUserData: () => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;

  sholatRecords: SholatRecord[];
  addSholatRecord: (record: Omit<SholatRecord, 'id'>) => Promise<void>;
  updateSholatRecord: (id: string, updates: Partial<SholatRecord>) => Promise<void>;
  deleteSholatRecord: (id: string) => Promise<void>;
  getTodaySholatRecords: () => SholatRecord[];

  puasaRecords: PuasaRecord[];
  addPuasaRecord: (record: Omit<PuasaRecord, 'id'>) => Promise<void>;
  updatePuasaRecord: (id: string, updates: Partial<PuasaRecord>) => Promise<void>;
  getTodayPuasa: () => PuasaRecord | null;

  tilawahRecords: TilawahRecord[];
  addTilawahRecord: (record: Omit<TilawahRecord, 'id'>) => Promise<void>;
  getTodayTilawah: () => TilawahRecord[];

  zakatRecords: ZakatRecord[];
  addZakatRecord: (record: Omit<ZakatRecord, 'id'>) => Promise<void>;
  getTotalZakat: () => number;

  sedekahRecords: SedekahRecord[];
  addSedekahRecord: (record: Omit<SedekahRecord, 'id'>) => Promise<void>;
  getTotalSedekah: () => number;
  getSedekahByMonth: (year: number, month: number) => SedekahRecord[];

  journalEntries: JournalEntry[];
  addJournalEntry: (entry: Omit<JournalEntry, 'id'>) => Promise<void>;
  getJournalByDate: (date: string) => JournalEntry | null;

  chatHistory: ChatMessage[];
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearChatHistory: () => void;

  agendaEntries: AgendaEntry[];
  addAgendaEntry: (entry: Omit<AgendaEntry, 'id'>) => Promise<void>;
  deleteAgendaEntry: (id: string) => Promise<void>;

  reminderSettings: ReminderSettings;
  updateReminderSettings: (settings: Partial<ReminderSettings>) => void;
}

// ── Zustand Store ────────────────────────────────────────────────────────
export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // ── Auth & Loading State ──
      isAuthenticated: false,
      user: null,
      loading: false,
      isInitialized: false,
      prayerTimes: null,
      imsakiyahData: [],

      // ── Data ──
      sholatRecords: [],
      puasaRecords: [],
      tilawahRecords: [],
      zakatRecords: [],
      sedekahRecords: [],
      journalEntries: [],
      agendaEntries: [],
      chatHistory: [],
      reminderSettings: {
        sholatReminder: true,
        sholatTimes: ['05:00', '12:00', '15:30', '18:00', '19:30'],
        sahurReminder: true,
        sahurTime: '04:00',
        tilawahReminder: false,
        tilawahTime: '20:00',
        emailNotification: false,
        email: '',
      },

      initialize: () => {
        if (get().isInitialized) return () => {};

        supabase.auth.getSession().then(async ({ data: { session } }) => {
          if (session) {
            set({ isAuthenticated: true });
            await get().fetchUserData();
          }
        })
        .catch(err => console.error('Supabase Session Error:', err))
        .finally(() => {
          set({ isInitialized: true });
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (event === 'SIGNED_IN' && session) {
            set({ isAuthenticated: true });
            get().fetchUserData();
          } else if (event === 'SIGNED_OUT') {
            set({
              isAuthenticated: false,
              user: null,
              loading: false,
              prayerTimes: null,
              imsakiyahData: [],
              sholatRecords: [],
              puasaRecords: [],
              tilawahRecords: [],
              zakatRecords: [],
              sedekahRecords: [],
              journalEntries: [],
              agendaEntries: [],
            });
          }
        });

        return () => subscription.unsubscribe();
      },

      // ── Fetch Imsakiyah Lengkap (Untuk Kalender) ──
      fetchImsakiyah: async () => {
        const user = get().user;
        if (!user || !user.mazhab) return;
        const tableName = user.mazhab === 'Muhammadiyah' ? 'imsakiyah_muhammadiyah' : 'imsakiyah_nu';
        
        try {
          const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .order('hari_ke', { ascending: true });

          if (!error && data) {
            set({ imsakiyahData: data });
          }
        } catch (e) {
          console.error("Error fetching imsakiyah data:", e);
        }
      },

      // ── Fetch Jadwal Sholat Hari Ini ──
      fetchPrayerTimes: async () => {
        const user = get().user;
        if (!user || !user.mazhab) return;

        const today = getTodayDateString();
        const tableName = user.mazhab === 'Muhammadiyah' ? 'imsakiyah_muhammadiyah' : 'imsakiyah_nu';

        try {
          const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .eq('tanggal_masehi', today)
            .single();

          if (data && !error) {
            set({ prayerTimes: {
              imsak: data.imsak.substring(0, 5),
              subuh: data.shubuh.substring(0, 5),
              terbit: data.terbit.substring(0, 5),
              dhuha: data.dhuha.substring(0, 5),
              zuhur: data.zhuhur.substring(0, 5),
              asar: data.ashar.substring(0, 5),
              magrib: data.maghrib.substring(0, 5),
              isya: data.isya.substring(0, 5),
              jumat: data.zhuhur.substring(0, 5)
            }});
          }
        } catch (e) {
          console.error("Error fetching prayer times:", e);
        }
      },

      login: async (email, password) => {
        set({ loading: true });
        try {
          const { data, error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) throw error;
          return data;
        } finally {
          set({ loading: false });
        }
      },

      loginWithGoogle: async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo: window.location.origin + '/auth/callback' },
        });
        if (error) throw error;
        return data;
      },

      logout: async () => {
        set({ loading: true });
        try {
          await supabase.auth.signOut();
        } finally {
          set({ loading: false });
        }
      },

      setUser: (user) => set({ user }),

      fetchUserData: async () => {
        set({ loading: true });
        try {
          const { data: { user: authUser } } = await supabase.auth.getUser();
          if (!authUser) return;

          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .single();

          const meta = authUser.user_metadata;
          const userData: UserProfile = profile ? {
            id: profile.id,
            email: profile.email || authUser.email || '',
            name: profile.name || meta?.full_name || authUser.email?.split('@')[0] || 'User',
            gender: profile.gender,
            mazhab: profile.mazhab,
            age: profile.age,
            city: profile.city,
            isProfileComplete: !!profile.is_profile_complete,
            createdAt: profile.created_at,
          } : {
            id: authUser.id,
            email: authUser.email || '',
            name: meta?.full_name || authUser.email?.split('@')[0] || 'User',
            isProfileComplete: false,
          };

          set({ user: userData });
          
          // Panggil fungsi sinkronisasi data jadwal sesuai mazhab
          await Promise.all([
            get().fetchImsakiyah(),
            get().fetchPrayerTimes()
          ]);

          const [sholat, puasa, tilawah, journal, agenda, sedekah, zakat] = await Promise.all([
            supabase.from('sholat_records').select('*').eq('user_id', authUser.id),
            supabase.from('puasa_records').select('*').eq('user_id', authUser.id),
            supabase.from('tilawah_records').select('*').eq('user_id', authUser.id),
            supabase.from('journal_entries').select('*').eq('user_id', authUser.id),
            supabase.from('agenda_entries').select('*').eq('user_id', authUser.id),
            supabase.from('sedekah_records').select('*').eq('user_id', authUser.id),
            supabase.from('zakat_records').select('*').eq('user_id', authUser.id),
          ]);

          set({
            sholatRecords: sholat.data || [],
            puasaRecords: puasa.data?.map(p => ({
              id: p.id, date: p.date, completed: p.completed,
              sahurTime: p.sahur_time, sahurPhoto: p.sahur_photo_url, alasan: p.alasan,
            })) || [],
            tilawahRecords: tilawah.data || [],
            journalEntries: journal.data || [],
            agendaEntries: agenda.data || [],
            sedekahRecords: sedekah.data || [],
            zakatRecords: zakat.data?.map(z => ({
              ...z, jumlahOrang: z.jumlah_orang, hargaBeras: z.harga_beras,
              totalNominal: z.total_nominal, metodePenyaluran: z.metode_penyaluran,
              buktiUrl: z.bukti_url,
            })) || [],
          });
        } catch (err) {
          console.error('fetchUserData error:', err);
        } finally {
          set({ loading: false });
        }
      },

      updateProfile: async (updates) => {
        const userId = get().user?.id;
        if (!userId) return;

        const payload: any = { id: userId };
        if (updates.name !== undefined) payload.name = updates.name;
        if (updates.gender !== undefined) payload.gender = updates.gender;
        if (updates.mazhab !== undefined) payload.mazhab = updates.mazhab;
        if (updates.age !== undefined) payload.age = updates.age;
        if (updates.city !== undefined) payload.city = updates.city;
        if (updates.isProfileComplete !== undefined) payload.is_profile_complete = updates.isProfileComplete;

        const { error } = await supabase.from('profiles').upsert(payload);
        if (error) throw error;
        await get().fetchUserData();
      },

      addSholatRecord: async (record) => {
        const userId = get().user?.id;
        if (!userId) return;
        const { data, error } = await supabase.from('sholat_records').insert([{ ...record, user_id: userId }]).select().single();
        if (error) throw error;
        set(state => ({ sholatRecords: [...state.sholatRecords, data] }));
      },

      updateSholatRecord: async (id, updates) => {
        const { error } = await supabase.from('sholat_records').update(updates).eq('id', id);
        if (error) throw error;
        set(state => ({
          sholatRecords: state.sholatRecords.map(r => r.id === id ? { ...r, ...updates } : r),
        }));
      },

      deleteSholatRecord: async (id: string) => {
        const { error } = await supabase.from('sholat_records').delete().eq('id', id);
        if (error) throw error;
        set(state => ({
          sholatRecords: state.sholatRecords.filter(r => r.id !== id)
        }));
      },

      getTodaySholatRecords: () => {
        const today = getTodayDateString();
        return get().sholatRecords.filter(r => r.date === today);
      },

      addPuasaRecord: async (record) => {
        const userId = get().user?.id;
        if (!userId) return;
        const { error } = await supabase.from('puasa_records').upsert({
          user_id: userId, date: record.date, completed: record.completed,
          sahur_time: record.sahurTime, sahur_photo_url: record.sahurPhoto, alasan: record.alasan,
        }, { onConflict: 'user_id,date' });
        if (error) throw error;
        await get().fetchUserData();
      },

      updatePuasaRecord: async (id, updates) => {
        const dbUpdates: any = {};
        if (updates.completed !== undefined) dbUpdates.completed = updates.completed;
        if (updates.alasan !== undefined) dbUpdates.alasan = updates.alasan;
        if (updates.sahurTime !== undefined) dbUpdates.sahur_time = updates.sahurTime;
        if (updates.sahurPhoto !== undefined) dbUpdates.sahur_photo_url = updates.sahurPhoto;

        const { error } = await supabase.from('puasa_records').update(dbUpdates).eq('id', id);
        if (error) throw error;
        await get().fetchUserData();
      },

      getTodayPuasa: () => {
        const today = getTodayDateString();
        return get().puasaRecords.find(r => r.date === today) || null;
      },

      addTilawahRecord: async (record) => {
        const userId = get().user?.id;
        if (!userId) return;
        const { data, error } = await supabase.from('tilawah_records').insert([{ ...record, user_id: userId }]).select().single();
        if (error) throw error;
        set(s => ({ tilawahRecords: [...s.tilawahRecords, data] }));
      },

      getTodayTilawah: () => {
        const today = getTodayDateString();
        return get().tilawahRecords.filter(r => r.date === today);
      },

      addZakatRecord: async (record) => {
        const userId = get().user?.id;
        if (!userId) return;
        const { error } = await supabase.from('zakat_records').insert({
          user_id: userId, date: record.date, time: record.time,
          jumlah_orang: record.jumlahOrang, harga_beras: record.hargaBeras,
          total_nominal: record.totalNominal, bentuk: record.bentuk,
          metode_penyaluran: record.metodePenyaluran, bukti_url: record.buktiUrl, notes: record.notes,
        });
        if (error) throw error;
        await get().fetchUserData();
      },

      getTotalZakat: () => get().zakatRecords.reduce((sum, r) => sum + Number(r.totalNominal || 0), 0),

      addSedekahRecord: async (record) => {
        const userId = get().user?.id;
        if (!userId) return;
        const { error } = await supabase.from('sedekah_records').insert({ ...record, user_id: userId });
        if (error) throw error;
        await get().fetchUserData();
      },

      getTotalSedekah: () => get().sedekahRecords.reduce((sum, r) => sum + Number(r.nominal || 0), 0),

      getSedekahByMonth: (year, month) => get().sedekahRecords.filter(r => {
        const d = new Date(r.date);
        return d.getFullYear() === year && d.getMonth() === month;
      }),

      addJournalEntry: async (entry) => {
        const userId = get().user?.id;
        if (!userId) return;
        const { error } = await supabase.from('journal_entries').upsert({
          user_id: userId, date: entry.date, mood: entry.mood,
          story: entry.story, evaluasi: entry.evaluasi, gratitude: entry.gratitude,
        }, { onConflict: 'user_id,date' });
        if (error) throw error;
        await get().fetchUserData();
      },

      getJournalByDate: (date) => get().journalEntries.find(e => e.date === date) || null,

      addAgendaEntry: async (entry) => {
        const userId = get().user?.id;
        if (!userId) return;
        const { error } = await supabase.from('agenda_entries').insert({ ...entry, user_id: userId });
        if (error) throw error;
        await get().fetchUserData();
      },

      deleteAgendaEntry: async (id) => {
        const { error } = await supabase.from('agenda_entries').delete().eq('id', id);
        if (error) throw error;
        set(s => ({ agendaEntries: s.agendaEntries.filter(e => e.id !== id) }));
      },

      addChatMessage: (msg) => {
        const message: ChatMessage = { ...msg, id: crypto.randomUUID(), timestamp: new Date().toISOString() };
        set(s => ({ chatHistory: [...s.chatHistory, message] }));
      },

      clearChatHistory: () => set({ chatHistory: [] }),

      updateReminderSettings: (settings) => set(s => ({ reminderSettings: { ...s.reminderSettings, ...settings } })),
    }),
    {
      name: 'ramadhan-care-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        chatHistory: state.chatHistory,
        reminderSettings: state.reminderSettings,
      }),
    }
  )
);