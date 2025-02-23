## **Grafik Populasi Indonesia 2024**
Proyek ini adalah aplikasi berbasis **Node.js + Express + SQLite + Chart.js** yang menampilkan grafik populasi di 38 provinsi Indonesia berdasarkan data terbaru.

### **Fitur**
- 📊 **Visualisasi Data**: Menampilkan populasi setiap provinsi dalam bentuk grafik batang (**bar chart**).
- 📁 **Import Data**: Mengambil data dari file **Excel (.xlsx)** dan menyimpannya ke database **SQLite**.
- 🌍 **REST API**: Menyediakan endpoint `/api/population` untuk mendapatkan data populasi.
- 📝 **Kesimpulan Data**: Menampilkan analisis singkat mengenai provinsi dengan populasi tertinggi dan terendah.

---

## **1. Instalasi**
### **📌 Prasyarat**
Pastikan Anda telah menginstal:
- [Node.js](https://nodejs.org/) (Versi terbaru disarankan)
- [NPM](https://www.npmjs.com/)
- SQLite3 (opsional, jika ingin mengecek database secara manual)

### **📥 Clone Repository**
```sh
git clone https://github.com/username/indonesia-graphic-population-2024.git
cd indonesia-graphic-population-2024
```

### **📦 Install Dependencies**
```sh
npm install
```

---

## **2. Import Data ke SQLite**
Sebelum menjalankan proyek, kita perlu mengimpor data populasi dari file **Excel** ke dalam database SQLite.

### **🔹 Menyiapkan File Excel**
- Pastikan file **jumlah-penduduk-indonesia-di-38-provinsi-(juni-2024).xlsx** ada di dalam folder **src/**.
- Pastikan kolom **Nama Data** berisi nama provinsi dan **Nilai** berisi jumlah penduduk (dalam satuan juta atau angka langsung).

### **🔹 Jalankan Import Data**
```sh
npm run import
```
Perintah ini akan:
- Membaca file **Excel** dan mengonversinya ke format yang sesuai.
- Menyimpan data ke dalam database **SQLite** (`database.sqlite`).

---

## **3. Menjalankan Proyek**
Setelah data berhasil diimpor, jalankan server dengan perintah berikut:
```sh
npm run dev
```
Jika ingin menjalankan proyek dalam mode produksi:
```sh
npm start
```

**Akses aplikasi di browser:**
```
http://localhost:3001
```

---

## **4. API Endpoint**
| Method | Endpoint | Deskripsi |
|--------|---------|-----------|
| **GET** | `/api/population` | Mengambil data populasi per provinsi dalam format JSON |

Coba akses API ini dengan browser atau **Postman**:
```
http://localhost:3001/api/population
```

**Contoh Response:**
```json
[
  {
    "province": "Jawa Barat",
    "population": 50490000
  },
  {
    "province": "Jawa Timur",
    "population": 41710000
  }
]
```

---

## **5. Struktur Folder**
```
📂 indonesia-graphic-population-2024
├── 📂 src
│   ├── 📜 server.ts          # Server utama Express
│   ├── 📜 importData.ts      # Skrip untuk mengimpor data dari Excel ke SQLite
│   ├── 📂 views
│   │   ├── 📜 index.ejs      # Tampilan utama dengan Chart.js
│   ├── 📂 public
│   │   ├── 📜 styles.css     # File CSS (opsional)
├── 📜 database.sqlite        # Database SQLite
├── 📜 package.json           # Konfigurasi proyek
├── 📜 tsconfig.json          # Konfigurasi TypeScript
└── 📜 README.md              # Dokumentasi ini
```

---

## **6. Troubleshooting**
### **🔹 `SQLITE_ERROR: no such table: population`**
Jika muncul error ini, kemungkinan data belum diimpor ke database. Jalankan:
```sh
npm run import
```

### **🔹 Grafik Tidak Muncul**
- Cek konsol browser (`F12` > Tab **Console**) untuk melihat error.
- Pastikan API `/api/population` mengembalikan data dengan benar.
- Jalankan ulang server dengan `npm run dev`.

---

## **7. Kontributor**
💡 Dibuat oleh **Refda**  
📧 Email: **muhammadrefda@gmail.com**  
🌐 Website: [muhammadrefda.xyz](https://muhammadrefda.xyz)