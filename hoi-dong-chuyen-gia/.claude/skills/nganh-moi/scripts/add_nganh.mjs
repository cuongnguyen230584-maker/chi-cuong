#!/usr/bin/env node
// Khai báo (hoặc cập nhật) một gói ngành trong roster.json, sau khi các ghế của gói đã có agent và não.
// Ghế phải đã được thêm bằng add_seat.mjs với --nganh <key> --loai vai-tro.
//
//   node .claude/skills/nganh-moi/scripts/add_nganh.mjs --key y-te --ten "Y tế – phòng khám" \
//     --mo-ta "..." --chair chutoayte --default bacsi,duocsi,... --tu-khoa "phòng khám,giấy phép hành nghề,..."
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "..");
const SKILL = path.join(ROOT, ".claude", "skills", "roast-room");
const ROSTER = path.join(SKILL, "roster.json");

const args = process.argv.slice(2);
const opt = (n) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : undefined; };
const list = (v) => String(v || "").split(",").map((x) => x.trim()).filter(Boolean);
const fail = (m) => { console.error("add_nganh: " + m); process.exit(1); };

const g = {
  key: (opt("key") || "").toLowerCase(),
  ten: opt("ten"),
  mo_ta: opt("mo-ta") || "",
  loai: opt("loai") === "nguoi-that" ? "nguoi-that" : "vai-tro",
  chair: (opt("chair") || "").toLowerCase(),
  default: list(opt("default")),
  tu_khoa: list(opt("tu-khoa")).map((w) => w.toLowerCase()),
};
if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(g.key)) fail("--key phải có dạng chu-thuong-gach-ngang");
if (!g.ten) fail("--ten là bắt buộc");
if (!fs.existsSync(path.join(SKILL, "nganh", `${g.key}.md`))) fail(`thiếu nganh/${g.key}.md (bốn mục: Giới thiệu Chủ toạ, Công cụ hỏi, Luật ngành, Tuyên bố)`);

const r = JSON.parse(fs.readFileSync(ROSTER, "utf8"));
const seat = (k) => r.seats.find((s) => s.key === k);
const ofPack = (s) => (s.nganh?.length ? s.nganh : ["kinh-doanh"]).includes(g.key);
if (!g.chair || !seat(g.chair)) fail(`Chủ toạ ${g.chair || "(trống)"} chưa có trong roster: thêm bằng add_seat.mjs trước`);
if (!ofPack(seat(g.chair))) fail(`Chủ toạ ${g.chair} không thuộc gói ${g.key} (thêm --nganh ${g.key} khi add_seat)`);
for (const k of g.default) {
  if (!seat(k)) fail(`ghế ${k} chưa có trong roster`);
  if (!ofPack(seat(k))) fail(`ghế ${k} không thuộc gói ${g.key}`);
  if (k === g.chair) fail("Chủ toạ không ngồi bàn mặc định");
}
if (g.default.length > 9) fail("bàn mặc định tối đa 9 ghế");
if (!g.default.length) fail("--default cần ít nhất 3 ghế");

// roster cũ chưa có gói: gói kinh doanh của bản gốc đứng đầu, giữ nguyên bàn mặc định cũ
r.nganh ||= [{ key: "kinh-doanh", ten: "Kinh doanh – khởi nghiệp", mo_ta: "", loai: "nguoi-that", chair: "musk", default: r.default || [], tu_khoa: [] }];
const at = r.nganh.findIndex((x) => x.key === g.key);
if (at >= 0) r.nganh[at] = g; else r.nganh.push(g);

const line = (o) => JSON.stringify(o);
const out = [
  "{",
  `  "board": ${JSON.stringify(r.board || "default")},`,
  `  "default": [${(r.default || []).map((k) => JSON.stringify(k)).join(", ")}],`,
  `  "nganh": [`,
  r.nganh.map((x) => "    " + line(x)).join(",\n"),
  "  ],",
  `  "seats": [`,
  r.seats.map((s) => "    " + line(s)).join(",\n"),
  "  ]",
  "}",
].join("\n") + "\n";
JSON.parse(out); // không bao giờ ghi một file phòng họp không đọc được
fs.writeFileSync(ROSTER, out);
console.log(`${at >= 0 ? "Cập nhật" : "Thêm"} gói ${g.ten} (${g.key}): Chủ toạ ${seat(g.chair).name}, bàn ${g.default.map((k) => seat(k).short).join(", ")}.`);
