/* ============================================================
   ANTRIAN APP — Client Configuration
   Ubah nilai di bawah ini sesuai kebutuhan client.
   ============================================================ */

const APP_CONFIG = {

  // ── Brand ───────────────────────────────────────────────
  brand: {
    name: 'Kampung Koding',
    tagline: 'Sistem Antrian Mandiri',
    address: 'Jl. Raya Teknologi No. 2026',
    phone: '(021) 555-2026',
  },

  // ── Nomor Antrian ───────────────────────────────────────
  queue: {
    prefix: 'A',            // Prefix nomor: A-001, B-001, dll
    padStart: 3,            // Jumlah digit: 3 → 001, 4 → 0001
    maxLoket: 5,            // Jumlah loket tersedia
  },

  // ── TTS Voice ───────────────────────────────────────────
  tts: {
    lang: 'id-ID',
    rate: 0.88,             // Kecepatan bicara (0.1 - 10)
    pitch: 1.05,            // Nada tinggi (0 - 2)
    volume: 1.0,            // Volume (0 - 1)
    enabled: true,          // Aktifkan/nonaktifkan TTS
    // Template kalimat panggilan
    template: 'Perhatian. Nomor antrian {prefix} {nomor}, silakan menuju ke loket {loket}. Terima kasih.',
  },

  // ── Audio ───────────────────────────────────────────────
  audio: {
    chimeEnabled: true,     // Aktifkan suara chime sebelum TTS
    chimeVolume: 0.7,       // Volume chime (0 - 1)
    // URL suara chime (kosongkan untuk default synth)
    chimeUrl: '',
  },

  // ── Struk / Print ───────────────────────────────────────
  receipt: {
    showQR: false,          // Tampilkan QR code di struk
    qrSize: 80,             // Ukuran QR code (px)
    footer: 'Terima kasih atas kesabaran Anda',
    customNote: '',         // Catatan tambahan di struk
  },

  // ── Display Monitor ─────────────────────────────────────
  display: {
    maxRiwayat: 8,          // Maks riwayat di panel kanan
    idleMessage: 'Belum ada panggilan',
    brandVisible: true,     // Tampilkan brand di monitor
  },

  // ── PWA ─────────────────────────────────────────────────
  pwa: {
    enabled: true,
    themeColor: '#0F172A',
    backgroundColor: '#F1F5F9',
  },
};
