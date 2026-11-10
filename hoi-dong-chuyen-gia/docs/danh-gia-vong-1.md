# Đánh giá vòng 1: gói ngành `phap-ly-nnn`

Ngày đánh giá: 26/10/2026. Người đánh giá: đánh giá độc lập, không tham gia dựng sản phẩm.
Đối tượng: 4 phiên chạy thật của gói Pháp lý người nước ngoài & FDI, mã nguồn `app/lib/council.mjs`, `app/lib/kiem-luat.mjs`, `app/lib/hoi-goc.mjs`, não các ghế trong `.claude/skills/roast-room/brains/`, luật ngành `.claude/skills/roast-room/nganh/phap-ly-nnn.md`, và giao diện tại http://localhost:4731.
Thang chấm: rubric 12 tiêu chí ở `docs/nghien-cuu-the-gioi.md`, mục 4.

Bốn phiên (gọi tắt P1 đến P4):

| Mã | Thư mục | Chế độ | Kết luận | Thời gian tới kết luận / tới góc nhìn Chủ toạ |
|---|---|---|---|---|
| P1 | `sessions/2026-10-27-mvpk8vq2-giu-tu-cach-cu-tru-cho-giam-doc` | nhanh, 2 vòng, trước khi có Chủ toạ pháp lý và luật số hiệu | LÀM CÓ ĐIỀU KIỆN, D rồi A | 2:40 / 3:13 |
| P2 | `sessions/2026-10-27-mvpkene8-chon-lo-trinh-gia-nhap-thi-truong-fdi` | đầy đủ, 7 ghế | LÀM CÓ ĐIỀU KIỆN, A | 4:59 / 5:37 |
| P3 | `sessions/2026-10-27-mvpkm1z9-xu-ly-khach-qua-han-tam-tru` | đầy đủ, 5 ghế | LÀM CÓ ĐIỀU KIỆN, A | 4:11 / 4:43 |
| P4 | `sessions/2026-10-27-mvpks67b-goi-tron-gpld-va-the-tam-tru` | đầy đủ, 7 ghế | CHỜ (giữ B, mở D sau) | 4:23 / 5:08 |

Độ dài kết luận (`verdict.md`): 1.838, 3.195, 2.591, 2.973 từ. P4 tốn 72 lượt gọi model, khoảng 1,9 triệu token vào và 181 nghìn token ra.

---

## Tóm tắt điều hành

1. **Khung sườn tốt, nội dung pháp lý chưa đủ tin để đưa khách.** Hội đồng luôn nêu rủi ro không đảo ngược trước, luôn có tiêu chí dừng, có người và hạn cho từng bước, và không lần nào khuyên khách khai sai. Đó là phần tốt nhất của gói.
2. **Lỗi pháp lý nặng nhất do chính hệ thống gây ra, không do model.** Ở P1, ghế Tuân thủ đọc mã `S002` của não mình (Nghị định 144/2021, đã hết hiệu lực) rồi bác lập luận của ghế Xuất nhập cảnh dùng `S002` của não kia (Luật 51/2019/QH14, còn hiệu lực, căn cứ chuyển đổi mục đích thị thực). Kết luận P1 ghi "Không dùng S002 làm căn cứ". Hệ quả: một đường hợp pháp bị gạt đi. Luật ngành mới đã cấm mã S trần cho ghế, nhưng **góc nhìn Chủ toạ ở P2 đến P4 vẫn dùng mã S trần** vì prompt của `addChairView` yêu cầu như vậy.
3. **Hội đồng bỏ sót kiến thức nghề mà một CEO dịch vụ visa biết sẵn.** Đường nhà đầu tư (ký hiệu ĐT, chuyển đổi tại chỗ) ở P1; đường "thành lập tổ chức kinh tế trước" theo khoản 2 Điều 19 Luật 143/2025/QH15 ở P2; điều kiện vị trí công việc của lao động xưởng may ở P3. Ghế đã nêu hai trong ba ý này ở vòng 1 nhưng Chủ toạ không đưa vào kết luận.
4. **Máy kiểm điều luật hiện chỉ bắt được số hiệu viết đủ hậu tố.** "NĐ 144/2021" hay "Nghị định 152/2020" (văn bản đã hết hiệu lực) lọt qua. Văn bản sửa đổi nằm trong tên nguồn bị báo nhầm là "ngoài nguồn". Một văn bản có tình trạng CẦN KIỂM TRA bị đọc thành "còn hiệu lực". Máy chỉ cảnh báo, không chặn.
5. **Giao diện in sai lời miễn trừ cho gói pháp lý.** Trang kết luận, thẻ ghế và PDF đều ghi "dựng từ tác phẩm công khai của từng người", là câu của gói kinh doanh. Thiếu câu "không thay thế ý kiến luật sư". Đây là rủi ro tuân thủ cho chính văn phòng.

**Tổng điểm: 61/120.** Mục tiêu đẳng cấp thế giới là từ 100 trở lên, không tiêu chí nào dưới 7. Hiện 8/12 tiêu chí dưới 7.

---

## 1. Chấm 12 tiêu chí

| # | Tiêu chí | Điểm |
|---|---|---|
| 1 | Khung vấn đề | 7 |
| 2 | Đa dạng phương án | 5 |
| 3 | Độc lập và đa dạng nhận thức | 4 |
| 4 | Grounding số liệu | 6 |
| 5 | Grounding pháp luật | 4 |
| 6 | Tổng hợp minh bạch, bảo vệ thiểu số | 7 |
| 7 | Hiệu chỉnh và bất định | 2 |
| 8 | Tư duy rủi ro | 8 |
| 9 | Hành động được và vòng phản hồi | 6 |
| 10 | Phù hợp nghiệp vụ ngành | 4 |
| 11 | Tin cậy, bảo mật, tuân thủ | 4 |
| 12 | Đánh giá liên tục và trải nghiệm | 4 |
| | **Tổng** | **61/120** |

### 1. Khung vấn đề: 7/10
Bằng chứng:
- Brief nào cũng có mục tiêu, tiêu chí thành công và danh sách giả định kèm cách kiểm và hạn kiểm. Ví dụ P1 `brief.md`: "GIẢ ĐỊNH: Khách là thành viên góp vốn hoặc chủ sở hữu… Kiểm tra bằng giấy chứng nhận đăng ký doanh nghiệp và đăng ký đầu tư trong 7 ngày."
- P2 `brief.md` đặt sẵn bốn tiêu chí chấm: "điều kiện tiếp cận thị trường của ngành bán lẻ, tình trạng pháp lý của công ty mục tiêu, giấy tờ cư trú và lao động của giám đốc, và thời hạn giải quyết theo luật".
- Thiếu: khung không chốt "mục tiêu pháp lý thật trước ngày nào" thành trường có cấu trúc (luật ngành có mục này ở "Công cụ hỏi"). P3 không hỏi vị trí công việc của khách ở xưởng may, dù đó là điều quyết định khách có xin được GPLĐ hay không. P1 coi tư cách nhà đầu tư chỉ là một giả định, trong khi đó là nhánh rẽ chính.

