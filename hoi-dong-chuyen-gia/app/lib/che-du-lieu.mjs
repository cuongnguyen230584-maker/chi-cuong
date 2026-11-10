// Che dữ liệu cá nhân trước khi gửi chữ của người hỏi lên model: số hộ chiếu, số định danh, ngày sinh,
// email, số điện thoại, số thị thực hay thẻ tạm trú. Hội đồng không cần những thứ đó để bàn phương án, và
// Luật Bảo vệ dữ liệu cá nhân 2025 đòi hỏi chỉ xử lý dữ liệu ở mức cần thiết. Máy che theo quy tắc,
// nên vẫn có thể sót; ô nhập trên trang nhắc người hỏi không dán giấy tờ.

const MAU = [
  // email trước, để phần số trong email không bị che hai lần
  { loai: "email", re: /[\p{L}\d._%+-]+@[\p{L}\d.-]+\.[\p{L}]{2,}/gu },
  // ngày sinh có nhãn, mọi dạng dd/mm/yyyy, dd-mm-yyyy, dd.mm.yyyy hoặc yyyy-mm-dd ngay sau nhãn
  { loai: "ngày sinh", re: /((?:ngày\s+sinh|sinh\s+ngày|năm\s+sinh|d\.?o\.?b\.?|date\s+of\s+birth|birth\s*date)\s*[:\-]?\s*)(\d{1,2}[\/.\-]\d{1,2}[\/.\-]\d{2,4}|\d{4}-\d{2}-\d{2})/giu, nhom: 2 },
  // số hộ chiếu, thị thực, thẻ, CCCD/CMND có nhãn: che cả chuỗi chữ số ngay sau nhãn
  { loai: "số giấy tờ", re: /((?:hộ\s+chiếu|passport|số\s+hc|hc\s+số|thị\s+thực\s+số|visa\s+(?:no\.?|số)|thẻ\s+tạm\s+trú\s+số|trc\s+(?:no\.?|số)|cccd|cmnd|căn\s+cước(?:\s+công\s+dân)?|định\s+danh(?:\s+cá\s+nhân)?|id\s+(?:no\.?|number))\s*(?:số|no\.?|number|#)?\s*[:\-]?\s*)([A-Z]{0,3}\d[\dA-Z]{5,13})/giu, nhom: 2 },
  // số điện thoại Việt Nam và quốc tế (có thể có dấu cách hay chấm giữa các nhóm)
  { loai: "số điện thoại", re: /(?<![\d\p{L}])(?:\+?84|0)(?:[\s.\-]?\d){9,10}(?![\d\p{L}])/gu },
  { loai: "số điện thoại", re: /(?<![\d\p{L}])\+\d{1,3}(?:[\s.\-]?\d){7,12}(?![\d\p{L}])/gu },
  // số hộ chiếu không nhãn kiểu phổ biến: 1–2 chữ cái in hoa + 7–8 chữ số (B1234567, EA1234567)
  { loai: "số giấy tờ", re: /(?<![\p{L}\d])[A-Z]{1,2}\d{7,8}(?![\p{L}\d])/gu },
  // 12 chữ số liền: số định danh cá nhân
  { loai: "số giấy tờ", re: /(?<![\d.,])\d{12}(?![\d.,])/g },
];

/** Che dữ liệu cá nhân trong `text`. Trả { text, che: [{ loai, so_luong }] }; không che gì thì text như cũ. */
export function cheDuLieu(text) {
  let t = String(text ?? "");
  const dem = {};
  for (const { loai, re, nhom } of MAU) {
    t = t.replace(re, (...m) => {
      dem[loai] = (dem[loai] || 0) + 1;
      if (!nhom) return `[${loai} đã che]`;
      const nhan = m[1];
      return `${nhan}[${loai} đã che]`;
    });
  }
  return { text: t, che: Object.entries(dem).map(([loai, so_luong]) => ({ loai, so_luong })) };
}

/** Một câu báo cho người hỏi biết máy đã che gì; rỗng khi không che. */
export const baoChe = (che) => (che?.length ? `Đã che trước khi gửi hội đồng: ${che.map((c) => `${c.so_luong} ${c.loai}`).join(", ")}.` : "");
