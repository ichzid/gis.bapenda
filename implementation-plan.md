# Implementation Plan — WebGIS PBB Kabupaten Batubara

## 1. Gambaran Umum

Aplikasi **WebGIS Pajak Bumi dan Bangunan (PBB)** untuk Kabupaten Batubara, Sumatera Utara. Menampilkan peta interaktif berbasis **Leaflet.js** yang memvisualisasikan titik koordinat objek pajak masyarakat, serta menyediakan fitur manajemen data wajib pajak, laporan, dan dashboard ringkasan.

| Item | Detail |
|------|--------|
| Framework | Next.js 16 (App Router) |
| UI Template | TailAdmin (sudah terintegrasi) |
| Styling | Tailwind CSS v4 |
| Map Library | Leaflet.js + react-leaflet |
| GeoJSON Source | `JfrAziz/indonesia-district` (HDX) — `id1219_batu_bara.geojson` |
| Language | TypeScript |

---

## 2. Struktur Folder — Pemisahan App vs Template

Untuk memisahkan file menu aplikasi PBB dari file template TailAdmin, dibuat folder `pbb/` di dalam `src/app/` sebagai path segment (bukan route group). Folder template diganti nama dari `(admin)` menjadi `(template)` agar nama `admin` bisa dipakai nanti untuk halaman admin sebenarnya.

```
src/
├── app/
│   ├── (template)/               # ⬅️ HANYA template TailAdmin (tidak diubah)
│   │   ├── layout.tsx            # Layout template
│   │   ├── page.tsx              # Dashboard ecommerce template
│   │   ├── (ui-elements)/        # Alerts, Buttons, Badge, dll
│   │   └── (others-pages)/       # Blank, Calendar, Profile, Tables, Charts, Forms
│   │
│   ├── pbb/                      # ⬅️ BARU — Path segment aplikasi PBB
│   │   ├── layout.tsx            # Layout PBB (pakai ulang TemplateLayout)
│   │   ├── page.tsx              # Dashboard PBB (ringkasan)
│   │   ├── peta-pbb/
│   │   │   └── page.tsx          # Peta interaktif Leaflet + titik objek pajak + drawer detail
│   │   ├── daftar-wajib-pajak/
│   │   │   └── page.tsx          # Tabel daftar wajib pajak
│   │   └── laporan/
│   │       └── page.tsx          # Halaman laporan / rekap
│   │
│   ├── (full-width-pages)/       # Template: Sign In, Sign Up, 404
│   ├── layout.tsx                # Root layout (ThemeProvider, SidebarProvider)
│   └── globals.css               # Global styles
│
├── components/
│   ├── pbb/                      # ⬅️ BARU — Komponen khusus PBB
│   │   ├── MapView.tsx           # Komponen peta Leaflet utama
│   │   ├── TaxObjectDrawer.tsx   # Drawer detail objek pajak (slide dari kanan, full height)
│   │   ├── DashboardStats.tsx    # Card statistik ringkasan
│   │   ├── TaxpayerTable.tsx     # Tabel daftar wajib pajak
│   │   └── ReportSummary.tsx     # Komponen laporan
│   │
│   ├── header/                   # Template TailAdmin (tidak diubah)
│   ├── charts/                   # Template TailAdmin
│   ├── ui/                       # Template TailAdmin
│   ├── form/                     # Template TailAdmin
│   └── ...                       # Komponen template lainnya
│
├── data/                         # ⬅️ BARU — Static data & dummy
│   ├── geojson/
│   │   └── batubara.json         # GeoJSON Kabupaten Batubara (dari HDX/GitHub)
│   ├── dummy-tax-objects.json    # Data dummy titik objek pajak
│   └── dummy-taxpayers.json      # Data dummy wajib pajak
│
├── layout/                       # Template TailAdmin (tidak diubah)
│   ├── AppSidebar.tsx            # ⬅️ DIMODIFIKASI: tambah menu PBB
│   └── AppHeader.tsx
│
├── context/                      # Template TailAdmin
├── hooks/                        # Template TailAdmin
└── icons/                        # Template TailAdmin (tambah map-pin.svg)
```

### Prinsip Pemisahan
- Folder `(template)/` — **read-only**, hanya berisi halaman demo template TailAdmin (sebelumnya bernama `(admin)`).
- Folder `pbb/` — path segment riil (`/pbb/*`) berisi semua halaman aplikasi PBB.
- Komponen baru khusus PBB diletakkan di `components/pbb/`.
- Static data (GeoJSON, dummy) diletakkan di `data/`.
- `AppSidebar.tsx` dimodifikasi hanya untuk menambah item menu PBB.

---

## 3. Tahapan Implementasi