Để lên 10: brief có các trường bắt buộc cho gói pháp lý (trạng thái pháp lý đích, ngày đích, chủ thể, ký hiệu hiện tại và ngày hết hạn, vai trò hoặc vị trí, tư cách nhà đầu tư và vốn đã góp, cơ quan có thẩm quyền sau sắp xếp). Thiếu trường nào thì `hoi-goc.mjs` phải hỏi trước khi họp. Kết luận chấm lại khung: trường nào vẫn trống.

### 2. Đa dạng phương án: 5/10
Bằng chứng:
- Mọi phiên đều có phương án nhỏ hơn hoặc "không làm" (P1 D "chỉ hỏi trước cơ quan", P2 D "chưa triển khai", P3 D "không nhận vụ việc", P4 D "thí điểm").
- Phương án hay nhất do ghế nêu bị bỏ rơi. P1 vòng 1, ghế Xuất nhập cảnh: "Nếu giấy chứng nhận đăng ký đầu tư cho thấy vốn góp đạt ngưỡng ĐT3 (từ 3 tỷ đồng…), tôi chuyển sang đổi sang ký hiệu ĐT". P2 vòng 1, LS FDI: "Thành lập mới vẫn được chọn trình tự IRC trước hoặc thành lập trước. Luật 143/2025/QH15, khoản 2 Điều 19". Cả hai không thành phương án và không có trong kết luận.
- P4 chỉ xoay quanh "hoàn tiền / làm lại / giữ giá". Không có phương án như gói theo bậc, hoàn phí dịch vụ theo nguyên nhân, hay tách gói GPLĐ và gói thẻ.

Để lên 10: trước vòng 1, máy sinh thêm một phương án "ngược" và một phương án "đường pháp lý khác" từ khung `Cây quyết định chọn đường vào` và `Kiểm tra chuyển đổi mục đích`. Sau vòng 1, Chủ toạ phải liệt kê mọi phương án mới do ghế nêu và cho bỏ phiếu, hoặc ghi lý do gạt.

### 3. Độc lập và đa dạng nhận thức: 4/10
Bằng chứng:
- Vòng 2 vẫn thấy tên ghế: `cardsBlock` (`council.mjs` dòng 133 đến 137) bỏ trọng số và xáo thứ tự, nhưng giữ `### ${byKey[k].short}`. Ghế được gọi đích danh: "I DISAGREE MOST WITH: Vận hành".
- Một họ model cho mọi ghế (`SEAT_MODEL` mặc định `claude-sonnet-5-5`, Chủ toạ `claude-opus-5-5`). P2: bảy ghế chấm A đúng 7/10, độ chênh 0. P3: năm ghế chọn A ngay ở vòng 1.
- Chỉ số a dua có, nhưng đo sai ở P2: ghế Tuân thủ vòng 1 viết "THE CALL: Tôi chọn A" mà lại chấm "A 6/10 · … · D 7/10". Máy lấy điểm cao nhất (D) làm lựa chọn, rồi báo "1/1 ghế… đã đổi sang A". Giao diện cũng hiện bong bóng "CHỌN D (7/10)" ngay trên câu "Tôi chọn A" (ảnh `desktop-fdi-replay-60s.png`).

Để lên 10: ẩn danh "Ghế 1..n" ở vòng 2 và 3. Kiểm thẻ tự mâu thuẫn (lựa chọn khác điểm cao nhất) và bắt viết lại. Ít nhất một ghế phản biện chạy họ model khác. Báo chỉ số a dua theo cả lựa chọn lẫn độ dịch điểm.

### 4. Grounding số liệu: 6/10
Bằng chứng:
- Phép tính được ghi rõ: P4 "(40 + 16) ÷ 3 ≈ 18,7 đầu việc/người"; P3 "30 − 25 = 5", "5 − 3 = 2". Mỗi số có nhãn đề bài / tính / giả định.
- Máy dò số báo nhầm hàng loạt: số hiệu văn bản và số điều bị coi là "số chưa có nguồn". P2: `chua_nguon` = 96, 143, 38, 293, 59, 283, 219, 47, 23, 45, 151, 109, 37, 67, 122, 288. P3: 283, 47, 23, 45, 151, 282, 21. Góc nhìn Chủ toạ P3 bị báo "Số chưa có nguồn: 34" (34 tỉnh).
- Khi tín hiệu gần như toàn nhiễu, người đọc sẽ học cách bỏ qua dòng cảnh báo màu cam.

Để lên 10: `luat-so.mjs` bỏ qua số nằm trong số hiệu văn bản, "Điều/khoản/điểm", "34 tỉnh" trước khi dò. Thêm nhãn "theo nguồn đối chiếu" cho mức phạt có trong não. Bộ đề chuẩn đo tỉ lệ số không nguồn lọt tới khách bằng 0.

### 5. Grounding pháp luật: 4/10
Bằng chứng:
- Có máy kiểm số hiệu (`kiem-luat.mjs`) và kết luận P2, P3 có mục "Kiểm điều luật" liệt kê văn bản còn hiệu lực theo nguồn. Từ P2, số hiệu viết đủ ("Nghị định 219/2025/NĐ-CP", "Luật 47/2014/QH13 sửa đổi bởi Luật 23/2023/QH15, Điều 7, khoản 4").
- Máy mù với cách viết tắt. Thử trực tiếp `soHieuTrong`: "Nghị định 96/2026", "NĐ 144/2021", "Nghị định 23/2015", "Luật 67/2025" đều trả về rỗng. Kết luận P2 viết "Nghị định 96/2026" và "Nghị định 293/2026" mà máy không thấy.
- Lỗi chỉ mục: `chiMucLuat` chỉ lấy số hiệu đầu tiên trong tên nguồn, nên "Luật Quảng cáo 16/2012/QH13, sửa đổi bởi Luật 75/2025/QH15" làm 75/2025 bị báo "ngoài nguồn" ở P4. `trangThaiDong` đọc "TÌNH TRẠNG: CẦN KIỂM TRA (… chưa xác minh còn hiệu lực …)" thành "còn hiệu lực" (Thông tư 186/2010/TT-BTC trong não Thuế và não FDI).
- Não không có trích nguyên văn, không có đường dẫn tới câu gốc, phần lớn URL là trang thứ cấp. Máy không kiểm điều, khoản. Văn bản hết hiệu lực chỉ bị cảnh báo, không bị chặn.

Để lên 10: xem việc sửa số 2 và 3 ở mục 5. Sau đó: kho văn bản gốc có nguyên văn điều, khoản; mỗi viện dẫn kèm đường dẫn chính thức và ngày kiểm; văn bản hết hiệu lực trong kết luận thì không xuất kết luận.

### 6. Tổng hợp minh bạch, bảo vệ thiểu số: 7/10
Bằng chứng:
- Cách tính điểm ghi bằng công thức: P2 "A (3×7 + 3×7 + … + 2×7) / 16 = 7".
- P4 có ghi chú khi Chủ toạ hạ nhãn: "Theo điểm số, D được chọn (7,3), thuộc nhóm GO WITH CONDITIONS. Chủ tọa hạ xuống WAIT vì D phụ thuộc ba điều kiện tiên quyết chưa đạt". Minh bạch, nhưng còn chữ tiếng Anh.
- Mục "Ý kiến thiểu số" có điều kiện để thiểu số đúng (P2 Thuế, P3 Tuân thủ). Nhưng kết luận chỉ hiện điểm vòng cuối, không hiện điểm vòng 1 cạnh nhau.

