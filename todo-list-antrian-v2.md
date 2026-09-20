# Dokumen Spesifikasi & Todo List Agen AI
# Aplikasi Antrian Mandiri Berbasis Browser — Versi 2.0
**Author:** jpXCode | jpxcode.pages.dev  
**Stack:** Zero-Server · localStorage · Web Speech API · Pure HTML/CSS/JS  
**Folder kerja:** `C:\Users\XCODE\ANTRIAN-APP`

---

## Struktur File Proyek

```
ANTRIAN-APP/
├── index.html       ← Kios cetak nomor antrian (customer)
├── loket.html       ← Dashboard petugas / panel kendali
├── display.html     ← Monitor publik (suara + display antrian)
└── global.css       ← Stylesheet terpadu + @media print thermal
```

---

## Checklist Eksekusi Agen AI

### FASE 1 — Setup & CSS Global

- [ ] Buat file `global.css` di folder kerja
- [ ] Definisikan sistem CSS custom properties (token):
  - Warna: `--blue-600`, `--green-500`, `--red-500`, `--slate-900` s/d `--slate-50`, `--white`
  - Bayangan: `--shadow-sm`, `--shadow-md`, `--shadow-lg`
  - Border radius: `--radius`, `--radius-sm`, `--radius-xs`
- [ ] Import Google Fonts: `Inter` (400–900) + `JetBrains Mono` (700)
- [ ] Buat komponen `.btn` dengan varian: `.btn-success`, `.btn-danger`, `.btn-ghost`, `.btn-lg`, `.btn-sm`
- [ ] Buat komponen `.badge` dengan varian: `.badge-green`, `.badge-blue`, `.badge-red`, `.badge-slate`
- [ ] Buat komponen `.topbar`, `.card`, `.container`
- [ ] Buat animasi keyframes: `fadeIn`, `popBig`, `wave` (audio indicator), `pulse-dot`
- [ ] Buat komponen `.dot-live` (indikator status sistem aktif)
- [ ] Buat sistem `#toast` (notifikasi pojok kanan bawah, auto-dismiss)
- [ ] Buat selector `.mono` untuk font JetBrains Mono
- [ ] Implementasi `@media print` untuk struk thermal 58mm:
  - Sembunyikan semua elemen kecuali `#areaCetak`
  - Set `width: 58mm`, `font-family: Courier New`, `font-size: 11px`
  - Set `@page { size: 58mm auto; margin: 0; }`

---

### FASE 2 — Kios Cetak Nomor (`index.html`)

#### Struktur Halaman
- [ ] Buat `.topbar` dengan nama brand + badge status sistem aktif
- [ ] Buat `.kios-card` dengan ikon tiket, judul, subjudul, dan tombol utama
- [ ] Buat stats bar (3 kotak): Total Antrian / Sudah Dipanggil / Sisa Menunggu
- [ ] Buat display jam realtime di bagian bawah (format: nama hari, tanggal, waktu)
- [ ] Buat overlay konfirmasi (modal gelap blur) yang muncul setelah nomor digenerate
- [ ] Buat `#areaCetak` (tersembunyi di layar, hanya muncul saat print)

#### Logika JavaScript
- [ ] Fungsi `generateAntrian()`:
  - Baca `localStorage.antrian_tertinggi` → increment → simpan kembali
  - Set `localStorage.antrian_timestamp = Date.now()` (trigger sync)
  - Format nomor: `"A-" + String(n).padStart(3, '0')`
  - Inject data ke `#areaCetak` (nomor, waktu, tanggal panjang)
  - Tampilkan overlay konfirmasi dengan nomor yang didapat
  - Tunggu 150ms lalu trigger `window.print()`
  - Sembunyikan `#areaCetak` setelah print
