import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { soVi, boMaNguon, soChuaNguonThat, noiDungPhieuKhach, TUYEN_BO_CHUNG, ngayPhien, kiemLuatKetLuan, cauTron, phieuDeDich, ghepBanDich, nhanPhieu, NGON_NGU_PHIEU, CJK_FONT_URLS, tenCacGhe } from "../public/pdf.js";

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
    { so: "37", doan: "…Điều 7, 8 và 37 Luật 47/2014/QH13…" },
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

test("noiDungPhieuKhach: khuyến nghị, 3–6 bước có hạn, rủi ro, việc cần kiểm tra, dự báo, lời miễn trừ của gói", () => {
  const p = noiDungPhieuKhach({ setup: SETUP, verdict: VERDICT });
  assert.equal(p.nhan, "LÀM CÓ ĐIỀU KIỆN");
  assert.match(p.phuongAn, /^Phương án A: Khách tự trình diện/);
  assert.equal(p.khuyenNghi, "Khách phải ngừng làm việc ngay hôm nay."); // the sentence repeating the option is dropped
  assert.equal(p.buoc.length, 6); // every step up to six; none is dropped for its wording
  assert.ok(p.buoc.every((b) => b.han && b.viec));
  assert.doesNotMatch(p.buoc[1].viec, /điều kiện 5/); // internal cross-references go
  assert.match(p.buoc[2].viec, /lãnh đạo văn phòng/);
  assert.ok(p.ruiRo.some((r) => /trục xuất/.test(r)));
  assert.ok(p.ruiRo.some((r) => /^Điểm dừng: /.test(r)));
  assert.ok(!p.ruiRo.join(" ").startsWith("Rủi ro không đảo ngược được nêu trước"));
  assert.deepEqual(p.dieuKien, ["Văn phòng không hỗ trợ phương án C."]);
  assert.ok(p.canKiemTra.some((x) => x.startsWith("144/2021/NĐ-CP: đã hết hiệu lực")));
  assert.ok(!p.canKiemTra.some((x) => x.includes("47/2014/QH13")), "no block listing every law still in force");
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

// ---------------------------------------------------------------- vòng 2
const V2 = {
  ...VERDICT,
  verdict: {
    ...VERDICT.verdict,
    ngay_phien: "27/10/2026",
    lam_ngay: "Nộp hồ sơ gia hạn thị thực ngay hôm nay.",
    next_steps: [
      { when: "Hôm nay", action: "Đối chiếu ngày hết hạn trên thị thực. Phụ trách: Vận hành, Tuân thủ." },
      { when: "Trước 02/11/2026", action: "Có biên nhận gia hạn, người thứ hai kiểm chéo." },
      { when: "Trong 3 ngày", action: "Vẽ hai nhánh dòng hồ sơ cho ghế Tuân thủ." },
      { when: "Trong 5 ngày làm việc", action: "Nhận kết quả (Tuân thủ, Vận hành). Chủ tọa họp lại." },
    ],
    kiem_luat: { con: [{ so: "47/2014/QH13" }], het: [{ so: "09/2018/NĐ-CP" }, { so: "144/2021/NĐ-CP" }], ngoai: [], nhac_het: [{ so: "144/2021/NĐ-CP" }] },
    kiem_luat_ket_luan: { con: [{ so: "47/2014/QH13" }], het: [], ngoai: [], nhac_het: [{ so: "144/2021/NĐ-CP" }] },
    can_xac_nhan: [{ viec: "Mức phạt quá hạn theo số ngày thực tế", ai: "Luật sư" }, { viec: "Nhận hồ sơ gia hạn khi giấy phép lao động đang chờ", ai: "Phòng Quản lý xuất nhập cảnh" }],
    du_bao: { ket_qua: "Khách có thẻ tạm trú trước 31/12/2026.", xac_suat: 40, han: "31/12/2026" },
  },
};
const TEN = ["Thanh tra – Tuân thủ", "Tuân thủ", "Giám đốc Vận hành dịch vụ", "Vận hành"];

test("ngayPhien: ngày phiên của server, rồi ngày đầu mã phiên; không theo đồng hồ máy", () => {
  assert.equal(ngayPhien(V2, "2026-10-26-abc"), "27/10/2026");
  assert.equal(ngayPhien({ verdict: {} }, "2026-10-27-mvpm4op2-giu-cu-tru"), "27/10/2026");
  assert.equal(ngayPhien({}, "2026-01-05-x"), "05/01/2026");
  assert.match(ngayPhien({}, ""), /^\d{2}\/\d{2}\/\d{4}$/);
});

test("kiemLuatKetLuan: ưu tiên kiểm của chữ kết luận; nhac_het không bao giờ là lỗi; phiên cũ lấy kiem_luat", () => {
  const k = kiemLuatKetLuan(V2.verdict);
  assert.equal(k.phamVi, "ket_luan");
  assert.deepEqual(k.het, []);
  const cu = kiemLuatKetLuan({ kiem_luat: V2.verdict.kiem_luat });
  assert.equal(cu.phamVi, "phien");
  assert.deepEqual(cu.het.map((x) => x.so), ["09/2018/NĐ-CP"]); // 144/2021 is only mentioned as repealed
  assert.equal(kiemLuatKetLuan({}), null);
});

test("cauTron: không bao giờ cắt giữa câu, không dấu …", () => {
  const t = "Câu một có 3.5 tỷ đồng tại TP. Hồ Chí Minh. Câu hai dài hơn một chút. Câu ba.";
  assert.equal(cauTron(t, 10), "Câu một có 3.5 tỷ đồng tại TP. Hồ Chí Minh.");
  assert.equal(cauTron(t, 75), "Câu một có 3.5 tỷ đồng tại TP. Hồ Chí Minh. Câu hai dài hơn một chút.");
  assert.equal(cauTron("完成。然后提交。", 3), "完成。");
});

test("phiếu khách vòng 2: làm ngay, ngày phiên, cần xác nhận, không tên ghế hay thuật ngữ nội bộ, không khối số hiệu", () => {
  const p = noiDungPhieuKhach({ setup: SETUP, verdict: V2, tenGhe: TEN });
  assert.equal(p.lamNgay, "Nộp hồ sơ gia hạn thị thực ngay hôm nay.");
  const all = JSON.stringify(p);
  assert.doesNotMatch(all, /Phụ trách|Vận hành|Tuân thủ|kiểm chéo|dòng hồ sơ|\bghế\b|Chủ t[ọo]/);
  assert.doesNotMatch(all, /…/);
  assert.equal(p.buoc[0].viec, "Đối chiếu ngày hết hạn trên thị thực.");
  assert.equal(p.buoc[1].viec, "Có biên nhận gia hạn.");
  assert.equal(p.buoc.length, 3); // the step that was only internal jargon is gone
  assert.equal(p.buoc[2].viec, "Nhận kết quả.");
  assert.ok(p.canKiemTra.includes("Mức phạt quá hạn theo số ngày thực tế (Luật sư)."));
  assert.ok(p.canKiemTra.some((x) => /Phòng Quản lý xuất nhập cảnh/.test(x)));
  assert.ok(!p.canKiemTra.some((x) => /144\/2021|09\/2018|47\/2014/.test(x)), "laws only mentioned as repealed, or merely cited, are not client checks");
  assert.deepEqual(p.duBao, ["Khách có thẻ tạm trú trước 31/12/2026: khả năng 40% (xem lại 31/12/2026)."]); // no ".:"
});

test("phiếu song ngữ: gửi đúng các khoá, ghép bản dịch, nhãn cố định dịch sẵn", () => {
  const p = noiDungPhieuKhach({ setup: SETUP, verdict: V2, tenGhe: TEN });
  const gui = phieuDeDich(p);
  assert.deepEqual(Object.keys(gui).sort(), ["buoc", "canCu", "canKiemTra", "dieuKien", "duBao", "khuyenNghi", "lamNgay", "phuongAn", "ruiRo", "tieuDe", "tuyenBo"]);
  const dich = JSON.parse(JSON.stringify(gui));
  dich.tieuDe = "Overstayed temporary residence"; dich.buoc[0].viec = "Check the expiry date on the visa.";
  const g = ghepBanDich(p, dich);
  assert.equal(g.tieuDe, "Overstayed temporary residence");
  assert.equal(g.buoc[0].viec, "Check the expiry date on the visa.");
  assert.equal(g.buoc[1].viec, p.buoc[1].viec);
  assert.equal(g.nhanGoc, "GO WITH CONDITIONS");
  assert.throws(() => ghepBanDich(p, {}), /rỗng/);
  assert.deepEqual(Object.keys(NGON_NGU_PHIEU), ["vi", "en", "zh", "ko"]);
  for (const l of ["en", "zh", "ko"]) {
    const L = nhanPhieu(l);
    assert.ok(L.banDich && L.nhan["GO WITH CONDITIONS"] && L.buoc && L.kiemTra && L.ai.length === 3, l);
  }
  for (const l of ["zh", "ko"]) for (const u of CJK_FONT_URLS[l]) assert.match(u, /^https:\/\/cdn\.jsdelivr\.net\/npm\/@[^/]+\/[^@/]+@\d+\.\d+\.\d+\/.+\.ttf$/);
  assert.deepEqual(tenCacGhe({ seats: ["a"] }, { a: { name: "Thanh tra – Tuân thủ", short: "Tuân thủ" } }), ["Thanh tra – Tuân thủ", "Tuân thủ"]);
});

test("giao diện vòng 2: làm ngay, bất đồng Chủ toạ, mức ủng hộ, tính hạn lưu trú, chọn ngôn ngữ phiếu, chi phí theo phiên", () => {
  const app = doc("app.js"), html = doc("index.html"), pdf = doc("pdf.js");
  assert.match(app, /Làm ngay/);
  assert.match(app, /Đường chính/);
  assert.match(app, /Chủ toạ không đồng ý ở:/);
  assert.match(app, /support_math/);
  assert.match(app, /kiemLuatKetLuan\(v\)/);
  assert.match(app, /data-han-so/);
  assert.match(app, /nutHanThe\(c\.text\)/);
  assert.match(app, /\/api\/dich-phieu/);
  assert.match(app, /ev\.phien/);
  assert.match(html, /<option value="luu-tru">Hạn lưu trú\/thị thực \(không lùi theo ngày nghỉ\)<\/option>/);
  assert.match(html, /id="phieuDialog"/);
  assert.doesNotMatch(pdf, /dateLine\(null\)/); // the phiếu prints the session's date, not the download day
  assert.match(pdf, /ngayPhien\(verdict, id\)/);
});

// ---------------------------------------------------------------- vòng 3: phiếu không xoá hành động chính, luôn có rủi ro không đảo ngược
const BY_KEY_PL = {
  vanhanh: { key: "vanhanh", name: "Giám đốc Vận hành dịch vụ", short: "Vận hành" },
  fdi: { key: "fdi", name: "Luật sư Đầu tư FDI", short: "LS FDI" },
  tuphap: { key: "tuphap", name: "Chuyên viên Tư pháp – Hành chính", short: "Tư pháp" },
  tuanthu: { key: "tuanthu", name: "Thanh tra – Tuân thủ", short: "Tuân thủ" },
  laodong: { key: "laodong", name: "Chuyên gia Lao động nước ngoài", short: "Lao động" },
  thue: { key: "thue", name: "Chuyên gia Thuế – Tài chính", short: "Thuế" },
  khachhang: { key: "khachhang", name: "Chuyên gia Khách hàng – Thị trường", short: "Khách hàng" },
  chutoapl: { key: "chutoapl", name: "Chủ toạ – Luật sư điều hành", short: "Chủ toạ" },
};
const SETUP3 = { title: "Đổi giấy phép lao động khi bổ nhiệm", seats: ["vanhanh", "fdi", "tuphap", "tuanthu", "laodong"], options: [{ id: "B", label: "Xin giấy phép mới" }] };
const V3 = {
  type: "verdict",
  verdict: {
    label: "GO WITH CONDITIONS", recommended: "B", call: "Chọn B.",
    next_steps: [
      { when: "03/11/2026", action: "Vận hành nộp hồ sơ B trong 3 ngày." },
      { when: "10/11/2026", action: "LS FDI lập văn bản hỏi Sở Nội vụ. Lao động kết luận sơ bộ về vị trí." },
      { when: "13/11/2026", action: "Nộp hồ sơ B nếu đã đủ và đã kiểm chéo. Nộp D theo mốc Sở Nội vụ xác nhận." },
      { when: "20/11/2026", action: "Tư pháp và Tuân thủ đối chiếu bản dịch. Chủ toạ ký duyệt danh mục cho ghế Vận hành." },
      { when: "Ngày có giấy phép", action: "Lập danh mục giấy tờ, ghi tên người phụ trách và người kiểm chéo. Chủ toạ họp lại vòng 3." },
    ],
    conditions: [
      "Không giao chức vụ trước ngày có giấy phép đúng vị trí.",
      "Nếu làm việc ngoài phạm vi giấy phép, người lao động có thể bị trục xuất và cấm nhập cảnh.",
      "GIẢ ĐỊNH: Sở Nội vụ nhận hồ sơ trong ngày; nộp hồ sơ ngay khi có giấy tờ từ Nhật.",
      "Chưa có số: thời gian hợp pháp hoá giấy tờ từ Nhật.",
    ],
    kill_criteria: "Trường hợp 1: hồ sơ B bị trả. Khi đó lùi ngày bổ nhiệm và nộp D ngay. Trường hợp 2: không có giấy phép trước 09/01/2027. Khi đó dừng bổ nhiệm, chỉ giữ D, và Vận hành gửi văn bản báo khách.",
    can_cu: [
      { noi_dung: "Hợp đồng lao động không được dài hơn thời hạn giấy phép.", van_ban: "Bộ luật Lao động 45/2019/QH14, khoản 2 Điều 151", nhan: "QUY ĐỊNH" },
      { noi_dung: "Thời hạn giải quyết 10 ngày làm việc.", van_ban: "Nghị định 219/2025/NĐ-CP", nhan: "CẦN KIỂM TRA" },
    ],
  },
};
const TEN3 = tenCacGhe(SETUP3, BY_KEY_PL);

test("phiếu vòng 3: câu có hành động chính không bao giờ bị xoá, tên ghế thành Văn phòng", () => {
  const p = noiDungPhieuKhach({ setup: SETUP3, verdict: V3, tenGhe: TEN3 });
  const viec = p.buoc.map((b) => b.viec);
  assert.equal(viec[0], "Văn phòng nộp hồ sơ B trong 3 ngày.");
  assert.equal(viec[1], "Văn phòng lập văn bản hỏi Sở Nội vụ. Văn phòng kết luận sơ bộ về vị trí.");
  assert.equal(viec[2], "Nộp hồ sơ B nếu đã đủ. Nộp D theo mốc Sở Nội vụ xác nhận."); // "Nộp hồ sơ B" is never lost
  assert.match(viec[3], /^Văn phòng đối chiếu bản dịch\. Văn phòng ký duyệt danh mục cho văn phòng\.$/);
  assert.equal(viec[4], "Lập danh mục giấy tờ, ghi tên người phụ trách."); // the council's own meeting goes, the action stays
  const all = JSON.stringify(p);
  assert.doesNotMatch(all, /Vận hành|LS FDI|Tuân thủ|Tư pháp và|Chủ to[ạa]|kiểm chéo|\bghế\b|GIẢ ĐỊNH|Chưa có số/);
  assert.match(all, /Bộ luật Lao động 45\/2019\/QH14/); // a seat's short name inside a law's name stays
  // an assumption that holds a main action keeps its content without the label
  assert.ok(p.dieuKien.some((x) => /^Sở Nội vụ nhận hồ sơ trong ngày; nộp hồ sơ ngay/.test(x)), p.dieuKien.join(" | "));
  assert.ok(p.canKiemTra.includes("Cần bổ sung: thời gian hợp pháp hoá giấy tờ từ Nhật."));
  // every stop case whole, the action of each one kept
  assert.ok(p.ruiRo.includes("Điểm dừng: Trường hợp 2: không có giấy phép trước 09/01/2027. Khi đó dừng bổ nhiệm, chỉ giữ D, và văn phòng gửi văn bản báo khách."), p.ruiRo.join(" | "));
  assert.ok(p.ruiRo.some((r) => /^Điểm dừng: Trường hợp 1: .*nộp D ngay\.$/.test(r)));
  // căn cứ pháp lý chính: only what is verified, with the document number
  assert.deepEqual(p.canCu, ["Hợp đồng lao động không được dài hơn thời hạn giấy phép (Bộ luật Lao động 45/2019/QH14, khoản 2 Điều 151)."]);
});

test("phiếu vòng 3: tên ghế thường gặp không bị thay khi là chữ thường của câu", () => {
  const v = { verdict: { next_steps: [
    { when: "Hôm nay", action: "Khách hàng ký hợp đồng dịch vụ. Thuế nộp thừa được hoàn theo Luật Quản lý thuế." },
    { when: "Mai", action: "Gửi Cục Thuế tờ khai; người lao động nộp bản sao Bộ luật Lao động cho Sở Tư pháp." },
    { when: "28/10/2026", action: "Ghế Vận hành lấy từ hãng bay, bằng văn bản: phí đổi vé và hạn chót đổi vé." },
  ] } };
  const p = noiDungPhieuKhach({ setup: SETUP3, verdict: v, tenGhe: TEN3 });
  assert.equal(p.buoc[0].viec, "Khách hàng ký hợp đồng dịch vụ. Thuế nộp thừa được hoàn theo Luật Quản lý thuế.");
  assert.equal(p.buoc[1].viec, "Gửi Cục Thuế tờ khai; người lao động nộp bản sao Bộ luật Lao động cho Sở Tư pháp.");
  assert.equal(p.buoc[2].viec, "Văn phòng lấy từ hãng bay, bằng văn bản: phí đổi vé và hạn chót đổi vé."); // not dropped for "Ghế"
});

test("phiếu vòng 3: rủi ro trục xuất trong điều kiện luôn lên mục Rủi ro, đứng đầu", () => {
  const p = noiDungPhieuKhach({ setup: SETUP3, verdict: V3, tenGhe: TEN3 });
  assert.ok(p.ruiRo.length >= 1);
  assert.equal(p.ruiRo[0], "Nếu làm việc ngoài phạm vi giấy phép, người lao động có thể bị trục xuất và cấm nhập cảnh.");
  assert.ok(!p.dieuKien.some((x) => /trục xuất/.test(x)), "the risk is not also a condition");
});

test("phiếu vòng 3: rủi ro không đảo ngược lấy từ why / can_cu khi điều kiện không nói; trường của server được ưu tiên", () => {
  const base = { label: "GO WITH CONDITIONS", recommended: "B", call: "Chọn B.", conditions: ["Nộp hồ sơ trước 13/11/2026."], kill_criteria: "Dừng nếu hồ sơ bị trả." };
  const tuWhy = noiDungPhieuKhach({ setup: SETUP3, tenGhe: TEN3, verdict: { verdict: { ...base, why: [
    { seat: "Lao động", point: "Gia hạn không đổi vị trí ghi trên giấy." },
    { seat: "Tuân thủ", point: "Rủi ro không đảo ngược được, nêu trước: làm Giám đốc khi giấy phép còn ghi vị trí chuyên gia là làm việc ngoài phạm vi. Người lao động có thể bị phạt và bị trục xuất." },
  ] } } });
  assert.equal(tuWhy.ruiRo[0], "Làm Giám đốc khi giấy phép còn ghi vị trí chuyên gia là làm việc ngoài phạm vi. Người lao động có thể bị phạt và bị trục xuất.");
  const tuCanCu = noiDungPhieuKhach({ setup: SETUP3, tenGhe: TEN3, verdict: { verdict: { ...base, can_cu: [
    { noi_dung: "Người nước ngoài làm việc sai mục đích có thể bị buộc xuất cảnh hoặc trục xuất.", van_ban: "Nghị định 283/2026/NĐ-CP", nhan: "CẦN KIỂM TRA" },
  ] } } });
  assert.match(tuCanCu.ruiRo[0], /trục xuất/);
  const tuServer = noiDungPhieuKhach({ setup: SETUP3, tenGhe: TEN3, verdict: { verdict: { ...base, rui_ro_khong_dao_nguoc: ["Ở quá hạn có thể bị buộc xuất cảnh và chưa cho nhập cảnh lại."], why: [{ seat: "Tuân thủ", point: "Có thể bị trục xuất." }] } } });
  assert.deepEqual(tuServer.ruiRo.filter((r) => !r.startsWith("Điểm dừng")), ["Ở quá hạn có thể bị buộc xuất cảnh và chưa cho nhập cảnh lại."]);
  assert.ok(tuServer.ruiRo.some((r) => r === "Điểm dừng: Dừng nếu hồ sơ bị trả."));
});

test("PDF kết luận vòng 3: đủ mục và không cắt bước; bảng thành viên đo chiều cao dòng", () => {
  const pdf = doc("pdf.js");
  for (const m of ["Làm ngay", "Đường chính", "Căn cứ pháp lý chính", "Điều kiện", "Việc làm tiếp theo", "Dự báo", "Cần xác nhận", "Kiểm điều luật"]) assert.match(pdf, new RegExp(`"${m}|\`${m}|${m}:`), m);
  assert.doesNotMatch(pdf, /next_steps \|\| \[\]\)\.slice\(0, 3\)/);
  assert.doesNotMatch(pdf, /v\.why\.slice\(0, 3\)/);
  assert.match(pdf, /const rowH = Math\.max\(ten\.length/);
});
