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
    "- S002 | Nghị định 152/2020/NĐ-CP | u | | | TÌNH TRẠNG: hết hiệu lực, thay thế bởi Nghị định 219/2025/NĐ-CP | k",
  ].join("\n"));
  const idx = chiMucLuat(["a", "khong-co"], dir);
  const k = kiemLuat("Căn cứ 61/2020/QH14 và NĐ 152/2020/NĐ-CP, thêm 99/2099/NĐ-CP", idx);
  assert.deepEqual(k.con.map((x) => x.so), ["61/2020/QH14"]);
  assert.deepEqual(k.het.map((x) => x.so), ["152/2020/NĐ-CP"]);
  assert.deepEqual(k.ngoai.map((x) => x.so), ["99/2099/NĐ-CP"]);
  const g = gopKiemLuat([k, kiemLuat("152/2020/NĐ-CP", idx)]);
  assert.equal(g.het.length, 1);
  assert.match(canhBaoLuat(g), /HẾT HIỆU LỰC.*152\/2020\/NĐ-CP/);
  assert.equal(canhBaoLuat({ con: [{ so: "x" }], het: [], ngoai: [] }), "");
});
