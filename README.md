# THACH.OS V2 — Beyond The Interface

Portfolio 3D của **Nguyễn Ngọc Thạch** — Technology • Systems • Development.

Hiện tại: **VinFast · SAP EWM / Warehouse Operations**.

## Chạy local

Yêu cầu Node.js 18 trở lên. Không cần cài dependency.

```bash
npm run dev
```

Mở `http://localhost:4173`. Chạy `npm run check` để kiểm tra syntax, asset và liên kết nội bộ; chạy `npm test` để kiểm tra cấu trúc V2 và regression.

## GitHub Pages

Repo dự kiến: `thachdeptrai/me` (public).

Sau khi đẩy mã nguồn lên nhánh `main`, vào **Settings → Pages → Build and deployment**:

- Source: **Deploy from a branch**
- Branch: **main**
- Folder: **/ (root)**
- Save

URL dự kiến sau khi Pages triển khai thành công: `https://thachdeptrai.github.io/me/`.
Địa chỉ này là cấu hình dự kiến, không xác nhận việc đã xuất bản.

Không cần secret để triển khai bản tĩnh. GitHub Actions nay chạy kiểm tra source/preview; Pages tiếp tục dùng nhánh `main` sau khi PR được review và merge. Tất cả đường dẫn asset là tương đối nên hoạt động dưới `/me/`.

## Các trải nghiệm mới trong THACH.OS V2

- **Cinematic chapters:** chỉ mục điều hướng 8 đích, tiến độ chapter, camera WebGL thay đổi theo scroll trong phần hero (không chiếm quyền scroll, không can thiệp khi đã chọn node hoặc bật reduced motion).
- **Experience mode:** Cinema → Focus → Lite; lựa chọn được lưu cục bộ. Lite/Focus tạm dừng chuyển động để tiết kiệm tài nguyên.
- **Command palette:** `Ctrl/⌘ + K` hoặc `/` (khi không gõ văn bản); tìm chương, mở GitHub, điều hướng tới lab.
- **Engineering Lab:** Packet Journey (Play/Pause/Step/Reset/Speed), Architecture Inspector, terminal chỉ nhận lệnh cố định và release pipeline mô phỏng. Mọi mô phỏng đều được gắn nhãn.
- **Share project:** sao chép liên kết `?project=nro#work`, `?project=server#work`, `?project=mobile#work`, `?project=cross#work`.
- **CI:** syntax/asset/anchor test, regression test, HTTP smoke GitHub Pages `/me/`, browser smoke và screenshot desktop/mobile khi runner có Chrome.

Các file V2 bổ sung: `assets/os-v2.css`, `assets/os-v2.js`, `scripts/test-v2.mjs`, `.github/workflows/portfolio-ci.yml`. Hiện tại **không cần** bundler, React hay npm runtime dependencies. Source gốc được giữ để bảo toàn các tính năng đang sử dụng.

## Nội dung

- Universe WebGL 3D: kéo để xoay, chọn 8 lĩnh vực, bật/tắt chuyển động.
- VinFast / SAP EWM, hai thế giới nghề nghiệp và project cá nhân.
- 8 nhóm công nghệ, 4 nhóm project, sơ đồ networking tương tác.
- Luồng source → build → deploy; case studies, hành trình, Thach Labs.
- GitHub API công khai cho repository, ngôn ngữ, sao, lần push gần nhất và release mới nhất.
- Email, điện thoại, sao chép email; menu mobile và tab hỗ trợ bàn phím.
- Không có tracking, token, backend, số liệu giả hoặc ảnh ứng dụng giả.

## Cấu trúc

- `index.html`: nội dung, project, timeline, metadata.
- `assets/style.css`: giao diện và responsive.
- `assets/universe.js`: WebGL renderer riêng, không cần thư viện ngoài.
- `assets/app.js`: các tương tác, accessibility và API công khai.
- `assets/data.js`: nội dung node và case study.
- `scripts/`: server phát triển và kiểm tra.

Font Google Fonts là tùy chọn; có font hệ thống dự phòng. Nội dung, 3D và các tương tác không phụ thuộc font từ mạng.

## Cập nhật nội dung

Chỉnh phần tiểu sử và dự án trong `index.html`; case study và node trong `assets/data.js`.
Không thêm chức danh chưa đúng thực tế, kết quả chưa được xác nhận hay ảnh chụp giả.
Thông tin cá nhân công khai lấy từ brief do chủ website cung cấp. Case study dùng bằng chứng từ release GitHub công khai; không xuất bản chi tiết lịch sử trò chuyện.

NroGT v1.0 và 3 file APK / IPA / Windows đã được kiểm tra qua GitHub API ngày 19.09.2026.
PhonePulse là project Android sử dụng Gradle; không mô tả nó là ứng dụng React Native.
Khi API không truy cập được hoặc bị giới hạn, web giữ các link project đã xác minh và nói rõ dữ liệu trực tiếp tạm không khả dụng.

## Hiệu năng & accessibility

WebGL giới hạn pixel ratio 1.75, dừng khi ra khỏi viewport / tab bị ẩn.
Khi WebGL không có, scene tự chuyển sang chiếu phối cảnh 3D bằng Canvas, giới hạn 30 fps và pixel ratio 1.5.
Tôn trọng `prefers-reduced-motion`, có nút tạm dừng và fallback khi WebGL không khả dụng.
Nội dung chính nằm trong HTML; các tab project dùng ARIA và hỗ trợ phím mũi tên / Home / End.
Không dùng scroll hijacking. Sơ đồ packet là mô phỏng kiến trúc, không phải live telemetry.

© 2026 Nguyễn Ngọc Thạch.

## Review & QA V2

Mọi thay đổi V2 nằm trong `feat/thach-os-v2-cinematic` trước khi merge. Xem `docs/THACH-OS-V2.md`, `docs/QA-V2.md` và `docs/ASSET-LICENSES.md` để đọc kiến trúc, phạm vi test và giới hạn chưa xác minh. Không tự động triển khai nhánh feature lên production.
