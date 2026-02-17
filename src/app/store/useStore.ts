import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
export type Gender = 'Laki-Laki' | 'Perempuan';
export type Mazhab = 'Muhammadiyah' | 'Nu' | 'Syafi\'i' | 'Hanbali';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  gender?: Gender;
  mazhab?: Mazhab;
  age?: number;
  city?: string;
  isProfileComplete: boolean;
}

export type SholatWajib = 'subuh' | 'zuhur' | 'asar' | 'magrib' | 'isya' | 'jumat';
export type SholatSunnah = 'dhuha' | 'tarawih' | 'tahajud' | 'witir';

export interface SholatRecord {
  id: string;
  date: string;
  type: 'wajib' | 'sunnah';
  name: SholatWajib | SholatSunnah;
  completed: boolean;
  rakaat?: number;
  alasan?: string;
}

export interface PuasaRecord {
  id: string;
  date: string;
  completed: boolean;
  sahurTime?: string;
  sahurPhoto?: string;
  notes?: string;
}

export interface TilawahRecord {
  id: string;
  date: string;
  surah?: string;
  halaman?: number;
  juz?: number;
  ayat?: number;
  duration?: number;
}

export interface ZakatRecord {
  id: string;
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
  date: string;
  nominal: number;
  tujuan: string;
  kategori: string;
  notes?: string;
}

export type MoodType = 'sangat-baik' | 'baik' | 'biasa' | 'kurang-baik' | 'buruk';

export interface JournalEntry {
  id: string;
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
  timestamp: Date;
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

interface AppState {
  // Auth
  isAuthenticated: boolean;
  user: UserProfile | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  
  // Sholat
  sholatRecords: SholatRecord[];
  addSholatRecord: (record: Omit<SholatRecord, 'id'>) => void;
  updateSholatRecord: (id: string, updates: Partial<SholatRecord>) => void;
  getTodaySholatRecords: () => SholatRecord[];
  
  // Puasa
  puasaRecords: PuasaRecord[];
  addPuasaRecord: (record: Omit<PuasaRecord, 'id'>) => void;
  updatePuasaRecord: (id: string, updates: Partial<PuasaRecord>) => void;
  getTodayPuasa: () => PuasaRecord | null;
  
  // Tilawah
  tilawahRecords: TilawahRecord[];
  addTilawahRecord: (record: Omit<TilawahRecord, 'id'>) => void;
  getTodayTilawah: () => TilawahRecord[];
  
  // Zakat
  zakatRecords: ZakatRecord[];
  addZakatRecord: (record: Omit<ZakatRecord, 'id'>) => void;
  getTotalZakat: () => number;
  
  // Sedekah
  sedekahRecords: SedekahRecord[];
  addSedekahRecord: (record: Omit<SedekahRecord, 'id'>) => void;
  getTotalSedekah: () => number;
  getSedekahByMonth: (year: number, month: number) => SedekahRecord[];
  
  // Journal
  journalEntries: JournalEntry[];
  addJournalEntry: (entry: Omit<JournalEntry, 'id'>) => void;
  getJournalByDate: (date: string) => JournalEntry | null;
  
  // Chatbot
  chatHistory: ChatMessage[];
  addChatMessage: (message: Omit<ChatMessage, 'id'>) => void;
  clearChatHistory: () => void;
  
  // Reminders
  reminderSettings: ReminderSettings;
  updateReminderSettings: (settings: Partial<ReminderSettings>) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const getTodayDateString = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial Auth State
      isAuthenticated: false,
      user: null,
      
      login: async (email: string, password: string) => {
        // Mock login - in real app, this would call Supabase auth
        await new Promise(resolve => setTimeout(resolve, 500));
        const user: UserProfile = {
          id: generateId(),
          email,
          name: email.split('@')[0],
          isProfileComplete: true, // Assume complete for email login
        };
        set({ isAuthenticated: true, user });
      },
      
      loginWithGoogle: async () => {
        // Mock Google login
        await new Promise(resolve => setTimeout(resolve, 500));
        const user: UserProfile = {
          id: generateId(),
          email: 'user@gmail.com',
          name: 'User Google',
          isProfileComplete: false, // Need to complete profile
        };
        set({ isAuthenticated: true, user });
      },
      
