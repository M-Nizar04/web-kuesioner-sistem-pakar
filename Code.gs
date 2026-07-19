/**
 * GOOGLE APPS SCRIPT — Backend penyimpan data kuesioner ke Google Sheets.
 *
 * CARA PAKAI: lihat GOOGLE_SHEETS_SETUP.md untuk panduan langkah demi langkah.
 * File ini ditempel di Extensions > Apps Script pada Google Sheet Anda.
 */

const SHEET_NAME = "Jawaban Kuesioner";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);

    // Buat sheet + header otomatis kalau belum ada
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      const headers = [
        "Timestamp", "Nama", "Usia", "Gender", "Pekerjaan",
        "Q1","Q2","Q3","Q4","Q5","Q6","Q7","Q8","Q9","Q10",
        "Q11","Q12","Q13","Q14","Q15","Total Skor"
      ];
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
    }

    const row = [
      data.timestamp || new Date().toISOString(),
      data.nama,
      data.usia,
      data.gender,
      data.pekerjaan,
      data.q1, data.q2, data.q3, data.q4, data.q5,
      data.q6, data.q7, data.q8, data.q9, data.q10,
      data.q11, data.q12, data.q13, data.q14, data.q15,
      data.totalSkor
    ];

    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Opsional: untuk tes cepat lewat browser (buka URL web app langsung)
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok", message: "Web App aktif dan siap menerima data." }))
    .setMimeType(ContentService.MimeType.JSON);
}
