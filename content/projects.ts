// Mỗi dự án = 1 thẻ trong "Selected Projects" + 1 trang case study tại /projects/[slug].
// Thứ tự trong mảng = thứ tự hiển thị. Nên giữ 3–4 dự án.

export type Project = {
  slug: string;
  title: string;
  tagline: string; // 1 câu về giá trị thực tế
  year: string;
  role: string;
  timeline: string;
  team: string;
  stack: string[];
  cover: string;
  coverAlt: string;
  // Ảnh chụp màn hình điện thoại (dọc). Có thì hiện khung điện thoại thay cho ảnh cover.
  screens?: { src: string; alt: string }[];
  links: { live?: string; code?: string };
  problem: string;
  solution: string; // tóm tắt ngắn cho thẻ ở trang chủ
  architecture: { label: string; sub: string }[]; // luồng từ trái sang phải
  details: string[]; // các đoạn "Giải pháp" ở trang case study
};

// Tạm tắt: thẻ dự án không có link (tiêu đề, ảnh, Case study, Live demo). Nút GitHub vẫn hiện.
// Đổi thành true khi trang case study và các link đã sẵn sàng.
export const projectLinks = false;

export const projects: Project[] = [
  {
    slug: "RepoLensX",
    title: "RepoLensX",
    tagline: "Nền tảng phân tích mã nguồn kết hợp Roslyn AST, Neo4j và pgvector giúp trực quan hóa cấu trúc gọi hàm và đo lường phạm vi ảnh hưởng (blast radius) khi refactor code.",
    year: "2026",
    role: "Software Engineer",
    timeline: "4 tháng",
    team: "3 người",
    stack: ["Next.js", ".NET 8", "PostgreSQL", "Redis", "Docker"],
    cover: "/repolensx.png",
    coverAlt: "Màn hình Tổng quan của RepoLensX: repositories, code graph, MCP calls và ingestion pipeline",
    links: { code: "https://github.com/ducanhdangcode/RepoLensX" },
    problem:
      "RAG truyền thống bị đứt gãy ngữ cảnh khi phân tích mã nguồn do chia nhỏ file ngẫu nhiên; không truy vết được luồng phụ thuộc đa tầng (multi-hop) và nhồi ngữ cảnh dung lượng lớn dẫn tới ảo giác (hallucination) cùng chi phí token cao khi đánh giá phạm vi ảnh hưởng (blast radius).",
    solution:
      "Trích xuất cây cú pháp trừu tượng (AST) qua Roslyn để dựng đồ thị gọi hàm trên Neo4j, kết hợp pgvector để tìm kiếm ngữ nghĩa; áp dụng thuật toán cắt tỉa ngữ cảnh (context pruning) và truy vết ngược dòng để xác định chính xác các điểm ảnh hưởng khi refactor code.",
    architecture: [
      { label: "Next.js", sub: "Dashboard" },
      { label: ".NET API", sub: "REST + idempotency" },
      { label: "Redis", sub: "Cache · lock" },
      { label: "PostgreSQL", sub: "Ledger" },
    ],
    details: [
      "Mình bắt đầu bằng EXPLAIN ANALYZE cho 10 truy vấn chậm nhất. Phần lớn thời gian nằm ở vòng lặp lấy chi tiết từng giao dịch, nên mình gộp lại thành một truy vấn với index phủ (covering index) theo merchant và ngày.",
      "Với webhook gửi trùng, mỗi request mang một idempotency key. API giữ advisory lock theo key đó trong transaction, nên hai request đến cùng lúc chỉ có một được ghi vào sổ cái.",
      "Kết quả tổng hợp theo ngày được cache trên Redis và chỉ làm mới khi có giao dịch mới, đẩy tỉ lệ cache hit lên 94%.",
    ],
  },
  {
    slug: "LumiLearn",
    title: "LumiLearn",
    tagline: "Ứng dụng di động hỗ trợ học tập chuyên biệt dành cho người khiếm thị, tối ưu hóa trải nghiệm tiếp cận thông tin giáo dục thông qua chuẩn Accessibility và VoiceOver.",
    year: "2025",
    role: "Software Engineer",
    timeline: "6 tuần",
    team: "Solo",
    stack: ["React Native", ".NET", "MySQL", "AWS"],
    cover: "/lumilearn1.png",
    coverAlt: "Màn hình Course Details của LumiLearn",
    screens: [
      {
        src: "/lumilearn1.png",
        alt: "LumiLearn: màn hình Course Details của khoá Computer Science Fundamentals, danh sách bài học và flashcard",
      },
      {
        src: "/lumilearn2.png",
        alt: "LumiLearn: màn hình câu hỏi trắc nghiệm về cấu trúc dữ liệu, câu 4/5",
      },
    ],
    links: { code: "https://github.com/ducanhdangcode/Lumi-Learn" },
    problem:
      "Người khiếm thị gặp rào cản lớn khi dùng các trình đọc màn hình mặc định do hệ thống thiếu thẻ định danh tiếp cận, phân cấp cấu trúc thông tin kém và thiếu các thao tác cử chỉ hỗ trợ điều hướng nhanh.",
    solution:
      "Xây dựng cấu trúc điều hướng bằng cử chỉ trực quan, gắn nhãn ngữ cảnh chính xác cho từng thành phần giao diện, đồng thời chuyển đổi nội dung bài giảng thành định dạng âm thanh và văn bản chuẩn hóa, giúp người dùng tự chủ hoàn toàn trong quá trình tiếp thu kiến thức.",
    architecture: [
      { label: "Client", sub: "Reconnect + backoff" },
      { label: "Gateway", sub: "WebSocket × N" },
      { label: "Redis", sub: "Pub/Sub" },
      { label: "PostgreSQL", sub: "Message store" },
    ],
    details: [
      "Mỗi phòng chat có một bộ đếm tăng dần trong Redis. Tin nhắn mang số thứ tự, nên client phát hiện được chỗ hổng và tự xin lại phần còn thiếu thay vì hiển thị sai.",
      "Gateway không giữ trạng thái: mọi instance cùng subscribe kênh Redis của phòng mà nó đang phục vụ, nên có thể scale ngang chỉ bằng cách thêm container.",
      "Mình viết kịch bản k6 mô phỏng 5.000 kết nối đồng thời, gửi tin liên tục trong 30 phút để đo độ trễ và uptime trước khi ra mắt.",
    ],
  }
];

export function getProject(slug: string) {
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) return null;
  return {
    project: projects[index],
    index,
    next: projects[(index + 1) % projects.length],
  };
}
