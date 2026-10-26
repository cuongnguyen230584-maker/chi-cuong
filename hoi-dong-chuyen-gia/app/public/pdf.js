// The Hội đồng chuyên gia verdict as a branded A4 PDF, built in the browser with a vendored jsPDF,
// so the room still needs nothing installed. White page, Montserrat, dark blue type, sky blue as the
// accent only. Also the one-page "Phiếu khách" (client sheet) and a few text helpers the page shares.

const C = {
  ink: [7, 18, 28], soft: [55, 68, 82], mute: [112, 124, 138], rule: [226, 231, 237],
  tint: [243, 246, 249], track: [228, 233, 239], accent: [55, 189, 248], white: [255, 255, 255],
};
const LABEL = { go: [63, 207, 142], amber: [255, 144, 37], red: [255, 90, 79] };
const labelColor = (l) => (/DON'T/.test(l) ? LABEL.red : /RESHAPE|WAIT/.test(l) ? LABEL.amber : LABEL.go);
// Chủ toạ trả nhãn tiếng Anh; báo cáo in bản tiếng Việt.
const VERDICT_VI = { "GO": "LÀM", "GO WITH CONDITIONS": "LÀM CÓ ĐIỀU KIỆN", "RESHAPE": "ĐIỀU CHỈNH", "WAIT": "CHỜ", "DON'T DO IT": "KHÔNG LÀM" };
const VOTE_VI = { endorse: "Đồng ý", amend: "Sửa đổi", dissent: "Phản đối", chua_ro: "Chưa rõ" };
const DONG_Y_VI = { "đồng ý": "Đồng ý", "đồng ý có điều kiện": "Đồng ý có điều kiện", "không đồng ý": "Không đồng ý" };
// Chỉ dùng khi phiên không mang lời miễn trừ của gói (phiên rất cũ). Lời đúng là verdict.disclaimer hoặc tuyen_bo của gói.
export const TUYEN_BO_CHUNG = "Các thành viên hội đồng là mô phỏng, không phải người thật. Nội dung là phân tích tham khảo, không phải lời khuyên tài chính, pháp lý hay y khoa, và không thay thế ý kiến của chuyên gia có thẩm quyền.";

// ---------------------------------------------------------------- helpers shared with app.js
/** Điểm kiểu Việt: 6.5 → "6,5". Chuỗi giữ nguyên, trừ dấu chấm thập phân giữa hai chữ số. */
export const soVi = (n) => (n === null || n === undefined || n === "" ? "-" : String(n).replace(/(\d)\.(\d)/g, "$1,$2"));

/** Bỏ mã nguồn nội bộ S0xx (của não từng ghế, người ngoài không tra được) khỏi chữ gửi khách. */
export function boMaNguon(t) {
  return String(t ?? "")
    .replace(/\s*\(\s*(?:nguồn\s*)?S\d{2,3}(?:\s*[,;]\s*S\d{2,3})*\s*\)/gi, "")
    .replace(/\s*[,;]\s*(?:nguồn\s*)?S\d{2,3}\b/g, "")
    .replace(/\b(?:nguồn\s*)?S\d{2,3}\s*[,;]\s*/g, "")
    .replace(/\s*\b(?:nguồn\s*)?S\d{2,3}\b/g, "")
    .replace(/\(\s*\)/g, "")
    .replace(/\s+([,.;:)])/g, "$1")
    .replace(/\(\s+/g, "(")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

/** Bỏ báo nhầm của máy dò số: số nằm trong số hiệu văn bản (283/2026/NĐ-CP), "Điều 21", "khoản 4", "34 tỉnh". */
export function soChuaNguonThat(list) {
  return (list || []).filter((x) => {
    const so = String(x?.so ?? "").trim(), doan = String(x?.doan ?? "");
    if (!/^\d+$/.test(so) || !doan) return true;
    const re = (p) => new RegExp(p.replace("#", so), "i").test(doan);
    return !(re("(?:^|[^\\d/])#/\\d{4}") || re("\\d/#(?:/|\\b)") || re("(?:Điều|khoản|điểm|Chương|Mục)\\s+#\\b") || re("\\b#\\s+tỉnh"));
  });
}

const clean = (t) => String(t ?? "").replace(/\s*\((?:S\d+|source[^)]*)[^)]*\)/gi, "").replace(/\*\*/g, "").replace(/[—–]/g, ", ").replace(/\s+/g, " ").trim();
const dateLine = (id) => {
  const m = String(id || "").match(/^(\d{4})-(\d{2})-(\d{2})/);
  const d = m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : new Date();
  return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
};
const firstSentences = (t, max) => {
  const parts = String(t || "").match(/[^.!?]+[.!?]+["”)]?\s*|[^.!?]+$/g) || [String(t || "")];
  let out = "";
  for (const p of parts) { if (out && (out + p).length > max) break; out += p; }
  out = out.trim();
  return out.length > max + 40 ? out.slice(0, max + 39).replace(/\s+\S*$/, "") + "…" : out;
};

let libReady = null;
function loadLib() {
  if (window.jspdf) return Promise.resolve();
  libReady ??= new Promise((res, rej) => {
    const s = document.createElement("script");
    s.src = "/vendor/jspdf.umd.min.js";
    s.onload = res;
    s.onerror = () => rej(new Error("Không tải được thư viện tạo PDF"));
    document.head.appendChild(s);
  });
  return libReady;
}

const fileCache = {};
async function fetchBase64(url) {
  if (fileCache[url]) return fileCache[url];
  const buf = new Uint8Array(await (await fetch(url)).arrayBuffer());
  let bin = "";
  for (let i = 0; i < buf.length; i += 0x8000) bin += String.fromCharCode(...buf.subarray(i, i + 0x8000));
  return (fileCache[url] = btoa(bin));
}

async function addFonts(doc) {
  for (const [file, style] of [["Montserrat-Regular.ttf", "normal"], ["Montserrat-SemiBold.ttf", "semibold"], ["Montserrat-Bold.ttf", "bold"]]) {
    doc.addFileToVFS(file, await fetchBase64(`/brand/fonts/${file}`));
    doc.addFont(file, "Montserrat", style);
  }
}

/** `tuyenBo`: lời miễn trừ của gói (verdict.disclaimer ưu tiên). `vaiTro`: gói chuyên gia theo vai nghề, nên mã S0xx trần bị bỏ. */
export async function downloadVerdictPdf({ setup, verdict: ev, chairView, byKey, id, tuyenBo = "", vaiTro = false }) {
  await loadLib();
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "pt", format: "a4", compress: true });
  await addFonts(doc);
  const logo = "data:image/png;base64," + (await fetchBase64("/brand/logo.png")); // replace app/public/brand/logo.png to rebrand

  const v = ev.verdict;
  const disclaimer = v.disclaimer || tuyenBo || TUYEN_BO_CHUNG;
  const ai = vaiTro ? "thành viên" : "cố vấn";
  const seats = ev.seats || [];
  const options = setup.options || [];
  const seatKey = (x) => {
    const t = String(x || "").toLowerCase().trim();
    return Object.values(byKey).find((s) => s.key === t.replace(/\s+/g, "") || s.short.toLowerCase() === t || s.name.toLowerCase() === t || t.includes(s.name.split(" ").pop().toLowerCase()))?.key;
  };
  const who = (x) => byKey[seatKey(x)]?.name || x || "";

  const W = 595.28, H = 841.89, M = 54, CW = W - M * 2;
  let y = M;
  // the footer carries the pack's full disclaimer, so its height follows the text
  doc.setFont("Montserrat", "normal"); doc.setFontSize(7.5);
  const footLines = doc.splitTextToSize(disclaimer, CW - 120);
  const FOOT = 26 + footLines.length * 10; // from the page bottom up to the footer rule
  const BOTTOM = H - FOOT - 14; // content stops here

  const font = (size, style = "normal", color = C.ink) => { doc.setFont("Montserrat", style); doc.setFontSize(size); doc.setTextColor(...color); };
  const lines = (text, width, size, style = "normal") => { font(size, style); return doc.splitTextToSize(vaiTro ? boMaNguon(clean(text)) : clean(text), width); };
  const lh = (size) => size * 1.42;
  const ensure = (h) => { if (y + h > BOTTOM) { doc.addPage(); y = M; } };
  const para = (text, { size = 10.5, style = "normal", color = C.soft, x = M, width = CW, gap = 6 } = {}) => {
    const ls = lines(text, width, size, style);
    ensure(ls.length * lh(size));
    font(size, style, color);
    doc.text(ls, x, y + size, { lineHeightFactor: 1.42 });
    y += ls.length * lh(size) + gap;
  };
  const kicker = (text) => { font(8, "semibold", C.mute); doc.setCharSpace(1.2); doc.text(text.toUpperCase(), M, y + 8); doc.setCharSpace(0); y += 16; };
  // `keep` is how much of what follows must sit on the same page as the heading
  const section = (title, keep = 70) => {
    ensure(48 + keep);
    y += 10;
    doc.setDrawColor(...C.rule); doc.setLineWidth(0.75); doc.line(M, y, W - M, y);
    y += 16;
    font(12.5, "bold", C.ink); doc.text(title, M, y + 10);
    y += 22;
  };
  const bullet = (label, text) => {
    const pre = label ? (/[?!.:]$/.test(label.trim()) ? `${label.trim()} ` : `${label}: `) : "";
    font(10.5, "semibold");
    // a long label (a whole question) gets its own bold line instead of squeezing the text
    if (pre && doc.getTextWidth(pre) > CW * 0.4) {
      const head = lines(label, CW - 14, 10.5, "semibold");
      const body = lines(text, CW - 14, 10.5);
      ensure((head.length + body.length) * lh(10.5) + 4);
      doc.setFillColor(...C.accent); doc.circle(M + 3, y + 6.6, 2.2, "F");
      font(10.5, "semibold", C.ink); doc.text(head, M + 14, y + 10.5, { lineHeightFactor: 1.42 });
      y += head.length * lh(10.5);
      font(10.5, "normal", C.soft); doc.text(body, M + 14, y + 10.5, { lineHeightFactor: 1.42 });
      y += body.length * lh(10.5) + 5;
      return;
    }
    const preW = pre ? doc.getTextWidth(pre) : 0;
    const body = lines(text, CW - 14 - preW, 10.5);
    // first line sits after the bold label; the rest wraps under the full width
    const rest = body.length > 1 ? lines(body.slice(1).join(" "), CW - 14, 10.5) : [];
    ensure((1 + rest.length) * lh(10.5) + 4);
    doc.setFillColor(...C.accent); doc.circle(M + 3, y + 6.6, 2.2, "F");
    if (pre) { font(10.5, "semibold", C.ink); doc.text(pre, M + 14, y + 10.5); }
    font(10.5, "normal", C.soft);
    doc.text(body[0] || "", M + 14 + preW, y + 10.5);
    if (rest.length) doc.text(rest, M + 14, y + 10.5 + lh(10.5), { lineHeightFactor: 1.42 });
    y += (1 + rest.length) * lh(10.5) + 5;
  };

  // ---------------------------------------------------------------- header
  doc.addImage(logo, "PNG", M, y - 4, 34, 34, "logo", "SLOW");
  font(15, "bold", C.ink); doc.text("Hội đồng chuyên gia", W - M, y + 12, { align: "right" });
  font(8.5, "normal", C.mute); doc.text(`Báo cáo kết luận · ${dateLine(id)}`, W - M, y + 25, { align: "right" });
  y += 40;
  doc.setDrawColor(...C.ink); doc.setLineWidth(1.2); doc.line(M, y, W - M, y);
  y += 26;

  // ---------------------------------------------------------------- the decision
  kicker("Quyết định");
  const title = lines(setup.title || "Quyết định chưa đặt tên", CW, 22, "bold");
  font(22, "bold", C.ink); doc.text(title, M, y + 20, { lineHeightFactor: 1.18 });
  y += title.length * 22 * 1.18 + 8;
  const n = seats.length || (setup.seats || []).length;
  const rounds = v.votes ? 3 : 2;
  para(`${setup.mode === "quick" ? "Hội đồng nhanh" : "Hội đồng đầy đủ"} · ${n} ${ai} · ${rounds} vòng`, { size: 9.5, color: C.mute, gap: 4 });
  if (setup.decision) para(setup.decision, { size: 10.5, color: C.soft, gap: 8 });

  // ---------------------------------------------------------------- the verdict box
  const label = String(v.label || "").toUpperCase();
  const shown = VERDICT_VI[label] || label;
  font(13, "bold");
  const badgeW = doc.getTextWidth(shown) + 24;
  const callLines = lines(v.call, CW - 32, 12.5, "semibold");
  const meta = [`Độ tin cậy ${soVi(v.confidence)}/10`, v.votes ? `${v.votes.endorse || 0} đồng ý, ${v.votes.amend || 0} sửa đổi, ${v.votes.dissent || 0} phản đối` : ""].filter(Boolean).join(" · ");
  const boxH = 16 + 28 + 12 + callLines.length * lh(12.5) + 8 + 14 + 14;
  ensure(boxH + 10);
  y += 6;
  doc.setFillColor(...C.tint); doc.roundedRect(M, y, CW, boxH, 10, 10, "F");
  doc.setFillColor(...labelColor(label)); doc.roundedRect(M + 16, y + 16, badgeW, 28, 7, 7, "F");
  font(13, "bold", C.ink); doc.text(shown, M + 16 + 12, y + 16 + 19);
  font(8, "semibold", C.mute); doc.setCharSpace(1.2); doc.text("KẾT LUẬN CỦA HỘI ĐỒNG", M + 16 + badgeW + 12, y + 16 + 17.5); doc.setCharSpace(0);
  let by = y + 16 + 28 + 12;
  font(12.5, "semibold", C.ink); doc.text(callLines, M + 16, by + 12.5, { lineHeightFactor: 1.42 });
  by += callLines.length * lh(12.5) + 8;
  font(9.5, "normal", C.mute); doc.text(meta, M + 16, by + 9.5);
  y += boxH + 8;

  // ---------------------------------------------------------------- numbers and their sources
  const ks = v.kiem_so;
  const ksChuToa = chairView?.kiem_so;
  if (ks?.so_lieu?.length || soChuaNguonThat(ks?.chua_nguon).length || soChuaNguonThat(ksChuToa?.chua_nguon).length) {
    section("Số dùng trong kết luận");
    const chua = [...soChuaNguonThat(ks?.chua_nguon).map((x) => x.so), ...soChuaNguonThat(ksChuToa?.chua_nguon).map((x) => `${x.so} (Góc nhìn Chủ toạ)`)];
    if (chua.length) para(`Chưa có nguồn: ${chua.join(", ")}`, { size: 10.5, style: "semibold", color: [180, 83, 9], gap: 6 });
    for (const e of (ks?.so_lieu || []).slice(0, 14)) bullet(e.so, `${e.y} (${e.loai}${e.nguon ? `: nguồn ${e.nguon}` : ""})${e.trang_thai === "khong_thay" ? " — không thấy trong số liệu" : ""}`);
  }

  // ---------------------------------------------------------------- văn bản pháp luật được viện dẫn
  const kl = v.kiem_luat;
  if (kl && (kl.het?.length || kl.ngoai?.length)) {
    section("Kiểm điều luật");
    if (kl.het?.length) para(`Hết hiệu lực hoặc đã bị thay thế, không dùng làm căn cứ: ${kl.het.map((x) => x.so).join(", ")}`, { size: 10.5, style: "semibold", color: [180, 83, 9], gap: 6 });
    if (kl.ngoai?.length) para(`Chưa có trong nguồn đã xác minh, CẦN KIỂM TRA: ${kl.ngoai.map((x) => x.so).join(", ")}`, { size: 10.5, style: "semibold", color: [180, 83, 9], gap: 6 });
  }

  // ---------------------------------------------------------------- scores
  section("Điểm");
  const best = v.recommended;
  for (const o of options) {
    const sc = v.scores?.[o.id]?.score;
    const isBest = o.id === best;
    const lab = lines(o.label, CW - 200, 10.5, isBest ? "semibold" : "normal");
    const rowH = Math.max(24, lab.length * lh(10.5) + 6);
    ensure(rowH + 6);
    doc.setFillColor(...(isBest ? C.ink : C.track)); doc.roundedRect(M, y, 20, 20, 5, 5, "F");
    font(10, "bold", isBest ? C.white : C.soft); doc.text(o.id, M + 10, y + 13.8, { align: "center" });
    font(10.5, isBest ? "semibold" : "normal", C.ink); doc.text(lab, M + 30, y + 13.5, { lineHeightFactor: 1.42 });
    const bx = W - M - 170, bw = 120;
    doc.setFillColor(...C.track); doc.roundedRect(bx, y + 8, bw, 5, 2.5, 2.5, "F");
    if (typeof sc === "number") { doc.setFillColor(...(isBest ? C.accent : [150, 205, 235])); doc.roundedRect(bx, y + 8, Math.max(5, bw * sc / 10), 5, 2.5, 2.5, "F"); }
    font(14, "bold", C.ink); doc.text(typeof sc === "number" ? soVi(sc) : "-", W - M, y + 15, { align: "right" });
    if (isBest) { font(7.5, "semibold", C.accent); doc.text("ĐỀ XUẤT", bx, y + 24); }
    y += rowH + 6;
  }
  para(`Mỗi ${ai} chấm từng phương án từ 1 đến 10, có trọng số theo mức quan trọng của mảng họ phụ trách trong quyết định này.`, { size: 8.5, color: C.mute, gap: 0 });

  // Kept short on purpose: the call, the scores, the reasons, the strongest objection, and
  // the plan. The full report (conditions, amendments, every card) stays in verdict.md.
  if (v.why?.length) { section("Vì sao hội đồng đi đến kết luận này"); for (const w of v.why.slice(0, 3)) bullet(who(w.seat), w.point); }

  // ---------------------------------------------------------------- the Chair's own view
  // His comment on the verdict, from his own brain, after the council's reasons (the verdict stays the council's).
  const cv = chairView?.view;
  if (cv) {
    section("Góc nhìn Chủ toạ");
    const say = `${DONG_Y_VI[cv.dong_y] || cv.dong_y}. ${cv.nhan_dinh}`;
    para((chairView.quotes || []).some((q) => !q.verified && say.includes(q.quote)) ? `${say} (câu trích chưa khớp nguyên văn)` : say, { size: 10.5, style: "semibold", color: C.ink, gap: 6 });
    // a quote the brain check could not find is marked here too; the source id stays readable as "nguồn S0xx"
    const sai = (chairView.quotes || []).filter((q) => !q.verified).map((q) => q.quote);
    const ghi = (t) => (sai.some((q) => String(t || "").includes(q)) ? `${t} (câu trích chưa khớp nguyên văn)` : t);
    for (const l of (cv.ly_do || []).slice(0, 4)) bullet(l.khung, ghi(`${l.y}${l.nguon && !(vaiTro && /^S\d+$/i.test(String(l.nguon).trim())) ? ` (nguồn ${l.nguon})` : ""}`));
    if (cv.bo_buoc) bullet("Nên xoá", ghi(cv.bo_buoc));
    if (cv.thu_nhanh) bullet("Thử nhanh", ghi(cv.thu_nhanh));
  }


  // ---------------------------------------------------------------- how each advisor scored it
  if (seats.length) {
    section(`Từng ${ai} chấm điểm thế nào`, 18 + seats.length * 22); // the table stays on one page
    const showVote = Boolean(v.votes);
    const cols = [{ t: vaiTro ? "Thành viên" : "Cố vấn", w: 150 }, { t: "Trọng số", w: 52, c: true }, ...options.map((o) => ({ t: o.id, w: 40, c: true })), ...(showVote ? [{ t: "Phiếu", w: 70 }] : [])];
    const head = () => {
      let x = M; font(8, "semibold", C.mute);
      for (const c of cols) { doc.text(c.t.toUpperCase(), c.c ? x + c.w / 2 : x, y + 8, c.c ? { align: "center" } : undefined); x += c.w; }
      y += 14; doc.setDrawColor(...C.rule); doc.setLineWidth(0.75); doc.line(M, y, W - M, y); y += 4;
    };
    ensure(40); head();
    for (const s of seats) {
      if (y + 22 > BOTTOM) { doc.addPage(); y = M; head(); }
      const info = byKey[s.key] || {};
      let x = M;
      font(10, "semibold", C.ink); doc.text(info.name || s.key, x, y + 13); x += cols[0].w;
      font(10, "normal", C.soft); doc.text(soVi(s.weight), x + cols[1].w / 2, y + 13, { align: "center" }); x += cols[1].w;
      for (const o of options) { font(10, "semibold", C.ink); doc.text(soVi(s.optionScores?.[o.id]), x + 20, y + 13, { align: "center" }); x += 40; }
      if (showVote) { font(9.5, "normal", C.soft); doc.text(VOTE_VI[s.stance] || (s.stance ? String(s.stance) : "Chưa rõ"), x, y + 13); }
      y += 20; doc.setDrawColor(...C.rule); doc.line(M, y, W - M, y); y += 2;
    }
  }

  // ---------------------------------------------------------------- watch out, what to do
  if (v.minority?.quote) {
    section("Cần lưu ý");
    para(`${who(v.minority.seat)}: "${clean(v.minority.quote)}"`, { size: 10.5, style: "semibold", color: C.ink, gap: 4 });
    if (v.minority.would_have_to_be_true) para(`Để ý kiến này đúng thì: ${v.minority.would_have_to_be_true}`, { size: 9.5, color: C.mute });
  }
  if (v.next_steps?.length || v.cheapest_test || v.kill_criteria) {
    section("Việc làm tiếp theo");
    for (const s of (v.next_steps || []).slice(0, 3)) bullet(s.when, s.action);
    if (v.cheapest_test) bullet("Cách thử rẻ nhất", v.cheapest_test);
    if (v.kill_criteria) bullet("Dừng nếu", v.kill_criteria);
  }
  if (v.fights?.length) { section("Chỗ họ tranh cãi"); for (const f of v.fights.slice(0, 3)) bullet(f.crux, f.story); }

  // ---------------------------------------------------------------- footer on every page
  const pages = doc.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    doc.setDrawColor(...C.rule); doc.setLineWidth(0.75); doc.line(M, H - FOOT, W - M, H - FOOT);
    font(7.5, "semibold", C.mute);
    doc.text(`Hội đồng chuyên gia · trang ${p}/${pages}`, W - M, H - FOOT + 13, { align: "right" });
    font(7.5, "normal", C.mute);
    doc.text(footLines, M, H - FOOT + 13, { lineHeightFactor: 1.33 });
  }

  const name = `Hội đồng chuyên gia - ${String(setup.title || id || "ket-luan").replace(/[\\/:*?"<>|]+/g, "").slice(0, 80)}.pdf`;
  doc.save(name);
  return name;
}

