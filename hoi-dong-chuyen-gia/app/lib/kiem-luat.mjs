// Máy kiểm điều luật: dò số hiệu văn bản trong chữ của hội đồng, cả dạng đầy đủ (61/2020/QH14,
// 219/2025/NĐ-CP, 35/2024/TT-BCA, 127/NQ-CP) lẫn dạng viết tắt (NĐ 144/2021, Nghị định 96/2026,
// Luật Đầu tư 143/2025), rồi đối chiếu với sources.md của các não trong gói ngành, nơi mỗi văn bản đã
// được xác minh kèm TÌNH TRẠNG. Văn bản hết hiệu lực hoặc đã bị thay thế bị gắn cờ "het"; văn bản không
// có trong nguồn, hoặc có nhưng chưa xác minh tình trạng, bị gắn cờ "ngoai" (CẦN KIỂM TRA). Máy dò theo
// quy tắc: cờ là cảnh báo để đọc kỹ, không phải bằng chứng sai.
import fs from "node:fs";
import path from "node:path";
import { BRAINS_DIR } from "./env.mjs";

const LOAI = String.raw`QH\d{0,2}|N[ĐD]-CP|NQ-CP|NQ-UBTVQH\d{0,2}|NQ-HĐTP|L-CTN|TTLT(?:-[A-ZĐ]+)+|TT(?:-[A-ZĐ]+)+|QĐ(?:-[A-ZĐ]+)+|CT-TTg|NĐ|NQ`;
const SO_HIEU = new RegExp(String.raw`(?<![\p{L}\d/])(\d{1,4})\/(?:(\d{4})\/)?(${LOAI})(?![\p{L}\d])`, "giu");
// dạng viết tắt: loại văn bản, có thể kèm tên ngắn ("Luật Đầu tư"), rồi số/năm không có hậu tố cơ quan
const TU_LOAI = String.raw`Bộ luật|Luật|Nghị định|NĐ|Thông tư|TT|Nghị quyết|NQ|Quyết định|QĐ`;
const SO_TAT = new RegExp(String.raw`(?<![\p{L}])(${TU_LOAI})(?:\s+[^\d\n()]{1,50}?)??\s*(?:số\s*)?(?<![\d/])(\d{1,4})\/(\d{4})(?![\/\d\p{L}])`, "giu");

/** Chuẩn hoá một số hiệu: viết hoa, ND→NĐ, bỏ khoảng trắng. */
export function chuanSoHieu(so) {
  return String(so).normalize("NFC").toUpperCase().replace(/\s+/g, "").replace(/\bND-CP\b/g, "NĐ-CP").replace(/(^|\/)ND(?=-CP|$)/g, "$1NĐ");
}

/** Họ của một văn bản (loại + số + năm), để nối dạng viết tắt với dạng đầy đủ. */
function hoTuLoai(loai) {
  const l = String(loai).normalize("NFC").toUpperCase();
  if (/^(QH|L-CTN|LUẬT|BỘ LUẬT)/.test(l)) return "LUAT";
  if (/^(N[ĐD]|NGHỊ ĐỊNH)/.test(l)) return "ND";
  if (/^(TT|THÔNG TƯ)/.test(l)) return "TT";
  if (/^(NQ|NGHỊ QUYẾT)/.test(l)) return "NQ";
  if (/^(QĐ|QUYẾT ĐỊNH|CT-)/.test(l)) return "QD";
  return l;
}
export function hoCua(so) {
  const p = chuanSoHieu(so).split("/");
  return p.length === 3 ? `${hoTuLoai(p[2])}:${p[0]}/${p[1]}` : `${hoTuLoai(p[1] || "")}:${p[0]}`;
}

/** Các số hiệu đầy đủ trong một đoạn chữ, không trùng, theo thứ tự xuất hiện. */
export function soHieuTrong(text) {
  const out = [];
  for (const m of String(text ?? "").normalize("NFC").matchAll(SO_HIEU)) {
    const so = chuanSoHieu(m[2] ? `${m[1]}/${m[2]}/${m[3]}` : `${m[1]}/${m[3]}`);
    if (!out.includes(so)) out.push(so);
  }
  return out;
}

/** Các số hiệu viết tắt (không có hậu tố cơ quan): [{ so: "NĐ 144/2021", ho: "ND:144/2021" }]. */
export function soHieuTat(text) {
  const out = [];
  for (const m of String(text ?? "").normalize("NFC").matchAll(SO_TAT)) {
    const ho = `${hoTuLoai(m[1])}:${m[2]}/${m[3]}`;
    const ten = { LUAT: "Luật", ND: "NĐ", TT: "TT", NQ: "NQ", QD: "QĐ" }[ho.split(":")[0]] || m[1];
    if (!out.some((x) => x.ho === ho)) out.push({ so: `${ten} ${m[2]}/${m[3]}`, ho });
  }
  return out;
}

