// Biographical copy comes from the supplied portfolio brief.
// Published case-study evidence is from the owner's public GitHub release.
// No fabricated metrics, job titles, application screenshots or customer claims.
export const fields = {
  mobile: { name: '01 / MOBILE', description: 'React Native, TypeScript, Redux và API — từ giao diện đến dữ liệu trên di động.' },
  game: { name: '02 / GAME', description: 'Unity, LibGDX và Java — tìm hiểu cả game client, server lẫn gameplay.' },
  java: { name: '03 / JAVA', description: 'Game server, boss, NPC, shop, dữ liệu người chơi và công cụ quản trị.' },
  backend: { name: '04 / BACKEND', description: 'Java, Node.js, PHP — xử lý logic, REST API và giao tiếp giữa các hệ thống.' },
  web: { name: '05 / WEB', description: 'Website, bảng xếp hạng, công cụ quản trị và Unity WebGL trong trình duyệt.' },
  network: { name: '06 / NETWORKING', description: 'WebSocket ↔ TCP: đọc luồng packet, debug handshake và kết nối client / server.' },
  infra: { name: '07 / INFRASTRUCTURE', description: 'VPS, Apache, Cloudflare, SSL, DNS và reverse proxy — đưa project lên môi trường sử dụng.' },
  enterprise: { name: '08 / SAP & ENTERPRISE', description: 'Công việc hiện tại tại VinFast: vận hành SAP EWM, dữ liệu kho, queue và quy trình nghiệp vụ.' }
};

export const networkSteps = [
  {name:'BROWSER',text:'Người chơi mở web. Browser tải tài nguyên và khởi tạo Unity WebGL client.'},
  {name:'UNITY WEBGL',text:'Game client chạy trong trình duyệt. Phía trình duyệt dùng WebSocket để giao tiếp với gateway.'},
  {name:'WSS',text:'Kết nối WebSocket được bảo vệ bằng TLS. Client gửi và nhận dữ liệu nhị phân qua kết nối này.'},
  {name:'CLOUDFLARE',text:'Điểm vào theo tên miền: DNS, TLS ở edge và proxy tới máy chủ gốc theo cấu hình triển khai.'},
  {name:'APACHE',text:'Reverse proxy định tuyến /ws tới gateway, đồng thời phục vụ tài nguyên WebGL với MIME type và Content-Encoding phù hợp.'},
  {name:'NODE.JS GATEWAY',text:'Gateway nối WebSocket với TCP, duy trì một kết nối TCP cho mỗi client và xếp hàng dữ liệu khi TCP chưa sẵn sàng.'},
  {name:'TCP',text:'Luồng byte được chuyển đến game server. Client, gateway và server phải thống nhất định dạng packet và trình tự handshake.'},
  {name:'JAVA GAME SERVER',text:'Server đọc packet, xử lý trạng thái người chơi, gameplay và phản hồi lại qua kết nối. Không phải mọi packet đều ghi database.'},
  {name:'MARIADB',text:'Lưu dữ liệu cần tồn tại lâu dài: tài khoản, người chơi và các hệ thống liên quan. Đây là tầng persistence trong kiến trúc.'}
];

export const cases = [
  {
    title:'Phát hành game cho nhiều nền tảng',
    problem:'Đưa NroGT tới người dùng Android, iOS và Windows qua các gói tải riêng.',
    cause:'Mỗi nền tảng sử dụng một định dạng đóng gói và cách cài đặt khác nhau.',
    solution:'Tổ chức một GitHub Release với các asset APK, IPA và ZIP, ghi rõ nền tảng trong release notes.',
    result:'Release công khai NroGT v1.0 có NroGT.apk, NroGT.ipa và NroGT.zip. Kết quả này xác nhận các gói đã được phát hành; không khẳng định tương thích với mọi thiết bị.',
    note:'Nguồn: NroGT v1.0, phát hành 17.09.2026; kiểm tra qua GitHub API ngày 19.09.2026.',
    source:'https://github.com/thachdeptrai/NroGT-Releases/releases/tag/v1.0'
  }
];
