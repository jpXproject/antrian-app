# AntrianApp

**Sistem Antrian Mandiri Berbasis Browser** — Tanpa server, tanpa database. Cukup buka browser.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/jpXproject/antrian-app)

---

## Features

- **Kiosk Mode** — Pelanggan ambil nomor antrian lewat touchscreen
- **Dashboard Loket** — Petugas panggil nomor berikutnya / ulang
- **Monitor Publik** — Layar TV besar tampilkan nomor aktif + suara TTS
- **Sinkronisasi Realtime** — Semua tab browser update instan via `localStorage`
- **Cetak Struk Thermal** — Print langsung ke printer 58mm
- **Multi-Loket** — Beberapa loket bisa aktif bersamaan tanpa konflik
- **Reset Aman** — Modal konfirmasi, bukan `alert()` browser

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | Pure HTML + CSS + JavaScript |
| State | `localStorage` (zero-server) |
| TTS | Web Speech API (`id-ID`) |
| Styling | CSS Custom Properties + Google Fonts |
| Print | `@media print` + `@page 58mm` |

> **Tidak ada framework, tidak ada build step, tidak ada dependencies.**

## Architecture

```
┌─────────────┐     localStorage      ┌─────────────────┐
│  index.html │ ◄──────────────────► │   loket.html    │
│   (Kiosk)   │   antrian_tertinggi   │   (Dashboard)   │
│             │   antrian_timestamp   │                 │
└─────────────┘                       └────────┬────────┘
                                               │
                                    panggilan_aktif
                                               │
                                               ▼
                                      ┌─────────────────┐
                                      │  display.html   │
                                      │   (Monitor)     │
                                      │  + TTS Suara    │
                                      └─────────────────┘
```

### Synchronization Flow

1. **Kiosk** cetak nomor → set `antrian_tertinggi` + `antrian_timestamp`
2. **Loket** baca counter → increment → set `panggilan_aktif` (JSON)
3. **Display** tangkap `storage` event → update nomor + animasi + suara TTS
4. **Semua tab** sync stats setiap 2-3 detik via `setInterval`

### localStorage Keys

| Key | Type | Description |
|-----|------|-------------|
| `antrian_tertinggi` | `number` | Nomor antrian terakhir yang dicetak |
| `antrian_dipanggil_global` | `number` | Nomor terakhir yang dipanggil semua loket |
| `antrian_timestamp` | `number` | Timestamp cetak (sync trigger) |
| `panggilan_aktif` | `JSON` | `{ nomor, loket, timestamp }` |

## File Structure

```
antrian-app/
├── index.html       # Kios — pelanggan ambil nomor
├── loket.html       # Dashboard — petugas panggil nomor
├── display.html     # Monitor — layar publik + suara
├── global.css       # Design system + print styles
└── README.md
```

## Quick Start

### Local Development

```bash
# Clone
git clone https://github.com/jpXproject/antrian-app.git
cd antrian-app

# Buka langsung di browser (tidak perlu server)
start index.html    # Windows
open index.html     # macOS
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Atau klik tombol **Deploy with Vercel** di atas.

> **Catatan:** Aplikasi ini zero-server. Tidak perlu SQL, tidak perlu API. Vercel cukup serve statis HTML/CSS/JS.

## Browser Requirements

| Feature | Minimum |
|---------|---------|
| `localStorage` | Semua browser modern |
| Web Speech API | Chrome 33+, Edge 14+, Safari 14.1+ |
| CSS `backdrop-filter` | Chrome 76+, Safari 9+, Edge 79+ |
| `window.print()` | Semua browser |

## Usage

### 1. Kiosk (Pelanggan)

Buka `index.html` di tablet/PC touchscreen. Tekan **AMBIL NOMOR ANTRIAN** → struk otomatis tercetak.

### 2. Dashboard Loket (Petugas)

Buka `loket.html` di PC petugas. Pilih nomor loket → klik **Panggil Berikutnya**.

### 3. Monitor Publik (TV/Layar Besar)

Buka `display.html` di browser yang terhubung ke TV. Fullscreen untuk mode monitor.

## License

MIT © jpXproject
