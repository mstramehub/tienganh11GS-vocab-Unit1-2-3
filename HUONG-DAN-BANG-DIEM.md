# Hướng dẫn tạo bảng điểm tự động (Google Sheet)

Khi học sinh bấm **Nộp bài**, kết quả sẽ tự ghi vào một Google Sheet của cô. Bảng gồm 2 trang tính:

- **Kết quả**: mỗi lần nộp bài là một dòng (thời gian, họ tên, lớp, unit, số câu đúng, %, điểm hệ 10, xếp loại, thời gian làm, điểm từng phần, mã xác nhận).
- **Tổng hợp**: mỗi học sinh một dòng, sắp xếp theo lớp, gồm số lần làm, tỷ lệ cao nhất, tỷ lệ trung bình và điểm cao nhất. Trang này tự cập nhật.

Cô chỉ cần làm một lần, mất khoảng 5 phút.

## Bước 1. Tạo Google Sheet
1. Vào https://sheets.new (đăng nhập bằng tài khoản Google của cô).
2. Đặt tên, ví dụ: `Bảng điểm TA11 – Unit 1-3`.

## Bước 2. Dán mã
1. Trên Google Sheet, chọn **Tiện ích mở rộng → Apps Script** (Extensions → Apps Script).
2. Xoá hết mã có sẵn, dán toàn bộ nội dung file [`apps-script/Code.gs`](apps-script/Code.gs).
3. Bấm biểu tượng **Lưu** (💾).

## Bước 3. Chạy `setup` một lần
1. Ở thanh trên cùng, chọn hàm **setup**, rồi bấm **Chạy** (Run).
2. Google sẽ hỏi quyền: chọn tài khoản của cô, bấm **Nâng cao (Advanced)**, chọn **Đi tới … (không an toàn)** rồi bấm **Cho phép (Allow)**.
   *Cảnh báo này hiện ra vì mã do cô tự tạo, chưa qua kiểm duyệt của Google. Mã chỉ ghi vào chính bảng tính này.*
3. Quay lại Google Sheet: sẽ thấy 2 trang **Kết quả** và **Tổng hợp**.

## Bước 4. Triển khai thành Web App
1. Trong Apps Script, bấm **Triển khai → Tùy chọn triển khai mới** (Deploy → New deployment).
2. Bấm biểu tượng ⚙️ cạnh "Chọn loại", chọn **Ứng dụng web** (Web app).
3. Điền:
   - **Thực thi dưới dạng (Execute as):** *Tôi (Me)*
   - **Người có quyền truy cập (Who has access):** *Bất kỳ ai (Anyone)*
4. Bấm **Triển khai**, rồi sao chép **URL ứng dụng web**. Link có dạng
   `https://script.google.com/macros/s/AKfy.../exec`

Kiểm tra: mở link đó trên trình duyệt, thấy dòng `"ok":true` là được.

## Bước 5. Gắn link vào trang luyện tập
Gửi link `.../exec` cho người quản lý repo để gắn vào trang. Nếu cô tự sửa:
1. Mở file `index.html` trên GitHub, bấm ✏️ (Edit).
2. Tìm dòng `const SHEET_URL = "";` và dán link vào giữa hai dấu nháy:
   `const SHEET_URL = "https://script.google.com/macros/s/AKfy.../exec";`
3. Bấm **Commit changes**. Sau 1–2 phút trang sẽ tự cập nhật.

## Lưu ý
- Nếu học sinh mất mạng lúc nộp bài, trang sẽ báo *Chưa gửi được* và có nút **Gửi lại**. Lần sau mở trang, máy cũng tự gửi lại. Một bài gửi nhiều lần chỉ được ghi một dòng.
- Học sinh vẫn nên chụp màn hình kết quả để lưu.
- Nếu sau này cô sửa mã Apps Script, hãy vào **Triển khai → Quản lý triển khai**, bấm ✏️ rồi chọn **Phiên bản mới**. Làm vậy thì link giữ nguyên.
- Đừng chia sẻ link `.../exec` ra ngoài: ai có link cũng gửi được dòng điểm vào bảng.
