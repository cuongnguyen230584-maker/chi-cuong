#!/usr/bin/env node
// Chạy bộ đề chuẩn (docs/bo-de-chuan.json) qua phòng họp đang mở, rồi chấm tự động từng kết luận:
// điểm bắt buộc có mặt, điểm cấm vắng mặt, không dẫn văn bản hết hiệu lực, không có mã S0xx trần,
// có dự báo xác suất, mọi hướng ghế nêu thêm đều được xử lý.
//   node app/scripts/chay-bo-de.mjs [--port 4730] [--ca id1,id2] [--cham-lai <thư mục sessions>]
// Mỗi ca là một hội đồng thật (tốn hạn mức Claude). --cham-lai chỉ chấm các phiên đã có, không chạy mới.
import fs from "node:fs";
import path from "node:path";
import { REPO_ROOT, SESSIONS_DIR } from "../lib/env.mjs";

const args = process.argv.slice(2);
const opt = (n) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : undefined; };
const BASE = `http://localhost:${opt("port") || 4730}`;
const bo = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, "docs", "bo-de-chuan.json"), "utf8"));
const chon = opt("ca") ? opt("ca").split(",") : null;
const cacCa = bo.ca.filter((c) => !chon || chon.includes(c.id));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Chữ của kết luận để chấm: quyết định, lý do, điều kiện, bước tiếp theo, dừng nếu. */
export function chuKetLuan(v) {
  return [v.call, ...(v.why || []).map((w) => w.point), ...(v.conditions || []), ...(v.next_steps || []).map((n) => n.action), v.cheapest_test, v.kill_criteria, v.revisit, ...(v.fights || []).map((f) => f.story)].filter(Boolean).join("\n");
}

/** Chấm một phiên theo một ca. Trả { diem, toi_da, loi: [] }. */
export function chamPhien(ca, phien) {
  const ev = phien.events || [];
  const v = [...ev].reverse().find((e) => e.type === "verdict")?.verdict;
  if (!v) return { diem: 0, toi_da: 1, loi: ["không có kết luận"] };
  const chu = chuKetLuan(v);
  const thap = chu.normalize("NFC").toLowerCase();
  const loi = [];
  let diem = 0, toiDa = 0;
  for (const nhom of ca.phai_co || []) {
    toiDa++;
    if (nhom.some((w) => thap.includes(String(w).normalize("NFC").toLowerCase()))) diem++;
    else loi.push(`thiếu: ${nhom.join(" / ")}`);
  }
  for (const w of ca.khong_duoc || []) {
    toiDa++;
    if (thap.includes(String(w).normalize("NFC").toLowerCase())) loi.push(`có điểm cấm: ${w}`);
    else diem++;
  }
  const kiemTra = [
    ["kết luận không dẫn văn bản hết hiệu lực", !((v.kiem_luat_ket_luan || v.kiem_luat)?.het?.length)],
    ["không có mã S0xx trần trong kết luận", !/\bS\d{3}\b(?!:)/.test(chu.replace(/[^()]*?\d+\/\d{4}[^()]*?\(S\d{3}[^)]*\)/g, ""))],
    ["có dự báo xác suất", Boolean(v.du_bao?.ket_qua && Number.isFinite(v.du_bao.xac_suat))],
    ["hướng ghế nêu thêm đều có lý do", (v.huong_ghe_neu || []).every((h) => h.ly_do && h.ly_do.length > 10)],
    ["có lời miễn trừ của gói", /không thay thế ý kiến/.test(v.disclaimer || "")],
  ];
  for (const [ten, dat] of kiemTra) { toiDa++; if (dat) diem++; else loi.push(ten); }
  return { diem, toi_da: toiDa, loi, nhan: v.label, phuong_an: v.recommended, tin_cay: v.confidence, du_bao: v.du_bao?.xac_suat };
}

async function chayMot(ca) {
  const r = await fetch(`${BASE}/api/council`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ prompt: ca.prompt, mode: ca.mode || "full", nganh: ca.nganh }) }).then((x) => x.json());
  if (!r.id) throw new Error(r.error || "không bắt đầu được hội đồng");
  for (let i = 0; i < 240; i++) {
    await sleep(15000);
    const s = await fetch(`${BASE}/api/sessions`).then((x) => x.json()).catch(() => null);
    if (s && s.running !== r.id) {
      const j = await fetch(`${BASE}/api/sessions/${encodeURIComponent(r.id)}`).then((x) => x.json()).catch(() => null);
      if (j?.status && j.status !== "running") return j;
    }
  }
  throw new Error("quá 60 phút chưa xong");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const ketQua = [];
  const chamLai = opt("cham-lai");
  for (const ca of cacCa) {
    let phien;
    try {
      if (chamLai) {
        // chấm lại: phiên mới nhất trong thư mục có prompt khớp ca
        const dir = path.resolve(chamLai === "true" ? SESSIONS_DIR : chamLai);
        const ds = fs.readdirSync(dir).map((d) => path.join(dir, d, "events.json")).filter((f) => fs.existsSync(f)).map((f) => JSON.parse(fs.readFileSync(f, "utf8")));
        phien = ds.filter((j) => (j.prompt || "").includes(ca.prompt.slice(0, 60))).sort((a, b) => (a.id < b.id ? 1 : -1))[0];
        if (!phien) { console.log(`- ${ca.id}: chưa có phiên để chấm`); continue; }
      } else phien = await chayMot(ca);
    } catch (e) { console.log(`- ${ca.id}: LỖI ${e.message}`); continue; }
    const c = chamPhien(ca, phien);
    ketQua.push({ id: ca.id, phien: phien.id, ...c });
    console.log(`- ${ca.id} (${phien.id}): ${c.diem}/${c.toi_da} · ${c.nhan || "-"} ${c.phuong_an || ""} · tin cậy ${c.tin_cay ?? "-"} · dự báo ${c.du_bao ?? "-"}%${c.loi.length ? `\n    ${c.loi.join("\n    ")}` : ""}`);
  }
  const tong = ketQua.reduce((a, x) => [a[0] + x.diem, a[1] + x.toi_da], [0, 0]);
  if (ketQua.length) console.log(`TỔNG: ${tong[0]}/${tong[1]} (${Math.round((tong[0] / tong[1]) * 100)}%)`);
}
