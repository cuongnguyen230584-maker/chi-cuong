import crypto from "node:crypto";
import { askJson, json, BACKEND, S } from "./anthropic.mjs";
import { env } from "./env.mjs";

// Dịch "Phiếu khách": tách mọi chuỗi chữ của phiếu, chia thành từng phần nhỏ dịch song song,
// rồi ráp lại đúng cấu trúc cũ. Bản dịch được nhớ theo (ngôn ngữ, nội dung) nên tải lại không phải dịch lại.

export const NGON_NGU = { en: "English", zh: "Simplified Chinese (简体中文)", ko: "Korean (한국어)" };

const SYSTEM = "You translate Vietnamese legal and immigration advisory documents for foreign clients in Việt Nam. Precise, formal, no additions, no omissions.";
const KHONG_DICH = /^[\s\d.,:;/()\-–+%]*$/; // số, ngày, mốc giờ: giữ nguyên, không tốn lượt dịch
const KICH_THUOC_PHAN = 1800; // ký tự tiếng Việt mỗi phần
const SO_PHAN_SONG_SONG = 6;
const SO_BAN_NHO = 100;

/** Every string leaf worth translating, with its path in the object. */
function gomChuoi(v, duong = [], out = []) {
  if (typeof v === "string") { if (v.trim() && !KHONG_DICH.test(v)) out.push({ duong, chu: v }); }
  else if (Array.isArray(v)) v.forEach((x, i) => gomChuoi(x, [...duong, i], out));
  else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) gomChuoi(x, [...duong, k], out);
  return out;
}

function datTheoDuong(obj, duong, giaTri) {
  let o = obj;
  for (const k of duong.slice(0, -1)) o = o[k];
  o[duong.at(-1)] = giaTri;
}

/** Splits the strings into parts of about `kichThuoc` characters, keeping order. */
export function chiaPhan(chuoi, kichThuoc = KICH_THUOC_PHAN) {
  const phan = [];
  let hienTai = [], dai = 0;
  for (const c of chuoi) {
    if (hienTai.length && dai + c.length > kichThuoc) { phan.push(hienTai); hienTai = []; dai = 0; }
    hienTai.push(c); dai += c.length;
  }
  if (hienTai.length) phan.push(hienTai);
  return phan;
}

/** Runs `viec` over `ds` with at most `toiDa` running at once; results keep the order of `ds`. */
async function chayGioiHan(ds, toiDa, viec) {
  const ketQua = new Array(ds.length);
  let tiep = 0;
  const tho = async () => { while (tiep < ds.length) { const i = tiep++; ketQua[i] = await viec(ds[i], i); } };
  await Promise.all(Array.from({ length: Math.min(toiDa, ds.length) }, tho));
  return ketQua;
}

const loiNhac = (ten, phan) =>
  `Translate each Vietnamese string in this JSON array into ${ten}. Return "ban_dich": exactly ${phan.length} strings, in the same order, one translation per input string. ` +
  `Keep numbers, dates (dd/mm/yyyy), document numbers (61/2020/QH14, 219/2025/NĐ-CP) and visa or card symbols (DN1, ĐT3, TRC) unchanged. ` +
  `After a Vietnamese legal term or authority name, add the Vietnamese original in parentheses. ` +
  `Labels like CẦN KIỂM TRA become the target-language equivalent of "TO BE VERIFIED".\n\n${JSON.stringify(phan)}`;

/** Đường gọi AI: qua Claude Code khi có token gói, qua API khi chỉ có ANTHROPIC_API_KEY. */
const goiMacDinh = ({ model, system, prompt, schema, effort }) =>
  BACKEND === "cli" ? askJson({ model, system, prompt, schema, effort }) : json({ model, system, prompt, schema, maxTokens: 8000 });

/**
 * `ask({ model, system, prompt, schema, effort })` resolves to `{ ban_dich: string[] }`.
 * Returns `dich(noiDung, ngonNgu)`: the same object, its strings translated.
 */
export function createDichPhieu({ ask = goiMacDinh, model = env("DICH_MODEL") || "claude-sonnet-5-5", effort = env("DICH_EFFORT") || "low", kichThuoc = KICH_THUOC_PHAN } = {}) {
  const nho = new Map(); // khoá → Promise bản dịch; lỗi thì xoá để lần sau dịch lại

  async function dichPhan(ten, phan) {
    for (let lan = 0; lan < 2; lan++) {
      const r = await ask({ model, effort, system: SYSTEM, prompt: loiNhac(ten, phan), schema: S.obj({ ban_dich: S.arr(S.str) }) });
      if (Array.isArray(r?.ban_dich) && r.ban_dich.length === phan.length) return r.ban_dich.map(String);
    }
    throw new Error("AI trả số câu dịch không khớp với phiếu");
  }

  async function dichMoi(noiDung, ten) {
    const muc = gomChuoi(noiDung);
    const khac = [...new Set(muc.map((m) => m.chu))]; // câu lặp lại chỉ dịch một lần
    const ketQua = (await chayGioiHan(chiaPhan(khac, kichThuoc), SO_PHAN_SONG_SONG, (phan) => dichPhan(ten, phan))).flat();
    const bang = new Map(khac.map((c, i) => [c, ketQua[i]]));
    const ban = structuredClone(noiDung);
    for (const m of muc) datTheoDuong(ban, m.duong, bang.get(m.chu));
    return ban;
  }

  return function dich(noiDung, ngonNgu) {
    const ten = NGON_NGU[ngonNgu];
    if (!ten) return Promise.reject(new Error("Ngôn ngữ không hỗ trợ"));
    const khoa = crypto.createHash("sha256").update(`${ngonNgu}\n${JSON.stringify(noiDung)}`).digest("hex");
    if (nho.has(khoa)) return nho.get(khoa);
    const p = dichMoi(noiDung, ten);
    nho.set(khoa, p);
    p.catch(() => nho.delete(khoa));
    if (nho.size > SO_BAN_NHO) nho.delete(nho.keys().next().value);
    return p;
  };
}
