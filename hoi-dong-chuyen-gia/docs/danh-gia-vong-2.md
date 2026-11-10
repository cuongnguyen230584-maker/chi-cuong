# Đánh giá vòng 2: gói ngành `phap-ly-nnn`

Người đánh giá: độc lập, chấm khắt khe theo rubric 12 tiêu chí ở `docs/nghien-cuu-the-gioi.md` mục 4. Chỉ cho 9–10 khi gần đúng mô tả mức 10. Phần chấm điểm làm xong trước khi đọc `docs/danh-gia-vong-1.md`. Mục "So với vòng 1" viết sau.

Bốn phiên thật được chấm (đều chế độ đầy đủ, chạy qua `app/scripts/chay-bo-de.mjs` lúc 18:51–19:15 UTC ngày 26/10/2026, tức 01:51–02:15 ngày 27/10 giờ Việt Nam):

| Mã | Thư mục | Ghế | Kết luận | Thời gian |
|---|---|---|---|---|
| Q1 | `sessions/2026-10-27-mvpm4op2-giu-cu-tru-hop-phap-cho-giam-doc-han-quo` | 5 | LÀM CÓ ĐIỀU KIỆN, D (đường nhà đầu tư), nộp A trước | 5:08 |
| Q2 | `sessions/2026-10-27-mvpmbg90-chon-lo-trinh-phap-ly-mo-cong-ty-fdi` | 7 | LÀM CÓ ĐIỀU KIỆN, A (A1: IRC trước) | 6:44 |
| Q3 | `sessions/2026-10-27-mvpmk5bw-xu-ly-khach-qua-han-tam-tru-25-ngay` | 6 | LÀM CÓ ĐIỀU KIỆN, A (trình diện, nộp phạt, xuất cảnh) | 5:37 |
| Q4 | `sessions/2026-10-27-mvpmrk4v-goi-gpld-kem-the-tam-tru-co-hoan-tien` | 7 | LÀM CÓ ĐIỀU KIỆN, D (thí điểm hoàn phí dịch vụ) | 5:47 |

---

## Tóm tắt điều hành

1. **Nội dung pháp lý đã lên một bậc rõ rệt.** Cả bốn phiên đi đúng nhánh nghề: Q1 tách "gia hạn chỉ mua ngày ở" khỏi "quyền điều hành" và đưa đường ĐT3 cùng xác nhận không thuộc diện cấp GPLĐ; Q2 đưa nhánh "thành lập trước, đầu tư sau" theo Luật 143/2025/QH15; Q3 hỏi vị trí công việc trước khi hứa đường quay lại; Q4 coi hoàn phí là thoả thuận dân sự và không còn nêu hình sự. Không phiên nào khuyên khách khai sai hay lách luật.
2. **Lỗi nguy hiểm nhất bây giờ là ngày tháng, không phải luật.** Hệ thống không đưa "hôm nay theo giờ Việt Nam" vào prompt. Phiên chạy ngày 27/10 (giờ VN, như tiêu đề kết luận ghi) nhưng thân kết luận tính mọi mốc từ "Hôm nay, 26/10/2026". Q1 tính ngày hết hạn thị thực 15/11, Q3 tính "còn 5 ngày tới ngưỡng 30 ngày quá hạn", cả hai lệch một ngày. Phiếu khách còn in ngày 26/10 trong khi PDF kết luận in 27/10. Với ca quá hạn tạm trú, lệch một ngày là lệch bậc phạt.
3. **Máy kiểm điều luật chạy đúng ở mức số hiệu nhưng phát sinh nhiễu mới cho khách.** Đề bài do Chủ toạ soạn ở Q2 dẫn Nghị định 09/2018/NĐ-CP (đã bị thay bằng Nghị định 342/2026/NĐ-CP); đề bài không bị kiểm, nên cờ "hết hiệu lực" rơi xuống mục "Kiểm điều luật" của kết luận và cả **phiếu gửi khách**, dù kết luận không dùng văn bản đó.
4. **Rào quá tay và quá dài.** Kết luận dài 3.187–4.059 từ (dài hơn vòng 1), "CẦN KIỂM TRA" lặp 16–28 lần mỗi phiên, kể cả cho văn bản mà não và máy kiểm đã xác nhận còn hiệu lực ("Nghị định 283/2026/NĐ-CP… CẦN KIỂM TRA số hiệu, hiệu lực", Q3). Góc nhìn Chủ toạ ở Q2 còn phản bác chính kết luận ("Kết luận còn rào thừa ở ngưỡng 3 tỷ đồng", "Nên xoá: bước xin văn bản của cơ quan cấp phép lao động") mà giao diện không đánh dấu là bất đồng.
5. **Phần "đẳng cấp thế giới" vẫn chưa có:** vòng 2 chưa ẩn danh, vòng 1 vẫn thấy thiên hướng người hỏi, một họ model, một dự báo mỗi phiên, không có lịch sử hiệu chỉnh, bộ đề chuẩn chỉ là 4 ca đã dùng để sửa (98% là điểm trên tập huấn luyện), không có phân quyền, nhật ký, hạn lưu.

**Tổng điểm: 68/120** (vòng 1: 61). 7/12 tiêu chí vẫn dưới 7.

---

## 1. Chấm 12 tiêu chí

| # | Tiêu chí | Điểm |
|---|---|---|
| 1 | Khung vấn đề | 7 |
| 2 | Đa dạng phương án | 7 |
| 3 | Độc lập và đa dạng nhận thức | 4 |
| 4 | Grounding số liệu | 7 |
| 5 | Grounding pháp luật | 5 |
| 6 | Tổng hợp minh bạch, bảo vệ thiểu số | 6 |
| 7 | Hiệu chỉnh và bất định | 4 |
| 8 | Tư duy rủi ro | 8 |
| 9 | Hành động được và vòng phản hồi | 6 |
| 10 | Phù hợp nghiệp vụ ngành | 5 |
| 11 | Tin cậy, bảo mật, tuân thủ | 5 |
| 12 | Đánh giá liên tục và trải nghiệm | 4 |
| | **Tổng** | **68/120** |

### 1. Khung vấn đề: 7/10
Bằng chứng:
- Mọi `brief.md` có câu "Thành công nghĩa là…", danh sách GIẢ ĐỊNH kèm cách kiểm và hạn kiểm ("Kiểm tra trong 30 ngày bằng giấy chứng nhận đăng ký đầu tư…", Q1; "đối soát 30 ngày hồ sơ gần nhất", Q4), "Chưa có số: …" nói thẳng chỗ thiếu.
- Q1 có mục tiêu đo được ("không có ngày nào cư trú quá hạn"). Q4 thì không: "chốt khách dễ hơn mà không lỗ" không có con số hay hạn.
- Không phiên nào ghi người ra quyết định, không có trường "loại cửa" ở cấp khung (chỉ ghế tự khai `DOOR` trong thẻ vòng 1). Bốn phiên chạy thẳng qua `/api/council`, không qua vòng hỏi gốc, nên người dùng không xác nhận khung. Kết luận không chấm lại khung.

Để lên 10: khung có trường cấu trúc bắt buộc (mục tiêu số + hạn, người quyết, ràng buộc, tiêu chí thành công, loại cửa) do người dùng bấm xác nhận trước vòng 1; kết luận có dòng "khung có đổi sau tranh luận không".

