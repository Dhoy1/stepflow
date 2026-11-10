# 🚀 Panduan Lengkap & Walkthrough: StepFlow Workflow Recorder

Selamat datang di **StepFlow**! Aplikasi ini dirancang untuk merekam alur kerja website secara otomatis, menghasilkan panduan langkah demi langkah dengan instruksi otomatis berbahasa Inggris (*English Heuristics*), dan mengekspor hasilnya ke format **Word (.docx)**, **PowerPoint (.pptx)**, **PDF (.pdf)**, serta tautan **Web Publik Interaktif** yang bisa dibuka oleh audiens dan dikolaborasikan bersama tim.

---

## 📁 File Penting & Distribusi Tim

| Item | Lokasi / Tautan | Keterangan |
| :--- | :--- | :--- |
| **Paket Ekstensi Siap Pakai** | `Record\stepflow-extension.zip` | Kirim file zip ini ke teman/tim Anda untuk di-install langsung tanpa perlu Node/Laragon. |
| **Folder Ekstensi (Source)** | `\Record\extension\dist` | Folder hasil build jika ingin load unpacked langsung di laptop Anda. |
| **Web Hub & Studio** | `http://localhost` (atau URL Vercel Anda) | Portal koleksi tutorial, viewer publik, dan Web Studio Editor. |

---

## 🎯 Panduan Langkah demi Langkah

### 1. Cara Tim Memasang Ekstensi Browser (Mudah & Cepat)

Teman atau rekan satu tim Anda **tidak memerlukan** Laragon, Node.js, atau terminal. Cukup lakukan langkah berikut:

1. Kirim file `stepflow-extension.zip` kepada rekan tim Anda.
2. Minta rekan Anda mengekstrak (*unzip*) file zip tersebut ke sembarang folder di laptopnya.
3. Buka browser **Google Chrome** atau **Microsoft Edge**.
4. Buka halaman ekstensi:
   * Chrome: ketik `chrome://extensions` di kolom URL.
   * Edge: ketik `edge://extensions` di kolom URL.
5. Di pojok kanan atas, aktifkan tombol **"Developer Mode"** (Mode Pengembang).
6. Klik tombol **"Load unpacked"** (Muat yang belum dibongkar).
7. Pilih folder hasil ekstrak tadi.
8. Selesai! Ikon StepFlow langsung muncul di toolbar browser dan siap digunakan merekam.

---

### 2. Cara Merekam Tutorial di Website

1. Buka tab baru di browser dan kunjungi website apa saja yang ingin Anda buatkan tutorialnya (misal: sistem HR, form pendaftaran, web aplikasi kantor).
2. Klik ikon ekstensi **StepFlow** di toolbar browser.
3. Pilih mode:
   * **"Mulai Rekam Alur Baru"**: Membuat rekaman tutorial dari langkah 1.
   * **"Lanjutkan Rekaman Sebelumnya"**: Menambahkan langkah baru ke panduan yang sedang dikerjakan.
4. Klik tombol oranye **"Mulai Rekam Alur"**.
5. Di bagian bawah layar website akan muncul **Floating Control Dock** berwarna gelap:
   * 🟠 **Indikator Titik Oranye**: Menunjukkan rekaman aktif dan jumlah langkah yang tercatat.
   * ⏸️ **Tombol Pause**: Untuk menjeda rekaman sementara jika Anda perlu membuka tab pribadi.
   * ✅ **Tombol Selesai**: Menghentikan perekaman dan langsung membuka Studio Editor.
   * 🗑️ **Tombol Sampah**: Membatalkan rekaman.
6. Klik elemen, tombol, atau isi formulir di website target:
   * Sistem secara cerdas menyembunyikan dock 90ms sebelum tangkapan layar diambil agar dock tidak mengotori gambar screenshot.
   * Kalimat instruksi otomatis dibuat dalam bahasa Inggris profesional (*Click on "..." button*, *Type into "..." input field*).
7. Setelah selesai, klik tombol **"Selesai"** pada dock di bawah layar.

---

### 3. Mengedit & Memanipulasi Gambar di Studio Editor (Ekstensi & Web)

Studio Editor (baik di ekstensi maupun di web) dilengkapi alat anotasi visual canggih:

* **Kotak Merah / Focus Highlight**:
  * **Ubah Ukuran (Resize)**: Klik kotak merah, tarik salah satu dari **8 titik handle** (sudut atau sisi) untuk memperbesar/memperkecil kotak sorotan.
  * **Geser Posisi (Move)**: Klik dan seret bagian dalam kotak merah untuk memindahkannya ke posisi mana saja.
  * **Hapus Kotak**: Klik tombol tong sampah merah di atas kotak, atau tekan tombol `Backspace` / `Delete` pada keyboard.
  * **Buat Kotak Baru**: Tarik mouse pada area gambar untuk membuat kotak sorotan merah baru.
