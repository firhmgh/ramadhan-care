import { useStore } from '../store/useStore';

/**
 * Seed sample data for testing and demo purposes
 * Call this function to populate the app with realistic data
 */
export function seedSampleData() {
  const store = useStore.getState();
  
  // Get today and yesterday dates
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  // Add sample sholat records for yesterday
  const sholatWajib = ['subuh', 'zuhur', 'asar', 'magrib', 'isya'];
  sholatWajib.forEach(name => {
    store.addSholatRecord({
      date: yesterday,
      type: 'wajib',
      name: name as any,
      completed: Math.random() > 0.2, // 80% completion rate
    });
  });
  
  // Add sample sunnah
  store.addSholatRecord({
    date: yesterday,
    type: 'sunnah',
    name: 'dhuha',
    completed: true,
    rakaat: 4,
  });
  
  // Add sample puasa
  store.addPuasaRecord({
    date: yesterday,
    completed: true,
    sahurTime: '04:15',
  });
  
  // Add sample tilawah
  store.addTilawahRecord({
    date: yesterday,
    surah: 'Al-Baqarah',
    halaman: 10,
  });
  
  store.addTilawahRecord({
    date: yesterday,
    surah: 'Ali Imran',
    halaman: 5,
  });
  
  // Add sample zakat
  store.addZakatRecord({
    date: yesterday,
    time: '10:30',
    jumlahOrang: 4,
    hargaBeras: 15000,
    totalNominal: 150000,
    bentuk: 'uang',
    metodePenyaluran: 'Masjid Al-Ikhlas',
    notes: 'Zakat fitrah keluarga',
  });
  
  // Add sample sedekah
  const sedekahData = [
    { nominal: 50000, tujuan: 'Masjid', kategori: 'Infaq', notes: 'Untuk renovasi' },
    { nominal: 100000, tujuan: 'Yayasan Yatim', kategori: 'Sedekah Jariyah', notes: '' },
    { nominal: 25000, tujuan: 'Fakir Miskin', kategori: 'Sedekah', notes: 'Tetangga' },
  ];
  
  sedekahData.forEach(data => {
    store.addSedekahRecord({
      date: yesterday,
      ...data,
    });
  });
  
  // Add sample journal
  store.addJournalEntry({
    date: yesterday,
    mood: 'baik',
    story: 'Alhamdulillah, hari ini saya berhasil menyelesaikan puasa dengan baik. Sahur bersama keluarga terasa sangat hangat dan penuh berkah. Sholat tarawih malam ini sangat khusyuk, dan saya merasa lebih dekat dengan Allah SWT.',
    evaluasi: 'Saya bersyukur bisa konsisten dengan ibadah hari ini. Namun, masih perlu meningkatkan konsentrasi saat sholat dan lebih banyak membaca Al-Quran.',
    gratitude: 'Terima kasih Ya Allah atas kesehatan, keluarga yang harmonis, dan rezeki yang melimpah.',
  });
  
  console.log('✅ Sample data has been seeded successfully!');
  console.log('📊 Check your Dashboard, Calendar, and other pages to see the data.');
}

/**
 * Clear all data from the store
 */
export function clearAllData() {
  localStorage.removeItem('ramadhan-care-storage');
  window.location.reload();
}
