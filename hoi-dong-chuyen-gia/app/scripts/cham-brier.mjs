#!/usr/bin/env node
// Chấm độ chính xác dự báo của hội đồng (điểm Brier) từ các phiếu đã điền kết quả thật.
// Trong mục "## Dự báo" của phiếu, đánh dấu ☒ (hoặc [x]) vào "Xảy ra" hay "Không xảy ra".
//   node app/scripts/cham-brier.mjs [thư mục phiếu, mặc định phieu/]
// Brier = trung bình (xác suất − kết quả)², 0 là hoàn hảo, 0,25 là đoán mò 50%.
import fs from "node:fs";
import path from "node:path";
import { REPO_ROOT, env } from "../lib/env.mjs";

export function docDuBao(text) {
  const muc = String(text).split(/^## /m).find((m) => m.startsWith("Dự báo"));
  if (!muc) return null;
  const p = muc.match(/\*\*(\d{1,3})%\*\*/);
  if (!p) return null;
  const danh = (nhan) => new RegExp(`(?:☒|\\[x\\]|\\[X\\]|✔|✓)\\s*${nhan}`).test(muc);
  const ketQua = danh("Không xảy ra") ? 0 : danh("Xảy ra") ? 1 : null;
  return { xac_suat: Number(p[1]) / 100, ket_qua: ketQua };
}

export function brier(list) {
  const da = list.filter((x) => x && x.ket_qua != null);
  if (!da.length) return null;
  return da.reduce((s, x) => s + (x.xac_suat - x.ket_qua) ** 2, 0) / da.length;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const dir = path.resolve(process.argv[2] || env("PHIEU_DIR") || path.join(REPO_ROOT, "phieu"));
  const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith(".md") && !f.startsWith("00-")) : [];
  const ds = files.map((f) => ({ f, ...(docDuBao(fs.readFileSync(path.join(dir, f), "utf8")) || {}) })).filter((x) => x.xac_suat != null);
  const da = ds.filter((x) => x.ket_qua != null);
  console.log(`Phiếu có dự báo: ${ds.length}. Đã điền kết quả: ${da.length}.`);
  for (const x of da) console.log(`- ${x.f}: dự báo ${Math.round(x.xac_suat * 100)}%, kết quả ${x.ket_qua ? "xảy ra" : "không xảy ra"}`);
  const b = brier(da);
  console.log(b == null ? "Chưa có phiếu nào điền kết quả để chấm." : `Điểm Brier: ${b.toFixed(3).replace(".", ",")} (0 là hoàn hảo; 0,250 là đoán mò 50%).`);
}
