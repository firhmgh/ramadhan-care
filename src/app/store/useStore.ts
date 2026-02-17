import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';

// --- Types ---
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
  sahurTime?: string;     // mapped from sahur_time
  sahurPhoto?: string;    // mapped from sahur_photo_url
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
  buktiUrl?: string;      // mapped from bukti_url
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

// --- Helper Utilities ---
export const getTodayDateString = () => new Date().toISOString().split('T')[0];

// --- Store Interface ---
interface AppState {
  // Auth & Profile
  isAuthenticated: boolean;
  user: UserProfile | null;
  loading: boolean;
  initialize: () => void;  // dari Code 1 (tidak async di luar)
  login: (email: string, password: string) => Promise<any>;
  loginWithGoogle: () => Promise<any>;
  logout: () => Promise<void>;
  setUser: (user: UserProfile) => void;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;

  // Data Fetching
  fetchUserData: () => Promise<void>;

  // Sholat
  sholatRecords: SholatRecord[];
  addSholatRecord: (record: Omit<SholatRecord, 'id'>) => Promise<void>;
  updateSholatRecord: (id: string, updates: Partial<SholatRecord>) => Promise<void>;
  getTodaySholatRecords: () => SholatRecord[];

  // Puasa
  puasaRecords: PuasaRecord[];
  addPuasaRecord: (record: Omit<PuasaRecord, 'id'>) => Promise<void>;
  updatePuasaRecord: (id: string, updates: Partial<PuasaRecord>) => Promise<void>;
  getTodayPuasa: () => PuasaRecord | null;

  // Tilawah
  tilawahRecords: TilawahRecord[];
  addTilawahRecord: (record: Omit<TilawahRecord, 'id'>) => Promise<void>;
  getTodayTilawah: () => TilawahRecord[];

  // Zakat
  zakatRecords: ZakatRecord[];
  addZakatRecord: (record: Omit<ZakatRecord, 'id'>) => Promise<void>;
  getTotalZakat: () => number;

  // Sedekah
  sedekahRecords: SedekahRecord[];
  addSedekahRecord: (record: Omit<SedekahRecord, 'id'>) => Promise<void>;
  getTotalSedekah: () => number;
  getSedekahByMonth: (year: number, month: number) => SedekahRecord[];

  // Journal
  journalEntries: JournalEntry[];
  addJournalEntry: (entry: Omit<JournalEntry, 'id'>) => Promise<void>;
  getJournalByDate: (date: string) => JournalEntry | null;

  // Chatbot (local only)
  chatHistory: ChatMessage[];
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearChatHistory: () => void;

  // Agenda
  agendaEntries: AgendaEntry[];
  addAgendaEntry: (entry: Omit<AgendaEntry, 'id'>) => Promise<void>;
  deleteAgendaEntry: (id: string) => Promise<void>;

  // Reminders (local only)
  reminderSettings: ReminderSettings;
  updateReminderSettings: (settings: Partial<ReminderSettings>) => void;
}

