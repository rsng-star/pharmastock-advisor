# Riwayat Prompt PharmaStock Advisor

Dokumen ini mencatat prompt yang dikirim ke **IBM Bob** selama pengembangan, beserta alasan dan dampak tiap revisi.

## Struktur Prompt: 3 Layer

| Layer | Pertanyaan yang dijawab | Isi |
|---|---|---|
| Layer 1: Role & Context | Bob berbicara ke siapa dan dalam konteks apa? | Peran, audiens, tema, batasan teknologi |
| Layer 2: Task & Requirements | Apa yang harus benar-benar dibangun? | Fitur, alur interaksi, struktur konten |
| Layer 3: Constraints & Output | Bagaimana hasil akhirnya harus terlihat dan berfungsi? | File keluaran, format, standar visual dan kode |

## Prinsip Iterasi: Targeted Refinement

Satu masalah pada hasil berarti revisi pada **satu layer saja**, bukan menulis ulang seluruh prompt.

- Fitur kurang lengkap atau salah: revisi **Layer 2**.
- Tampilan atau format kurang baik: revisi **Layer 3**.

## Ringkasan Versi

| Versi | Layer yang direvisi | Masalah yang ditemukan | Dampak |
|---|---|---|---|
| 1 | - | Prompt awal | Aplikasi berjalan dengan fitur utama lengkap |
| 2 | Layer 2 | Pertanyaan "hampir kedaluwarsa dalam 3 bulan" dijawab dengan daftar obat yang sudah kedaluwarsa | Jawaban tepat: batch yang belum kedaluwarsa dengan sisa 90 hari atau kurang |
| 3 | Layer 3 | Emoji kurang profesional dan tampil berbeda di tiap perangkat | Ikon SVG yang konsisten |
| 4 | Layer 3 dan Layer 2 | Tabel rekomendasi terpotong, belum ada favicon, belum responsif, belum ada reset | Tabel terbaca utuh, tampilan responsif, tombol reset |

---

## Versi 1: Prompt Awal

> Catatan: percobaan paling awal memakai Python CLI. Setelah ketentuan panitia menegaskan penggunaan HTML, CSS, dan JavaScript, pengembangan diulang dengan prompt di bawah ini.

```
[LAYER 1: ROLE & CONTEXT]
Act as a senior frontend engineer building "PharmaStock Advisor", an AI agent
web app for pharmacy staff (apoteker, kasir, and pemilik apotek) in Indonesia.
The agent helps manage medicine stock using the FEFO (First Expired, First Out)
principle. All interface text and agent replies must be in Bahasa Indonesia
with a professional but friendly tone.
Constraint: HTML, CSS, and vanilla JavaScript only. No frameworks, no external
libraries, no backend, no API key.

[LAYER 2: TASK & REQUIREMENTS]
Build a working AI agent web app with:
1. A chat panel where the user talks to the agent (message bubbles, input box,
   send button, quick-suggestion buttons).
2. Stock data loaded from built-in dummy data (at least 10 items, multiple
   batches each: item name, batch number, expiry date, quantity, purchase
   price, selling price). Allow the user to upload or paste CSV data too.
3. Expiry status per batch: Aman (>6 months), Waspada (3-6 months),
   Kritis (<3 months), Kedaluwarsa (already expired), computed from the
   current date.
4. FEFO order per item: which batch to sell first.
5. Recommended action for Waspada/Kritis/Kedaluwarsa batches (discount,
   return to supplier, or hold sale) with a short reason.
6. Agent logic in JavaScript: understand natural-language questions (for
   example "obat apa yang kedaluwarsa dalam 3 bulan?", "batch mana yang
   dijual dulu untuk Amoxicillin?", "buat laporan hari ini") by detecting
   intent and keywords, then answering only from the stock data.
7. A daily summary report (counts per status, total stock value, top risky
   batches).

[LAYER 3: CONSTRAINTS & OUTPUT]
- Output files: index.html, style.css, script.js.
- Show recommendations as a table (Item | Batch | Expiry | Status |
  Recommended Action).
- Never invent data that is not in the stock; if the question cannot be
  answered, say so and suggest what the user can ask.
- Clean, commented, readable code.
```

**Temuan saat pengujian:** pertanyaan "Obat apa yang hampir kedaluwarsa dalam 3 bulan?" dijawab dengan daftar batch yang *sudah* kedaluwarsa. Penyebabnya, pengecekan intent "kedaluwarsa" terjadi sebelum intent "hampir" dan "3 bulan", dan kata "hampir kedaluwarsa" mengandung kata "kedaluwarsa". Selain itu, pencocokan berbasis potongan teks berisiko salah cocok (misalnya kata pendek "ok" di dalam "stok").

**Layer yang direvisi:** Layer 2 (kebutuhan fitur kurang rinci).

---

## Versi 2: Revisi Layer 2 (Pemahaman Pertanyaan)

