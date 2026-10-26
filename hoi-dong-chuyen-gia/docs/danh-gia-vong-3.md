# Đánh giá vòng 3: gói ngành `phap-ly-nnn` trên tập kiểm tra

Người đánh giá: độc lập, chấm khắt khe theo rubric 12 tiêu chí ở `docs/nghien-cuu-the-gioi.md` mục 4 (thang 1–10, chỉ cho 9–10 khi gần đúng mô tả mức 10). Phần chấm điểm, kiểm tra pháp lý, đóng vai CEO và thử giao diện làm xong trước khi đọc `docs/danh-gia-vong-1.md` và `docs/danh-gia-vong-2.md`. Mục 7 "So với vòng 1 và 2" viết sau cùng.

Hôm nay của phiên: 27/10/2026 (thứ Ba). Mọi phép tính ngày bên dưới đều tính lại bằng tay.

## 0. Phạm vi

Thư mục `sessions/2026-10-27-mvpq*`, `mvpr*`, `mvps*` có **13** phiên, không phải 12: ca Bắc Ninh chạy hai lần (`mvpq4le8` và `mvpsncut`). Máy chấm dùng `mvpsncut`. Cả 13 phiên ở chế độ đầy đủ, 3 vòng, 5–6 ghế, 4,1–7,2 phút tới kết luận.

| Mã | Thư mục (rút gọn) | Ca bộ đề | Đọc |
|---|---|---|---|
| K1 | `mvpql3i6` đổi GPLĐ khi bổ nhiệm Giám đốc nhà máy | `gia-han-gpld-doi-vi-tri` (BẪY NĐ 152/2020) | **Đọc kỹ toàn bộ** (brief, 3 vòng, verdict, events, phiếu, PDF) |
| K2 | `mvpqdnpk` kỹ sư Đức lắp đặt 75 ngày | `chuyen-gia-ngan-han-75-ngay` | **Đọc kỹ** |
| K3 | `mvprorrn` mua 60% vốn công ty quảng cáo | `ma-60-nganh-dieu-kien` (BẪY Luật 61/2020) | **Đọc kỹ** |
| K4 | `mvpr3tqg` Phiếu LLTP cho khách đã về Thượng Hải | `lltp-nguoi-da-roi-vn` | **Đọc kỹ** |
| K5 | `mvpsg8sk` hộ chiếu kịp chuyến bay Seoul | `ho-chieu-gap-di-han` | **Đọc kỹ** |
| K6 | `mvps8t64` thuế TNCN chuyên gia Singapore 150 ngày | `tncn-chuyen-gia-150-ngay` | **Đọc kỹ** |
| K7 | `mvpsncut` phục vụ khách Bắc Ninh (và lần chạy trước `mvpq4le8`) | `mo-diem-bac-ninh-hay-ctv` | **Đọc kỹ** |
| K8 | `mvps2cfs` chuyển tiền về công ty mẹ | `chuyen-loi-nhuan-lo-luy-ke` | Đọc verdict, góc nhìn Chủ toạ |
| K9 | `mvpqw2pi` chồng Hàn Quốc của công dân Việt Nam | `ket-hon-the-tt-thuong-tru` | Đọc verdict, góc nhìn Chủ toạ |
| K10 | `mvpralzw` đổi GPLX Hàn Quốc | `doi-gplx-nuoc-ngoai` | Lướt |
| K11 | `mvprhq7c` Apostille bằng Trung, Hàn | `apostille-bang-han-trung` | Lướt |
| K12 | `mvprvvpd` VPĐD ký hợp đồng bán linh kiện | `vpdd-ky-hop-dong-ban-hang` | Lướt |

Điểm tự động (`node app/scripts/chay-bo-de.mjs --cham-lai true --tap kiem_tra`): **162/171 (95%)**, 12 ca, 4 ca đủ điểm. Thiếu: K2 (phân loại chuyên gia/lao động kỹ thuật; "cần kiểm tra" nhóm dưới 90 ngày), K9 (Bộ trưởng Bộ Công an / 4 tháng; 30 ngày ngắn hơn hộ chiếu), K10 (nơi nộp Công an), K11 ("11/9/2026", thực ra kết luận viết "11/09/2026": máy chấm báo nhầm), K12 (chi nhánh 5 năm), K5 (nộp trực tuyến), K7 (hợp đồng xử lý dữ liệu, bảo mật).

---

## Tóm tắt điều hành

1. **Nội dung pháp lý cốt lõi đúng hướng ở cả 12 ca, kể cả ca bẫy.** K1 nói thẳng "Nghị định 152/2020/NĐ-CP không còn là căn cứ, văn bản thay thế là Nghị định 219/2025/NĐ-CP" và gạt mốc "45 ngày". K2 gạt miễn thị thực và e-visa để làm việc, không chấm khẳng định "dưới 90 ngày được miễn". K3 loại chuyển tiền ra Hàn Quốc trước đăng ký. K5 gạt dịch vụ "2 ngày", không hứa kịp ngày bay. Không phiên nào khuyên khai sai mục đích. Mọi phép tính ngày tôi kiểm lại (35/74/39 ngày ở K1; ngày thứ 75 = 13/02/2027 ở K2; 26/11 ở K3; 09/11 và 8/5 ngày ở K5; 05/01/2027 ở K10; 20–21/11 ở K9; 65 ngày ở K8) đều đúng. Lỗi lệch ngày của vòng 2 đã hết.
2. **Lỗi nặng nhất bây giờ nằm ở khâu "từ kết luận ra giấy gửi khách".** Phiếu khách lọc câu theo từ khoá nội bộ nên **xoá mất hành động chính** (K1 bước 13/11 chỉ còn "Nộp D", mất "Nộp hồ sơ B"; K7 còn câu cụt "Bảng có cột ghi khách đã đồng ý…"), **bỏ rủi ro không đảo ngược** ở 11/13 phiếu (mục "Rủi ro cần lưu ý" chỉ còn "Điểm dừng"), và **để lọt tên ghế AI như thể là nhân viên thật** ("Vận hành gửi văn bản…", "Lao động kết luận sơ bộ", "LS FDI lập văn bản…", "Tư pháp và Tuân thủ đối chiếu…"). PDF kết luận 4 trang **không có mục Căn cứ pháp lý, Điều kiện, Dự báo** và chỉ in 3 trên 6 bước.
3. **Góc nhìn Chủ toạ tìm ra lỗi thật nhưng không sửa.** Ở cả 13 phiên, lượt "góc nhìn" chạy sau kết luận và chỉ ra lỗi chất lượng luật sư: K3 "kết luận chưa nói rõ Luật Đầu tư 61/2020/QH14 không còn là căn cứ"; K2 "hồ sơ GPLĐ và công văn nhập cảnh nối tiếp, không song song"; K1 "thiếu bước thẻ tạm trú mới"; K7 "ngưỡng 500 nghìn chỉ đúng khi cộng tác viên thay hết chuyến". Kết luận và phiếu khách giữ nguyên lỗi. Giao diện có băng "Chủ toạ không đồng ý ở N điểm", nhưng CEO vẫn phải tự sửa tay.
4. **Grounding pháp luật vẫn là trần thấp nhất.** Trong mục "Căn cứ pháp lý chính", phần lớn dòng mang nhãn CẦN KIỂM TRA (K1: 7/8). Không trích dẫn nào bấm được tới văn bản. Nhãn của cùng một sự kiện khác nhau giữa các phiên (khung phạt quá hạn tạm trú: QUY ĐỊNH ở K10, CẦN KIỂM TRA ở K7, K9). Máy kiểm điều luật không bắt được "Luật Đầu tư 2020" (không số hiệu), nên bẫy K3 lọt khỏi kết luận. Máy còn báo nhầm "QĐ 152/2020", "QĐ 20/2026".
5. **Phần "đẳng cấp thế giới" chưa có:** vẫn một họ model (Sonnet ghế, Opus Chủ toạ), vòng 1 vẫn đọc thiên hướng người hỏi, 6/13 phiên đồng thuận tuyệt đối ngay vòng 1, **13/13 phiên cùng nhãn LÀM CÓ ĐIỀU KIỆN**, dự báo dồn vào 40–55%, chưa có lịch sử Brier, chưa có đăng nhập, nhật ký, người phụ trách thật.

