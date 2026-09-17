# BAS IoT Monitoring Dashboard

Dashboard monitoring untuk Building Automation System (BAS) berbasis OPC UA dan IoT dengan integrasi Modbus TCP/IP. Aplikasi ini merupakan implementasi dari "Redesain Sistem Kontrol Terminal Utama BAS Berbasis OPC UA dan IoT", Politeknik Negeri Bandung, Lab. Perancangan.

Seluruh data yang ditampilkan saat ini adalah **data simulasi untuk pengujian**, bukan data produksi dari perangkat fisik.

## Daftar Isi

- [Fitur](#fitur)
- [Teknologi](#teknologi)
- [Persyaratan Sistem](#persyaratan-sistem)
- [Instalasi](#instalasi)
- [Menjalankan Aplikasi](#menjalankan-aplikasi)
- [Struktur Proyek](#struktur-proyek)
- [Arsitektur Sistem](#arsitektur-sistem)
- [Data Simulasi](#data-simulasi)

## Fitur

### Ringkasan (`/`)

- Empat kartu KPI dengan nilai live dan sparkline tren: laju alir IPAL, laju air bersih, suhu Zona A, dan jumlah alarm aktif.
- Kartu status tiga unit (IPAL, Air Bersih, Proteksi Kebakaran) dengan indikator pompa, katup, dan distribusi.
- Pratinjau alarm aktif dengan lencana tingkat keparahan.

### Halaman Detail (`/wwtp`, `/clean-water`, `/fire-system`)

Setiap halaman detail memakai navigasi tab:

- **Sensor**: nilai analog per register PLC beserta batas operasi, status digital per bit, dan panel kontrol (reset alarm, export CSV).
- **Tren**: grafik real-time per parameter dengan garis ambang peringatan dan kritis, dapat diekspor ke CSV.
- **Skema**: diagram skematik proses (SVG interaktif) yang menganimasikan aliran, status pompa dan katup, serta kondisi alarm mengikuti data live.
- **Alarm**: riwayat alarm spesifik unit tersebut.

Halaman Proteksi Kebakaran menampilkan banner evakuasi saat status kebakaran aktif.

### Alarm (`/alarm`)

- Ringkasan jumlah alarm kritis, peringatan, dan total.
- Filter berdasar tingkat keparahan, pengurutan kolom Sumber dan Level, dan export CSV.

### Ambang Batas (`/ambang`)

- Konfigurasi ambang peringatan dan kritis untuk pH, suhu, dan asap, lengkap dengan visualisasi rentang dan penanda posisi nilai live.
- Mode demo: perubahan tersimpan di browser saja dan belum diteruskan ke PLC.

### Aksesibilitas

- Navigasi keyboard penuh, skip link, indikator fokus yang terlihat, dan teks alternatif untuk seluruh diagram dan grafik.
- Target sentuh minimum 44px, angka tabular agar tidak bergeser, dan seluruh animasi menghormati `prefers-reduced-motion` serta dapat dijeda manual.

## Teknologi

| Lapisan | Teknologi |
|---|---|
| Framework | Next.js 14 (App Router), React 18, TypeScript |
| UI | Tailwind CSS 3, shadcn/ui (Radix Primitives), Recharts |
| Visualisasi | Canvas kustom untuk tren, SVG interaktif untuk skema proses |
| Font | Fira Sans (antarmuka), Fira Code (angka) via Google Fonts |
| Data | Hook simulasi internal (`useBASData`, interval 2 detik) |

## Persyaratan Sistem

| Perangkat Lunak | Versi Minimum |
|---|---|
| Node.js | 18.x |
| npm | 9.x |
| Peramban | Chrome, Firefox, atau Edge versi terbaru |

## Instalasi

```bash
git clone https://github.com/aldyardnsyh/Building-Automation-System.git
cd Building-Automation-System
npm install
```

## Menjalankan Aplikasi

Mode pengembangan:

```bash
npm run dev
```

Buka `http://localhost:3000` di peramban. Jika port 3000 terpakai, Next.js otomatis memakai port berikutnya (3001, 3002, dan seterusnya); periksa output terminal.

Mode produksi:

```bash
npm run build
npm start
```

Pemeriksaan tipe:

```bash
npx tsc --noEmit
```

## Struktur Proyek

```
├── package.json                  # Dependensi dan skrip npm
├── tailwind.config.js            # Token shadcn dan keluarga font
├── tsconfig.json                 # Konfigurasi TypeScript
├── next.config.js                # Konfigurasi Next.js
└── src/
    ├── app/                      # App Router
    │   ├── globals.css           # Token desain, gaya BAS, animasi mimic
    │   ├── layout.tsx            # Root layout dan font
    │   ├── global-error.tsx      # Halaman error tingkat root
    │   ├── ClientLayout.tsx      # Sidebar, drawer mobile, footer
    │   ├── page.tsx              # Ringkasan (KPI + kartu unit)
    │   ├── alarm/page.tsx        # Riwayat dan filter alarm
    │   ├── ambang/page.tsx       # Konfigurasi ambang batas
    │   ├── wwtp/page.tsx         # Detail Unit 1 (IPAL)
    │   ├── clean-water/page.tsx  # Detail Unit 2 (Air Bersih)
    │   └── fire-system/page.tsx  # Detail Unit 3 (Proteksi Kebakaran)
    ├── components/
    │   ├── ui/                   # Komponen shadcn (button, card, badge, tabs, table, ...)
    │   ├── charts/               # Sparkline Recharts
    │   ├── common/               # TrendChart, AlarmTable, PIDDiagram
    │   ├── modules/              # Modul lama per unit (tidak dipakai halaman aktif)
    │   ├── Gauge.tsx             # Gauge linear dan radial
    │   ├── StatusIndicator.tsx   # Indikator status boolean
    │   └── SystemCard.tsx        # Kartu pembungkus unit di Ringkasan
    ├── hooks/
    │   └── useBASData.ts         # Simulasi data, riwayat tren, dan alarm
    ├── lib/
    │   ├── utils.ts              # Utilitas `cn` untuk kelas CSS
    │   └── dataGenerator.ts      # Generator nilai acak
    └── types/
        └── bas.ts                # Tipe WWTPSlave, CleanWaterSlave, FireSystemSlave, BASData
```

## Arsitektur Sistem

### Hierarki Komunikasi

| Lapisan | Komponen | Protokol |
|---|---|---|
| Field | Sensor (suhu, asap, aliran, tekanan, pH) | Hardwired / Analog I/O |
| Kontrol | PLC Schneider Modicon TM221 | Modbus TCP/IP |
| Jaringan | Ethernet Switch, Router | TCP/IP, Ethernet |
| Supervisi | PC Server (Kepware OPC UA) | OPC UA |
| Gateway | Node-RED | MQTT, HTTPS, OPC UA |
| Cloud | Dashboard Ubidots, Bot Telegram | JSON, MQTT |

### Pemetaan Register PLC

#### Unit 1: IPAL (WWTP)

| Parameter | Alamat PLC | Alamat Modbus | Tipe |
|---|---|---|---|
| Laju alir | %MW100 | 40101 | Integer |
| Tekanan | %MW101 | 40102 | Integer |
| Nilai pH | %MW102 | 40103 | Integer |
| Status pompa | %MW103:X0 | Bit 0 | Boolean |
| Status katup | %MW103:X1 | Bit 1 | Boolean |

#### Unit 2: Air Bersih

| Parameter | Alamat PLC | Alamat Modbus | Tipe |
|---|---|---|---|
| Laju alir | %MW200 | 40201 | Integer |
| Tekanan | %MW201 | 40202 | Integer |
| Status distribusi | %MW203:X0 | Bit 0 | Boolean |

#### Unit 3: Proteksi Kebakaran

| Parameter | Alamat PLC | Alamat Modbus | Tipe |
|---|---|---|---|
| Suhu ruangan | %MW300 | 40301 | Integer |
| Sensor asap | %MW301 | 40302 | Integer (0-1023) |
| Status kebakaran | %MW302:X0 | Bit 0 | Boolean |

### Ambang Operasional

| Sensor | Peringatan | Kritis |
|---|---|---|
| pH IPAL | Di luar 6,0-8,5 | Di luar 6,0-8,5 |
| Suhu Zona A | 45 °C | 60 °C |
| Asap | 500 ADC | 700 ADC |

## Data Simulasi

- Nilai dibangkitkan acak di sekitar titik operasi nominal dan diperbarui tiap 2 detik.
- Alarm dibangkitkan otomatis saat nilai melewati ambang pada tabel di atas.
- Riwayat tren menyimpan maksimal 30 titik terakhir per parameter.

Untuk koneksi ke sistem nyata, integrasikan klien Modbus TCP/IP atau OPC UA pada hook `useBASData` menggantikan generator acak, dengan format data yang sama seperti tipe di `src/types/bas.ts`.
