// Máy kiểm điều luật: dò số hiệu văn bản (61/2020/QH14, 219/2025/NĐ-CP, 35/2024/TT-BCA, 127/NQ-CP…)
// trong chữ của hội đồng, rồi đối chiếu với sources.md của các não trong gói ngành, nơi mỗi văn bản
// đã được xác minh kèm TÌNH TRẠNG. Văn bản hết hiệu lực hoặc đã bị thay thế bị gắn cờ "het"; văn bản
// không có trong nguồn đã xác minh bị gắn cờ "ngoai". Máy dò theo quy tắc: cờ là cảnh báo để đọc kỹ,
// không phải bằng chứng sai.
import fs from "node:fs";
import path from "node:path";
import { BRAINS_DIR } from "./env.mjs";

const LOAI = String.raw`QH\d{0,2}|N[ĐD]-CP|NQ-CP|NQ-UBTVQH\d{0,2}|NQ-HĐTP|L-CTN|TTLT(?:-[A-ZĐ]+)+|TT(?:-[A-ZĐ]+)+|QĐ(?:-[A-ZĐ]+)+|CT-TTg|NĐ|NQ`;
const SO_HIEU = new RegExp(String.raw`(?<![\p{L}\d/])(\d{1,4})\/(?:(\d{4})\/)?(${LOAI})(?![\p{L}\d])`, "giu");

/** Chuẩn hoá một số hiệu: viết hoa, ND→NĐ, bỏ khoảng trắng. */
export function chuanSoHieu(so) {
  return String(so).normalize("NFC").toUpperCase().replace(/\s+/g, "").replace(/\bND-CP\b/g, "NĐ-CP").replace(/(^|\/)ND(?=-CP|$)/g, "$1NĐ");
}

/** Các số hiệu văn bản trong một đoạn chữ, không trùng, theo thứ tự xuất hiện. */
export function soHieuTrong(text) {
  const out = [];
  for (const m of String(text ?? "").normalize("NFC").matchAll(SO_HIEU)) {
    const so = chuanSoHieu(m[2] ? `${m[1]}/${m[2]}/${m[3]}` : `${m[1]}/${m[3]}`);
    if (!out.includes(so)) out.push(so);
  }
  return out;
}

/** Tình trạng ghi trên một dòng nguồn: "het" (hết hiệu lực, đã bị thay thế), "con", hoặc "" khi không rõ. */
export function trangThaiDong(line) {
  const l = String(line).normalize("NFC").toLowerCase();
  const tt = (l.match(/tình trạng\s*:\s*([^|]+)/) || [, l])[1];
  if (/hết hiệu lực|đã bị thay thế|bị thay thế|đã thay thế bởi|được thay thế bởi|thay thế bởi|bãi bỏ/.test(tt) && !/^\s*còn hiệu lực/.test(tt)) return "het";
  if (/còn hiệu lực|đang có hiệu lực|có hiệu lực/.test(tt)) return "con";
  return "";
}

/** Chỉ mục văn bản từ sources.md của các não (slug). Một số hiệu gặp nhiều lần: "het" ở bất kỳ não nào thắng. */
export function chiMucLuat(slugs, dir = BRAINS_DIR) {
  const idx = new Map();
  for (const slug of slugs) {
    const f = path.join(dir, slug, "sources.md");
    if (!fs.existsSync(f)) continue;
    for (const line of fs.readFileSync(f, "utf8").split(/\r?\n/)) {
      const nums = soHieuTrong(line.split("|").slice(0, 2).join(" "));
      if (!nums.length) continue;
      const tt = trangThaiDong(line);
      const ten = (line.split("|")[1] || "").trim();
      const id = (line.match(/\bS\d{3}\b/) || [""])[0];
      // dòng nguồn chỉ nói về văn bản đầu tiên trong tên; các số hiệu khác trong tên là văn bản được nhắc tới
      const so = nums[0];
      const cu = idx.get(so);
      if (!cu || (tt === "het" && cu.trang_thai !== "het") || (!cu.trang_thai && tt)) idx.set(so, { so, ten, trang_thai: tt, nguon: `${slug} ${id}`.trim() });
    }
  }
  return idx;
}

/** Kết quả dò một đoạn chữ: văn bản đã xác minh còn hiệu lực, đã hết hiệu lực, và ngoài nguồn. */
export function kiemLuat(text, idx) {
  const r = { con: [], het: [], ngoai: [] };
  for (const so of soHieuTrong(text)) {
    const x = idx.get(so);
    if (!x) r.ngoai.push({ so });
    else if (x.trang_thai === "het") r.het.push({ so, ten: x.ten, nguon: x.nguon });
    // có trong nguồn nhưng tình trạng chưa xác minh: cũng phải ghi CẦN KIỂM TRA
    else if (!x.trang_thai) r.ngoai.push({ so, ten: x.ten, nguon: x.nguon, chua_ro: true });
    else r.con.push({ so, ten: x.ten, nguon: x.nguon });
  }
  return r;
}

/** Gộp nhiều kết quả dò (các thẻ, kết luận) thành một, không trùng số hiệu. */
export function gopKiemLuat(list) {
  const r = { con: [], het: [], ngoai: [] };
  for (const k of list.filter(Boolean)) for (const loai of ["con", "het", "ngoai"]) for (const x of k[loai] || []) if (!r[loai].some((y) => y.so === x.so)) r[loai].push(x);
  return r;
}

/** Một đoạn cảnh báo cho Chủ toạ khi viết kết luận; rỗng khi không có gì đáng cảnh báo. */
export function canhBaoLuat(k) {
  if (!k || (!k.het.length && !k.ngoai.length)) return "";
  const L = ["KIỂM ĐIỀU LUẬT (máy dò số hiệu văn bản trong các thẻ, đối chiếu nguồn đã xác minh của các não):"];
  if (k.het.length) L.push(`- HẾT HIỆU LỰC hoặc ĐÃ BỊ THAY THẾ, không được dùng làm căn cứ: ${k.het.map((x) => `${x.so}${x.ten ? ` (${x.ten})` : ""}`).join("; ")}.`);
  if (k.ngoai.length) L.push(`- CHƯA XÁC MINH tình trạng hoặc CHƯA CÓ trong nguồn đã xác minh, chỉ được nhắc kèm nhãn CẦN KIỂM TRA: ${k.ngoai.map((x) => x.so).join("; ")}.`);
  return L.join("\n");
}