**Tổng điểm: 70/120.** 8/12 tiêu chí dưới 7.

---

## 1. Chấm 12 tiêu chí

| # | Tiêu chí | Điểm |
|---|---|---|
| 1 | Khung vấn đề | 7 |
| 2 | Đa dạng phương án | 7 |
| 3 | Độc lập và đa dạng nhận thức | 5 |
| 4 | Grounding số liệu | 7 |
| 5 | Grounding pháp luật | 5 |
| 6 | Tổng hợp minh bạch, bảo vệ thiểu số | 6 |
| 7 | Hiệu chỉnh và bất định | 4 |
| 8 | Tư duy rủi ro | 7 |
| 9 | Hành động được và vòng phản hồi | 6 |
| 10 | Phù hợp nghiệp vụ ngành | 5 |
| 11 | Tin cậy, bảo mật, tuân thủ | 5 |
| 12 | Đánh giá liên tục và trải nghiệm | 6 |
| | **Tổng** | **70/120** |

### 1. Khung vấn đề: 7/10
Bằng chứng:
- Mọi `brief.md` có mục tiêu và hạn tính sẵn ("còn 35 ngày đến ngày bổ nhiệm… 74 ngày đến ngày giấy phép hết hạn", K1), định nghĩa thành công ("Thành công nghĩa là người lao động làm Giám đốc nhà máy trong khi có giấy phép đúng vị trí. Không có khoảng thời gian nào làm việc ngoài phạm vi giấy phép", K1), giả định có cách kiểm và hạn kiểm, "Chưa có số" nói rõ chỗ thiếu.
- Chủ toạ sửa khung khi người hỏi dựa vào văn bản cũ ngay trong brief K1 ("Lưu ý của Chủ toạ: Nghị định 152/2020/NĐ-CP đã bị thay thế").
- Thiếu: không ghi người ra quyết định; loại cửa chỉ có ở thẻ ghế (`DOOR`), không ở khung; 13 phiên chạy thẳng qua bộ đề, không qua vòng hỏi gốc, nên người dùng không xác nhận khung; kết luận không chấm lại khung. Khung bỏ sót câu hỏi bắt buộc của "Công cụ hỏi" trong luật ngành: K6 không hỏi vị trí công việc và ký hiệu thị thực (chính góc nhìn Chủ toạ phải nhắc), K2 không hỏi vị trí để xếp chuyên gia hay lao động kỹ thuật.

Để lên 10: khung là trường có cấu trúc (mục tiêu số + hạn, người quyết, ràng buộc, tiêu chí thành công, loại cửa, các câu "Công cụ hỏi" bắt buộc theo loại thủ tục) và người dùng bấm xác nhận trước vòng 1; kết luận có dòng "khung đã đổi gì sau tranh luận".

### 2. Đa dạng phương án: 7/10
Bằng chứng:
- Gần như mọi phiên có phương án giữ nguyên hoặc lùi (D ở K1, K2, K3, K5, K7). Chủ toạ đưa phương án do ghế nêu vào bảng `huong_ghe_neu` có xử lý và lý do: E (góp vốn để thuộc diện không cấp GPLĐ, K1), C' (e-visa rồi chuyển đổi tại chỗ khi đã có giấy phép, K2), "D có lịch" và "C mua đúng tới trần" (K3), "C giới hạn" (K7).
- Thiếu: K6 chỉ có A/B/C, không có phương án nhỏ hơn; K4 không có "không làm"; không có phương án "ngược" do máy sinh; K12 kết luận "bỏ hai trình tự thành lập theo khoản 2 Điều 19 mà ghế LS FDI đã nêu" (góc nhìn Chủ toạ tự nhận).

Để lên 10: schema `options` bắt buộc ba vai (không làm, nhỏ hơn, ngược) và máy kiểm trùng bản chất; mọi hướng ghế nêu phải có dòng xử lý.

### 3. Độc lập và đa dạng nhận thức: 5/10
Bằng chứng:
- Vòng 2 đã ẩn danh và xáo thứ tự theo từng ghế (`nhanAnDanh`, `anDanhChu` trong `app/lib/council.mjs` dòng 147–174), không kèm trọng số. Chỉ số a dua được tính và in ("Chỉ số a dua: 2/2 ghế mở đầu khác số đông đã đổi sang phương án B", K6; "Cả phòng đổi ý: 4/5 ghế", K4).
- Vòng 1 vẫn đọc nguyên văn câu hỏi có thiên hướng (`briefBlock` dòng 82–86 dán "THE FOUNDER'S BRIEF, VERBATIM") và nhãn phương án "(phương án founder nghiêng về)".
- Một họ model: `MODELS.seat = claude-sonnet-5-5`, `chair = claude-opus-5-5` (dòng 13–16).
- Lựa chọn vòng 1 dồn một phía: K1 BBBBB, K2 CCCCCC, K3 BBBBB, K7 DDDDDD, K8 DDDDD, K13 DDDDDD. Điểm vòng 1 của K1 gần như giống hệt nhau ở 5 ghế (A 3, B 8 ở 4/5 ghế). Chỉ số a dua bằng 0 ở các phiên này chỉ vì không còn ai khác số đông để đổi.

Để lên 10: bỏ thiên hướng người hỏi khỏi đề bài vòng 1, ít nhất hai họ model, ngưỡng a dua có hành động (vượt ngưỡng thì Chủ toạ phải nêu lập luận mới nào khiến đổi), đo "đồng thuận vòng 1" theo thời gian.

### 4. Grounding số liệu: 7/10
Bằng chứng:
- `kiem_so.so_lieu` gắn nhãn đề bài / tính / giả định cho mọi số, kèm phép tính ("74 ngày − 35 ngày (35 = 4 + 30 + 1; 74 = 35 + 31 + 8)", K1; "(7,5 − 6) ÷ 6 và (7,5 − 5) ÷ 5", K7). Mọi phép tính tôi kiểm đều đúng.
- Máy dò còn báo nhầm số tính đúng là "không thấy trong số liệu" (39 ngày, 08/02/2027 ở K1; 250–500 nghìn ở K7; 5/5, 6/6 ở K11), mà giao diện cùng lúc ghi "Mọi con số trong kết luận đều có nguồn" (ảnh `v5-desktop-06-cancu.png`). Hai thông điệp ngược nhau.
- Số đúng nhưng khung sai: K7 kết luận "Nhận định 'cộng tác viên rẻ nhất' không đúng: C tốn 7,5 triệu đồng mỗi tháng, A tốn 5 đến 6 triệu đồng", trong khi A còn tốn 5–6 ngày công mỗi tháng. Ngưỡng hoà vốn 250–500 nghìn đồng/ngày công thấp hơn chi phí thật của một nhân viên Hà Nội, nên trên tổng chi phí C rất có thể vẫn rẻ nhất. Chính góc nhìn Chủ toạ chỉ ra ngưỡng này sai giả định.
- Khoảng phạt "theo nguồn đối chiếu" trong não bị viết thành QUY ĐỊNH ở K10.