Để lên 10: bảng điểm vòng 1 và vòng cuối cạnh nhau, trọng số theo độ tin cậy đã hiệu chỉnh, quy tắc viết sẵn khi nào thiểu số hạ nhãn. Nhãn và tiêu đề kết luận phản ánh việc làm ngay (P4 ghi "CHỜ (phương án D)" nhưng việc làm ngay là B).

### 7. Hiệu chỉnh và bất định: 2/10
Bằng chứng:
- Cả bốn phiên đều "Độ tin cậy 6/10", dù P2 có 16 chỗ CẦN KIỂM TRA còn P4 chủ yếu là số liệu nội bộ. Con số không phân biệt được gì.
- Schema có `du_bao` (`council.mjs` dòng 332) nhưng không phiên nào có dự báo xác suất.
- Thẻ ghế đều "CONFIDENCE: 3/5".

Để lên 10: 2 đến 3 dự báo kiểm được mỗi kết luận (ví dụ "Cơ quan nhận gia hạn DN1 trong 48 giờ: 55%"). Độ tin cậy tính từ số nhãn CẦN KIỂM TRA, độ chênh và độ tin cậy ghế. Chấm Brier khi tới hạn xem lại.

### 8. Tư duy rủi ro: 8/10
Bằng chứng:
- Rủi ro không đảo ngược luôn nêu trước. P2 điều kiện 1: "RỦI RO KHÔNG ĐẢO NGƯỢC, NÊU TRƯỚC: Nếu khách điều hành công ty khi chưa có giấy phép lao động… có thể bị buộc xuất cảnh, trục xuất hoặc cấm nhập cảnh… Hướng xử lý: trong 7 ngày, khách ký văn bản cam kết không điều hành".
- Không lần nào khuyên khai sai. P3: "Không lùi ngày, không sửa chứng từ. Mọi lời khai với cơ quan phải đúng sự thật"; phương án C (lách cửa khẩu) chấm 0,4 và văn phòng rút khỏi vụ nếu khách tự chọn.
- Có chỗ quá đà: P4 kéo Bộ luật Hình sự Điều 348 vào chuyện thiết kế gói giá. Ghế Tuân thủ P3 đề xuất luật sư tư vấn "cân nhắc trước khi khai về thời gian làm việc"; Chủ toạ đã bác trong góc nhìn của mình, đây là điểm cộng.

Để lên 10: bảng hậu quả theo bậc (phạt tiền, buộc xuất cảnh, trục xuất, cấm nhập cảnh, ảnh hưởng hồ sơ sau) với căn cứ và nhãn cho mỗi ô. Chỉ nêu trách nhiệm hình sự khi có dữ kiện về hành vi.

### 9. Hành động được và vòng phản hồi: 6/10
Bằng chứng:
- Bước có người và hạn: P1 "Trong 48 giờ: Chị phụ trách hồ sơ liên hệ Phòng Quản lý xuất nhập cảnh Công an tỉnh Bắc Ninh", "Ngày 4 nếu chưa có trả lời: Trưởng văn phòng đến trực tiếp".
- Có "Cách thử rẻ nhất", "Dừng nếu", "Xem lại vào" với ngày cụ thể (P2 "Hạn cuối là 21/11/2026"; P4 "Họp lại ngày 25/11/2026").
- Không có dự báo để chấm, không có dữ liệu "ghế nào hay đúng", chưa thấy phiếu nào ghi kết quả thật.

Để lên 10: phiếu tự nhắc đúng ngày, nút ghi kết quả thật, thống kê độ đúng theo ghế, nối với `tinh-han.mjs` để mốc như "ngày thứ 10" thành ngày lịch thật có trừ ngày nghỉ.

### 10. Phù hợp nghiệp vụ ngành: 4/10
Bằng chứng:
- Có máy tính hạn (`/api/tinh-han`) và nút "Tính hạn" trên giao diện. Ghế có khung nghề thật (Ma trận ký hiệu và thời hạn, Đồng hồ cư trú, Chuỗi xác nhận năm mắt xích).
- Thiếu kiến thức mà khách trả tiền để nghe: P2 kết luận ghi "ký hiệu ĐT cụ thể CẦN KIỂM TRA" dù não Xuất nhập cảnh có khung "Ngưỡng vốn đầu tư cho ký hiệu ĐT" (ĐT3 từ 3 đến dưới 50 tỷ). P2 không nhắc nghĩa vụ thông báo website thương mại điện tử. P3 không hỏi vị trí công việc của lao động xưởng may.
- Không có checklist hồ sơ, không có báo giá, không có phiếu gửi khách song ngữ. Kết luận là bản ghi nhớ nội bộ 1.800 đến 3.200 từ.

Để lên 10: checklist hồ sơ theo thủ tục làm tờ sự thật, báo giá gắn kết luận, phiếu khách một trang song ngữ, và não bổ sung các nút quyết định nghề hay gặp (mục 5, việc 8).

### 11. Tin cậy, bảo mật, tuân thủ: 4/10
Bằng chứng:
- Có lớp che dữ liệu cá nhân (`che-du-lieu.mjs`) và luật ngành số 6 cấm ghi thông tin cá nhân. Bốn phiên không lộ thông tin cá nhân.
- Lời miễn trừ sai trên giao diện và PDF: `app/public/app.js` dòng 993 viết cứng "Cố vấn mô phỏng, dựng từ tác phẩm công khai của từng người…"; dòng 930 cho thẻ ghế "dựng từ tác phẩm công khai của Chuyên gia Lao động nước ngoài"; `app/public/pdf.js` dòng 15 và 264. `verdict.md` thì đúng (lấy `tuyenBo(st)`), nên hai bản lệch nhau.
- Không có bước người duyệt trước khi gửi khách, không có nhãn AI theo Luật 134/2025, không có nhật ký truy cập. Đầu trang chủ hiện "72 lượt gọi · 1,9 triệu token vào" của phiên trước.

Để lên 10: lời miễn trừ lấy theo gói ở mọi bề mặt, trạng thái phiếu nháp → luật sư duyệt → gửi, nhãn AI, nhật ký, hạn lưu và lệnh xoá `sessions/`.

### 12. Đánh giá liên tục và trải nghiệm: 4/10
Bằng chứng:
- Không có bộ đề chuẩn; bốn phiên này là lần chấm đầu. Phiên nhanh P1 mất 3:13, quá mốc 3 phút. Phiên đầy đủ mất 4:43 đến 5:37.
- Kết luận dài 1.838 đến 3.195 từ, không đọc được trong 60 giây; không có bản song ngữ.
- Giao diện ổn ở mức cơ bản: không cuộn ngang ở 390 px (`scrollWidth` = 390), nhãn thẻ ghế đã dịch sang tiếng Việt ("LẬP TRƯỜNG", "KẾT LUẬN CỦA GHẾ"), kết luận có mục rõ.

