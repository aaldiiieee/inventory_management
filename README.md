# 📦 Inventory Management Dashboard

Dashboard web sederhana untuk menampilkan data inventaris produk secara real-time dari database **Supabase (PostgreSQL)**. Dibuat sebagai solusi MVP untuk digitalisasi tracking inventaris tim warehouse.

![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)

---

## 🚀 Fitur

- **Real-time data** — Menampilkan data produk langsung dari database Supabase
- **Statistik ringkas** — Total produk, total stok, dan timestamp terakhir update
- **Status indikator** — Badge otomatis (In Stock / Low Stock / Out of Stock)
- **Responsive design** — Tampilan optimal di desktop, tablet, dan mobile
- **Refresh data** — Tombol refresh untuk memuat ulang data tanpa reload halaman
- **Konfigurasi mudah** — Modal input otomatis muncul jika kredensial belum diatur
- **Tanpa build tools** — Cukup buka `index.html` di browser

---

## 📁 Struktur Proyek

```
inventory-dashboard/
├── index.html              # Halaman utama dashboard
├── config/
│   └── supabase.js         # Konfigurasi Supabase URL & API Key
├── css/
│   └── styles.css          # Seluruh styling (CSS Variables, responsive)
├── js/
│   ├── helpers.js          # Kumpulan fungsi prosedural
│   └── app.js              # Logika aplikasi (fetch, render, event handling)
├── database/
│   └── schema.sql          # SQL schema & seed data untuk Supabase
└── README.md               # Dokumentasi proyek
```

### Penjelasan Singkat

| File | Deskripsi |
|------|-----------|
| `index.html` | Struktur HTML dashboard dengan sidebar, header, stat cards, dan tabel produk. Menggunakan pendekatan semantic HTML. |
| `css/styles.css` | Styling menggunakan CSS Variables untuk konsistensi tema, CSS Grid untuk layout stats, dan media queries untuk responsivitas. |
| `js/config.js` | File konfigurasi terpisah untuk Supabase credentials. Bisa diisi langsung atau melalui modal UI. |
| `js/app.js` | Core logic aplikasi: inisialisasi Supabase client, fetch data dari tabel `products`, render tabel & stats, serta error handling. |
| `database/schema.sql` | SQL untuk membuat tabel `products` dan seed data awal. Termasuk Row Level Security policy. |

---

## ⚙️ Cara Menjalankan

### Prasyarat

- Akun [Supabase](https://supabase.com) (gratis)
- Browser modern (Chrome, Firefox, Edge, Safari)

### Langkah-langkah

#### 1. Setup Database di Supabase

1. Buat project baru di [supabase.com](https://supabase.com)
2. Buka **SQL Editor** di dashboard Supabase
3. Copy-paste isi file `database/schema.sql` dan jalankan (Run)
4. Pastikan tabel `products` sudah muncul di **Table Editor** dengan 3 baris data

#### 2. Ambil Kredensial API

1. Di Supabase Dashboard, buka **Settings → API**
2. Catat **Project URL** (contoh: `https://abcdefghij.supabase.co`)
3. Catat **anon public key** (dimulai dengan `eyJhbGciOi...`)

#### 3. Konfigurasi Aplikasi

**Edit file config (direkomendasikan):**

Buka `js/config.js` dan isi kredensial:

```javascript
const SUPABASE_CONFIG = {
  url: "https://your-project-id.supabase.co",
  key: "your-anon-public-key",
};
```

#### 4. Jalankan Aplikasi

Cukup buka file `index.html` di browser. Tidak perlu server, build tools, atau instalasi tambahan.

> **Tips:** Jika menggunakan VS Code, install extension [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) dan klik kanan `index.html` → "Open with Live Server" untuk pengalaman development yang lebih baik.

---

## 🛠️ Teknologi

| Teknologi | Kegunaan |
|-----------|----------|
| **HTML5** | Struktur halaman |
| **CSS3** | Styling, layout (Grid, Flexbox), animasi, responsive design |
| **Vanilla JavaScript** | Logika aplikasi, DOM manipulation, fetch API |
| **Supabase JS Client** | Koneksi ke database PostgreSQL (via CDN) |
| **Google Fonts** | Typography (Plus Jakarta Sans) |

---

## 🤖 Penggunaan AI Tools

Proyek ini dikembangkan dengan bantuan **Claude AI (Anthropic)** untuk:

- **Brainstorming** - Ide flow algoritma 
- **Code review** — Validasi best practices untuk koneksi Supabase dan error handling
- **CSS styling** — Referensi untuk design system (CSS Variables, color palette, spacing)
- **Dokumentasi** — Penyusunan README.md

Seluruh kode telah di-review, disesuaikan, dan di-test secara manual.

---