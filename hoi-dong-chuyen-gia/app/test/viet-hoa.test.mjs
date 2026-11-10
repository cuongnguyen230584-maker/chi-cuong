import { test } from "node:test";
import assert from "node:assert/strict";
import { slugify } from "../lib/council.mjs";
import { ngayIso, ngayVN } from "../lib/ngay.mjs";
import { soTrong, kiemSo } from "../lib/luat-so.mjs";

test("slugify: bỏ dấu đúng cách, đ thành d, không xoá chữ có dấu", () => {
  assert.equal(slugify("Tăng giá dịch vụ tư vấn"), "tang-gia-dich-vu-tu-van");
  assert.equal(slugify("Đổi thẻ tạm trú"), "doi-the-tam-tru");
  assert.equal(slugify("Đổi thẻ tạm trú".normalize("NFD")), "doi-the-tam-tru");
  assert.equal(slugify(""), "hoi-dong");
  assert.equal(slugify("???"), "hoi-dong");
  assert.ok(slugify("Có nên mở chi nhánh thứ hai ở Đà Nẵng trong quý tới không nhỉ").length <= 50);
  assert.ok(!slugify("Có nên mở chi nhánh thứ hai ở Đà Nẵng trong quý tới không nhỉ").endsWith("-"));
});

test("ngày theo giờ Việt Nam: 0 giờ đến 7 giờ sáng không mang ngày hôm trước", () => {
  // 25/10/2026 17:30 UTC = 26/10/2026 00:30 giờ Việt Nam
  assert.equal(ngayIso(new Date("2026-10-25T17:30:00Z")), "2026-10-26");
  assert.equal(ngayIso(new Date("2026-10-25T16:59:00Z")), "2026-10-25");
  assert.equal(ngayVN(new Date("2026-10-25T17:30:00Z")), "26/10/2026");
  assert.equal(ngayVN("2026-11-02"), "02/11/2026");
  assert.equal(ngayVN("2026-10-26-abc123"), "26/10/2026");
  assert.equal(ngayVN("không phải ngày"), "không phải ngày");
});

test("luat-so: 'tỉ' cũng là tỷ; đơn vị viết hoa; dấu cách phân nghìn; chữ NFD", () => {
  assert.deepEqual(soTrong("1,5 tỉ").map((x) => x.value), [1.5e9]);
  assert.deepEqual(soTrong("2 tỉ đồng").map((x) => x.value), [2e9]);
  assert.deepEqual(soTrong("1,5 Tỷ và 3 TỶ").map((x) => x.value), [1.5e9, 3e9]);
  assert.deepEqual(soTrong("1 000 khách, 12 345,5 kg").map((x) => x.value), [1000, 12345.5]);
  assert.deepEqual(soTrong("1,5 tỷ".normalize("NFD")).map((x) => x.value), [1.5e9]);
  assert.deepEqual(soTrong("15 tiếng", { chu: false }).map((x) => x.value), [15]); // "ti" của "tiếng" không phải đơn vị tỉ
  // đề bài ghi "tỷ", kết luận ghi "tỉ": cùng một số, không bị gắn cờ chưa có nguồn
  assert.deepEqual(kiemSo({ dauVao: "Doanh thu năm ngoái 1,5 tỷ", vanBan: "Doanh thu 1,5 tỉ là đủ" }).chua_nguon, []);
});
