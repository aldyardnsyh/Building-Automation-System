# BAS IoT Dashboard - Building Automation System

Dashboard monitoring untuk sistem Building Automation System (BAS) berbasis OPC UA dan IoT dengan integrasi Modbus TCP/IP. Proyek ini merupakan implementasi Tugas Akhir: "Redesain Sistem Kontrol Terminal Utama BAS Berbasis OPC UA dan IoT".

## 📋 Daftar Isi

- [Persyaratan Sistem](#persyaratan-sistem)
- [Instalasi](#instalasi)
- [Menjalankan Aplikasi](#menjalankan-aplikasi)
- [Struktur Folder](#struktur-folder)
- [Fitur Dashboard](#fitur-dashboard)
- [Arsitektur Sistem](#arsitektur-sistem)
- [Dokumentasi Tambahan](#dokumentasi-tambahan)

---

## 🔧 Persyaratan Sistem

| Software | Versi Minimum |
|----------|---------------|
| Node.js | 18.x atau lebih tinggi |
| npm | 9.x atau lebih tinggi |
| Browser | Chrome, Firefox, Edge (versi terbaru) |

**Catatan:** Saya merekomendasikan menggunakan VS Code sebagai editor kode.

---

## 📥 Instalasi

### Langkah 1: Clone Repository

```bash
git clone https://github.com/aldyardnsyh/Building-Automation-System.git
cd Building-Automation-System/BAS-IoT-Dashboard
```

### Langkah 2: Install Dependencies

```bash
npm install
```

Proses ini akan menginstall semua package yang diperlukan:
- Next.js 14
- React 18
- Tailwind CSS
- TypeScript
- Canvas Gauges (untuk visualisasi)

### Langkah 3: Verifikasi Installation

Pastikan tidak ada error saat installation. Jika ada error, coba:
```bash
npm install --force
```

---

## 🚀 Menjalankan Aplikasi

### Mode Development

```bash
npm run dev
```

Setelah menjalankan perintah di atas, dashboard dapat diakses di:
```
http://localhost:3000
```

### Mode Production

```bash
# Build project
npm run build

# Jalankan production server
npm start
```

### Kustomisasi Port

Jika port 3000 sudah digunakan, Next.js akan secara otomatis menggunakan port lain (3001, 3002, dst). Cek output terminal untuk melihat port yang digunakan.

---

## 📁 Struktur Folder

```
BAS-IoT-Dashboard/
├── .gitignore                    # File yang diabaikan oleh Git
├── package.json                  # Konfigurasi npm dan dependencies
├── tsconfig.json                 # Konfigurasi TypeScript
├── tailwind.config.js            # Konfigurasi Tailwind CSS
├── postcss.config.js             # Konfigurasi PostCSS
├── next.config.js                # Konfigurasi Next.js
├── next-env.d.ts                 # Type declarations untuk Next.js
│
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── globals.css           # Global styles dan custom CSS
│   │   ├── layout.tsx            # Root layout (metadata, HTML wrapper)
│   │   ├── ClientLayout.tsx      # Client-side layout (header, navigation)
│   │   ├── page.tsx              # Halaman Overview (Dashboard Utama)
│   │   │
│   │   ├── wwtp/                 # Halaman Detail WWTP
│   │   │   └── page.tsx          # Slave 1 - Waste Water Treatment Plant
│   │   │
│   │   ├── clean-water/          # Halaman Detail Clean Water
│   │   │   └── page.tsx          # Slave 2 - Clean Water Distribution
│   │   │
│   │   └── fire-system/          # Halaman Detail Fire System
│   │       └── page.tsx          # Slave 3 - Fire Protection System
│   │
│   ├── components/               # Komponen React yang dapat reuse
│   │   ├── Gauge.tsx             # Komponen gauge (linear & radial)
│   │   ├── StatusIndicator.tsx  # Indikator status ON/OFF
│   │   ├── SystemCard.tsx       # Card wrapper untuk setiap sistem
│   │   │
│   │   ├── common/              # Komponen umum (shared)
│   │   │   ├── TrendChart.tsx   # Grafik trend real-time (Canvas)
│   │   │   ├── AlarmTable.tsx   # Tabel riwayat alarm
│   │   │   └── PIDDiagram.tsx  # Diagram P&ID (SVG)
│   │   │
│   │   └── modules/             # Komponen spesifik per modul
│   │       ├── WWTPModule.tsx
│   │       ├── CleanWaterModule.tsx
│   │       └── FireSystemModule.tsx
│   │
│   ├── hooks/                    # Custom React Hooks
│   │   └── useBASData.ts        # Hook untuk generate dummy data + trend history
│   │
│   ├── lib/                      # Utility functions
│   │   └── dataGenerator.ts     # Generator data dummy
│   │
│   └── types/                    # TypeScript type definitions
│       └── bas.ts               # Tipe data untuk BAS (WWTPSlave, CleanWaterSlave, dll)
│
└── public/                       # Static assets (jika ada)
```

---

## 🎯 Fitur Dashboard

### 1. Halaman Overview (`/`)
- **Quick Stats**: Total Slave, Sensor Aktif, Alarm Aktif, Status Sistem
- **System Cards**: Ringkasan singkat WWTP, Clean Water, Fire System
- **Alarm Summary**: Daftar alarm aktif terbaru

### 2. Halaman Detail WWTP (`/wwtp`)
- **Analog Sensors**: Flow Rate, Pressure, pH Level dengan register address
- **Digital Status**: Status Pompa dan Katup
- **Trend Charts**: Grafik real-time untuk setiap parameter
- **Alarm Table**: Riwayat alarm untuk WWTP
- **P&ID Diagram**: Schematic proses pengolahan air limbah

### 3. Halaman Detail Clean Water (`/clean-water`)
- **Analog Sensors**: Flow Rate, Pressure
- **Digital Status**: Distribution Status
- **Trend Charts**: Monitoring debit dan tekanan
- **P&ID Diagram**: Schematic distribusi air bersih

### 4. Halaman Detail Fire System (`/fire-system`)
- **Analog Sensors**: Room Temperature, Smoke Level
- **Digital Status**: Fire Alarm Status
- **Trend Charts**: Monitoring suhu dan asap dengan threshold warning/critical
- **Fire Alert Banner**: Tampilan khusus saat fire alarm aktif
- **P&ID Diagram**: Schematic sistem proteksi kebakaran

---

## 🏗️ Arsitektur Sistem

### Hierarki Komunikasi (sesuai Draft Proposal)

| Layer | Komponen | Protokol |
|-------|----------|----------|
| Field Level | Sensor (MQ-2, PIR, PZEM-004T, Suhu) | Hardwired/Analog I/O |
| Control Level | PLC Schneider Modicon TM221 | Modbus TCP/IP |
| Network Level | Ethernet Switch, Router | TCP/IP, Ethernet |
| Supervisory Level | PC Server (Kepware OPC UA) | OPC UA, SuiteLink |
| Gateway Level | Node-RED | MQTT, HTTPS, OPC UA |
| Cloud Level | Ubidots Dashboard, Telegram Bot | JSON, MQTT |

### Pemetaan Register PLC

#### Slave 1: WWTP
| Parameter | Alamat PLC | Alamat Modbus | Tipe |
|-----------|------------|---------------|------|
| Laju Alir Air | %MW100 | 40101 | Integer |
| Tekanan Pipa | %MW101 | 40102 | Integer |
| Nilai pH Air | %MW102 | 40103 | Integer |
| Status Pompa | %MW103:X0 | 40104 bit 0 | Boolean |
| Status Katup | %MW103:X1 | 40104 bit 1 | Boolean |

#### Slave 2: Clean Water
| Parameter | Alamat PLC | Alamat Modbus | Tipe |
|-----------|------------|---------------|------|
| Laju Alir | %MW200 | 40201 | Integer |
| Tekanan | %MW201 | 40202 | Integer |
| Status Distribusi | %MW203:X0 | 40204 bit 0 | Boolean |

#### Slave 3: Fire System
| Parameter | Alamat PLC | Alamat Modbus | Tipe |
|-----------|------------|---------------|------|
| Suhu Ruangan | %MW300 | 40301 | Integer |
| Sensor Asap | %MW301 | 40302 | Integer |
| Status Kebakaran | %MW302:X0 | 40304 bit 0 | Boolean |

---

## 📝 Catatan Pengembangan

### Dummy Data
- Sistem saat ini menggunakan data dummy yang di-generate secara otomatis
- Data di-update setiap 2 detik
- Alarm secara otomatis dihasilkan jika nilai melebihi threshold

### Koneksi Real
Untuk menghubungkan dengan sistem nyata:
1. **PLC**: Konfigurasi IP PLC di Node-RED
2. **OPC UA**: Setup Kepware dengan driver Modbus TCP/IP
3. **Cloud**: Konfigurasi Ubidots token dan Telegram Bot API

### Teknologi yang Digunakan
- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS (White mode)
- **Charts**: Canvas Gauges, Custom SVG
- **Icons**: Emoji-based (untuk kesederhanaan)

---

## 📄 License

Proyek ini dikembangkan untuk Tugas Akhir Politeknik Negeri Bandung.

---

## 👨‍🎓 Informasi Tugas Akhir

- **Judul**: Redesain Sistem Kontrol Terminal Utama BAS Berbasis OPC UA dan IoT
- **Institusi**: Politeknik Negeri Bandung - Lab. Perancangan
- **Protokol**: OPC UA, Modbus TCP/IP, MQTT

---

Dibuat dengan ❤️ untuk mendukung pengembangan sistem Building Automation yang modern dan terintegrasi.