- [ ] Fungsi `updateStats()`:
  - Baca `antrian_tertinggi` dan `antrian_dipanggil_global` dari localStorage
  - Hitung sisa = max(0, total - dipanggil)
  - Update ketiga elemen stat dengan format padStart 3 digit
  - Jalankan otomatis setiap 2 detik via `setInterval`
- [ ] Fungsi `updateClock()` → jalankan setiap 1 detik
- [ ] Fungsi `tutupOverlay()` dan `cetakUlang()`
- [ ] Event listener: klik luar area overlay → tutup overlay
- [ ] `window.addEventListener('storage')` → update stats saat ada perubahan dari tab lain

#### Template Struk `#areaCetak`
- [ ] Nama toko (bold, 13px)
- [ ] Alamat dan nomor telepon (9px)
- [ ] Garis pemisah `................................`
- [ ] Label "TIKET ANTRIAN" + tanggal cetak
- [ ] Garis pemisah
- [ ] Label "NOMOR ANDA" + nomor besar (48px bold) → elemen `#txtNomorStruk`
- [ ] Waktu cetak → elemen `#txtWaktuStruk`
- [ ] Pesan tunggu + footer terima kasih

---

### FASE 3 — Monitor Display Publik (`display.html`)

#### Struktur Halaman
- [ ] Background gelap `var(--slate-900)` — mode monitor/TV
- [ ] `.monitor-topbar` dengan brand + badge koneksi + jam
- [ ] Layout 2 kolom: panel kiri (nomor aktif) dan panel kanan (riwayat)
- [ ] Panel kiri `.panel-aktif`:
  - Label "NOMOR YANG DIPANGGIL"
  - Elemen `#viewNomor` — font JetBrains Mono, ukuran clamp 96–180px
  - Chip loket `#viewLoket` — background biru, border radius pill
  - Indikator suara `.status-suara` dengan animasi wave bar (5 batang)
- [ ] Panel kanan `.panel-riwayat`:
  - Label "Riwayat Panggilan"
  - List `#riwayatList` — maks 8 item, animasi slide-in dari kanan
  - Item pertama highlighted (panggilan terbaru)
- [ ] `.monitor-footer` — stats bar: Total / Sudah Dipanggil / Menunggu

#### Logika JavaScript
- [ ] `window.addEventListener('storage', handler)`:
  - Filter key `panggilan_aktif`
  - Parse JSON → ekstrak `nomor` dan `loket`
  - Panggil fungsi update display + animasi + suara
- [ ] Fungsi `tampilkanPanggilan(data)`:
  - Update teks `#viewNomor` dan `#viewLoket`
  - Hapus class `.animasi`, force reflow `void el.offsetWidth`, tambahkan kembali
  - Tambahkan class `.flash` ke panel → hapus setelah 800ms
  - Panggil `tambahRiwayat()` dan `panggilSuara()`
- [ ] Fungsi `tambahRiwayat(nomor, loket)`:
  - Push ke array `riwayat[]` dengan waktu lokal
  - Trim array max 8 item
  - Re-render `#riwayatList`
- [ ] Fungsi `panggilSuara(nomor, loket)`:
  - Ekstrak angka dari `"A-001"` → `parseInt("001")` → `1`
  - Bangun teks: `"Perhatian. Nomor antrian A {n}, silakan menuju ke loket {loket}. Terima kasih."`
  - Buat `SpeechSynthesisUtterance` dengan `lang: 'id-ID'`, `rate: 0.88`, `pitch: 1.05`
  - Cari voice bahasa Indonesia dari `getVoices()` dengan fallback `onvoiceschanged`
  - Set `speech.onstart` → aktifkan animasi wave + ubah label suara
  - Set `speech.onend` → nonaktifkan animasi + reset label
  - Jalankan `speechSynthesis.cancel()` lalu `speechSynthesis.speak()`
- [ ] Fungsi `updateStats()` → refresh setiap 3 detik
- [ ] Fungsi IIFE load state awal dari `localStorage.panggilan_aktif` tanpa trigger suara