### 2. Đa dạng phương án: 7/10
Bằng chứng:
- Chủ toạ tự thêm phương án ngoài lời người hỏi: D (đường nhà đầu tư) ở Q1, B (xuất cảnh rồi quay lại đúng mục đích) ở Q3, D (thí điểm có trần) ở Q4 là đúng một "phương án nhỏ hơn".
- Mục "Hướng các ghế nêu thêm" (`huong_ghe_neu`) xử lý từng hướng ghế nêu, có lý do: Q2 đưa A2 (thành lập trước theo Luật 143/2025/QH15, khoản 2 Điều 19), ĐT4, nhánh nhà quản lý; Q3 gạt "quay lại bằng thị thực du lịch" vì sai mục đích. Đây là cải tiến thật.
- Chưa có "không làm" ở mọi phiên (Q1 không có; C "chờ" không phải "không làm"). Không có phương án "ngược" do máy sinh. Q2 gạt C (văn phòng đại diện) bằng lý do yếu ("không bán hàng"), bỏ lý do quyết định mà ghế đã nêu ở vòng 1: cá nhân không lập được văn phòng đại diện vì phải là thương nhân hoạt động tối thiểu 1 năm (`round-1.md` dòng 19).

Để lên 10: schema `options` bắt buộc ba vai (không làm, nhỏ hơn, ngược); máy kiểm trùng bản chất; lý do gạt phải lấy lý do mạnh nhất từ thẻ ghế.

### 3. Độc lập và đa dạng nhận thức: 4/10
Bằng chứng:
- Vòng 1 thấy thiên hướng người hỏi: prompt dựng đề bài yêu cầu "the founder's lean" (`app/lib/council.mjs` dòng 259) và `briefBlock` dán nguyên văn câu hỏi (dòng 84). `brief.md` Q1: "Người hỏi nghiêng về gia hạn thị thực"; Q2: "nghiêng về góp vốn vào công ty có sẵn"; Q4: "nghiêng về hoàn tiền".
- Vòng 2 không ẩn danh: `cardsBlock` chỉ bỏ trọng số và xáo thứ tự (`council.mjs` dòng 133–137); thẻ vẫn mang tên ghế, và thẻ trả lời "I DISAGREE MOST WITH: Tuân thủ" (Q1 `round-2.md`).
- Một họ model: `SEAT_MODEL` claude-sonnet, `CHAIR_MODEL` claude-opus (`council.mjs` dòng 13–15).
- Chỉ số a dua có đo nhưng hẹp và không có ngưỡng: Q1 "2/2 ghế mở đầu khác số đông đã đổi sang phương án D" (100%) chỉ được in ra, không kích hoạt gì. Q3 cả ba ghế chọn B ở vòng 1 cùng đổi sang A ở vòng 2, nhưng chỉ số ghi 0/0 vì công thức chỉ đếm ghế đi theo số đông vòng 1 (`chiSoADua`, `council.mjs` dòng 600–611).

Để lên 10: bỏ thiên hướng khỏi đề bài vòng 1 (Chủ toạ vẫn giữ); thẻ vòng 2 và 3 gọi "Ghế 1..n"; ít nhất hai họ model; đo cả "đổi theo số đông" lẫn "cả phòng dồn về một phía"; ngưỡng, quá ngưỡng thì Chủ toạ phải viết lý do.

### 4. Grounding số liệu: 7/10
Bằng chứng:
- `kiem_so.so_lieu` gắn nhãn từng số: "20 ngày" (đề bài), "3 tỷ đồng" (giả định, kèm văn bản và hạn kiểm), "5 ngày" (tính: 30 − 25), "13 hồ sơ mỗi người (40 ÷ 3)". Q4 ghi phép tính ngay trong câu.
- Máy dò vẫn báo nhầm: Q2 "1 số chưa có nguồn: 37" là số điều ("Điều 7, 8 và 37 Luật 47/2014/QH13"); góc nhìn Chủ toạ Q2 "Số chưa có nguồn: 50 tỷ" là ngưỡng ĐT3 trong não Xuất nhập cảnh. Báo nhầm này đứng ngay đầu PDF kết luận (`shots/v3-pdf-ketluan-1.png`: "Chưa có nguồn: 37, 50 tỷ").
- Không có giám khảo độc lập; bộ đề không đo tỉ lệ số chưa nguồn lọt tới phiếu khách.

Để lên 10: bỏ số trong viện dẫn và ngưỡng có trong não khỏi máy dò; thêm giám khảo thứ hai (model khác) chấm số; bộ đề đo "số chưa nguồn trên phiếu khách = 0".

### 5. Grounding pháp luật: 5/10
Bằng chứng:
- Mọi viện dẫn trong kết luận có số hiệu đầy đủ, không còn mã S trần (0 lần trong bốn `verdict.md`). Máy kiểm bắt cả dạng viết tắt (`SO_TAT`, `app/lib/kiem-luat.mjs` dòng 15), đọc đúng "CẦN KIỂM TRA" là chưa rõ (dòng 66–68), và bắt Chủ toạ viết lại khi kết luận dẫn văn bản hết hiệu lực (`council.mjs` dòng 555–561).
- Không kiểm điều, khoản: "Nghị định 282/2025/NĐ-CP, Điều 21" được dùng cho cả quá hạn tạm trú (Q1, Q3) lẫn khai sai (Q4) mà không ai kiểm. Không có đường dẫn chính thức bấm được trong kết luận; não không có nguyên văn (sources.md của Chủ toạ: "Não này không có trích dẫn nguyên văn"; trang vbpl.vn, chinhphu.vn bị chặn). Tỉ lệ nguồn mang nhãn CẦN KIỂM TRA cao: Xuất nhập cảnh 20/31, Tư pháp 22/33, FDI 20/32.
- Đề bài không bị kiểm: Q2 `brief.md` dòng 17 dẫn "Nghị định 09/2018/NĐ-CP" làm căn cứ kiểm tra giấy phép bán lẻ; văn bản này đã bị thay (não FDI S018/S029).
- Nhãn mâu thuẫn với máy: Q3 điều kiện 1 ghi Nghị định 283/2026/NĐ-CP và 59/2026/NĐ-CP "đều CẦN KIỂM TRA số hiệu, hiệu lực và mức áp dụng" trong khi `kiem_luat.con` xác nhận cả hai còn hiệu lực (não Tuân thủ S003, S011, kiểm 26/10/2026).
- Cấp phiên chưa có `kiem_luat_ket_luan` (mã đã thêm ở commit e566e35 lúc 19:16, sau khi bốn phiên chạy xong), nên máy chấm bộ đề phải dùng `kiem_luat` toàn phiên và Q2 rớt tiêu chí "không dẫn văn bản hết hiệu lực" vì lỗi của đề bài.

Để lên 10: kho luật có nguyên văn điều, khoản (tải được hoặc người nhập); máy kiểm cặp "văn bản + điều + nội dung"; mỗi viện dẫn có link chính thức và ngày kiểm; kiểm cả đề bài và góc nhìn Chủ toạ; văn bản máy đã xác nhận còn hiệu lực thì cấm nhãn "CẦN KIỂM TRA hiệu lực".

