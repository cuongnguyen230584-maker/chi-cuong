import { test } from "node:test";
import assert from "node:assert/strict";
import { cheDuLieu, baoChe } from "../lib/che-du-lieu.mjs";

test("che số hộ chiếu, ngày sinh, email, điện thoại, số định danh", () => {
  const r = cheDuLieu("Khách Kim, hộ chiếu số M12345678, ngày sinh: 12/03/1985, email kim.lee@abc.co.kr, ĐT 0912 345 678, +82 10 1234 5678, CCCD 001085012345.");
  assert.doesNotMatch(r.text, /M12345678|12\/03\/1985|kim\.lee@|0912 345 678|1234 5678|001085012345/);
  assert.match(r.text, /hộ chiếu số \[số giấy tờ đã che\]/);
  assert.match(r.text, /ngày sinh: \[ngày sinh đã che\]/);
  assert.match(baoChe(r.che), /Đã che trước khi gửi hội đồng/);
});

test("không che số liệu kinh doanh, ngày hạn hay số hiệu văn bản", () => {
  const s = "Doanh thu 750 triệu/tháng, 15 khách, visa hết hạn 20/11/2026, căn cứ 61/2020/QH14 và 219/2025/NĐ-CP, vốn 10 tỷ, 40 hồ sơ/tháng.";
  const r = cheDuLieu(s);
  assert.equal(r.text, s);
  assert.deepEqual(r.che, []);
  assert.equal(baoChe(r.che), "");
});

test("số hộ chiếu không nhãn kiểu chữ + số", () => {
  assert.match(cheDuLieu("Passport EA1234567 còn hạn").text, /\[số giấy tờ đã che\]/);
});
