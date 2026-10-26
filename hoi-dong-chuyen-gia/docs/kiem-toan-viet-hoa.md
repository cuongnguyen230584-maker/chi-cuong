# Kiểm toán Việt hoá: Hội đồng chuyên gia

Ngày kiểm: 26/10/2026. Chỉ đọc, không sửa file nào.

**Phạm vi:** `app/server.mjs`, `app/lib/*.mjs`, `app/public/{index.html, app.js, pdf.js, loi-vi.js}`, skill `.claude/skills/roast-room` và `.claude/skills/newroaster`, `README.md`, `CLAUDE.md`.

**Lưu ý về số dòng.** Trong lúc kiểm, một phiên khác đang sửa `council.mjs`, `seats.mjs`, `server.mjs`, `hoi-goc.mjs`, `hop-tiep.mjs` và thêm `nganh.mjs` (gói ngành). Số dòng dưới đây lấy theo bản làm việc lúc kiểm. Nếu số dòng đã lệch, tìm theo chuỗi gốc.

**Thuật ngữ thống nhất** (theo README):

| Tiếng Anh | Dùng |
|---|---|
| GO / GO WITH CONDITIONS / RESHAPE / WAIT / DON'T DO IT | LÀM / LÀM CÓ ĐIỀU KIỆN / ĐIỀU CHỈNH / CHỜ / KHÔNG LÀM |
| Chair | Chủ toạ |
| council / board | hội đồng / bàn hội đồng |
| option | phương án |
| card | phiếu (thẻ ý kiến) |
| seat | ghế (cố vấn) |
| round | vòng |
| verdict | kết luận |
| crux | điểm vênh / điểm tranh cãi |
| draft resolution | đề xuất (nghị quyết dự thảo) |
| endorse / amend / dissent | đồng ý / sửa đổi / phản đối |
| weight | trọng số |
| confidence | độ tin cậy |
| spread | độ chênh |

---

## 0. Tóm tắt

- **Giao diện web (`index.html`, `app.js`) đã Việt hoá gần hết.** Nhãn phase, nhãn kết luận và phiếu bầu đều được dịch lúc hiển thị. Phần còn tiếng Anh nằm ở những chỗ khác:
  - nội dung thô của phiếu ý kiến (STANCE, OPTION SCORES…) trong hộp "Mở thẻ";
  - một số thông báo lỗi;
  - định dạng số và ngày.
- **Phần còn tiếng Anh nhiều nhất:**
  - `verdict.md`, `brief.md`, `round-N.md` do `council.mjs` ghi ra;
  - DISCLAIMER;
  - các thông báo lỗi của `server.mjs` và `anthropic.mjs`;
  - toàn bộ skill `/roast-room`: báo cáo theo `report-template.md`, câu hỏi AskUserQuestion, câu nói trong chat.
- **Lỗi chức năng nghiêm trọng nhất (P0):**
  1. Bộ đọc phiếu `parseCard` chỉ hiểu giá trị tiếng Anh và số thập phân có dấu chấm. Trong khi đó đề bài lại yêu cầu ghế "trả lời bằng tiếng Việt". Hệ quả có thể xảy ra:
     - ghế phản đối bị đếm thành đồng ý;
     - rủi ro sập bị bỏ qua;
     - 7,5 bị đọc thành 7.
  2. Hàm kiểm trích dẫn bỏ hết chữ có dấu. `check_quotes.py` và `check_quotes.mjs` của skill vẫn còn lỗi này. Riêng `seats.mjs` đã có bản sửa chưa commit.
  3. `chairSystem` ra lệnh "write in plain English" ngay trước câu yêu cầu viết tiếng Việt.

Số chuỗi cần dịch theo file: xem bảng cuối mục 1.

---

## 1. Chuỗi tiếng Anh người dùng nhìn thấy

### 1.1 `app/lib/council.mjs`: kết luận, verdict.md, brief.md, round-N.md, DISCLAIMER

| file:dòng | Chuỗi gốc | Đề xuất |
|---|---|---|
| council.mjs:35 | `DISCLAIMER = "Simulated advisors built from each person's public work. They are not the people and do not speak for them."` | "Cố vấn mô phỏng, dựng từ tác phẩm công khai của từng người. Họ không phải người thật và không phát ngôn thay những người đó." (trùng `DISCLAIMER_VI` trong pdf.js:15; nên dùng chung một hằng) |
| council.mjs:206-210 | `bandFor` trả `"RESHAPE"`, `"GO"`, `"GO WITH CONDITIONS"`, `"DON'T DO IT"` | Giữ mã tiếng Anh làm khoá nội bộ vì schema, app.js, pdf.js và phieu.mjs đều tra theo nó. Chỉ dịch lúc hiển thị (xem 1.4). |
| council.mjs:270, 296 | `S.enum("GO", "GO WITH CONDITIONS", "RESHAPE", "WAIT", "DON'T DO IT")` | Giữ nguyên (khoá). Dịch khi in. |
| council.mjs:361 | `"The Chair is giving his own view"` | "Chủ toạ đang nêu góc nhìn của mình" (app.js:79 đã dịch lúc hiển thị; nên phát tiếng Việt ngay từ nguồn) |
| council.mjs:454 | `"The Chair is reading your question"` | "Chủ toạ đang đọc câu hỏi" |
| council.mjs:471 | `"Round 1: opening positions"` | "Vòng 1: quan điểm mở đầu" |
| council.mjs:475 | `"The Chair is finding the fault lines"` | "Chủ toạ đang tìm điểm vênh" |
| council.mjs:481 | `"Round 2: the debate"` | "Vòng 2: tranh luận" |
| council.mjs:493 | `"The Chair is drafting a resolution"` | "Chủ toạ đang soạn đề xuất" |
| council.mjs:496 | `"Round 3: the vote"` | "Vòng 3: bỏ phiếu" |
| council.mjs:500 | `` `Quick mode: spread ${spread} and no ruin risk, so the vote round is skipped` `` | `` `Chế độ nhanh: độ chênh ${spread}, không có rủi ro sập, nên bỏ vòng bỏ phiếu` `` |
| council.mjs:505 | `"The Chair is writing the verdict"` | "Chủ toạ đang viết kết luận" |
| council.mjs:571 (brief.md) | `` `Asked: ${s.prompt}` `` | `` `Câu hỏi: …` `` |
| council.mjs:571 | `"Options:"` | "Phương án:" |
| council.mjs:571 | `"Assumptions:"` | "Giả định:" |
| council.mjs:571 | `"\| Seat \| Weight \| Reason \|"` | "\| Ghế \| Trọng số \| Lý do \|" |
| council.mjs:575 (round-N.md) | `` `## ${name} (weight ${w})` `` | `` `## ${name} (trọng số ${w})` `` (watch.mjs `seatKey` cắt từ "(" nên vẫn đọc được) |
| council.mjs:576 | `` `# Round ${r}` `` | `` `# Vòng ${r}` `` |
| council.mjs:589 (verdict.md) | `` `${ISO date} · Seats: … · Rounds: … · Mode: ${st.mode}` `` | `` `${dd/mm/yyyy} · Ghế: … · Số vòng: … · Chế độ: ${đầy đủ \| nhanh}` `` |
| council.mjs:590 | `` `## Verdict: ${v.label} (Option ${id}: …)` `` | `` `## Kết luận: ${NHAN[v.label]} (phương án ${id}: …)` `` |
| council.mjs:590 | `**The call:**` | `**Kết luận:**` (hoặc "**Quyết định đề xuất:**") |
| council.mjs:591 | `Option scores:` | "Điểm các phương án:" |
| council.mjs:591 | `Support for the resolution x/10` | "Mức ủng hộ đề xuất x/10" |
| council.mjs:591 | `Confidence x/10` | "Độ tin cậy x/10" |
| council.mjs:591 | `Spread x` | "Độ chênh x" |
| council.mjs:593 | `"Math: "` | "Cách tính: " (và đổi `3x8` thành `3×8`, số thập phân dùng dấu phẩy) |
| council.mjs:594 | `## Why the council landed here` | "## Vì sao hội đồng đi đến kết luận này" (trùng tiêu đề PDF) |
| council.mjs:595 | `## Where they fought` | "## Chỗ họ tranh cãi" |
| council.mjs:596 | `## Minority report` | "## Ý kiến thiểu số" (PDF đang dùng "Cần lưu ý") |
| council.mjs:596 | `For this to be right:` | "Để ý kiến này đúng thì:" |
| council.mjs:597 | `## Amendments` | "## Đề xuất sửa đổi" |
| council.mjs:597 | `Adopted` / `Not adopted` | "Được chấp nhận" / "Không chấp nhận" |
| council.mjs:598 | `## Conditions` | "## Điều kiện" |
| council.mjs:599 | `## What to do next` | "## Việc làm tiếp theo" |
| council.mjs:600 | `**Cheapest test:**` | "**Cách thử rẻ nhất:**" |
| council.mjs:600 | `**Kill criteria:**` | "**Dừng nếu:**" |
| council.mjs:600 | `**Revisit:**` | "**Xem lại vào:**" |
| council.mjs:117 | `(weight n)`, `"(no card)"` | Nằm trong prompt, model đọc chứ không phải người dùng. Có thể đổi thành "(trọng số n)", "(không có phiếu)". |