Để lên 10: bộ đề chuẩn có đáp án (gồm 4 ca này, với đáp án đúng như đường ĐT ở P1), chạy mỗi lần đổi prompt; báo cáo tỉ lệ trích dẫn sai, a dua, độ lệch giữa 3 lần chạy; phiên nhanh dưới 3 phút; phiếu khách đọc trong 60 giây.

---

## 2. Kiểm tra pháp lý

Đối chiếu với não các ghế (`sources.md`, `frameworks.md`, `positions.md`). Não dựng qua tìm kiếm web, không có nguyên văn, nên mọi nhận định dưới đây cũng phải được luật sư xác nhận trên văn bản gốc. Mức: **Cao** (có thể khiến văn phòng tư vấn sai hoặc khách vi phạm), **Trung bình** (khẳng định thiếu căn cứ hoặc thiếu thông tin quan trọng), **Thấp** (trình bày, nhãn).

### 2.1 Bảng phát hiện

| # | Phiên | Chỗ | Vấn đề | Đối chiếu não | Mức | Máy kiểm có bắt không |
|---|---|---|---|---|---|---|
| 1 | P1 | Điều kiện 6: "Không dùng S002 làm căn cứ khi chưa xác minh"; Vì sao: "Văn bản S002 có thể đã bị thay thế" | Trùng mã S giữa hai não. Tuân thủ (S002 = NĐ 144/2021, hết hiệu lực) bác Xuất nhập cảnh (S002 = Luật 51/2019/QH14, còn hiệu lực, Điều 7 khoản 4 cho chuyển đổi mục đích). Kết luận vô tình gạt căn cứ của đường chuyển đổi hợp pháp | `chuyen-gia-xuat-nhap-canh/sources.md` S002; `thanh-tra-tuan-thu/sources.md` S002; `round-2.md` dòng 56 | Cao | Không. Phiên không có số hiệu nào, `kiem_luat` rỗng ở mọi thẻ |
| 2 | P1 | Kết luận bỏ đường nhà đầu tư | Khách là chủ công ty FDI. Theo khung "Kiểm tra chuyển đổi mục đích", nhà đầu tư thuộc ngoại lệ được đổi ký hiệu tại chỗ; theo khung "Ngưỡng vốn" có thể là ĐT3 và có thể thuộc diện không cấp GPLĐ. Ghế XNC nêu ở vòng 1; kết luận chỉ còn "Nhánh ĐT cần số vốn góp" ở phần tranh cãi. Đây có thể là đường tốt nhất cho khách | `chuyen-gia-xuat-nhap-canh/frameworks.md` mục 3, 4; `chuyen-gia-lao-dong-nuoc-ngoai/positions.md` dòng 9 | Cao | Không (nội dung, không phải số hiệu) |
| 3 | P1 | Điều kiện 4: "Khách không điều hành có hưởng lương phần việc thuộc diện cấp phép" | Chữ "có hưởng lương" dễ bị hiểu là điều hành không lương thì được. Nghĩa vụ GPLĐ gắn với việc làm việc, không gắn với lương | `chuyen-gia-lao-dong-nuoc-ngoai/frameworks.md` mục 1 bước (a) | Cao | Không |
| 4 | P1 | Vì sao: "Nhập cảnh bằng thị thực điện tử rồi điều hành công ty là lệch mục đích, có thể bị phạt và trục xuất (S001, S011, S025)" | Mã S trần của não Tuân thủ (NĐ 282/2025, NĐ 59/2026, một bài của Công an Khánh Hoà); người đọc không tra được. Đồng thời bỏ qua ngoại lệ e-visa có GPLĐ được chuyển đổi | `thanh-tra-tuan-thu/sources.md`; XNC frameworks mục 4 | Trung bình | Không |
| 5 | P1 | Cách thử rẻ nhất: "Câu hỏi này không tốn phí và cho câu trả lời trong 48 giờ" | Hứa thời gian trả lời của cơ quan, trái luật ngành số 3 | `phap-ly-nnn.md` luật 3 | Trung bình | Không |
| 6 | P1 | Góc nhìn Chủ toạ (Elon Musk): "\"Dragon, there can be no failures ever\" (S009)" | Chủ toạ là nhân vật kinh doanh, trích tiếng Anh, dùng mã S của não Musk trong một tư vấn cư trú | `events.json` chair_view | Trung bình | Không |
| 7 | P2 | Vì sao: "Khi 10 tỷ đồng đã vào tài khoản vốn đầu tư… vốn chỉ rút ra được qua quyết toán hoặc giải thể" gắn nhãn QUY ĐỊNH theo Thông tư 38/2026/TT-NHNN | Khẳng định chắc chắn không có trong não (não FDI chỉ ghi tên và ngày hiệu lực của TT 38/2026, nguồn thứ cấp). Bỏ qua khả năng giảm vốn, chuyển nhượng vốn | `luat-su-dau-tu-fdi/sources.md` S019 | Trung bình | Không. Máy chỉ xác nhận "38/2026/TT-NHNN còn hiệu lực" |
| 8 | P2 | Bỏ đường "thành lập tổ chức kinh tế trước, IRC sau" | LS FDI nêu ở vòng 1 với căn cứ khoản 2 Điều 19 Luật 143/2025/QH15; não FDI có Công văn 5427/BTC-DNTN hướng dẫn. Với mục tiêu 3 tháng, đây là thông tin có giá trị | `luat-su-dau-tu-fdi/sources.md` S007; `round-1.md` dòng 18 | Trung bình | Không |
| 9 | P2 | Điều kiện 7: "ký hiệu ĐT cụ thể CẦN KIỂM TRA" | Não XNC đã có ĐT3 từ 3 đến dưới 50 tỷ (QUY ĐỊNH, diễn giải). Ghế XNC ghi ĐT3 ở vòng 1. Kết luận rào thừa, mất giá trị | XNC frameworks mục 3 | Thấp | Không |
| 10 | P2 | "e-visa tối đa 90 ngày và không gia hạn" | Não tự mâu thuẫn: `positions.md` mục 8 ghi QUY ĐỊNH nhưng ngay dưới lại ghi "Văn bản cấm hay cho phép gia hạn e-visa cụ thể: CẦN KIỂM TRA". Kết luận dùng như sự thật | XNC positions mục 8; frameworks mục 9 | Trung bình | Không |
| 11 | P2 | Không nhắc thông báo hoặc đăng ký website thương mại điện tử, giấy phép kinh doanh bán lẻ chỉ ghi "CẦN KIỂM TRA" | Lỗ hổng não: không não nào có nghị định thương mại điện tử; NĐ 09/2018/NĐ-CP trong não FDI để tình trạng CẦN KIỂM TRA | `luat-su-dau-tu-fdi/sources.md` S018 | Trung bình | Không |
| 12 | P2 | Góc nhìn Chủ toạ: "Tôi ghi CẦN KIỂM TRA cho cả phòng… số hiệu Luật Đầu tư 2025 mà phòng ghi là 143/2025/QH15"; gọi người hỏi là "bạn" như thể CEO là nhà đầu tư ("Người Việt đứng tên hộ cho bạn") | Chủ toạ nghi ngờ văn bản mà chính não mình (S009) ghi còn hiệu lực; nhầm vai người hỏi; dùng mã S trần (S009, S011, S021, S018, S010) | `chu-toa-luat-su-dieu-hanh/sources.md` S009 | Thấp | Không: `kiemLuat` không chạy trên góc nhìn Chủ toạ |
| 13 | P2 | "Nghị định 96/2026", "Nghị định 293/2026" | Viết thiếu hậu tố; máy không dò được. Ở đây kết luận tự ghi CẦN KIỂM TRA nên không gây hại, nhưng cùng lỗ hổng sẽ để lọt "NĐ 144/2021" | thử `soHieuTrong` | Trung bình (lỗ hổng máy) | Không |
| 14 | P3 | Kết luận và bước "Trong 30 ngày sau khi khách xuất cảnh… xưởng lập hồ sơ giấy phép lao động" | Không hỏi khách làm vị trí gì ở xưởng may. GPLĐ dành cho nhà quản lý, giám đốc điều hành, chuyên gia, lao động kỹ thuật. Nếu khách là công nhân phổ thông, đường quay lại có thể không tồn tại; kết luận tạo kỳ vọng sai cho khách và xưởng | `chuyen-gia-lao-dong-nuoc-ngoai/_hot.md` ("vị trí đủ điều kiện"); grep `round-*.md` không có "vị trí" | Cao | Không |
| 15 | P3 | Điều kiện 1, 5: "Nghị định 283/2026/NĐ-CP; Nghị định 59/2026/NĐ-CP; CẦN KIỂM TRA hiệu lực" | Rào thừa: não ghi cả hai còn hiệu lực; máy kiểm cũng xác nhận "con". Phần cần kiểm là điều, khoản, mức phạt | `thanh-tra-tuan-thu/sources.md` S003, S011 | Thấp | Máy xác nhận còn hiệu lực, nhưng kết luận vẫn ghi ngược lại |
| 16 | P3 | Điều kiện 7: "Văn phòng không báo bất kỳ con số phạt nào cho khách" | Thận trọng, nhưng não Tuân thủ có khung phạt theo nguồn đối chiếu (16 đến dưới 30 ngày: 5 đến 10 triệu đồng). Có thể báo khoảng kèm nhãn "theo nguồn đối chiếu, CẦN KIỂM TRA" để khách chuẩn bị | `thanh-tra-tuan-thu/frameworks.md` mục 6 | Thấp | Không áp dụng |
| 17 | P3 | Sửa đổi của Tuân thủ: luật sư tư vấn "cân nhắc trước khi khai về thời gian làm việc" | Câu chữ có thể bị đọc là gợi ý che giấu. Chủ toạ đã bác và kết luận đã giới hạn ("mọi lời khai vẫn phải đúng sự thật") | `verdict.md` mục Đề xuất sửa đổi | Trung bình, đã xử lý một phần | Không |
| 18 | P4 | Vì sao: "Biên dương vẫn không biến A thành cam kết hợp lệ" | Ngụ ý cam kết hoàn tiền là trái luật. Không có căn cứ: hoàn tiền là thoả thuận dân sự, chỉ cần quảng cáo trung thực. Luật ngành số 3 là luật cho lời của hội đồng, bị áp nhầm thành luật cho hợp đồng của văn phòng | `phap-ly-nnn.md` luật 3 | Trung bình | Không |
| 19 | P4 | Điều kiện 1: "dấu hiệu theo Bộ luật Hình sự 100/2015/QH13 sửa đổi bởi Luật 12/2017/QH14, Điều 348" | Điều 348 là tội tổ chức, môi giới cho người khác xuất nhập cảnh hoặc ở lại trái phép. Gắn vào việc thiết kế gói giá là quá đà. Chỉ nêu bản sửa đổi 2017, trong khi não ghi khung hình phạt sau sửa đổi 2025 CẦN KIỂM TRA | `thanh-tra-tuan-thu/sources.md` S020 | Trung bình | Một phần: 12/2017 bị báo "ngoài nguồn"; 100/2015 được báo "còn hiệu lực" |
| 20 | P4 | Điều kiện 7: "thời hạn hộ chiếu trừ 30 ngày (Luật 47/2014/QH13 sửa đổi bởi Luật 23/2023/QH15…)" | Quy định thẻ ngắn hơn hộ chiếu ít nhất 30 ngày nằm ở Điều 38 (não Chủ toạ gắn với Luật 51/2019/QH14). Gán văn bản sửa đổi chưa chính xác | `chu-toa-luat-su-dieu-hanh/sources.md` S002 | Thấp | Không: máy chỉ kiểm văn bản còn hiệu lực, không kiểm nội dung gắn đúng văn bản |
| 21 | P4 và P2 | Thời hạn cấp thẻ tạm trú 5 ngày làm việc | P2 kết luận ghi QUY ĐỊNH (Luật 47/2014/QH13, Điều 37); P4 góc nhìn Chủ toạ ghi "không nằm trong căn cứ của tôi, nên cả phòng coi là CẦN KIỂM TRA". Cùng một sự kiện, hai phiên hai nhãn | XNC frameworks mục 7 dẫn S021 (Thông tư 31/2015, tình trạng CẦN KIỂM TRA) | Thấp | Không |
| 22 | P4 | Mục "Kiểm điều luật": "Chưa có trong nguồn đã xác minh: 75/2025/QH15" | Báo nhầm: Luật 75/2025/QH15 có trong não Tuân thủ (S027) và não Khách hàng, nằm trong tên nguồn như văn bản sửa đổi | `thanh-tra-tuan-thu/sources.md` S027 | Thấp (nhiễu) | Báo nhầm |