      logout: () => {
        set({ isAuthenticated: false, user: null });
      },
      
      updateProfile: (profile: Partial<UserProfile>) => {
        set(state => ({
          user: state.user ? { ...state.user, ...profile } : null,
        }));
      },
      
      // Sholat
      sholatRecords: [],
      
      addSholatRecord: (record) => {
        set(state => ({
          sholatRecords: [...state.sholatRecords, { ...record, id: generateId() }],
        }));
      },
      
      updateSholatRecord: (id, updates) => {
        set(state => ({
          sholatRecords: state.sholatRecords.map(record =>
            record.id === id ? { ...record, ...updates } : record
          ),
        }));
      },
      
      getTodaySholatRecords: () => {
        const today = getTodayDateString();
        return get().sholatRecords.filter(record => record.date === today);
      },
      
      // Puasa
      puasaRecords: [],
      
      addPuasaRecord: (record) => {
        set(state => ({
          puasaRecords: [...state.puasaRecords, { ...record, id: generateId() }],
        }));
      },
      
      updatePuasaRecord: (id, updates) => {
        set(state => ({
          puasaRecords: state.puasaRecords.map(record =>
            record.id === id ? { ...record, ...updates } : record
          ),
        }));
      },
      
      getTodayPuasa: () => {
        const today = getTodayDateString();
        const records = get().puasaRecords.filter(record => record.date === today);
        return records.length > 0 ? records[0] : null;
      },
      
      // Tilawah
      tilawahRecords: [],
      
      addTilawahRecord: (record) => {
        set(state => ({
          tilawahRecords: [...state.tilawahRecords, { ...record, id: generateId() }],
        }));
      },
      
      getTodayTilawah: () => {
        const today = getTodayDateString();
        return get().tilawahRecords.filter(record => record.date === today);
      },
      
      // Zakat
      zakatRecords: [],
      
      addZakatRecord: (record) => {
        set(state => ({
          zakatRecords: [...state.zakatRecords, { ...record, id: generateId() }],
        }));
      },
      
      getTotalZakat: () => {
        return get().zakatRecords.reduce((total, record) => total + record.totalNominal, 0);
      },
      
      // Sedekah
      sedekahRecords: [],
      
      addSedekahRecord: (record) => {
        set(state => ({
          sedekahRecords: [...state.sedekahRecords, { ...record, id: generateId() }],
        }));
      },
      
      getTotalSedekah: () => {
        return get().sedekahRecords.reduce((total, record) => total + record.nominal, 0);
      },
      
      getSedekahByMonth: (year: number, month: number) => {
        return get().sedekahRecords.filter(record => {
          const recordDate = new Date(record.date);
          return recordDate.getFullYear() === year && recordDate.getMonth() === month;
        });
      },
      
      // Journal
      journalEntries: [],
      
      addJournalEntry: (entry) => {
        const existing = get().journalEntries.find(e => e.date === entry.date);
        if (existing) {
          // Update existing
          set(state => ({
            journalEntries: state.journalEntries.map(e =>
              e.date === entry.date ? { ...e, ...entry } : e
            ),
          }));
        } else {
          // Add new
          set(state => ({
            journalEntries: [...state.journalEntries, { ...entry, id: generateId() }],
          }));
        }
      },
      
      getJournalByDate: (date: string) => {
        return get().journalEntries.find(entry => entry.date === date) || null;
      },
      
      // Chatbot
      chatHistory: [],
      
      addChatMessage: (message) => {
        set(state => ({
          chatHistory: [...state.chatHistory, { ...message, id: generateId() }],
        }));
      },
      
      clearChatHistory: () => {
        set({ chatHistory: [] });
      },
      
      // Reminders
      reminderSettings: {
        sholatReminder: true,
        sholatTimes: ['05:00', '12:00', '15:30', '18:00', '19:30'],
        sahurReminder: true,
        sahurTime: '04:00',
        tilawahReminder: false,
        tilawahTime: '20:00',
        emailNotification: false,
      },
      
      updateReminderSettings: (settings) => {
        set(state => ({
          reminderSettings: { ...state.reminderSettings, ...settings },
        }));
      },
    }),
    {
      name: 'ramadhan-care-storage',
    }
  )
);
