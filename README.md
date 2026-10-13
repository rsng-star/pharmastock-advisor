# PharmaStock Advisor

**AI Agent rekomendasi stok dan kedaluwarsa obat berbasis FEFO**, dibangun dengan IBM Bob sebagai Capstone Project pelatihan AI Agent.

> Use case: *Other* - Pharmacy Stock & Expiry Advisor

## Demo

- Demo online: `https://rsng-star.github.io/pharmastock-advisor/`
- Atau jalankan secara lokal (lihat bagian "Cara Menjalankan").

## Latar Belakang

Apotek mengelola banyak obat dengan beberapa batch yang tanggal kedaluwarsanya berbeda. Pemantauan manual memakan waktu dan mudah terlewat, sehingga obat bisa terbuang atau, lebih berbahaya, obat kedaluwarsa sampai ke pelanggan. PharmaStock Advisor membantu apoteker, kasir, dan pemilik apotek memantau stok dan mengambil keputusan lebih cepat dengan prinsip **FEFO (First Expired, First Out)**.

## Fitur

- **Chat agent berbahasa Indonesia** yang memahami pertanyaan natural, misalnya:
  - "Obat apa yang sudah kedaluwarsa?"
  - "Obat apa yang hampir kedaluwarsa dalam 3 bulan?"
  - "Batch mana yang dijual dulu untuk Amoxicillin?"
  - "Apa rekomendasi untuk batch Waspada?"
  - "Berapa total nilai stok saya?"
  - "Buat laporan harian"
- **Status kedaluwarsa per batch:**
  | Status | Kriteria |
  |---|---|
  | Aman | lebih dari 6 bulan |
  | Waspada | 3 sampai 6 bulan |
  | Kritis | kurang dari 3 bulan |
  | Kedaluwarsa | sudah melewati tanggal kedaluwarsa |
- **Urutan FEFO** per obat: batch dengan tanggal kedaluwarsa terdekat dijual lebih dulu.
- **Rekomendasi tindakan** per batch berisiko (pantau dan promosikan, diskon, retur, hentikan penjualan).
- **Tab Stok** dengan filter berdasarkan status.
- **Tab Laporan** berisi ringkasan jumlah batch per status, total nilai stok, dan daftar batch berisiko.
- **Impor data CSV** lewat unggah file atau tempel teks.
- **Data dummy relatif terhadap tanggal hari ini**, sehingga keempat status selalu muncul saat demo.

## Cara Kerja Agent

Agent berjalan sepenuhnya di browser tanpa backend dan tanpa API key. `script.js` mendeteksi *intent* dari pertanyaan pengguna (dengan prioritas intent dan pencocokan kata utuh), lalu memanggil fungsi klasifikasi status, FEFO, rekomendasi, atau laporan. Agent hanya menjawab berdasarkan data stok yang ada dan tidak mengarang data di luar stok.

## Teknologi

- HTML5
- CSS3
- JavaScript (vanilla, tanpa framework dan tanpa library eksternal)
- Ikon: SVG inline

## Struktur Project

```
pharmastock-advisor/
├── index.html    # struktur halaman (Chat, Stok, Laporan)
├── style.css     # tampilan
├── script.js     # data stok, logika agent, FEFO, laporan, impor CSV
└── README.md
```

## Cara Menjalankan

1. Unduh atau clone repository ini.
2. Buka `index.html` di browser (Chrome, Edge, atau Firefox).

Tidak perlu instalasi apa pun.

## Format CSV untuk Impor

Urutan kolom (tanggal dalam format `YYYY-MM-DD`):

```
nama,batch,kadaluarsa,qty,harga_beli,harga_jual
Amoxicillin 500 mg,AMX-2026-A,2027-03-15,100,1500,2500
```

## Proses Pengembangan dengan IBM Bob

Project dikembangkan dengan prompt 3 layer (Role & Context, Task & Requirements, Constraints & Output) dan diperbaiki lewat *targeted refinement*, yaitu satu masalah berarti satu layer yang direvisi:

| Versi | Layer yang direvisi | Tujuan |
|---|---|---|
| 1 | - | Prompt awal, menghasilkan aplikasi dengan fitur utama |
| 2 | Layer 2 (Task & Requirements) | Memperbaiki pemahaman pertanyaan agent (prioritas intent, pencocokan kata, rentang "dalam N bulan") |
| 3 | Layer 3 (Constraints & Output) | Mengganti emoji dengan ikon SVG yang konsisten dan profesional |
| 4 | Layer 3 dan Layer 2 | Tabel rekomendasi tidak lagi terpotong, favicon ditambahkan, tampilan responsif untuk HP dan tablet, serta tombol "Hapus percakapan" dan "Reset data" |
## Rencana Pengembangan

- Integrasi dengan sistem POS apotek agar data stok terbaca otomatis.
- Integrasi model bahasa (LLM) untuk pemahaman pertanyaan yang lebih bebas.
- Notifikasi otomatis untuk batch yang mendekati kedaluwarsa.
- Prediksi kebutuhan restock berdasarkan riwayat penjualan.
- Grafik dan dashboard visual untuk pemilik apotek.

## Catatan

Data stok pada project ini adalah data dummy untuk keperluan demonstrasi.