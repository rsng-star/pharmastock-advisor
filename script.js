/* ============================================================
   PharmaStock Advisor — script.js
   Agent logic, stock data, FEFO, expiry status, report.
   Bahasa Indonesia UI. Vanilla JS only.
   ============================================================ */

'use strict';

/* ============================================================
   1. BUILT-IN DUMMY STOCK DATA
   Fields: id, nama, batch, kadaluarsa (ISO date string),
           qty, hargaBeli, hargaJual
   ============================================================ */

/**
 * Returns today's date then offsets by `days` to make dummy data
 * always relative to "today" so the expiry status stays meaningful.
 * @param {number} days - positive = future, negative = past
 */
function offsetDate(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0]; // YYYY-MM-DD
}

let stockData = [
  // ── Amoxicillin 500 mg ──
  { id: 1,  nama: 'Amoxicillin 500 mg', batch: 'AMX-2024-A', kadaluarsa: offsetDate(20),   qty: 80,  hargaBeli: 1500,  hargaJual: 2500  },
  { id: 2,  nama: 'Amoxicillin 500 mg', batch: 'AMX-2024-B', kadaluarsa: offsetDate(120),  qty: 200, hargaBeli: 1500,  hargaJual: 2500  },
  { id: 3,  nama: 'Amoxicillin 500 mg', batch: 'AMX-2025-A', kadaluarsa: offsetDate(400),  qty: 300, hargaBeli: 1550,  hargaJual: 2600  },

  // ── Paracetamol 500 mg ──
  { id: 4,  nama: 'Paracetamol 500 mg', batch: 'PCT-2023-Z', kadaluarsa: offsetDate(-15),  qty: 30,  hargaBeli: 500,   hargaJual: 900   },
  { id: 5,  nama: 'Paracetamol 500 mg', batch: 'PCT-2024-A', kadaluarsa: offsetDate(60),   qty: 150, hargaBeli: 500,   hargaJual: 900   },
  { id: 6,  nama: 'Paracetamol 500 mg', batch: 'PCT-2024-B', kadaluarsa: offsetDate(250),  qty: 200, hargaBeli: 520,   hargaJual: 950   },

  // ── Omeprazole 20 mg ──
  { id: 7,  nama: 'Omeprazole 20 mg',   batch: 'OMP-2024-A', kadaluarsa: offsetDate(45),   qty: 60,  hargaBeli: 3000,  hargaJual: 5000  },
  { id: 8,  nama: 'Omeprazole 20 mg',   batch: 'OMP-2024-B', kadaluarsa: offsetDate(300),  qty: 120, hargaBeli: 3100,  hargaJual: 5200  },

  // ── Cetirizine 10 mg ──
  { id: 9,  nama: 'Cetirizine 10 mg',   batch: 'CTZ-2024-A', kadaluarsa: offsetDate(-5),   qty: 20,  hargaBeli: 1200,  hargaJual: 2000  },
  { id: 10, nama: 'Cetirizine 10 mg',   batch: 'CTZ-2024-B', kadaluarsa: offsetDate(80),   qty: 100, hargaBeli: 1200,  hargaJual: 2000  },
  { id: 11, nama: 'Cetirizine 10 mg',   batch: 'CTZ-2025-A', kadaluarsa: offsetDate(380),  qty: 150, hargaBeli: 1250,  hargaJual: 2100  },

  // ── Metformin 500 mg ──
  { id: 12, nama: 'Metformin 500 mg',   batch: 'MTF-2024-A', kadaluarsa: offsetDate(75),   qty: 90,  hargaBeli: 2000,  hargaJual: 3500  },
  { id: 13, nama: 'Metformin 500 mg',   batch: 'MTF-2024-B', kadaluarsa: offsetDate(210),  qty: 180, hargaBeli: 2000,  hargaJual: 3500  },

  // ── Vitamin C 500 mg ──
  { id: 14, nama: 'Vitamin C 500 mg',   batch: 'VTC-2024-A', kadaluarsa: offsetDate(50),   qty: 200, hargaBeli: 800,   hargaJual: 1500  },
  { id: 15, nama: 'Vitamin C 500 mg',   batch: 'VTC-2025-A', kadaluarsa: offsetDate(365),  qty: 400, hargaBeli: 820,   hargaJual: 1550  },

  // ── Ibuprofen 400 mg ──
  { id: 16, nama: 'Ibuprofen 400 mg',   batch: 'IBP-2024-A', kadaluarsa: offsetDate(-30),  qty: 50,  hargaBeli: 1800,  hargaJual: 3000  },
  { id: 17, nama: 'Ibuprofen 400 mg',   batch: 'IBP-2024-B', kadaluarsa: offsetDate(110),  qty: 100, hargaBeli: 1800,  hargaJual: 3000  },

  // ── Antasida Tablet ──
  { id: 18, nama: 'Antasida Tablet',    batch: 'ANT-2024-A', kadaluarsa: offsetDate(140),  qty: 70,  hargaBeli: 600,   hargaJual: 1200  },
  { id: 19, nama: 'Antasida Tablet',    batch: 'ANT-2025-A', kadaluarsa: offsetDate(500),  qty: 150, hargaBeli: 620,   hargaJual: 1250  },

  // ── Amlodipine 5 mg ──
  { id: 20, nama: 'Amlodipine 5 mg',    batch: 'AML-2024-A', kadaluarsa: offsetDate(55),   qty: 40,  hargaBeli: 4000,  hargaJual: 7000  },
  { id: 21, nama: 'Amlodipine 5 mg',    batch: 'AML-2025-A', kadaluarsa: offsetDate(550),  qty: 120, hargaBeli: 4100,  hargaJual: 7200  },

  // ── Salbutamol Inhaler ──
  { id: 22, nama: 'Salbutamol Inhaler', batch: 'SLB-2024-A', kadaluarsa: offsetDate(170),  qty: 25,  hargaBeli: 45000, hargaJual: 65000 },
  { id: 23, nama: 'Salbutamol Inhaler', batch: 'SLB-2024-B', kadaluarsa: offsetDate(450),  qty: 30,  hargaBeli: 46000, hargaJual: 66000 },
];

/* ============================================================
   2. ICON HELPER
   Produces an inline <svg> that references the sprite in index.html.
   All icons use stroke="currentColor" so color follows the parent element.
   Pass aria-hidden by default (decorative); caller adds aria-label to the
   parent button/element when needed for screen readers.
   ============================================================ */

