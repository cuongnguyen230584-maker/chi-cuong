// Máy tính hạn: cộng ngày hoặc ngày làm việc, trừ thứ Bảy, Chủ nhật và ngày nghỉ lễ.
// Ngày lễ dự kiến theo Điều 112 Bộ luật Lao động 45/2019/QH14: Tết Dương lịch (1/1), Tết Âm lịch
// (5 ngày, ở đây tính ngày cuối năm âm lịch và mùng 1–4), Giỗ Tổ Hùng Vương (10/3 âm lịch), 30/4, 1/5,
// Quốc khánh 2/9 cộng 1 ngày liền kề (ở đây tính 1/9 hoặc 3/9 theo thứ trong tuần); lễ rơi vào ngày nghỉ
// hằng tuần thì nghỉ bù ngày làm việc kế tiếp. Lịch nghỉ Tết và Quốc khánh thật do Thủ tướng quyết định mỗi
// năm, nên ngày do máy tính chỉ là dự kiến: năm nào đã có thông báo chính thức thì khai ở nghi-le.json.
import fs from "node:fs";
import path from "node:path";
import { REPO_ROOT } from "./env.mjs";

// ---------------------------------------------------------------- âm lịch (thuật toán Hồ Ngọc Đức, múi giờ +7)
const PI = Math.PI;
const INT = Math.floor;
function jdFromDate(dd, mm, yy) {
  const a = INT((14 - mm) / 12), y = yy + 4800 - a, m = mm + 12 * a - 3;
  let jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - INT(y / 100) + INT(y / 400) - 32045;
  if (jd < 2299161) jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - 32083;
  return jd;
}
function jdToDate(jd) {
  let a, b, c;
  if (jd > 2299160) { a = jd + 32044; b = INT((4 * a + 3) / 146097); c = a - INT((b * 146097) / 4); } else { b = 0; c = jd + 32082; }
  const d = INT((4 * c + 3) / 1461), e = c - INT((1461 * d) / 4), m = INT((5 * e + 2) / 153);
  return [e - INT((153 * m + 2) / 5) + 1, m + 3 - 12 * INT(m / 10), b * 100 + d - 4800 + INT(m / 10)];
}
function newMoon(k) {
  const T = k / 1236.85, T2 = T * T, T3 = T2 * T, dr = PI / 180;
  let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
  Jd1 += 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
  const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
  const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
  const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
  let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
  C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr) - 0.0004 * Math.sin(dr * 3 * Mpr);
  C1 = C1 + 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr)) - 0.0074 * Math.sin(dr * (M - Mpr));
  C1 = C1 + 0.0004 * Math.sin(dr * (2 * F + M)) - 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr));
  C1 = C1 + 0.001 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M));
  const deltat = T < -11 ? 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3 : -0.000278 + 0.000265 * T + 0.000262 * T2;
  return Jd1 + C1 - deltat;
}
function sunLongitude(jdn) {
  const T = (jdn - 2451545.0) / 36525, T2 = T * T, dr = PI / 180;
  const M = 357.5291 + 35999.0503 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
  const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
  let DL = (1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
  DL = DL + (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.00029 * Math.sin(dr * 3 * M);
  let L = (L0 + DL) * dr;
  L = L - PI * 2 * INT(L / (PI * 2));
  return L;
}
const TZ = 7;
const getNewMoonDay = (k) => INT(newMoon(k) + 0.5 + TZ / 24);
const getSunLongitude = (dayNumber) => INT((sunLongitude(dayNumber - 0.5 - TZ / 24) / PI) * 6);
function getLunarMonth11(yy) {
  const off = jdFromDate(31, 12, yy) - 2415021;
  const k = INT(off / 29.530588853);
  let nm = getNewMoonDay(k);
  if (getSunLongitude(nm) >= 9) nm = getNewMoonDay(k - 1);
  return nm;
}
function getLeapMonthOffset(a11) {
  const k = INT((a11 - 2415021.076998695) / 29.530588853 + 0.5);
  let last, i = 1, arc = getSunLongitude(getNewMoonDay(k + i));
  do { last = arc; i++; arc = getSunLongitude(getNewMoonDay(k + i)); } while (arc !== last && i < 14);
  return i - 1;
}
/** Ngày dương (dd, mm, yyyy) của ngày âm lịch (ngày, tháng, năm âm), tháng không nhuận. */
export function amSangDuong(lunarDay, lunarMonth, lunarYear) {
  let a11, b11;
  if (lunarMonth < 11) { a11 = getLunarMonth11(lunarYear - 1); b11 = getLunarMonth11(lunarYear); } else { a11 = getLunarMonth11(lunarYear); b11 = getLunarMonth11(lunarYear + 1); }
  const k = INT(0.5 + (a11 - 2415021.076998695) / 29.530588853);
  let off = lunarMonth - 11;
  if (off < 0) off += 12;
  if (b11 - a11 > 365) { const leapOff = getLeapMonthOffset(a11); let leapMonth = leapOff - 2; if (leapMonth < 0) leapMonth += 12; if (off >= leapOff) off += 1; }
  const monthStart = getNewMoonDay(k + off);
  return jdToDate(monthStart + lunarDay - 1);
}

// ---------------------------------------------------------------- ngày tháng
const key = (d) => `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
const ngay = (y, m, d) => new Date(Date.UTC(y, m - 1, d));
const cong = (d, n) => new Date(d.getTime() + n * 86400000);
const cuoiTuan = (d) => d.getUTCDay() === 0 || d.getUTCDay() === 6;
export const vn = (d) => `${String(d.getUTCDate()).padStart(2, "0")}/${String(d.getUTCMonth() + 1).padStart(2, "0")}/${d.getUTCFullYear()}`;

/** Đọc "dd/mm/yyyy" hoặc "yyyy-mm-dd" thành ngày (UTC nửa đêm); sai dạng thì null. */
export function docNgay(s) {
  const t = String(s ?? "").trim();
  let m = t.match(/^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{4})$/);
  if (m) { const d = ngay(+m[3], +m[2], +m[1]); return d.getUTCDate() === +m[1] && d.getUTCMonth() === +m[2] - 1 ? d : null; }
  m = t.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) { const d = ngay(+m[1], +m[2], +m[3]); return d.getUTCDate() === +m[3] ? d : null; }
  return null;
}

// ---------------------------------------------------------------- ngày nghỉ lễ
const FILE_NGHI = () => path.join(REPO_ROOT, "nghi-le.json");
/** Lịch chính thức người dùng khai: { "2026": ["2026-02-14", …] } thay hẳn lịch dự kiến của năm đó. */
function chinhThuc() {
  try { return JSON.parse(fs.readFileSync(FILE_NGHI(), "utf8")); } catch { return {}; }
}

/** Ngày nghỉ lễ của một năm: Map("yyyy-mm-dd" → tên), và nguồn: "chính thức" hoặc "dự kiến". */
export function ngayNghiLe(nam, { lichChinhThuc = chinhThuc() } = {}) {
  const ct = lichChinhThuc[String(nam)];
  if (Array.isArray(ct) && ct.length) return { nguon: "chính thức", ngay: new Map(ct.map((x) => [String(x), "nghỉ lễ (theo thông báo)"])) };
  const out = new Map();
  const them = (d, ten) => { out.set(key(d), ten); };
  const le = [];
  le.push([ngay(nam, 1, 1), "Tết Dương lịch"]);
  // Tết Âm lịch: ngày cuối năm cũ và mùng 1–4 năm mới
  const [td, tm, ty] = amSangDuong(1, 1, nam);
  const mung1 = ngay(ty, tm, td);
  for (let i = -1; i <= 3; i++) le.push([cong(mung1, i), "Tết Âm lịch"]);
  const [gd, gm, gy] = amSangDuong(10, 3, nam);
  le.push([ngay(gy, gm, gd), "Giỗ Tổ Hùng Vương"]);
  le.push([ngay(nam, 4, 30), "Ngày Chiến thắng"]);
  le.push([ngay(nam, 5, 1), "Quốc tế Lao động"]);
  const qk = ngay(nam, 9, 2);
  le.push([qk, "Quốc khánh"]);
  // ngày liền kề Quốc khánh: thứ Hai 2/9 thì nghỉ 1/9 (liền cuối tuần), còn lại nghỉ 3/9
  le.push([qk.getUTCDay() === 1 ? ngay(nam, 9, 1) : ngay(nam, 9, 3), "Quốc khánh (ngày liền kề)"]);
  for (const [d, ten] of le) them(d, ten);
  // nghỉ bù: lễ rơi vào thứ Bảy, Chủ nhật thì nghỉ ngày làm việc kế tiếp chưa phải ngày lễ
  for (const [d, ten] of le) {
    if (!cuoiTuan(d)) continue;
    let b = cong(d, 1);
    while (cuoiTuan(b) || out.has(key(b))) b = cong(b, 1);
    them(b, `Nghỉ bù ${ten}`);
  }
  return { nguon: "dự kiến", ngay: out };
}

const cacheLe = new Map();
function laNgayLe(d, opts) {
  const y = d.getUTCFullYear();
  if (!cacheLe.has(y) || opts?.lichChinhThuc) cacheLe.set(y, ngayNghiLe(y, opts));
  return cacheLe.get(y).ngay.get(key(d)) || "";
}
export const laNgayLamViec = (d, opts) => !cuoiTuan(d) && !laNgayLe(d, opts);

/**
 * Tính hạn. `tu`: ngày bắt đầu (ngày nhận đủ hồ sơ), `so`: số ngày, `loai`: "lam-viec" | "lich".
 * Ngày làm việc: không tính ngày bắt đầu, đếm từ ngày làm việc kế tiếp. Ngày lịch: hạn rơi vào ngày nghỉ
 * thì lùi tới ngày làm việc kế tiếp (Bộ luật Dân sự 2015, Điều 148). Trả { han, cac_ngay_nghi, nguon_le, ghi_chu }.
 */
export function tinhHan(tu, so, loai = "lam-viec", opts = {}) {
  const bd = tu instanceof Date ? tu : docNgay(tu);
  if (!bd) throw new Error("Ngày bắt đầu không hợp lệ (dùng dd/mm/yyyy)");
  const n = Math.max(0, Math.floor(Number(so) || 0));
  const nghi = [];
  let d = bd;
  if (loai === "lam-viec") {
    let dem = 0;
    while (dem < n) {
      d = cong(d, 1);
      if (laNgayLamViec(d, opts)) dem++;
      else if (laNgayLe(d, opts)) nghi.push(`${vn(d)} ${laNgayLe(d, opts)}`);
    }
  } else {
    d = cong(bd, n);
    while (!laNgayLamViec(d, opts)) { if (laNgayLe(d, opts)) nghi.push(`${vn(d)} ${laNgayLe(d, opts)}`); d = cong(d, 1); }
  }
  const nam = [...new Set([bd.getUTCFullYear(), d.getUTCFullYear()])];
  const nguon = nam.map((y) => `${y}: ${ngayNghiLe(y, opts).nguon}`).join(", ");
  return {
    han: vn(d), han_iso: key(d), cac_ngay_nghi: nghi, nguon_le: nguon,
    ghi_chu: /dự kiến/.test(nguon) ? "Ngày nghỉ Tết và Quốc khánh là dự kiến theo Điều 112 Bộ luật Lao động 45/2019/QH14. CẦN KIỂM TRA thông báo nghỉ lễ chính thức của năm (khai vào nghi-le.json để máy dùng lịch chính thức)." : "Dùng lịch nghỉ lễ chính thức đã khai trong nghi-le.json.",
  };
}
