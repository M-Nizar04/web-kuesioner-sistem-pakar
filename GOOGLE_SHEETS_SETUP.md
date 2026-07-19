# Panduan Setup Database Google Sheets

Ikuti langkah ini sekali saja. Setelah selesai, setiap kuesioner yang di-submit akan otomatis masuk sebagai baris baru di Google Sheets Anda.

## 1. Buat Google Sheet baru
1. Buka https://sheets.google.com
2. Buat spreadsheet kosong baru, beri nama misalnya **"Data Kuesioner Usability"**.
3. Anda tidak perlu membuat header kolom manual — script akan membuatnya otomatis saat data pertama masuk.

## 2. Tempel kode Apps Script
1. Di Google Sheet tadi, klik menu **Extensions > Apps Script**.
2. Hapus semua kode default (`function myFunction() {}`) di editor yang terbuka.
3. Copy seluruh isi file **`Code.gs`** (yang saya buatkan) lalu paste di situ.
4. Klik ikon 💾 **Save** (atau `Ctrl+S`).

## 3. Deploy sebagai Web App
1. Klik tombol **Deploy** (kanan atas) > **New deployment**.
2. Klik ikon gerigi ⚙️ di sebelah "Select type" > pilih **Web app**.
3. Isi konfigurasi:
   - **Execute as**: `Me` (akun Anda)
   - **Who has access**: `Anyone` (supaya form bisa diakses siapa saja tanpa login Google)
4. Klik **Deploy**.
5. Google akan minta izin akses (Authorize access) — pilih akun Anda, klik **Advanced** > **Go to (nama project) (unsafe)** > **Allow**. Ini normal karena script buatan sendiri, bukan aplikasi pihak ketiga.
6. Setelah berhasil, Anda akan mendapat **Web app URL** seperti:
   ```
   https://script.google.com/macros/s/AKfycbxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/exec
   ```
   **Copy URL ini.**

## 4. Masukkan URL ke script.js
1. Buka file **`script.js`**.
2. Cari baris ini di paling atas:
   ```js
   const GOOGLE_SCRIPT_URL = "GANTI_DENGAN_URL_WEB_APP_ANDA";
   ```
3. Ganti dengan URL yang tadi Anda copy, jadi seperti:
   ```js
   const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxxxx.../exec";
   ```
4. Simpan file.

## 5. Selesai — cara pakai
- Buka `index.html` di browser (bisa langsung double-click filenya).
- Isi form, submit.
- Buka kembali Google Sheet Anda — akan muncul sheet baru bernama **"Jawaban Kuesioner"** berisi baris data yang baru masuk, lengkap dengan timestamp.

## Kalau nanti ada perubahan pada Code.gs
Setiap kali Anda mengedit `Code.gs` di Apps Script Editor, Anda **harus deploy ulang**:
- **Deploy > Manage deployments > (pilih deployment aktif) > Edit (ikon pensil) > Version: New version > Deploy.**
- URL web app-nya tetap sama, tidak perlu diganti lagi di `script.js`.

## Troubleshooting
- **"Gagal mengirim data" muncul di form** → cek apakah URL di `script.js` sudah benar dan sudah di-deploy sebagai "Anyone" access.
- **Data tidak muncul di Sheet** → buka Apps Script Editor > menu **Executions** (ikon jam) di sebelah kiri, untuk melihat log error.
- **Ingin membatasi siapa saja yang bisa isi** → Anda bisa tambahkan proteksi tambahan (misalnya kode akses) di form, tapi untuk kuesioner publik biasanya "Anyone" sudah cukup.