### 1.2 `app/lib/watch.mjs`: chế độ xem, council chạy bằng Claude Code

| file:dòng | Chuỗi gốc | Đề xuất |
|---|---|---|
| watch.mjs:123 | `"The Chair is reading your question"` | "Chủ toạ đang đọc câu hỏi" |
| watch.mjs:125 | `"Round 1: opening positions"` | "Vòng 1: quan điểm mở đầu" |
| watch.mjs:130 | `"The Chair is finding the fault lines"` | "Chủ toạ đang tìm điểm vênh" |
| watch.mjs:138 | `"Round 2: the debate"` | "Vòng 2: tranh luận" |
| watch.mjs:143 | `"The Chair is weighing the debate"` | "Chủ toạ đang cân nhắc cuộc tranh luận" |
| watch.mjs:151 | `"Round 3: the vote"` | "Vòng 3: bỏ phiếu" |
| watch.mjs:154 | `"Quick mode: the vote round is skipped"` | "Chế độ nhanh: bỏ vòng bỏ phiếu" |
| watch.mjs:160 | `"The Chair is writing the verdict"` | "Chủ toạ đang viết kết luận" |
| watch.mjs:173 | `disclaimer: DISCLAIMER` (tiếng Anh) | Dùng hằng tiếng Việt chung |
| watch.mjs:195 | `finish(x, "stopped")` | Trạng thái này hiện ra trong "Phiên cũ" dưới dạng chữ "stopped", vì app.js:88 `STATUS_VI` không có khoá `stopped`. Thêm `stopped: "đã dừng"`. |

Ghi chú: hiện app.js:73-85 (`PHASE_VI`) dịch mọi nhãn phase ở 1.1 và 1.2 lúc hiển thị, nên người dùng *không* thấy tiếng Anh trên trang. Nhưng `events.json` vẫn lưu tiếng Anh. Chỉ cần thêm một nhãn mới mà quên `PHASE_VI` là tiếng Anh lộ ra ngay. Nên phát tiếng Việt từ nguồn và giữ `PHASE_VI` để đọc được phiên cũ.

### 1.3 `app/server.mjs`: thông báo trả về trang

| file:dòng | Chuỗi gốc | Đề xuất | Người dùng có thấy? |
|---|---|---|---|
| server.mjs:90 | `"This room is a viewer. Run /roast-room in Claude Code, or set COUNCIL_RUNNER=api in .env."` | "Phòng đang ở chế độ xem. Chạy /roast-room trong Claude Code, hoặc đặt COUNCIL_RUNNER=api trong .env." | Không (app.js:1252 `COUNCIL_ERR[403]` che đi) |
| server.mjs:92 | `"Give the council a real decision (at least a sentence)."` | "Hãy đưa cho hội đồng một quyết định cụ thể (ít nhất một câu)." | Không (che bởi `COUNCIL_ERR[400]`) |
| server.mjs:97 | `"A council is already in session. Wait for its verdict."` | "Đang có một hội đồng họp. Chờ kết luận rồi triệu tập tiếp." | Không (che bởi `COUNCIL_ERR[409]`) |
| server.mjs:148 | `"no such session"` | "Không thấy phiên này" | Gián tiếp |
| server.mjs:164 | `"not found"` | "Không thấy phiên này" | **Có, gián tiếp:** savePdf/replay đọc `j.events` trên một đối tượng lỗi, sinh lỗi JS tiếng Anh (xem 3.9) |
| server.mjs:168 | `"Not found"` (text/plain) | "Không tìm thấy" | Ít khi |
| server.mjs:176 | `` `Hội đồng chuyên gia on http://localhost:${PORT} (viewer + API runner \| viewer: run /roast-room in Claude Code)` `` | `` `Hội đồng chuyên gia đang chạy tại http://localhost:${PORT} (chế độ xem + tự chạy hội đồng \| chỉ xem: chạy /roast-room trong Claude Code)` `` | Có, trong terminal |
| seats.mjs:17 | `` `roster not found at ${ROSTER}` `` | `` `Không thấy roster.json tại ${ROSTER}` `` | Có, nếu thiếu file (lỗi 500) |

### 1.4 `app/lib/anthropic.mjs`: lỗi AI, hiện trong toast "Hội đồng đã dừng: …"

`loi-vi.js` chỉ dịch 4 mẫu lỗi (EPERM, credit, rate limit, oauth). Các lỗi dưới đây đi thẳng lên toast bằng tiếng Anh.