---

### FASE 4 — Dashboard Petugas (`loket.html`)

#### Struktur Halaman
- [ ] `.topbar` dengan brand + badge aktif + jam
- [ ] Layout 2 kolom (grid) untuk panel utama
- [ ] Panel kiri `.panel-nomor` (background gelap):
  - Label "Sedang Dilayani"
  - Elemen `#lblNomorLoket` — font JetBrains Mono 72px bold
  - Badge loket `#lblLoketAktif`
- [ ] Panel kanan `.panel-kontrol`:
  - Select box loket (Loket 1–5) dengan label dan styling
  - Tombol "Panggil Berikutnya" (hijau, full width)
  - Tombol "Panggil Ulang" (abu-abu, full width)
  - Tombol "Reset Semua Antrian" (merah, full width)
- [ ] Stats grid 3 kolom: Total (biru) / Dipanggil (hijau) / Menunggu (kuning)
- [ ] Panel `.log-panel` full width:
  - Header dengan judul + tombol "Hapus Log"
  - List log dengan: ikon, nomor, loket, waktu
  - Max 30 item, scroll internal, animasi slide-down
- [ ] Modal konfirmasi reset (bukan `confirm()` browser):
  - Overlay blur gelap
  - Kotak modal dengan ikon ⚠️, judul, deskripsi bahaya
  - Tombol "Batal" (ghost) dan "Ya, Reset" (merah)
  - Klik luar area → tutup modal

#### Logika JavaScript
- [ ] Variabel `currentServed = 0` dan array `sessionLog = []`
- [ ] Fungsi `panggilBerikutnya()`:
  - Baca `antrian_tertinggi` dan `antrian_dipanggil_global` dari localStorage
  - Jika `dipanggilGlobal < tertinggi`: increment, simpan, set `currentServed`, panggil `eksekusiPanggilan('panggil')`
  - Jika tidak: tampilkan toast "Tidak ada antrian baru"
- [ ] Fungsi `panggilUlang()`:
  - Jika `currentServed > 0`: panggil `eksekusiPanggilan('ulang')`
  - Jika tidak: tampilkan toast peringatan
- [ ] Fungsi `eksekusiPanggilan(tipe)`:
  - Format nomor `"A-" + padStart(3,'0')`
  - Update `#lblNomorLoket` + animasi `popBig`
  - Build payload `{ nomor, loket, timestamp: Date.now() }`
  - `localStorage.setItem('panggilan_aktif', JSON.stringify(payload))` → trigger display.html
  - Panggil `addLog()` dan `updateStats()`
  - Tampilkan toast konfirmasi
- [ ] Fungsi `resetSistem()`:
  - `localStorage.clear()`
  - Reset `currentServed = 0` dan UI nomor loket
  - Set `panggilan_aktif` dengan payload reset `{ nomor: 'A-000', loket: '--', timestamp }`
  - Tambah log reset
  - Tampilkan toast konfirmasi
- [ ] Fungsi `addLog(nomor, loket, tipe)` → push ke `sessionLog[]`, re-render
- [ ] Fungsi `renderLog()` → generate HTML dari array log
- [ ] Fungsi `clearLog()` → kosongkan array + re-render
- [ ] Fungsi `bukaMOdalReset()` dan `tutupModal()`
- [ ] Event: klik luar modal → tutup modal
- [ ] Fungsi `updateLoketLabel()` → sinkronkan teks badge loket dengan select
- [ ] Fungsi `showToast(msg)` → tampilkan toast 2.8 detik
- [ ] Fungsi `updateStats()` → sinkron setiap 2 detik
- [ ] `window.addEventListener('storage', updateStats)` → sync antar tab loket

---

### FASE 5 — Validasi Akhir