### Phase 1 — Setup & Dependencies
| No | Task | Detail |
|----|------|--------|
| 1.1 | Install Leaflet dependencies | `npm install leaflet react-leaflet @types/leaflet` |
| 1.2 | Import Leaflet CSS | Tambahkan `leaflet/dist/leaflet.css` di root layout atau globals.css |
| 1.3 | Download GeoJSON Batubara | Ambil dari `raw.githubusercontent.com/JfrAziz/indonesia-district/master/id12_sumatera_utara/id1219_batu_bara/id1219_batu_bara.geojson`, simpan di `src/data/geojson/batubara.geojson` |
| 1.4 | Buat struktur folder `(pbb)` | Route group + layout + halaman placeholder |

### Phase 2 — Data Dummy
| No | Task | Detail |
|----|------|--------|
| 2.1 | `dummy-tax-objects.json` | 10-15 titik koordinat acak di dalam area Kabupaten Batubara (sekitar lat: 3.16, lng: 99.52) dengan data: NOP, nama wajib pajak, alamat, luas tanah, luas bangunan, nilai PBB |
| 2.2 | `dummy-taxpayers.json` | Data wajib pajak dengan: NOP, nama, NIK, alamat, kecamatan, status pembayaran |

### Phase 3 — Komponen Peta (Peta PBB)
| No | Task | Detail |
|----|------|--------|
| 3.1 | `MapView.tsx` | Komponen utama peta Leaflet: inisialisasi peta, center ke Batubara [3.16, 99.52], zoom 11, render GeoJSON boundary kabupaten |
| 3.2 | `TaxPointMarker.tsx` | Render marker CircleMarker untuk tiap titik objek pajak, warna berdasarkan status (lunas/belum) |
| 3.3 | `TaxObjectDrawer.tsx` | **Drawer** yang muncul dari sisi kanan (slide-in, full height dari atas ke bawah) saat marker diklik. Menggunakan komponen TailAdmin (`ComponentCard`, `Badge`, `Button`, `Alert`) untuk menampilkan: NOP, nama WP, NIK, alamat, kecamatan, luas tanah/bangunan, nilai PBB, status pembayaran, dan foto objek (placeholder). Drawer memiliki animasi transisi `translate-x`, overlay backdrop semi-transparan, dan tombol close (X) di pojok kanan atas |
| 3.4 | GeoJSON styling | Boundary kabupaten dengan style: fill semi-transparan, border tebal warna primer |

### Phase 4 — Halaman Aplikasi
| No | Task | Detail |
|----|------|--------|
| 4.1 | **Dashboard** (`(pbb)/page.tsx`) | Ringkasan: total wajib pajak, total PBB terhimpun, persentase lunas, chart sederhana (pakai ApexCharts yang sudah ada) |
| 4.2 | **Peta PBB** (`(pbb)/peta-pbb/page.tsx`) | Halaman full-width peta Leaflet (GeoJSON boundary + titik objek pajak + legend). Saat marker diklik, **Drawer** (`TaxObjectDrawer`) muncul dari sisi kanan (slide-in, full height) menampilkan detail objek pajak. Saat drawer tertutup, peta mengisi seluruh area. State `selectedTaxObject` dikelola di level page dan di-pass ke `MapView` & `TaxObjectDrawer` |
| 4.3 | **Daftar Wajib Pajak** (`(pbb)/daftar-wajib-pajak/page.tsx`) | Tabel (pakai komponen Table yang sudah ada) + search + filter kecamatan |
| 4.4 | **Laporan** (`(pbb)/laporan/page.tsx`) | Rekap per kecamatan, total pemasukan, grafik |

### Phase 5 — Integrasi Sidebar
| No | Task | Detail |
|----|------|--------|
| 5.1 | Tambah menu "PBB" di `AppSidebar.tsx` | Submenu: Dashboard, Peta PBB, Daftar Wajib Pajak, Laporan |
| 5.2 | Tambah icon map/pin | Gunakan SVG icon custom atau dari koleksi yang sudah ada |
| 5.3 | Routing sidebar | Path `/pbb`, `/pbb/peta-pbb`, `/pbb/daftar-wajib-pajak`, `/pbb/laporan` |

---

## 4. Detail Teknis

### 4.1 Konfigurasi Leaflet di Next.js
```tsx
// Komponen peta harus di-load secara dinamis (no SSR) karena Leaflet butuh window
import dynamic from "next/dynamic";

const MapView = dynamic(() => import("@/components/pbb/MapView"), {
  ssr: false,
  loading: () => <div className="h-[600px] bg-gray-100 animate-pulse rounded-lg" />,
});
```