### 2.2 Đánh giá máy kiểm điều luật

Kết quả thực tế trong `events.json`:

| Phiên | Thẻ ghế có số hiệu | `verdict.kiem_luat` | Nhận xét |
|---|---|---|---|
| P1 | 0/8 | rỗng | Mù hoàn toàn: phiên chỉ dùng mã S trần. Lỗi nặng nhất của phiên (số 1) nằm đúng ở chỗ máy không nhìn thấy |
| P2 | 19/21 | 15 văn bản "con", 0 "het", 0 "ngoai" | Đúng ở mức văn bản. Không thấy "Nghị định 96/2026", "Nghị định 293/2026". Không kiểm nội dung (số 7) |
| P3 | 12/15 | 7 "con" | Đúng ở mức văn bản. Kết luận vẫn ghi "CẦN KIỂM TRA hiệu lực" cho văn bản máy đã xác nhận |
| P4 | 17/21 | 10 "con", 2 "ngoai" (75/2025 báo nhầm, 12/2017 đúng là ngoài nguồn) | Một báo nhầm trên hai cờ |

Thử trực tiếp mã (`kiem-luat.mjs`) trên chuỗi mẫu:
- `soHieuTrong("NĐ 144/2021")` → `[]`; `soHieuTrong("Nghị định 96/2026 và Nghị định 293/2026")` → `[]`. Một ghế viết "theo NĐ 144/2021" (văn bản đã hết hiệu lực từ 15/12/2025) sẽ không bị gắn cờ.
- `soHieuTrong("Nghị định 152/2020/NĐ-CP")` → `["152/2020/NĐ-CP"]` và `kiemLuat` gắn đúng "het". Tức máy chạy tốt khi số hiệu viết đủ.
- Chỉ mục 118 văn bản; 24 dòng nguồn có nhiều số hiệu nhưng chỉ số đầu được ghi (ví dụ 76/2025/QH15, 88/2025/QH15, 196/2025/NĐ-CP trong một số não).
- `trangThaiDong` gắn "con" cho Thông tư 186/2010/TT-BTC dù TÌNH TRẠNG bắt đầu bằng "CẦN KIỂM TRA".
- `canhBaoLuat` chỉ đưa cảnh báo vào prompt vòng sau và Chủ toạ. Không có chặn: kết luận có văn bản "het" vẫn xuất.
- Không chạy trên góc nhìn Chủ toạ, mà góc nhìn Chủ toạ lại được hiện ngay dưới nhãn kết luận trên giao diện.