/**
 * Return an SVG <use> string for a named icon from the sprite.
 * @param {string} name  - icon symbol id without the "icon-" prefix
 * @param {string} [cls] - extra CSS class, e.g. "icon-sm"
 * @returns {string} HTML string
 */
function icon(name, cls) {
  const classes = ['icon', cls].filter(Boolean).join(' ');
  return `<svg class="${classes}" aria-hidden="true"><use href="#icon-${name}"></use></svg>`;
}

/* ============================================================
   3. UTILITY FUNCTIONS
   ============================================================ */

/** Format ISO date string to DD/MM/YYYY for display. */
function fmtDate(iso) {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

/** Format number as Rupiah currency string. */
function fmtRupiah(n) {
  return 'Rp ' + Number(n).toLocaleString('id-ID');
}

/** Days from today until an ISO date string (negative = already past). */
function daysUntil(iso) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const exp   = new Date(iso); exp.setHours(0, 0, 0, 0);
  return Math.round((exp - today) / 86_400_000);
}

/**
 * Determine expiry status for a batch.
 * @returns {'Aman'|'Waspada'|'Kritis'|'Kedaluwarsa'}
 */
function getStatus(iso) {
  const d = daysUntil(iso);
  if (d < 0)   return 'Kedaluwarsa';
  if (d < 90)  return 'Kritis';   // < 3 months
  if (d < 180) return 'Waspada';  // 3–6 months
  return 'Aman';                   // > 6 months
}

/**
 * Return CSS class suffix for a status string.
 */
function statusClass(status) {
  const map = {
    'Aman': 'aman',
    'Waspada': 'waspada',
    'Kritis': 'kritis',
    'Kedaluwarsa': 'kedaluwarsa',
  };
  return map[status] || 'aman';
}

/**
 * Render a status <span> badge with an inline SVG icon.
 * Icon + text together convey status without relying on color alone.
 */
function badgeHtml(status) {
  const iconMap = {
    Aman:        'check-circle',
    Waspada:     'alert-triangle',
    Kritis:      'alert-octagon',
    Kedaluwarsa: 'x-circle',
  };
  const ic = iconMap[status] ? icon(iconMap[status], 'icon-sm') : '';
  return `<span class="status-badge badge-${statusClass(status)}">${ic} ${status}</span>`;
}

/* ============================================================
   3. FEFO — compute per-item sell order
   Sort batches of the same item by kadaluarsa ascending.
   Returns the full array annotated with `fefoRank`.
   ============================================================ */
function computeFEFO(data) {
  // Group by normalised item name
  const groups = {};
  data.forEach(item => {
    const key = item.nama.toLowerCase();
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  });

  // Sort each group by expiry date, assign rank
  const ranked = [];
  Object.values(groups).forEach(group => {
    const sorted = [...group].sort((a, b) => new Date(a.kadaluarsa) - new Date(b.kadaluarsa));
    sorted.forEach((item, idx) => {
      ranked.push({ ...item, fefoRank: idx + 1 });
    });
  });
  return ranked;
}

/* ============================================================
   4. RECOMMENDED ACTIONS for risky batches
   ============================================================ */
function getRecommendation(item) {
  const status = getStatus(item.kadaluarsa);
  const days   = daysUntil(item.kadaluarsa);

  if (status === 'Kedaluwarsa') {
    return {
      action: `${icon('ban', 'icon-sm')} Hentikan Penjualan — Karantina &amp; Musnahkan`,
      reason: `Batch ${item.batch} telah kedaluwarsa ${Math.abs(days)} hari yang lalu. ` +
              `Dilarang dijual. Karantina segera, lakukan pemusnahan sesuai prosedur apotek, ` +
              `atau retur ke distributor hanya jika ada perjanjian retur yang berlaku.`
    };
  }
  if (status === 'Kritis') {
    if (days < 30) {
      return {
        action: `${icon('refresh-cw', 'icon-sm')} Retur ke Distributor`,
        reason: `Sisa ${days} hari. Kemungkinan tidak habis terjual; retur sebelum terlambat.`
      };
    }
    return {
      action: `${icon('tag', 'icon-sm')} Diskon Penjualan`,
      reason: `Sisa ${days} hari. Berikan diskon 10–20% untuk mempercepat penjualan (FEFO prioritas #1).`
    };
  }
  if (status === 'Waspada') {
    return {
      action: `${icon('eye', 'icon-sm')} Pantau &amp; Promosikan`,
      reason: `Sisa ${days} hari. Utamakan batch ini dalam penjualan; pertimbangkan bundling atau promosi.`
    };
  }
  return { action: `${icon('box', 'icon-sm')} Normal`, reason: 'Stok dalam kondisi aman.' };
}

/* ============================================================
   5. STOCK TABLE RENDERING
   ============================================================ */

const stockTableBody = document.getElementById('stockTableBody');
const stockFilter    = document.getElementById('stockFilter');

function renderStockTable(filter = 'all') {
  const annotated = computeFEFO(stockData);
  const filtered  = filter === 'all'
    ? annotated
    : annotated.filter(item => getStatus(item.kadaluarsa) === filter);

  if (filtered.length === 0) {
    stockTableBody.innerHTML = `
      <tr><td colspan="9" class="empty-state">
        <div class="es-icon">${icon('inbox', 'icon-lg')}</div>
        Tidak ada data untuk filter yang dipilih.
      </td></tr>`;
    return;
  }

  stockTableBody.innerHTML = filtered.map(item => {
    const status    = getStatus(item.kadaluarsa);
    const nilaiStok = item.qty * item.hargaBeli;
    const rankClass = item.fefoRank <= 2 ? `fefo-${item.fefoRank}` : '';
    return `
      <tr>
        <td><strong>${escHtml(item.nama)}</strong></td>
        <td><code>${escHtml(item.batch)}</code></td>
        <td>${fmtDate(item.kadaluarsa)}</td>
        <td>${item.qty.toLocaleString('id-ID')}</td>
        <td>${fmtRupiah(item.hargaBeli)}</td>
        <td>${fmtRupiah(item.hargaJual)}</td>
        <td>${fmtRupiah(nilaiStok)}</td>
        <td>${badgeHtml(status)}</td>
        <td><span class="fefo-badge ${rankClass}" title="FEFO rank untuk ${escHtml(item.nama)}">${item.fefoRank}</span></td>
      </tr>`;
  }).join('');
}

