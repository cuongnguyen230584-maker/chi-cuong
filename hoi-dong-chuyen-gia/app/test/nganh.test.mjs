import { test } from "node:test";
import assert from "node:assert/strict";
import { danhSachGoi, goi, chuToa, gheCua, banMacDinh, doanGoi, mucCua, thuocGoi, goiChoTrang, GOI_MAC_DINH } from "../lib/nganh.mjs";
import { systemHoi } from "../lib/hoi-goc.mjs";
import { checkQuotes, seatIn, byKey } from "../lib/seats.mjs";

test("roster khai báo gói kinh doanh và gói pháp lý", () => {
  const keys = danhSachGoi().map((g) => g.key);
  assert.deepEqual(keys.slice(0, 2), ["kinh-doanh", "phap-ly-nnn"]);
  assert.equal(goi("khong-co").key, GOI_MAC_DINH, "gói lạ rơi về gói đầu tiên");
  assert.equal(goi("phap-ly-nnn").loai, "vai-tro");
});

test("gói kinh doanh giữ đúng bàn và Chủ toạ của bản gốc", () => {
  const g = goi("kinh-doanh");
  assert.equal(chuToa(g), "musk");
  assert.deepEqual(banMacDinh(g), ["bezos", "graham", "hormozi", "garyvee", "martell", "wickman", "buffett"]);
  assert.ok(!gheCua(g).includes("musk"), "Chủ toạ không ngồi bàn");
  assert.ok(gheCua(g).every((k) => thuocGoi(byKey[k], "kinh-doanh")));
});

test("ghế của gói pháp lý không lọt sang gói kinh doanh", () => {
  const kd = gheCua(goi("kinh-doanh"));
  for (const k of ["fdi", "xnc", "laodong", "tuphap", "thue", "tuanthu", "vanhanh", "khachhang", "chutoapl"]) assert.ok(!kd.includes(k), k);
  const pl = goi("phap-ly-nnn");
  for (const k of gheCua(pl)) assert.ok(thuocGoi(byKey[k], "phap-ly-nnn"), k);
  assert.ok(!gheCua(pl).includes("chutoapl"));
});

test("đoán gói theo câu hỏi", () => {
  assert.equal(doanGoi("Khách Hàn Quốc sắp hết hạn visa DN, nên gia hạn hay xin thẻ tạm trú?"), "phap-ly-nnn");
  assert.equal(doanGoi("Có nên làm giấy phép lao động trước khi thành lập công ty FDI không?"), "phap-ly-nnn");
  assert.equal(doanGoi("Có nên tăng giá gói tư vấn lên 20% không?"), "kinh-doanh");
});

test("mục của file gói ngành đọc theo tiêu đề", () => {
  const m = mucCua("# x\n\n## Luật ngành\n1. a\n2. b\n\n## Tuyên bố\nChỉ tham khảo.\n");
  assert.equal(m["luật ngành"], "1. a\n2. b");
  assert.equal(m["tuyên bố"], "Chỉ tham khảo.");
  const pl = goi("phap-ly-nnn");
  assert.match(pl.luat_nganh, /CẦN KIỂM TRA/);
  assert.match(pl.tuyen_bo, /không phải người thật/);
  assert.ok(pl.gioi_thieu_chu_toa && pl.cong_cu_hoi);
});

test("Chủ toạ hỏi gốc theo gói", () => {
  assert.match(systemHoi("kinh-doanh"), /Elon Musk/);
  const pl = systemHoi("phap-ly-nnn");
  assert.match(pl, /luật sư điều hành/);
  assert.match(pl, /LUẬT NGÀNH/);
  assert.doesNotMatch(pl, /idiot index/);
});

test("trang nhận danh sách gói", () => {
  const t = goiChoTrang();
  assert.ok(t.find((g) => g.key === "kinh-doanh").default.length === 7);
  assert.ok(t.every((g) => Array.isArray(g.ghe)));
});

test("kiểm trích dẫn và tìm tên ghế với chữ có dấu", () => {
  // một ghế có não thật: câu tiếng Anh trong não vẫn kiểm được như trước
  const en = checkQuotes("buffett", 'He said "A string of wonderful numbers times zero will always equal zero." (S095)');
  assert.equal(en[0]?.verified, true);
  // câu bịa có dấu không được đánh dấu là đã kiểm
  const vi = checkQuotes("buffett", 'Ông nói "Đây là một câu tiếng Việt hoàn toàn bịa đặt không có trong não." (S001)');
  assert.equal(vi[0]?.verified, false);
  assert.equal(seatIn("Tôi phản đối Buffett nhất")?.key, "buffett");
});

test("phiếu viết giá trị tiếng Việt vẫn đọc đúng", async () => {
  const { parseCard } = await import("../lib/seats.mjs");
  const c = parseCard("STANCE: Có điều kiện\nOPTION SCORES: A 7,5 · B 6 · C 2,5\nPILLAR SCORE: 8,5/10\nCONFIDENCE: 4\nRUIN RISK: khả năng cao\nDOOR: một chiều\nVOTE: Không tán thành\n", ["A", "B", "C"]);
  assert.deepEqual(c.optionScores, { A: 7.5, B: 6, C: 2.5 });
  assert.equal(c.pillar, 8.5);
  assert.equal(c.ruin, "likely");
  assert.equal(c.door, "one-way");
  assert.equal(c.vote, "dissent");
  assert.equal(parseCard("VOTE: Endorse with amendment", ["A"]).vote, "amend");
  assert.equal(parseCard("VOTE: Tán thành", ["A"]).vote, "endorse");
  assert.equal(parseCard("RUIN RISK: none", ["A"]).ruin, "none");
  assert.equal(parseCard("không có phiếu", ["A"]).vote, "");
});
