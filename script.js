// your code goes here
'use strict';

/* ======================================================================
   KONFIGURASI — GANTI URL DI BAWAH INI
   ======================================================================
   Isi dengan URL Web App dari Google Apps Script Anda.
   Lihat file GOOGLE_SHEETS_SETUP.md untuk panduan lengkap membuatnya.
   Contoh formatnya:
   "https://script.google.com/macros/s/AKfycb.../exec"
   ====================================================================== */
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwKyF7BQVcfmk1tMboPS71_W6ylnYtir7zAukj2CA2oM88K0N4TjYx-6DECCct4PrNXkA/exec";

/* ---- DATA PERTANYAAN ---- */
const QUESTIONS = [
  "Aplikasi web ini membantu saya mendiagnosis awal penyakit asam lambung dengan lebih cepat.",
  "Hasil diagnosis dan saran penanganan yang diberikan oleh sistem pakar ini sangat bermanfaat bagi saya.",
  "Aplikasi ini membuat saya lebih sadar dan paham akan kondisi kesehatan lambung saya.",
  "Aplikasi ini memberikan informasi penyakit asam lambung yang akurat dan sesuai dengan gejala yang saya rasakan.",
  "Aplikasi web ini sangat mudah digunakan, bahkan untuk orang yang awam teknologi sekalipun.",
  "Saya dapat dengan mudah menemukan menu konsultasi dan mengisi gejala yang saya alami.",
  "Bahasa, istilah, dan pertanyaan gejala di dalam aplikasi ini sangat mudah dipahami.",
  "Aplikasi ini berjalan dengan lancar dan tidak ada fitur yang eror saat saya melakukan konsultasi.",
  "Saya bisa langsung menggunakan aplikasi ini tanpa perlu membaca petunjuk atau panduan penggunaan terlebih dahulu.",
  "Alur untuk melakukan konsultasi sangat mudah dipelajari.",
  "Saya tidak menemukan kebingungan sama sekali saat pertama kali mencoba aplikasi ini.",
  "Saya merasa sangat puas dengan tampilan (desain) dan kinerja dari aplikasi sistem pakar ini.",
  "Aplikasi web ini berfungsi dengan sangat baik sesuai dengan yang saya harapkan.",
  "Saya merasa nyaman menggunakan aplikasi ini untuk mengecek kondisi lambung saya.",
  "Saya akan merekomendasikan aplikasi ini kepada orang lain yang membutuhkan informasi terkait penyakit asam lambung."
];

const SCALE = [
  { val: 1, abbr: 'STS', full: 'Sangat Tidak Setuju' },
  { val: 2, abbr: 'TS', full: 'Tidak Setuju' },
  { val: 3, abbr: 'N', full: 'Netral' },
  { val: 4, abbr: 'S', full: 'Setuju' },
  { val: 5, abbr: 'SS', full: 'Sangat Setuju' },
];

/* ---- RENDER PERTANYAAN ---- */
const list = document.getElementById('questions-list');

QUESTIONS.forEach((qText, idx) => {
  const qNum = idx + 1;
  const card = document.createElement('div');
  card.className = 'question-card';
  card.id = `q-card-${qNum}`;

  const optionsHTML = SCALE.map(s => `
    <div class="likert-option">
      <input type="radio" name="q${qNum}" id="q${qNum}_${s.val}" value="${s.val}" aria-label="${s.full}" />
      <label for="q${qNum}_${s.val}" title="${s.full}">
        <span class="likert-num">${s.val}</span>
        <span class="likert-abbr">${s.abbr}</span>
      </label>
    </div>
  `).join('');

  card.innerHTML = `
    <div class="question-header">
      <div class="q-num">${qNum}</div>
      <p class="q-text">${qText}</p>
    </div>
    <div class="likert-wrap" role="radiogroup" aria-labelledby="q${qNum}-label">
      ${optionsHTML}
    </div>
    <div class="scale-labels">
      <span>Sangat Tidak Setuju</span>
      <span>Sangat Setuju</span>
    </div>
    <span class="error-msg" id="err-q${qNum}">Pernyataan ini wajib dijawab.</span>
  `;

  list.appendChild(card);
});

/* ---- PROGRESS TRACKER ---- */
const progressFill = document.getElementById('progress-fill');
const progressCount = document.getElementById('progress-count');

function updateProgress() {
  let answered = 0;
  for (let i = 1; i <= QUESTIONS.length; i++) {
    if (document.querySelector(`input[name="q${i}"]:checked`)) answered++;
  }
  progressCount.textContent = answered;
  progressFill.style.width = `${(answered / QUESTIONS.length) * 100}%`;
}

document.querySelectorAll('.likert-option input[type="radio"]').forEach(radio => {
  radio.addEventListener('change', () => {
    updateProgress();
    const match = radio.name.match(/q(\d+)/);
    if (match) {
      const n = match[1];
      document.getElementById(`q-card-${n}`)?.classList.remove('error-q');
      document.getElementById(`err-q${n}`)?.classList.remove('visible');
    }
  });
});

/* ---- FORM INPUT — hapus error saat diisi ---- */
['nama', 'usia', 'gender', 'pekerjaan'].forEach(id => {
  const el = document.getElementById(id);
  el.addEventListener('input', () => clearFieldError(el, `err-${id}`));
  el.addEventListener('change', () => clearFieldError(el, `err-${id}`));
});

function clearFieldError(el, errId) {
  el.classList.remove('error');
  document.getElementById(errId)?.classList.remove('visible');
}