#### Kios (`index.html`)
- [ ] Tombol "AMBIL NOMOR ANTRIAN" dapat diklik dan menghasilkan nomor baru
- [ ] `localStorage.antrian_tertinggi` bertambah 1 setiap klik
- [ ] Overlay muncul dengan nomor yang benar setelah klik
- [ ] Dialog print browser muncul otomatis
- [ ] Hanya area struk yang dicetak — elemen kios tidak ikut tercetak
- [ ] Stats bar memperbarui data realtime
- [ ] Overlay tertutup saat klik di luar atau tombol Tutup

#### Display Monitor (`display.html`)
- [ ] Nomor antrian berubah secara instan saat loket memanggil (tanpa refresh)
- [ ] Animasi `popBig` dan efek glow berjalan saat nomor berubah
- [ ] Suara teks berbahasa Indonesia berbunyi dengan kalimat baku
- [ ] Indikator wave bar aktif saat suara sedang berbicara
- [ ] Riwayat panggilan terakumulasi (maks 8) dengan item terbaru di atas
- [ ] Footer stats realtime sinkron dengan localStorage

#### Dashboard Loket (`loket.html`)
- [ ] "Panggil Berikutnya" menambah counter global dan membroadcast ke display.html
- [ ] "Panggil Ulang" memanggil ulang nomor terakhir tanpa menambah counter
- [ ] "Reset Semua Antrian" memunculkan modal konfirmasi, bukan `alert()`
- [ ] Log aktivitas mencatat setiap aksi dengan ikon, nomor, loket, dan waktu
- [ ] Multi-loket: dua tab `loket.html` terbuka tidak memanggil nomor yang sama
- [ ] Toast muncul setelah setiap aksi

#### Sinkronisasi Antar Tab
- [ ] Buka `index.html`, `loket.html`, dan `display.html` secara bersamaan
- [ ] Ambil nomor di `index.html` → stats di semua tab langsung update
- [ ] Panggil nomor di `loket.html` → `display.html` berubah instan + suara berbunyi
- [ ] Reset di `loket.html` → semua tab kembali ke kondisi awal

---

## Catatan Teknis Penting

| Topik | Detail |
|---|---|
| Sinkronisasi antar tab | `window.addEventListener('storage', ...)` hanya menangkap perubahan dari **tab lain**. Perubahan dari tab yang sama tidak mentrigger event ini — gunakan fungsi langsung. |
| Panggil ulang | Gunakan `timestamp: Date.now()` di payload walaupun nomor sama, agar storage event tetap terpicu di display.html. |
| TTS Chrome | `getVoices()` mengembalikan array kosong saat halaman pertama load. Gunakan `onvoiceschanged` sebagai fallback sebelum `speak()`. |
| Print thermal | `window.print()` harus dipanggil setelah `areaCetak.style.display = 'block'` dan elemen tersebut harus sudah ter-render di DOM. Beri delay minimal 150ms. |
| Multi-loket | `antrian_dipanggil_global` adalah shared counter. Semua loket baca dan increment key yang sama — jangan gunakan counter per-loket untuk menentukan nomor berikutnya. |
| Reset data | `localStorage.clear()` menghapus semua key. Setelah clear, segera set ulang `panggilan_aktif` agar display.html menerima sinyal reset. |

---

## Daftar Key localStorage

| Key | Tipe | Deskripsi |
|---|---|---|
| `antrian_tertinggi` | `number` | Counter nomor antrian terakhir yang dicetak di kios |
| `antrian_dipanggil_global` | `number` | Counter nomor terakhir yang dipanggil oleh semua loket |
| `antrian_timestamp` | `number` | Timestamp saat nomor baru dicetak (untuk sinkronisasi manual) |
| `panggilan_aktif` | `JSON string` | Payload panggilan aktif: `{ nomor, loket, timestamp }` |

---

*Dokumen ini dihasilkan dari hasil review dan upgrade aplikasi versi 1.0. Semua instruksi bersifat final dan dapat langsung dieksekusi oleh Agen AI tanpa opsi tambahan.*