### 6. Tổng hợp minh bạch, bảo vệ thiểu số: 6/10
Bằng chứng:
- Điểm tính bằng mã, có công thức từng phương án (Q1 "D (3×8 + 3×7 + 2×8 + 2×7 + 2×7) / 12 = 7,4", tôi tính lại đúng cả bốn phiên). Ý kiến thiểu số có điều kiện "để ý kiến này đúng thì…".
- "Mức ủng hộ đề xuất" là trung bình có trọng số của FINAL SCORE vòng 3 (`council.mjs` dòng 625–629), khác điểm phương án. Q3 in "A 7,6 … Mức ủng hộ đề xuất 7,9/10" mà không giải thích vì sao hai số khác nhau.
- Không hiện điểm vòng 1 cạnh vòng cuối trong kết luận. Trọng số do Chủ toạ đặt, chưa hiệu chỉnh. Quy tắc hạ nhãn do Chủ toạ tự viết bằng lời (`override_note` Q3, Q4), không có quy tắc thiểu số bằng mã.
- Góc nhìn Chủ toạ chạy sau kết luận và có thể mâu thuẫn kết luận mà không bị gắn cờ (Q2, `shots/v3-desktop-06-verdict-scroll-2.png`).

Để lên 10: bảng điểm vòng 1 và vòng cuối cạnh nhau; công thức của "mức ủng hộ"; quy tắc bằng mã ("ghế trọng số 3 phản đối, hoặc ≥ 2 ghế ruin = likely, thì tối đa RESHAPE"); bất đồng Chủ toạ – hội đồng hiện thành một dòng cảnh báo.

### 7. Hiệu chỉnh và bất định: 4/10
Bằng chứng:
- Mỗi phiên có đúng một dự báo kiểm được, có xác suất, hạn và cơ sở (Q1 40%, Q2 50%, Q3 60%, Q4 55%). Có `app/scripts/cham-brier.mjs`.
- Chỉ một dự báo, không có khoảng giá trị, xác suất dồn quanh 40–60%. Không có lịch sử kết quả thật (không có thư mục `phieu/`, bộ đề `ket_qua_that` đều trống), nên không có đường hiệu chỉnh. "Độ tin cậy" là công thức kinh nghiệm (`finalNumbers`, dòng 615–623).

Để lên 10: 2–3 dự báo mỗi phiên, một dự báo có khoảng (ví dụ số ngày tới khi có thẻ); thu kết quả thật khi xem lại; báo cáo Brier và đường hiệu chỉnh theo ghế.

### 8. Tư duy rủi ro: 8/10
Bằng chứng:
- Mọi thẻ vòng 1 có PRE-MORTEM và RUIN RISK. Điều kiện 1 của cả bốn kết luận là "Rủi ro không đảo ngược, nêu trước" kèm hướng xử lý (trục xuất, cấm nhập cảnh, ghi lịch sử quá hạn).
- "Dừng nếu" đo được (Q4: sáu ngưỡng, có số; Q1: ba mốc 29/10, 02/11, 09/11). Ghế Tuân thủ đóng vai phản biện thật (Q4 giữ B 8, D 7 tới cuối).
- Thiếu: pre-mortem cho từng phương án (chỉ có cho phương án ghế chọn). Q3 chấm D (xuất cảnh qua cửa khẩu đường bộ) 0 điểm như phương án lách luật và cấm "tư vấn D dưới bất kỳ hình thức nào"; xuất cảnh qua cửa khẩu và bị xử phạt tại cửa khẩu không tự thân là lách luật (xem mục 2), nên phân loại rủi ro này quá tay.

Để lên 10: bảng pre-mortem theo phương án; phân biệt "trái luật" với "hợp pháp nhưng rủi ro cao" bằng căn cứ.

### 9. Hành động được và vòng phản hồi: 6/10
Bằng chứng:
- Bước tiếp theo có ngày cụ thể, cách thử rẻ nhất, ngày xem lại.
- "Người" là tên ghế AI, không phải người thật: "Phụ trách: Vận hành, Tuân thủ" (Q2), và câu này đi thẳng vào phiếu khách. Q4 có bước "Từ 27/11/2026, kéo dài 30 ngày: ghi giờ công… để có mốc so sánh" xếp giữa mốc 09/11 và 16/11, trong khi thí điểm bắt đầu 01/12: mốc đo nền nằm trùng thí điểm, nhiều khả năng là lỗi ngày (27/10 thành 27/11).
- Phiên chạy qua `/api/council` không tạo phiếu theo dõi (`finishRun` chỉ gọi `onDone` cho phiên từ vòng hỏi), nên không có nhắc hạn, không có ghi kết quả thật. Hệ thống chưa học gì từ phiên.

Để lên 10: người phụ trách chọn từ danh sách nhân sự văn phòng; mọi phiên đều có phiếu và lịch nhắc; kiểm thứ tự ngày tăng dần; bảng "ghế nào hay đúng".

### 10. Phù hợp nghiệp vụ ngành: 5/10
Bằng chứng:
- Có máy tính hạn (Tết theo âm lịch, nghỉ bù), phiếu khách một trang, nội dung nghề tốt hơn hẳn (vị trí GPLĐ, ĐT3/ĐT4, thẻ ngắn hơn hộ chiếu 30 ngày, Apostille từ 11/9/2026 trừ Đức, Áo, Séc).
- Chưa có checklist hồ sơ theo thủ tục, báo giá, mẫu đơn, bảng rà soát giấy tờ trong ứng dụng. Máy tính hạn đứng riêng ở thanh trên, không gắn với bước nào của kết luận, không có trong thẻ ghế. Một phiên mất 5–7 phút và 20–26 lượt gọi model: dùng cho "quyết lớn", không phải việc hằng ngày.
- Máy tính hạn có bẫy nghề: chế độ "Ngày lịch" lùi hạn rơi vào ngày nghỉ sang ngày làm việc kế tiếp (Bộ luật Dân sự, Điều 148). Nhân viên dùng nó cho hạn thị thực sẽ ra 16/11/2026 cho "26/10 + 20 ngày", trong khi thị thực hết hạn đúng ngày ghi trên thị thực (15/11, Chủ nhật). Q1 làm đúng ngược lại (lùi về 13/11).

Để lên 10: sinh checklist hồ sơ và báo giá (tách lệ phí nhà nước) từ kết luận; nút "tính hạn" trên từng bước; loại hạn "hạn lưu trú" không lùi; chế độ tra cứu nhanh dưới 1 phút.

### 11. Tin cậy, bảo mật, tuân thủ: 5/10
Bằng chứng:
- Che email, số điện thoại, số giấy tờ, ngày sinh có nhãn trước khi gửi model (`app/lib/che-du-lieu.mjs`); server chỉ nghe 127.0.0.1 và chặn DNS rebinding (`app/server.mjs` dòng 19–20, 186). Lời miễn trừ đúng gói ở kết luận, thẻ ghế, PDF. Phiếu khách có "Người duyệt", ngày duyệt và ô "Nội dung do AI hỗ trợ soạn, đã/chưa được người có thẩm quyền duyệt".
- Không che họ tên. Không đăng nhập, phân quyền, nhật ký truy cập. Không có hạn lưu và xoá phiên theo Luật 91/2025/QH15. Ô duyệt chỉ là ô in; không có trạng thái nháp → đã duyệt trong hệ thống.
- Phiếu khách ghi ngày 26/10/2026 (đồng hồ trình duyệt) trong khi PDF kết luận ghi 27/10/2026: một tài liệu gửi khách sai ngày phát hành.