/* ---- VALIDASI ---- */
function validateForm() {
  let valid = true;
  let firstError = null;

  const fields = [
    { id: 'nama', errId: 'err-nama' },
    { id: 'usia', errId: 'err-usia' },
    { id: 'gender', errId: 'err-gender' },
    { id: 'pekerjaan', errId: 'err-pekerjaan' },
  ];

  fields.forEach(f => {
    const el = document.getElementById(f.id);
    const err = document.getElementById(f.errId);
    if (!el.value.trim()) {
      el.classList.add('error');
      err.classList.add('visible');
      valid = false;
      if (!firstError) firstError = el;
    } else {
      el.classList.remove('error');
      err.classList.remove('visible');
    }
  });

  const usiaEl = document.getElementById('usia');
  const usiaVal = parseInt(usiaEl.value, 10);
  if (usiaEl.value.trim() && (usiaVal < 1 || usiaVal > 120 || isNaN(usiaVal))) {
    usiaEl.classList.add('error');
    const usiaErr = document.getElementById('err-usia');
    usiaErr.textContent = 'Usia harus antara 1–120 tahun.';
    usiaErr.classList.add('visible');
    valid = false;
    if (!firstError) firstError = usiaEl;
  }

  for (let i = 1; i <= QUESTIONS.length; i++) {
    const checked = document.querySelector(`input[name="q${i}"]:checked`);
    const card = document.getElementById(`q-card-${i}`);
    const errEl = document.getElementById(`err-q${i}`);
    if (!checked) {
      card.classList.add('error-q');
      errEl.classList.add('visible');
      valid = false;
      if (!firstError) firstError = card;
    } else {
      card.classList.remove('error-q');
      errEl.classList.remove('visible');
    }
  }

  if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });

  return valid;
}

/* ---- EKSPOR CSV LOKAL (cadangan/backup) ---- */
function exportCSV(data) {
  const headers = [
    'Nama', 'Usia', 'Gender', 'Pekerjaan',
    ...Array.from({ length: 15 }, (_, i) => `Q${i + 1}`),
    'Total Skor'
  ];

  const escapeCSV = val => {
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const row = [
    escapeCSV(data.nama),
    escapeCSV(data.usia),
    escapeCSV(data.gender),
    escapeCSV(data.pekerjaan),
    ...data.answers.map(escapeCSV),
    escapeCSV(data.totalSkor)
  ];

  const csvContent = headers.join(',') + '\r\n' + row.join(',');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const link = document.createElement('a');
  link.href = url;
  link.download = `kuesioner_usability_${data.nama.replace(/\s+/g, '_')}_${ts}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/* ---- KIRIM DATA KE GOOGLE SHEETS ---- */
async function sendToGoogleSheets(data) {
  const payload = {
    nama: data.nama,
    usia: data.usia,
    gender: data.gender,
    pekerjaan: data.pekerjaan,
    totalSkor: data.totalSkor,
    timestamp: new Date().toISOString(),
  };
  data.answers.forEach((ans, i) => { payload[`q${i + 1}`] = ans; });

  // Apps Script Web App tidak mengizinkan header custom (CORS),
  // jadi kita kirim sebagai text/plain lalu di-parse sebagai JSON di sisi server.
  const response = await fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Server merespons dengan status ${response.status}`);
  }

  const result = await response.json();
  if (!result || result.status !== 'success') {
    throw new Error(result?.message || 'Respons server tidak valid.');
  }
  return result;
}

/* ---- TOAST ---- */
function showToast() {
  const toast = document.getElementById('toast');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

/* ---- SUBMIT FORM ---- */
const form = document.getElementById('questionnaireForm');
const submitBtn = document.getElementById('submitBtn');
const submitError = document.getElementById('submitError');

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  if (!validateForm()) return;

  submitError.classList.remove('visible');

  const nama = document.getElementById('nama').value.trim();
  const usia = document.getElementById('usia').value.trim();
  const gender = document.getElementById('gender').value;
  const pekerjaan = document.getElementById('pekerjaan').value.trim();

  const answers = [];
  for (let i = 1; i <= QUESTIONS.length; i++) {
    answers.push(parseInt(document.querySelector(`input[name="q${i}"]:checked`).value, 10));
  }
  const totalSkor = answers.reduce((a, b) => a + b, 0);

  const data = { nama, usia, gender, pekerjaan, answers, totalSkor };

  submitBtn.classList.add('loading');
  submitBtn.disabled = true;

  try {
    if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes('GANTI_DENGAN')) {
      throw new Error(
        'URL Google Apps Script belum diatur. Buka script.js dan isi GOOGLE_SCRIPT_URL ' +
        'sesuai panduan di GOOGLE_SHEETS_SETUP.md.'
      );
    }
    await sendToGoogleSheets(data);
    showToast(); // data sudah tersimpan di Google Sheets, tidak perlu unduh CSV

    form.reset();
    updateProgress();
    document.querySelectorAll('.form-control.error').forEach(el => el.classList.remove('error'));
    document.querySelectorAll('.error-msg.visible').forEach(el => el.classList.remove('visible'));
    document.querySelectorAll('.question-card.error-q').forEach(el => el.classList.remove('error-q'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err) {
    console.error('Gagal mengirim data:', err);
    submitError.textContent = `Gagal mengirim data: ${err.message} Data tetap diunduh sebagai CSV di perangkat Anda sebagai cadangan.`;
    submitError.classList.add('visible');
    exportCSV(data); // tetap simpan salinan lokal walau gagal kirim ke server
  } finally {
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
  }
});

// Set dynamic copyright year in footer
const currentYearEl = document.getElementById('current-year');
if (currentYearEl) {
  currentYearEl.textContent = new Date().getFullYear();
}