### 4.2 Koordinat Wilayah Batubara
| Item | Value |
|------|-------|
| Latitude center | ~3.16166 |
| Longitude center | ~99.52652 |
| Zoom default | 11 |
| Max bounds | sekitar [3.0, 99.3] s/d [3.3, 99.8] |

### 4.3 Format Data Dummy Objek Pajak
```json
{
  "id": 1,
  "nop": "12.19.001.001.001-0001",
  "nama_wp": "Ahmad Fauzi",
  "nik": "1219010101010001",
  "alamat": "Jl. Merdeka No. 10, Lima Puluh",
  "kecamatan": "Lima Puluh",
  "lat": 3.1685,
  "lng": 99.5312,
  "luas_tanah": 200,
  "luas_bangunan": 120,
  "nilai_pbb": 450000,
  "status": "lunas" // lunas | belum | kurang
}
```

### 4.4 Warna Status Marker
| Status | Warna |
|--------|-------|
| Lunas | Hijau (#22c55e) |
| Belum Bayar | Merah (#ef4444) |
| Kurang Bayar | Kuning (#eab308) |

### 4.5 Drawer Detail Objek Pajak (TaxObjectDrawer)

Drawer slide-in dari sisi kanan layar, **full height** (dari atas ke bawah), tampil saat user mengklik marker titik objek pajak di peta.

```
┌──────────────────────────────────────────────────────────┐
│  AppHeader                                               │
├──────────────────────────────────────────────────────────┤
│                                                          │
│                                                          │
│              PETA LEAFLET (full width)                   │
│                                                          │
│         ┌─────────────────────────────┐                  │
│         │  Legend (overlay kiri bawah) │                  │
│         └─────────────────────────────┘                  │
│                                                          │
│                                          ┌──────────────┤
│                                          │  ✕  Close    │
│                                          │              │
│                                          │  📷 Foto     │
│                                          │  (placeholder)│
│                                          │              │
│                                          │  NOP         │
│                                          │  Nama WP     │
│                                          │  NIK         │
│             OVERLAY                     │  Alamat      │
│           (backdrop)                    │  Kecamatan   │
│                                          │  Luas Tanah  │
│                                          │  Luas Bangun.│
│                                          │  Nilai PBB   │
│                                          │  Status      │
│                                          │              │
│                                          │  [Edit] [X]  │
│                                          └──────────────┤
│                                             DRAWER      │
│                                           (w-80/96,     │
│                                          full height)   │
└──────────────────────────────────────────────────────────┘
```

**Spesifikasi Drawer:**
| Properti | Value |
|----------|-------|
| Posisi | Fixed, right: 0, top: 0, bottom: 0 |
| Lebar | `w-80` (mobile) / `w-96` (desktop) |
| Height | `h-full` / `h-screen` |
| Animasi masuk | `translate-x-0` (dari `translate-x-full`) |
| Animasi keluar | `translate-x-full` |
| Durasi transisi | `transition-transform duration-300 ease-in-out` |
| Backdrop | Overlay hitam semi-transparan (`bg-black/40`), klik untuk close |
| Z-index | `z-50` |
| Scroll | `overflow-y-auto` untuk konten panjang |

**Komponen TailAdmin yang digunakan di dalam drawer:**
- `ComponentCard` — wrapper card untuk tiap section info
- `Badge` — status pembayaran (Lunas/Hijau, Belum/Merah, Kurang/Kuning)
- `Button` — tombol Edit & Tutup
- `Alert` — notifikasi jika ada tunggakan

**State Management:**
```tsx
// Di halaman Peta PBB (page.tsx)
const [selectedTaxObject, setSelectedTaxObject] = useState(null);
// null → drawer tertutup
// object → drawer terbuka dengan data tersebut

<MapView onMarkerClick={setSelectedTaxObject} />
<TaxObjectDrawer 
  data={selectedTaxObject} 
  isOpen={selectedTaxObject !== null}
  onClose={() => setSelectedTaxObject(null)} 
/>
```

---

## 5. Dependency Tambahan

```bash
npm install leaflet react-leaflet
npm install -D @types/leaflet
```

---

## 6. Catatan Penting

1. **GeoJSON sudah tersedia** di GitHub `JfrAziz/indonesia-district` — file `id1219_batu_bara.geojson` (kabupaten) + 12 file per-kecamatan. Jika file tersebut tidak bisa di-download, user akan mencarikan alternatif.
2. **Data dummy** digunakan untuk semua data pajak, karena sistem belum terhubung ke backend/database.
3. **Peta hanya menampilkan Kabupaten Batubara** — tidak menampilkan seluruh Indonesia atau Sumatera Utara. GeoJSON boundary digunakan untuk highlight area kabupaten.
4. **Sidebar template TailAdmin** tetap dipertahankan, hanya ditambah menu PBB tanpa menghapus menu template yang sudah ada.