Để lên 10: phân quyền tối thiểu, nhật ký, hạn lưu và lệnh xoá; che tên; trạng thái duyệt lưu trong hệ thống và chặn tải phiếu khi chưa duyệt.

### 12. Đánh giá liên tục và trải nghiệm: 4/10
Bằng chứng:
- `docs/bo-de-chuan.json` có 4 ca, đúng 4 ca của vòng 1 đã dùng để sửa prompt; chấm bằng so khớp từ khoá. "52/53 (98%)" là điểm trên tập đã học. Không có VLegal-Bench, không có ca có kết quả thật, không đo nhiễu (chạy lặp cùng ca), không báo a dua hay tỉ lệ trích dẫn sai.
- Không chạy phiên Nhanh nào; phiên đầy đủ 5–7 phút. Đầu ra chỉ tiếng Việt, trong khi khách là người Hàn, người Trung.
- `usage` trong `events.json` là bộ đếm cộng dồn cả tiến trình (`app/lib/anthropic.mjs` dòng 20): Q1 20 lượt, Q2 46, Q3 69, Q4 95. Không đo được chi phí từng phiên.
- Giao diện ổn: không lỗi JavaScript, không tràn ngang ở 1440 và 390 px, nút đủ lớn, số dùng dấu phẩy.

Để lên 10: bộ đề ≥ 30 ca mới, đáp án luật sư viết, có ca kết quả thật; chạy mỗi lần đổi prompt hoặc model; báo cáo nhiễu, a dua, trích dẫn sai; phiên Nhanh dưới 3 phút; phiếu song ngữ đọc trong 60 giây.

---

## 2. Kiểm tra pháp lý

Đối chiếu với `sources.md`, `frameworks.md`, `positions.md` của não các ghế (kiểm 26/10/2026, dựng qua tìm kiếm, nhiều mục CẦN KIỂM TRA). Mức: Cao là có thể khiến khách vi phạm hoặc mất quyền lợi; Trung bình là sai hoặc thiếu có thể gây hiểu nhầm; Thấp là rào thừa hoặc nhiễu.

| # | Phiên | Chỗ | Vấn đề | Đối chiếu | Mức |
|---|---|---|---|---|---|
| 1 | Q1, Q3 | Q1 Điều kiện 3: "thị thực hết hạn ngày 15/11/2026, tính bằng 26/10/2026 cộng 20 ngày"; Q3 Điều kiện 5: "25 ngày được tính đến 26/10/2026 thì còn khoảng 5 ngày (30 − 25)" | Mốc tính từ ngày sai: phiên chạy ngày 27/10 giờ VN (tiêu đề kết luận ghi 27/10/2026). Ngày hết hạn là 16/11 nếu "20 ngày" đếm từ 27/10; Q3 thực tế đã quá hạn 26 ngày, còn 4 ngày tới bậc phạt kế tiếp. Nguyên nhân hệ thống: prompt không có ngày hôm nay | `app/lib/council.mjs` dòng 678 (tiêu đề dùng giờ VN), không có chỗ nào đưa ngày vào prompt | Cao |
| 2 | Q2 | `brief.md` dòng 17: "CẦN KIỂM TRA yêu cầu giấy phép… theo Nghị định 09/2018/NĐ-CP" | Đề bài dẫn văn bản đã bị thay bởi Nghị định 342/2026/NĐ-CP. Kết luận không dùng, nhưng cờ "hết hiệu lực" in ra mục Kiểm điều luật và phiếu khách | `luat-su-dau-tu-fdi/sources.md` S018, S029 | Trung bình |
| 3 | Q3 | Điều kiện 11: "Gạt D, 0 điểm… Văn phòng không tư vấn D dưới bất kỳ hình thức nào"; "D bỏ qua việc xử lý vi phạm" | Xuất cảnh qua cửa khẩu khi đã quá hạn không tự thân là lách luật; vi phạm có thể bị xử phạt tại cửa khẩu. Rủi ro thật là bị giữ lại, mức phạt và hồ sơ vi phạm, không phải "không xử lý vi phạm". Gọi là 0 điểm theo luật ngành số 4 là áp sai; CEO có thể tư vấn sai rằng đi cửa khẩu là trái luật. Kết luận "trình diện là an toàn nhất" vẫn đúng | Luật ngành số 4 (chỉ cho lách luật, khai sai); thẩm quyền xử phạt tại cửa khẩu CẦN KIỂM TRA theo Nghị định 282/2025/NĐ-CP | Trung bình |
| 4 | Q3 | Điều kiện 1 và mục tranh cãi: Nghị định 283/2026/NĐ-CP, 59/2026/NĐ-CP "đều CẦN KIỂM TRA số hiệu, hiệu lực" | Rào ngược với não và máy kiểm (cả hai "còn hiệu lực", hiệu lực 10/9/2026 và 01/4/2026). Phần cần kiểm là điều, khoản, mức phạt | `thanh-tra-tuan-thu/sources.md` S003, S011; `kiem_luat.con` | Thấp |
| 5 | Q3 | Điều kiện 4: "Không báo cho khách một con số phạt nào trước khi luật sư xác minh" | Não Tuân thủ có khung theo nguồn đối chiếu: 16 đến dưới 30 ngày 5–10 triệu, 30 đến dưới 60 ngày 10–15 triệu. Có thể báo khoảng kèm nhãn; giữ im làm khách không chuẩn bị tiền và không hiểu vì sao phải đi ngay | `thanh-tra-tuan-thu/frameworks.md` dòng 46 | Thấp |
| 6 | Q3 | Điều kiện 4: luật sư xác nhận bằng văn bản bước trình diện trước 29/10 | Với ca quá hạn thường gặp, buộc văn bản luật sư trước khi trình diện làm chậm và có thể đẩy khách qua bậc phạt 30 ngày. Hợp lý khi khách đã làm việc; quá nặng khi chưa | Q3 tự nêu mốc ngày 30 | Trung bình |
| 7 | Q2 | Điều kiện 11: "C bị gạt vì văn phòng đại diện không bán hàng" | Bỏ lý do quyết định: nhà đầu tư cá nhân không đủ điều kiện lập văn phòng đại diện thương nhân nước ngoài (thương nhân hoạt động tối thiểu 1 năm). Ghế FDI đã nêu ở vòng 1 | Q2 `round-1.md` dòng 19; Nghị định 07/2016/NĐ-CP (FDI S014) | Thấp |
| 8 | Q2 | Góc nhìn Chủ toạ: "Nên xoá: bỏ bước xin văn bản của cơ quan cấp phép lao động… nộp thẳng hồ sơ xác nhận" và "Kết luận còn rào thừa ở ngưỡng 3 tỷ đồng" | Chủ toạ phản bác điều kiện 2 và điều kiện 3 của chính kết luận. CEO không biết bản nào là chốt | `events.json` chair_view; `shots/v3-desktop-06-verdict-scroll-2.png` | Trung bình |
| 9 | Q1 | Tiêu đề "LÀM CÓ ĐIỀU KIỆN (phương án D…)" trong khi việc đầu tiên là nộp A ngay hôm nay | Phương án được chọn bằng điểm cao nhất; nhân viên đọc tiêu đề có thể bỏ bước gia hạn và để khách quá hạn nếu D chậm. Thân kết luận viết đúng, tiêu đề dễ gây hiểu nhầm | `finalNumbers`, `council.mjs` dòng 614 | Trung bình |
| 10 | Q4 | Bước "Từ 27/11/2026, kéo dài 30 ngày: ghi giờ công… để có mốc so sánh" | Mốc đo nền trùng tháng thí điểm (01/12–31/12) nên không có mốc so sánh; gần như chắc là lỗi ngày (27/10) | Q4 `verdict.md` Việc làm tiếp theo | Thấp |
| 11 | Q1 | "Mức phạt theo Nghị định 283/2026/NĐ-CP và Nghị định 59/2026/NĐ-CP đều CẦN KIỂM TRA" | Nghị định 59/2026/NĐ-CP quy định hình thức trục xuất và thủ tục, không phải mức phạt tiền; ghép hai văn bản vào "mức phạt" là thiếu chính xác | `thanh-tra-tuan-thu/sources.md` S011 | Thấp |
| 12 | Q1, Q3, Q4 | "Nghị định 282/2025/NĐ-CP, Điều 21" dùng cho cả quá hạn tạm trú và khai sai (Q4 gắn QUY ĐỊNH) | Không sai theo não (Điều 21: xuất nhập cảnh, cư trú của người nước ngoài), nhưng máy không kiểm được khoản, điểm; Q4 gắn QUY ĐỊNH cho hành vi "khai sai để tránh hoàn tiền" khi chưa xác định khoản | `chuyen-gia-xuat-nhap-canh/sources.md` S020 | Thấp |
| 13 | Q2 | Đề xuất của Thuế: "Không hạch toán chi phí… khi chưa có sao kê vốn qua tài khoản vốn đầu tư" | Nêu như điều kiện cứng mà không gắn nhãn; là thực tiễn phòng ngừa, không phải quy định | Thông tư 38/2026/TT-NHNN chỉ quy định tài khoản vốn | Thấp |