/* ============================================================
   6. REPORT GENERATION
   ============================================================ */

function generateReport() {
  const annotated = computeFEFO(stockData);

  // Count per status
  const counts = { Aman: 0, Waspada: 0, Kritis: 0, Kedaluwarsa: 0 };
  let totalNilai = 0;

  annotated.forEach(item => {
    const s = getStatus(item.kadaluarsa);
    counts[s]++;
    totalNilai += item.qty * item.hargaBeli;
  });

  // Risky batches: Waspada, Kritis, Kedaluwarsa — sorted worst-first
  const statusOrder = { Kedaluwarsa: 0, Kritis: 1, Waspada: 2 };
  const risky = annotated
    .filter(i => getStatus(i.kadaluarsa) !== 'Aman')
    .sort((a, b) => {
      const sa = statusOrder[getStatus(a.kadaluarsa)] ?? 9;
      const sb = statusOrder[getStatus(b.kadaluarsa)] ?? 9;
      return sa !== sb ? sa - sb : new Date(a.kadaluarsa) - new Date(b.kadaluarsa);
    });

  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  // Build stat cards HTML
  const statCards = `
    <div class="stat-grid">
      <div class="stat-card s-total">
        <div class="stat-label">${icon('layers', 'icon-sm')} Total Batch</div>
        <div class="stat-value">${annotated.length}</div>
      </div>
      <div class="stat-card s-aman">
        <div class="stat-label">${icon('check-circle', 'icon-sm')} Aman</div>
        <div class="stat-value">${counts.Aman}</div>
      </div>
      <div class="stat-card s-waspada">
        <div class="stat-label">${icon('alert-triangle', 'icon-sm')} Waspada</div>
        <div class="stat-value">${counts.Waspada}</div>
      </div>
      <div class="stat-card s-kritis">
        <div class="stat-label">${icon('alert-octagon', 'icon-sm')} Kritis</div>
        <div class="stat-value">${counts.Kritis}</div>
      </div>
      <div class="stat-card s-kedaluwarsa">
        <div class="stat-label">${icon('x-circle', 'icon-sm')} Kedaluwarsa</div>
        <div class="stat-value">${counts.Kedaluwarsa}</div>
      </div>
      <div class="stat-card s-nilai">
        <div class="stat-label">${icon('wallet', 'icon-sm')} Total Nilai Stok</div>
        <div class="stat-value">${fmtRupiah(totalNilai)}</div>
      </div>
    </div>`;

  // Build risky table HTML
  let riskyTable = '';
  if (risky.length === 0) {
    riskyTable = `<p style="color:var(--color-aman);font-weight:600;">${icon('check-circle')} Tidak ada batch berisiko saat ini. Stok dalam kondisi sangat baik!</p>`;
  } else {
    /* Wrap in table-wrapper so the Laporan panel table scrolls horizontally
       on narrow screens instead of overflowing the panel. */
    riskyTable = `
      <div class="table-wrapper">
      <table class="rec-table">
        <thead>
          <tr>
            <th>Nama Obat</th>
            <th>Batch</th>
            <th>Kedaluwarsa</th>
            <th>Qty</th>
            <th>Status</th>
            <th>Rekomendasi Tindakan</th>
          </tr>
        </thead>
        <tbody>
          ${risky.map(item => {
            const rec = getRecommendation(item);
            return `
              <tr>
                <td><strong>${escHtml(item.nama)}</strong></td>
                <td><code>${escHtml(item.batch)}</code></td>
                <td>${fmtDate(item.kadaluarsa)}</td>
                <td>${item.qty}</td>
                <td>${badgeHtml(getStatus(item.kadaluarsa))}</td>
                <td>
                  <div class="rec-action">${rec.action}</div>
                  <div class="rec-reason">${escHtml(rec.reason)}</div>
                </td>
              </tr>`;
          }).join('')}
        </tbody>
      </table>
      </div>`;
  }

  return `
    <p style="font-size:.83rem;color:var(--color-muted);margin-bottom:.9rem;display:flex;align-items:center;gap:.35rem;">
      ${icon('calendar', 'icon-sm')} Dibuat otomatis pada: <strong>${today}</strong>
    </p>
    ${statCards}
    <div class="report-section-title" style="display:flex;align-items:center;gap:.4rem;">
      ${icon('bar-chart', 'icon-sm')} Ringkasan Batch Berisiko &amp; Rekomendasi Tindakan
    </div>
    ${riskyTable}`;
}

/* ============================================================
   7. AGENT — INTENT DETECTION & RESPONSE BUILDER
   ============================================================ */

/**
 * Very simple intent + keyword matching.
 * Returns an HTML string to render in the chat bubble.
 */