/** Tình trạng ghi trên một dòng nguồn: "het" (hết hiệu lực, đã bị thay thế), "con", hoặc "" khi không rõ. */
export function trangThaiDong(line) {
  const l = String(line).normalize("NFC").toLowerCase();
  const tt = (l.match(/tình trạng\s*:\s*([^|]+)/) || [, l])[1].trim();
  // "CẦN KIỂM TRA (… chưa xác minh còn hiệu lực)": chưa rõ, dù trong ngoặc có chữ "còn hiệu lực"
  if (/^cần kiểm tra/.test(tt)) return "";
  if (/^còn hiệu lực|^đang có hiệu lực|^có hiệu lực/.test(tt)) return "con";
  if (/hết hiệu lực|đã bị thay thế|bị thay thế|đã thay thế bởi|được thay thế bởi|thay thế bởi|bãi bỏ|hết tác dụng/.test(tt)) return "het";
  if (/còn hiệu lực|đang có hiệu lực|có hiệu lực/.test(tt)) return "con";
  return "";
}

/** Chỉ mục văn bản từ sources.md của các não (slug). Một số hiệu gặp nhiều lần: "het" ở bất kỳ não nào thắng.
 * Văn bản đầu tiên trong tên một dòng mang tình trạng của dòng; các văn bản khác được nhắc trong tên vào
 * chỉ mục với tình trạng chưa rõ, trừ khi dòng riêng của chúng ghi tình trạng. */
export function chiMucLuat(slugs, dir = BRAINS_DIR) {
  const idx = new Map();
  const ho = new Map();
  const dat = (so, x) => {
    const cu = idx.get(so);
    if (!cu || (x.trang_thai === "het" && cu.trang_thai !== "het") || (!cu.trang_thai && x.trang_thai)) idx.set(so, x);
  };
  for (const slug of slugs) {
    const f = path.join(dir, slug, "sources.md");
    if (!fs.existsSync(f)) continue;
    for (const line of fs.readFileSync(f, "utf8").split(/\r?\n/)) {
      if (!/\bS\d{3}\b/.test(line)) continue;
      const nums = soHieuTrong(line.split("|").slice(0, 2).join(" "));
      if (!nums.length) continue;
      const tt = trangThaiDong(line);
      const ten = (line.split("|")[1] || "").trim();
      const id = (line.match(/\bS\d{3}\b/) || [""])[0];
      nums.forEach((so, i) => dat(so, { so, ten: i ? "" : ten, trang_thai: i ? "" : tt, nguon: `${slug} ${id}`.trim() }));
    }
  }
  for (const x of idx.values()) {
    const h = hoCua(x.so);
    const cu = ho.get(h);
    if (!cu || (x.trang_thai === "het" && cu.trang_thai !== "het") || (!cu.trang_thai && x.trang_thai)) ho.set(h, x);
  }
  idx.ho = ho;
  // bí danh "tên luật + năm" ("Luật Đầu tư 2020" → 61/2020/QH14), dựng từ tên nguồn có tên riêng
  const biDanh = new Map();
  for (const x of idx.values()) {
    const p = x.so.split("/");
    if (p.length !== 3 || !/^QH/.test(p[2]) || !x.ten) continue;
    const ten = tenLuat(x.ten);
    if (ten) { const k = `${ten}:${p[1]}`; const cu = biDanh.get(k); if (!cu || (x.trang_thai === "het" && cu.trang_thai !== "het")) biDanh.set(k, x); }
  }
  idx.biDanh = biDanh;
  return idx;
}

// Nhắc một văn bản để nói nó đã hết hiệu lực ("NĐ 09/2018 đã bị thay bằng NĐ 342/2026") là dùng đúng,
// không phải viện dẫn làm căn cứ: mọi lần xuất hiện của số hiệu đều có chữ phủ định ở gần thì không gắn cờ.
const PHU_DINH = /hết hiệu lực|bị thay|đã thay|thay thế|thay bằng|bãi bỏ|không còn hiệu lực|không còn là căn cứ|không còn áp dụng|không áp dụng|không làm căn cứ|không phải căn cứ|không dùng|không được dùng|hết tác dụng|văn bản cũ/i;
function chiNhacLaHet(text, so) {
  const t = String(text ?? "").normalize("NFC");
  const goc = so.split("/").slice(0, 2).join("/");
  const lan = [...t.matchAll(new RegExp(`(?<![\\d/])${goc.replace("/", "\\/")}(?![\\d])`, "g"))];
  return lan.length > 0 && lan.every((m) => PHU_DINH.test(t.slice(Math.max(0, m.index - 40), m.index + goc.length + 90)));
}

