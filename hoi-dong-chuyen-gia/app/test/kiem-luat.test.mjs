import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { soHieuTrong, trangThaiDong, chiMucLuat, kiemLuat, gopKiemLuat, canhBaoLuat } from "../lib/kiem-luat.mjs";

test("dò số hiệu văn bản, bỏ ngày và phân số", () => {
  assert.deepEqual(soHieuTrong("Luật 61/2020/QH14, NĐ 152/2020/ND-CP, 219/2025/NĐ-CP, TT 35/2024/TT-BGTVT, NQ 127/NQ-CP; ngày 26/10/2026; 1/3 số hồ sơ; lại 61/2020/QH14"),
    ["61/2020/QH14", "152/2020/NĐ-CP", "219/2025/NĐ-CP", "35/2024/TT-BGTVT", "127/NQ-CP"]);
});

test("đọc tình trạng trên dòng nguồn", () => {
  assert.equal(trangThaiDong("- S001 | NĐ 152/2020/NĐ-CP | u | x | y | TÌNH TRẠNG: hết hiệu lực, thay thế bởi 219/2025/NĐ-CP | k"), "het");
  assert.equal(trangThaiDong("- S002 | Luật 61/2020/QH14 | u | x | y | TÌNH TRẠNG: còn hiệu lực, sửa đổi bởi 03/2022/QH15 | k"), "con");
  assert.equal(trangThaiDong("- S003 | Luật X | u"), "");
});

test("đối chiếu với nguồn của não: còn, hết, ngoài nguồn", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "kl-"));
  fs.mkdirSync(path.join(dir, "a"));
  fs.writeFileSync(path.join(dir, "a", "sources.md"), [
    "- S001 | Luật Đầu tư số 61/2020/QH14 | u | ban hành 17/6/2020 | hiệu lực 01/01/2021 | TÌNH TRẠNG: còn hiệu lực | kiểm tra ngày 26/10/2026",
    "- S003 | Thông tư 31/2015/TT-BCA | u | | | TÌNH TRẠNG: CẦN KIỂM TRA | k",
    "- S002 | Nghị định 152/2020/NĐ-CP | u | | | TÌNH TRẠNG: hết hiệu lực, thay thế bởi Nghị định 219/2025/NĐ-CP | k",
  ].join("\n"));
  const idx = chiMucLuat(["a", "khong-co"], dir);
  assert.equal(kiemLuat("TT 31/2015/TT-BCA", idx).ngoai[0]?.chua_ro, true, "tình trạng chưa rõ thì không coi là còn hiệu lực");
  const k = kiemLuat("Căn cứ 61/2020/QH14 và NĐ 152/2020/NĐ-CP, thêm 99/2099/NĐ-CP", idx);
  assert.deepEqual(k.con.map((x) => x.so), ["61/2020/QH14"]);
  assert.deepEqual(k.het.map((x) => x.so), ["152/2020/NĐ-CP"]);
  assert.deepEqual(k.ngoai.map((x) => x.so), ["99/2099/NĐ-CP"]);
  const g = gopKiemLuat([k, kiemLuat("152/2020/NĐ-CP", idx)]);
  assert.equal(g.het.length, 1);
  assert.match(canhBaoLuat(g), /HẾT HIỆU LỰC.*152\/2020\/NĐ-CP/);
  assert.equal(canhBaoLuat({ con: [{ so: "x" }], het: [], ngoai: [] }), "");
});