Để lên 10: máy dò tự kiểm phép tính ngày và số học trong trường `nguon`; giám khảo độc lập (họ model khác) đọc lại mọi số trước khi lên phiếu; 0 số "chưa nguồn" lọt phiếu khách trên bộ đề.

### 5. Grounding pháp luật: 5/10
Bằng chứng:
- Có kho nguồn theo não (`sources.md` ghi URL, ngày ban hành, hiệu lực, TÌNH TRẠNG, ngày kiểm 26/10/2026), máy kiểm số hiệu (`app/lib/kiem-luat.mjs`), lượt viết lại kết luận khi dẫn văn bản hết hiệu lực (`council.mjs` dòng 610–617, K1 có pha "Chủ toạ sửa kết luận: bỏ văn bản hết hiệu lực"). `kiem_luat_ket_luan` của 13 kết luận không còn văn bản hết hiệu lực nào.
- Mọi căn cứ có số hiệu đầy đủ và nhãn. Nhưng phần lớn là CẦN KIỂM TRA (K1: 7/8 dòng; K2: 6/8), nhiều dòng "số điều chưa xác minh". Không có đường dẫn chính thức, không có ngày kiểm trên kết luận, không trích được tới câu.
- Máy chỉ đọc số hiệu: "Luật Đầu tư 2020" ở K3 không có số nên không gắn cờ; kết luận không nói văn bản này đã hết hiệu lực dù ghế LS FDI viết rõ ở vòng 1 ("Luật 61/2020 đã hết hiệu lực, thay bằng Luật 143/2025/QH15 từ 01/03/2026 (S001)", `round-1.md` dòng 16).
- Báo nhầm: "QĐ 152/2020" (K1, do `SO_TAT` bắt "quyết định bổ nhiệm … 152/2020" là Quyết định), "QĐ 20/2026" (K12).
- Nhãn không nhất quán giữa các phiên và với não (mục 2 bên dưới).

Để lên 10: kho luật nguyên văn (điều, khoản, URL tới câu), máy kiểm nội dung điều khoản chứ không chỉ số hiệu, bí danh tên + năm ("Luật Đầu tư 2020" → 61/2020/QH14), sổ nhãn dùng chung cho mọi phiên, trích dẫn bấm được. Phần lớn việc này cần người và mạng mở (mục 6).

### 6. Tổng hợp minh bạch và bảo vệ thiểu số: 6/10
Bằng chứng:
- Điểm tính bằng mã, công thức in đủ ("B (3×8 + 3×8 + 2×8 + 2×8 + 2×8) / 12 = 8", K1); "Mức ủng hộ đề xuất 7,8/10 = (3×8 + 3×8 + 2×7 + 2×8 + 2×8) / 12: điểm ủng hộ nghị quyết ở vòng bỏ phiếu, khác điểm phương án". Có `override_note` khi Chủ toạ hạ nhãn ("Điểm số xếp B vào mức GO. Chủ toạ hạ xuống GO WITH CONDITIONS…").
- Điểm vòng 1 có trong `events.json` (`round_done`) nhưng `verdict.md` và PDF chỉ in điểm vòng cuối.
- "Ý kiến thiểu số" thường không phải thiểu số: K1 trích Tư pháp ở vòng 2, nhưng vòng 3 Tư pháp đã chấm A 3/10 như cả phòng. Không có quy tắc khi nào thiểu số hạ nhãn. Trọng số không hiệu chỉnh theo lịch sử.
- Chủ toạ phản bác chính kết luận của mình ở góc nhìn sau cùng, mà kết luận không được sửa (xem Tóm tắt, điểm 3).

Để lên 10: in cả điểm vòng 1 và vòng cuối; thiểu số lấy từ phiếu vòng 3 (Dissent hoặc điểm lệch ≥ 3); quy tắc hạ nhãn bằng mã; góc nhìn Chủ toạ chạy trước bản cuối và được gộp vào.

### 7. Hiệu chỉnh và bất định: 4/10
Bằng chứng:
- Mỗi phiên có một dự báo kiểm được, có hạn và cơ sở ("Người lao động có giấy phép lao động ghi vị trí Giám đốc nhà máy trước 09/01/2027: 50%", K1). Độ tin cậy trừ theo số "CẦN KIỂM TRA" trong thẻ (`finalNumbers`).
- 13 dự báo: 30, 40, 45 ×4, 50 ×3, 55 ×3, 65. Dồn quanh 50% nên gần như không mang thông tin. Không có khoảng giá trị. Chưa có kết quả thật nào được ghi, nên `cham-brier.mjs` chưa có dữ liệu.
- 13/13 nhãn là LÀM CÓ ĐIỀU KIỆN: nhãn không phân biệt ca dễ (K10) với ca khó (K6).

Để lên 10: 2–3 dự báo mỗi phiên, có khoảng; giao diện ghi kết quả; đường hiệu chỉnh và Brier theo ghế sau ≥ 30 dự báo đã đóng.

### 8. Tư duy rủi ro: 7/10
Bằng chứng:
- Mỗi thẻ vòng 1 có PRE-MORTEM kèm hậu quả không đảo ngược ("Hậu quả không đảo ngược: trục xuất người lao động", K1 Lao động). Ghế Tuân thủ là ghế phản biện thật, có ma trận phạt × khả năng × đảo ngược. Kết luận nêu rủi ro không đảo ngược trước ("Rủi ro không đảo ngược được, nêu trước: làm Giám đốc nhà máy khi giấy phép còn ghi vị trí chuyên gia…", K1). Tiêu chí dừng đo được, có ngày ("Hồ sơ B chưa đủ vào 13/11/2026 hoặc bị trả: lùi ngày bổ nhiệm và nộp D ngay").
- Pre-mortem chỉ cho phương án ghế chọn, không cho mọi phương án.
- Phiếu khách đánh rơi rủi ro không đảo ngược ở 11/13 phiên (mục "Rủi ro cần lưu ý" chỉ còn "Điểm dừng"), vì `ruiRoGoc` chỉ lọc trong `conditions` theo regex `LA_RUI_RO`, không lấy từ `why`. Ở K1 khách không được cảnh báo trục xuất trên giấy.
- K6 bỏ ngỏ rủi ro khai thiếu lương do công ty mẹ trả (mục 2).

Để lên 10: pre-mortem cho từng phương án; trường riêng `rui_ro_khong_dao_nguoc` bắt buộc lên phiếu khách; trần rủi ro sụp đổ áp bằng mã.