// ---------------------------------------------------------------- Phiếu khách (one A4 page for the client)
// Only what the client needs: the recommendation, what to do by when, the main conditions, the risks,
// what a lawyer must still check, and who approved it. No scores, no internal debate, no source codes.
const KHACH_THAY = [
  [/\s+(?:tại|ở|theo)\s+điều kiện(?:\s+số)?\s+\d+(?:\s+(?:và|,)\s+(?:điều kiện\s+)?\d+)*/gi, ""],
  [/người sáng lập/gi, (m) => (m[0] === "N" ? "Lãnh đạo văn phòng" : "lãnh đạo văn phòng")],
  [/\bfounder\b/gi, "lãnh đạo văn phòng"],
  [/^(?:RỦI RO KHÔNG ĐẢO NGƯỢC[^:.]*[:.]|Rủi ro không đảo ngược(?: được)? nêu trước\.)\s*/i, ""],
];
const choKhach = (t) => {
  let x = boMaNguon(clean(t));
  for (const [re, to] of KHACH_THAY) x = x.replace(re, to);
  return x.replace(/^\p{Ll}/u, (c) => c.toUpperCase());
};
const cauDauTien = (t) => (String(t || "").match(/[^.!?]+[.!?]*/) || [""])[0];
const LA_RUI_RO = /rủi ro không đảo ngược|trục xuất|cấm nhập cảnh|hình sự/i;
const LA_KIEM_TRA = /^Đây là phân tích tham khảo\.?\s*/i;
const LA_LUAT_SU = /(?:ý kiến|xác nhận)[^.]{0,40}luật sư|luật sư[^.]{0,40}(?:xác nhận|ý kiến)/i;
const LA_NOI_BO = /^(?:Chưa có số|GIẢ ĐỊNH)\b/i;
// "Cổng ngành: Trong 14 ngày…" → "Trong 14 ngày…": nhãn nội bộ ngắn đầu câu không giúp gì cho khách
const boNhanDau = (t) => String(t || "").replace(/^(?:[\p{Lu}][\p{Ll}]*)(?:\s[\p{L}]+){0,3}:\s+(?=\p{Lu})/u, "");
const tuCua = (t) => new Set(String(t || "").toLowerCase().split(/[^\p{L}\p{N}]+/u).filter((w) => w.length > 2));
/** A condition that mostly repeats a next step adds nothing on a one-page sheet. */
const lapVoi = (c, buoc) => { const w = tuCua(c); if (!w.size) return false; const b = tuCua(buoc.join(" ")); return [...w].filter((x) => b.has(x)).length / w.size > 0.6; };