// --- Zustand Store ---
export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      loading: true,  // Dari Code 1: default true agar RootLayout/guard menunggu auth selesai

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

      // --- Auth & Initialization (Integrasi dari Code 1) ---
      initialize: () => {
        // Listener realtime untuk handle redirect Google & perubahan session
        supabase.auth.onAuthStateChange(async (event, session) => {
          if (session) {
            set({ isAuthenticated: true });
            await get().fetchUserData();
          } else {
            set({ isAuthenticated: false, user: null, loading: false });
          }
        });
      },

      login: async (email, password) => {
        set({ loading: true });
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) { 
          set({ loading: false }); 
          throw error; 
        }
        set({ isAuthenticated: true });
        await get().fetchUserData();
        set({ loading: false });
        return data;
      },

      loginWithGoogle: async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin
          }
        });
        if (error) throw error;
        return data;
      },

      logout: async () => {
        await supabase.auth.signOut();
        set({ 
          isAuthenticated: false, 
          user: null, 
          sholatRecords: [], 
          puasaRecords: [], 
          tilawahRecords: [], 
          journalEntries: [], 
          agendaEntries: [],
          loading: false 
        });
      },

      setUser: (user) => set({ user }),

      // --- Data Fetching (Dari Code 1: dengan try-catch & handling user Google baru) ---
      fetchUserData: async () => {
        set({ loading: true });
        try {
          const { data: { user: authUser } } = await supabase.auth.getUser();
          if (!authUser) return;

          // Ambil profil dari tabel public.profiles
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .single();

          // Ambil metadata Google
          const googleMeta = authUser.user_metadata;

          if (!profile) {
            // User baru (misal dari Google OAuth), belum ada row di profiles
            set({
              user: {
                id: authUser.id,
                email: authUser.email || '',
                name: googleMeta?.full_name || authUser.email?.split('@')[0] || 'User',
                isProfileComplete: false, // Redirect ke setup profile
              },
              loading: false
            });
          } else {
            // User sudah punya data di profiles
            set({
              user: {
                id: profile.id,
                email: profile.email,
                name: profile.name || googleMeta?.full_name,
                gender: profile.gender,
                mazhab: profile.mazhab,
                age: profile.age,
                city: profile.city,
                isProfileComplete: profile.is_profile_complete,
                createdAt: profile.created_at
              }
            });

            // Fetch data ibadah paralel
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
              puasaRecords: (puasa.data || []).map(p => ({
                id: p.id, date: p.date, completed: p.completed,
                sahurTime: p.sahur_time, sahurPhoto: p.sahur_photo_url, alasan: p.alasan
              })),
              tilawahRecords: tilawah.data || [],
              journalEntries: journal.data || [],
              agendaEntries: agenda.data || [],
              sedekahRecords: sedekah.data || [],
              zakatRecords: (zakat.data || []).map(z => ({
                ...z,
                jumlahOrang: z.jumlah_orang,
                hargaBeras: z.harga_beras,
                totalNominal: z.total_nominal,
                metodePenyaluran: z.metode_penyaluran,
                buktiUrl: z.bukti_url
              })),
              loading: false
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          set({ loading: false });
        }
      },

      updateProfile: async (profile) => {
        const userId = get().user?.id;
        if (!userId) return;

        const dbData: any = {
          email: get().user?.email  // Penting untuk upsert user baru
        };
        if (profile.name !== undefined) dbData.name = profile.name;
        if (profile.gender !== undefined) dbData.gender = profile.gender;
        if (profile.mazhab !== undefined) dbData.mazhab = profile.mazhab;
        if (profile.age !== undefined) dbData.age = profile.age;
        if (profile.city !== undefined) dbData.city = profile.city;
        if (profile.isProfileComplete !== undefined) dbData.is_profile_complete = profile.isProfileComplete;

        // Upsert: create jika belum ada, update jika sudah ada
        const { error } = await supabase
          .from('profiles')
          .upsert({ id: userId, ...dbData });

        if (error) throw error;

        // Refresh semua data
        await get().fetchUserData();
      },

      // --- Sholat ---
      addSholatRecord: async (record) => {
        const userId = get().user?.id;
        const { data, error } = await supabase.from('sholat_records').insert([{ ...record, user_id: userId }]).select();
        if (error) throw error;
        set(state => ({ sholatRecords: [...state.sholatRecords, data[0]] }));
      },

      updateSholatRecord: async (id, updates) => {
        const { error } = await supabase.from('sholat_records').update(updates).eq('id', id);
        if (error) throw error;
        set(state => ({ sholatRecords: state.sholatRecords.map(r => r.id === id ? { ...r, ...updates } : r) }));
      },

      getTodaySholatRecords: () => {
        const today = getTodayDateString();
        return get().sholatRecords.filter(r => r.date === today);
      },

      // --- Puasa ---
      addPuasaRecord: async (record) => {
        const userId = get().user?.id;
        const dbData = {
          user_id: userId,
          date: record.date,
          completed: record.completed,
          sahur_time: record.sahurTime,
          sahur_photo_url: record.sahurPhoto,
          alasan: record.alasan
        };
        const { error } = await supabase.from('puasa_records').upsert(dbData, { onConflict: 'user_id,date' });
        if (error) throw error;
        await get().fetchUserData();
      },

      updatePuasaRecord: async (id, updates) => {
        const dbUpdates: any = { ...updates };
        if (updates.sahurTime) dbUpdates.sahur_time = updates.sahurTime;
        if (updates.sahurPhoto) dbUpdates.sahur_photo_url = updates.sahurPhoto;
        const { error } = await supabase.from('puasa_records').update(dbUpdates).eq('id', id);
        if (error) throw error;
        await get().fetchUserData();
      },

      getTodayPuasa: () => {
        const today = getTodayDateString();
        const records = get().puasaRecords.filter(r => r.date === today);
        return records.length > 0 ? records[0] : null;
      },

      // --- Tilawah ---
      addTilawahRecord: async (record) => {
        const userId = get().user?.id;
        const { data, error } = await supabase.from('tilawah_records').insert([{ ...record, user_id: userId }]).select();
        if (error) throw error;
        set(state => ({ tilawahRecords: [...state.tilawahRecords, data[0]] }));
      },

      getTodayTilawah: () => {
        const today = getTodayDateString();
        return get().tilawahRecords.filter(r => r.date === today);
      },

      // --- Zakat ---
      addZakatRecord: async (record) => {
        const userId = get().user?.id;
        const dbData = {
          user_id: userId,
          date: record.date,
          time: record.time,
          jumlah_orang: record.jumlahOrang,
          harga_beras: record.hargaBeras,
          total_nominal: record.totalNominal,
          bentuk: record.bentuk,
          metode_penyaluran: record.metodePenyaluran,
          bukti_url: record.buktiUrl,
          notes: record.notes
        };
        const { error } = await supabase.from('zakat_records').insert([dbData]);
        if (error) throw error;
        await get().fetchUserData();
      },

      getTotalZakat: () => get().zakatRecords.reduce((acc, curr) => acc + Number(curr.totalNominal || 0), 0),

      // --- Sedekah ---
      addSedekahRecord: async (record) => {
        const userId = get().user?.id;
        const { error } = await supabase.from('sedekah_records').insert([{ ...record, user_id: userId }]);
        if (error) throw error;
        await get().fetchUserData();
      },

      getTotalSedekah: () => get().sedekahRecords.reduce((acc, curr) => acc + Number(curr.nominal || 0), 0),

      getSedekahByMonth: (year: number, month: number) => {
        return get().sedekahRecords.filter(record => {
          const d = new Date(record.date);
          return d.getFullYear() === year && d.getMonth() === month;
        });
      },

      // --- Journal ---
      addJournalEntry: async (entry) => {
        const userId = get().user?.id;
        const { error } = await supabase.from('journal_entries').upsert({
          user_id: userId,
          date: entry.date,
          mood: entry.mood,
          story: entry.story,
          evaluasi: entry.evaluasi,
          gratitude: entry.gratitude
        }, { onConflict: 'date' });
        if (error) throw error;
        await get().fetchUserData();
      },

      getJournalByDate: (date: string) => {
        return get().journalEntries.find(e => e.date === date) || null;
      },

      // --- Chatbot (local) ---
      addChatMessage: (message) => {
        const newMessage = {
          ...message,
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toISOString()
        };
        set(state => ({ chatHistory: [...state.chatHistory, newMessage] }));
      },

      clearChatHistory: () => set({ chatHistory: [] }),

      // --- Agenda ---
      addAgendaEntry: async (entry) => {
        const userId = get().user?.id;
        const { error } = await supabase.from('agenda_entries').insert([{ ...entry, user_id: userId }]);
        if (error) throw error;
        await get().fetchUserData();
      },

      deleteAgendaEntry: async (id) => {
        const { error } = await supabase.from('agenda_entries').delete().eq('id', id);
        if (error) throw error;
        set(state => ({ agendaEntries: state.agendaEntries.filter(e => e.id !== id) }));
      },

      // --- Reminders (local) ---
      updateReminderSettings: (settings) =>
        set(state => ({ reminderSettings: { ...state.reminderSettings, ...settings } })),
    }),
    {
      name: 'ramadhan-care-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        chatHistory: state.chatHistory,
        reminderSettings: state.reminderSettings,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);