### 9. Hành động được và vòng phản hồi: 6/10
Bằng chứng:
- Có "Làm ngay", bước có ngày, "Cách thử rẻ nhất", "Dừng nếu", "Xem lại vào". Bước khá cụ thể ("13/11/2026: Nộp hồ sơ B nếu đã đủ và đã kiểm chéo", K1).
- Người thực hiện phần lớn là tên ghế AI ("Vận hành gửi văn bản…", "LS FDI lập văn bản…") hoặc "Chị phụ trách hồ sơ" (K4); không có nhân sự thật.
- "Làm ngay" lệch với bước 1: K1 "Hôm nay gửi văn bản hỏi Sở Nội vụ" nhưng bước gửi văn bản ghi 03/11/2026.
- Không có nhắc tới hạn, không có chỗ ghi kết quả thật trên giao diện, hệ thống chưa học ghế nào hay đúng.

Để lên 10: người phụ trách chọn từ danh sách nhân sự, nhắc tự động tới hạn, ô ghi kết quả và Brier theo ghế, kiểm "Làm ngay" khớp bước đầu.

### 10. Phù hợp nghiệp vụ ngành: 5/10
Bằng chứng:
- Có máy Tính hạn tốt: ngày làm việc trừ lễ âm lịch, loại "hạn lưu trú" không lùi theo ngày nghỉ (thử: 10 ngày làm việc từ 27/10/2026 ra 10/11/2026 thứ Ba, đúng; lưu trú 25 ngày ra 21/11/2026). Phiếu khách 4 ngôn ngữ. Ghế đúng nghề (Lao động, Xuất nhập cảnh, Tư pháp, FDI, Thuế, Tuân thủ, Vận hành, Khách hàng).
- Chưa có checklist hồ sơ theo thủ tục, bảng rà giấy tờ, mẫu đơn, báo giá. Văn phòng vẫn chỉ dùng được khi có "quyết định", không phải công cụ hằng ngày.
- Thứ tự thủ tục chưa được máy kiểm: K2 ghi nộp hồ sơ lao động và công văn nhập cảnh cùng hạn 10/11, K1 thiếu bước thẻ tạm trú sau GPLĐ mới.

Để lên 10: thư viện thủ tục (GPLĐ, xác nhận miễn, TRC, công văn, LLTP, GPLX, IRC/ERC, góp vốn) với checklist, tiền đề, thời hạn luật, mẫu; báo giá theo thủ tục; bảng rà giấy tờ nước ngoài (hạn, Apostille/hợp pháp hoá, dịch).

### 11. Tin cậy, bảo mật, tuân thủ: 5/10
Bằng chứng:
- `app/lib/che-du-lieu.mjs` che email, số điện thoại, số giấy tờ, ngày sinh trước khi gửi model (không che họ tên). Server chỉ nghe `127.0.0.1`. Có `xoa-phien-cu.mjs` (180 ngày, chạy tay). Phiếu khách có ô "Người duyệt", nhãn "Nội dung do AI hỗ trợ soạn, đã / chưa được người có thẩm quyền duyệt", lời miễn trừ theo gói.
- Không đăng nhập, không phân quyền, không nhật ký truy cập; phiếu tải được khi chưa ai duyệt; xoá theo hạn không tự chạy.
- Phiếu khách để lọt tên ghế AI như người thật (mục 3), có thể làm khách hiểu nhầm về người chịu trách nhiệm.

Để lên 10: đăng nhập và vai (nhân viên, luật sư duyệt), nhật ký mở và tải, khoá phiếu khi chưa duyệt, che họ tên, lịch xoá tự động, hợp đồng xử lý dữ liệu với nhà cung cấp model.

### 12. Đánh giá liên tục và trải nghiệm: 6/10
Bằng chứng:
- Bộ đề có tập học và tập kiểm tra 12 ca mới, gồm ca bẫy; máy chấm chạy lại được; 95% trên tập kiểm tra.
- Máy chấm theo từ khoá nên báo nhầm (K11 "11/09/2026" khác "11/9/2026") và không bắt được lỗi nội dung (K6 đủ 15/15 dù bỏ ngỏ thuế lương; K3 đủ 14/14 dù kết luận không nói Luật 61/2020 hết hiệu lực). Không đo nhiễu (mỗi ca chạy một lần), không có giám khảo khác họ, không có VLegal-Bench, không có ca có kết quả thật.
- Phiên đầy đủ 4–7 phút; phiên nhanh chưa được đo trên bộ đề. Phiếu khách một trang, có bản dịch tiếng Anh chạy thật trong 13–16 giây.

Để lên 10: chạy 3 lần mỗi ca để đo nhiễu; giám khảo LLM khác họ chấm "lời khuyên khiến khách vi phạm"; ca có kết quả thật; báo cáo phân bố nhãn, a dua, tỉ lệ trích dẫn sai mỗi lần đổi prompt; phiên nhanh dưới 3 phút.

---

## 2. Kiểm tra pháp lý

Mức: **SAI** (khẳng định trái luật hoặc trái não), **RỦI RO** (có thể khiến khách vi phạm, bỏ sót nghĩa vụ hoặc khẳng định chắc không có căn cứ), **NHẸ**. "Lên phiếu" nghĩa là nội dung đi vào phiếu gửi khách.