| file:dòng | Chuỗi gốc | Đề xuất: thêm vào `MAU` trong loi-vi.js |
|---|---|---|
| anthropic.mjs:87 | `` `claude CLI exited ${code}: …` `` | `/claude CLI exited\|ENOENT/` → "Không chạy được Claude Code CLI (chưa cài, hoặc sai CLAUDE_BIN)" |
| anthropic.mjs:88 | `` `Claude Code: …` `` | Giữ phần gốc sau "·", thêm tiền tố "Claude Code báo lỗi" |
| anthropic.mjs:122, 168 | `` `Anthropic ${status}: …` `` | `/Anthropic (5\d\d\|529)\|overloaded/i` → "Máy chủ Claude đang quá tải, thử lại sau" |
| anthropic.mjs:144 | `` `Anthropic stream error: …` `` | "Kết nối tới Claude bị ngắt giữa chừng" |
| anthropic.mjs:151, 174 | `"Anthropic API kept refusing after retries"` | "Máy chủ Claude liên tục từ chối sau nhiều lần thử, thử lại sau" |
| anthropic.mjs:171 | `"Chair output hit max_tokens"` | "Câu trả lời của Chủ toạ bị cắt vì quá dài" |
| anthropic.mjs:59, 109 | `JSON.parse` ném lỗi `Unexpected token … is not valid JSON` | `/not valid JSON\|Unexpected token\|JSON/` → "Claude trả về dữ liệu sai định dạng, thử lại" |

### 1.5 `app/public/app.js`

| file:dòng | Chuỗi gốc / vấn đề | Đề xuất |
|---|---|---|
| app.js:69 | `"GO WITH CONDITIONS": "LÀM, CÓ ĐIỀU KIỆN"` | "LÀM CÓ ĐIỀU KIỆN" cho khớp README. Đổi cùng lúc ở pdf.js:12, phieu.mjs:5 và hai test `phieu.test.mjs:24`, `hop-tiep.test.mjs:33`. Nên gom về một module dùng chung. |
| app.js:88 | `STATUS_VI` thiếu `stopped` → hiện chữ "stopped" | Thêm `stopped: "đã dừng"` |
| app.js:747 | `"conditional yes": "Ủng hộ, nếu"` | "Ủng hộ có điều kiện" (câu "Ủng hộ, nếu" bị cụt) |
| app.js:837 | Hộp "Mở thẻ" in nguyên văn phiếu ý kiến (`<pre>${c.text}</pre>`). Người dùng thấy STANCE:, OPTION SCORES:, PILLAR SCORE:, CONFIDENCE:, RUIN RISK:, DOOR:, THE CALL:, WHY:, THE RISK I SEE:, WHAT WOULD CHANGE MY MIND:, WHAT I'D DO THIS WEEK:, QUESTION FOR THE FOUNDER:, I DISAGREE MOST WITH:, I CONCEDE:, ON THE CRUXES:, MOVED:, MY CONDITIONS FOR YES:, VOTE:, FINAL SCORE:, FINAL PILLAR SCORE:, AMENDMENT OR DISSENT:, ONE LINE FOR THE FOUNDER:, SEAT:, cùng các giá trị Strong yes / likely / one-way / Endorse… | Thay nhãn lúc hiển thị bằng một bảng (xem 2.3). **Không** sửa văn bản gốc lưu trong events.json. |
| app.js:1240 | `"Đang đọc wiki và soạn đề bài…"` | "Đang đọc tài liệu và soạn đề bài…" ("wiki" là từ tiếng Anh, người dùng không có wiki) |
| app.js:1277 | `s.id.slice(0, 10)`: hiện `2026-10-26` | Đổi thành `26/10/2026` |
| app.js:1391 | `"Không tạo được PDF: " + e.message` (thường là lỗi JS tiếng Anh) | Cho qua `loiVi(...)` và bắt lỗi thiếu `j.events` (xem 3.9) |
| app.js:1410-1411 | `` `${(n/1e6).toFixed(1)}M` ``, `` `${…}k` ``, ví dụ "12 lượt gọi · 1.5M vào · 40k ra" | `toLocaleString("vi-VN", { maximumFractionDigits: 1 })` cho ra "1,5 triệu token vào · 40 nghìn ra" |
| app.js:538, 876, 892 | Điểm hiển thị `7.5`; công thức `(3x8 + 2x7) / 5` | Hiển thị "7,5"; công thức "(3×8 + 2×7) / 5". Dùng chung một hàm `soVi()`. |
| app.js:101-103 (index.html) | Nút tốc độ `1.6x`, `2.5x` | "1,6×", "2,5×" |
| app.js:569 | regex `^I('\|$)`: xử lý đại từ "I" tiếng Anh | Không lỗi, nhưng vô dụng với câu tiếng Việt (xem 3.7) |

Phần còn lại của `app.js` và toàn bộ `index.html` đã là tiếng Việt chuẩn.

### 1.6 `app/public/pdf.js`

| file:dòng | Chuỗi gốc / vấn đề | Đề xuất |
|---|---|---|
| pdf.js:12 | `"LÀM, CÓ ĐIỀU KIỆN"` | "LÀM CÓ ĐIỀU KIỆN" (như trên) |
| pdf.js:24 | `"could not load the PDF library"` | "Không tải được thư viện tạo PDF" |
| pdf.js:199 (khu điểm) | `String(sc)` → "7.5" | Định dạng "7,5" |
| pdf.js:259 | tên file dự phòng `"verdict"` | "ket-luan" |
| pdf.js:1-3 (chú thích) | "Montserrat" | Font đủ dấu, đã kiểm cmap (xem 3.10). Không cần sửa. |

Các nhãn khác của PDF đã là tiếng Việt: Quyết định, Kết luận của hội đồng, Góc nhìn Chủ toạ, Điểm, Đề xuất, Vì sao hội đồng đi đến kết luận này, Từng cố vấn chấm điểm thế nào, Cần lưu ý, Việc làm tiếp theo, Chỗ họ tranh cãi, chân trang.

### 1.7 `app/lib/phieu.mjs`, `hop-tiep.mjs`, `hoi-goc.mjs`, `tai-lieu.mjs`, `luat-so.mjs`, `loi-vi.js`

- Nội dung đã là tiếng Việt.
- Vấn đề ở đây là định dạng ngày ISO (`2026-10-26`) trong phiếu và sổ phiếu, xem 3.5.
- `phieu.mjs:5` dùng "LÀM, CÓ ĐIỀU KIỆN", như trên.

### 1.8 `CLAUDE.md` và skill (chạy `/roast-room` trong Claude Code)