Điểm tốt về pháp lý, cần giữ:
- Không phiên nào cam kết kết quả hay thời gian của cơ quan. Thời hạn luật định ghi "theo luật, kể từ khi nhận đủ hồ sơ hợp lệ" và cả phòng dùng một nhãn (Q1 điều kiện 2).
- Q1: ĐT3/ĐT4 và ngưỡng 3 tỷ đúng với não; nhắc công ty cổ phần chỉ xét Chủ tịch hoặc thành viên Hội đồng quản trị; không rút hồ sơ GPLĐ trước khi có xác nhận miễn. Đây là lời khuyên nghề tốt.
- Q3: hỏi vị trí công việc; nói thẳng công nhân may phổ thông không có đường GPLĐ; gạt "quay lại bằng thị thực du lịch" vì sai mục đích.
- Q4: "trượt" chỉ là văn bản từ chối; hoàn phí dịch vụ, không hoàn lệ phí nhà nước; "tối đa 2 năm"; hợp đồng song ngữ; người kiểm độc lập với doanh số. Không còn nêu Bộ luật Hình sự.

---

## 3. Góc nhìn CEO người dùng

### 3.1 Kết luận nào dùng được ngay

| Phiên | Dùng với khách ngay? | Vì sao |
|---|---|---|
| Q4 Gói GPLĐ + thẻ có hoàn tiền | **Dùng được ngay cho quyết định kinh doanh nội bộ.** | Thí điểm 10 gói, chỉ hoàn phí dịch vụ khi có văn bản từ chối, đối soát 30 ngày trước khi bán, "tối đa 2 năm", người kiểm độc lập. Đúng điều CEO cần, có ngưỡng dừng bằng số. Chỉ phải sửa mốc "27/11" |
| Q3 Quá hạn tạm trú | **Dùng làm quy trình nội bộ; với khách cần bổ sung.** | Bước 0 (đối chiếu đã làm việc chưa) và câu hỏi vị trí là đúng nghề, nói thẳng với xưởng nếu khách là công nhân phổ thông. Phải tự sửa: số ngày quá hạn tính lại theo ngày thật; báo khách khoảng phạt dự kiến; bỏ yêu cầu văn bản luật sư khi khách chưa làm việc để trình diện sớm; không nói với khách rằng đi cửa khẩu là trái luật |
| Q1 Giám đốc Hàn Quốc, DN1 còn 20 ngày | **Dùng được với khách sau khi người duyệt sửa ngày và tiêu đề.** | Thứ tự đúng: nộp gia hạn ngay để giữ ngày ở, chốt vốn góp để chọn ĐT3 hay đi GPLĐ, khách chưa điều hành tới khi có giấy. Phải sửa: ngày hết hạn tính từ thị thực thật (không từ "26/10 + 20"), tiêu đề "phương án D" dễ khiến nhân viên bỏ bước A |
| Q2 Lộ trình FDI | **Dùng làm khung việc nội bộ; chưa gửi khách.** | Nội dung tốt hơn hẳn vòng 1 (ĐT3, A2, thương mại điện tử, Thông tư 38/2026/TT-NHNN). Nhưng 28 lần "CẦN KIỂM TRA", 4.059 từ, góc nhìn Chủ toạ phản bác điều kiện của kết luận, phiếu khách có dòng về văn bản hết hiệu lực không liên quan. Nhà đầu tư Trung Quốc đọc phiếu tiếng Việt toàn thuật ngữ nội bộ sẽ không dùng được |

### 3.2 Văn phong
- Câu ngắn, thẳng, đúng giọng luật sư điều hành. "Gia hạn chỉ mua ngày ở, không mua quyền điều hành" là câu CEO có thể nói lại với khách.
- Thuật ngữ nội bộ vẫn đi vào phiếu khách: "A2 gắn nhãn chưa đo", "Vẽ hai nhánh dòng hồ sơ", "chuỗi năm mắt xích", "Phụ trách: Tư pháp, Vận hành" (tên ghế AI).
- Tiếng Anh còn trong kết luận: "Theo điểm, A được xếp vào mức GO. Chủ toạ hạ xuống GO WITH CONDITIONS" (Q3, Q4). Các file `round-*.md` vẫn nhãn "SEAT", "THE CALL", "I CONCEDE" (giao diện đã dịch).
- Lỗi chấm câu lặp ở mọi phiên: "…trước ngày 10/12/2026.: **50%**".

### 3.3 Độ dài
- Kết luận 3.187 / 4.059 / 3.472 / 3.741 từ, dài hơn vòng 1, đọc 12–16 phút. "Quyết định đề xuất" ở đầu vẫn đủ để quyết trong 30 giây: đây là phần dùng được nhất.
- Lặp vẫn nhiều: "Đề xuất sửa đổi", "Điều kiện", "Hướng các ghế nêu thêm" và "Việc làm tiếp theo" chép lại cùng ý (Q1: ĐT4, "không rút hồ sơ GPLĐ", "hai người được uỷ quyền" mỗi ý xuất hiện 3 lần). Có thể cắt 40%.
- Phiếu khách một trang A4 là cải tiến lớn, nhưng câu bị cắt giữa chừng ("thời hạn cấp giấy chứng nhận đăng ký đầu tư;…", "(4) phần vốn đứng tên khách dưới 3 tỷ đồng và…") và có một khối 24 số hiệu văn bản khách không cần.

