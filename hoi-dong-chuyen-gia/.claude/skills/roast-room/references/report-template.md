# Mẫu báo cáo (kết luận của Chủ toạ)

Chủ toạ viết bằng tiếng Việt trang trọng, câu ngắn. Không dùng gạch ngang dài. Không sáo rỗng: mỗi ý nói một lần, không rào đón, không "vấn đề ở đây là". Lời trích của từng ghế giữ nguyên giọng của ghế đó; câu trích nguyên văn từ bộ não giữ ngôn ngữ gốc, có mã nguồn, có thể kèm lời dịch tiếng Việt. Cả báo cáo dưới khoảng 1.000 từ; chi tiết nằm trong các file vòng. Viết số kiểu Việt: 7,5 (thập phân), 1.000 (nghìn). Báo cáo tham khảo: `sessions/2026-10-09-example-take-the-seed/verdict.md`.

Nhãn kết luận trong báo cáo ghi tiếng Việt: LÀM, LÀM CÓ ĐIỀU KIỆN, ĐIỀU CHỈNH, CHỜ, KHÔNG LÀM. Trường `label` trong `verdict.json` và `draft.json` vẫn giữ mã tiếng Anh (GO, GO WITH CONDITIONS, RESHAPE, WAIT, DON'T DO IT) vì phòng họp đọc theo mã đó (xem `live-room.md`).

```markdown
# Hội đồng chuyên gia: [quyết định, vài chữ]

[dd/mm/yyyy] · Ghế: [danh sách] · Số vòng: [n] · Chế độ: [đầy đủ | nhanh | ghế chỉ định]

## Kết luận: [LÀM | LÀM CÓ ĐIỀU KIỆN | ĐIỀU CHỈNH | CHỜ | KHÔNG LÀM]

**Quyết định đề xuất:** [một hoặc hai câu người hỏi làm theo được, nêu rõ phương án]

Điểm các phương án: [A] x,x · [B] x,x · [C] x,x · Mức ủng hộ đề xuất x,x/10 · Độ tin cậy n/10 · Độ chênh n · Phiếu: [n] đồng ý, [n] sửa đổi, [n] phản đối
[Luật điều chỉnh đã áp dụng, nếu có, trong một dòng; không có thì bỏ]

## Bảng điểm

| Ghế | Trọng số | Lập trường cuối | [A] | [B] | [C] | Điểm mảng | Đổi ý? | Câu chốt |
|---|---|---|---|---|---|---|---|---|
| Buffett (tiền và vốn) | 3 | ... | 1 | 6 | 7 | 8 | từ B sang C | "[câu chốt của ghế cho người hỏi]" |

Cách tính: [mỗi phương án một dòng, ví dụ (3×8 + 2×7) / 5 = 7,6]

## Vì sao hội đồng đi đến kết luận này

[3 đến 5 gạch đầu dòng: các lập luận đã thuyết phục hội đồng, mỗi ý ghi ghế và khung lý thuyết, ví dụ (Hormozi, Value Equation)]

## Chỗ họ tranh cãi

[Mỗi điểm vênh một đoạn ngắn: câu hỏi, ai đứng bên nào, ai đổi ý và vì sao, kết quả ra sao hoặc vì sao chưa ngã ngũ]

## Ý kiến thiểu số

[Ý kiến phản đối hoặc thiểu số mạnh nhất, bằng lời của ghế đó, và điều gì phải đúng để họ đúng. Nếu mọi ghế đồng ý, ghi rõ như vậy và nêu giả định ít được kiểm chứng nhất.]

## Điều kiện

[Mỗi điều kiện kiểm được: một con số, một mốc ngày hoặc một kết quả thử. Ghi rõ điều kiện nào phải đạt trước bước không quay lại được.]

## Việc làm tiếp theo

1. Tuần này: [việc] (người phụ trách)
2. [Mốc tiếp theo, có ngày]
3. [Ngày ra quyết định]

**Cách thử rẻ nhất:** [việc nhỏ nhất kiểm được giả định rủi ro nhất trước khi cam kết]
**Dừng nếu:** [tín hiệu cho thấy phải dừng, và khi đó làm gì]
**Xem lại vào:** [khi nào đưa việc này trở lại hội đồng, mang theo số liệu nào]

---
Cố vấn mô phỏng, dựng từ tác phẩm công khai của từng người. Họ không phải người thật và không phát ngôn thay những người đó.
```