| file:dòng | Chuỗi gốc | Đề xuất |
|---|---|---|
| CLAUDE.md:10 | "Write the Chair's parts in plain English … the room's "Download PDF" button" | "Viết phần của Chủ toạ bằng tiếng Việt trang trọng: câu ngắn, không cường điệu, không thừa chữ. … nút "Tải PDF" của phòng". (Tên nút thật là "Tải PDF", app.js:869.) |
| roast-room/SKILL.md:45-49 | AskUserQuestion header `"Board"`; lựa chọn `Recommended board (Recommended)`, `Default board`, `Everyone` | header "Bàn hội đồng"; "Bàn đề xuất (khuyên dùng)", "Bàn mặc định", "Tất cả cố vấn" |
| roast-room/SKILL.md:73 | `"Watch it live at http://localhost:4730"` | "Xem trực tiếp tại http://localhost:4730" |
| roast-room/SKILL.md:105 | Câu tóm tắt trong chat; `"Download PDF"` | Thêm "Viết bằng tiếng Việt"; đổi thành "Tải PDF" |
| roast-room/SKILL.md:111 | "your report is plain English" | "báo cáo viết tiếng Việt trang trọng" |
| roast-room/SKILL.md:120 | các câu mẫu "the Chair recommends a board…", "every council seats your default board" | Dịch: "Chủ toạ đề xuất bàn cho từng quyết định và hỏi bạn", "Chủ toạ tự chọn bàn, không hỏi", "Mọi hội đồng ngồi theo bàn mặc định" |
| roast-room/references/report-template.md:3 | "Written by the Chair in plain English" | "Chủ toạ viết bằng tiếng Việt" |
| report-template.md:6-52 | Toàn bộ khung verdict.md: "Seats", "Rounds", "Mode", "## Verdict", "**The call:**", "Option scores", "Support for the resolution", "Confidence", "Spread", "Vote: n endorse, n amend, n dissent", "## Scorecard", cột "Seat \| Weight \| Final stance \| … \| Pillar score \| Moved? \| Their line", "Math", "## Why the council landed here", "## Where they fought", "## Minority report", "## Conditions", "## What to do next", "This week", "**Cheapest test:**", "**Kill criteria:**", "**Revisit:**", disclaimer | Dịch như bảng 1.1 và thêm: "## Bảng điểm"; cột "Ghế \| Trọng số \| Lập trường cuối \| … \| Điểm mảng \| Đổi ý? \| Câu chốt"; "Tuần này"; "Phiếu: n đồng ý, n sửa đổi, n phản đối"; nhãn kết luận ghi tiếng Việt kèm mã trong ngoặc nếu cần, ví dụ "LÀM CÓ ĐIỀU KIỆN" |
| roast-room/references/live-room.md:27-29, 99 | ví dụ option "Raise to $3,500 for everyone now"…; "folds the rest under "Full detail"" | Ví dụ bằng tiếng Việt, tiền VND; "Chi tiết đầy đủ" (đúng tên trên trang, app.js:884). `label` trong verdict.json giữ mã tiếng Anh (máy đọc). |
| roast-room/scripts/check_quotes.py:48-50 | `brain quotes verified: …`, `UNVERIFIED` | "Câu trích đã khớp: …", "CHƯA KHỚP" (Claude đọc rồi kể lại; ưu tiên thấp) |
| roster.json `pillar`, `question`, `dimension` của 12 ghế kinh doanh | "Strategy and decisions", "Is this the right bet…", "Strategic fit and reversibility"… | Trang đã che bằng `SEAT_VI` (app.js:53-66). Skill và `verdict.md` (cột "Pillar score") vẫn dùng bản tiếng Anh. Nên dịch thẳng trong roster rồi bỏ `SEAT_VI`, để ghế mới thêm bằng /newroaster cũng là tiếng Việt. |
| newroaster/SKILL.md:42-48, 155 | AskUserQuestion và thông báo cuối "Tell the user, in under 150 words" | Thêm "bằng tiếng Việt" |
| newroaster/scripts/add_seat.mjs:31-76 | `--key must be…`, `Added … to the roster.`, `Default board (n): …`, `Board setting: …` | "Đã thêm … vào danh sách", "Bàn mặc định (n): …"… (ưu tiên thấp: Claude đọc rồi kể lại) |
| newroaster/scripts/fetch.mjs | `ok / skip / thin / fail`, `"no English captions"` … | Ưu tiên thấp. Riêng giới hạn phụ đề tiếng Anh là lỗi chức năng, xem 3.11. |

### 1.9 Số chuỗi cần dịch theo file

| File | Số chuỗi | Ghi chú |
|---|---|---|
| app/lib/council.mjs | 31 | DISCLAIMER 1, nhãn phase 8, brief.md 4, round-N.md 2, verdict.md 16 |
| app/lib/watch.mjs | 10 | phase 8, disclaimer 1, trạng thái `stopped` 1 |
| app/server.mjs | 7 | 3 bị trang che, 2 lộ gián tiếp, 1 terminal, 1 text/plain |
| app/lib/seats.mjs | 1 | `roster not found` |
| app/lib/anthropic.mjs | 7 | lỗi lộ qua toast; sửa bằng cách thêm mẫu vào loi-vi.js |
| app/public/app.js | 9 | 1 nhãn kết luận lệch thuật ngữ, 1 trạng thái thiếu, 1 chữ "wiki", 1 nhãn cụt, ngày ISO, "M/k", định dạng điểm, khoảng 23 nhãn trường phiếu trong hộp "Mở thẻ" (tính 1 mục) |
| app/public/pdf.js | 4 | 1 nhãn kết luận, 1 lỗi, định dạng số, tên file dự phòng |
| app/public/index.html | 1 | "1.6x / 2.5x" |
| app/lib/phieu.mjs | 1 nhãn + ngày ISO | |
| CLAUDE.md | 2 | "plain English", "Download PDF" |
| roast-room (SKILL.md + references + script) | khoảng 45 | report-template khoảng 30 nhãn, SKILL.md khoảng 10, live-room 4, check_quotes.py 2 |
| newroaster (SKILL + scripts) | khoảng 25 | phần lớn là log script, ưu tiên thấp |
| roster.json | 36 | 12 ghế × (pillar, question, dimension) |

---

## 2. Prompt ép model viết tiếng Anh

### 2.1 Những chỗ ép tiếng Anh