Kết luận về máy: hữu ích như lớp bảo vệ thứ nhất khi ghế viết số hiệu đủ. Chưa bắt được ba nhóm lỗi gây hại nhất trong bốn phiên: trùng mã S, viết tắt số hiệu, và khẳng định nội dung không có trong não. Mục "Kiểm điều luật" màu xanh "7 văn bản… đều… còn hiệu lực" trên giao diện tạo cảm giác an toàn hơn thực tế.

---

## 3. Góc nhìn CEO người dùng

Tôi đặt mình vào vị trí CEO công ty tư vấn visa, GPLĐ, thẻ tạm trú, FDI, cần trả lời khách trong ngày.

### 3.1 Kết luận nào dùng được ngay

| Phiên | Dùng với khách ngay? | Vì sao |
|---|---|---|
| P3 Quá hạn tạm trú | **Dùng được làm quy trình nội bộ, cần sửa trước khi gửi khách.** | Thứ tự đúng nghề: ngừng làm việc hôm nay, chốt số ngày quá hạn bằng dấu kiểm chứng, lấy ý kiến luật sư, trình diện chậm nhất ngày 3, không hỗ trợ đi cửa khẩu đường bộ, thoả thuận riêng với khách và xưởng. Phải tự bổ sung: khoảng phạt dự kiến, vị trí công việc có đủ điều kiện GPLĐ không, nơi trình diện sau sáp nhập (góc nhìn Chủ toạ có nhắc, kết luận không) |
| P4 Gói trọn GPLĐ + thẻ | **Dùng được cho quyết định kinh doanh, không dùng phần lập luận pháp lý.** | Lời khuyên "không hoàn tiền theo kết quả; đo nguyên nhân hồ sơ bị trả và giá vốn trước 25/11/2026; tách phí nhà nước; không ghi cứng thẻ 2 năm" là lời khuyên tốt. Nhưng lý do "cam kết hoàn tiền không hợp lệ" và viện dẫn Bộ luật Hình sự là sai trọng tâm; nếu CEO tin, anh ấy sẽ bỏ một công cụ bán hàng hợp pháp |
| P2 Lộ trình FDI | **Dùng làm khung việc cần làm, không gửi khách được.** | Thứ tự "tra ngành trước, chuyển vốn sau, chưa đủ giấy thì chưa điều hành" là đúng. Nhưng gửi khách một văn bản có 16 chỗ CẦN KIỂM TRA, không nêu ĐT3, không nêu đường thành lập trước, không nêu thủ tục thương mại điện tử thì khách sẽ hỏi "vậy tôi trả phí tư vấn để làm gì". CEO phải tự viết lại phần chuyên môn |
| P1 Giữ cư trú cho giám đốc | **Không dùng.** | Gạt nhầm căn cứ chuyển đổi mục đích, bỏ đường nhà đầu tư, chữ "có hưởng lương" dễ dẫn khách vào vi phạm, hứa cơ quan trả lời trong 48 giờ, và góc nhìn Chủ toạ là Elon Musk trích tiếng Anh. Phiên này nên đánh dấu "tham khảo lịch sử, không dùng" trong danh sách phiên cũ |

### 3.2 Văn phong
- Trang trọng, câu ngắn, đi thẳng: tốt. "Khách phải ngừng làm việc ngay hôm nay." là kiểu câu CEO cần.
- Nhiều thuật ngữ nội bộ của hệ thống mà khách và cả nhân viên mới không hiểu: "Bộ lọc tiếp cận thị trường ba tầng", "SLA hai lớp", "Chuỗi xác nhận năm mắt xích", "cổng ngành", "đồng hồ cư trú", "Kiểm tra ngày mai". Khi lên phiếu khách phải dịch sang lời thường.
- Cách xưng hô không thống nhất: luật ngành dặn "anh/chị", góc nhìn Chủ toạ dùng "bạn", kết luận dùng "người sáng lập", "founder" (P1 brief), "người đưa vấn đề".
- Còn chữ tiếng Anh: "GO WITH CONDITIONS", "WAIT" trong `override_note` P4; trong `round-*.md` vẫn là "THE CALL", "I DISAGREE MOST WITH", "I CONCEDE" (giao diện đã dịch, file và PDF có thể chưa).
- Nhãn "CẦN KIỂM TRA" và "Chưa có số" lặp tới mức mất tác dụng (P2 khoảng 16 lần). Nên gom vào một bảng "Việc luật sư phải xác nhận" thay vì rải khắp.

### 3.3 Độ dài
- Kết luận 1.838 đến 3.195 từ, đọc mất 8 đến 13 phút. Phần "Quyết định đề xuất" ở đầu đã đủ để quyết trong 30 giây, đó là điểm tốt.
- Phần sau lặp: "Đề xuất sửa đổi" được chép lại gần nguyên văn vào "Điều kiện", rồi lại vào "Việc làm tiếp theo". Có thể cắt 40% mà không mất ý.
- Đề xuất: hai bản. Bản nội bộ (như hiện nay, gọn hơn) và **phiếu khách một trang** (kết luận, việc khách phải làm, giấy tờ, hạn, rủi ro, việc chờ luật sư xác nhận), song ngữ Việt và ngôn ngữ của khách.

---

## 4. Trải nghiệm giao diện

Cách làm: Playwright, mở http://localhost:4731, bấm "Phiên cũ", phát lại P3 (và xem P2 ở tốc độ thường), bấm "Bỏ qua" tới bảng kết luận, bấm "Đọc kết luận", cuộn hết trang kết luận. Không bấm "Gửi câu hỏi". Ảnh lưu tại `/tmp/claude-0/-home-user-chi-cuong/2796b2d7-6ba6-5fa2-9ccb-a3f6ce54f304/scratchpad/shots/`:
- Desktop 1440×900: `desktop-01-home.png`, `desktop-02-history.png`, `desktop-fdi-replay-25s.png`, `desktop-fdi-replay-60s.png`, `desktop-fdi-seatcard.png`, `desktop-qh-v00.png` đến `desktop-qh-v02.png`.
- Mobile 390×844: `mobile-01-home.png`, `mobile-02-history.png`, `mobile-qh-v00.png` đến `mobile-qh-v05.png`.
- Chữ trong trang kết luận: `desktop-qh-verdict.txt`.