function agentReply(userText) {
  // Normalise: lowercase, strip diacritics, collapse punctuation to spaces
  const t = userText.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/g, ' ');

  /* ----------------------------------------------------------------
     Word-boundary helper.
     has(word, ...) returns true only when every token appears as a
     whole word in t (so "ok" never matches inside "stok").
     Multi-word phrases are matched as exact substrings after the
     single-word boundary check is skipped for them.
  ---------------------------------------------------------------- */
  const hasWord = (...tokens) => tokens.some(tok => {
    if (tok.includes(' ')) return t.includes(tok); // phrase — exact substring
    return new RegExp(`\\b${tok}\\b`).test(t);     // single word — boundary
  });

  /* ----------------------------------------------------------------
     Parse a number N from phrases like "dalam 3 bulan", "dalam 2 minggu",
     "dalam 90 hari". Returns limit in days (default 90).
  ---------------------------------------------------------------- */
  function parseLimitDays() {
    // Match: "dalam <N> bulan|minggu|hari"
    let m = t.match(/dalam\s+(\d+)\s+(bulan|minggu|hari)/);
    if (m) {
      const n    = parseInt(m[1], 10);
      const unit = m[2];
      if (unit === 'bulan')  return n * 30;
      if (unit === 'minggu') return n * 7;
      return n; // hari
    }
    // Fallback: bare number followed by unit anywhere
    m = t.match(/(\d+)\s*(bulan|minggu|hari)/);
    if (m) {
      const n    = parseInt(m[1], 10);
      const unit = m[2];
      if (unit === 'bulan')  return n * 30;
      if (unit === 'minggu') return n * 7;
      return n;
    }
    return 90; // default: 3 months
  }

  // Extract a medicine name mentioned by the user (whole-word on first token)
  const uniqueNames = [...new Set(stockData.map(i => i.nama))];
  const mentionedItem = uniqueNames.find(name => {
    const firstToken = name.toLowerCase().split(' ')[0];
    return new RegExp(`\\b${firstToken}\\b`).test(t);
  });

  /* ================================================================
     INTENT CHECKS — ordered from most specific to most generic.
     IMPORTANT: "hampir/akan/segera kedaluwarsa" MUST be checked BEFORE
     the generic "sudah kedaluwarsa" to avoid false-positive matching on
     the shared root "kedaluwarsa".
  ================================================================ */

  /* ---- INTENT: laporan / report (NOT triggered by "hari ini" alone) ---- */
  if (hasWord('laporan', 'report', 'ringkasan', 'rekap', 'summary')) {
    switchPanel('report');
    renderReport();
    return `<p>${icon('check-circle', 'icon-sm')} Laporan harian telah dibuat dan ditampilkan di tab <strong>Laporan</strong>. Silakan klik tab tersebut untuk melihatnya secara lengkap.</p>
            ${buildReportSnippet()}`;
  }

  /* ---- INTENT: FEFO / urutan jual ---- */
  if (hasWord('fefo', 'urutan', 'prioritas', 'duluan') ||
      t.includes('dijual dulu') || t.includes('jual dulu') ||
      (hasWord('pertama') && mentionedItem)) {
    if (mentionedItem) return fefoResponseFor(mentionedItem);
    return `<p>Berikut adalah urutan FEFO (First Expired, First Out) untuk semua obat (rank #1 = dijual pertama):</p>
            ${fefoTableAll()}`;
  }

  /* ---- INTENT: "hampir / akan / segera kedaluwarsa dalam N ..." ----
     Must come BEFORE the generic expired intent.
     Triggers on: hampir, akan, segera, mendekati — even without "kedaluwarsa" ---- */
  const isAlmost = hasWord('hampir', 'akan', 'segera', 'mendekati') ||
                   t.includes('belum kedaluwarsa') ||
                   (t.match(/dalam\s+\d+/) && (hasWord('kedaluwarsa', 'kadaluarsa', 'expired')));
  if (isAlmost) {
    const limitDays = parseLimitDays();
    return batchesAlmostExpiring(limitDays);
  }

  /* ---- INTENT: "sudah kedaluwarsa" (already past) ---- */
  if (hasWord('kedaluwarsa', 'kadaluarsa', 'expired') ||
      t.includes('sudah lewat')) {
    return batchesByStatus('Kedaluwarsa',
      `${icon('x-circle', 'icon-sm')} Berikut batch yang <strong>sudah kedaluwarsa</strong>:`,
      `${icon('check-circle', 'icon-sm')} Tidak ada batch yang kedaluwarsa. Bagus sekali!`);
  }

  /* ---- INTENT: rekomendasi / saran ----
     Checked BEFORE kritis/waspada so "rekomendasi untuk batch kritis"
     routes here (and shows recommendations filtered by status) rather
     than falling into the plain kritis status-list intent.            ---- */
  if (hasWord('rekomendasi', 'saran', 'tindakan', 'langkah') ||
      t.includes('apa yang harus')) {
    if (mentionedItem) return rekomendasiFor(mentionedItem);
    // If user also mentioned a status word, filter recommendations by that status
    const filterStatus =
      hasWord('kritis')     ? 'Kritis'      :
      hasWord('waspada')    ? 'Waspada'     :
      hasWord('kedaluwarsa', 'kadaluarsa') ? 'Kedaluwarsa' :
      hasWord('aman')       ? 'Aman'        :
      null;
    return rekomendasiAll(filterStatus);
  }

  /* ---- INTENT: kritis ---- */
  if (hasWord('kritis', 'darurat') || t.includes('kurang dari 3') || t.includes('kurang 3')) {
    return batchesByStatus('Kritis',
      `${icon('alert-octagon', 'icon-sm')} Berikut batch berstatus <strong>Kritis</strong> (kedaluwarsa dalam &lt; 3 bulan):`,
      `${icon('check-circle', 'icon-sm')} Tidak ada batch berstatus Kritis saat ini.`);
  }

  /* ---- INTENT: waspada ---- */
  if (hasWord('waspada')) {
    return batchesByStatus('Waspada',
      `${icon('alert-triangle', 'icon-sm')} Berikut batch berstatus <strong>Waspada</strong> (kedaluwarsa dalam 3–6 bulan):`,
      `${icon('check-circle', 'icon-sm')} Tidak ada batch berstatus Waspada saat ini.`);
  }

  /* ---- INTENT: aman ---- */
  if (hasWord('aman', 'bagus', 'baik') || t.includes('stok aman')) {
    return batchesByStatus('Aman',
      `${icon('check-circle', 'icon-sm')} Berikut batch berstatus <strong>Aman</strong> (kedaluwarsa &gt; 6 bulan):`,
      `${icon('alert-triangle', 'icon-sm')} Tidak ada batch berstatus Aman saat ini.`);
  }

  /* ---- INTENT: nilai stok / harga ---- */
  if (hasWord('nilai', 'modal', 'investasi', 'uang') ||
      t.includes('total nilai') || t.includes('berapa nilai') ||
      t.includes('berapa total') ||
      (hasWord('total') && !hasWord('batch')) ||
      (hasWord('harga') && !mentionedItem)) {
    return nilaiStokResponse();
  }

  /* ---- INTENT: tampilkan / list semua ---- */
  if (hasWord('tampilkan', 'list', 'semua', 'daftar', 'show')) {
    if (mentionedItem) return fefoResponseFor(mentionedItem);
    switchPanel('stock');
    renderStockTable();
    return `<p>${icon('package', 'icon-sm')} Data stok lengkap telah ditampilkan di tab <strong>Stok</strong>. Anda bisa memfilter berdasarkan status di sana.</p>
            ${buildStockSnippet()}`;
  }

  /* ---- INTENT: item-specific question ---- */
  if (mentionedItem) {
    return itemDetailResponse(mentionedItem);
  }

  /* ---- FALLBACK ---- */
  return fallbackResponse();
}

/* ---- Sub-builders for agent responses ---- */

