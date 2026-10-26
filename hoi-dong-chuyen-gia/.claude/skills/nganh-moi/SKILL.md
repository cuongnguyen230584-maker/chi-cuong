---
name: nganh-moi
description: Dựng một GÓI NGÀNH mới cho Hội đồng chuyên gia, tức một hội đồng chuyên gia ẩn danh cho một ngành bất kỳ (y tế, giáo dục, bất động sản, xây dựng, xuất nhập khẩu, F&B, thời trang, thương mại điện tử...). Gói gồm 6–8 ghế theo vai nghề và một Chủ toạ, mỗi ghế có não dựng từ luật hiện hành, quy trình chính thức và chuẩn nghề nghiệp. Dùng khi người dùng nói "tạo hội đồng cho ngành …", "thêm gói ngành …", "/nganh-moi …", hoặc muốn hội đồng bàn quyết định của một ngành chưa có gói. Không dùng để thêm một người thật (đó là /newroaster).
argument-hint: "<tên ngành> [--key y-te] [--ghe 7]"
---

# /nganh-moi: dựng một gói ngành

Chuẩn bắt buộc: `docs/goi-nganh-spec.md` và `.claude/skills/newroaster/references/brain-spec.md`. Gói mẫu đầy đủ: `phap-ly-nnn` (các ghế `fdi`, `xnc`, `laodong`, `tuphap`, `thue`, `tuanthu`, `vanhanh`, `khachhang`, Chủ toạ `chutoapl`; file `.claude/skills/roast-room/nganh/phap-ly-nnn.md`). Đọc cả ba trước khi làm.

## Bước 1: Thiết kế bàn (hỏi người dùng một lần)

1. Xác định ngành, phạm vi và người dùng (chủ doanh nghiệp, văn phòng dịch vụ, nhà đầu tư...).
2. Đề xuất 6–8 vai, mỗi vai giữ một câu hỏi riêng, theo công thức sau:
   - 2–4 vai chuyên môn cốt lõi của ngành, mỗi vai gắn một mảng luật hoặc kỹ thuật.
   - 1 vai **tuân thủ / thanh tra**: ghế phản biện, hỏi "bị kiểm tra ngày mai thì sao".
   - 1 vai **tài chính – thuế**: chi phí thật, dòng tiền.
   - 1 vai **vận hành**: làm được đúng hạn và lặp lại được không.
   - 1 vai **khách hàng – thị trường**: có người mua không, giá bao nhiêu.
   - 1 **Chủ toạ** (không bỏ phiếu) cùng bộ câu hỏi gốc của ngành.
3. Mỗi vai có: key (2–16 chữ thường hoặc số, không gạch ngang), slug, tên vai tiếng Việt, tên ngắn, mảng (pillar), câu hỏi sở hữu, dimension. Không dùng tên người thật.
4. Trình bảng thiết kế. Hỏi bằng một AskUserQuestion: duyệt / sửa vai / thêm bớt ghế.

## Bước 2: Dựng não song song

Giao mỗi 2–3 vai cho một sub-agent (`general-purpose`), chạy song song trong một message. Mỗi agent nhận:
- Đường dẫn tới hai file chuẩn và gói mẫu.
- Bảng vai của mình (key, slug, mảng, câu hỏi).
- Yêu cầu xác minh **mọi** văn bản bằng WebSearch/WebFetch trên nguồn chính thức (vbpl.vn, chinhphu.vn, congbao.chinhphu.vn, dichvucong.gov.vn, cổng bộ ngành; thuvienphapluat.vn chỉ để đối chiếu): số hiệu, ngày ban hành, ngày hiệu lực, tình trạng tính đến hôm nay. Không tin trí nhớ. Chưa xác minh được thì ghi CẦN KIỂM TRA.
- Đầu ra: 8 file não trong `.claude/skills/roast-room/brains/<slug>/` và `.claude/agents/council-<key>.md`. Không sửa file nào khác.

## Bước 3: File gói ngành

Viết `.claude/skills/roast-room/nganh/<key-gói>.md` với đúng bốn mục `## Giới thiệu Chủ toạ`, `## Công cụ hỏi`, `## Luật ngành`, `## Tuyên bố` (xem mẫu `phap-ly-nnn.md`). `Luật ngành` luôn có: ba nhãn QUY ĐỊNH / THỰC TIỄN / CẦN KIỂM TRA, chỉ dùng văn bản còn hiệu lực, không cam kết kết quả, không bày cách lách luật, nêu rủi ro không đảo ngược trước, không ghi dữ liệu cá nhân, và nói rõ việc nào cần chuyên gia có thẩm quyền xác nhận. Thêm luật riêng của ngành, ví dụ y tế: không chẩn đoán hay kê đơn cho người cụ thể.

## Bước 4: Đăng ký

1. Từng ghế, kể cả Chủ toạ:
   `node .claude/skills/newroaster/scripts/add_seat.mjs --key <k> --name "<tên vai>" --short "<ngắn>" --slug <slug> --pillar "<mảng>" --question "<câu hỏi>" --dimension "<dimension>" --loai vai-tro --nganh <key-gói>`
2. Gói:
   `node .claude/skills/nganh-moi/scripts/add_nganh.mjs --key <key-gói> --ten "<tên gói>" --mo-ta "<một câu>" --chair <key Chủ toạ> --default <k1,k2,...> --tu-khoa "<từ khoá 1>,<từ khoá 2>,..."`
   Từ khoá viết thường, là các cụm người dùng hay gõ khi hỏi về ngành này. Hệ thống dùng chúng để tự nhận diện gói.
3. Chạy `node --test app/test/*.test.mjs` và `python3 .claude/skills/roast-room/scripts/check_quotes.py` trên từng não mới (nếu script hỗ trợ thư mục não). Sửa mọi trích dẫn không khớp.

## Bước 5: Thử và báo cáo

- Chạy thử một hội đồng `--quick --nganh <key-gói>` với một câu hỏi thật của ngành. Đọc lại: có nhãn QUY ĐỊNH/THỰC TIỄN/CẦN KIỂM TRA không, có văn bản hết hiệu lực không, có ghế nào nói như người thật không.
- Báo người dùng: danh sách ghế, số nguồn mỗi ghế, mọi mục CẦN KIỂM TRA, và lệnh để mở phòng (`npm start`).
