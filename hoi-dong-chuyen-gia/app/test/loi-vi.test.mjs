import { test } from "node:test";
import assert from "node:assert/strict";
import { loiVi } from "../public/loi-vi.js";

test("loiVi: lỗi CLI tiếng Anh hay gặp ra tiếng Việt, giữ chuỗi gốc cắt ngắn sau ·", () => {
  assert.match(loiVi("Error: Claude Code: Claude AI usage limit reached|1761400000"), /^Gói Claude đã chạm hạn mức, thử lại sau · Claude Code: Claude AI usage limit/);
  assert.match(loiVi("Anthropic 429: rate_limit_error"), /^Gói Claude đã chạm hạn mức/);
  assert.match(loiVi("claude CLI exited 1: OAuth token has expired"), /^Token Claude hết hạn hoặc sai — chạy lại claude setup-token và dán vào \.env · /);
  assert.match(loiVi("Claude Code: Invalid API key · Please run /login"), /^Token Claude hết hạn/);
  assert.match(loiVi("Anthropic 400: Your credit balance is too low"), /^Tài khoản API hết credit · /);
  assert.match(loiVi("EPERM: operation not permitted, scandir"), /^macOS chưa cho app đọc thư mục Documents/);
  assert.equal(loiVi("Không thấy phiên hỏi abc"), "Không thấy phiên hỏi abc");
  assert.ok(loiVi("usage limit " + "x".repeat(500)).length < 260);
});

test("loiVi: lỗi của anthropic.mjs và lỗi mạng cũng ra tiếng Việt", () => {
  assert.match(loiVi("Anthropic 529: overloaded_error"), /^Máy chủ Claude đang quá tải, thử lại sau · /);
  assert.match(loiVi("Anthropic API kept refusing after retries"), /^Máy chủ Claude liên tục từ chối/);
  assert.match(loiVi('Anthropic stream error: {"type":"api_error"}'), /^Kết nối tới Claude bị ngắt giữa chừng · /);
  assert.match(loiVi("Chair output hit max_tokens"), /^Câu trả lời của Chủ toạ bị cắt vì quá dài · /);
  assert.match(loiVi("claude CLI exited 127: command not found"), /^Không chạy được Claude Code CLI/);
  assert.match(loiVi("spawn claude ENOENT"), /^Không chạy được Claude Code CLI/);
  assert.match(loiVi(`Unexpected token 'x', "xx" is not valid JSON`), /^Claude trả về dữ liệu sai định dạng/);
  assert.match(loiVi("TypeError: Failed to fetch"), /^Mất kết nối tới máy chủ · /);
  assert.match(loiVi("Claude Code: something odd"), /^Claude Code báo lỗi · Claude Code: something odd$/);
  assert.match(loiVi("Anthropic 400: bad request"), /^Máy chủ Claude báo lỗi · /);
});