/** FEFO response for a single named item */
function fefoResponseFor(nama) {
  const annotated = computeFEFO(stockData);
  const batches = annotated
    .filter(i => i.nama.toLowerCase() === nama.toLowerCase())
    .sort((a, b) => a.fefoRank - b.fefoRank);

  if (!batches.length) return `<p>Maaf, obat <strong>${escHtml(nama)}</strong> tidak ditemukan dalam data stok.</p>`;

  const rows = batches.map(i => {
    const s = getStatus(i.kadaluarsa);
    return `<tr><td>${i.fefoRank}</td><td><code>${escHtml(i.batch)}</code></td>
            <td>${fmtDate(i.kadaluarsa)}</td><td>${i.qty}</td>
            <td>${badgeHtml(s)}</td></tr>`;
  }).join('');

  return `<p>Urutan FEFO untuk <strong>${escHtml(nama)}</strong> (batch dengan tanggal kedaluwarsa paling dekat dijual <strong>pertama</strong>):</p>
          <div class="resp-table-wrap"><table class="resp-table">
            <thead><tr><th>Rank</th><th>Batch</th><th>Kedaluwarsa</th><th>Qty</th><th>Status</th></tr></thead>
            <tbody>${rows}</tbody>
          </table></div>
          <p style="margin-top:.5rem;font-size:.82rem;color:var(--color-muted);">
            Batch rank #1 adalah yang harus dijual <strong>pertama</strong> sesuai prinsip FEFO.</p>`;
}

/** Full FEFO table (all items, only rank #1 rows) */
function fefoTableAll() {
  const annotated = computeFEFO(stockData);
  const first = annotated.filter(i => i.fefoRank === 1);
  const rows = first.map(i => {
    const s = getStatus(i.kadaluarsa);
    return `<tr><td><strong>${escHtml(i.nama)}</strong></td><td><code>${escHtml(i.batch)}</code></td>
            <td>${fmtDate(i.kadaluarsa)}</td><td>${i.qty}</td><td>${badgeHtml(s)}</td></tr>`;
  }).join('');
  return `<div class="resp-table-wrap"><table class="resp-table">
    <thead><tr><th>Obat</th><th>Batch (Jual Dulu)</th><th>Kedaluwarsa</th><th>Qty</th><th>Status</th></tr></thead>
    <tbody>${rows}</tbody>
  </table></div>`;
}

/** Batches filtered by a single status */
function batchesByStatus(status, titleHtml, emptyMsg) {
  const items = stockData.filter(i => getStatus(i.kadaluarsa) === status)
    .sort((a, b) => new Date(a.kadaluarsa) - new Date(b.kadaluarsa));

  if (!items.length) return `<p>${emptyMsg}</p>`;

  const rows = items.map(i => `
    <tr><td><strong>${escHtml(i.nama)}</strong></td><td><code>${escHtml(i.batch)}</code></td>
    <td>${fmtDate(i.kadaluarsa)}</td><td>${i.qty}</td>
    <td>${daysUntil(i.kadaluarsa) < 0 ? Math.abs(daysUntil(i.kadaluarsa)) + ' hari lalu' : daysUntil(i.kadaluarsa) + ' hari lagi'}</td></tr>`
  ).join('');

  return `<p>${titleHtml}</p>
    <div class="resp-table-wrap"><table class="resp-table">
      <thead><tr><th>Obat</th><th>Batch</th><th>Kedaluwarsa</th><th>Qty</th><th>Sisa Hari</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>`;
}

/** Kritis + Waspada together (for "hampir kedaluwarsa dalam 3 bulan") */
/**
 * Batches NOT YET expired whose remaining days are between 0 and maxDays.
 * Sorted by nearest expiry first.
 * @param {number} maxDays - upper limit (e.g. 90 for "dalam 3 bulan")
 */
function batchesAlmostExpiring(maxDays) {
  const items = stockData
    .filter(i => {
      const d = daysUntil(i.kadaluarsa);
      return d >= 0 && d <= maxDays; // not yet expired, within window
    })
    .sort((a, b) => new Date(a.kadaluarsa) - new Date(b.kadaluarsa));

  // Human-readable window label
  let windowLabel;
  if (maxDays % 30 === 0) {
    windowLabel = `${maxDays / 30} bulan`;
  } else if (maxDays % 7 === 0) {
    windowLabel = `${maxDays / 7} minggu`;
  } else {
    windowLabel = `${maxDays} hari`;
  }

  if (!items.length) {
    return `<p>${icon('check-circle', 'icon-sm')} Tidak ada obat yang akan kedaluwarsa dalam <strong>${windowLabel}</strong> ke depan.</p>`;
  }

  const rows = items.map(i => {
    const s = getStatus(i.kadaluarsa);
    const d = daysUntil(i.kadaluarsa);
    return `<tr>
      <td><strong>${escHtml(i.nama)}</strong></td>
      <td><code>${escHtml(i.batch)}</code></td>
      <td>${fmtDate(i.kadaluarsa)}</td>
      <td>${i.qty}</td>
      <td>${badgeHtml(s)}</td>
      <td>${d} hari lagi</td>
    </tr>`;
  }).join('');

  return `<p>${icon('clock', 'icon-sm')} Berikut obat yang <strong>akan kedaluwarsa dalam ${windowLabel} ke depan</strong> (belum kedaluwarsa, sisa &le; ${maxDays} hari):</p>
    <div class="resp-table-wrap"><table class="resp-table">
      <thead><tr><th>Obat</th><th>Batch</th><th>Kedaluwarsa</th><th>Qty</th><th>Status</th><th>Sisa Hari</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>`;
}

/** Recommendations for a single item */
function rekomendasiFor(nama) {
  const batches = stockData.filter(i => i.nama.toLowerCase() === nama.toLowerCase());
  if (!batches.length) return `<p>Obat <strong>${escHtml(nama)}</strong> tidak ditemukan dalam data stok.</p>`;

  const rows = batches.map(i => {
    const rec = getRecommendation(i);
    return `<tr><td><code>${escHtml(i.batch)}</code></td>
            <td>${fmtDate(i.kadaluarsa)}</td>
            <td>${badgeHtml(getStatus(i.kadaluarsa))}</td>
            <td><strong>${rec.action}</strong><br><small style="color:var(--color-muted)">${escHtml(rec.reason)}</small></td></tr>`;
  }).join('');

  return `<p>Rekomendasi untuk <strong>${escHtml(nama)}</strong>:</p>
    <div class="resp-table-wrap"><table class="resp-table">
      <thead><tr><th>Batch</th><th>Kedaluwarsa</th><th>Status</th><th>Rekomendasi</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>`;
}

