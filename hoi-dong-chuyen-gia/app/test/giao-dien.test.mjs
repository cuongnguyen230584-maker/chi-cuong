import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { soVi, boMaNguon, soChuaNguonThat, noiDungPhieuKhach, TUYEN_BO_CHUNG } from "../public/pdf.js";

const PUB = new URL("../public/", import.meta.url);
const doc = (f) => readFileSync(new URL(f, PUB), "utf8");
const TB_PL = "Các thành viên hội đồng là chuyên gia mô phỏng theo vai nghề, dựng từ văn bản pháp luật và nguồn chính thức. Họ không phải người thật. Nội dung là phân tích tham khảo, không thay thế ý kiến của luật sư hoặc kết quả giải quyết của cơ quan có thẩm quyền.";

test("soVi: điểm dùng dấu phẩy thập phân, số nguyên và chỗ trống giữ nguyên", () => {
  assert.equal(soVi(6.5), "6,5");
  assert.equal(soVi("2.3"), "2,3");
  assert.equal(soVi(7), "7");
  assert.equal(soVi(null), "-");
  assert.equal(soVi(undefined), "-");
});

test("boMaNguon: bỏ mã S0xx trần, giữ số hiệu văn bản và nhãn", () => {
  assert.equal(boMaNguon("Phạt và trục xuất (S001, S011, S025)."), "Phạt và trục xuất.");
  assert.equal(boMaNguon("Khung thứ tự (Khung thứ tự thủ tục, S006) rồi nộp."), "Khung thứ tự (Khung thứ tự thủ tục) rồi nộp.");
  assert.equal(boMaNguon("Áp dụng từ 11/9/2026 (CẦN KIỂM TRA (S027))."), "Áp dụng từ 11/9/2026 (CẦN KIỂM TRA).");
  assert.equal(boMaNguon("Luật 47/2014/QH13, Điều 7 (nguồn S002)"), "Luật 47/2014/QH13, Điều 7");
  assert.doesNotMatch(boMaNguon("theo S009 và S010; xem S021"), /S0\d\d/);
});

test("soChuaNguonThat: bỏ báo nhầm ở số hiệu văn bản, số điều, số tỉnh; giữ số thật", () => {
  const ds = [
    { so: "283", doan: "…phạt theo số người lao động (Nghị định 283/2026/NĐ-CP; Nghị định 59/2026/NĐ-CP; CẦ…" },
    { so: "23", doan: "…Luật 47/2014/QH13 sửa đổi bởi Luật 23/2023/QH15, Điều 7, khoản 4)…" },
    { so: "151", doan: "…Bộ luật Lao động 45/2019/QH14, Điều 151; CẦN KIỂM TRA…" },
    { so: "34", doan: "…theo địa giới 34 tỉnh sau sắp xếp…" },
    { so: "4", doan: "…Điều 7, khoản 4). Khách chưa…" },
    { so: "15", doan: "…tỷ lệ hồ sơ bị trả lại khoảng 15 hồ sơ mỗi tháng…" },
  ];
  assert.deepEqual(soChuaNguonThat(ds).map((x) => x.so), ["15"]);
  assert.deepEqual(soChuaNguonThat(undefined), []);
});

const SETUP = {
  title: "Xử lý khách quá hạn tạm trú", nganh: "phap-ly-nnn",
  options: [{ id: "A", label: "Khách tự trình diện, nộp phạt, xuất cảnh; sau đó làm lại giấy phép lao động" }, { id: "B", label: "Gia hạn tại chỗ" }],
};
const VERDICT = {
  type: "verdict",
  verdict: {
    label: "GO WITH CONDITIONS", recommended: "A",
    call: "Chọn phương án A: khách tự trình diện, nộp phạt, xuất cảnh, sau đó làm lại giấy phép lao động. Khách phải ngừng làm việc ngay hôm nay (S004).",
    scores: { A: { score: 6.5 }, B: { score: 2.3 } }, confidence: 6,
    next_steps: [
      { when: "Ngày 0", action: "Khách ngừng làm việc (S011)." },
      { when: "Ngày 0", action: "Gửi luật sư hồ sơ tóm tắt kèm câu hỏi tại điều kiện 5." },
      { when: "Trong 48 giờ", action: "Nhận ý kiến luật sư. Nếu chưa có thì báo người sáng lập." },
      { when: "Chậm nhất ngày 3", action: "Khách trình diện, khai đúng sự thật." },
      { when: "Ngày 5", action: "Lưu biên lai." },
      { when: "Ngày 30", action: "Làm lại giấy phép lao động." },
    ],
    conditions: [
      "Rủi ro không đảo ngược được nêu trước. Trình diện có thể dẫn tới trục xuất và cấm nhập cảnh (S022).",
      "Văn phòng không hỗ trợ phương án C.",
      "GIẢ ĐỊNH: bậc phạt kế tiếp ở mốc 30 ngày.",
      "Đây là phân tích tham khảo. Luật sư phải xác nhận mức phạt trước khi trình diện.",
    ],
    kill_criteria: "Dừng nếu khách yêu cầu khai sai.",
    kiem_luat: { con: [{ so: "47/2014/QH13" }], het: [{ so: "144/2021/NĐ-CP" }], ngoai: [] },
    du_bao: { ket_qua: "Cơ quan nhận hồ sơ trình diện trong 3 ngày", xac_suat: 62.5, han: "30/10/2026" },
    fights: [{ crux: "Có an toàn không?", story: "Tuân thủ chấm 5/10." }],
    minority: { seat: "Tuân thủ", quote: "A chỉ ít xấu nhất." },
    disclaimer: TB_PL,
  },
};

