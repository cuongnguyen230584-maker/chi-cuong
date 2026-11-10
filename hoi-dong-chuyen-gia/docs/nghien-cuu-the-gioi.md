# Nghiên cứu: đưa Hội đồng chuyên gia lên mức tốt nhất thế giới

Ngày nghiên cứu: 26/10/2026. Phạm vi: hội đồng cố vấn AI ra quyết định (AI advisory council, multi-agent decision support), ưu tiên dịch vụ pháp lý cho người nước ngoài tại Việt Nam (FDI, visa, giấy phép lao động, thẻ tạm trú), sau đó mở rộng đa ngành.

Cách đọc: mục 1 là hiện trạng, mục 2 là đối thủ, mục 3 là khoa học, mục 4 là rubric, mục 5 là backlog. Mỗi nhận định từ bên ngoài đều có nguồn ở mục 8. Điều nào chỉ dựa vào trang quảng bá của nhà cung cấp hoặc nguồn thứ cấp thì ghi rõ "(nhà cung cấp tự công bố)" hoặc "(chưa kiểm bản gốc)".

---

## 0. Tóm tắt điều hành

1. **Đối thủ trực tiếp vẫn còn sơ khai.** karpathy/llm-council có khoảng 26 nghìn sao nhưng chỉ là bản "hack cuối tuần", tác giả tuyên bố không phát triển tiếp. nateherkai/roast-room (khoảng 1,2 nghìn sao, 277 fork) và các bản remix như JamoutAi/seat-at-the-table mới chỉ đổi bộ cố vấn. Chưa thấy fork nào có kiểm số liệu, hỏi gốc, phiếu theo dõi hay gói ngành. Trên các trục đó, Hội đồng chuyên gia đã đi trước.
2. **Khoảng cách lớn nhất nằm ở phía legal AI chuyên nghiệp.** Harvey, CoCounsel, Lexis+ với Protégé và Legora thắng nhờ bốn thứ: nguồn luật có thẩm quyền, trích dẫn bấm được tới câu gốc, máy kiểm trích dẫn tự động (Shepard's, KeyCite), và quy trình công việc cụ thể như bảng rà soát hay soạn thảo. Ngay cả các công cụ này vẫn ảo giác 17–33% câu hỏi trong nghiên cứu Stanford/Yale 2024–2025. Trích dẫn kiểm chứng được là điều kiện cần, không phải lời hứa "không ảo giác".
3. **Khoa học nói tranh luận nhiều vòng không tự động làm hội đồng khôn hơn.** Phần lớn lợi ích đến từ bỏ phiếu độc lập (Choi và cộng sự, NeurIPS 2025). Tranh luận dễ gây đồng thuận giả: tác tử bỏ đáp án đúng để chiều đồng nghiệp, và nể "danh tính" người nói. Cách khắc phục có bằng chứng: giữ vòng 1 độc lập, ẩn danh khi phản biện, đa dạng điểm xuất phát, công bố độ tin cậy có hiệu chỉnh, và bảo vệ ý kiến thiểu số.
4. **Đẳng cấp thế giới cho bài toán này** gồm ba tầng. (a) Quy trình quyết định chuẩn: Decision Quality, chống nhiễu kiểu Kahneman, pre-mortem. (b) Sự thật có kiểm chứng: số liệu, điều luật còn hiệu lực, trích dẫn bấm được. (c) Vòng phản hồi: dự báo có xác suất, chấm điểm Brier sau 30–90 ngày, học từ kết quả thật.
5. **Ba việc nên làm trước cho văn phòng pháp lý người nước ngoài:** kho luật hiện hành có kiểm hiệu lực và trích dẫn tới điều khoản; checklist hồ sơ cùng máy tính hạn theo loại thủ tục; chế độ bảo mật hộ chiếu đi kèm phiếu song ngữ cho khách.

---

## 1. Hiện trạng sản phẩm (đọc từ mã nguồn)

| Thành phần | Đã có | Khoảng trống so với đẳng cấp thế giới |
|---|---|---|
| Khung vấn đề | Chủ toạ hỏi gốc tối đa 5 lượt, phân loại tra cứu/chiến lược/mơ hồ, chốt "vấn đề gốc", soạn 2–4 phương án (`hoi-goc.mjs`) | Chưa tách rõ "mục tiêu, ràng buộc, tiêu chí" thành các trường có cấu trúc để chấm Decision Quality |
| Phương án | A–D, luôn có "không làm" | Chưa có bước sinh phương án đa dạng có chủ đích (ví dụ ép một phương án "ngược") |
| Hội đồng | 3 vòng mở, tranh luận, bỏ phiếu; trọng số 1–3; trần rủi ro sụp đổ (ruin cap); trần cửa một chiều; kiểm đồng thuận ở vòng 1 | Vòng 2 cho thấy tên ghế, nên dễ nể danh tính. Mọi ghế chạy cùng một họ model, nên lỗi tương quan. CONFIDENCE có được ghi nhưng chưa dùng để gộp điểm. Chưa có cơ chế "ý kiến thiểu số có thể lật đa số" |
| Sự thật | Luật không bịa số cùng máy dò số (`luat-so.mjs`), thư ký số liệu có file nguồn, kiểm câu trích của bộ não (`check_quotes.py`) | Chưa kiểm **điều luật**: số hiệu, điều khoản, tình trạng hiệu lực, ngày kiểm. Chưa có trích dẫn bấm được tới câu nguồn |
| Đầu ra | Kết luận có nhãn, phần ý kiến thiểu số, PDF, phiếu markdown | Chưa có phiếu khách hàng song ngữ, mẫu báo giá, checklist hồ sơ |
| Vòng phản hồi | Phiếu, sổ phiếu, hạn xem lại 30 ngày, "Họp tiếp" (`phieu.mjs`, `hop-tiep.mjs`) | Chưa ghi dự báo bằng xác suất, nên không chấm được độ chính xác. Chưa có thống kê "ghế nào hay đúng" |
| Gói ngành | Đặc tả `phap-ly-nnn` với 9 ghế vai trò và 3 nhãn QUY ĐỊNH / THỰC TIỄN / CẦN KIỂM TRA (`docs/goi-nganh-spec.md`, `roster.json`) | `.claude/agents/` hiện chỉ có 12 ghế kinh doanh. Agent và bộ não của các ghế pháp lý chưa dựng xong |
| Bảo mật | Chạy cục bộ, phiếu và phiên họp nằm ngoài git | Chưa che dữ liệu cá nhân (hộ chiếu, số thị thực) trước khi gửi model. Chưa có nhật ký truy cập. Chưa có chính sách xoá theo Luật Bảo vệ dữ liệu cá nhân 2025 |

---

## 2. Bối cảnh cạnh tranh

### 2.1 Hội đồng LLM mã nguồn mở

| Dự án | Điểm mạnh nổi bật | Tính năng đáng học |
|---|---|---|
| **karpathy/llm-council** (11/2025; khoảng 26 nghìn sao, 4,5 nghìn fork) | Ba giai đoạn: (1) nhiều model trả lời song song; (2) mỗi model **xếp hạng câu trả lời đã ẩn danh** của các model khác; (3) model "Chairman" tổng hợp. Dùng nhiều nhà cung cấp qua OpenRouter | **Ẩn danh khi chấm chéo**, để không ai "thiên vị" theo danh tính. **Đa model thật**, không phải một model đóng nhiều vai. Hiện từng câu trả lời theo tab cho người dùng tự so. Tác giả nói đây là bản thử, không bảo trì |
| **nateherkai/roast-room** (MIT; khoảng 1,2 nghìn sao, 277 fork) | Bản gốc của sản phẩm này: 12 cố vấn có "bộ não" dựng từ nguồn công khai, 3 vòng, điểm có trọng số, PDF, `/newroaster`, kiểm câu trích | Các fork xem được (trang 1 sắp theo sao) đều 0 sao và gần như không đổi mã. Chưa thấy fork nào thêm grounding hay vòng phản hồi |
| **JamoutAi/seat-at-the-table** (bản remix của roast-room) | 8 ghế, thêm trụ "năng lượng người sáng lập" (ghế Arianna Huffington). Chủ toạ hỏi thông tin còn thiếu trước khi họp. Trần rủi ro, ép tranh luận khi đồng thuận quá nhanh | Bài học: **trụ cột mới** (sức bền của người ra quyết định) và **đa dạng góc nhìn**. Không có trí nhớ giữa các phiên và không có hỏi tiếp trên kết luận đã xong |
| **llm-council-skill** (gcpdev; khoảng 90 sao), **LLM Council** (shuntacurosu), **decision-council**, **Council Mode** (các registry skill Claude) | Cho Claude Code hỏi thêm GPT hoặc Gemini trước khi chốt kế hoạch. Có biến thể "Council Mode" **làm nổi chỗ các model bất đồng thay vì ép đồng thuận** | **Bản đồ bất đồng** làm đầu ra chính. Hỏi chéo nhà cung cấp model khác. (Số liệu lấy từ trang tổng hợp, chưa kiểm repo gốc) |
| Các skill "AI board of advisors" thương mại nhỏ (ví dụ The Solo Creators) | Quảng bá cơ chế "chấm chéo mù, bỏ phiếu", và khuyên cho mỗi cố vấn **một cuộc trò chuyện riêng** vì chung một ngữ cảnh thì các cố vấn hội tụ | Cùng hướng với bằng chứng khoa học ở mục 3.2: tách ngữ cảnh để giữ tính độc lập |

**"Decision intelligence" doanh nghiệp** (Board, Quantexa, Aera…) chủ yếu là phần mềm lập kế hoạch và tối ưu dữ liệu, không phải hội đồng cố vấn. Tìm kiếm 10/2026 chưa thấy ứng dụng tiêu dùng nào trưởng thành và có vốn lớn trong đúng hạng mục "hội đồng cố vấn AI". Thị trường này vẫn chủ yếu là prompt, persona và khoá học. Đây là cơ hội định vị.

### 2.2 Legal AI quốc tế (chuẩn so sánh cho gói pháp lý)

| Sản phẩm | Điểm mạnh nổi bật | Đáng học cho văn phòng tư vấn người nước ngoài |
|---|---|---|
| **Harvey** | Vault (kho hồ sơ, đồng bộ từ hệ quản lý tài liệu), bảng rà soát (review tables) với **trích dẫn cấp câu**, Workflow agents dựng sẵn hoặc tự mô tả, Agent Builder, chỉnh file Word kèm trích dẫn tới nguồn và tới văn bản đang soạn. Nạp nguồn luật quốc gia (ví dụ SCC Online cho Ấn Độ) | **Bảng rà soát hồ sơ**: mỗi dòng là một giấy tờ, mỗi cột là một kiểm tra (còn hạn? đã hợp pháp hoá? khớp tên hộ chiếu?), mỗi ô có trích dẫn. **Hướng dẫn cố định** áp cho mọi cột |
| **CoCounsel Legal** (Thomson Reuters; bản agentic GA 20/8/2026) | Deep Research lập kế hoạch nhiều bước và ra báo cáo có trích dẫn Westlaw. Dựa trên Westlaw, Practical Law và tri thức nội bộ của hãng luật. Có Brief Builder đi từ nghiên cứu tới bản nháp | **Kế hoạch nghiên cứu hiển thị cho người dùng** trước khi chạy, có người duyệt ở giữa. **Kết hợp luật gốc với hướng dẫn thực hành** (tương đương QUY ĐỊNH + THỰC TIỄN) |
| **Lexis+ với Protégé** (thay Lexis+ AI từ 2/2026) | Shepard's Verify quét **mọi trích dẫn**, kể cả do luật sư tự viết, và đối chiếu với nguồn có thẩm quyền. Trích dẫn bấm được | **Máy kiểm trích dẫn độc lập với model**: tách "model viết" khỏi "máy xác minh" |
| **Luminance** | Đàm phán hợp đồng tự động, **hiện lý do và lịch sử** sau mỗi quyết định. Liên minh với LexisNexis (4/2026) để có trích dẫn liên kết | **Giải thích "vì sao" cho từng quyết định** và nhớ logic quyết định qua các vụ việc |
| **Legora** (gọi vốn 550 triệu USD, định giá 8,8 tỷ USD, 21/10/2026) | Nền tảng cộng tác cho nghiên cứu, rà soát và soạn thảo. Hơn 140 nghìn người dùng (nhà cung cấp tự công bố) | **Cộng tác nhiều người** trên cùng hồ sơ: nhân viên, luật sư duyệt, khách xem |

**Bài học kiểm chứng độc lập.** Magesh và cộng sự (Stanford/Yale, *Journal of Empirical Legal Studies*, 2025) là đánh giá có đăng ký trước đầu tiên. Lexis+ AI và Westlaw AI-Assisted Research ảo giác 17–33% số câu hỏi, dù vẫn ít hơn GPT-4 dùng chung. Cơ sở dữ liệu của Charlotin ghi nhận khoảng 1.600 vụ việc bịa trích dẫn trước toà ở 35 nước tính tới giữa 2026, tăng khoảng 8 lần trong một năm (nguồn báo chí, số liệu thay đổi liên tục). Hàm ý: **mọi điều luật mà hội đồng viện dẫn phải được máy kiểm và người duyệt trước khi tới tay khách.**

### 2.3 AI pháp lý Việt Nam

| Sản phẩm / dự án | Ghi nhận |
|---|---|
| **AI Luật** (LuatVietnam / Hệ thống pháp luật) | Quảng bá tra cứu tình trạng hiệu lực, văn bản hướng dẫn và văn bản thay thế, trích tới điều khoản. Có tin đã tích hợp vào Cổng Pháp luật quốc gia. LuatVietnam vẫn khuyên đối chiếu văn bản gốc (nhà cung cấp tự công bố) |
| **Cổng Pháp luật quốc gia** (Bộ Tư pháp) | Hơn 145.000 văn bản quy phạm đã số hoá, tích hợp VNeID, có trợ lý ảo (theo tin của Bộ Tư pháp đăng lại trên báo). Nên là **nguồn ưu tiên** để kiểm hiệu lực |
| **Clex** (CMC, model CMC-AI-Legal-32B) | Triển khai cho Văn phòng Quốc hội và Văn phòng Chính phủ (doanh nghiệp tự công bố) |
| **FPT AI-powered Justice**, trợ lý toà án của **Viettel** | Hướng tới cơ quan nhà nước, không phải văn phòng dịch vụ |
| **Thư viện Pháp luật** | Có trạng thái hiệu lực cho từng văn bản, một phần chỉ dành cho thành viên trả phí. Phù hợp để đối chiếu |
| Nghiên cứu: **VLegal-Bench** (12/2025, 10.450 mẫu, có phần RAG), **VLQA** (7/2025), **URASys** (AACL 2025, báo "không trả lời được" để tránh ảo giác), VLSP 2025 | Kết luận chung: sinh văn bản tự do có căn cứ điều luật vẫn là điểm yếu dai dẳng. Benchmark có thể dùng để **tự chấm** gói pháp lý |

**Khoảng trống thị trường VN.** Chưa thấy sản phẩm nào kết hợp ba thứ: hội đồng đa góc nhìn (đầu tư, xuất nhập cảnh, lao động, thuế, tuân thủ), luật hiện hành có kiểm hiệu lực, và công cụ vận hành văn phòng (checklist, tính hạn, báo giá, phiếu khách đa ngôn ngữ). Đó là vị trí Hội đồng chuyên gia có thể chiếm.

---

## 3. Nghiên cứu khoa học và hàm ý thiết kế

### 3.1 Tranh luận đa tác tử (multi-agent debate): hiệu quả thật ở đâu

| Phát hiện | Nguồn | Hàm ý cho Hội đồng |
|---|---|---|
| Tranh luận nhiều vòng giữa các bản LLM cải thiện tính đúng sự thật và suy luận trên nhiều bài toán | Du và cộng sự, 2023 (ICML 2024) | Giữ cấu trúc nhiều vòng, nhưng xem các dòng dưới |
| Ép một bên "phản biện" tạo tư duy phân kỳ, giảm hiện tượng một tác tử tự tin bám ý sai | Liang và cộng sự, 2023 (MAD) | Ghế phản biện bắt buộc (gói pháp lý đã có `tuanthu`) |
| **Bỏ phiếu đa số chiếm phần lớn lợi ích** thường gán cho tranh luận. Bản thân tranh luận là một martingale: không tự nâng xác suất đúng kỳ vọng. Chỉ có ích khi cập nhật được "nắn về phía sửa sai" | Choi, Zhu, Li, *Debate or Vote*, NeurIPS 2025 | Điểm vòng 1 độc lập rất quý: **lưu và báo cáo điểm vòng 1 bên cạnh điểm cuối**. Vòng 2 chỉ nên cho phép đổi điểm khi có **bằng chứng mới hoặc lập luận chưa ai trả lời** |
| Tranh luận thiếu hai thành phần mà thảo luận của người có: **đa dạng quan điểm ban đầu** và **truyền đạt độ tin cậy có hiệu chỉnh**. Thêm hai thứ này thì vượt cả tranh luận thường lẫn bỏ phiếu | Zhu và cộng sự, *Demystifying MAD*, Findings ACL 2026 | Khởi tạo có chủ đích để đa dạng. Gộp điểm có trọng số theo CONFIDENCE (thứ đã có trên phiếu) |
| Đa model (ChatGPT, Bard, Claude) với **bỏ phiếu có trọng số theo độ tin cậy** vượt các cách khác. Đa dạng đến từ khác model là then chốt | Chen, Saha, Bansal, *ReConcile*, ACL 2024 | Cho phép ghế chạy model khác nhau (ít nhất ghế phản biện và Chủ toạ khác họ model) |
| Khoảng 1/4 các ca bất đồng có **thiểu số đúng**, do lỗi tương quan giữa các LLM cùng dữ liệu huấn luyện. Bộ phân loại nhẹ trên "dấu vân tay tranh luận" lật đúng 81% (theo tác giả) | *Minority Sentinel*, arXiv 6/2026 | **Báo cáo thiểu số** phải nổi bật. Khi thiểu số có độ tin cậy cao và lý lẽ thuộc trụ của chính họ (ví dụ tuân thủ), hạ nhãn kết luận |
| Tổng quan 2026: persona khác nhau là cơ chế chính tạo đa dạng và chống a dua, nhưng hiệu quả phụ thuộc cách đặc tả persona | *MAD Strategies survey*, arXiv 7/2026 | Bộ não khác biệt sâu (khung, nguồn, câu hỏi sở hữu) là tài sản đúng hướng. Không nên làm persona hời hợt |

### 3.2 Đồng thuận giả: sycophancy, a dua, nể danh tính

| Phát hiện | Nguồn | Hàm ý |
|---|---|---|
| Mô hình được huấn luyện theo phản hồi người có xu hướng nói điều người dùng muốn nghe | Sharma và cộng sự (Anthropic), 2023 | Chủ toạ hỏi "Nếu phải quyết hôm nay bạn chọn gì" là đúng hướng. Thêm: **che "người hỏi đang nghiêng về đâu" khỏi vòng 1**, chỉ đưa vào ở vòng 2 như một giả thuyết cần thử |
| Sycophancy trong tranh luận gây **đồng thuận sớm** và chính xác thấp hơn một tác tử đơn | *Peacemaker or Troublemaker*, arXiv 9/2025 | Đo "tỉ lệ đổi phiếu không kèm lý do mới". Cao thì cảnh báo |
| Tác tử thường **bỏ đáp án đúng sang sai** sau khi đọc lập luận đồng nghiệp, kể cả khi model mạnh chiếm số đông | Wynn, Satija, Hadfield, *Talk Isn't Always Cheap*, ICML MAS Workshop 2025 | Trường MOVED phải nêu **bằng chứng nào** khiến đổi ý. Đổi ý không bằng chứng thì giữ điểm vòng 1 khi gộp |
| **Thiên lệch danh tính**: tác tử nể ý kiến đồng nghiệp (sycophancy) nhiều hơn bám ý mình. **Ẩn danh câu trả lời** làm giảm thiên lệch | Choi và cộng sự, *When Identity Skews Debate*, ACL 2026 | Vòng 2 cho đọc thẻ dưới nhãn "Ghế 1, 2, 3…", không ghi "Buffett". Tên chỉ hiện cho người dùng |
| Tranh luận không định hướng giữa các model mở: a dua lên tới 85,5%. Trộn model khác nhau **không đủ** để chống a dua | *The Cost of Consensus*, arXiv 5/2026 | Cần cơ chế (ẩn danh, độ tin cậy, bảo vệ thiểu số), không chỉ cần đa model |
| Lan truyền a dua khi người dùng đã "tán thành" một đáp án sai. Tín hiệu độ tin cậy nhẹ lúc suy luận giúp giảm | *Too Polite to Disagree*, arXiv 4/2026 | Không để thiên hướng của người hỏi xuất hiện như một "thẻ" ngang hàng các ghế |
| Nhóm người ra quyết định tệ khi thông tin riêng không được chia sẻ ("hidden profiles"). Groupthink | Stasser & Titus 1985; Janis 1972 | Mỗi ghế có "câu hỏi sở hữu" riêng là đúng. Thêm bước **"điều tôi biết mà người khác có thể chưa thấy"** trong vòng 1 |

### 3.3 LLM làm giám khảo (Chủ toạ tổng hợp, chấm điểm)

| Phát hiện | Nguồn | Hàm ý |
|---|---|---|
| Thiên lệch vị trí, độ dài, tự ưu ái (thích văn của chính mình) | Zheng và cộng sự, *MT-Bench/Chatbot Arena*, NeurIPS 2023; Wataoka và cộng sự 2024; các tổng quan 2024 | Chủ toạ không nên cùng model với các ghế khi tổng hợp. **Xáo thứ tự thẻ** mỗi lần gọi. Tính điểm bằng mã (đã làm), không để model tự cộng |
| Một **hội đồng giám khảo nhỏ, khác họ model** (PoLL) tương quan với người tốt hơn một giám khảo lớn, rẻ hơn khoảng 7 lần | Verga và cộng sự (Cohere), 2024 | Bước "kiểm kết luận" có thể dùng 2–3 model nhỏ khác họ để chấm: kết luận có bám thẻ không, có bịa không |
| Giám khảo LLM làm tệ hơn đặc trưng hành vi khi quyết định lật đa số (−1,37%) | *Minority Sentinel*, 2026 | Quy tắc tính điểm minh bạch (như `scoring.md`) tốt hơn để Chủ toạ "cảm thấy" |

### 3.4 Ảo giác, trích dẫn và grounding

| Phát hiện | Nguồn | Hàm ý |
|---|---|---|
| Công cụ legal RAG thương mại vẫn ảo giác 17–33% | Magesh và cộng sự, JELS 2025 | Không bao giờ quảng bá "không ảo giác". Có **người duyệt** trước khi gửi khách |
| Đánh giá văn bản có trích dẫn: đo độ đúng, độ đủ và chất lượng trích dẫn tách biệt (ALCE) | Gao và cộng sự, EMNLP 2023 | Chấm riêng hai thứ: "trích dẫn có thật" và "trích dẫn có ủng hộ câu nói không" |
| **Chain-of-Verification**: lập câu hỏi kiểm, trả lời độc lập, rồi sửa. Giảm ảo giác | Dhuliawala và cộng sự (Meta), 2023 | Thêm bước "thư ký pháp chế" kiểm từng điều luật một cách độc lập với ghế đã viết nó |
| FActScore tách văn bản thành mệnh đề nguyên tử rồi kiểm từng mệnh đề | Min và cộng sự, EMNLP 2023 | Mở rộng `luat-so.mjs` thành "luật dẫn": tách mọi mệnh đề "theo Điều X Nghị định Y", rồi kiểm |
| Báo "không trả lời được" thay vì đoán làm giảm ảo giác tiếng Việt | URASys, AACL 2025 | Nhãn CẦN KIỂM TRA là đúng hướng. Biến nó thành **trạng thái chặn**: không ra kết luận LÀM khi điều luật then chốt còn CẦN KIỂM TRA |
| Sinh văn bản tự do có căn cứ điều luật VN vẫn yếu | VLSP 2025; VLegal-Bench 2025 | Dùng benchmark này để chấm gói pháp lý định kỳ |

### 3.5 Hiệu chỉnh độ tin cậy (calibration)

| Phát hiện | Nguồn | Hàm ý |
|---|---|---|
| Mô hình "phần lớn biết điều mình biết" khi hỏi đúng cách | Kadavath và cộng sự (Anthropic), 2022 | Hỏi xác suất cho từng phương án, không chỉ điểm 0–10 |
| Độ tin cậy bằng lời bị **thổi phồng có hệ thống**. RLHF có thể làm tệ hơn. Model tự tin hơn tới 26% với đáp án của chính nó | Xiong và cộng sự, ICLR 2024; *Wired for Overconfidence*, 2026; Findings ACL 2026 | Không dùng CONFIDENCE thô. **Hiệu chỉnh** bằng lịch sử phiếu (mục 3.6) và bằng mức đồng thuận giữa các lần lấy mẫu (self-consistency, Wang và cộng sự 2022) |
| Nhóm 12 LLM dự báo ngang đám đông 925 người. Model bị **thiên lệch đồng ý** (dự báo trung bình trên 50%). Trộn dự báo người với máy tốt hơn để máy tự sửa theo người | Schoenegger, …, Tetlock, *Science Advances* 2024 | Ghi dự báo của **người hỏi** song song với hội đồng, rồi gộp. Cảnh báo khi xác suất hội đồng trung bình lệch về "có" |
| Hệ LLM có truy xuất tin tức tiệm cận mức dự báo của đám đông người | Halawi và cộng sự, 2024 | Câu hỏi có yếu tố thời gian (thời hạn xử lý hồ sơ, khả năng bị từ chối) nên có xác suất cùng nguồn |

### 3.6 Trí tuệ đám đông, Delphi, dự báo

- **Phương pháp Delphi** (Dalkey & Helmer, RAND 1963; Rowe & Wright 1999): chuyên gia **ẩn danh**, nhiều vòng, được xem **thống kê tổng hợp** (trung vị, khoảng) thay vì lý lẽ của từng người, rồi điều chỉnh. Rowe & Wright cho thấy Delphi thường hơn nhóm tương tác và hơn trung bình thống kê một vòng. **Hàm ý:** vòng 2 nên cho ghế xem phân bố điểm ẩn danh cùng các lập luận mạnh nhất, không phải thẻ có tên.
- **Superforecasting** (Tetlock & Gardner 2015; Good Judgment Project): dự báo bằng xác suất, cập nhật từng bước, chấm bằng **Brier score**, tổng hợp có trọng số và "đẩy cực" (extremizing). **Hàm ý:** mỗi phiếu ghi 2–3 dự báo kiểm được trong 30–90 ngày (ví dụ "Hồ sơ GPLĐ được cấp trước 30/11: 70%"), tới hạn xem lại thì chấm.

### 3.7 Pre-mortem, red team, phản biện thật

- **Pre-mortem** (Klein, HBR 2007). Gốc là "prospective hindsight" (Mitchell, Russo & Pennington 1989): tưởng tượng sự kiện đã xảy ra giúp tìm lý do nhiều hơn khoảng 30%. **Hàm ý:** thêm câu "Giả sử 6 tháng sau quyết định này thất bại. Vì sao?" vào vòng 1 cho mọi ghế, hoặc thành một vòng riêng ngắn.
- **Red team** (Zenko 2015) và nghiên cứu **phản biện thật hơn phản biện đóng vai** (Nemeth và cộng sự 2001): người phản biện thật sự tin mới kích thích tư duy. Đóng vai "devil's advocate" đôi khi củng cố ý ban đầu. **Hàm ý:** ghế phản biện phải có **lập trường riêng dựng từ bộ não**, không phải lệnh "hãy phản đối".

### 3.8 Chất lượng quyết định và chống nhiễu

- **Decision Quality** (Spetzler, Winter & Meyer, Wiley 2016; SDG) gồm sáu mắt xích, quyết định chỉ mạnh bằng mắt xích yếu nhất: (1) khung đúng; (2) phương án sáng tạo, khả thi; (3) thông tin có ý nghĩa, tin cậy; (4) giá trị và đánh đổi rõ; (5) lập luận chặt; (6) cam kết hành động. **Hàm ý:** chấm 0–100% cho từng mắt xích trong kết luận, chỉ ra mắt xích yếu nhất. Hội đồng hiện mạnh ở (1), (2), (5), yếu ở (3) với luật và (4) với khách hàng.
- **Noise** (Kahneman, Sibony & Sunstein 2021). **Noise audit**: cùng một hồ sơ, nhiều người chấm cho kết quả khác nhau bao nhiêu. **Hàm ý:** chạy lại cùng đề bài 3 lần (hoặc dùng bộ đề chuẩn), đo độ lệch kết luận. Đó là chỉ số "nhiễu hệ thống" của sản phẩm.
- **Mediating Assessments Protocol** (Kahneman, Lovallo & Sibony, *MIT Sloan Management Review* 2019): tách quyết định thành các đánh giá trung gian, ưu tiên **góc nhìn bên ngoài** (base rate), giữ các đánh giá **độc lập**, xem từng đánh giá riêng rồi mới tổng hợp, và trì hoãn trực giác tới cuối. **Hàm ý:** trụ cột của mỗi ghế (PILLAR SCORE) chính là các đánh giá trung gian. Nên hiện bảng trụ **trước** điểm tổng.
- **Góc nhìn bên ngoài** mâu thuẫn với luật "không dùng số trung bình ngành". Cách gỡ: cho phép số base rate **khi có nguồn công khai và nhãn riêng** ("THAM CHIẾU NGOÀI"), không bao giờ dùng làm số của doanh nghiệp.

### 3.9 Khung pháp lý Việt Nam áp lên chính sản phẩm

- **Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15** (hiệu lực 01/01/2026) và **Nghị định 356/2025/NĐ-CP** (thay Nghị định 13/2023) áp vào hộ chiếu, thị thực, lý lịch tư pháp. Có tin về nghị định xử phạt với mức tới 3 tỷ đồng hoặc 5% doanh thu (CẦN KIỂM TRA bản gốc). **Hàm ý:** che dữ liệu trước khi gửi model, có cơ sở pháp lý xử lý và đồng ý của khách, có hạn lưu và xoá, có nhật ký.
- **Luật Trí tuệ nhân tạo số 134/2025/QH15** (hiệu lực 01/3/2026), Điều 11 về minh bạch: người dùng phải biết mình đang tương tác với AI. Danh mục hệ thống AI rủi ro cao đang lấy ý kiến (CẦN KIỂM TRA trạng thái). **Hàm ý:** mọi phiếu gửi khách ghi rõ "soạn với hỗ trợ của AI, đã được [người] duyệt".

---

## 4. Rubric "đẳng cấp thế giới" (12 tiêu chí, thang 1–10)

Cột "Hiện tại" là đánh giá sơ bộ từ việc đọc mã nguồn, chưa đo bằng thử nghiệm. Nên chấm lại bằng bộ đề chuẩn (tiêu chí 12).

| # | Tiêu chí | Mức 10 trông như thế nào | Hiện tại (ước) |
|---|---|---|---|
| 1 | **Khung vấn đề** (Decision Quality mắt xích 1) | Mọi phiên chốt được: mục tiêu đo bằng số và hạn, người ra quyết định, ràng buộc, tiêu chí thành công, loại cửa (một chiều hay hai chiều). Người dùng xác nhận khung trước khi họp. Kết luận chấm lại khung | 7 |
| 2 | **Đa dạng phương án** | Luôn có "không làm", một phương án nhỏ hơn và một phương án "ngược" do máy sinh. Ít nhất một phương án đến từ ghế chứ không chỉ từ người hỏi. Không có hai phương án trùng bản chất | 6 |
| 3 | **Độc lập và đa dạng nhận thức** | Vòng 1 chạy cô lập, không thấy thiên hướng của người hỏi. Vòng 2 đọc thẻ ẩn danh. Ít nhất hai họ model. Đo được "chỉ số a dua" mỗi phiên và giữ dưới ngưỡng | 5 |
| 4 | **Grounding số liệu** | Mọi số có nhãn đề bài / số liệu / tính / giả định. Máy dò cùng một giám khảo độc lập. Tỉ lệ số "chưa có nguồn" lọt tới khách bằng 0 trên bộ đề chuẩn | 8 |
| 5 | **Grounding pháp luật** | Mọi điều luật viện dẫn có số hiệu, điều, khoản, đường dẫn chính thức, tình trạng hiệu lực và ngày kiểm. Máy kiểm tự động với kho luật. Văn bản hết hiệu lực bị chặn. Trích dẫn bấm được tới đúng câu | 3 |
| 6 | **Tổng hợp minh bạch và bảo vệ thiểu số** | Điểm tính bằng mã, có công thức. Hiện cả điểm vòng 1 lẫn vòng cuối. Trọng số theo độ tin cậy đã hiệu chỉnh. Có quy tắc khi nào thiểu số hạ nhãn. Báo cáo thiểu số nằm ngay dưới kết luận | 7 |
| 7 | **Hiệu chỉnh và bất định** | Kết luận có xác suất cho 2–3 dự báo kiểm được. Có khoảng giá trị. Độ tin cậy được hiệu chỉnh bằng lịch sử (đường hiệu chỉnh, Brier) | 3 |
| 8 | **Tư duy rủi ro** (pre-mortem, red team, ruin) | Mỗi phương án được nêu có pre-mortem. Có ghế phản biện thật. Trần rủi ro sụp đổ và cửa một chiều tự áp. Có tiêu chí dừng đo được. Với pháp lý: liệt kê hậu quả không đảo ngược được (trục xuất, cấm nhập cảnh, phạt) | 7 |
| 9 | **Hành động được và vòng phản hồi** | Bước tiếp theo có người, ngày, phép thử rẻ nhất. Phiếu tự nhắc tới hạn. Kết quả thật được ghi lại. Hệ thống học: ghế nào, trụ nào hay đúng; nhiễu giảm dần theo thời gian | 6 |
| 10 | **Phù hợp nghiệp vụ ngành** | Gói ngành có quy trình thật: checklist hồ sơ theo thủ tục, tính hạn, báo giá, mẫu đơn, bảng rà soát giấy tờ. Văn phòng dùng hằng ngày, không chỉ khi "quyết lớn" | 3 |
| 11 | **Tin cậy, bảo mật, tuân thủ** | Che dữ liệu cá nhân trước khi gửi model. Phân quyền. Nhật ký truy cập. Hạn lưu và xoá theo Luật 91/2025. Ghi nhãn AI theo Luật 134/2025. Có người duyệt trước khi gửi khách. Tuyên bố giới hạn rõ | 4 |
| 12 | **Đánh giá liên tục và trải nghiệm** | Bộ đề chuẩn (gồm VLegal-Bench và ca nội bộ đã có kết quả thật) chạy mỗi lần đổi prompt hoặc model. Báo cáo nhiễu, a dua và tỉ lệ trích dẫn sai. Phiên Nhanh dưới 3 phút. Đầu ra song ngữ cho khách, đọc trong 60 giây | 4 |

Tổng hiện tại ước khoảng 63/120. Mục tiêu "đẳng cấp thế giới" là từ 100/120 trở lên, và không tiêu chí nào dưới 7.

---

## 5. Backlog top 15 (xếp theo tác động chia chi phí)

Thang: **Tác động** 1–5. **Chi phí** S (dưới 1 tuần), M (1–3 tuần), L (trên 3 tuần). **Ưu tiên** = tác động ÷ chi phí (S=1, M=2, L=3). Cột ★ là mức phù hợp cho văn phòng tư vấn pháp lý người nước ngoài tại VN (★★★ = rất phù hợp).

| Hạng | Tính năng | Tiêu chí rubric | Tác động | Chi phí | ★ | Mô tả ngắn và chỗ sửa |
|---|---|---|---|---|---|---|
| 1 | **Ẩn danh thẻ ở vòng 2 và 3**, xáo thứ tự thẻ | 3, 6 | 4 | S | ★★ | Trong `round2Prompt`/`cardsBlock` (`council.mjs`), đổi `## Buffett` thành `## Ghế 3`. Xáo thứ tự mỗi ghế. Tên chỉ hiện ở giao diện. Căn cứ: Choi và cộng sự, ACL 2026; llm-council |
| 2 | **Luật dẫn: máy kiểm điều luật** (mở rộng `luat-so.mjs` thành `luat-dan.mjs`) | 5, 11 | 5 | M | ★★★ | Tách mọi viện dẫn "Điều X khoản Y Luật/Nghị định số …" và so với `sources.md` của bộ não pháp lý (số hiệu, hiệu lực, TÌNH TRẠNG). Gắn cờ: không có trong kho, hết hiệu lực, chưa kiểm quá 90 ngày. Văn bản hết hiệu lực thì **chặn** kết luận. Cơ chế giống Shepard's Verify, nhưng chạy offline |
| 3 | **Dựng xong gói `phap-ly-nnn`**: 9 agent và bộ não có `sources.md` theo spec | 5, 10 | 5 | M | ★★★ | Hiện `.claude/agents/` chưa có ghế pháp lý. Nguồn ưu tiên: vbpl.vn, phapluat.gov.vn, chinhphu.vn, xuatnhapcanh.gov.vn, dichvucong.gov.vn. Ghi ngày kiểm 26/10/2026 |
| 4 | **Checklist hồ sơ theo loại thủ tục** (GPLĐ, miễn GPLĐ, TRC, e-visa, gia hạn, IRC/ERC, lý lịch tư pháp, hợp pháp hoá) | 10 | 5 | M | ★★★ | File dữ liệu `nganh/phap-ly-nnn/thu-tuc/*.json`: giấy tờ, yêu cầu hợp pháp hoá hoặc dịch thuật, cơ quan, thời hạn luật định, căn cứ (mã nguồn). Hội đồng và thư ký **dùng checklist làm tờ sự thật**. Bảng rà soát kiểu Harvey: dòng là giấy tờ, cột là kiểm tra |
| 5 | **Máy tính hạn tự động** | 10, 9 | 5 | S–M | ★★★ | Từ ngày hết hạn visa, TRC, GPLĐ hoặc hộ chiếu, tính ngược mốc nộp (ví dụ phải nộp trước X ngày làm việc), trừ ngày nghỉ lễ VN. Mỗi số ngày có căn cứ điều luật hoặc nhãn THỰC TIỄN. Ghi vào sổ phiếu cùng nhắc lịch. Số ngày là quy tắc mã nên không bao giờ do model bịa |
| 6 | **Bảo mật hộ chiếu: che dữ liệu cá nhân trước khi gửi model** | 11 | 5 | M | ★★★ | Lớp `che-du-lieu.mjs`: nhận dạng số hộ chiếu, MRZ, số thị thực, ngày sinh, mã định danh, rồi thay bằng token (`[HC_1]`) và chỉ khôi phục ở đầu ra cục bộ. Thêm hạn lưu `sessions/` và lệnh xoá, nhật ký truy cập, mẫu đồng ý của khách theo Luật 91/2025 và Nghị định 356/2025 |
| 7 | **Dự báo có xác suất và chấm Brier khi tới hạn xem lại** | 7, 9 | 4 | S–M | ★★ | Kết luận thêm `du_bao: [{menh_de, xac_suat, han}]`. Khi tới hạn trong `00-so-phieu.md`, người dùng đánh Đúng/Sai, máy tính Brier theo ghế và theo trụ. Sau khoảng 30 phiếu thì dùng làm trọng số hiệu chỉnh. Căn cứ: Tetlock; Schoenegger 2024 |
| 8 | **Pre-mortem bắt buộc** trong vòng 1 và **bảng rủi ro không đảo ngược** cho pháp lý | 8 | 4 | S | ★★★ | Thêm trường `PRE-MORTEM:` vào Round 1 (`round-prompts.md`, `round1Prompt`). Ở gói pháp lý, ghế `tuanthu` liệt kê hậu quả theo mức: phạt tiền, buộc xuất cảnh, cấm nhập cảnh, ảnh hưởng hồ sơ tương lai |
| 9 | **Lưu điểm vòng 1 và quy tắc "đổi điểm phải có bằng chứng mới"** | 3, 6 | 4 | S | ★★ | Hiện cả điểm vòng 1 lẫn vòng cuối. Thẻ đổi ý mà không nêu bằng chứng hay lập luận mới thì không được tính phần đổi. Báo "chỉ số a dua" = tỉ lệ đổi không bằng chứng. Căn cứ: Debate or Vote; Talk Isn't Always Cheap |
| 10 | **Chế độ khách hàng song ngữ Việt/Anh/Trung/Hàn** | 10, 12 | 4 | M | ★★★ | Phiếu tóm tắt cho khách (một trang): kết luận, giấy tờ cần, hạn, chi phí, rủi ro, có nhãn AI và người duyệt. Bảng thuật ngữ chuẩn (GPLĐ = work permit = 工作许可证 = 노동허가). Giữ số hiệu văn bản nguyên gốc. Văn bản nội bộ vẫn tiếng Việt |
| 11 | **Mẫu báo giá gắn kết luận** | 10 | 4 | S–M | ★★★ | Từ thủ tục và checklist (hạng 4), sinh báo giá: hạng mục, phí nhà nước (có căn cứ, ví dụ thông tư phí, nhãn CẦN KIỂM TRA nếu chưa xác minh), phí dịch vụ lấy từ bảng giá **của văn phòng** (tờ sự thật, không bịa), thời gian, điều kiện. Xuất PDF song ngữ |
| 12 | **Hai họ model trở lên** cho ghế phản biện và Chủ toạ kiểm | 3, 6 | 3 | M | ★★ | Cho `SEAT_MODEL` theo từng ghế. Bước kiểm kết luận dùng một "bồi thẩm" 2–3 model nhỏ khác họ để chấm "kết luận có bám thẻ, có bịa không". Căn cứ: ReConcile; PoLL |
| 13 | **Thẻ Decision Quality** trong kết luận | 1, 2, 6 | 3 | S | ★★ | Sáu mắt xích, mỗi mắt 0–100%, chỉ mắt yếu nhất và việc để nâng nó. Hiện bảng trụ (đánh giá trung gian) trước điểm tổng, theo MAP |
| 14 | **Bộ đề chuẩn và noise audit** | 12 | 4 | M | ★★ | 30–50 ca: ca nội bộ đã có kết quả thật (ẩn danh hoá), một phần VLegal-Bench, và ca "bẫy" (văn bản hết hiệu lực, số không nguồn). Chạy mỗi lần đổi prompt hay model. Đo độ lệch kết luận giữa 3 lần chạy, tỉ lệ trích dẫn sai, chỉ số a dua |
| 15 | **Người duyệt trước khi gửi khách** và nhật ký duyệt | 11, 9 | 3 | S | ★★★ | Trạng thái phiếu: nháp → luật sư duyệt → gửi. Mỗi điều luật hoặc số liệu có ô "đã kiểm" theo tên người kiểm. Có nhãn AI theo Luật 134/2025 |

**Ngoài top 15, nên làm sau:** khởi tạo đa dạng có chủ đích (một ghế phải viết phương án "ngược"); bảo vệ thiểu số tự động kiểu Minority Sentinel khi đã đủ dữ liệu; kế hoạch nghiên cứu hiển thị trước khi chạy (kiểu CoCounsel Deep Research); cộng tác nhiều người trên một phiếu; theo dõi thay đổi luật (khi văn bản trong `sources.md` bị sửa hay thay thì đánh dấu mọi phiếu đang mở có dùng văn bản đó); nhập giấy tờ bằng OCR, đối chiếu tên trên hộ chiếu với các giấy tờ khác.

---

## 6. Lộ trình gợi ý

| Giai đoạn | Thời gian | Hạng mục | Kết quả đo được |
|---|---|---|---|
| 1. Chống đồng thuận giả và rủi ro | 1–2 tuần | 1, 8, 9, 13 | Có chỉ số a dua mỗi phiên. Có điểm vòng 1. Có pre-mortem |
| 2. Nền móng pháp lý | 3–5 tuần | 3, 2, 4, 5, 6, 15 | Gói pháp lý chạy được. 0 văn bản hết hiệu lực lọt qua bộ đề bẫy. Hộ chiếu không rời máy ở dạng rõ |
| 3. Sản phẩm cho khách | 2–3 tuần | 10, 11 | Phiếu khách và báo giá 4 ngôn ngữ, có người duyệt |
| 4. Học và đo | liên tục | 7, 12, 14 | Brier theo ghế. Báo cáo nhiễu hằng tháng. Rubric từ 100/120 trở lên |

---

## 7. Điều không nên làm

- Không quảng bá "không ảo giác" hay "đúng 100% luật". Ngay cả Lexis và Westlaw cũng không đạt.
- Không thêm vòng tranh luận thứ 4 hay thứ 5 để "chắc hơn". Bằng chứng cho thấy thêm vòng làm tăng a dua mà không tăng độ đúng.
- Không cam kết tỉ lệ đậu hay thời hạn với khách. Spec gói ngành đã cấm, nên giữ cấm trong phiếu khách và báo giá.
- Không gửi bản quét hộ chiếu nguyên vẹn lên model đám mây khi chưa che, chưa có đồng ý và chưa có hạn lưu.
- Không dựa vào nguồn thứ cấp (Thư viện Pháp luật, bài báo) làm căn cứ duy nhất. Chỉ dùng để đối chiếu. Căn cứ phải là Công báo, vbpl.vn hoặc phapluat.gov.vn.

---

## 8. Nguồn

Ngày truy cập chung: 26/10/2026. Nguồn đánh dấu (*) là nguồn thứ cấp hoặc nhà cung cấp tự công bố.

**Hội đồng LLM và sản phẩm cùng loại**
- karpathy/llm-council (11/2025): https://github.com/karpathy/llm-council
- Tổng quan llm-council (*): https://www.analyticsvidhya.com/blog/2025/12/llm-council-by-andrej-karpathy/ ; https://www.sourcepulse.org/projects/19294036
- nateherkai/roast-room: https://github.com/nateherkai/roast-room ; danh sách fork: https://github.com/nateherkai/roast-room/forks?sort=stargazers
- JamoutAi/seat-at-the-table: https://github.com/JamoutAi/seat-at-the-table ; https://jamout.ai/seat-at-the-table
- llm-council-skill (gcpdev) (*): https://gittrend.io/repo/gcpdev/llm-council-skill
- Registry skill hội đồng (*): https://claudskills.com/skills/llm-council-skill-shuntacurosu-llm-council-skill/ ; https://claudskills.com/skills/decision-council/ ; https://claudskills.com/skills/council-mode/
- AI board of advisors (*): https://thesolocreators.com/learn/ai-board-of-advisors/ ; https://buttondown.com/ptsawyer/archive/i-built-an-ai-board-of-advisors-for-my-business/

**Legal AI quốc tế**
- Harvey, bản tin 4/2026 và 5/2026 (*): https://www.harvey.ai/en-US/blog/the-brief-april-2026 ; https://www.harvey.ai/blog/the-brief-may-2026 ; https://releases.sh/release/rel__Oof-GkMaR7xOAYbNMZbZ
- CoCounsel Legal thế hệ mới (20/8/2026) (*): https://www.thomsonreuters.com/en/press-releases/2026/august/thomson-reuters-launches-next-generation-of-cocounsel-legal-the-ai-ecosystem-built-for-legal-professionals ; https://www.thomsonreuters.com/en-us/posts/innovation/cocounsel-legal-august-2026-releases/
- Lexis+ với Protégé, Shepard's (*): https://www.vaquill.ai/blog/lexis-plus-ai-review-honest-assessment
- Luminance (*): https://www.luminance.com/press/luminance-enhances-the-legal-industrys-only-100-ai-autonomous-contract-negotiation-tool-to-show-the-why-behind-every-decision-and-opens-it-to-the-entire-enterprise/ ; https://www.lexisnexis.com/community/pressroom/b/news/posts/lexisnexis-and-luminance-announce-strategic-alliance-to-extend-authoritative-legal-ai-content-and-technology-into-enterprise-contract-workflows
- Legora (21/10/2026) (*): https://siliconangle.com/2026/10/21/legal-ai-startup-legora-raises-550m-at-8-8b-to-change-the-face-of-law/
- Magesh và cộng sự, "Hallucination-Free? Assessing the Reliability of Leading AI Legal Research Tools", JELS 2025: https://law.stanford.edu/publications/hallucination-free-assessing-the-reliability-of-leading-ai-legal-research-tools ; PDF: https://dho.stanford.edu/wp-content/uploads/Legal_RAG_Hallucinations.pdf
- Vụ việc ảo giác trước toà (Charlotin database) (*): https://library.law.unc.edu/2026/06/handling-hallucinations-a-reflection/ ; https://www.malaymail.com/news/tech-gadgets/2026/06/16/do-your-job-global-courts-face-rising-tide-of-ai-generated-fake-cases-and-quotes/223865

**AI pháp lý Việt Nam**
- Ứng dụng AI trong pháp luật (*): https://danchuphapluat.vn/ung-dung-ai-trong-linh-vuc-phap-luat-tu-thuc-tien-quoc-gia-den-hop-tac-khu-vuc-10163.html
- AI Luật (*): https://hethongphapluat.com/phap-luat/the/ai-luat.html
- Clex của CMC (*): https://thitruongtaichinhtiente.vn/cmc-openai-khang-dinh-nang-luc-lam-chu-cong-nghe-ai-phap-ly-tai-dien-dan-phap-luat-asean-2026-85041.html
- FPT AI-powered Justice (*): https://tapchicongthuong.vn/tap-doan-fpt-gioi-thieu-he-sinh-thai-ai-powered-justice-tai-dien-dan-phap-luat-asean-2026-543201.htm
- Trợ lý AI cho toà án của Viettel (*): https://daibieunhandan.vn/viettel-thu-nghiem-thanh-cong-tro-ly-ai-cho-he-thong-toa-an-viet-nam-10318687.html
- VLegal-Bench (arXiv 2512.14554, 2025): https://arxiv.org/abs/2512.14554
- VLQA (arXiv 2507.19995, 2025): https://www.emergentmind.com/papers/2507.19995
- URASys: https://github.com/ura-hcmut/URASys
- VLSP 2025 legal: https://preview.aclanthology.org/anlp-naacl/2025.vlsp-1.23.pdf

**Tranh luận đa tác tử, a dua, giám khảo**
- Du và cộng sự, "Improving Factuality and Reasoning in Language Models through Multiagent Debate", 2023: https://arxiv.org/abs/2305.14325
- Liang và cộng sự, "Encouraging Divergent Thinking in LLMs through Multi-Agent Debate", 2023: https://arxiv.org/abs/2305.19118
- Choi, Zhu, Li, "Debate or Vote", NeurIPS 2025: https://arxiv.org/abs/2508.17536
- Zhu và cộng sự, "Demystifying Multi-Agent Debate: The Role of Confidence and Diversity", Findings ACL 2026: https://arxiv.org/abs/2601.19921
- Chen, Saha, Bansal, "ReConcile", ACL 2024: https://arxiv.org/abs/2309.13007
- "Minority Sentinel", arXiv 6/2026: https://arxiv.org/abs/2606.29270
- "Multi-Agent Debate Strategies: Survey, Taxonomy, and Challenges", arXiv 7/2026: https://arxiv.org/html/2607.26212v1
- "Peacemaker or Troublemaker: How Sycophancy Shapes Multi-Agent Debate", 2025: https://arxiv.org/abs/2509.23055
- Wynn, Satija, Hadfield, "Talk Isn't Always Cheap", 2025: https://arxiv.org/abs/2509.05396
- Choi và cộng sự, "When Identity Skews Debate: Anonymization for Bias-Reduced Multi-Agent Reasoning", ACL 2026: https://arxiv.org/abs/2510.07517
- "The Cost of Consensus", arXiv 5/2026: https://arxiv.org/abs/2605.00914
- "Too Polite to Disagree", arXiv 4/2026: https://arxiv.org/abs/2604.02668
- Sharma và cộng sự, "Towards Understanding Sycophancy in Language Models", 2023: https://arxiv.org/abs/2310.13548
- Zheng và cộng sự, "Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena", 2023: https://arxiv.org/abs/2306.05685
- Wataoka và cộng sự, "Self-Preference Bias in LLM-as-a-Judge", 2024: https://arxiv.org/abs/2410.21819
- "A Survey on LLM-as-a-Judge", 2024: https://arxiv.org/abs/2411.15594
- Verga và cộng sự, "Replacing Judges with Juries (PoLL)", 2024: https://arxiv.org/abs/2404.18796

**Grounding, ảo giác, hiệu chỉnh, dự báo**
- Gao và cộng sự, "Enabling LLMs to Generate Text with Citations (ALCE)", 2023: https://arxiv.org/abs/2305.14627
- Dhuliawala và cộng sự, "Chain-of-Verification", 2023: https://arxiv.org/abs/2309.11495
- Min và cộng sự, "FActScore", 2023: https://arxiv.org/abs/2305.14251
- Wang và cộng sự, "Self-Consistency", 2022: https://arxiv.org/abs/2203.11171
- Kadavath và cộng sự, "Language Models (Mostly) Know What They Know", 2022: https://arxiv.org/abs/2207.05221
- Xiong và cộng sự, "Can LLMs Express Their Uncertainty?", ICLR 2024: https://arxiv.org/abs/2306.13063
- "Wired for Overconfidence", arXiv 4/2026: https://arxiv.org/abs/2604.01457
- Findings ACL 2026 về tự tin với đáp án của chính model: https://aclanthology.org/2026.findings-acl.1570.pdf
- Schoenegger, Tuminauskaite, Park, Tetlock, "Wisdom of the Silicon Crowd", *Science Advances* 2024: https://arxiv.org/abs/2402.19379
- Halawi và cộng sự, "Approaching Human-Level Forecasting with Language Models", 2024: https://arxiv.org/abs/2402.18563

**Ra quyết định ở người**
- Dalkey & Helmer, "An Experimental Application of the Delphi Method to the Use of Experts", RAND/Management Science 1963: https://www.rand.org/pubs/research_memoranda/RM727z1.html
- Rowe & Wright, "The Delphi technique as a forecasting tool: issues and analysis", *International Journal of Forecasting* 1999: https://doi.org/10.1016/S0169-2070(99)00018-7
- Klein, "Performing a Project Premortem", HBR 2007: https://hbr.org/2007/09/performing-a-project-premortem
- Mitchell, Russo & Pennington, "Back to the future: Temporal perspective in the explanation of events", *J. Behavioral Decision Making* 1989: https://doi.org/10.1002/bdm.3960020103
- Nemeth và cộng sự, "Devil's advocate versus authentic dissent", *European Journal of Social Psychology* 2001: https://doi.org/10.1002/ejsp.58
- Zenko, *Red Team: How to Succeed by Thinking Like the Enemy*, Basic Books 2015
- Spetzler, Winter & Meyer, *Decision Quality*, Wiley 2016: https://www.designative.info/2025/07/22/book-review-decision-quality-carl-spetzler-hannah-winter-jennifer-meyer/ ; SDG: https://sdg.com/wp-content/uploads/2024/03/Closing-the-Decision-Quality-Gap_gn3.pdf
- Kahneman, Sibony & Sunstein, *Noise: A Flaw in Human Judgment*, 2021. Kahneman và cộng sự, "Noise: How to Overcome the High, Hidden Cost of Inconsistent Decision Making", HBR 2016: https://hbr.org/2016/10/noise
- Kahneman, Lovallo & Sibony, "A Structured Approach to Strategic Decisions", *MIT Sloan Management Review* 2019: https://sloanreview.mit.edu/article/a-structured-approach-to-strategic-decisions/ ; https://www.theuncertaintyproject.org/tools/the-mediating-assessments-protocol
- Tetlock & Gardner, *Superforecasting*, 2015
- Stasser & Titus, "Pooling of unshared information in group decision making", *JPSP* 1985: https://doi.org/10.1037/0022-3514.48.6.1467
- Janis, *Victims of Groupthink*, 1972

**Pháp lý Việt Nam áp lên sản phẩm** (cần đối chiếu Công báo hoặc vbpl.vn trước khi viện dẫn chính thức)
- Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15 (*): https://vcci.com.vn/tin-tuc/luat-bao-ve-du-lieu-ca-nhan-luu-y-ve-hanh-lang-phap-ly-moi-cho-doanh-nghiep ; PwC 1/2026: https://www.pwc.com/vn/vn/publications/2026/20260128-new-rules-personal-data-protection.pdf
- Nghị định 356/2025/NĐ-CP (để đối chiếu): https://thuvienphapluat.vn/van-ban/Quyen-dan-su/Nghi-dinh-356-2025-ND-CP-huong-dan-Luat-Bao-ve-du-lieu-ca-nhan-687428.aspx
- Luật Trí tuệ nhân tạo 134/2025/QH15 (hiệu lực 01/3/2026) (*): https://apolatlegal.com/vi/laws/luat-tri-tue-nhan-tao-2025-so-134-2025-qh15/ ; https://www.vietnamplus.vn/6-luat-co-hieu-luc-tu-ngay-132026-hoan-thien-the-che-khoi-thong-nguon-luc-post1096215.html