```
Update the existing script.js. Keep Layer 1 and Layer 3 unchanged.
Only the agent logic requirements (Layer 2) are revised as follows:

[LAYER 2: TASK & REQUIREMENTS - REVISED]
Fix and improve the agent's natural-language understanding:
1. Intent priority: check specific intents BEFORE generic ones.
   "hampir/akan/segera kedaluwarsa" and "dalam N bulan/hari/minggu" must be
   handled before the generic "sudah kedaluwarsa" intent.
2. Distinguish clearly:
   - "sudah kedaluwarsa" = batches already expired.
   - "hampir/akan kedaluwarsa dalam N bulan" = batches NOT yet expired whose
     remaining days are between 0 and N x 30. Parse N from the question
     (default 3), show remaining days, sorted by nearest expiry.
3. Use whole-word matching (word boundaries), not substring matching, so
   short words like "ok" never match inside words like "stok".
4. Quick-suggestion chips must always trigger the intended intent
   (verify each chip: Hampir kedaluwarsa, Laporan harian, Urutan FEFO,
   Sudah kedaluwarsa, Status Kritis, Nilai stok, Rekomendasi).
5. For expired batches, the recommended action must be: stop sale, quarantine
   and dispose according to procedure (or return only if the supplier
   allows). Never suggest selling them.
6. The word "hari ini" alone must not trigger the report; only report-related
   words ("laporan", "rekap", "ringkasan") should.
7. Add a small self-test function (runnable from the browser console) that
   checks these questions return the expected intent:
   - "Obat apa yang sudah kedaluwarsa?" -> expired list
   - "Obat apa yang hampir kedaluwarsa dalam 3 bulan?" -> not-yet-expired,
     within 90 days
   - "Berapa total nilai stok?" -> stock value
   - "Batch mana yang dijual dulu untuk Amoxicillin?" -> FEFO for Amoxicillin
   - "Buat laporan harian" -> report
   - "Apa rekomendasi untuk batch kritis?" -> recommendations
```

**Dampak:** pertanyaan yang sama kini menampilkan 7 batch berstatus Kritis yang belum kedaluwarsa (sisa 20 sampai 80 hari), terurut dari yang paling dekat. Pertanyaan nilai stok juga dijawab dengan tepat.

---

## Versi 3: Revisi Layer 3 (Ikon Menggantikan Emoji)

```
Update the existing index.html, style.css, and script.js.
Keep Layer 1 and Layer 2 unchanged. Only Layer 3 (visual standard) is revised:

[LAYER 3: CONSTRAINTS & OUTPUT - REVISED]
- Remove ALL emoji characters from the entire project (HTML, CSS, and every
  string in JavaScript, including agent replies, status badges,
  recommendations, report cards, greeting, chips, navigation, and alerts).
- Replace them with inline SVG icons (no external libraries, no image files).
  Create one reusable icon system: an SVG sprite or a JS helper function
  icon(name) that returns an <svg> using stroke="currentColor", so icon
  color follows the text/badge color.
- Use a consistent icon style (outline, 1.75 stroke width, rounded
  line caps) and a consistent size controlled by CSS classes.
- Suggested mapping: Aman = check-circle, Waspada = alert-triangle,
  Kritis = alert-octagon, Kedaluwarsa = x-circle or ban,
  Laporan = file-text, Stok = package, Chat = message-circle,
  Nilai stok = wallet, Rekomendasi = lightbulb, FEFO = list-ordered,
  Hampir kedaluwarsa = clock, Kirim = send, Logo = pill.
- Keep status meaning clear without color alone: every icon is accompanied
  by its text label. Decorative icons use aria-hidden="true"; icon-only
  buttons have an aria-label.
- Keep status colors (Aman green, Waspada amber, Kritis red,
  Kedaluwarsa dark gray/red) and keep layout unchanged.
- Output files remain: index.html, style.css, script.js. Clean, commented code.
```

**Dampak:** tampilan lebih profesional dan konsisten di semua perangkat; makna status tetap jelas karena ikon selalu disertai label teks.

---

## Versi 4: Perbaikan Tampilan dan Fitur Reset

```
Update the existing index.html, style.css, and script.js.
Keep Layer 1 unchanged. Do not change existing features, intent logic,
or data. Only the following refinements:

[LAYER 3: CONSTRAINTS & OUTPUT - REFINED]
1. Fix truncated tables: in chat replies, the recommendation table's reason
   column must wrap text instead of being cut off on the right. Tables wider
   than the chat bubble must scroll horizontally inside their own container,
   never clipping content.
2. Add a favicon using an inline SVG data URI (a pill icon matching the
   logo) in index.html, so the browser console shows no 404 favicon error.
3. Make the layout fully responsive for phones and tablets (width 360px to
   1024px): header navigation fits without overflow, suggestion chips wrap
   or scroll horizontally, chat bubbles use available width, tables in the
   Stok and Laporan panels scroll horizontally inside their containers, and
   touch targets are at least 44px. Verify that nothing causes horizontal
   page scroll.

[LAYER 2: TASK & REQUIREMENTS - ADDED FEATURE]
4. Add two reset controls with icons (SVG, no emoji) and text labels:
   - "Hapus percakapan": clears the chat and shows the greeting again.
   - "Reset data": restores the built-in dummy stock data (removing any
     imported CSV data) after a confirmation prompt, then refreshes the Stok
     and Laporan panels.
   Place them in an unobtrusive but visible location (for example in the
   chat panel header or the Stok panel toolbar).

Do not introduce any emoji. Keep the code commented and clean.
```

**Dampak:** informasi pada tabel terbaca utuh, aplikasi nyaman dipakai di HP dan tablet, serta demo mudah diulang.

---

## Pelajaran dari Proses Iterasi

1. Prompt yang baik bukan yang paling panjang, tetapi yang tersusun dalam lapisan yang jelas.
2. Pengujian dengan pertanyaan nyata menemukan masalah yang tidak terlihat dari tampilan saja.
3. Merevisi satu layer per masalah membuat penyebab dan dampak perubahan mudah ditelusuri.