/** The phiếu's content, as plain data (no jsPDF), so it can be tested and shown. */
export function noiDungPhieuKhach({ setup = {}, verdict: ev = {}, tuyenBo = "" } = {}) {
  const v = ev.verdict || {};
  const buoc = (v.next_steps || []).slice(0, 5).map((s) => ({ han: choKhach(s.when), viec: firstSentences(choKhach(s.action), 230) }));
  const conds = (v.conditions || []).map((c) => boNhanDau(String(c || "")));
  const kiemTraGoc = conds.filter((c) => !LA_NOI_BO.test(c) && (LA_KIEM_TRA.test(c) || LA_LUAT_SU.test(cauDauTien(c)) || /CẦN KIỂM TRA/.test(cauDauTien(c))));
  const ruiRoGoc = conds.filter((c) => LA_RUI_RO.test(c) && !kiemTraGoc.includes(c) && !LA_NOI_BO.test(c));
  const ruiRo = ruiRoGoc.slice(0, 2).map((c) => firstSentences(choKhach(c), 380));
  if (v.kill_criteria) ruiRo.push(`Điểm dừng: ${firstSentences(choKhach(v.kill_criteria), 360)}`);
  const dieuKien = conds.filter((c) => !ruiRoGoc.includes(c) && !kiemTraGoc.includes(c) && !LA_NOI_BO.test(c) && !lapVoi(c, buoc.map((b) => b.viec)))
    .slice(0, 3).map((c) => firstSentences(choKhach(c), 240));
  const kl = v.kiem_luat || {};
  const canKiemTra = [
    ...(kl.het || []).map((x) => `${x.so}: đã hết hiệu lực hoặc bị thay thế, không dùng làm căn cứ.`),
    ...(kl.ngoai || []).map((x) => `${x.so}: chưa có trong nguồn đã xác minh, CẦN KIỂM TRA.`),
    ...((kl.con || []).length ? [`Văn bản được viện dẫn, cần kiểm lại điều, khoản và hiệu lực trước khi nộp hồ sơ: ${kl.con.map((x) => x.so).join("; ")}.`] : []),
    ...kiemTraGoc.map((c) => firstSentences(choKhach(String(c).replace(LA_KIEM_TRA, "")), 300)),
  ].filter(Boolean);
  const duBao = [].concat(v.du_bao || []).filter((d) => d && d.ket_qua)
    .map((d) => `${choKhach(d.ket_qua)}: khả năng ${soVi(d.xac_suat)}%${d.han ? ` (xem lại ${choKhach(d.han)})` : ""}.`);
  const o = (setup.options || []).find((x) => x.id === v.recommended);
  const label = String(v.label || "").toUpperCase();
  return {
    tieuDe: choKhach(setup.title || "Phiếu tư vấn"),
    nhan: VERDICT_VI[label] || label,
    nhanGoc: label,
    phuongAn: o ? `Phương án ${o.id}: ${choKhach(o.label)}` : "",
    // "Chọn phương án A: <the option's label>. …" repeats the line above it: start at what follows
    khuyenNghi: (() => {
      const call = choKhach(v.call), dau = cauDauTien(call);
      const chu = (t) => String(t || "").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
      const nhac = o && chu(dau).includes(chu(o.label).slice(0, 30));
      return nhac && call.length > dau.length + 20 ? call.slice(dau.length).trim() : call;
    })(),
    buoc,
    dieuKien,
    ruiRo,
    canKiemTra,
    duBao,
    tuyenBo: v.disclaimer || tuyenBo || TUYEN_BO_CHUNG,
  };
}