test("noiDungPhieuKhach: khuyến nghị, 3–5 bước có hạn, rủi ro, việc cần kiểm tra, dự báo, lời miễn trừ của gói", () => {
  const p = noiDungPhieuKhach({ setup: SETUP, verdict: VERDICT });
  assert.equal(p.nhan, "LÀM CÓ ĐIỀU KIỆN");
  assert.match(p.phuongAn, /^Phương án A: Khách tự trình diện/);
  assert.equal(p.khuyenNghi, "Khách phải ngừng làm việc ngay hôm nay."); // the sentence repeating the option is dropped
  assert.equal(p.buoc.length, 5);
  assert.ok(p.buoc.every((b) => b.han && b.viec));
  assert.doesNotMatch(p.buoc[1].viec, /điều kiện 5/); // internal cross-references go
  assert.match(p.buoc[2].viec, /lãnh đạo văn phòng/);
  assert.ok(p.ruiRo.some((r) => /trục xuất/.test(r)));
  assert.ok(p.ruiRo.some((r) => /^Điểm dừng: /.test(r)));
  assert.ok(!p.ruiRo.join(" ").startsWith("Rủi ro không đảo ngược được nêu trước"));
  assert.deepEqual(p.dieuKien, ["Văn phòng không hỗ trợ phương án C."]);
  assert.ok(p.canKiemTra.some((x) => x.startsWith("144/2021/NĐ-CP: đã hết hiệu lực")));
  assert.ok(p.canKiemTra.some((x) => x.includes("47/2014/QH13")));
  assert.ok(p.canKiemTra.some((x) => x.startsWith("Luật sư phải xác nhận mức phạt")));
  assert.deepEqual(p.duBao, ["Cơ quan nhận hồ sơ trình diện trong 3 ngày: khả năng 62,5% (xem lại 30/10/2026)."]);
  assert.equal(p.tuyenBo, TB_PL);
});

test("noiDungPhieuKhach: không có điểm số, tranh luận nội bộ, mã S0xx hay nhãn GIẢ ĐỊNH", () => {
  const all = JSON.stringify(noiDungPhieuKhach({ setup: SETUP, verdict: VERDICT }));
  assert.doesNotMatch(all, /\bS0\d\d\b/);
  assert.doesNotMatch(all, /6[.,]5|2[.,]3|5\/10/); // scores
  assert.doesNotMatch(all, /Có an toàn không|ít xấu nhất/); // fights, minority
  assert.doesNotMatch(all, /GIẢ ĐỊNH/);
});

test("noiDungPhieuKhach: thiếu lời miễn trừ trong kết luận thì lấy của gói, rồi lời chung", () => {
  const v = { ...VERDICT, verdict: { ...VERDICT.verdict, disclaimer: undefined } };
  assert.equal(noiDungPhieuKhach({ setup: SETUP, verdict: v, tuyenBo: "gói" }).tuyenBo, "gói");
  assert.equal(noiDungPhieuKhach({ setup: SETUP, verdict: v }).tuyenBo, TUYEN_BO_CHUNG);
  assert.doesNotThrow(() => noiDungPhieuKhach({ setup: {}, verdict: { verdict: {} } }));
});

test("giao diện: không còn lời miễn trừ viết cứng của gói kinh doanh ở kết luận, thẻ ghế và PDF", () => {
  const app = doc("app.js"), pdf = doc("pdf.js");
  assert.doesNotMatch(app, /Cố vấn mô phỏng, dựng từ tác phẩm công khai của từng người/);
  assert.doesNotMatch(pdf, /DISCLAIMER_VI/);
  assert.match(app, /tuyenBo\(v\)/); // the verdict sheet's footer takes the verdict's or the pack's text
  assert.match(app, /loai === "vai-tro"/); // a role seat's card says it is built from law, not from a person
  assert.match(app, /data-phieu/);
  assert.match(pdf, /format: "a4"/);
});

test("giao diện: gói nhớ trong localStorage có bọc try/catch, mặc định gói pháp lý", () => {
  const app = doc("app.js");
  assert.match(app, /GOI_MAC_DINH = "phap-ly-nnn"/);
  for (const m of app.matchAll(/localStorage\.(?:getItem|setItem)/g)) {
    const before = app.slice(Math.max(0, m.index - 30), m.index);
    assert.match(before, /try \{/, "every localStorage call sits inside try");
  }
});
