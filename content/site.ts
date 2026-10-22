// Toàn bộ nội dung trang chủ nằm ở đây. Sửa file này là đủ, không cần đụng component.
// Dự án nằm riêng trong content/projects.ts.

export type IconName = "github" | "linkedin" | "x" | "blog";
export type FactIcon = "user" | "pin" | "briefcase" | "cap" | "globe" | "heart";
export type TechIconName =
  | "typescript"
  | "javascript"
  | "csharp"
  | "java"
  | "dotnet"
  | "springboot"
  | "express"
  | "react"
  | "nextjs"
  | "tailwind"
  | "mysql"
  | "postgresql"
  | "mongodb"
  | "neo4j"
  | "redis"
  | "minio"
  | "rustfs"
  | "postgis"
  | "docker"
  | "githubactions"
  | "git"
  | "agentic"
  | "orchestration";

export const site = {
  name: "Nguyễn Đức Anh",
  role: "Software Engineer",
  location: "Hà Nội, Việt Nam",
  timeZone: "Asia/Ho_Chi_Minh",
  url: "https://tenban.dev",
  email: "hello@tenban.dev",
  cv: "/cv.pdf", // đặt file vào public/cv.pdf

  available: true,
  availableText: "Đang tìm cơ hội mới",

  // ── Phần 1: ảnh + thông tin cá nhân ──
  photo: "/profile-2.png", // trong public/; khung ảnh tự lấy tỉ lệ theo photoSize
  photoSize: { width: 2048, height: 1358 },
  photoAlt: "Ảnh chân dung của Nguyễn Đức Anh",
  intro:
    "Software Engineer chuyên sâu về kiến trúc backend hiệu năng cao và xây dựng các hệ thống web/AI-driven quy mô lớn — từ mô hình dữ liệu phức tạp đến tích hợp Agentic & LLM workflows.",
  // Công nghệ chia theo tầng kiến trúc hệ thống. icon: khoá trong components/TechIcon.tsx
  // Muốn bỏ cả nhóm (ví dụ AI) thì xoá nguyên object của nhóm đó.
  tech: [
    {
      group: "Languages & Core",
      items: [
        { name: "TypeScript", icon: "typescript" },
        { name: "JavaScript", icon: "javascript" },
        { name: "C#", icon: "csharp" },
        { name: "Java", icon: "java" },
      ],
    },
    {
      group: "Backend & Architecture",
      items: [
        { name: ".NET", icon: "dotnet" },
        { name: "Spring Boot", icon: "springboot" },
        { name: "Express", icon: "express" },
      ],
    },
    {
      group: "Frontend & Styling",
      items: [
        { name: "React", icon: "react" },
        { name: "Next.js", icon: "nextjs" },
        { name: "Tailwind CSS", icon: "tailwind" },
      ],
    },
    {
      group: "Data & Storage",
      items: [
        { name: "MySQL", icon: "mysql" },
        { name: "PostgreSQL", icon: "postgresql" },
        { name: "MongoDB", icon: "mongodb" },
        { name: "Neo4j", icon: "neo4j" },
        { name: "Redis", icon: "redis" },
        { name: "MinIO", icon: "minio" },
        { name: "RustFS", icon: "rustfs" },
        { name: "PostGIS", icon: "postgis" },
      ],
    },
    {
      group: "DevOps & Infrastructure",
      items: [
        { name: "Docker", icon: "docker" },
        { name: "CI/CD", icon: "githubactions" },
        { name: "Git", icon: "git" },
      ],
    },
    {
      group: "AI & Intelligent Systems",
      items: [
        { name: "Agentic Workflows", icon: "agentic" },
        { name: "LLM Orchestration", icon: "orchestration" },
      ],
    },
  ] satisfies { group: string; items: { name: string; icon: TechIconName }[] }[],
  facts: [
    { icon: "pin", label: "Địa điểm", value: "Hà Nội, Việt Nam" },
    { icon: "briefcase", label: "Kinh nghiệm", value: "1+ năm · Software Engineer" },
    { icon: "cap", label: "Học vấn", value: "Cử nhân CNTT - Đại học Công nghệ ĐHQGHN (UET)" },
    { icon: "globe", label: "Ngoại ngữ", value: "Tiếng Anh (IELTS 6.0)" },
  ] satisfies { icon: FactIcon; label: string; value: string }[],

  socials: [
    { label: "GitHub", href: "https://github.com/ducanhdangcode", icon: "github" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/anh-nguyen-duc-a996a12a6/", icon: "linkedin" },
  ] satisfies { label: string; href: string; icon: IconName }[],

  // ── Phần 2: kinh nghiệm (mới nhất ở trên) ──
  experience: [
    {
      company: "ELCOM Corporation",
      type: "Full-time",
      role: "Software Engineer",
      period: "05/2026 — Nay",
      location: "Hà Nội",
      bullets: [
        "Phát triển hệ thống hỗ trợ điều tra ứng dụng AI: số hóa dữ liệu hồ sơ, tự động trích xuất thực thể và liên kết quan hệ, tích hợp trợ lý hỏi đáp tri thức và engine xuất biểu mẫu báo cáo chuẩn hóa.",
        "Phát triển nền tảng số hóa quy trình hành chính công tích hợp AI: hỗ trợ thẩm định, tra cứu tri thức tài liệu nội bộ qua LLM và tự động sinh dự thảo văn bản, báo cáo theo mẫu.",
        "Thiết kế và triển khai hệ thống quản lý đào tạo, bồi dưỡng cán bộ liên đơn vị cho Bộ Nội vụ: số hóa toàn diện quy trình lập kế hoạch, điều phối chỉ tiêu, theo dõi tiến độ đào tạo và quản lý chứng chỉ tập trung.",
        "Xây dựng nền tảng AI Admin: cho phép quản lý Workspace độc lập, tải lên kho tri thức tùy chỉnh (Knowledge Base/RAG), cấu hình các dịch vụ AI và AI Agent trực quan; đóng gói toàn bộ luồng xử lý thành API Key để tích hợp nhanh vào các hệ thống bên ngoài."
      ],
      stack: ["Next.js", ".NET", "PostgreSQL", "Redis", "Docker", "MinIO", "Agentic Workflows", "LLM Orchestration"],
    },
    {
      company: "ELCOM Corporation",
      type: "Thực tập",
      role: "Software Engineer Intern",
      period: "01/2026 - 05/2026",
      location: "Hà Nội",
      bullets: [
        "Phát triển phần mềm xử lý ảnh vệ tinh tích hợp AI & GIS: tự động phân loại lớp phủ bề mặt nhằm giám sát biến động mục đích sử dụng đất, kết hợp mô hình phân tích không gian phục vụ cảnh báo ngập lụt theo thời gian thực.",
      ],
      stack: ["Next.js", ".NET", "PostgreSQL", "PostGIS", "Redis", "Docker", "MinIO", "Kafka"],
    },
    {
      company: "Sao Khue Edtech",
      type: "Thực tập",
      role: "Software Engineer Intern",
      period: "06/2025 - 01/2026",
      location: "Hà Nội",
      bullets: [
        "Tham gia phát triển hệ thống nền tảng học liệu số quốc gia (hoclieu.vn): thiết kế kiến trúc xử lý tải cao phục vụ hàng triệu người dùng, tối ưu hóa ngân hàng câu hỏi/bài giảng tương tác và bảo đảm tính ổn định, độ trễ thấp cho các kỳ kiểm tra trực tuyến diện rộng.",
        "Thiết kế và phát triển hệ thống quản lý học tập (LMS) cấp trường đại học (triển khai tại CMCU, DNU): số hóa toàn diện quy trình đào tạo theo học chế tín chỉ, quản lý học liệu tương tác, tổ chức thi/đánh giá trực tuyến và đồng bộ dữ liệu kết quả học tập tập trung."
      ],
      stack: ["Next.js", ".NET", "MySQL", "MongoDB", "Redis", "AWS"],
    },
  ],
};
