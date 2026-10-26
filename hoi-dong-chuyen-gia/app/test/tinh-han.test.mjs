import { test } from "node:test";
import assert from "node:assert/strict";
import { amSangDuong, ngayNghiLe, tinhHan, docNgay } from "../lib/tinh-han.mjs";

test("âm lịch: mùng 1 Tết và Giỗ Tổ các năm đã biết", () => {
  assert.deepEqual(amSangDuong(1, 1, 2024), [10, 2, 2024]);
  assert.deepEqual(amSangDuong(1, 1, 2025), [29, 1, 2025]);
  assert.deepEqual(amSangDuong(1, 1, 2026), [17, 2, 2026]);
  assert.deepEqual(amSangDuong(10, 3, 2024), [18, 4, 2024]);
  assert.deepEqual(amSangDuong(10, 3, 2025), [7, 4, 2025]);
});

test("ngày làm việc bỏ cuối tuần, Tết và nghỉ bù", () => {
  assert.equal(tinhHan("26/10/2026", 5).han, "02/11/2026");
  const tet = tinhHan("12/02/2026", 5, "lam-viec", { lichChinhThuc: {} });
  assert.equal(tet.han, "26/02/2026");
  assert.equal(tet.cac_ngay_nghi.length, 5);
  assert.ok(ngayNghiLe(2026, { lichChinhThuc: {} }).ngay.has("2026-04-27"), "Giỗ Tổ Chủ nhật 26/4 thì nghỉ bù 27/4");
});

test("ngày lịch: hạn rơi vào ngày nghỉ thì lùi tới ngày làm việc kế tiếp", () => {
  assert.equal(tinhHan("01/10/2026", 30, "lich", { lichChinhThuc: {} }).han, "02/11/2026"); // 31/10 thứ Bảy
});

test("lịch chính thức thay lịch dự kiến; ngày sai dạng bị từ chối", () => {
  const r = tinhHan("12/02/2026", 1, "lam-viec", { lichChinhThuc: { 2026: ["2026-02-13"] } });
  assert.equal(r.han, "16/02/2026");
  assert.match(r.ghi_chu, /chính thức/);
  assert.equal(docNgay("31/02/2026"), null);
  assert.throws(() => tinhHan("hôm qua", 3));
});

test("chấm Brier từ mục Dự báo của phiếu", async () => {
  const { docDuBao, brier } = await import("../scripts/cham-brier.mjs");
  const a = docDuBao("# x\n\n## Dự báo\n\nKhách có thẻ: **70%** (hạn 30/11).\n\nKết quả thật (điền khi xem lại): ☒ Xảy ra ☐ Không xảy ra\n\n## Khác\n");
  assert.deepEqual(a, { xac_suat: 0.7, ket_qua: 1 });
  const b = docDuBao("## Dự báo\n\nX: **20%**\n\nKết quả thật: ☐ Xảy ra [x] Không xảy ra\n");
  assert.equal(b.ket_qua, 0);
  assert.equal(docDuBao("## Dự báo\n\nX: **50%**\n\n☐ Xảy ra ☐ Không xảy ra").ket_qua, null);
  assert.ok(Math.abs(brier([a, b]) - ((0.3 ** 2 + 0.2 ** 2) / 2)) < 1e-9);
});

test("hạn lưu trú hết đúng ngày, không lùi theo ngày nghỉ", () => {
  const r = tinhHan("26/10/2026", 20, "luu-tru", { lichChinhThuc: {} });
  assert.equal(r.han, "15/11/2026"); // Chủ nhật, vẫn là hạn
  assert.match(r.ghi_chu, /không lùi/);
});