/**
 * Recommendations for all non-Aman batches, optionally filtered by status.
 * @param {string|null} filterStatus - e.g. 'Kritis', 'Waspada', or null for all risky
 */
function rekomendasiAll(filterStatus) {
  // Base pool: non-Aman batches (or a specific status when requested)
  const pool = filterStatus
    ? stockData.filter(i => getStatus(i.kadaluarsa) === filterStatus)
    : stockData.filter(i => getStatus(i.kadaluarsa) !== 'Aman');

  const risky = pool.sort((a, b) => new Date(a.kadaluarsa) - new Date(b.kadaluarsa));

  const statusLabel = filterStatus ? ` berstatus <strong>${filterStatus}</strong>` : ' berisiko';

  if (!risky.length) {
    return filterStatus
      ? `<p>${icon('check-circle', 'icon-sm')} Tidak ada batch berstatus <strong>${filterStatus}</strong> saat ini.</p>`
      : `<p>${icon('check-circle', 'icon-sm')} Semua stok dalam kondisi Aman. Tidak ada rekomendasi tindakan khusus saat ini.</p>`;
  }

  const rows = risky.map(i => {
    const rec = getRecommendation(i);
    return `<tr>
      <td><strong>${escHtml(i.nama)}</strong></td>
      <td><code>${escHtml(i.batch)}</code></td>
      <td>${badgeHtml(getStatus(i.kadaluarsa))}</td>
      <td><strong>${rec.action}</strong><br><small style="color:var(--color-muted)">${escHtml(rec.reason)}</small></td>
    </tr>`;
  }).join('');

  return `<p>${icon('lightbulb', 'icon-sm')} Rekomendasi tindakan untuk semua batch${statusLabel}:</p>
    <div class="resp-table-wrap"><table class="resp-table">
      <thead><tr><th>Obat</th><th>Batch</th><th>Status</th><th>Rekomendasi</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>`;
}

/** Total stock value breakdown */
function nilaiStokResponse() {
  let total = 0;
  const byItem = {};
  stockData.forEach(i => {
    const nilai = i.qty * i.hargaBeli;
    total += nilai;
    if (!byItem[i.nama]) byItem[i.nama] = 0;
    byItem[i.nama] += nilai;
  });

  const sorted = Object.entries(byItem).sort((a, b) => b[1] - a[1]);
  const rows = sorted.map(([nama, nilai]) =>
    `<tr><td>${escHtml(nama)}</td><td>${fmtRupiah(nilai)}</td></tr>`
  ).join('');

  return `<p>${icon('wallet', 'icon-sm')} <strong>Total nilai stok saat ini: ${fmtRupiah(total)}</strong> (berdasarkan harga beli)</p>
    <div class="resp-table-wrap"><table class="resp-table">
      <thead><tr><th>Nama Obat</th><th>Nilai Stok</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>`;
}

/** Detail for a single named item */
function itemDetailResponse(nama) {
  const batches = stockData.filter(i => i.nama.toLowerCase() === nama.toLowerCase());
  if (!batches.length) return fallbackResponse();

  const annotated = computeFEFO(stockData);
  const enriched  = annotated.filter(i => i.nama.toLowerCase() === nama.toLowerCase())
                              .sort((a, b) => a.fefoRank - b.fefoRank);

  const rows = enriched.map(i => {
    const s = getStatus(i.kadaluarsa);
    return `<tr><td><code>${escHtml(i.batch)}</code></td>
            <td>${fmtDate(i.kadaluarsa)}</td>
            <td>${i.qty}</td>
            <td>${fmtRupiah(i.hargaJual)}</td>
            <td>${badgeHtml(s)}</td>
            <td><span class="fefo-badge">${i.fefoRank}</span></td></tr>`;
  }).join('');

  return `<p>${icon('file-text', 'icon-sm')} Detail stok untuk <strong>${escHtml(nama)}</strong>:</p>
    <div class="resp-table-wrap"><table class="resp-table">
      <thead><tr><th>Batch</th><th>Kedaluwarsa</th><th>Qty</th><th>Harga Jual</th><th>Status</th><th>FEFO</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>`;
}

/** Quick stat snippet embedded in report-triggered chat reply */
function buildReportSnippet() {
  const counts = { Aman: 0, Waspada: 0, Kritis: 0, Kedaluwarsa: 0 };
  let total = 0;
  stockData.forEach(i => {
    counts[getStatus(i.kadaluarsa)]++;
    total += i.qty * i.hargaBeli;
  });
  return `<ul>
    <li>${icon('check-circle',   'icon-sm')} Aman: <strong>${counts.Aman}</strong> batch</li>
    <li>${icon('alert-triangle', 'icon-sm')} Waspada: <strong>${counts.Waspada}</strong> batch</li>
    <li>${icon('alert-octagon',  'icon-sm')} Kritis: <strong>${counts.Kritis}</strong> batch</li>
    <li>${icon('x-circle',       'icon-sm')} Kedaluwarsa: <strong>${counts.Kedaluwarsa}</strong> batch</li>
    <li>${icon('wallet',         'icon-sm')} Total nilai stok: <strong>${fmtRupiah(total)}</strong></li>
  </ul>`;
}

/** Small stock snippet for "tampilkan semua" */
function buildStockSnippet() {
  const unique = [...new Set(stockData.map(i => i.nama))];
  return `<p>Daftar obat dalam stok (${unique.length} jenis, ${stockData.length} batch total):</p>
    <ul>${unique.map(n => `<li>${escHtml(n)}</li>`).join('')}</ul>`;
}

/** Fallback reply */
function fallbackResponse() {
  return `<p>Maaf, saya belum memahami pertanyaan tersebut.</p>
    <p>Berikut yang bisa Anda tanyakan:</p>
    <ul>
      <li>${icon('clock',          'icon-sm')} Obat apa yang hampir kedaluwarsa dalam 3 bulan?</li>
      <li>${icon('list-ordered',   'icon-sm')} Batch mana yang dijual dulu untuk <em>[nama obat]</em>?</li>
      <li>${icon('x-circle',       'icon-sm')} Obat apa yang sudah kedaluwarsa?</li>
      <li>${icon('alert-octagon',  'icon-sm')} Tampilkan semua obat berstatus Kritis / Waspada / Aman</li>
      <li>${icon('lightbulb',      'icon-sm')} Apa rekomendasi untuk batch Waspada / Kritis?</li>
      <li>${icon('wallet',         'icon-sm')} Berapa total nilai stok saya?</li>
      <li>${icon('file-text',      'icon-sm')} Buat laporan harian</li>
    </ul>`;
}