// Tên riêng của một luật, viết thường: "Luật Đầu tư số 61/2020/QH14" → "luật đầu tư". Luật sửa đổi không có tên riêng.
function tenLuat(ten) {
  const m = String(ten).normalize("NFC").match(/^((?:Bộ luật|Luật)\s+[^\d(]+?)(?:\s+số)?\s+\d/u);
  if (!m) return "";
  const t = m[1].toLowerCase().replace(/\s+/g, " ").trim();
  return /sửa đổi|bổ sung|^luật$|^bộ luật$/.test(t) ? "" : t;
}
const BI_DANH = /(?<![\p{L}])((?:Bộ luật|Luật)\s+[\p{L} ,]{2,40}?)\s+(?:năm\s+)?(\d{4})(?![\/\d\p{L}])/gu;

/** Kết quả dò một đoạn chữ: văn bản đã xác minh còn hiệu lực, đã hết hiệu lực (viện dẫn làm căn cứ), chỉ được
 * nhắc là đã hết hiệu lực (nhac_het, không phải lỗi), và ngoài nguồn / chưa rõ. */
export function kiemLuat(text, idx) {
  const r = { con: [], het: [], ngoai: [], nhac_het: [] };
  const xep = (so, x) => {
    if (!x) r.ngoai.push({ so });
    else if (x.trang_thai === "het" && chiNhacLaHet(text, so)) r.nhac_het.push({ so, ten: x.ten, nguon: x.nguon });
    else if (x.trang_thai === "het") r.het.push({ so, ten: x.ten, nguon: x.nguon });
    else if (!x.trang_thai) r.ngoai.push({ so, ten: x.ten, nguon: x.nguon, chua_ro: true });
    else r.con.push({ so, ten: x.ten, nguon: x.nguon });
  };
  const day = soHieuTrong(text);
  for (const so of day) xep(so, idx.get(so));
  const hoDay = new Set(day.map(hoCua));
  // "Luật Đầu tư 2020": tên luật kèm năm, không có số hiệu
  for (const m of String(text ?? "").normalize("NFC").matchAll(BI_DANH)) {
    const x = idx.biDanh?.get(`${m[1].toLowerCase().replace(/\s+/g, " ").trim()}:${m[2]}`);
    if (x && !hoDay.has(hoCua(x.so))) { hoDay.add(hoCua(x.so)); xep(x.so, x); }
  }
  for (const t of soHieuTat(text)) {
    if (hoDay.has(t.ho)) continue; // cùng văn bản đã viết đầy đủ ở chỗ khác
    const x = idx.ho?.get(t.ho);
    xep(x ? x.so : t.so, x);
  }
  return r;
}

/** Gộp nhiều kết quả dò (các thẻ, kết luận) thành một, không trùng số hiệu. */
export function gopKiemLuat(list) {
  const r = { con: [], het: [], ngoai: [], nhac_het: [] };
  for (const k of list.filter(Boolean)) for (const loai of ["con", "het", "ngoai", "nhac_het"]) for (const x of k[loai] || []) if (!r[loai].some((y) => y.so === x.so)) r[loai].push(x);
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

// ---------------------------------------------------------------- mã nguồn S0xx theo từng não
const bangMa = new Map();
/** S0xx → số hiệu văn bản đầu tiên trên dòng nguồn đó, cho một não. */
export function maNguonCua(slug, dir = BRAINS_DIR) {
  const k = `${dir}::${slug}`;
  if (bangMa.has(k)) return bangMa.get(k);
  const m = new Map();
  const f = path.join(dir, slug, "sources.md");
  if (fs.existsSync(f)) {
    for (const line of fs.readFileSync(f, "utf8").split(/\r?\n/)) {
      const id = (line.match(/^\s*-\s*(S\d{3})\b/) || [])[1];
      const so = id && soHieuTrong(line.split("|").slice(0, 2).join(" "))[0];
      if (id && so) m.set(id, so);
    }
  }
  bangMa.set(k, m);
  return m;
}

/** Mã S0xx là riêng của não từng ghế. Gắn số hiệu văn bản vào sau mỗi mã trần ("S002" thành
 * "S002: 51/2019/QH14") để ghế khác, Chủ toạ và máy kiểm điều luật không nhầm nguồn. Mã đã có số
 * hiệu của chính nó ở ngay trước (trong 80 ký tự) thì để nguyên. */
export function ganSoHieu(text, slug, dir = BRAINS_DIR) {
  const ma = maNguonCua(slug, dir);
  if (!ma.size) return String(text ?? "");
  return String(text ?? "").replace(/\bS\d{3}\b(?!:)/g, (id, at, all) => {
    const so = ma.get(id);
    if (!so) return id;
    const truoc = all.slice(Math.max(0, at - 80), at);
    return soHieuTrong(truoc).includes(so) || truoc.includes(so.split("/").slice(0, 2).join("/")) ? id : `${id}: ${so}`;
  });
}