| file:dòng | Đoạn prompt | Tác động |
|---|---|---|
| council.mjs:27 (`chairSystem`) | "write in plain English: short sentences, no em dashes…", ngay sau là "Viết mọi chữ hiển thị … bằng tiếng Việt khi câu hỏi bằng tiếng Việt." | Hai lệnh mâu thuẫn trong cùng system prompt, áp cho mọi lượt gọi Chủ toạ (setup, cruxes, draft, verdict). Kết luận dễ lẫn câu tiếng Anh, nhất là `fights.story`, `minority.would_have_to_be_true`, `revisit`, `override_note`. |
| council.mjs:22-25 (`chairSystem`, gói vai-tro mới) | "simulated expert roles … built from current law" | Mô tả tiếng Anh, không hại; có thể giữ. |
| council.mjs `round1/2/3Prompt` (khoảng 80-190) | Toàn bộ khung phiếu và luật bằng tiếng Anh ("Answer in your seat's voice, first person, plain text…") | Ghế được bảo "trả lời bằng tiếng Việt" ở **cuối đề bài** (hoi-goc.mjs `buildPrompt`: "Trả lời và viết kết luận bằng tiếng Việt."; hop-tiep.mjs:66). Nhưng khung phiếu ngay sau lại bằng tiếng Anh. Kết quả thường gặp: nhãn tiếng Anh, nội dung lẫn lộn, giá trị liệt kê nửa Anh nửa Việt. Đây chính là nguyên nhân của lỗi P0 ở 3.1. |
| council.mjs `chairSetup`, `chairCruxes`, `chairDraft`, `chairVerdict` | Hướng dẫn tiếng Anh, không nhắc ngôn ngữ đầu ra | Chỉ dựa vào câu tiếng Việt cuối `chairSystem` |
| seats.mjs:49 | "## Runtime note …" | Không ép ngôn ngữ; giữ được |
| luat-so.mjs:5-10 (`LUAT_SO`) | "NUMBERS RULE …" tiếng Anh nhưng dùng mốc tiếng Việt ("Chưa có số:", "GIẢ ĐỊNH:") | Ổn. Có thể thêm: "Viết số theo kiểu Việt: 1.000; 7,5". |
| .claude/agents/council-*.md | Không có chỉ thị ngôn ngữ; não bằng tiếng Anh | Ghế mặc định nói tiếng Anh |
| CLAUDE.md:10, roast-room/SKILL.md:111, report-template.md:3 | "plain English" | `/roast-room` trong Claude Code sẽ viết verdict.md và tóm tắt trong chat bằng tiếng Anh |
| newroaster brain-spec.md:27, writer-prompt.md:26, SKILL.md:172 | "Plain English" | Não ghế mới bằng tiếng Anh. Mâu thuẫn với `docs/goi-nganh-spec.md` §3.1 ("Viết bằng tiếng Việt") cho ghế `vai-tro`. |

### 2.2 Ràng buộc: các nhãn phiếu là giao kèo với bộ đọc

`seats.mjs` (`field()`, `parseOptionScores`, `parseCard`, dòng 120-165) dò bằng regex các nhãn sau:

- `STANCE`, `OPTION SCORES`, `PILLAR SCORE`, `FINAL PILLAR SCORE`, `FINAL SCORE`, `CONFIDENCE`
- `RUIN RISK` (giá trị `none|possible|likely`)
- `DOOR` (giá trị `one-way|two-way`)
- `I DISAGREE MOST WITH`, `I CONCEDE`, `MOVED`
- `VOTE` (giá trị `endorse|amend|dissent`)
- `AMENDMENT OR DISSENT`, `ONE LINE FOR THE FOUNDER`, `QUESTION FOR THE FOUNDER`, `THE RISK I SEE`, `WHAT I'D DO THIS WEEK`, `THE CALL`

Ngoài ra:

- `watch.mjs:42` đọc `SEAT:`.
- `parseOptionScores` cắt dòng tại `PILLAR SCORE|CONFIDENCE|FINAL SCORE`.
- `app.js:715` (`/^yes/`) và `app.js:745` (`stanceWord`) đọc giá trị tiếng Anh.
- `council.mjs:489, 546` dựa vào `ruin === "likely"` và `vote || "endorse"`.

Dịch nhãn trong prompt mà không đổi bộ đọc sẽ làm hỏng điểm số và phiếu bầu.

### 2.3 Phương án an toàn (khuyến nghị)

**Bước 1: giữ giao kèo máy đọc, Việt hoá phần chữ.** Đây là thay đổi nhỏ nhất và an toàn nhất.

- `chairSystem`: bỏ "write in plain English". Thay bằng:
  > Write every human-readable field in formal Vietnamese (tiếng Việt trang trọng): short sentences, no em dashes, no hype, no filler. JSON keys and the `label` enum stay exactly as given in the schema.
- Thêm một khối chung `NGON_NGU_PHIEU` vào cuối `round1Prompt`, `round2Prompt`, `round3Prompt`:
  > LANGUAGE: Keep every field label (SEAT, STANCE, OPTION SCORES, PILLAR SCORE, CONFIDENCE, RUIN RISK, DOOR, THE CALL, WHY, … VOTE, FINAL SCORE, AMENDMENT OR DISSENT, ONE LINE FOR THE FOUNDER) exactly in English capitals as shown. On STANCE, RUIN RISK, DOOR, MOVED and VOTE, start with one of the English values shown (e.g. "Conditional yes", "likely", "one-way", "yes, from A to C", "Dissent"); you may add a Vietnamese explanation after it. Write scores with a dot (7.5). Write everything else in formal Vietnamese. Verbatim quotes from your brain stay in their original English inside quotation marks with the source id; add a Vietnamese gloss after them if useful.
- Hiển thị: thêm vào app.js một bảng `NHAN_PHIEU_VI`:

  | Nhãn gốc | Hiển thị |
  |---|---|
  | STANCE | LẬP TRƯỜNG |
  | OPTION SCORES | ĐIỂM PHƯƠNG ÁN |
  | PILLAR SCORE | ĐIỂM THEO MẢNG |
  | CONFIDENCE | ĐỘ TỰ TIN |
  | RUIN RISK | RỦI RO SẬP |
  | DOOR | CỬA (MỘT CHIỀU / HAI CHIỀU) |
  | THE CALL | KẾT LUẬN CỦA GHẾ |
  | WHY | VÌ SAO |
  | THE RISK I SEE | RỦI RO TÔI THẤY |
  | WHAT WOULD CHANGE MY MIND | ĐIỀU LÀM TÔI ĐỔI Ý |
  | WHAT I'D DO THIS WEEK | VIỆC TÔI LÀM TUẦN NÀY |
  | QUESTION FOR THE FOUNDER | CÂU HỎI CHO NGƯỜI HỎI |
  | I DISAGREE MOST WITH | TÔI PHẢN BÁC NHẤT |
  | I CONCEDE | TÔI THỪA NHẬN |
  | ON THE CRUXES | VỀ CÁC ĐIỂM VÊNH |
  | MOVED | ĐỔI Ý |
  | MY CONDITIONS FOR YES | ĐIỀU KIỆN ĐỂ TÔI ĐỒNG Ý |
  | VOTE | PHIẾU |
  | FINAL SCORE | ĐIỂM CUỐI |
  | FINAL PILLAR SCORE | ĐIỂM MẢNG CUỐI |
  | AMENDMENT OR DISSENT | SỬA ĐỔI HOẶC PHẢN ĐỐI |
  | ONE LINE FOR THE FOUNDER | MỘT CÂU CHO NGƯỜI HỎI |
  | SEAT | GHẾ |

  Giá trị: Strong yes → Rất ủng hộ; Conditional yes → Ủng hộ có điều kiện; likely → khả năng cao; possible → có thể; none → không; one-way → một chiều; two-way → hai chiều; Endorse → Đồng ý; Endorse with amendment → Đồng ý có sửa đổi; Dissent → Phản đối.

  Áp bảng này khi render `<pre>` ở app.js:837 và khi ghi `round-N.md`. `events.json` vẫn giữ bản gốc, nên phiên cũ phát lại không vỡ.

