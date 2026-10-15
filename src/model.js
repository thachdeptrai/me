/** Static, public-source-based portfolio content. No enterprise datasets or secrets. */
export const CHAPTERS=[
 {id:'arrival',label:'Khởi đầu',scene:'core'},
 {id:'realities',label:'Hai thế giới',scene:'core'},
 {id:'warehouse',label:'Kho số',scene:'warehouse'},
 {id:'game',label:'Mạng game',scene:'network'},
 {id:'workshop',label:'Xưởng công nghệ',scene:'workshop'},
 {id:'projects',label:'Dự án',scene:'workshop'},
 {id:'lab',label:'Engineering Lab',scene:'network'},
 {id:'contact',label:'Liên hệ',scene:'core'}
];
export const PACKET=[
 {name:'CLIENT',description:'Unity / LibGDX nhận thao tác, tạo dữ liệu gửi đi. Giao thức thực tế phụ thuộc phiên bản client.'},
 {name:'WEBSOCKET',description:'Đối với trình duyệt WebGL, kết nối WebSocket vận chuyển khung dữ liệu nhị phân tới gateway.'},
 {name:'GATEWAY',description:'Gateway có thể chuyển dữ liệu giữa WebSocket và TCP theo framing đã thống nhất; đây là sơ đồ minh họa.'},
 {name:'JAVA SERVER',description:'Java server kiểm tra packet, quyền hạn và trạng thái trước khi chạy logic gameplay.'},
 {name:'DATABASE',description:'MariaDB/MySQL lưu dữ liệu cần duy trì; không phải mọi packet đều đọc/ghi dữ liệu.'},
 {name:'RESPONSE',description:'Server gửi phản hồi về client qua luồng kết nối tương ứng để cập nhật trạng thái.'}
];
export const PIPELINE=[
 {name:'SOURCE',description:'Đẩy thay đổi mã nguồn vào Git để có revision có thể truy vết.'},
 {name:'VERIFY',description:'Chạy kiểm tra cấu hình, syntax, test và audit nguồn trước khi build.'},
 {name:'BUILD',description:'Tạo output đúng nền tảng: web tĩnh, Android, iOS hoặc Windows.'},
 {name:'PACKAGE',description:'Đóng gói artifact và đối chiếu định dạng, thông tin phiên bản.'},
 {name:'RELEASE',description:'Phát hành artifact và ghi chú thay đổi thông qua quy trình đã thiết lập.'},
 {name:'DEPLOY',description:'Đưa website lên hosting hoặc phân phối gói cài đặt đến đúng nơi.'}
];
export const ARCHITECTURE=[
 {id:'client',name:'CLIENT',detail:'UI/gameplay chạy tại máy người dùng. Java Android, Unity C# và LibGDX Java là các môi trường khác nhau, không nên gộp thành một client.'},
 {id:'transport',name:'TRANSPORT',detail:'WebSocket cho browser, TCP cho nhiều game client native. Gateway chỉ được dùng khi các bên thống nhất protocol, handshake và framing.'},
 {id:'server',name:'SERVER',detail:'Java game server xử lý NPC, boss, shop, trạng thái nhân vật. Nghiệp vụ và quyền hạn phải được kiểm tra ở server.'},
 {id:'storage',name:'STORAGE',detail:'MySQL/MariaDB hoặc MongoDB tùy dự án; cần xác thực, phân quyền và lưu giao dịch an toàn.'},
 {id:'delivery',name:'DELIVERY',detail:'Apache, Cloudflare, reverse proxy, GitHub Actions và artifact release tạo nên tầng phân phối và vận hành.'}
];
export const BENCH={
 mobile:{name:'Mobile experience',description:'React Native · JavaScript · TypeScript/TSX · Redux · Axios · Firebase. Riêng PhonePulse được kiểm chứng là Android Java/Gradle, không phải React Native.'},
 game:{name:'Interactive game systems',description:'Unity C# / IL2CPP, LibGDX Java, Java server, packet networking và debug gameplay. Tìm hiểu từ client đến server.'},
 backend:{name:'Backend & data',description:'Node.js · Express · REST APIs · PHP · MySQL/MariaDB · MongoDB. Thiết kế luồng dữ liệu và xử lý dữ liệu hợp lệ ở máy chủ.'},
 infra:{name:'Ship it for real',description:'GitHub Actions · CI/CD · APK/IPA/Windows builds · VPS · Apache · Cloudflare · WebSocket reverse proxy · DNS/HTTPS.'}
};
export const PROJECTS=[
 {slug:'nrogt',name:'NroGT Releases',category:'MULTI-PLATFORM GAME DISTRIBUTION',repo:'NroGT-Releases',stack:'Windows · Android · iOS · GitHub Releases',problem:'Phân phối bản game theo nhiều nền tảng mà không đánh đồng cách cài đặt trên mỗi thiết bị.',approach:'README công khai hướng dẫn file ZIP cho Windows, APK cho Android và IPA chưa ký cho iOS/iPadOS.',evidence:'Repository phát hành và trang Releases có thể đối chiếu gói tải theo phiên bản; không suy diễn về mức độ tương thích thực tế.',source:'https://github.com/thachdeptrai/NroGT-Releases',extra:'https://github.com/thachdeptrai/NroGT-Releases/releases'},
 {slug:'web-kpah',name:'Nghiện KPAH',category:'GAME COMMUNITY PORTAL',repo:'web-kpah',stack:'PHP · MariaDB · Apache · GitHub Actions',problem:'Xây portal cho người chơi với luồng tài khoản, nhân vật, xếp hạng và giao dịch cần tách khỏi game server.',approach:'README và cấu trúc mã nguồn mô tả router, trang người chơi, ví VNĐ, hệ thống tích điểm và các kiểm tra bảo mật.',evidence:'Có cấu trúc PHP route, test, workflows và tài liệu public; không khẳng định xử lý thanh toán production hoặc an ninh tuyệt đối.',source:'https://github.com/thachdeptrai/web-kpah',extra:'https://nghienkpah.io.vn'},
 {slug:'20-10',name:'After The Letter',category:'INTERACTIVE WEB EXPERIENCE',repo:'20-10',stack:'JavaScript · Three.js · WebAudio · CSS',problem:'Biến một lời nhắn thành trải nghiệm có tương tác nhưng vẫn hoạt động trên mobile và hạn chế chuyển động.',approach:'V3 mô tả phong thư, thiên hà, các ngôi sao, thiệp QR, export, fallback WebGL/Canvas và reduced-motion.',evidence:'README, thư mục js/, vendor/ và tests/ trong repository công khai xác nhận cấu trúc trải nghiệm.',source:'https://github.com/thachdeptrai/20-10',extra:'https://thachdeptrai.github.io/20-10/'},
 {slug:'phonepulse',name:'PhonePulse Android',category:'NATIVE ANDROID CLIENT',repo:'PhonePulse',stack:'Java · Android Gradle · Retrofit · Room',problem:'Tổ chức ứng dụng Android thương mại điện tử với giao diện nhiều màn hình, truy cập dữ liệu và trạng thái giỏ hàng.',approach:'Source chứa Android Activity/Fragment, adapter, Room DAO, Retrofit và các module liên quan sản phẩm/đơn hàng.',evidence:'app/build.gradle.kts và app/src/main/java xác minh native Android Java. Không phải React Native.',source:'https://github.com/thachdeptrai/PhonePulse'},
 {slug:'api-phonepulse',name:'PhonePulse API',category:'SERVICE & DATA LAYER',repo:'APIPhonePulse',stack:'Node.js · Express · Mongoose · Socket.IO',problem:'Tách dữ liệu và nghiệp vụ ứng dụng khỏi client Android.',approach:'Code công khai chứa routes/controllers/models cho sản phẩm, giỏ hàng, tài khoản, đơn hàng và chat; package.json khai báo Express/Mongoose.',evidence:'Cấu trúc module và dependencies đã kiểm tra; không công bố cấu hình, credential hoặc dữ liệu thật.',source:'https://github.com/thachdeptrai/APIPhonePulse'},
 {slug:'panel-phonepulse',name:'PhonePulse Admin',category:'OPERATIONS PANEL',repo:'PanelAdminPhonePulse',stack:'PHP · MongoDB · Guzzle · JavaScript',problem:'Tách tác vụ vận hành và quản trị khỏi giao diện mua hàng.',approach:'Cấu trúc public gồm pages quản lý sản phẩm, đơn hàng, người dùng, thông báo và các endpoint AJAX.',evidence:'composer.json xác nhận MongoDB/Guzzle; repo có pages/, ajax/ và dashboard assets, không chứng minh mức độ sẵn sàng production.',source:'https://github.com/thachdeptrai/PanelAdminPhonePulse'}
];
export const REALITIES={
 operations:'Công việc vận hành yêu cầu nhìn đúng trạng thái dữ liệu, hiểu nghiệp vụ và phản ứng với vấn đề phát sinh. Đây là kinh nghiệm nghề nghiệp tại VinFast, không phải sản phẩm cá nhân.',
 engineering:'Các project game, mobile, web và hạ tầng là việc mình tự nghiên cứu, xây dựng ngoài công việc. Mình không gắn chúng với phạm vi trách nhiệm tại VinFast.'
};
export const TERMINAL_COMMANDS={
 help:()=> 'LỆNH: help · whoami · work · stack · projects · architecture · contact · github · clear',
 whoami:()=> 'Nguyễn Ngọc Thạch | Warehouse Data / SAP EWM Operations @ VinFast | Independent builder',
 work:()=> 'SAP EWM, dữ liệu kho, kiểm tra tồn kho, xử lý queue và vận hành nghiệp vụ.',
 stack:()=> 'Java · C# · Unity · LibGDX · JavaScript · TSX · PHP · Express · MySQL · MongoDB',
 projects:()=> 'NroGT Releases · web-kpah · 20-10 · PhonePulse · APIPhonePulse · PanelAdminPhonePulse',
 architecture:()=> 'Client → transport → server → storage → response. Dữ liệu mô phỏng, không phải production.',
 contact:()=> 'ngocthachgenz@gmail.com · 0867487105',
 github:()=> 'https://github.com/thachdeptrai'
};
export function terminalResult(raw){const command=String(raw).trim().toLowerCase();if(!command)return '';if(command==='clear')return null;return Object.hasOwn(TERMINAL_COMMANDS,command)?TERMINAL_COMMANDS[command]():`Không có lệnh "${command.slice(0,30)}". Gõ help.`;}
export function validProject(slug){return PROJECTS.find(p=>p.slug===slug)||null;}
export function nextIndex(index,length){return (index+1)%length;}
export function projectHref(slug){const p=validProject(slug);return p?`?project=${encodeURIComponent(p.slug)}#projects`:null;}