/* ============================================================
   8. CHAT UI
   ============================================================ */

const chatMessages = document.getElementById('chatMessages');
const chatInput    = document.getElementById('chatInput');
const sendBtn      = document.getElementById('sendBtn');

/** Escape HTML special characters */
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Append a bubble to the chat. */
function appendMessage(role, htmlContent) {
  const isAgent   = role === 'agent';
  const avatarSvg = isAgent ? icon('bot') : icon('user');

  const div = document.createElement('div');
  div.className = `msg ${role}`;
  div.innerHTML = `
    <div class="msg-avatar" aria-hidden="true">${avatarSvg}</div>
    <div class="msg-bubble">${htmlContent}</div>`;

  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return div;
}

/** Show a typing indicator then replace it with the real reply. */
function showTypingThenReply(userText) {
  const typingBubble = appendMessage('agent',
    '<div class="typing-dots"><span></span><span></span><span></span></div>'
  );

  // Simulate a brief "thinking" delay for natural feel (300 ms)
  setTimeout(() => {
    const reply = agentReply(userText);
    typingBubble.querySelector('.msg-bubble').innerHTML = reply;
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 350);
}

/** Handle user sending a message. */
function handleSend() {
  const text = chatInput.value.trim();
  if (!text) return;

  appendMessage('user', escHtml(text));
  chatInput.value = '';
  chatInput.style.height = 'auto';
  showTypingThenReply(text);
}

// Send on button click
sendBtn.addEventListener('click', handleSend);

// Send on Enter (Shift+Enter = newline)
chatInput.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSend();
  }
});

// Auto-grow textarea
chatInput.addEventListener('input', () => {
  chatInput.style.height = 'auto';
  chatInput.style.height = Math.min(chatInput.scrollHeight, 130) + 'px';
});

// Quick suggestion chips
document.getElementById('chatSuggestions').addEventListener('click', e => {
  const chip = e.target.closest('.chip');
  if (!chip) return;
  chatInput.value = chip.dataset.q;
  handleSend();
});

/* ============================================================
   9. PANEL NAVIGATION
   ============================================================ */
function switchPanel(name) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`panel-${name}`).classList.add('active');
  document.querySelector(`[data-panel="${name}"]`).classList.add('active');
}

document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const panel = btn.dataset.panel;
    switchPanel(panel);
    if (panel === 'stock')  renderStockTable(stockFilter.value);
    if (panel === 'report') renderReport();
  });
});

/* ============================================================
   10. STOCK FILTER
   ============================================================ */
stockFilter.addEventListener('change', () => {
  renderStockTable(stockFilter.value);
});

/* ============================================================
   11. CSV IMPORT
   ============================================================ */

/** Parse a CSV string into stock items. Validates minimal columns. */
function parseCsv(raw) {
  const lines  = raw.trim().split('\n').filter(l => l.trim());
  const result = [];
  let startIdx = 0;

  // Skip header row if it looks like a header (first cell not a number/name pattern)
  const firstCells = lines[0].split(',');
  if (isNaN(firstCells[2]) && !firstCells[2].match(/^\d{4}-\d{2}-\d{2}$/)) {
    startIdx = 1;
  }

  lines.slice(startIdx).forEach((line, i) => {
    const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
    if (cols.length < 6) return; // skip malformed rows

    const [nama, batch, kadaluarsa, qty, hargaBeli, hargaJual] = cols;
    if (!nama || !batch || !kadaluarsa) return;

    // Validate date format
    if (!kadaluarsa.match(/^\d{4}-\d{2}-\d{2}$/)) return;

    result.push({
      id: Date.now() + i,
      nama,
      batch,
      kadaluarsa,
      qty:       parseInt(qty, 10)       || 0,
      hargaBeli: parseInt(hargaBeli, 10) || 0,
      hargaJual: parseInt(hargaJual, 10) || 0,
    });
  });
  return result;
}

/** Merge or replace stock data, then re-render. */
function importCsvData(raw) {
  const items = parseCsv(raw);
  if (!items.length) {
    alert('Tidak ada data valid yang ditemukan. Pastikan format CSV benar:\nnama,batch,YYYY-MM-DD,qty,harga_beli,harga_jual');
    return;
  }
  stockData = stockData.concat(items);
  renderStockTable(stockFilter.value);
  switchPanel('stock');
  appendMessage('agent',
    `<p>${icon('check-circle', 'icon-sm')} Berhasil mengimpor <strong>${items.length} batch</strong> baru dari CSV. Data telah ditambahkan ke stok.</p>`
  );
  switchPanel('chat');
}

// File upload
document.getElementById('csvFile').addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => importCsvData(ev.target.result);
  reader.readAsText(file);
  e.target.value = ''; // reset so same file can be re-imported
});

// Paste modal
const csvModal      = document.getElementById('csvModal');
const csvPasteArea  = document.getElementById('csvPasteArea');
document.getElementById('pasteCsvBtn').addEventListener('click', () => {
  csvModal.style.display = 'flex';
  csvPasteArea.focus();
});
document.getElementById('csvCancelBtn').addEventListener('click', () => {
  csvModal.style.display = 'none';
  csvPasteArea.value = '';
});
document.getElementById('csvImportBtn').addEventListener('click', () => {
  importCsvData(csvPasteArea.value);
  csvModal.style.display = 'none';
  csvPasteArea.value = '';
});
// Close modal on overlay click
csvModal.addEventListener('click', e => {
  if (e.target === csvModal) {
    csvModal.style.display = 'none';
    csvPasteArea.value = '';
  }
});

/* ============================================================
   12. REPORT PANEL RENDER
   ============================================================ */
function renderReport() {
  document.getElementById('reportContent').innerHTML = generateReport();
}

document.getElementById('refreshReportBtn').addEventListener('click', renderReport);

/* ============================================================
   13. SELF-TEST — runnable from browser console: runSelfTest()
   Tests that each canonical question maps to the correct intent.
   ============================================================ */