**Bước 2: làm bộ đọc chịu được tiếng Việt.** Đây là lưới an toàn, nên làm cùng bước 1.

- `field()`: nhận nhãn dạng alternation, ví dụ `field(text, "STANCE|LẬP TRƯỜNG")`. Regex hiện tại đã đưa `label` vào `new RegExp`, chỉ cần bọc bằng `(?:…)`.
- Giá trị:
  - RUIN: `/none|không|possible|có thể|likely|cao/i`, quy về `none/possible/likely`;
  - VOTE: `/dissent|phản đối/`, `/amend|sửa đổi/`, `/endorse|đồng ý|tán thành/`;
  - DOOR: `/one-way|một chiều/`, `/two-way|hai chiều/`;
  - MOVED (app.js:715): `/^(yes|có)/i`;
  - `stanceWord`: thêm `rất ủng hộ|ủng hộ có điều kiện|ủng hộ|phản đối mạnh|phản đối`.
- Số: `num()` và `parseOptionScores` đổi `(\d+(?:\.\d+)?)` thành `(\d+(?:[.,]\d+)?)`, sau đó `.replace(",", ".")`. Điểm chỉ từ 0 đến 10 nên không nhầm với dấu nghìn.
- Phiếu bầu không đọc được: hiện `council.mjs:546` và `app.js:717, 730, 824` coi là `"endorse"`. Nên đếm là "chưa rõ" và hiện ra, đừng ngầm tính là đồng ý.
- Thêm test `seats.test.mjs` với một phiếu tiếng Việt như ví dụ ở 3.1.

**Không khuyến nghị** đổi hẳn nhãn sang tiếng Việt (LẬP TRƯỜNG:, ĐIỂM PHƯƠNG ÁN:…). Muốn vậy phải sửa đồng bộ cả bộ đọc, `watch.mjs`, `round-prompts.md` của skill, các agent, và vẫn phải đọc được phiên cũ. Rủi ro cao, lợi ích chỉ ở bản thô vốn đã dịch được lúc hiển thị.

**Với skill `/roast-room`:** sửa CLAUDE.md:10, SKILL.md:111, report-template.md (khung tiếng Việt), round-prompts.md (thêm cùng khối `NGON_NGU_PHIEU`). Giữ `label` trong `verdict.json` và `draft.json` bằng mã tiếng Anh, vì `watch.mjs` và app.js tra theo mã đó.

---

## 3. Lỗi Việt hoá chức năng

### 3.1 [P0] Bộ đọc phiếu không hiểu giá trị tiếng Việt và dấu phẩy thập phân

Vị trí: `seats.mjs:125` (`num`), `:129-136` (`parseOptionScores`), `:141` (ruin), `:144-145` (vote), `:154` (door), `app.js:715, 745`.

Chạy thử `parseCard` với một phiếu có giá trị tiếng Việt:

```
STANCE: Có, có điều kiện
OPTION SCORES: A 7,5 · B 4 · C 6,5
PILLAR SCORE: 8,5/10
RUIN RISK: khả năng cao
DOOR: một chiều
VOTE: Phản đối
MOVED: có, từ A sang C
```

Kết quả: `optionScores {A:7, B:4, C:6}`, `pillar 8`, `ruin ""`, `door ""`, `vote ""`. Bản tiếng Anh tương đương đọc đúng `7.5 / 6.5 / 8.5 / likely / one-way / dissent`.

Hệ quả:

- Điểm bị cắt phần thập phân, nên điểm có trọng số và nhãn kết luận có thể sai băng (ví dụ 7,5 thành 7 rơi từ LÀM xuống LÀM CÓ ĐIỀU KIỆN).
- `ruin === "likely"` không bao giờ đúng:
  - chế độ nhanh bỏ vòng 3 (council.mjs:489-490) dù có ghế báo rủi ro sập;
  - Chủ toạ được báo "Any seat at ruin risk likely: none" (council.mjs:324), nên luật giới hạn ở ĐIỀU CHỈNH không chạy.
- `vote ""` bị coi là `"endorse"` (council.mjs:546, app.js:717/730/824): ghế **phản đối bị đếm và hiển thị là đồng ý**.
- "Đã đổi quan điểm" không hiện; nhãn lập trường thành "Đã nói".

Đề bài (`buildPrompt`, `promptHopTiep`) đang yêu cầu "Trả lời … bằng tiếng Việt" nên rủi ro này có thật. Sửa theo 2.3.

### 3.2 [P0] Kiểm trích dẫn bỏ mất chữ có dấu

- `seats.mjs:77-79` `norm()` (bản HEAD): `.replace(/[^a-z0-9' ]+/g, " ")`.
  - Thử: "Người lao động nước ngoài phải có giấy phép lao động" thành `"ng i lao ng n c ngo i ph i c gi y ph p lao ng"`.
  - "Đầu tư" và "Đâu tư" cùng thành `"u t"`, tức là bằng nhau.
  - Với gói `phap-ly-nnn` (não và trích dẫn tiếng Việt, theo goi-nganh-spec §3.3), kiểm nguyên văn mất nghĩa: trích sai dấu, sai chữ vẫn có thể được đánh dấu "có trong bộ não". Văn bản luật mà nhầm "được" với "đuợc", hay số điều khoản, là sai nghiêm trọng.
  - **Trạng thái:** bản làm việc lúc kiểm đã có sửa chưa commit (`normalize("NFC")` + `[^\p{L}\p{N}' ]+/gu`). Cần commit, thêm test tiếng Việt, và chuẩn hoá NFC cả phần não trong `brainNorm`. Bản sửa áp `norm` cho cả hai phía nên đã đủ.
- **Chưa sửa:**
  - `.claude/skills/roast-room/scripts/check_quotes.py:21-24` (`re.sub(r"[^a-z0-9' ]+", …)`). Skill dùng script này ở Step 7 để gỡ trích dẫn sai khỏi verdict.
  - `.claude/skills/newroaster/scripts/check_quotes.mjs:22-26`.
  - Sửa: Python `s = unicodedata.normalize("NFC", s.lower()); re.sub(r"[^\w' ]+", " ", s)` (`\w` của Python 3 hiểu Unicode; loại `_` nếu cần). JS: `[^\p{L}\p{N}' ]+/gu`.

### 3.3 [P1] `seatIn()` và `seatKey()` chỉ hiểu a-z