test("dạng viết tắt nối được với nguồn đầy đủ; CẦN KIỂM TRA không bị đọc là còn hiệu lực", async () => {
  const { soHieuTat, ganSoHieu } = await import("../lib/kiem-luat.mjs");
  assert.deepEqual(soHieuTat("NĐ 144/2021, Nghị định 96/2026 và Luật Đầu tư 143/2025, ngày 26/10/2026").map((x) => x.so), ["NĐ 144/2021", "NĐ 96/2026", "Luật 143/2025"]);
  assert.equal(trangThaiDong("- S009 | TT 31/2015/TT-BCA | u | | | TÌNH TRẠNG: CẦN KIỂM TRA (chưa xác minh còn hiệu lực) | k"), "");
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "kl2-"));
  fs.mkdirSync(path.join(dir, "xnc"));
  fs.writeFileSync(path.join(dir, "xnc", "sources.md"), [
    "- S001 | Luật 47/2014/QH13 | u | | | TÌNH TRẠNG: còn hiệu lực | k",
    "- S002 | Luật 51/2019/QH14 sửa đổi Luật 47/2014/QH13 | u | | | TÌNH TRẠNG: còn hiệu lực | k",
    "- S015 | Nghị định 144/2021/NĐ-CP | u | | | TÌNH TRẠNG: đã thay thế bởi Nghị định 282/2025/NĐ-CP | k",
  ].join("\n"));
  const idx = chiMucLuat(["xnc"], dir);
  const k = kiemLuat("Phạt theo NĐ 144/2021; đổi tại chỗ theo Luật 51/2019", idx);
  assert.deepEqual(k.het.map((x) => x.so), ["144/2021/NĐ-CP"]);
  assert.deepEqual(k.con.map((x) => x.so), ["51/2019/QH14"]);
  // mã S trần của một ghế được gắn số hiệu theo não của chính ghế đó
  assert.equal(ganSoHieu("Đổi tại chỗ (S002, Điều 7). Phạt (S015).", "xnc", dir), "Đổi tại chỗ (S002: 51/2019/QH14, Điều 7). Phạt (S015: 144/2021/NĐ-CP).");
  assert.equal(ganSoHieu("Luật 51/2019/QH14 (S002)", "xnc", dir), "Luật 51/2019/QH14 (S002)", "đã có số hiệu ngay trước thì để nguyên");
});

test("thẻ tự mâu thuẫn và máy dò số bỏ qua viện dẫn luật", async () => {
  const { parseCard } = await import("../lib/seats.mjs");
  const { theMauThuan } = await import("../lib/council.mjs");
  const { soTrong } = await import("../lib/luat-so.mjs");
  const p = parseCard("STANCE: Conditional yes (phương án A)\nOPTION SCORES: A 5 · B 3 · D 8\nTHE CALL: Tôi chọn A, kèm bước D.", ["A", "B", "D"]);
  assert.equal(p.chon, "A");
  const st = { seats: ["tuanthu"], cards: { 2: { tuanthu: { parsed: p } } } };
  assert.deepEqual(theMauThuan(st, 2), [{ seat: "tuanthu", chon: "A", cao_nhat: "D" }]);
  assert.deepEqual(soTrong("Theo NĐ 282/2025/NĐ-CP Điều 21 khoản 3, Luật Đầu tư 143/2025, DN1 sang ĐT3, phạt 30 triệu").map((x) => x.so), ["30 triệu"]);
});

test("nhắc văn bản là đã bị thay thì không bị coi là viện dẫn", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "kl3-"));
  fs.mkdirSync(path.join(dir, "fdi"));
  fs.writeFileSync(path.join(dir, "fdi", "sources.md"), "- S018 | Nghị định 09/2018/NĐ-CP | u | | | TÌNH TRẠNG: hết hiệu lực từ 18/10/2026 | k\n");
  const idx = chiMucLuat(["fdi"], dir);
  const a = kiemLuat("Nghị định 09/2018/NĐ-CP đã bị thay bằng Nghị định 342/2026/NĐ-CP từ 18/10/2026.", idx);
  assert.equal(a.het.length, 0);
  assert.equal(a.nhac_het[0]?.so, "09/2018/NĐ-CP");
  const b = kiemLuat("Xin giấy phép bán lẻ theo Nghị định 09/2018/NĐ-CP, Điều 5.", idx);
  assert.equal(b.het[0]?.so, "09/2018/NĐ-CP");
});
