import express from 'express';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import { fileURLToPath } from 'url';
import { GeminiCore } from './services/geminiCore';

// Máy chủ trung gian: giữ GEMINI_API_KEY ở phía máy chủ, trình duyệt chỉ gọi /api.
const root = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === 'production';
for (const file of ['.env.local', '.env']) {
  const envPath = path.join(root, file);
  if (fs.existsSync(envPath)) process.loadEnvFile(envPath);
}
const apiKey = process.env.GEMINI_API_KEY || '';
const port = Number(process.env.PORT) || 3000;

const core = new GeminiCore(apiKey);
const app = express();
app.use(express.json({ limit: '60mb' }));

type Handler = (req: express.Request, res: express.Response) => Promise<unknown>;
const route = (handler: Handler): express.RequestHandler => async (req, res) => {
  if (!apiKey) {
    res.status(503).json({ error: 'Máy chủ chưa cấu hình GEMINI_API_KEY trong file .env.local.' });
    return;
  }
  try {
    await handler(req, res);
  } catch (e: any) {
    console.error(`Lỗi ${req.path}:`, e);
    if (!res.headersSent) res.status(e.status || 500).json({ error: e.message || 'Lỗi máy chủ.' });
  }
};

app.get('/api/health', (_req, res) => {
  res.json({ configured: !!apiKey });
});

app.post('/api/analyze-product', route(async (req, res) => {
  res.json(await core.analyzeProduct(req.body.base64));
}));

app.post('/api/analyze-video', route(async (req, res) => {
  res.json({ text: await core.analyzeVideo(req.body.videoBase64, req.body.prompt) });
}));

app.post('/api/generate-visuals', route(async (req, res) => {
  res.json({ images: await core.generate4KVisuals(req.body.config) });
}));

app.post('/api/marketing-content', route(async (req, res) => {
  res.json(await core.generateMarketingContent(req.body.info));
}));

app.post('/api/video/start', route(async (req, res) => {
  res.json({ name: await core.startVideoCommercial(req.body.config) });
}));

app.get('/api/video/status', route(async (req, res) => {
  res.json(await core.getVideoStatus(String(req.query.name || '')));
}));

app.get('/api/video/file', route(async (req, res) => {
  const status = await core.getVideoStatus(String(req.query.name || ''));
  if (!status.uri) {
    res.status(404).json({ error: status.error || 'Video chưa sẵn sàng.' });
    return;
  }
  const upstream = await core.downloadVideo(status.uri);
  if (!upstream.ok || !upstream.body) {
    res.status(502).json({ error: `Không tải được video (mã ${upstream.status}).` });
    return;
  }
  res.setHeader('Content-Type', upstream.headers.get('content-type') || 'video/mp4');
  Readable.fromWeb(upstream.body as any).pipe(res);
}));

if (isProd) {
  const dist = path.join(root, 'dist');
  app.use(express.static(dist));
  app.get(/^(?!\/api\/).*/, (_req, res) => res.sendFile(path.join(dist, 'index.html')));
} else {
  const { createServer } = await import('vite');
  const vite = await createServer({ root, server: { middlewareMode: true }, appType: 'spa' });
  app.use(vite.middlewares);
}

app.listen(port, '0.0.0.0', () => {
  console.log(`CHICUONG AI chạy tại http://localhost:${port}`);
  if (!apiKey) console.warn('Cảnh báo: chưa có GEMINI_API_KEY trong .env.local, các chức năng AI sẽ báo lỗi.');
});