| # | Phiên | Mức | Chỗ trong kết luận | Vấn đề | Đối chiếu não |
|---|---|---|---|---|---|
| 1 | K6 | RỦI RO cao | "Chưa kết luận về phần lương công ty mẹ trả cho đến khi có thoả thuận cử nhân sự và hoá đơn nội bộ" (điều kiện 4); "Dừng nếu… Trường hợp 2… chuyển sang khai theo diện không cư trú cho thu nhập phát sinh tại Việt Nam, gồm tiền nhà và phụ cấp" | Không nói phần lương trả cho thời gian làm việc tại Việt Nam là thu nhập phát sinh tại Việt Nam, chịu thuế theo luật nội địa dù trả từ Singapore; chỉ Hiệp định (nếu đủ điều kiện, không recharge) mới có thể miễn. Văn phòng làm theo phiếu có thể chỉ khai tiền nhà, phụ cấp, tức khai thiếu. Phiếu khách còn cắt mất câu hành động của "Trường hợp 2" | Thuế `positions.md` mục 1: "Có, với thu nhập phát sinh tại Việt Nam… QUY ĐỊNH (S001)" |
| 2 | K3 | RỦI RO cao (bẫy lọt một nửa) | Kết luận chỉ nói "Nhận định của nhân viên… không đứng vững với ngành có điều kiện" | Không nói thẳng Luật Đầu tư 61/2020/QH14 đã hết hiệu lực từ 01/3/2026, thay bằng Luật 143/2025/QH15, dù ghế LS FDI viết ở vòng 1 và góc nhìn Chủ toạ đòi thêm. Nhân viên tiếp tục tra văn bản cũ | FDI S001, S002 |
| 3 | K3 | RỦI RO | "Tiền thanh toán chuyển nhượng vốn chỉ đi qua tài khoản vốn đầu tư trực tiếp… (Thông tư 38/2026/TT-NHNN (số điều chưa xác minh)): QUY ĐỊNH" (lên phiếu) | Nhãn QUY ĐỊNH khi số điều và cơ chế (tài khoản của doanh nghiệp mục tiêu, khấu trừ thuế) chưa xác minh; chính góc nhìn Chủ toạ đòi CẦN KIỂM TRA. Bảng tra trần chỉ dẫn Phụ lục I NĐ 96/2026, bỏ danh mục ngành có điều kiện của Luật 143/2025/QH15 | FDI S019, frameworks 6 |
| 4 | K2 | RỦI RO | Điều kiện 5: "Đến hết 10/11/2026 phải nộp đủ hồ sơ lao động và hồ sơ công văn nhập cảnh" | Đọc như hai hồ sơ song song; thực tế thị thực ký hiệu lao động cần GPLĐ hoặc xác nhận không thuộc diện trước. "Thời hạn theo luật cộng dồn là 15 ngày làm việc" lấy con số 5 ngày của thẻ tạm trú cho công văn, chưa tính bước nhận thị thực. Không xếp kỹ sư vào chuyên gia hay lao động kỹ thuật (Điều 3 NĐ 219/2025) | Lao động S002 frameworks 1, 2; XNC frameworks 4 |
| 5 | K1 | RỦI RO | Điều kiện 3 "Có văn bản trả lời của Sở Nội vụ trước 03/11/2026" (lên phiếu) | Gắn kế hoạch của khách vào thời gian trả lời của cơ quan (tinh thần luật ngành 9); chính góc nhìn Chủ toạ đề nghị bỏ. Thiếu bước cấp thẻ tạm trú mới theo giấy phép mới. Mốc hộ chiếu 08/02/2027 chỉ đúng cho phương án dự phòng D | XNC frameworks (TRC theo giấy tờ gốc) |
| 6 | K1 | NHẸ | "Làm sai nội dung giấy phép: công ty bị phạt 5 đến 10 triệu đồng mỗi người, người lao động bị phạt 15 đến 25 triệu đồng và có thể bị trục xuất" (CẦN KIỂM TRA) | Trộn hai hành vi: 15–25 triệu và trục xuất là mức cho làm việc không có giấy phép; 5–10 triệu là mức sai nội dung | Lao động frameworks 5 |
| 7 | K9 | RỦI RO | "Chồng, vợ của người bảo lãnh thuộc diện ngoại lệ được chuyển đổi mục đích thị thực tại Việt Nam (khoản 4 Điều 7): QUY ĐỊNH" (lên phiếu) | Khách vào bằng miễn thị thực 45 ngày. Việc áp ngoại lệ cho người miễn thị thực và sửa đổi của Luật 118/2025/QH15 là CẦN KIỂM TRA (góc nhìn Chủ toạ nói rõ). Kết luận cũng bỏ: thẻ TT tối đa 3 năm, ngắn hơn hộ chiếu ít nhất 30 ngày; thường trú do Bộ trưởng Bộ Công an quyết, xem xét 4 tháng. Đặt "ghi chú kết hôn" làm cổng bắt buộc không có căn cứ | XNC frameworks (TT 3 năm, thường trú 4 tháng) |
| 8 | K7 | RỦI RO (kinh doanh) | "Nhận định 'cộng tác viên rẻ nhất' không đúng: C tốn 7,5 triệu, A tốn 5 đến 6 triệu" | Bỏ 5–6 ngày công của A khỏi so sánh; ngưỡng hoà vốn giả định C thay hết chuyến. Không đòi hợp đồng xử lý dữ liệu với cộng tác viên (Luật 91/2025/QH15, NĐ 356/2025/NĐ-CP) dù đó là điều kiện để C hợp pháp. "Hồ sơ thẻ tạm trú do cơ quan bảo lãnh nộp (Điều 37): QUY ĐỊNH" vượt nội dung não | Vận hành positions 9 |
| 9 | K10 | RỦI RO nhẹ | "Quá hạn tạm trú bị xử phạt theo bậc, khoảng 0,5 đến 40 triệu đồng (NĐ 282/2025, Điều 21): QUY ĐỊNH" (lên phiếu) | Não ghi "theo nguồn đối chiếu"; K7, K9 cùng ngày ghi CẦN KIỂM TRA. Ngược lại, mốc "giấy tờ cư trú còn hạn từ 90 ngày" não có từ TT 108/2026 nhưng kết luận rào CẦN KIỂM TRA. Không nêu nơi nộp (Phòng Cảnh sát giao thông Công an tỉnh) | Tuân thủ frameworks; Tư pháp S025 |
| 10 | K8 | RỦI RO nhẹ | Điều kiện 4 "Chỉ chia lợi nhuận sau quyết toán 2026 và sau khi bù hết lỗ" | Viết như quy định, không nhãn; căn cứ (TT 186/2010/TT-BTC) não ghi CẦN KIỂM TRA hiệu lực. Không ước lợi nhuận sau thuế (2 tỷ × (1 − 20%) = 1,6 tỷ nếu thuế suất 20%) | Thuế S022, FDI S023 |
| 11 | K4 | NHẸ | "Nhập cảnh theo diện miễn thị thực song phương hoặc e-visa" cho khách Trung Quốc; căn cứ thị thực ghi "Luật 23/2023/QH15" | Không thấy căn cứ miễn thị thực cho hộ chiếu phổ thông Trung Quốc trong não; dẫn luật sửa đổi thay vì luật gốc. Kết luận thiếu bước xác thực Phiếu để dùng ở Canada và cách nhận Phiếu khi khách ở nước ngoài | XNC positions 5 |
| 12 | K11 | NHẸ | Điều kiện 6 "Không dùng… tin Lãnh sự quán Thượng Hải ngừng nhận hợp pháp hoá làm căn cứ" | Rào thừa: não Tư pháp có S015 | Tư pháp S015 |

Không thấy: viện dẫn văn bản hết hiệu lực làm căn cứ trong kết luận, cam kết kết quả, hứa thời gian cơ quan, lời khuyên khai sai mục đích, sai ngày tháng.

---

## 3. Đóng vai CEO: dùng ngay được với khách không?

| Phiên | Kết luận (nội bộ) | Phiếu khách | Lý do |
|---|---|---|---|
| K1 GPLĐ đổi vị trí | Dùng ngay, thêm bước thẻ tạm trú | **Không gửi nguyên trạng** | Phiếu mất "Nộp hồ sơ B", không cảnh báo trục xuất, có điều kiện "Sở Nội vụ trả lời trước 03/11" |
| K2 kỹ sư Đức 75 ngày | Dùng được sau khi sửa thứ tự GPLĐ → công văn | Sửa rồi gửi | Phiếu ghi tên ghế "Vận hành", "Lao động", "Thuế" như người làm |
| K3 mua 60% vốn | Dùng được sau khi thêm câu "Luật 61/2020/QH14 hết hiệu lực" và tra Luật 143/2025 | Sửa rồi gửi | Nhãn QUY ĐỊNH cho TT 38/2026; "LS FDI lập văn bản" |
| K4 LLTP | Dùng được làm khung; cân nhắc chi phí bay của khách | Sửa rồi gửi | Thiếu bước xác thực cho Canada, "Chị phụ trách hồ sơ" |
| K5 hộ chiếu gấp | **Dùng ngay** | **Gửi được** | Không hứa ngày bay, có ngày chốt dời vé, báo giá ba dòng |
| K6 TNCN | **Không dùng** trước khi luật sư thuế bổ sung nghĩa vụ phần lương | **Không gửi** | Có thể dẫn tới khai thiếu |
| K7 Bắc Ninh | Dùng phần quy tắc hộ chiếu gốc; tính lại chi phí | Không dùng (nội bộ) | Kết luận về chi phí sai khung |
| K8 lợi nhuận | Dùng được với đại lý thuế | Sửa nhãn rồi gửi | Điều kiện bù lỗ không nhãn |
| K9 kết hôn | Dùng sau khi luật sư xác nhận chuyển đổi tại chỗ cho người miễn thị thực | Sửa rồi gửi | QUY ĐỊNH chưa đủ căn cứ, thiếu thông tin thường trú |
| K10 GPLX | **Dùng ngay** | Gửi được sau khi sửa nhãn phạt | Đơn giản, an toàn: chờ thẻ mới, thuê tài xế |
| K11 Apostille | **Dùng ngay** | Gửi được | Dừng gửi bằng, chốt theo nước |
| K12 VPĐD | **Dùng ngay** | Sửa rồi gửi | Tên ghế "Tư pháp và Tuân thủ" trong bước |