---

## 4. Giao diện

Cách làm: Playwright (chromium mặc định), mở http://localhost:4731, "Phiên cũ", phát lại Q2 (desktop) và Q2, Q1 (mobile), "Bỏ qua" tới kết luận, cuộn trang kết luận, bấm "Phiếu khách" và "Tải PDF" (lưu file), mở thẻ một ghế, mở "Tính hạn" thử 12/02/2026 + 5 ngày làm việc, thử thêm 26/10/2026 + 20 ngày lịch. Không bấm "Gửi câu hỏi". Script: `/tmp/claude-0/-home-user-chi-cuong/2796b2d7-6ba6-5fa2-9ccb-a3f6ce54f304/scratchpad/v3-ui.cjs` và `/tmp/claude-0/-home-user-chi-cuong/2796b2d7-6ba6-5fa2-9ccb-a3f6ce54f304/scratchpad/v3-mob.cjs`.

Ảnh (thư mục `/tmp/claude-0/-home-user-chi-cuong/2796b2d7-6ba6-5fa2-9ccb-a3f6ce54f304/scratchpad/shots/`): `v3-desktop-01-home.png` đến `v3-desktop-09-tinh-han.png`, `v3-mobile-01-home.png` đến `v3-mobile-12-seat-card.png`, `v3-pdf-phieu-1.png`, `v3-pdf-ketluan-1.png`, `v3-pdf-ketluan-2.png`. File tải về: `/tmp/claude-0/-home-user-chi-cuong/2796b2d7-6ba6-5fa2-9ccb-a3f6ce54f304/scratchpad/dl/v3-desktop-phieu-fdi.pdf` (1 trang), `/tmp/claude-0/-home-user-chi-cuong/2796b2d7-6ba6-5fa2-9ccb-a3f6ce54f304/scratchpad/dl/v3-desktop-ketluan-fdi.pdf` (5 trang).

Kết quả "Tính hạn" 12/02/2026 + 5 ngày làm việc: **26/02/2026**, trừ 16–20/02 (Tết âm lịch, dự kiến). Đúng theo lịch dự kiến; ghi chú nói rõ là dự kiến.

Điểm tốt:
- Trang chủ chọn sẵn gói "Pháp lý người nước ngoài & FDI", bàn có Chủ toạ luật sư, Thư ký, các ghế theo vai, gợi ý câu hỏi đúng nghề. Không còn số token ở trang chủ.
- Kết luận tự mở khi phát lại xong; con dấu "LÀM CÓ ĐIỀU KIỆN", ba nút "Tải PDF", "Phiếu khách", "Quay lại bàn" rõ. Góc nhìn Chủ toạ đặt sau "Vì sao". Mục "Kiểm điều luật" ghi rõ phạm vi đã kiểm.
- Thẻ ghế dịch nhãn sang tiếng Việt (GHẾ, PHIẾU, ĐIỂM PHƯƠNG ÁN), có tab Mở đầu / Tranh luận / Bỏ phiếu, lời miễn trừ theo vai nghề.
- Không lỗi JavaScript; không cuộn ngang (1440/1440 và 390/390 px). Mobile: bảng kết luận, nút, thẻ ghế, hộp tính hạn đều gọn.
- Phiếu khách một trang: nhãn khuyến nghị, việc cần làm và hạn, điều kiện, rủi ro, việc cần kiểm tra, dự báo, dòng người duyệt và nhãn AI.

Vấn đề, xếp theo ảnh hưởng tới CEO:
1. **Phiếu khách sai ngày** (26/10/2026, theo đồng hồ máy) trong khi PDF kết luận ghi 27/10/2026 (`v3-pdf-phieu-1.png`, `v3-pdf-ketluan-1.png`). Phiếu nên mang ngày phiên theo giờ Việt Nam.
2. **Phiếu khách đưa nhiễu nội bộ cho khách**: "09/2018/NĐ-CP: đã hết hiệu lực…" (từ đề bài, không phải kết luận), khối 24 số hiệu, "Phụ trách: Tuân thủ", câu bị cắt bằng "…". Chỉ tiếng Việt.
3. **Báo động giả về số ở đầu PDF kết luận**: "Chưa có nguồn: 37, 50 tỷ (Góc nhìn Chủ toạ)" (`v3-pdf-ketluan-1.png`).
4. **Góc nhìn Chủ toạ phản bác kết luận mà không có dấu hiệu nào** (`v3-desktop-06-verdict-scroll-2.png`).
5. **"Tính hạn" đứng riêng**: không có trong thẻ ghế hay cạnh từng bước của kết luận; ghi chú bảo người dùng "khai vào nghi-le.json" (việc của lập trình viên); chế độ "Ngày lịch" lùi hạn sang thứ Hai mà không cảnh báo rằng hạn thị thực, tạm trú không lùi (26/10 + 20 ngày ra 16/11/2026).
6. Trên mobile, thẻ ghế tab "Bỏ phiếu" đang hiện nội dung nhưng viền nổi lại nằm ở "Tranh luận" (`v3-mobile-12-seat-card.png`). Thanh bước chỉ thấy bốn bước cuối.
7. Trang kết luận vẫn rất dài (desktop 6 màn hình cuộn); các mục "Điều kiện", "Bảng điểm từng ghế", "Đề xuất sửa đổi" gập lại là đúng hướng.

---

## 5. Kết luận và việc sửa

**Tổng: 68/120.** Mạnh: tư duy rủi ro (8), khung vấn đề (7), đa dạng phương án (7), grounding số (7). Yếu nhất: độc lập (4), hiệu chỉnh (4), đánh giá liên tục (4), grounding pháp luật (5), nghiệp vụ (5), tuân thủ (5).

### Việc sửa, xếp theo tác động

