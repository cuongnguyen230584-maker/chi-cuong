import { test } from "node:test";
import assert from "node:assert/strict";
import { createDichPhieu, chiaPhan } from "../lib/dich-phieu.mjs";

const phieu = () => ({
  tieuDe: "Xin thẻ tạm trú",
  lamNgay: "Nộp hồ sơ",
  khuyenNghi: "Nên làm",
  buoc: [{ han: "12/11/2026", viec: "Nộp hồ sơ" }, { han: "20/11/2026", viec: "Nhận thẻ" }],
  canCu: ["Luật 51/2019/QH14", "Nghị định 219/2025/NĐ-CP"],
  ruiRo: [],
  tuyenBo: "Bản tham khảo",
});

// Fake AI: "dịch" by prefixing EN:, logs every call; `chamMs` makes each call slow to see parallel runs.
function aiGia({ chamMs = 0, thieuLanDau = false } = {}) {
  const goi = [];
  let dangChay = 0, toiDa = 0;
  const ask = async ({ prompt }) => {
    const vao = JSON.parse(prompt.slice(prompt.lastIndexOf("\n\n") + 2));
    goi.push(vao);
    dangChay++; toiDa = Math.max(toiDa, dangChay);
    await new Promise((r) => setTimeout(r, chamMs));
    dangChay--;
    const ban = vao.map((c) => `EN:${c}`);
    return { ban_dich: thieuLanDau && goi.length === 1 ? ban.slice(1) : ban };
  };
  return { ask, goi, toiDa: () => toiDa };
}

test("giữ nguyên cấu trúc, chỉ dịch chữ, không dịch ngày", async () => {
  const ai = aiGia();
  const ban = await createDichPhieu({ ask: ai.ask })(phieu(), "en");
  assert.equal(ban.tieuDe, "EN:Xin thẻ tạm trú");
  assert.deepEqual(ban.buoc[0], { han: "12/11/2026", viec: "EN:Nộp hồ sơ" });
  assert.deepEqual(ban.canCu, ["EN:Luật 51/2019/QH14", "EN:Nghị định 219/2025/NĐ-CP"]);
  assert.deepEqual(ban.ruiRo, []);
  assert.ok(!ai.goi.flat().includes("12/11/2026"), "ngày không gửi đi dịch");
});

test("câu lặp lại chỉ dịch một lần", async () => {
  const ai = aiGia();
  const ban = await createDichPhieu({ ask: ai.ask })(phieu(), "en");
  assert.equal(ai.goi.flat().filter((c) => c === "Nộp hồ sơ").length, 1);
  assert.equal(ban.lamNgay, "EN:Nộp hồ sơ");
  assert.equal(ban.buoc[0].viec, "EN:Nộp hồ sơ");
});

test("phiếu dài được chia phần và dịch song song", async () => {
  const ai = aiGia({ chamMs: 30 });
  const dai = { ...phieu(), ruiRo: Array.from({ length: 12 }, (_, i) => `Rủi ro số ${i} `.repeat(20)) };
  const ban = await createDichPhieu({ ask: ai.ask, kichThuoc: 600 })(dai, "zh");
  assert.ok(ai.goi.length > 1, "nhiều phần");
  assert.ok(ai.toiDa() > 1, "chạy song song");
  assert.equal(ban.ruiRo[11], `EN:${dai.ruiRo[11]}`);
});

test("tải lại cùng phiếu, cùng ngôn ngữ thì không gọi AI lần nữa", async () => {
  const ai = aiGia();
  const dich = createDichPhieu({ ask: ai.ask });
  await dich(phieu(), "en");
  const lan1 = ai.goi.length;
  await dich(phieu(), "en");
  assert.equal(ai.goi.length, lan1);
  await dich(phieu(), "ko");
  assert.ok(ai.goi.length > lan1, "ngôn ngữ khác thì dịch mới");
});

test("AI trả thiếu câu thì thử lại phần đó", async () => {
  const ai = aiGia({ thieuLanDau: true });
  const ban = await createDichPhieu({ ask: ai.ask })(phieu(), "en");
  assert.equal(ban.tieuDe, "EN:Xin thẻ tạm trú");
});

test("lỗi thì không nhớ, lần sau dịch lại được", async () => {
  let hong = true;
  const ask = async ({ prompt }) => {
    if (hong) throw new Error("mạng lỗi");
    return { ban_dich: JSON.parse(prompt.slice(prompt.lastIndexOf("\n\n") + 2)).map((c) => `EN:${c}`) };
  };
  const dich = createDichPhieu({ ask });
  await assert.rejects(dich(phieu(), "en"), /mạng lỗi/);
  hong = false;
  assert.equal((await dich(phieu(), "en")).tieuDe, "EN:Xin thẻ tạm trú");
});

test("ngôn ngữ không hỗ trợ bị từ chối", async () => {
  await assert.rejects(createDichPhieu({ ask: aiGia().ask })(phieu(), "fr"), /không hỗ trợ/);
});

test("chiaPhan giữ thứ tự và không làm rơi câu", () => {
  const ds = ["a".repeat(500), "b".repeat(500), "c".repeat(500), "d"];
  const phan = chiaPhan(ds, 1000);
  assert.deepEqual(phan.flat(), ds);
  assert.ok(phan.length >= 2);
});
