import fs from "node:fs";
import path from "node:path";
import { ROSTER, env } from "./env.mjs";
import { SEATS, byKey, loadRoster } from "./seats.mjs";

// Gói ngành: mỗi gói có Chủ toạ, bàn mặc định, loại ghế và luật riêng. Khai báo trong mảng "nganh"
// của roster.json; phần chữ dài (giới thiệu Chủ toạ, công cụ hỏi, luật ngành, tuyên bố) nằm ở
// nganh/<key>.md cạnh roster, chia theo tiêu đề "## ". Roster cũ không có "nganh" thì cả bàn là
// một gói "kinh-doanh". Ghế không ghi "nganh" thuộc gói kinh-doanh.
export const GOI_MAC_DINH = "kinh-doanh";
const NGANH_DIR = path.join(path.dirname(ROSTER), "nganh");

const read = (p) => (fs.existsSync(p) ? fs.readFileSync(p, "utf8") : "");
let stamp = 0, cache = [];

/** Các mục "## Tiêu đề" của nganh/<key>.md, khoá là tiêu đề viết thường. */
export function mucCua(text) {
  const out = {};
  let ten = null;
  for (const line of String(text).split(/\r?\n/)) {
    const m = line.match(/^##\s+(.+?)\s*$/);
    if (m) { ten = m[1].toLowerCase(); out[ten] = ""; continue; }
    if (ten) out[ten] += line + "\n";
  }
  for (const k of Object.keys(out)) out[k] = out[k].trim();
  return out;
}

export const thuocGoi = (seat, key) => (seat.nganh?.length ? seat.nganh : [GOI_MAC_DINH]).includes(key);

export function danhSachGoi() {
  loadRoster();
  let st;
  try { st = fs.statSync(ROSTER).mtimeMs; } catch { st = 0; }
  if (st === stamp && cache.length) return cache;
  let r = {};
  try { r = JSON.parse(read(ROSTER)); } catch { r = {}; }
  const khai = Array.isArray(r.nganh) && r.nganh.length ? r.nganh : [{ key: GOI_MAC_DINH, ten: "Kinh doanh", loai: "nguoi-that", chair: "musk", default: r.default || [] }];
  cache = khai.filter((g) => g && g.key).map((g) => {
    const muc = mucCua(read(path.join(NGANH_DIR, `${g.key}.md`)));
    return {
      key: g.key,
      ten: g.ten || g.key,
      mo_ta: g.mo_ta || "",
      loai: g.loai === "vai-tro" ? "vai-tro" : "nguoi-that",
      chair: g.chair || "",
      default: Array.isArray(g.default) ? g.default : [],
      tu_khoa: Array.isArray(g.tu_khoa) ? g.tu_khoa : [],
      gioi_thieu_chu_toa: muc["giới thiệu chủ toạ"] || "",
      cong_cu_hoi: muc["công cụ hỏi"] || "",
      luat_nganh: muc["luật ngành"] || "",
      tuyen_bo: muc["tuyên bố"] || "",
    };
  });
  stamp = st;
  return cache;
}

/** Gói theo key; key lạ hoặc rỗng thì gói đầu tiên. */
export function goi(key) {
  const all = danhSachGoi();
  return all.find((g) => g.key === key) || all[0];
}

/** Chủ toạ của gói. CHAIR_SEAT trong .env chỉ đổi Chủ toạ của gói kinh doanh. */
export function chuToa(g) {
  const k = g.key === GOI_MAC_DINH ? env("CHAIR_SEAT") || g.chair || "musk" : g.chair;
  return byKey[k] ? k : g.key === GOI_MAC_DINH ? "musk" : "";
}

/** Mọi ghế của gói (không tính Chủ toạ). */
export const gheCua = (g) => SEATS.filter((s) => thuocGoi(s, g.key) && s.key !== chuToa(g)).map((s) => s.key);

/** Bàn mặc định của gói: danh sách khai báo, lọc ghế có thật; trống thì 7 ghế đầu. */
export function banMacDinh(g) {
  const ghe = gheCua(g);
  const def = g.default.filter((k) => ghe.includes(k));
  return def.length ? def : ghe.slice(0, 7);
}

/** Gói gợi ý cho một câu hỏi, theo từ khoá khai báo; không khớp gì thì gói mặc định. */
export function doanGoi(cauHoi) {
  const t = ` ${String(cauHoi || "").toLowerCase()} `;
  let tot = null, diem = 0;
  for (const g of danhSachGoi()) {
    const d = g.tu_khoa.filter((w) => w && t.includes(String(w).toLowerCase())).length;
    if (d > diem) { tot = g; diem = d; }
  }
  return (tot || goi(GOI_MAC_DINH)).key;
}

/** Bản tóm tắt gửi cho trang. */
export const goiChoTrang = () => danhSachGoi().map((g) => ({ key: g.key, ten: g.ten, mo_ta: g.mo_ta, loai: g.loai, chair: chuToa(g), ghe: gheCua(g), default: banMacDinh(g), tuyen_bo: g.tuyen_bo }));