| Hạng | Việc | File | Cách sửa | Tiêu chí |
|---|---|---|---|---|
| 1 | Đưa "hôm nay" theo giờ Việt Nam vào mọi prompt, dùng ngày phiên cho mọi tài liệu | `app/lib/council.mjs` (`briefBlock` dòng 82–86, prompt setup dòng 259, `chairVerdict`, `addChairView`), `app/lib/hoi-goc.mjs`, `app/public/pdf.js` (`dateLine` trong `downloadPhieuKhach` dòng 407) | Thêm dòng `HÔM NAY: ${ngayVN()} (giờ Việt Nam). Mọi mốc ngày tính từ ngày này.` vào đầu mọi prompt. Lưu `st.ngay` lúc mở phiên, phiếu khách in `ngayVN(st.ngay)` thay vì `new Date()` của trình duyệt. Thêm kiểm: ngày nào trong kết luận sớm hơn `st.ngay` thì gắn cờ | 9, 11, 1 |
| 2 | Phiếu khách sạch cho khách | `app/public/pdf.js` (`noiDungPhieuKhach` dòng 341–381) | Dùng `kiem_luat_ket_luan` (không dùng `kiem_luat` toàn phiên); bỏ khối liệt kê mọi văn bản "con"; xoá "Phụ trách: <ghế>" bằng regex; lọc bước có từ nội bộ ("nhãn chưa đo", "nhánh dòng hồ sơ", "kiểm chéo"); không cắt giữa câu (cắt theo câu đầy đủ hoặc chuyển sang trang 2) | 11, 12 |
| 3 | Kiểm luật cả đề bài, viết lại đề bài khi dẫn văn bản hết hiệu lực | `app/lib/council.mjs` (sau bước setup, cạnh dòng 555) | Chạy `kiemLuat(st.brief + st.assumptions.join("\n"), st.luatIdx)`; có `het` thì gọi lại Chủ toạ một lần để thay bằng văn bản thay thế (não FDI có cặp 09/2018 → 342/2026). Lưu `kiem_luat_de_bai` riêng, không trộn vào mục kết luận | 5 |
| 4 | Bỏ thiên hướng người hỏi khỏi vòng 1, ẩn danh vòng 2 và 3 | `app/lib/council.mjs` dòng 84, 259, 133–137 | Đề bài cho ghế không có "founder's lean" và không dán nguyên văn câu "Tôi nghiêng về…" (giữ cho Chủ toạ); `cardsBlock(st, round, choGhe)` đổi `byKey[k].short` thành "Ghế N" theo thứ tự đã xáo, bảng tra chỉ Chủ toạ thấy; `round2Prompt` đổi "I DISAGREE MOST WITH: [seat name]" thành "[Ghế N]" | 3 |
| 5 | Đồng bộ nhãn với máy kiểm và gom "CẦN KIỂM TRA" | `app/lib/council.mjs` (`chairVerdict`), `app/lib/kiem-luat.mjs` | Đưa vào prompt kết luận danh sách văn bản máy đã xác nhận "con" kèm câu "không ghi CẦN KIỂM TRA số hiệu hay hiệu lực cho các văn bản này; chỉ ghi CẦN KIỂM TRA cho điều, khoản, mức". Thêm trường `luat_su_xac_nhan: []` để gom mọi việc cần kiểm vào một bảng; thân kết luận chỉ đánh dấu ngắn. Cho phép nêu khoảng phạt theo nguồn đối chiếu kèm nhãn | 5, 12 |
| 6 | Góc nhìn Chủ toạ không được phản bác ngầm | `app/lib/council.mjs` (`addChairView` dòng 398–440), `app/public/app.js` | Hoặc chạy góc nhìn Chủ toạ trước kết luận và đưa vào kết luận, hoặc thêm trường `bat_dong_voi_ket_luan: [{dieu_kien, ly_do}]` và giao diện hiện băng vàng "Chủ toạ không đồng ý với điều kiện 2, 3" ngay dưới con dấu | 6 |
| 7 | Tiêu đề kết luận theo việc làm trước, không chỉ theo điểm cao nhất | `app/lib/council.mjs` (`finalNumbers` dòng 612–631, `verdictMd` dòng 678–) | Thêm trường `lam_truoc` (phương án hoặc bước làm ngay hôm nay) trong schema kết luận; tiêu đề in "Làm ngay: A. Đường chính: D (khi đủ chứng từ)". Giải thích "Mức ủng hộ" bằng công thức như điểm phương án | 6, 9 |
| 8 | Máy dò số bỏ số điều luật và ngưỡng có trong não | `app/lib/luat-so.mjs` (`kiemSo`) | Trước khi dò, xoá khoảng "Điều \d+(, \d+)*( và \d+)?", "khoản \d+", "điểm [a-zđ]"; số khớp một ngưỡng có trong `frameworks.md`/`positions.md` của ghế trong phiên thì gắn nhãn "ngưỡng theo não" thay vì "chưa có nguồn". Mục tiêu 0 báo nhầm trên 4 phiên này | 4 |
| 9 | Máy tính hạn an toàn cho hạn lưu trú, gắn vào kết luận | `app/lib/tinh-han.mjs` (`tinhHan`), `app/public/app.js` (dòng 477–488, `openCard`, `verdictHtml`), tạo `nghi-le.json` | Thêm loại "hạn lưu trú/thị thực" không lùi theo ngày nghỉ và cảnh báo "hạn ghi trên thị thực không lùi"; ghi chú Điều 148 chỉ áp cho hạn thực hiện thủ tục. Thêm nút "Tính hạn" cạnh mỗi bước có "ngày làm việc" và trong thẻ ghế. Khai lịch nghỉ 2026 chính thức; thay câu "khai vào nghi-le.json" bằng "Lịch Tết là dự kiến, đối chiếu thông báo chính thức" | 10 |
| 10 | Người phụ trách thật và phiếu theo dõi cho mọi phiên | `app/lib/council.mjs` (`finishRun` dòng 577–590), `app/lib/phieu.mjs`, `.env` (`NHAN_SU`) | Danh sách nhân sự văn phòng trong `.env`; Chủ toạ chọn người từ danh sách hoặc ghi "chưa giao"; cấm tên ghế trong "Phụ trách". `finishRun` tạo phiếu cho mọi phiên, kể cả phiên từ bộ đề, kèm lịch nhắc tới ngày xem lại | 9 |
| 11 | Bộ đề thật, không chỉ 4 ca đã sửa | `docs/bo-de-chuan.json`, `app/scripts/chay-bo-de.mjs` | Thêm ≥ 20 ca mới (giữ 4 ca cũ làm hồi quy), đáp án luật sư viết, ≥ 5 ca có kết quả thật; chạy mỗi ca 3 lần để đo nhiễu; báo cáo a dua, tỉ lệ văn bản "ngoai/het", số chưa nguồn trên phiếu khách; thêm một giám khảo LLM khác họ chấm "lời khuyên có thể khiến khách vi phạm" | 12, 3 |
| 12 | Đếm chi phí theo phiên và kiểm thứ tự ngày | `app/lib/anthropic.mjs` (dòng 20–27), `app/lib/council.mjs` (`finishRun`) | Chụp `usage` lúc mở phiên và ghi phần chênh khi kết thúc; ghi cả thời gian. Kiểm `next_steps`: ngày phải tăng dần, bước "đo nền" phải trước bước "thí điểm"; sai thì gắn cờ (bắt được lỗi 27/11 ở Q4) | 12, 9 |
| 13 | Phiếu khách song ngữ | `app/public/pdf.js`, `app/lib/council.mjs` | Thêm lượt dịch phiếu sang ngôn ngữ của khách (Anh, Trung, Hàn) với bảng thuật ngữ cố định (GPLĐ = work permit / 工作许可 / 노동허가; thẻ tạm trú = TRC…), in hai cột hoặc trang 2 | 12, 10 |
| 14 | Chỉ số a dua đúng nghĩa, có ngưỡng | `app/lib/council.mjs` (`chiSoADua` dòng 600–611) | Đếm thêm "số ghế đổi lựa chọn giữa vòng 1 và 2" và "tỉ lệ ghế dồn về một phương án"; quá 50% thì Chủ toạ phải viết một dòng "lập luận mới nào khiến đổi" và kết luận hiện cảnh báo | 3, 6 |
| 15 | Bảo mật tối thiểu cho văn phòng | `app/server.mjs`, `app/lib/che-du-lieu.mjs`, `app/lib/council.mjs` (`save`) | Mật khẩu một người dùng hoặc token; nhật ký mở và tải phiên; `HAN_LUU_NGAY` trong `.env` và lệnh xoá phiên quá hạn; che họ tên người nước ngoài theo mẫu "Mr./Ms./ông/bà + Tên viết hoa"; phiếu khách chỉ tải được khi đã đánh dấu duyệt | 11 |