Nhận xét của CEO: tôi sẽ để hội đồng chuẩn bị nội bộ, còn mọi phiếu phải qua một người sửa tay trước khi gửi. Ba việc khiến tôi chưa tin để gửi thẳng: (1) phiếu có thể mất đúng câu quan trọng nhất; (2) phiếu không cảnh báo trục xuất; (3) phiếu ghi tên vai AI như nhân viên của tôi. Kết luận nội bộ thì tốt hơn bản nháp của một chuyên viên 1–2 năm kinh nghiệm ở 9/12 ca.

---

## 4. Giao diện

Script: `/tmp/claude-0/-home-user-chi-cuong/2796b2d7-6ba6-5fa2-9ccb-a3f6ce54f304/scratchpad/v5.js` (Playwright, `chromium.launch()`), phát lại K1 (`2026-10-27-mvpql3i6`) ở 1440×900 và 390×844. Ảnh trong `/tmp/claude-0/-home-user-chi-cuong/2796b2d7-6ba6-5fa2-9ccb-a3f6ce54f304/scratchpad/shots/v5-*.png`; PDF: `v5-ketluan.pdf` (4 trang), `v5-phieu-vi.pdf`, `v5-phieu-en.pdf` (dịch AI thật, 13–16 giây), ảnh trang `v5-ketluan-1..4.png`, `v5-phieu-vi-1.png`, `v5-phieu-en-1.png`. Không có lỗi JavaScript trên console. Không bấm "Gửi câu hỏi".

Tốt:
- Phát lại, tua nhanh, kết luận tự mở; "Làm ngay" và "Đường chính" đứng đầu; "Căn cứ pháp lý chính" có nhãn từng dòng; "Góc nhìn Chủ toạ" là khối riêng có nhãn "ĐỒNG Ý CÓ ĐIỀU KIỆN"; mobile gập mục gọn, chữ đủ lớn.
- Thẻ ghế có ba tab Mở đầu / Tranh luận / Bỏ phiếu, nhãn trường tiếng Việt, lời miễn trừ.
- Tính hạn đúng (10/11/2026; 21/11/2026), có loại "hạn lưu trú" không lùi.
- Phiếu tiếng Anh giữ số hiệu văn bản, kèm thuật ngữ Việt trong ngoặc, ghi "Reference translation; the Vietnamese version is the original".

Lỗi:
1. **PDF kết luận thiếu mục cốt lõi**: không có "Căn cứ pháp lý chính", "Điều kiện", "Dự báo", "Kiểm điều luật"; "Việc làm tiếp theo" chỉ in 3/6 bước, "Vì sao" 3/5 (`app/public/pdf.js` dòng 295, 344–350 cắt `slice(0, 3)`).
2. Bảng "Từng thành viên chấm điểm" trong PDF: tên "Chuyên viên Tư pháp – Hành chính" đè lên cột trọng số ("Hành chính2"), trang 3.
3. PDF trang 1 mở bằng "Số dùng trong kết luận" với "39 ngày… không thấy trong số liệu": số đúng mà bị gắn cờ, đặt ngay trang đầu.
4. Trên trang, "Số dùng trong kết luận" ghi "Mọi con số trong kết luận đều có nguồn." rồi liệt kê ba số màu cam "không thấy trong số liệu".
5. Phiếu khách: mất hành động chính, mất rủi ro không đảo ngược, tên ghế như người thật, câu cụt (mục 3, mục 5 việc 2).
6. Phiếu EN lặp dòng "Reference translation… · Bản dịch tham khảo…" dưới mỗi tiêu đề (7 lần), tốn chỗ trên một trang.
7. Thẻ ghế hiện chip "Tính hạn từ 27/10/2026: 30 ngày, hạn lưu trú" lấy từ câu "hộ chiếu dài hơn thẻ 30 ngày": nhận nhầm.
8. Chữ tiếng Anh "founder" trong nhãn phương án ("phương án founder nghiêng về") và trong PDF.
9. Thanh trên desktop: "Phiên này: 22 lượt gọi · 688 nghìn token" xuống dòng và bị cắt.
10. Tính hạn lưu trú in hai câu gần giống nhau liền nhau.

---

## 5. Tổng điểm và việc sửa

**Tổng: 70/120.** Mạnh: khung (7), phương án (7), số liệu (7), rủi ro (7). Yếu nhất: hiệu chỉnh (4), độc lập (5), pháp luật (5), nghiệp vụ (5), bảo mật (5).

### Việc sửa được bằng mã, xếp theo tác động