Không có lỗi JavaScript trên console ở cả hai kích thước. Không có lệnh POST nào được gửi.

Điểm tốt:
- Bảng kết luận rõ: con dấu "LÀM CÓ ĐIỀU KIỆN", câu quyết định, các nút "Đọc kết luận", "Tải PDF", "Phát lại", "Họp tiếp".
- Trang kết luận chia mục hợp lý: Góc nhìn Chủ toạ, Số dùng trong kết luận, Kiểm điều luật, Điểm, Vì sao, Cần lưu ý, Bước tiếp theo, Chi tiết đầy đủ.
- Thẻ ghế đã dịch nhãn sang tiếng Việt ("LẬP TRƯỜNG", "KẾT LUẬN CỦA GHẾ", "NẾU 12 THÁNG SAU THẤT BẠI") và có "Câu hỏi phụ trách" của ghế.
- Mobile không cuộn ngang (chiều rộng tài liệu đúng 390 px); chữ đủ lớn; con dấu và nút không vỡ.

Vấn đề, xếp theo mức ảnh hưởng tới CEO:
1. **Lời miễn trừ sai gói** ở cuối trang kết luận ("Cố vấn mô phỏng, dựng từ tác phẩm công khai của từng người…") và cuối thẻ ghế ("dựng từ tác phẩm công khai của Chuyên gia Lao động nước ngoài. Không phải người thật."). Ảnh `desktop-qh-v02.png`, `desktop-fdi-seatcard.png`.
2. **Báo động giả về số**: dòng cam "7 số trong kết luận chưa có nguồn" ngay trên bảng kết luận; bấm vào thì thấy 283, 47, 23, 45, 151, 282, 21 là số hiệu và số điều. Góc nhìn Chủ toạ có "Số chưa có nguồn: 34". Ảnh `desktop-qh-v01.png`, `mobile-qh-v03.png`.
3. **Góc nhìn Chủ toạ đứng trước lập luận của hội đồng và dùng mã S trần** ("Khung thứ tự thủ tục, S006", "S022", "S021", "S027", "S025"). Người đọc không biết S006 là văn bản nào. Ảnh `desktop-qh-v00.png`.
4. **Bong bóng ghế mâu thuẫn với lời ghế**: "Thanh tra – Tuân thủ · ỦNG HỘ CÓ ĐIỀU KIỆN · CHỌN D (7/10)" bên trên câu "Tôi chọn A". Ảnh `desktop-fdi-replay-60s.png`.
5. **Trang chủ không hợp với CEO pháp lý**: mặc định "Tự nhận diện" với bàn Elon Musk, Buffett, Bezos; đầu trang hiện "72 lượt gọi · 1,9 triệu token vào · 181 nghìn token ra" của phiên trước. Ảnh `desktop-01-home.png`.
6. **Bàn họp pháp lý dùng hình đại diện chung** (mặt hoạt hình giống nhau, chữ viết tắt "CT", "TT", "LĐ"); ghế không ngồi phiên này (Luật sư Đầu tư FDI ở P3) vẫn hiện mờ; con dấu "SỬA ĐỔI" che mặt ghế; nhãn bị cắt "Ủng hộ có …". Ảnh `desktop-qh-v00.png` nền sau, `desktop-fdi-replay-60s.png`.
7. **Định dạng số không thống nhất**: điểm trên giao diện "6.5", "2.3", trong `verdict.md` là "6,5", "2,3".
8. **Phát lại chậm** ở tốc độ thường: sau 58 giây vẫn ở bước "Mở đầu". Nút "Bỏ qua" hoạt động tốt.
9. **Mobile**: trang kết luận dài 4.941 px, gần 6 màn hình; thanh bước chỉ thấy "Đề bài, Mở đầu, Điểm vênh, Tranh luận", hai bước cuối khuất. Danh sách "Phiên cũ" trộn phiên tiếng Anh ("First sales hire…", "Raise coaching price…") với phiên pháp lý, không có nhãn gói, không có lọc.
10. **"Kiểm điều luật" màu xanh** ("7 văn bản được viện dẫn đều có trong nguồn đã xác minh và còn hiệu lực") đọc như con dấu chấp thuận. Nên ghi rõ phạm vi: "đã kiểm số hiệu và tình trạng; chưa kiểm điều, khoản và nội dung".

---

## 5. Kết luận và việc sửa

**Tổng: 61/120.** Mạnh: tư duy rủi ro (8), khung vấn đề (7), tổng hợp minh bạch (7). Yếu nhất: hiệu chỉnh (2), độc lập (4), grounding pháp luật (4), nghiệp vụ (4), tuân thủ (4), đánh giá liên tục (4).

### Việc sửa, xếp theo tác động

