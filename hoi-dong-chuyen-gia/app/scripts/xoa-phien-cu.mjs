#!/usr/bin/env node
// Xoá phiên họp và lượt hỏi gốc cũ hơn N ngày (mặc định 180), theo nguyên tắc chỉ lưu dữ liệu trong thời gian
// cần thiết (Luật Bảo vệ dữ liệu cá nhân 2025). Phiên mẫu (tên có "example") và phiếu quyết định không bị xoá;
// phiếu là hồ sơ nội bộ của văn phòng, xoá bằng tay khi hết hạn lưu.
//   node app/scripts/xoa-phien-cu.mjs [--ngay 180] [--that]   (không có --that thì chỉ liệt kê, không xoá)
import fs from "node:fs";
import path from "node:path";
import { SESSIONS_DIR } from "../lib/env.mjs";

const args = process.argv.slice(2);
const i = args.indexOf("--ngay");
const soNgay = Math.max(1, Number(i >= 0 ? args[i + 1] : 180) || 180);
const that = args.includes("--that");
const moc = Date.now() - soNgay * 86400000;

/** Các thư mục phiên (và lượt hỏi gốc) cũ hơn mốc, trừ phiên mẫu. */
export function phienCu(dir, mocMs) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const d of fs.readdirSync(dir)) {
    const p = path.join(dir, d);
    if (/example/.test(d) || !fs.statSync(p).isDirectory()) continue;
    if (d === "hoi-goc") { for (const f of fs.readdirSync(p)) { const q = path.join(p, f); if (fs.statSync(q).mtimeMs < mocMs) out.push(q); } continue; }
    const m = d.match(/^(\d{4}-\d{2}-\d{2})/);
    const t = m ? Date.parse(m[1]) : fs.statSync(p).mtimeMs;
    if (t < mocMs) out.push(p);
  }
  return out;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const ds = phienCu(SESSIONS_DIR, moc);
  console.log(`${ds.length} mục cũ hơn ${soNgay} ngày trong ${SESSIONS_DIR}${that ? "" : " (chỉ liệt kê; thêm --that để xoá)"}`);
  for (const p of ds) { console.log(`- ${path.basename(p)}`); if (that) fs.rmSync(p, { recursive: true, force: true }); }
}