* **Crop Foto (Pemotong Screenshot)**:
  * Klik tombol **Crop Foto** di atas gambar.
  * Tarik area seleksi yang ingin Anda pertahankan.
  * Klik centang hijau **Terapkan Crop** untuk memotong gambar.
  * Ingin mengembalikan foto utuh? Klik tombol **Reset Foto Asli**.
* **Menyamarkan Data Sensitif (Fitur Blur / Sensor)**:
  * Klik tombol **Buramkan Data Sensitif**.
  * Tarik mouse pada data rahasia (seperti nomor rekening, email, NIK, password) untuk memberikan efek blur sensor permanen.
* **Pilihan Kategori Tutorial**:
  * Anda dapat memilih kategori seperti: *Human Resources*, *Finance & Accounting*, *IT & Operations*, *Customer Support*, *Sales & Marketing*, atau *General SOP*.

---

### 4. Sistem Hak Akses Tim (PIN Protection)

Untuk membedakan hak akses antara **Audiens Umum** (calon pengguna) dan **Tim Editor** (pembuat/korektor panduan):

* **Audiens Umum (Calon Pengguna)**:
  * Mengakses tautan panduan langsung secara *read-only*.
  * Bebas membaca panduan dalam **Mode Gulir (Scroll)** atau **Mode Interaktif (Carousel / Walkthrough)**.
  * Bebas mengunduh file dokumen dalam format **Word (.docx)**, **PowerPoint (.pptx)**, dan **PDF (.pdf)**.
  * **Tidak dapat** mengedit gambar, mengubah teks, atau menghapus tutorial (tombol hapus disembunyikan total).
* **Tim Pembuat & Editor (Ridho & Budi)**:
  * Cukup klik tombol **"Akses Tim"** di pojok kanan atas Dashboard atau tombol **"Edit"** di halaman panduan.
  * Masukkan **PIN Tim** (Default: `1234`).
  * Setelah PIN terverifikasi:
    * Mode Tim Editor aktif permanen pada browser Anda.
    * Tombol Hapus (*Trash*) dan tombol **"Edit"** terbuka.
    * Anda dapat langsung masuk ke **Web Studio Editor** (`/guide/[id]/edit`) untuk mengoreksi teks langkah, memindahkan kotak merah, melakukan crop foto, dan menyimpan revisi ke cloud dengan satu kali klik.

> **Tips Keamanan:** Anda dapat mengubah PIN default di file `.env.local` pada server web dengan menambahkan baris:
> `NEXT_PUBLIC_EDITOR_PIN=5678`

---

### 5. Alur Kolaborasi Tim (Contoh: Ridho & Budi)

1. **Ridho Merekam Langkah Awal (1 - 10)**:
   * Ridho merekam alur di laptopnya menggunakan ekstensi browser StepFlow.
   * Setelah selesai, di Studio Editor ekstensi, Ridho mengklik **"Bagikan Link Online"**.
   * Tutorial otomatis masuk ke Web Hub terpusat (Vercel atau server bersama).
2. **Budi Mengoreksi & Melanjutkan**:
   * **Koreksi Teks & Anotasi**: Budi cukup membuka link panduan di browsernya, klik tombol **"Edit"**, masukkan PIN Tim `1234`, lalu sesuaikan foto, crop, atau perbaiki teks di Web Studio Editor. Klik **"Simpan"**.
   * **Menambahkan Langkah 11 ke Atas**: Budi membuka ekstensi StepFlow di laptopnya sendiri, memilih opsi **"Lanjutkan Rekaman Sebelumnya"**, lalu melanjutkan perekaman langkah-langkah berikutnya.
3. **Membagikan ke Audiens**:
   * Bagikan tautan web panduan (misal: `https://stepflow.vercel.app/guide/id-tutorial`) ke calon pengguna atau audiens Anda. Audiens langsung bisa belajar tanpa perlu login dan tanpa bisa merusak isi panduan.

---

### 6. Perintah Berguna (Cheatsheet)

| Kebutuhan | Perintah Terminal |
| :--- | :--- |
| **Build Ulang Ekstensi** | `cd extension && npm run build` |
| **Kemas Ulang ZIP Ekstensi** | `node scripts/package-extension.mjs` (atau zip isi `extension/dist`) |
| **Menjalankan Web App (Dev)** | `cd web && npm run dev` |
| **Build Web App untuk Produksi** | `cd web && npm run build` |
| **Menjalankan Web App (Prod)** | `cd web && npm run start` |

---

*StepFlow dikembangkan untuk menghadirkan dokumentasi alur sistem yang rapi, cepat, profesional, dan ramah kolaborasi tim.*