- `seats.mjs:107-108` `seatIn` (HEAD: `[^a-z0-9 ]`).
  - Tên ghế có dấu bị cắt vụn. Ví dụ trong gói pháp lý, một ghế tên "Luật sư FDI" thành "lu t s fdi".
  - Dòng "I DISAGREE MOST WITH: Chuyên viên Xuất nhập cảnh" không nhận ra đối tượng, nên mũi tên phản bác và nhãn "Phản bác …" mất.
  - **Trạng thái:** bản làm việc đã có sửa `\p{L}` + NFC, chưa commit.
  - Còn một chỗ: dòng 112-115 tách họ bằng `split(" ").pop()`. Với tên tiếng Việt thì "họ" là từ đầu, từ cuối là tên. Logic so họ không đúng cho tên Việt, nhưng ghế vai-tro ẩn danh nên ít ảnh hưởng.
- `watch.mjs:23` `seatKey`: `.replace(/[^a-z ]/g, " ")`. **Chưa sửa.** Ở chế độ xem (`/roast-room` ghi round-N.md), tiêu đề "## <tên ghế có dấu>" không khớp ghế, nên phiếu bị bỏ qua và vòng không bao giờ "xong" đến khi có file kế tiếp. Sửa giống `seatIn`.
- `watch.mjs:33, 41`: `/chair/i` dùng để bỏ phần của Chủ toạ. Nếu skill viết "## Ghi chú Chủ toạ" thì không bị bỏ (ở nhánh dự phòng không có tiêu đề ghế). Thêm `|chủ toạ|chủ tọa`.
- `app.js:569` `^([A-Za-z][\w.' ]{0,24})`: tên ghế có dấu không được "gọi tên" trong câu phản bác. Đổi sang `\p{L}` với cờ `u`.
- `pdf.js:63-65` và `app.js:846` `seatKey`: so chuỗi trực tiếp (không lọc a-z) nên chạy được, nhưng nên `normalize("NFC")`.

### 3.4 [P1] `slugify()` trong council.mjs bỏ dấu sai cách

`council.mjs:41-43`: `.toLowerCase().replace(/[^a-z0-9]+/g, "-")`. Thử:

- "Tăng giá dịch vụ tư vấn" thành `t-ng-gi-d-ch-v-t-v-n`;
- "Đổi thẻ tạm trú" thành `i-th-t-m-tr`.

Tên thư mục `sessions/<id>-<slug>` xấu và khó tìm; tiêu đề toàn chữ có dấu ngắn có thể ra slug gần rỗng. `phieu.mjs:11-14` đã có `slugVi()` làm đúng (NFD, bỏ dấu, đ thành d). Dùng lại `slugVi` ở council.mjs. Tương tự cho `newroaster/scripts/fetch.mjs:34`.

### 3.5 [P1] Ngày tháng: ISO và lệch múi giờ UTC

- `council.mjs:50` id phiên = `new Date().toISOString().slice(0, 10)` là ngày **UTC**. Từ 00:00 đến 06:59 giờ Việt Nam, id mang ngày hôm trước.
  - `pdf.js:47-50` `dateLine(id)` lấy ngày từ id, nên **ngày trên báo cáo PDF sai một ngày** với hội đồng họp sáng sớm.
  - Lịch sử (app.js:1277) cũng hiện ngày sai.
- `council.mjs:589` verdict.md: cùng lỗi UTC, lại ở dạng ISO.
- `server.mjs:24` `homNay()` dùng `en-CA` + `Asia/Ho_Chi_Minh`. Múi giờ đúng, nhưng chuỗi ISO `2026-10-26` đi thẳng vào nội dung người đọc:
  - phieu.mjs:61 "Hội đồng chuyên gia · 2026-10-26";
  - :67 "Xem lại trước 2026-11-25";
  - :108 cột "Ngày" và "Hạn xem lại" của sổ phiếu;
  - :124 "## Lần họp 2 (2026-10-26)".
  - Giữ ISO cho **tên file** (để sắp xếp được); đổi phần **chữ** sang `dd/mm/yyyy`. `hop-tiep.mjs:34` đọc "## Lần họp N" không phụ thuộc ngày nên an toàn.
  - Cẩn thận: `phieu.mjs:115` `ddmm()` và `cong30()` nhận ISO, nên chỉ định dạng lúc in.
- Sửa chung: một hàm `ngayVN(d)` = `d.toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", day: "2-digit", month: "2-digit", year: "numeric" })`. Id phiên lấy ngày theo `Asia/Ho_Chi_Minh`.

### 3.6 [P1] Định dạng số kiểu Việt

**Hiển thị.** Mọi điểm in bằng `String(x)` hoặc template literal nên ra "7.5":

- app.js:538, 876, 877, 892;
- pdf.js khu điểm (dòng `String(sc)`, `s.optionScores`);
- phieu.mjs:72;
- council.mjs:591-593.

Tiếng Việt viết "7,5". Dùng `x.toLocaleString("vi-VN")`. Token: "1.5M" nên thành "1,5 triệu".

**Dò số (`luat-so.mjs`).** Chạy thử `soTrong`:

| Đầu vào | Đọc ra | Vấn đề |
|---|---|---|
| "1,5 tỉ" | 1,5 | **"tỉ" (biến thể chính tả rất phổ biến) không có trong danh sách đơn vị**, nên số tỉ đọc thành 1,5. Kết luận ghi "1,5 tỉ" thì bị gắn cờ "chưa có nguồn" dù đề bài có "1,5 tỷ", và ngược lại. Thêm `tỉ`, `tỉ đồng` vào `SO` và `NHAN` (luat-so.mjs:23-24). |
| "10 nghìn tỷ" | 10.000 | Đơn vị ghép không cộng dồn |
| "1 000 khách" | 1 và 000 | Dấu cách phân nghìn không hiểu |
| "1,5 Tỷ" / "TỶ" | thiếu đơn vị | Regex không có cờ `i` |
| "1,258 đơn" | 1258 | Cố ý theo kiểu Anh (chú thích dòng 29). Với người Việt "1,258" là 1,258. Nên bỏ nhánh này, hoặc chỉ áp khi không có dấu chấm nào trong toàn văn bản. |
| Văn bản NFD (dán từ macOS) | "tỷ" không khớp | Chuẩn hoá NFC ở đầu vào: `server.mjs` `/api/hoi`, `/tiep` và `soTrong` |

Thêm vào `LUAT_SO` câu: "Viết số kiểu Việt Nam: 1.000 (nghìn), 7,5 (thập phân), đơn vị tỷ/triệu/nghìn".

### 3.7 [P2] Khẩu hình nhân vật

`app.js:641, 667`: `normalize("NFD").replace(/[^a-z]/gi, "")`. Cách này bỏ dấu đúng, nhưng "đ" không tách được nên bị xoá; chỉ ảnh hưởng hình miệng. Có thể thêm `.replace(/đ/gi, "d")`.

### 3.8 [P2] Gợi ý gói ngành theo từ khoá