/**
 * Run from the browser console: runSelfTest()
 * Logs PASS/FAIL for each test case.
 */
function runSelfTest() {
  /* Each test case:
       q     — the question to send
       check — function(html) that returns true when the correct intent fired
  */
  const cases = [
    {
      label: '"Obat apa yang sudah kedaluwarsa?" → expired list',
      q:     'Obat apa yang sudah kedaluwarsa?',
      check: html => html.includes('sudah kedaluwarsa') &&
                     !html.includes('akan kedaluwarsa'),
    },
    {
      label: '"Obat apa yang hampir kedaluwarsa dalam 3 bulan?" → not-yet-expired, within 90 days',
      q:     'Obat apa yang hampir kedaluwarsa dalam 3 bulan?',
      check: html => html.includes('akan kedaluwarsa') &&
                     html.includes('3 bulan') &&
                     html.includes('belum kedaluwarsa'),
    },
    {
      label: '"Berapa total nilai stok?" → stock value',
      q:     'Berapa total nilai stok?',
      check: html => html.includes('Total nilai stok') || html.includes('total nilai'),
    },
    {
      label: '"Batch mana yang dijual dulu untuk Amoxicillin?" → FEFO for Amoxicillin',
      q:     'Batch mana yang dijual dulu untuk Amoxicillin?',
      check: html => html.includes('FEFO') && html.includes('Amoxicillin'),
    },
    {
      label: '"Buat laporan harian" → report',
      q:     'Buat laporan harian',
      check: html => html.includes('Laporan') && html.includes('Aman'),
    },
    {
      label: '"Apa rekomendasi untuk batch kritis?" → recommendations',
      q:     'Apa rekomendasi untuk batch kritis?',
      check: html => html.includes('Rekomendasi') || html.includes('tindakan'),
    },
    // Edge-case: "hari ini" alone must NOT trigger the report
    {
      label: '"hari ini" alone → NOT report (fallback or other)',
      q:     'hari ini',
      check: html => !html.includes('Laporan harian telah dibuat'),
    },
    // Edge-case: "stok" must not match the word boundary check for "ok"
    {
      label: '"stok" query → NOT aman intent (ok boundary)',
      q:     'berapa total nilai stok saya',
      check: html => html.includes('Total nilai stok') || html.includes('total nilai'),
    },
  ];

  let passed = 0;
  let failed = 0;

  console.group('PharmaStock Advisor — Self-Test');
  cases.forEach(({ label, q, check }) => {
    let html;
    try {
      html = agentReply(q);
    } catch (err) {
      console.error(`[EXCEPTION] ${label}\n`, err);
      failed++;
      return;
    }
    if (check(html)) {
      console.log(`[PASS] ${label}`);
      passed++;
    } else {
      console.warn(`[FAIL] ${label}`);
      console.warn('   Response HTML:', html.replace(/<[^>]+>/g, ' ').trim().slice(0, 200));
      failed++;
    }
  });

  console.log(`\nResult: ${passed} passed, ${failed} failed out of ${cases.length} tests.`);
  console.groupEnd();

  return { passed, failed, total: cases.length };
}

// Expose to browser console
window.runSelfTest = runSelfTest;

/* ============================================================
   14. RESET CONTROLS
   ============================================================ */

/**
 * The default/built-in stock data at page-load time.
 * Captured once after `stockData` is initially declared so
 * "Reset data" can restore it exactly.
 */
const DEFAULT_STOCK_DATA = stockData.map(item => ({ ...item }));

/**
 * Show the standard greeting message in the chat.
 * Extracted so both init() and "Hapus percakapan" can call it.
 */
function showGreeting() {
  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  const kritis      = stockData.filter(i => getStatus(i.kadaluarsa) === 'Kritis').length;
  const kedaluwarsa = stockData.filter(i => getStatus(i.kadaluarsa) === 'Kedaluwarsa').length;

  let urgentNote = '';
  if (kedaluwarsa > 0) urgentNote += `<li>${icon('ban', 'icon-sm')} <strong>${kedaluwarsa} batch sudah kedaluwarsa</strong> — perlu tindakan segera!</li>`;
  if (kritis > 0)      urgentNote += `<li>${icon('alert-octagon', 'icon-sm')} <strong>${kritis} batch berstatus Kritis</strong> — kedaluwarsa dalam &lt;3 bulan.</li>`;

  appendMessage('agent', `
    <p>Selamat datang di <strong>PharmaStock Advisor</strong>!</p>
    <p>Hari ini, <em>${today}</em>. Saya siap membantu Anda mengelola stok obat menggunakan prinsip <strong>FEFO</strong> (First Expired, First Out).</p>
    ${urgentNote ? `<p>${icon('bell', 'icon-sm')} <strong>Perhatian hari ini:</strong></p><ul>${urgentNote}</ul>` : `<p>${icon('check-circle', 'icon-sm')} Tidak ada peringatan mendesak hari ini.</p>`}
    <p>Silakan ketik pertanyaan Anda atau klik salah satu tombol saran di bawah.</p>
  `);
}

/* "Hapus percakapan" — clear chat history and show greeting again */
document.getElementById('clearChatBtn').addEventListener('click', () => {
  chatMessages.innerHTML = '';   // remove all bubbles
  showGreeting();                // re-show welcome message
  chatInput.focus();
});

/* "Reset data" — restore built-in dummy stock after confirmation */
document.getElementById('resetDataBtn').addEventListener('click', () => {
  const confirmed = window.confirm(
    'Reset data stok ke data bawaan?\n\n' +
    'Semua data yang diimpor dari CSV akan dihapus dan stok akan kembali ke data demo awal.'
  );
  if (!confirmed) return;

  // Restore the original built-in data (shallow-copy each item to avoid mutation)
  stockData = DEFAULT_STOCK_DATA.map(item => ({ ...item }));

  // Re-render affected panels
  renderStockTable(stockFilter.value);
  renderReport();

  // Notify the user in the chat
  appendMessage('agent',
    `<p>${icon('rotate-ccw', 'icon-sm')} Data stok telah dikembalikan ke data bawaan. ` +
    `Semua data impor CSV telah dihapus.</p>`
  );
});

/* ============================================================
   15. INIT — run on page load
   ============================================================ */
function init() {
  // Render stock table and report on first load (hidden panels, but ready)
  renderStockTable();
  renderReport();

  // Show the greeting message
  showGreeting();
}

init();