| Hạng | Việc | File | Cách sửa | Tiêu chí |
|---|---|---|---|---|
| 1 | Bỏ mã S trần ở mọi bề mặt, kể cả góc nhìn Chủ toạ | `app/lib/council.mjs` (`addChairView`, `runSeat`), `app/lib/kiem-luat.mjs`, `app/lib/seats.mjs` | Prompt `addChairView` đang đòi "một mã nguồn S0xx" và không kèm luật ngành: đổi thành "số hiệu đầy đủ + (S0xx)", thêm `luatNganh(st)`. Thêm hàm `giaiMaNguon(slug, text)` thay mỗi "(S0xx)" trần bằng "(<số hiệu>, S0xx não <ghế>)" từ `sources.md` của đúng não, chạy sau mỗi thẻ và góc nhìn Chủ toạ. Thẻ còn mã S trần không giải được thì gắn cờ | 5, 3 |
| 2 | Máy kiểm bắt số hiệu viết tắt | `app/lib/kiem-luat.mjs` | Thêm mẫu thứ hai: `(Nghị định|NĐ|Thông tư|TT|Luật|Nghị quyết|NQ|Quyết định|QĐ)\s*(số\s*)?(\d{1,4})\/(\d{4})` không hậu tố; tra chỉ mục theo "số/năm" và loại văn bản suy từ chữ đứng trước. Thêm kiểm thử: "NĐ 144/2021" phải ra "het", "Nghị định 96/2026" phải ra "con" | 5 |
| 3 | Sửa chỉ mục và đọc tình trạng | `app/lib/kiem-luat.mjs` (`chiMucLuat`, `trangThaiDong`) | Ghi mọi số hiệu trong tên nguồn; văn bản sửa đổi được nhắc trong tên lấy tình trạng "con" nếu không có dòng riêng. Nếu TÌNH TRẠNG bắt đầu bằng "CẦN KIỂM TRA" hoặc có "chưa xác minh" thì trả "" trước khi xét "còn hiệu lực" | 5 |
| 4 | Chặn kết luận dùng văn bản hết hiệu lực; chạy máy kiểm trên góc nhìn Chủ toạ | `app/lib/council.mjs` dòng 535 đến 541 và `addChairView` | Nếu `verdict.kiem_luat.het` khác rỗng: gọi lại Chủ toạ một lần với danh sách vi phạm; vẫn còn thì hạ nhãn xuống CHỜ và hiện băng đỏ. Thêm `kiem_luat` vào sự kiện `chair_view` | 5, 11 |
| 5 | Lời miễn trừ theo gói ở giao diện và PDF | `app/public/app.js` dòng 930 và 993, `app/public/pdf.js` dòng 15 và 264 | Dùng `v.disclaimer` (đã có trong sự kiện verdict) và `goi.tuyen_bo`; thẻ ghế vai trò ghi "Chuyên gia mô phỏng theo vai nghề, dựng từ văn bản pháp luật…, không phải người thật" | 11 |
| 6 | Chủ toạ phải mang phương án do ghế nêu vào kết luận | `app/lib/council.mjs` (`chairVerdict`, `chairDraft`) | Thêm trường bắt buộc `phuong_an_ghe_neu: [{ghe, y, xu_ly: "đưa vào" | "gạt", ly_do}]`. Kết luận hiện mục "Đường khác hội đồng đã thấy". Với P1, P2 sẽ giữ được đường ĐT và đường thành lập trước | 2, 10 |
| 7 | Bổ sung nút quyết định nghề vào não | `.claude/skills/roast-room/brains/chuyen-gia-lao-dong-nuoc-ngoai/`, `chuyen-gia-xuat-nhap-canh/`, `luat-su-dau-tu-fdi/` (`frameworks.md`, `positions.md`, `sources.md`) | Thêm: điều kiện vị trí được cấp GPLĐ (nhà quản lý, giám đốc điều hành, chuyên gia, lao động kỹ thuật) theo NĐ 219/2025/NĐ-CP; ngưỡng vốn chủ sở hữu không thuộc diện cấp (CẦN KIỂM TRA điều); đường nhà đầu tư đổi ký hiệu tại chỗ; giấy phép kinh doanh bán lẻ và thủ tục website thương mại điện tử (xác minh tình trạng NĐ 09/2018/NĐ-CP và nghị định thương mại điện tử hiện hành); sửa mâu thuẫn nhãn "e-visa không gia hạn" | 10, 5 |
| 8 | Kiểm thẻ tự mâu thuẫn và sửa chỉ số a dua | `app/lib/seats.mjs` (`parseCard`), `app/lib/council.mjs` (`chiSoADua`) | Lấy lựa chọn từ STANCE/THE CALL; nếu khác phương án điểm cao nhất thì gắn cờ `mau_thuan` và yêu cầu ghế sửa một lần. `chiSoADua` dùng lựa chọn đã đối chiếu. Giao diện hiện lựa chọn của ghế, không suy từ điểm | 3, 6 |
| 9 | Máy dò số bỏ qua số trong viện dẫn luật | `app/lib/luat-so.mjs` (`kiemSo`) | Trước khi dò, xoá các khoảng khớp `soHieuTrong`, "Điều \d+", "khoản \d+", "điểm [a-z]", "\d+ tỉnh". Mục tiêu: 0 báo nhầm trên 4 phiên này (hiện 7, 16, 15) | 4, 12 |
| 10 | Phạm vi luật ngành số 3 và mức nêu hình sự | `.claude/skills/roast-room/nganh/phap-ly-nnn.md` | Thêm: "Luật 3 áp cho lời của hội đồng. Khi bàn hợp đồng của văn phòng, chỉ nói 'trái luật' khi có căn cứ số hiệu, điều." và "Chỉ nêu trách nhiệm hình sự khi có dữ kiện về hành vi tương ứng." Thêm: "Không hứa thời gian trả lời của cơ quan" | 8, 5 |
| 11 | Chủ toạ đúng gói, đúng cách xưng hô, đúng vai người hỏi | `app/lib/council.mjs` (`addChairView`), `app/lib/nganh.mjs` (`chuToa`), `app/lib/hoi-goc.mjs` | Góc nhìn Chủ toạ dùng phần giới thiệu Chủ toạ của gói ("anh/chị") thay cho câu cứng "gọi người hỏi là bạn"; nói rõ người hỏi là văn phòng tư vấn, khách là bên thứ ba. Gói `vai-tro` không được dùng Chủ toạ kinh doanh mặc định. Đánh dấu P1 là phiên cũ trước luật mới trong danh sách | 11, 12 |
| 12 | Độ tin cậy có nghĩa và dự báo xác suất | `app/lib/council.mjs` (`finalNumbers`, schema `du_bao` dòng 332, 358) | Bắt buộc 2 dự báo; độ tin cậy giảm theo số nhãn CẦN KIỂM TRA và "Chưa có số" trong kết luận; ghi lý do con số. Chấm Brier khi xem lại trong `app/lib/phieu.mjs` | 7, 9 |
| 13 | Phiếu khách một trang, song ngữ, có người duyệt | `app/lib/phieu.mjs`, `app/public/pdf.js`, `app/public/app.js` | Sinh từ kết luận: việc khách làm, giấy tờ, hạn (qua `tinh-han.mjs`), rủi ro, việc chờ luật sư xác nhận; bảng thuật ngữ chuẩn Việt/Anh/Trung/Hàn; trạng thái nháp → đã duyệt; nhãn AI | 10, 11, 12 |
| 14 | Ẩn danh thẻ ở vòng 2 và 3 | `app/lib/council.mjs` (`cardsBlock` dòng 133 đến 137, `round2Prompt`) | Khi `choGhe` có giá trị, thay `byKey[k].short` bằng "Ghế 1..n" theo thứ tự đã xáo; Chủ toạ vẫn thấy tên | 3 |
| 15 | Sửa giao diện cho CEO pháp lý | `app/public/app.js`, `app/public/index.html` | Nhớ gói đã chọn lần trước; ẩn số token ở trang chủ; điểm dùng dấu phẩy thập phân; ẩn ghế không ngồi phiên; danh sách phiên cũ có nhãn gói và bộ lọc; mục "Kiểm điều luật" ghi rõ phạm vi đã kiểm; góc nhìn Chủ toạ đặt sau "Vì sao"; cắt lặp giữa "Đề xuất sửa đổi", "Điều kiện", "Việc làm tiếp theo" | 12 |

### Bộ đề chuẩn nên lập ngay
Lấy bốn ca này làm 4 câu đầu của bộ đề, kèm đáp án mong đợi do luật sư viết: P1 phải nêu đường nhà đầu tư và căn cứ chuyển đổi mục đích; P2 phải nêu ĐT3, đường thành lập trước, thủ tục bán lẻ và thương mại điện tử; P3 phải hỏi vị trí công việc; P4 không được nói cam kết hoàn tiền là trái luật. Thêm ca bẫy có "NĐ 144/2021" viết tắt để kiểm máy. Chạy lại sau mỗi lần sửa ở bảng trên.