| Hạng | Việc | File | Cách sửa | Tiêu chí |
|---|---|---|---|---|
| 1 | Gộp góc nhìn Chủ toạ vào kết luận trước khi phát hành | `app/lib/council.mjs` (`run`: sau `chairVerdict` dòng ~608, `addChairView`) | Chạy góc nhìn Chủ toạ ngay sau bản kết luận đầu; nếu `lech` không rỗng thì gọi `chairVerdict` lần hai với "SỬA THEO CÁC ĐIỂM LỆCH: …" (như lượt sửa văn bản hết hiệu lực). Lưu cả hai bản, giao diện chỉ hiện bản sửa và danh sách điểm đã sửa | 5, 6, 8 |
| 2 | Phiếu khách không được xoá hành động và phải có rủi ro không đảo ngược | `app/public/pdf.js` (`choKhach`, `NOI_BO_CAU` dòng 382, `noiDungPhieuKhach` dòng 413–466), `app/lib/council.mjs` (schema kết luận) | Thay lọc cả câu bằng thay cụm ("và đã kiểm chéo" → "", "người phụ trách và người kiểm chéo" → "người phụ trách"); không bao giờ bỏ câu chứa động từ nộp/ký/thanh toán/xuất cảnh. Thêm trường schema `rui_ro_khong_dao_nguoc` và `phieu_khach.buoc` do Chủ toạ viết riêng cho khách; mục "Rủi ro" luôn in dòng này đầu tiên. Không cắt "Dừng nếu" giữa chừng: cắt theo từng trường hợp đầy đủ | 8, 11, 9 |
| 3 | Thay tên ghế bằng vai người thật trên phiếu | `app/public/pdf.js` (`choKhach`, `boTenGhe`) | Thay mọi tên ghế đứng đầu câu ("Vận hành gửi…", "LS FDI lập…", "Tư pháp và Tuân thủ đối chiếu…") bằng "Văn phòng" hoặc tên nhân sự trong `.env`; thêm test với 13 phiên này | 11, 9 |
| 4 | PDF kết luận đủ mục | `app/public/pdf.js` (`downloadVerdictPdf` dòng 132–400) | Thêm "Căn cứ pháp lý chính" (có nhãn), "Điều kiện", "Dự báo", "Kiểm điều luật"; in đủ mọi bước; sửa độ rộng cột tên trong bảng thành viên (xuống dòng thay vì đè) | 5, 12 |
| 5 | Máy kiểm luật bắt tên + năm và bớt báo nhầm | `app/lib/kiem-luat.mjs` (`SO_TAT` dòng 15, `kiemLuat`), các `sources.md` | Thêm cột bí danh trong nguồn ("Luật Đầu tư 2020", "Nghị định năm 2020 về người lao động nước ngoài") và dò bí danh; với "Quyết định" chỉ bắt khi có "số" hoặc hậu tố QĐ-; bỏ dạng viết tắt khi cùng số/năm đã có ở dạng đầy đủ khác loại. Thêm kiểm câu hỏi người dùng theo bí danh để kích hoạt `nguoiHoiDungLuatCu` (bẫy K3) | 5 |
| 6 | Sổ nhãn dùng chung và hậu kiểm nhãn | `app/lib/council.mjs` (`chairVerdict`, `luatNganh`), file mới `app/lib/so-nhan.mjs` | Trích từ `positions.md`/`frameworks.md` các sự kiện có nhãn (QUY ĐỊNH, "theo nguồn đối chiếu" = CẦN KIỂM TRA) thành bảng; đưa vào prompt kết luận; sau kết luận, `can_cu` nào ghi QUY ĐỊNH mà "số điều chưa xác minh" hoặc não ghi "theo nguồn đối chiếu" thì tự hạ CẦN KIỂM TRA và không lên mục "Điều kiện chính" của phiếu | 5, 4 |
| 7 | Máy kiểm thứ tự thủ tục | file mới `app/lib/thu-tu.mjs`, gọi trong `council.mjs` sau kết luận | Ma trận tiền đề: GPLĐ/xác nhận → công văn LĐ → thị thực → TRC; GPLĐ mới → TRC mới; đăng ký góp vốn → thanh toán → thay đổi thành viên; IRC/ERC. Gắn cờ khi bước sau có ngày ≤ bước trước hoặc thiếu bước kéo theo (K1 thiếu TRC, K2 "song song") và đưa cờ vào lượt sửa ở việc 1 | 10, 8 |
| 8 | Máy dò số tự kiểm phép tính | `app/lib/luat-so.mjs` (`kiemSo`), `app/public/app.js` (khối "Số dùng") | Nếu `nguon` có phép tính (cộng, trừ, nhân, chia, cộng ngày) thì tính lại; khớp thì "co_nguon (tính)". Sửa câu tiêu đề: chỉ ghi "Mọi con số đều có nguồn" khi không còn số cam; không in khối này ở đầu PDF | 4, 12 |
| 9 | Bỏ thiên hướng người hỏi khỏi vòng 1, thêm họ model | `app/lib/council.mjs` (`briefBlock` dòng 82–86, `round1Prompt`), `app/lib/anthropic.mjs` | Đề bài cho ghế: bỏ "THE FOUNDER'S BRIEF, VERBATIM" và nhãn "(phương án founder nghiêng về)", giữ số liệu; Chủ toạ vẫn thấy. Cho 1–2 ghế chạy model họ khác qua biến môi trường. Thêm chỉ số "đồng thuận vòng 1" vào kết luận | 3 |
| 10 | Khung bắt buộc theo "Công cụ hỏi" | `app/lib/hoi-goc.mjs`, `app/lib/council.mjs` (setup) | Mỗi loại thủ tục có danh sách câu bắt buộc (vị trí công việc, ký hiệu và hạn thị thực, hạn hộ chiếu, vốn góp); thiếu thì ghi "Chưa có số" vào khung và đưa vào "Cần xác nhận"; schema khung có người quyết và loại cửa; người dùng bấm xác nhận khung | 1 |
| 11 | Vòng phản hồi thật | `app/lib/phieu.mjs`, `app/scripts/cham-brier.mjs`, `app/public/app.js`, `.env` (`NHAN_SU`) | Người phụ trách chọn từ danh sách nhân sự; nhắc tới ngày "Xem lại vào"; nút ghi kết quả dự báo; 2–3 dự báo mỗi phiên có khoảng; trang Brier theo ghế. Kiểm "Làm ngay" khớp bước có ngày sớm nhất | 7, 9 |
| 12 | Máy chấm bộ đề bớt báo nhầm, đo nhiễu | `app/scripts/chay-bo-de.mjs` | Chuẩn hoá ngày (11/09 = 11/9) và số; chấm theo trường (căn cứ, điều kiện, phiếu khách); chạy 3 lần mỗi ca; báo cáo phân bố nhãn (13/13 cùng nhãn là cờ), a dua, số "chưa nguồn" và tên ghế lọt phiếu; thêm giám khảo họ khác chấm "lời khuyên có thể khiến khách vi phạm" (bắt K6) | 12, 3 |
| 13 | Trích dẫn bấm được | `app/lib/council.mjs` (lưu `can_cu`), `app/public/app.js`, `app/public/pdf.js` | Gắn URL và ngày kiểm từ `sources.md` vào từng `can_cu` theo số hiệu (đã có `chiMucLuat`); hiện link và "kiểm ngày 26/10/2026" | 5 |
| 14 | Bảo mật tối thiểu | `app/server.mjs`, `app/lib/che-du-lieu.mjs` | Mật khẩu hoặc token; nhật ký mở, tải; chỉ cho tải phiếu khi đã đánh dấu "đã duyệt" và có tên người duyệt; che họ tên theo mẫu; lịch xoá tự động | 11 |
| 15 | Sửa lặt vặt giao diện | `app/public/app.js`, `app/public/pdf.js` | Bỏ "founder" trong nhãn hiển thị; dòng "Reference translation" chỉ in một lần ở đầu phiếu; không gợi ý "hạn lưu trú" từ câu "30 ngày" về hộ chiếu; rút gọn chữ usage trên thanh trên; bỏ câu lặp trong Tính hạn | 12 |

### Việc cần NGƯỜI (mã không thay được)

1. **Luật sư đọc nguyên văn và ký xác nhận** các điểm đang CẦN KIỂM TRA mà nhiều phiên dựa vào: NĐ 219/2025/NĐ-CP (gia hạn một lần, cấp mới hay cấp lại khi đổi vị trí, nhóm dưới 90 ngày và việc xin xác nhận, thời hạn 10 ngày làm việc, điều khoản chuyển tiếp cho giấy phép theo NĐ 152/2020); NĐ 283/2026/NĐ-CP Điều 13 (mức phạt theo hành vi); NĐ 282/2025/NĐ-CP Điều 21 (khung phạt quá hạn); TT 38/2026/TT-NHNN (tài khoản và chứng từ chuyển nhượng vốn, chuyển lợi nhuận); Luật 107/2025/QH15 (uỷ quyền Phiếu số 2, nơi nộp cho người đã rời Việt Nam); TT 108/2026/TT-BCA Điều 24; NĐ 293/2026/NĐ-CP (chuyển tiếp); Luật 109/2025/QH15 Điều 9 (điều kiện nhà thuê); TT 186/2010/TT-BTC (còn hiệu lực không); chuyển đổi mục đích cho người vào bằng miễn thị thực sau Luật 118/2025/QH15. Đây là việc nâng tiêu chí 5 nhiều nhất.
2. **Mạng mở tới vbpl.vn, congbao.chinhphu.vn, vanban.chinhphu.vn, dichvucong.gov.vn** để dựng kho luật nguyên văn theo điều, khoản, có URL tới câu, thay cho não dựng từ tìm kiếm web và nguồn thứ cấp.
3. **Bảng quan hệ Apostille (HCCH)** cho các nước khách thường gặp (Trung Quốc, Hàn Quốc, Nhật Bản, Canada, Đức), có ngày hiệu lực và phản đối, do người kiểm và đóng dấu ngày.
4. **Đáp án bộ đề do luật sư viết** và **ít nhất 5–10 ca có kết quả thật** của văn phòng để chấm Brier và hiệu chỉnh.
5. **Văn phòng ghi kết quả thật** của dự báo và quyết định sau mỗi phiên (tiêu chí 7, 9 không lên được nếu không có dữ liệu này).
6. **Danh sách nhân sự và quy trình duyệt** (ai được ký "Người duyệt", ai nhận việc).
7. **Lịch nghỉ lễ chính thức 2027** khi Thủ tướng công bố, khai vào `nghi-le.json`.
8. **Mua hoặc duyệt tài khoản model họ khác** (cho ghế thứ hai và giám khảo độc lập).
9. **Pháp chế dữ liệu**: hợp đồng xử lý dữ liệu với nhà cung cấp model, đánh giá tác động theo Luật 91/2025/QH15, thông báo cho khách.

