/**
 * BẢNG ĐIỂM LUYỆN TẬP TỪ VỰNG – Ms Trâm english hub
 * Nhận kết quả từ trang luyện tập và ghi vào Google Sheet.
 *
 * Cách dùng: xem file HUONG-DAN-BANG-DIEM.md trong repo.
 * Sau khi dán mã: chạy hàm `setup` một lần, rồi Triển khai → Ứng dụng web.
 */

const SHEET_RESULTS = 'Kết quả';
const SHEET_SUMMARY = 'Tổng hợp';
const PART_NAMES = ['P1 Nghe chọn', 'P2 Nghĩa', 'P3 Điền câu', 'P4 Kết hợp', 'P5 Họ từ', 'P6 Định nghĩa', 'P7 Nghe viết'];
const HEADERS = ['Thời gian nộp', 'Họ và tên', 'Lớp', 'Nội dung', 'Số câu đúng', 'Tổng số câu',
  'Tỷ lệ (%)', 'Điểm hệ 10', 'Xếp loại', 'Thời gian làm (phút:giây)'].concat(PART_NAMES, ['Mã xác nhận']);

/** Chạy hàm này MỘT LẦN sau khi dán mã để tạo 2 trang tính. */
function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.setSpreadsheetLocale('vi_VN');

  let sh = ss.getSheetByName(SHEET_RESULTS);
  if (!sh) sh = ss.insertSheet(SHEET_RESULTS, 0);
  sh.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS])
    .setFontWeight('bold').setBackground('#0B3A55').setFontColor('#FFFFFF').setWrap(true);
  sh.setFrozenRows(1);
  sh.setColumnWidth(1, 140); sh.setColumnWidth(2, 190); sh.setColumnWidth(4, 150);
  sh.getRange('G:G').setNumberFormat('0"%"');
  sh.getRange('H:H').setNumberFormat('0.0');

  let sum = ss.getSheetByName(SHEET_SUMMARY);
  if (!sum) sum = ss.insertSheet(SHEET_SUMMARY, 1);
  sum.clear();
  sum.getRange('A1').setValue('BẢNG TỔNG HỢP – mỗi học sinh một dòng (tự cập nhật)').setFontWeight('bold').setFontSize(13);
  sum.getRange('A2').setFormula(
    "=IFERROR(QUERY('" + SHEET_RESULTS + "'!A:J," +
    "\"select C, B, count(G), max(G), avg(G), max(H) where B is not null " +
    "group by C, B order by C, B " +
    "label C 'Lớp', B 'Họ và tên', count(G) 'Số lần làm', max(G) 'Tỷ lệ cao nhất (%)', " +
    "avg(G) 'Tỷ lệ trung bình (%)', max(H) 'Điểm cao nhất'\",1),\"Chưa có học sinh nào nộp bài\")");
  sum.getRange('A2:F2').setFontWeight('bold').setBackground('#E1F3FB');
  sum.getRange('E:E').setNumberFormat('0.0');
  sum.setFrozenRows(2);
  sum.setColumnWidth(2, 200);

  const def = ss.getSheetByName('Sheet1') || ss.getSheetByName('Trang tính1');
  if (def && def.getLastRow() === 0 && ss.getSheets().length > 2) ss.deleteSheet(def);
}

/** Trang luyện tập gửi kết quả về đây. */
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const d = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sh = ss.getSheetByName(SHEET_RESULTS);
    if (!sh) { setup(); sh = ss.getSheetByName(SHEET_RESULTS); }

    const code = clean_(d.code, 12);
    // Bỏ qua nếu bài này đã được gửi (học sinh bấm Gửi lại)
    if (code && sh.getLastRow() > 1) {
      const found = sh.getRange(2, HEADERS.length, sh.getLastRow() - 1, 1)
        .createTextFinder(code).matchEntireCell(true).findNext();
      if (found) return json_({ ok: true, duplicate: true });
    }

    const parts = Array.isArray(d.parts) ? d.parts.slice(0, 7).map(p => "'" + clean_(p, 8)) : [];
    while (parts.length < 7) parts.push('');
    sh.appendRow([
      clean_(d.time, 30), clean_(d.name, 80), clean_(d.cls, 20), clean_(d.units, 40),
      num_(d.correct), num_(d.total), num_(d.pct), num_(d.score10), clean_(d.rating, 20), "'" + clean_(d.duration, 10)
    ].concat(parts, [code]));
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/** Mở link Web App trên trình duyệt để kiểm tra đã hoạt động chưa. */
function doGet() {
  return json_({ ok: true, message: 'Bảng điểm đang hoạt động' });
}

function clean_(v, max) {
  let s = String(v == null ? '' : v).replace(/[\r\n\t]+/g, ' ').trim().slice(0, max);
  if (/^[=+\-@]/.test(s)) s = "'" + s; // chặn chèn công thức
  return s;
}
function num_(v) { const n = Number(v); return isFinite(n) ? n : ''; }
function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