export async function downloadPhieuKhach({ setup, verdict, id, tuyenBo = "" }) {
  await loadLib();
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "pt", format: "a4", compress: true });
  await addFonts(doc);
  const logo = "data:image/png;base64," + (await fetchBase64("/brand/logo.png"));
  const d = noiDungPhieuKhach({ setup, verdict, tuyenBo });
  const W = 595.28, H = 841.89, M = 46, CW = W - M * 2;

  // Lay the page out at scale `s` and trim level `lv`; with draw=false it only measures. Returns the bottom y.
  const ve = (s, lv, draw) => {
    let y = M;
    const font = (size, style = "normal", color = C.ink) => { doc.setFont("Montserrat", style); doc.setFontSize(size); doc.setTextColor(...color); };
    const split = (t, w, size, style = "normal") => { font(size, style); return doc.splitTextToSize(String(t || ""), w); };
    const lh = (size) => size * 1.36;
    const text = (ls, x, yy, size, style, color, opt = {}) => { if (draw) { font(size, style, color); doc.text(ls, x, yy, { lineHeightFactor: 1.36, ...opt }); } };
    const cut = (t, n) => (lv ? firstSentences(t, n) : t);
    const sz = (n) => n * s;

    // header
    if (draw) doc.addImage(logo, "PNG", M, y - 2, 26, 26, "logo", "SLOW");
    text("PHIẾU TƯ VẤN", W - M, y + 9, sz(12), "bold", C.ink, { align: "right" });
    text(`Tài liệu gửi khách · ${dateLine(null)}`, W - M, y + 21, 8, "normal", C.mute, { align: "right" });
    y += 32;
    if (draw) { doc.setDrawColor(...C.ink); doc.setLineWidth(1); doc.line(M, y, W - M, y); }
    y += sz(14);
    const tl = split(d.tieuDe, CW, sz(17), "bold");
    text(tl, M, y + sz(15), sz(17), "bold", C.ink);
    y += tl.length * lh(sz(17)) + sz(6);

    // the recommendation
    const call = split(cut(d.khuyenNghi, 260), CW - 28, sz(10), "normal");
    const pa = d.phuongAn ? split(d.phuongAn, CW - 28, sz(10.5), "semibold") : [];
    const boxH = sz(14) + sz(22) + sz(8) + pa.length * lh(sz(10.5)) + (pa.length ? sz(3) : 0) + call.length * lh(sz(10)) + sz(12);
    if (draw) {
      doc.setFillColor(...C.tint); doc.roundedRect(M, y, CW, boxH, 8, 8, "F");
      font(sz(11), "bold");
      const bw = doc.getTextWidth(d.nhan) + 18;
      doc.setFillColor(...labelColor(d.nhanGoc)); doc.roundedRect(M + 14, y + sz(12), bw, sz(22), 5, 5, "F");
      font(sz(11), "bold", C.ink); doc.text(d.nhan, M + 14 + 9, y + sz(12) + sz(15));
      font(7.5, "semibold", C.mute); doc.setCharSpace(1.1); doc.text("KHUYẾN NGHỊ", M + 14 + bw + 10, y + sz(12) + sz(14)); doc.setCharSpace(0);
    }
    let by = y + sz(14) + sz(22) + sz(8);
    text(pa, M + 14, by + sz(10), sz(10.5), "semibold", C.ink);
    by += pa.length * lh(sz(10.5)) + (pa.length ? sz(3) : 0);
    text(call, M + 14, by + sz(9.5), sz(10), "normal", C.soft);
    y += boxH + sz(10);

    const head = (t) => {
      y += sz(6);
      if (draw) { doc.setFillColor(...C.accent); doc.rect(M, y + 1, 3, sz(11), "F"); }
      text(t, M + 10, y + sz(10), sz(10.5), "bold", C.ink);
      y += sz(17);
    };
    const item = (lead, body, mark) => {
      const pre = lead ? `${lead}: ` : "";
      font(sz(9.5), "semibold");
      const pw = pre ? doc.getTextWidth(pre) : 0;
      const ind = 14;
      if (pw > CW * 0.35) { // a long lead gets its own line
        const a = split(pre.trim(), CW - ind, sz(9.5), "semibold"), b = split(body, CW - ind, sz(9.5));
        if (draw) mark(y);
        text(a, M + ind, y + sz(9.5), sz(9.5), "semibold", C.ink);
        y += a.length * lh(sz(9.5));
        text(b, M + ind, y + sz(9.5), sz(9.5), "normal", C.soft);
        y += b.length * lh(sz(9.5)) + sz(3.5);
        return;
      }
      const first = split(body, CW - ind - pw, sz(9.5));
      const rest = first.length > 1 ? split(first.slice(1).join(" "), CW - ind, sz(9.5)) : [];
      if (draw) mark(y);
      if (pre) text(pre, M + ind, y + sz(9.5), sz(9.5), "semibold", C.ink);
      text(first[0] || "", M + ind + pw, y + sz(9.5), sz(9.5), "normal", C.soft);
      if (rest.length) text(rest, M + ind, y + sz(9.5) + lh(sz(9.5)), sz(9.5), "normal", C.soft);
      y += (1 + rest.length) * lh(sz(9.5)) + sz(3.5);
    };
    const dot = (yy) => { doc.setFillColor(...C.accent); doc.circle(M + 4, yy + sz(6), 1.9, "F"); };
    const num = (n) => (yy) => { font(sz(9), "bold", C.accent); doc.text(`${n}.`, M + 1, yy + sz(9.5)); };

    const nBuoc = [5, 4, 3][lv], nDk = [3, 2, 2][lv], nRr = [3, 3, 2][lv], nKt = [6, 4, 3][lv];
    if (d.buoc.length) { head("Việc cần làm và hạn"); d.buoc.slice(0, Math.max(3, nBuoc)).forEach((b, i) => item(b.han, cut(b.viec, 170), num(i + 1))); }
    if (d.dieuKien.length) { head("Điều kiện chính"); d.dieuKien.slice(0, nDk).forEach((t) => item("", cut(t, 170), dot)); }
    if (d.ruiRo.length) { head("Rủi ro cần lưu ý"); d.ruiRo.slice(-nRr).forEach((t) => item("", cut(t, 190), dot)); }
    if (d.canKiemTra.length) { head("CẦN KIỂM TRA trước khi nộp hồ sơ"); d.canKiemTra.slice(0, nKt).forEach((t) => item("", cut(t, 220), dot)); }
    if (d.duBao.length) { head("Dự báo"); d.duBao.slice(0, 2).forEach((t) => item("", t, dot)); }

    // approval: a person signs off before this goes to the client
    y += sz(12);
    if (draw) { doc.setDrawColor(...C.rule); doc.setLineWidth(0.75); doc.line(M, y, W - M, y); }
    y += sz(16);
    text("Người duyệt: ______________________________", M, y, sz(10), "semibold", C.ink);
    text("Ngày: ____ / ____ / ________", W - M, y, sz(10), "semibold", C.ink, { align: "right" });
    y += sz(18);
    font(sz(9), "normal");
    const t1 = "Nội dung do AI hỗ trợ soạn,", t2 = "đã", t3 = "chưa được người có thẩm quyền duyệt.";
    let x = M;
    text(t1, x, y, sz(9), "normal", C.soft); x += doc.getTextWidth(t1) + 8;
    const box = (xx) => { if (draw) { doc.setDrawColor(...C.soft); doc.setLineWidth(0.8); doc.rect(xx, y - sz(7.5), sz(8), sz(8)); } return xx + sz(8) + 4; };
    x = box(x); text(t2, x, y, sz(9), "normal", C.soft); x += doc.getTextWidth(t2) + 4 + 6;
    text("/", x, y, sz(9), "normal", C.mute); x += doc.getTextWidth("/") + 6;
    x = box(x); text(t3, x, y, sz(9), "normal", C.soft);
    y += sz(10);
    return y;
  };

  // the footer (the pack's disclaimer) sits at the bottom; the content must end above it
  doc.setFont("Montserrat", "normal"); doc.setFontSize(7.5);
  const foot = doc.splitTextToSize(d.tuyenBo, CW);
  const footTop = H - 30 - foot.length * 10;
  let pick = null;
  for (const lv of [0, 1, 2]) {
    for (const s of [1, 0.94, 0.88, 0.82, 0.76]) if (ve(s, lv, false) <= footTop - 8) { pick = { s, lv }; break; }
    if (pick) break;
  }
  pick ||= { s: 0.72, lv: 2 };
  ve(pick.s, pick.lv, true);
  doc.setDrawColor(...C.rule); doc.setLineWidth(0.75); doc.line(M, footTop, W - M, footTop);
  doc.setFont("Montserrat", "normal"); doc.setFontSize(7.5); doc.setTextColor(...C.mute);
  doc.text(foot, M, footTop + 12, { lineHeightFactor: 1.33 });
  doc.setFont("Montserrat", "semibold");
  doc.text("Hội đồng chuyên gia · Phiếu khách", W - M, H - 18, { align: "right" });
  // never more than one page
  while (doc.getNumberOfPages() > 1) doc.deletePage(doc.getNumberOfPages());

  const name = `Phieu khach - ${String(setup.title || id || "phieu").replace(/[\\/:*?"<>|]+/g, "").slice(0, 80)}.pdf`;
  doc.save(name);
  return { name, scale: pick.s, level: pick.lv };
}
