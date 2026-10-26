// Lỗi tiếng Anh hay gặp từ Claude CLI/API/macOS → câu tiếng Việt; chuỗi gốc (cắt ngắn) giữ sau "·" để chẩn đoán.
// Dùng chung cho trang (app.js) và server (hoi-goc.mjs).
const MAU = [
  [/EPERM|Operation not permitted/i, "macOS chưa cho app đọc thư mục Documents — mở Cài đặt hệ thống › Quyền riêng tư › Tệp và thư mục"],
  [/credit balance/i, "Tài khoản API hết credit"],
  [/usage limit|rate.?limit|hit your (usage )?limit|limit reached|\b429\b/i, "Gói Claude đã chạm hạn mức, thử lại sau"],
  [/oauth|authenticat|\b401\b|invalid api key|please run \/login/i, "Token Claude hết hạn hoặc sai — chạy lại claude setup-token và dán vào .env"],
  [/Anthropic (5\d\d)\b|overloaded/i, "Máy chủ Claude đang quá tải, thử lại sau"],
  [/kept refusing after retries/i, "Máy chủ Claude liên tục từ chối sau nhiều lần thử, thử lại sau"],
  [/Anthropic stream error/i, "Kết nối tới Claude bị ngắt giữa chừng"],
  [/max_tokens/i, "Câu trả lời của Chủ toạ bị cắt vì quá dài"],
  [/claude CLI exited|ENOENT|spawn .*claude/i, "Không chạy được Claude Code CLI (chưa cài, hoặc sai CLAUDE_BIN)"],
  [/not valid JSON|Unexpected token|Unexpected end of JSON|in JSON at position/i, "Claude trả về dữ liệu sai định dạng, thử lại"],
  [/Failed to fetch|NetworkError|Load failed|ECONNREFUSED|ECONNRESET/i, "Mất kết nối tới máy chủ"],
  [/^Claude Code:/, "Claude Code báo lỗi"],
  [/^Anthropic \d{3}:/, "Máy chủ Claude báo lỗi"],
];

export function loiVi(msg, n = 140) {
  const s = String(msg ?? "").replace(/^Error:\s*/, "").trim();
  const hit = MAU.find(([re]) => re.test(s));
  return hit ? `${hit[1]} · ${s.length > n ? s.slice(0, n - 1) + "…" : s}` : s;
}
