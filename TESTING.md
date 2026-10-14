# Pengujian PharmaStock Advisor

Dokumen ini berisi skenario uji untuk memastikan agent menjawab dengan benar. Pengujian dilakukan secara manual di browser dengan data dummy bawaan.

> Data dummy dibuat relatif terhadap tanggal hari ini, sehingga jumlah batch dan tanggal pada hasil dapat berbeda tergantung kapan aplikasi dibuka. Yang diuji adalah **kebenaran logika**, bukan angka tetap.

## Cara Menguji

1. Buka `index.html` di browser (atau link demo GitHub Pages).
2. Ketik pertanyaan pada kotak chat (bukan klik chip) untuk menguji pemahaman kalimat.
3. Bandingkan jawaban dengan hasil yang diharapkan.
4. Buka console (F12) dan pastikan tidak ada error berwarna merah.

## A. Pemahaman Pertanyaan (Agent)

| No | Pertanyaan | Hasil yang diharapkan | Status |
|---|---|---|---|
| 1 | Obat apa yang sudah kedaluwarsa? | Hanya batch dengan tanggal kedaluwarsa yang sudah lewat, dengan keterangan "hari lalu" | Lulus |
| 2 | Obat apa yang hampir kedaluwarsa dalam 3 bulan? | Batch yang **belum** kedaluwarsa dengan sisa 90 hari atau kurang, terurut dari yang terdekat | Lulus (7 batch Kritis, sisa 20 sampai 80 hari) |
| 3 | Batch mana yang dijual dulu untuk Amoxicillin? | Tabel FEFO: batch dengan kedaluwarsa terdekat berada di peringkat 1 | Lulus (AMX-2024-A, lalu AMX-2024-B, lalu AMX-2025-A) |
| 4 | Apa rekomendasi untuk batch Waspada? | Daftar batch Waspada dengan tindakan "Pantau dan promosikan" dan sisa hari yang sesuai | Lulus (4 batch, sisa 110 sampai 170 hari) |
| 5 | Berapa total nilai stok saya? | Total nilai stok berdasarkan harga beli dan rincian per obat | Lulus |
| 6 | Buat laporan harian | Ringkasan jumlah batch per status, total nilai stok, dan batch berisiko | Lulus |
| 7 | Apa rekomendasi untuk batch kedaluwarsa? | Tindakan hentikan penjualan dan karantina, bukan sekadar retur | Lulus |
| 8 | Tampilkan obat berstatus Kritis | Daftar batch Kritis saja | Lulus |
| 9 | Pertanyaan di luar data, misalnya "Siapa presiden Indonesia?" | Agent menolak dengan sopan dan menampilkan contoh pertanyaan yang dapat diajukan | Lulus |

## B. Chip Saran

Klik setiap chip dan pastikan mengaktifkan jawaban yang sesuai.

| Chip | Hasil yang diharapkan | Status |
|---|---|---|
| Hampir kedaluwarsa | Batch belum kedaluwarsa yang segera habis masa berlakunya | Lulus |
| Laporan harian | Ringkasan laporan | Lulus |
| Urutan FEFO | Tabel urutan FEFO | Lulus |
| Sudah kedaluwarsa | Daftar batch yang sudah kedaluwarsa | Lulus |
| Status Kritis | Daftar batch Kritis | Lulus |
| Nilai stok | Total nilai stok, **bukan** daftar batch Aman | Lulus |
| Rekomendasi | Rekomendasi tindakan batch berisiko | Lulus |

## C. Data dan Panel

| No | Skenario | Hasil yang diharapkan | Status |
|---|---|---|---|
| 1 | Buka tab Stok | Semua batch tampil dengan badge status dan peringkat FEFO | Lulus |
| 2 | Filter status pada tab Stok | Tabel hanya menampilkan status yang dipilih | Lulus |
| 3 | Buka tab Laporan | Kartu ringkasan dan tabel batch berisiko tampil | Lulus |
| 4 | Impor CSV valid | Batch baru ditambahkan, muncul pesan berhasil | Lulus, dengan catatan pengisian harga_beli dengan format penulisan 50.000 hanya terbaca 50, begitu pula dengan harga jual |
| 5 | Impor CSV tidak valid | Muncul peringatan format yang benar, data tidak berubah | Lulus |
| 6 | Hapus percakapan (Versi 4) | Chat bersih dan sapaan tampil lagi | Lulus |
| 7 | Reset data (Versi 4) | Data kembali ke data dummy setelah konfirmasi | Lulus |

## D. Tampilan

| No | Skenario | Hasil yang diharapkan | Status |
|---|---|---|---|
| 1 | Tidak ada emoji di semua panel | Hanya ikon SVG | Lulus (Chat, Stok, Laporan) |
| 2 | Tabel rekomendasi di chat | Teks alasan terbaca utuh (Versi 4) | Lulus |
| 3 | Mode mobile (lebar 375 px) | Tidak ada scroll horizontal pada halaman, navigasi dan chip tertata (Versi 4) | scroll horizontal terjadi di pilihan chip, tabel stok, dan tabel laporan (tidak rapi) |
| 4 | Console browser | Tidak ada error (Versi 4 menghilangkan error favicon) | Lulus |

## E. Pengujian Ulang (Regresi) Setelah Tiap Versi

Setiap kali prompt direvisi, ulangi pertanyaan 1 sampai 5 pada bagian A untuk memastikan fitur yang sudah benar tidak rusak.

## Temuan Selama Pengembangan

| Versi | Temuan | Penyelesaian |
|---|---|---|
| 1 | Pertanyaan "hampir kedaluwarsa dalam 3 bulan" dijawab dengan daftar yang sudah kedaluwarsa | Revisi Layer 2: prioritas intent dan pembedaan "sudah" dan "akan" kedaluwarsa (Versi 2) |
| 2 | Emoji dinilai kurang profesional | Revisi Layer 3: ikon SVG (Versi 3) |
| 3 | Tabel rekomendasi terpotong, error favicon 404 di console, belum responsif | Revisi Layer 3 dan 2 (Versi 4) |

## Catatan

- Kolom "Status" yang bertuliskan "Isi hasil pengujianmu" perlu diganti dengan **Lulus** atau **Gagal** setelah kamu mengujinya sendiri. Jangan menandai Lulus untuk skenario yang belum dicoba.
- Hapus baris catatan ini sebelum dipublikasikan.
