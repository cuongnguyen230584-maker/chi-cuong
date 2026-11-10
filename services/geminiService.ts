import { ProductInfo, PipelineConfig, CampaignContent } from "../types";
import { GeminiCore, VideoStatus } from "./geminiCore";

// Trong Google AI Studio, khóa do AI Studio cấp và gọi Gemini trực tiếp.
// Ở mọi nơi khác, trình duyệt chỉ gọi máy chủ /api (server.ts); khóa nằm trên máy chủ.
export const isAIStudio = () => typeof window !== 'undefined' && !!(window as any).aistudio;

const getStudioKey = (): string =>
  (typeof process !== 'undefined' && process.env?.API_KEY) || '';

const VIDEO_TIMEOUT_MS = 10 * 60_000;

async function callApi<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`/api/${path}`, body === undefined ? undefined : {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Máy chủ trả về lỗi ${res.status}`);
  return data as T;
}

export class GeminiService {
  private core() {
    return new GeminiCore(getStudioKey());
  }

  async isServerConfigured(): Promise<boolean> {
    try {
      const { configured } = await callApi<{ configured: boolean }>('health');
      return configured;
    } catch {
      return false;
    }
  }

  async analyzeProduct(base64: string): Promise<Partial<ProductInfo>> {
    if (isAIStudio()) return this.core().analyzeProduct(base64);
    return callApi('analyze-product', { base64 });
  }

  async analyzeVideo(videoBase64: string, prompt: string): Promise<string> {
    if (isAIStudio()) return this.core().analyzeVideo(videoBase64, prompt);
    const { text } = await callApi<{ text: string }>('analyze-video', { videoBase64, prompt });
    return text;
  }

  async generate4KVisuals(config: PipelineConfig): Promise<string[]> {
    if (isAIStudio()) return this.core().generate4KVisuals(config);
    const { images } = await callApi<{ images: string[] }>('generate-visuals', { config });
    return images;
  }

  async generateMarketingContent(info: ProductInfo): Promise<CampaignContent> {
    if (isAIStudio()) return this.core().generateMarketingContent(info);
    return callApi('marketing-content', { info });
  }

  async generateVideoCommercial(config: PipelineConfig): Promise<string> {
    try {
      const studio = isAIStudio();
      const name = studio
        ? await this.core().startVideoCommercial(config)
        : (await callApi<{ name: string }>('video/start', { config })).name;

      const deadline = Date.now() + VIDEO_TIMEOUT_MS;
      let status: VideoStatus = { done: false };
      while (!status.done) {
        if (Date.now() > deadline) throw new Error("Tạo video quá 10 phút chưa xong. Vui lòng thử lại sau.");
        await new Promise(r => setTimeout(r, 10000));
        status = studio
          ? await this.core().getVideoStatus(name)
          : await callApi<VideoStatus>(`video/status?name=${encodeURIComponent(name)}`);
      }
      if (status.error || !status.uri) throw new Error(status.error || "Không nhận được video.");

      if (!studio) return `/api/video/file?name=${encodeURIComponent(name)}`;
      const res = await fetch(`${status.uri}&key=${getStudioKey()}`);
      const blob = await res.blob();
      return URL.createObjectURL(blob);
    } catch (error: any) {
      console.error("Lỗi tạo video:", error);
      throw error;
    }
  }
}

export const gemini = new GeminiService();