---

## 6. So với vòng 1

Vòng 1 chấm 61/120 trên bốn phiên cũ (P1–P4, cùng bốn đề). Vòng này 68/120.

| # | Tiêu chí | Vòng 1 | Vòng 2 | Thay đổi |
|---|---|---|---|---|
| 1 | Khung vấn đề | 7 | 7 | = |
| 2 | Đa dạng phương án | 5 | 7 | +2 |
| 3 | Độc lập | 4 | 4 | = |
| 4 | Grounding số | 6 | 7 | +1 |
| 5 | Grounding pháp luật | 4 | 5 | +1 |
| 6 | Tổng hợp minh bạch | 7 | 6 | −1 |
| 7 | Hiệu chỉnh | 2 | 4 | +2 |
| 8 | Rủi ro | 8 | 8 | = |
| 9 | Hành động | 6 | 6 | = |
| 10 | Nghiệp vụ | 4 | 5 | +1 |
| 11 | Tuân thủ | 4 | 5 | +1 |
| 12 | Đánh giá, trải nghiệm | 4 | 4 | = |

Tiêu chí 6 giảm vì vòng này thấy hai vấn đề vòng 1 chưa gặp: "Mức ủng hộ" khác điểm phương án mà không giải thích (Q3), và góc nhìn Chủ toạ phản bác kết luận mà không gắn cờ (Q2).

### Đã sửa thật (thấy trong phiên hoặc giao diện)
- **Mã S trần**: 0 lần trong bốn kết luận; góc nhìn Chủ toạ ghi số hiệu trước mã ("Nghị định 219/2025/NĐ-CP, Điều 2 (S006)"). `ganSoHieu` gắn số hiệu vào mã trần trong thẻ. (Việc sửa 1 vòng 1.)
- **Máy kiểm bắt số hiệu viết tắt** (`SO_TAT`) và đọc "TÌNH TRẠNG: CẦN KIỂM TRA" là chưa rõ. (Việc 2, 3.)
- **Chặn văn bản hết hiệu lực trong kết luận** bằng một lượt viết lại; góc nhìn Chủ toạ có `kiem_luat`. Không hạ nhãn xuống CHỜ như đề xuất, nhưng bốn kết luận đều sạch. (Việc 4, phần lớn.)
- **Lời miễn trừ theo gói** ở trang kết luận, thẻ ghế, PDF và phiếu khách. (Việc 5.)
- **Chủ toạ phải xử lý hướng ghế nêu** (`huong_ghe_neu`, luật ngành số 11): Q1 giữ đường ĐT, Q2 giữ A2. Đây là lỗi nặng nhất của P1, P2 và đã hết. (Việc 6.)
- **Kiến thức nghề trong não**: vị trí được cấp GPLĐ, ngưỡng 3 tỷ đồng, ĐT3/ĐT4, Nghị định 342/2026/NĐ-CP thay 09/2018/NĐ-CP, Luật 122/2025/QH15 và Nghị định 248/2026/NĐ-CP. Q3 đã hỏi vị trí. (Việc 7.)
- **Luật ngành số 3, 8, 9, 10**: Q4 không còn nói hoàn tiền là trái luật, không nêu Điều 348; không còn hứa "48 giờ". (Việc 10.)
- **Chủ toạ đúng gói, đúng xưng hô**: Chủ toạ luật sư điều hành, không còn Elon Musk. (Việc 11.)
- **Dự báo có xác suất và chấm Brier** (một dự báo mỗi phiên; có script). (Việc 12, một phần.)
- **Phiếu khách một trang có người duyệt và nhãn AI.** (Việc 13, trừ song ngữ.)
- **Giao diện**: gói pháp lý chọn sẵn, không còn token ở trang chủ, dấu phẩy thập phân, góc nhìn Chủ toạ sau "Vì sao", "Kiểm điều luật" ghi phạm vi, danh sách phiên cũ có nhãn gói và bộ lọc. (Việc 15, phần lớn.)
- **Bộ đề chuẩn và máy chấm** đã có. (Mục "Bộ đề chuẩn nên lập ngay".)

### Chưa sửa hoặc mới sửa một nửa
- **Ẩn danh thẻ vòng 2 và 3** (việc 14): chưa. Chỉ bỏ trọng số và xáo thứ tự; thẻ vẫn mang tên ghế.
- **Máy dò số báo nhầm số điều** (việc 9): giảm (vòng 1: 7 báo nhầm ở P3; vòng này 1–2 mỗi phiên) nhưng còn: "37" (số điều) và "50 tỷ" (ngưỡng luật) ở Q2, và nằm ngay đầu PDF.
- **Rào "CẦN KIỂM TRA hiệu lực" cho văn bản máy đã xác nhận còn hiệu lực** (vòng 1 phát hiện 15): còn nguyên ở Q3 điều kiện 1. "Không báo con số phạt nào" (phát hiện 16): còn nguyên.
- **Nhãn "CẦN KIỂM TRA" lặp quá nhiều, nên gom một bảng** (mục 3.2 vòng 1): chưa; còn tăng (Q2 28 lần, vòng 1 P2 khoảng 16).
- **Độ dài và lặp giữa "Đề xuất sửa đổi", "Điều kiện", "Việc làm tiếp theo"** (mục 3.3): chưa; kết luận dài thêm khoảng 1.000 từ.
- **Tiếng Anh trong `override_note`** ("GO WITH CONDITIONS", mục 3.2): còn ở Q3, Q4. File `round-*.md` vẫn nhãn tiếng Anh.
- **Phiếu khách song ngữ** (việc 13): chưa.
- **Hai dự báo và độ tin cậy giảm theo số điều chưa biết** (việc 12): độ tin cậy đã trừ theo số "CẦN KIỂM TRA" trong thẻ cuối; vẫn một dự báo.
- **Máy kiểm nội dung điều, khoản** (phát hiện 7, 20 vòng 1): chưa; máy vẫn chỉ kiểm số hiệu.
- **Bộ đề**: đã lập đúng bốn ca như vòng 1 đề xuất, nhưng chưa có đáp án do luật sư viết, chưa có ca bẫy "NĐ 144/2021" trong đề, và vì chỉ có bốn ca đã dùng để sửa nên 98% không chứng minh được chất lượng trên ca mới.

### Lỗi mới xuất hiện ở vòng này
- Ngày "hôm nay" trong thân kết luận lệch với ngày phiên (26/10 so với 27/10), kéo theo mốc hạn thị thực và số ngày quá hạn lệch một ngày; phiếu khách và PDF kết luận ghi hai ngày khác nhau.
- Đề bài của Chủ toạ không qua máy kiểm luật, nên cờ văn bản hết hiệu lực lọt sang phiếu khách.
- Góc nhìn Chủ toạ phản bác điều kiện của kết luận mà không có dấu hiệu.
- Bộ đếm `usage` cộng dồn giữa các phiên.
