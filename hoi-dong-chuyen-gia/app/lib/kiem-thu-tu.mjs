// Máy kiểm thứ tự thủ tục: trong "Việc làm tiếp theo" của kết luận, bước nào phải có trước bước nào.
// Quy tắc theo trình tự hồ sơ người nước ngoài thường gặp; mỗi quy tắc ghi căn cứ ngắn. Máy dò theo từ khoá
// nên chỉ là cảnh báo để Chủ toạ và người đọc kiểm lại, không phải bằng chứng sai.

const QUY_TAC = [
  {
    truoc: /giấy phép lao động|gplđ|xác nhận (?:không thuộc diện|miễn)|miễn giấy phép/i,
    sau: /thẻ tạm trú|trc\b|ký hiệu lđ/i,
    // thẻ tạm trú LĐ cần GPLĐ hoặc xác nhận miễn
    ly_do: "Thẻ tạm trú ký hiệu LĐ cần có giấy phép lao động hoặc xác nhận miễn trước (Luật 47/2014/QH13, sửa đổi; NĐ 219/2025/NĐ-CP).",
  },
  {
    truoc: /công văn nhập cảnh|thư mời|bảo lãnh nhập cảnh|duyệt nhân sự/i,
    sau: /cấp thị thực|dán visa|nhận thị thực|nhập cảnh vào/i,
    ly_do: "Thị thực cấp theo diện bảo lãnh cần có văn bản duyệt nhân sự / công văn nhập cảnh trước.",
  },
  {
    truoc: /đăng ký góp vốn|đăng ký mua cổ phần|đăng ký mua phần vốn|chấp thuận góp vốn|m&a approval/i,
    sau: /thanh toán|chuyển tiền|chuyển nhượng xong|ký hợp đồng chuyển nhượng.*hiệu lực/i,
    ly_do: "Góp vốn, mua phần vốn thuộc diện phải đăng ký thì đăng ký trước, thanh toán qua tài khoản vốn đầu tư trực tiếp sau (Luật 143/2025/QH15; TT 38/2026/TT-NHNN).",
  },
  {
    truoc: /hợp pháp hoá|hợp pháp hóa|chứng nhận lãnh sự|apostille/i,
    sau: /dịch (?:và )?công chứng|dịch thuật công chứng|chứng thực bản dịch/i,
    ly_do: "Giấy tờ nước ngoài được hợp pháp hoá lãnh sự hoặc Apostille trước, rồi mới dịch và chứng thực bản dịch.",
  },
];

/** Các vi phạm thứ tự trong danh sách bước (mảng chuỗi theo thứ tự): [{ truoc, sau, ly_do }]. */
export function kiemThuTu(buoc) {
  const ds = (buoc || []).map((b) => String(typeof b === "string" ? b : `${b.when || ""} ${b.action || ""}`));
  const out = [];
  for (const q of QUY_TAC) {
    const iTruoc = ds.findIndex((b) => q.truoc.test(b));
    const iSau = ds.findIndex((b) => q.sau.test(b) && !q.truoc.test(b));
    // chỉ báo khi cả hai bước đều có và bước "sau" đứng trước (thiếu hẳn một bước có thể là đúng, ví dụ diện miễn)
    if (iSau >= 0 && iTruoc >= 0 && iSau < iTruoc) {
      out.push({ truoc: ds[iTruoc].slice(0, 120), sau: ds[iSau].slice(0, 120), ly_do: q.ly_do });
    }
  }
  return out;
}