`nganh.mjs:83-86` `doanGoi`: so `includes` sau `toLowerCase()`, không NFC. Câu hỏi dán ở dạng NFD sẽ không khớp "thị thực", "tạm trú"… Thêm `.normalize("NFC")` cho cả câu hỏi và từ khoá. Roster đã tự liệt kê cả "hoá" lẫn "hóa"; có thể bỏ trùng bằng cách quy về một kiểu bỏ dấu khi so.

### 3.9 [P1] Lỗi JS tiếng Anh lộ ra toast

- `app.js:1381-1385` `savePdf` với phiên không còn: server trả `{error:"not found"}`, sau đó `j.events.find` ném lỗi "Cannot read properties of undefined (reading 'find')". Toast hiện "Không tạo được PDF: Cannot read properties…".
- `app.js:1283-1288` `replay`: cùng lỗi nhưng không bắt, nên trang im lặng.
- Sửa: kiểm `r.ok` và `Array.isArray(j.events)`, báo "Không thấy phiên này".
- `pdf.js:24`: "could not load the PDF library".
- Lỗi mạng của trình duyệt ("Failed to fetch"): cho qua `loiVi`, thêm mẫu `/Failed to fetch|NetworkError/` thành "Mất kết nối tới máy chủ".

### 3.10 [OK] Font PDF có dấu

Đã đọc bảng cmap của `app/public/brand/fonts/Montserrat-{Regular,SemiBold,Bold}.ttf`. Cả ba có đủ 134 ký tự tiếng Việt dựng sẵn (ă â đ ê ô ơ ư và mọi tổ hợp thanh) cùng các dấu tổ hợp U+0300/0301/0303/0309/0323. Trang web dùng Be Vietnam Pro (index.html:12), có subset tiếng Việt.

Khuyến nghị nhỏ: trong `pdf.js` `clean()` thêm `.normalize("NFC")`. Chữ dạng NFD (dán từ macOS) sẽ để jsPDF vẽ dấu rời, có thể lệch vị trí.

### 3.11 [P2] Dựng não từ nguồn tiếng Việt

`newroaster/scripts/fetch.mjs:113-117, 133-136` chỉ lấy phụ đề `en`; video tiếng Việt báo "no English captions". Với ghế `vai-tro` dựng từ video hướng dẫn thủ tục tiếng Việt, cần `--sub-langs "vi.*,vi,en.*,en"` và `/^(vi|en)/` cho innertube. `fetch.mjs:33` đếm từ theo khoảng trắng, áp được cho tiếng Việt.

### 3.12 [P2] Định dạng khác

- `add_seat.mjs:32-33`: `key`/`slug` buộc a-z. Hợp lý vì là định danh, nhưng thông báo lỗi tiếng Anh.
- `app.js:747` "Ủng hộ, nếu" (cụt), xem 1.5.
- Thuật ngữ "LÀM, CÓ ĐIỀU KIỆN" (3 chỗ code, 2 test) khác README "LÀM CÓ ĐIỀU KIỆN".

---

## 4. Danh sách ưu tiên sửa

### P0: sai kết quả hoặc mâu thuẫn trực tiếp với yêu cầu "mọi thứ tiếng Việt"

1. **Bộ đọc phiếu** (3.1).
   - Nhận giá trị tiếng Việt và dấu phẩy thập phân trong `seats.mjs` `num`, `parseOptionScores`, `parseCard` (ruin, vote, door) và `app.js` (moved, stanceWord).
   - Phiếu không đọc được thì không mặc định là "endorse" (council.mjs:546, app.js:717/730/824).
   - Thêm test với phiếu tiếng Việt.
2. **Prompt** (2.3 bước 1).
   - Bỏ "write in plain English" ở `chairSystem` (council.mjs:27), thay bằng chỉ thị tiếng Việt trang trọng.
   - Thêm khối `NGON_NGU_PHIEU` vào 3 prompt vòng: giữ nhãn và giá trị liệt kê tiếng Anh, số dùng dấu chấm, nội dung tiếng Việt, trích nguyên văn giữ tiếng Anh.
3. **Kiểm trích dẫn có dấu** (3.2).
   - Commit bản sửa `norm()` đang có trong bản làm việc kèm test.
   - Sửa `roast-room/scripts/check_quotes.py` và `newroaster/scripts/check_quotes.mjs`.
   - Bắt buộc trước khi dùng gói `phap-ly-nnn`.

### P1: tiếng Anh người dùng thấy, hoặc lỗi hiển thị hay dữ liệu

4. `verdictMarkdown`, `brief.md`, `round-N.md`, DISCLAIMER trong council.mjs và watch.mjs sang tiếng Việt (1.1, 1.2). Một hằng `TUYEN_BO_VI` dùng chung cho council, watch, pdf, app.
5. Ngày: id phiên và verdict.md theo giờ Việt Nam (lỗi lệch ngày trên PDF); phần chữ phiếu và sổ phiếu theo `dd/mm/yyyy`; lịch sử phiên `dd/mm/yyyy` (3.5).
6. Định dạng số kiểu Việt khi hiển thị (điểm, công thức, token). `luat-so.mjs`: thêm "tỉ", cờ `i`, chuẩn hoá NFC; xem lại nhánh "1,258" (3.6).
7. `slugify` dùng `slugVi` (3.4). `watch.mjs` `seatKey` và `app.js:569` hiểu chữ có dấu; commit bản sửa `seatIn` (3.3).
8. Hộp "Mở thẻ": dịch nhãn và giá trị phiếu lúc hiển thị (app.js:837, bảng 2.3).
9. Thông báo lỗi: thêm mẫu vào `loi-vi.js` cho lỗi anthropic.mjs và lỗi mạng; dịch server.mjs:90/92/97/148/164 và seats.mjs:17; sửa savePdf/replay khi phiên không còn (1.3, 1.4, 3.9).
10. Thống nhất "LÀM CÓ ĐIỀU KIỆN" (app.js:69, pdf.js:12, phieu.mjs:5 và 2 test); thêm `stopped: "đã dừng"`; "Đang đọc tài liệu…" thay "wiki".
11. Skill `/roast-room`: CLAUDE.md:10, SKILL.md (AskUserQuestion, câu chat, "Tải PDF"), report-template.md sang khung tiếng Việt, round-prompts.md thêm khối ngôn ngữ (1.8).

### P2: đánh bóng

12. Phát nhãn phase tiếng Việt ngay từ server; giữ `PHASE_VI` để đọc phiên cũ.
13. roster.json: dịch `pillar`, `question`, `dimension` của 12 ghế kinh doanh, bỏ `SEAT_VI`.
14. newroaster: chỉ thị "tiếng Việt" trong SKILL.md, brain-spec, writer-prompt cho ghế vai-tro; lấy phụ đề `vi`; log script tiếng Việt.
15. Nút tốc độ "1,6×"; "Ủng hộ có điều kiện"; NFC trong `pdf.js clean()`, `doanGoi`; "đ" trong khẩu hình; log terminal của server.mjs:176; tên file PDF dự phòng.