---

## 6. Ghi chú về điểm tự động

95% trên tập kiểm tra là tín hiệu tốt rằng kết luận nhắc đúng các điểm then chốt, nhưng không đo được: (a) điều kết luận **không** nói (K3 bỏ câu Luật 61/2020; K6 bỏ nghĩa vụ phần lương), (b) chất lượng phiếu khách, (c) nhãn đúng hay sai. Ít nhất 2 trong 9 điểm thiếu là máy chấm báo nhầm (K11 định dạng ngày; K5 "trực tuyến" có trong nhãn phương án). Điểm tự động nên đi kèm một giám khảo đọc nội dung.

---

## 7. So với vòng 1 và 2

Vòng 1: 61/120 (4 phiên cũ). Vòng 2: 68/120 (4 phiên, cùng 4 đề đã dùng để sửa). Vòng 3: **70/120** trên 12 ca mới chưa dùng để sửa, nên điểm này khó hơn và đáng tin hơn hai vòng trước.

| # | Tiêu chí | Vòng 1 | Vòng 2 | Vòng 3 | Thay đổi so với vòng 2 |
|---|---|---|---|---|---|
| 1 | Khung vấn đề | 7 | 7 | 7 | = |
| 2 | Đa dạng phương án | 5 | 7 | 7 | = |
| 3 | Độc lập | 4 | 4 | 5 | +1 |
| 4 | Grounding số | 6 | 7 | 7 | = |
| 5 | Grounding pháp luật | 4 | 5 | 5 | = |
| 6 | Tổng hợp minh bạch | 7 | 6 | 6 | = |
| 7 | Hiệu chỉnh | 2 | 4 | 4 | = |
| 8 | Rủi ro | 8 | 8 | 7 | −1 |
| 9 | Hành động | 6 | 6 | 6 | = |
| 10 | Nghiệp vụ | 4 | 5 | 5 | = |
| 11 | Tuân thủ | 4 | 5 | 5 | = |
| 12 | Đánh giá, trải nghiệm | 4 | 4 | 6 | +2 |
| | **Tổng** | **61** | **68** | **70** | **+2** |

### Đã sửa thật (thấy trong phiên hoặc giao diện)
- **Ngày "hôm nay" theo giờ Việt Nam** (việc 1 vòng 2): `homNayDong` đưa ngày phiên vào mọi prompt; 13 phiên tính ngày đúng, phiếu và PDF cùng ngày 27/10/2026.
- **Ẩn danh thẻ vòng 2** (việc 4 vòng 2, phần ẩn danh): đã có nhãn "Ghế N" xáo theo từng ghế.
- **Kiểm luật đề bài và câu hỏi** (việc 3 vòng 2): `kiemDeBai`, `kiemCauHoi`, `nguoiHoiDungLuatCu`; bẫy NĐ 152/2020 ở K1 được sửa thẳng trong kết luận.
- **Văn bản đã xác nhận còn hiệu lực không bị rào hiệu lực** (việc 5 vòng 2): `daXacNhan`; rào thừa "CẦN KIỂM TRA hiệu lực" gần như hết, chỉ còn ở số điều, mức phạt.
- **Góc nhìn Chủ toạ có cờ bất đồng** (việc 6 vòng 2, một nửa): có băng "Chủ toạ không đồng ý ở N điểm"; nhưng chưa gộp vào kết luận.
- **"Làm ngay" và "Đường chính"** (việc 7 vòng 2): có trên trang, PDF, phiếu.
- **Tính hạn lưu trú không lùi theo ngày nghỉ, chip tính hạn trong thẻ ghế** (việc 9 vòng 2).
- **Chi phí theo phiên** (việc 12 vòng 2): "Phiên này: 22 lượt gọi · 688 nghìn token".
- **Phiếu khách đa ngôn ngữ** (việc 13 vòng 2): vi, en, zh, ko, dịch AI chạy thật.
- **Chỉ số a dua có thêm "cả phòng đổi ý"** (việc 14 vòng 2).
- **Hạn lưu và lệnh xoá phiên cũ** (việc 15 vòng 2, một phần).
- **Bộ đề mới 12 ca chưa dùng để sửa, có ca bẫy** (việc 11 vòng 2, một phần): lý do chính tiêu chí 12 lên 6.

### Chưa sửa hoặc mới sửa một nửa
- Thiên hướng người hỏi vẫn vào vòng 1; vẫn một họ model.
- Người phụ trách thật và nhắc hạn (việc 10 vòng 2): chưa; bước vẫn mang tên ghế.
- Máy dò số báo nhầm (việc 8 vòng 2): còn, nay lại mâu thuẫn với dòng "mọi con số đều có nguồn".
- Bảo mật (việc 15 vòng 2): chưa có đăng nhập, nhật ký, khoá phiếu chưa duyệt.
- Đáp án luật sư, ca có kết quả thật, đo nhiễu, giám khảo khác họ: chưa.
- Máy kiểm nội dung điều khoản: chưa; máy vẫn chỉ đọc số hiệu.

### Lỗi mới hoặc lộ ra ở vòng này
- **Lọc câu nội bộ trên phiếu khách xoá mất hành động chính** (hệ quả của việc 2 vòng 2 "lọc bước có từ nội bộ… kiểm chéo"): K1 mất "Nộp hồ sơ B", K7 câu cụt. Đây là lý do chính tiêu chí 8 giảm 1.
- **Phiếu khách bỏ rủi ro không đảo ngược** ở 11/13 phiên và **để lọt tên ghế AI** như người làm việc.
- **PDF kết luận không có căn cứ pháp lý, điều kiện, dự báo.**
- **Bẫy văn bản cũ không số hiệu** ("Luật Đầu tư 2020") lọt qua máy kiểm, kết luận không sửa căn cứ cho người hỏi.
- **Nhãn của cùng một khung phạt khác nhau giữa các phiên** chạy cùng ngày.
- **13/13 phiên cùng nhãn LÀM CÓ ĐIỀU KIỆN**, dự báo dồn 40–55%: nhãn và xác suất chưa phân biệt được ca dễ, ca khó.
