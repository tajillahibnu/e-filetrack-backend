# 📂 E-FileTrack  

**E-FileTrack** adalah aplikasi manajemen dokumen digital yang memungkinkan pengelolaan dokumen aktif dan arsip dengan sistem penyimpanan terorganisir. Aplikasi ini menghubungkan dokumen digital dengan rak fisik serta menerapkan sistem hak akses berbasis peran untuk memastikan keamanan data.

---

## 🚀 Fitur Utama  

✅ **Manajemen Dokumen Digital** – Simpan, cari, dan kelola dokumen dengan metadata yang jelas.  
✅ **Integrasi Rak Fisik** – Dokumen digital dikaitkan dengan lokasi penyimpanan fisik.  
✅ **Hak Akses Berjenjang** – Dokumen dilindungi dengan sistem perizinan untuk pengguna tertentu.  
✅ **Sistem Approval** – Dokumen sensitif memerlukan persetujuan sebelum dapat diakses.  
✅ **Kategori Dokumen** – Pemisahan antara dokumen aktif dan arsip.  
✅ **Lintas Divisi/Departemen** – Pengelolaan dokumen antar divisi dengan sistem pengarsipan tersentralisasi.  

---

## 🏗️ Teknologi yang Digunakan  

### 🔹 Backend  
- **NestJS** – Framework backend berbasis TypeScript  
- **Prisma ORM** – Manajemen database dengan MySQL/MariaDB  
- **JWT Authentication** – Sistem keamanan berbasis token  
- **Swagger** – Dokumentasi API  

---

## 📂 Struktur Proyek  

```
E-FileTrack/
│── prisma/      # Skema Prisma
│── src/         # Kode utama backend
│   ├── modules/ # Modul utama aplikasi (dokumen, user, auth, dsb.)
│   ├── common/  # Helper, middleware, interceptor
│   ├── main.ts  # Entry point aplikasi
│── .env         # Konfigurasi environment
│── package.json # Konfigurasi project backend
│── README.md        # Dokumentasi proyek
```

---

## ⚙️ Instalasi Backend  

### 1️⃣ Clone Repository backend
```bash
git clone https://github.com/tajillahibnu/e-filetrack-backend.git
cd E-FileTrack~backend
```

### 2️⃣ Install Dependencies  
```bash
npm install
```

### 3️⃣ Konfigurasi Environment  
Buat file `.env` berdasarkan template `.env.example` dan isi dengan konfigurasi berikut:  

```env
DATABASE_URL="mysql://user:password@localhost:3306/efiletrack"
JWT_SECRET=mySuperSecretKey
JWT_EXPIRES_IN=600s
PORT=3000
```

### 4️⃣ Setup Database  

#### 🔹 Generate Prisma Client  
```bash
npx prisma generate
```

#### 🔹 Reset Database (Opsional - Hapus semua data)  
```bash
npx prisma migrate reset
```

#### 🔹 Migrasi Database  
```bash
npx prisma migrate dev --name init
```

#### 🔹 Runing Seeder  
```bash
npx ts-node prisma/seed.ts
```

---

### 5️⃣ Jalankan Server  
```bash
npm run start:dev
```

---

## 🛠 API Documentation  

Akses API Docs melalui Swagger setelah server berjalan:  
```
http://localhost:3000/api-docs
```

---

## 📌 Kontribusi  

1. **Fork** repositori ini.  
2. **Buat branch baru** untuk fitur atau perbaikan bug.  
3. **Kirim Pull Request** setelah selesai mengembangkan.  

---

## 📜 Lisensi  

Proyek ini menggunakan lisensi **MIT**.  

> 🚀 **E-FileTrack** – Digitalisasi Dokumen dengan Keamanan Berjenjang!  
