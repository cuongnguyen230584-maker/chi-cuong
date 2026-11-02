<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1_U5mSjdePzAFe5LlYHokCWHzK6VLod3W

## Chạy trên máy hoặc máy chủ riêng

**Yêu cầu:** Node.js 22 trở lên.

1. Cài thư viện: `npm install`
2. Tạo file `.env.local` ở thư mục gốc với nội dung `GEMINI_API_KEY=khóa_của_anh`
3. Chạy bản phát triển: `npm run dev` rồi mở http://localhost:3000
4. Chạy bản chính thức: `npm run build` rồi `npm start`

Khóa Gemini chỉ nằm trên máy chủ (`server.ts`); trình duyệt gọi qua `/api` và không bao giờ nhận được khóa.
Khi mở trong Google AI Studio, ứng dụng dùng khóa do AI Studio cấp như trước.
