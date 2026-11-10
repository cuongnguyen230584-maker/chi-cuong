// Ngày theo giờ Việt Nam. Tên file và mã phiên dùng ISO (yyyy-mm-dd) để sắp xếp được;
// chữ người đọc dùng dd/mm/yyyy.
export const MUI_GIO = "Asia/Ho_Chi_Minh";

/** Ngày ISO (yyyy-mm-dd) của thời điểm `d` theo giờ Việt Nam. */
export function ngayIso(d = new Date()) {
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-US", { timeZone: MUI_GIO, year: "numeric", month: "2-digit", day: "2-digit" })
    .formatToParts(d).map((x) => [x.type, x.value]));
  return `${p.year}-${p.month}-${p.day}`;
}

/** dd/mm/yyyy để in cho người đọc. Nhận một ngày ISO (yyyy-mm-dd…) hoặc một Date (đổi theo giờ Việt Nam). */
export function ngayVN(x = new Date()) {
  const iso = x instanceof Date ? ngayIso(x) : String(x ?? "");
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : iso;
}
