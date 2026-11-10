
import { GoogleGenAI, GenerateVideosOperation, Type } from "@google/genai";
import { PipelineType, ProductInfo, PipelineConfig, CampaignContent } from "../types";

// Nhận định dạng thật của file từ vài byte đầu (ảnh JPG/PNG/WebP/GIF, video MP4/MOV/WebM).
export function mimeOf(base64: string, fallback: string): string {
  if (base64.startsWith('/9j/')) return 'image/jpeg';
  if (base64.startsWith('iVBOR')) return 'image/png';
  if (base64.startsWith('UklGR')) return 'image/webp';
  if (base64.startsWith('R0lGOD')) return 'image/gif';
  if (base64.startsWith('GkXf')) return 'video/webm';
  const head = atob(base64.slice(0, 16));
  if (head.slice(4, 8) === 'ftyp') return head.slice(8, 10) === 'qt' ? 'video/quicktime' : 'video/mp4';
  return fallback;
}

const base64ToBytes = (base64: string) => Uint8Array.from(atob(base64), c => c.charCodeAt(0));

// Gửi kèm trực tiếp tối đa khoảng 20MB mỗi yêu cầu; video lớn hơn phải tải lên Files API trước.
const INLINE_VIDEO_LIMIT = 14_000_000; // ký tự base64 ≈ 10MB video
const IMAGE_CONCURRENCY = 3;

export interface VideoStatus {
  done: boolean;
  uri?: string;
  error?: string;
}

// Logic gọi Gemini dùng chung cho máy chủ (server.ts) và chế độ AI Studio trên trình duyệt.
export class GeminiCore {
  constructor(private readonly apiKey: string) {}

  private getAI() {
    return new GoogleGenAI({ apiKey: this.apiKey });
  }

  private readonly SYSTEM_INSTRUCTION = `
    BẠN LÀ: CHICUONG AI - MASTER OF CINEMATIC VISUALS & PHOTOREALISM (Elite Senior Prompt Architect).
    NHIỆM VỤ: TẠO RA NHỮNG TÁC PHẨM QUẢNG CÁO 4K VỚI ĐỘ CHÂN THỰC KINH NGẠC, SỐNG ĐỘNG TRONG TỪNG CHI TIẾT SIÊU VI.

    CHIẾN LƯỢC ĐẠT ĐỘ CHÂN THỰC 4K TUYỆT ĐỐI:
    1. CHI TIẾT SIÊU VI (MACRO REALISM): Phải hiển thị rõ ràng kết cấu bề mặt (micro-textures): thớ vải, hạt da (skin pores), vân gỗ, độ nhám mịn của kim loại, và các hạt bụi li ti trong không khí dưới ánh sáng mạnh. KHÔNG ĐƯỢC làm mịn (smooth) quá mức.
    2. ÁNH SÁNG VẬT LÝ NÂNG CAO (ADVANCED PBR LIGHTING): Sử dụng Global Illumination, Volumetric lighting (God rays), và Caustics cho chất liệu lỏng/thủy tinh. Ánh sáng phải có độ chuyển tiếp (fall-off) mượt mà, bóng đổ mềm nhưng có chiều sâu (Ambient Occlusion).
    3. HIỆU ỨNG THẤU KÍNH (OPTICAL PERFECTION): Mô phỏng chính xác các loại ống kính nhiếp ảnh chuyên nghiệp (35mm, 50mm, 85mm f/1.2). Độ sâu trường ảnh (Depth of Field) phải tạo hiệu ứng Bokeh tròn trịa, lung linh ở hậu cảnh.
    4. MÀU SẮC SỐNG ĐỘNG (HDR COLOR SCIENCE): Dải tương phản động rộng. Màu sắc phải sâu và có độ bão hòa tinh tế, không được quá rực rỡ một cách ảo tạo. Độ tương phản vi mô (Micro-contrast) cao để làm nổi bật khối.
    5. CHẤT LIỆU CAO CẤP: Đặc biệt chú trọng "Subsurface Scattering" cho da người và các bề mặt mờ để tạo cảm giác có sức sống. Bề mặt bóng phải có phản chiếu (Ray-traced reflections) chính xác của bối cảnh xung quanh.
    6. BẢO TỒN NGUYÊN BẢN (IDENTITY LOCK): Logo, nhãn mác, hình dáng sản phẩm và đặc điểm khuôn mặt người mẫu phải được giữ nguyên vẹn 100%, không biến dạng, không sai lệch font chữ.
  `;

  private async withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 2000): Promise<T> {
    try {
      return await fn();
    } catch (error: any) {
      const isTransientError = 
        error.message?.includes('503') || 
        error.message?.includes('Deadline expired') || 
        error.message?.includes('UNAVAILABLE') ||
        error.message?.includes('429') ||
        error.status === 503 || 
        error.status === 429;

      if (retries > 0 && isTransientError) {
        console.warn(`Gemini API gặp lỗi tạm thời. Thử lại sau ${delay}ms... (Còn ${retries} lần thử)`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.withRetry(fn, retries - 1, delay * 2);
      }
      throw error;
    }
  }

  async analyzeProduct(base64: string): Promise<Partial<ProductInfo>> {
    const ai = this.getAI();
    return this.withRetry(async () => {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            { inlineData: { mimeType: mimeOf(base64, 'image/jpeg'), data: base64 } },
            { text: "Hãy đóng vai chuyên gia Product Analyst. Phân tích ảnh sản phẩm này và trích xuất: Tên sản phẩm, Ngành hàng, 5 Lợi ích cốt lõi (Benefits), USP (Điểm bán hàng độc nhất). Trả về JSON chính xác." }
          ]
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              category: { type: Type.STRING },
              benefits: { type: Type.ARRAY, items: { type: Type.STRING } },
              usp: { type: Type.STRING },
              message: { type: Type.STRING }
            },
            required: ["name", "category", "benefits", "usp"]
          }
        }
      });
      return JSON.parse(response.text || '{}');
    });
  }

  async analyzeVideo(videoBase64: string, prompt: string): Promise<string> {
    const ai = this.getAI();
    const mimeType = mimeOf(videoBase64, 'video/mp4');
    const videoPart = videoBase64.length <= INLINE_VIDEO_LIMIT
      ? { inlineData: { mimeType, data: videoBase64 } }
      : await this.uploadVideo(videoBase64, mimeType);
    return this.withRetry(async () => {
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: {
          parts: [
            videoPart,
            { text: prompt }
          ]
        },
        config: {
          systemInstruction: "Bạn là chuyên gia phân tích video quảng cáo. Hãy xem kỹ video và trả lời chi tiết bằng tiếng Việt.",
        }
      });
      return response.text || "Không có kết quả phân tích.";
    });
  }

  // Tải video lớn lên Files API, chờ Google xử lý xong rồi mới dùng.
  private async uploadVideo(videoBase64: string, mimeType: string) {
    const ai = this.getAI();
    let file = await ai.files.upload({ file: new Blob([base64ToBytes(videoBase64)], { type: mimeType }), config: { mimeType } });
    const deadline = Date.now() + 5 * 60_000;
    while (file.state === 'PROCESSING') {
      if (Date.now() > deadline) throw new Error("Google xử lý video quá 5 phút. Vui lòng thử video ngắn hơn.");
      await new Promise(r => setTimeout(r, 5000));
      file = await ai.files.get({ name: file.name! });
    }
    if (file.state === 'FAILED' || !file.uri) throw new Error("Google không xử lý được video này.");
    return { fileData: { fileUri: file.uri, mimeType: file.mimeType || mimeType } };
  }

  async generate4KVisuals(config: PipelineConfig): Promise<string[]> {
    const ai = this.getAI();
    
    const parts: any[] = [];
    (config.productImages || []).forEach((img, i) => {
      parts.push({ text: `ẢNH THAM CHIẾU SẢN PHẨM ${i+1} (GIỮ NGUYÊN CHI TIẾT GỐC):` });
      parts.push({ inlineData: { mimeType: mimeOf(img, 'image/jpeg'), data: img } });
    });
    
    if (config.iconImage) {
      parts.push({ text: "LOGO/ICON THƯƠNG HIỆU CHÍNH THỨC (PHẢI XUẤT HIỆN SẮC NÉT VÀ NỔI BẬT):" });
      parts.push({ inlineData: { mimeType: mimeOf(config.iconImage, 'image/png'), data: config.iconImage } });
    }
    
    (config.modelImages || []).forEach((img, i) => {
      parts.push({ text: `ẢNH NGƯỜI MẪU THAM CHIẾU ${i+1} (GIỮ ĐÚNG DANH TÍNH, ĐƯỜNG NÉT VÀ THẦN THÁI):` });
      parts.push({ inlineData: { mimeType: mimeOf(img, 'image/jpeg'), data: img } });
    });

    (config.groupModelImages || []).forEach((img, i) => {
      parts.push({ text: `ẢNH THÀNH VIÊN NHÓM ${i+1} (KẾT HỢP VÀO KHUNG HÌNH CHUNG ĐỂ TẠO GROUP LOOK):` });
      parts.push({ inlineData: { mimeType: mimeOf(img, 'image/jpeg'), data: img } });
    });
    
    // Mỗi lần gọi trả về một ảnh, nên gọi đủ số ảnh đã chọn (chạy song song có giới hạn).
    const total = Math.max(1, config.settings.imageCount || 1);
    const renderOne = (index: number) => this.withRetry(async () => {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: { parts: [...parts, { text: this.buildPipelinePrompt(config, index, total) }] },
        config: {
          systemInstruction: this.SYSTEM_INSTRUCTION,
          imageConfig: {
            aspectRatio: config.settings.aspectRatio,
            imageSize: "4K"
          }
        }
      });

      const images: string[] = [];
      response.candidates?.[0]?.content?.parts?.forEach(part => {
        if (part.inlineData) images.push(`data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`);
      });
      return images;
    });

    const images: string[] = [];
    let lastError: unknown = null;
    for (let start = 0; start < total; start += IMAGE_CONCURRENCY) {
      const batch = Array.from({ length: Math.min(IMAGE_CONCURRENCY, total - start) }, (_, i) => renderOne(start + i + 1));
      for (const result of await Promise.allSettled(batch)) {
        if (result.status === 'fulfilled') images.push(...result.value);
        else lastError = result.reason;
      }
    }
    if (images.length === 0 && lastError) throw lastError;
    return images.slice(0, total);
  }

  private buildPipelinePrompt(config: PipelineConfig, index: number, total: number): string {
    const { pipeline, productInfo, settings, iconImage } = config;
    let detail = `SẢN PHẨM: ${productInfo.name}. ĐẶC ĐIỂM USP: ${productInfo.usp}. BỐI CẢNH YÊU CẦU: ${settings.vnContext}. `;
    
    if (iconImage) detail += "Đảm bảo logo thương hiệu được tích hợp một cách chuyên nghiệp, sắc nét từng đường nét trên sản phẩm hoặc bối cảnh. ";
    
    const render = `HÃY RENDER 1 ẢNH: PHIÊN BẢN ${index}/${total}, chọn góc máy và bố cục khác các phiên bản còn lại.`;
    const technicalKeywords = "4K, Ultra-HD, 8k resolution, photorealistic, cinematic lighting, extreme detail, sharp focus, 85mm lens, f/1.8, ray-traced shadows, vibrant HDR colors, subsurface scattering, depth of field, high-end editorial look. ";

    switch (pipeline) {
      case PipelineType.IMAGE_2D:
        return `${detail} ${technicalKeywords} PHONG CÁCH: High-end Commercial Photography. Ánh sáng Studio Softbox mạnh mẽ, tạo khối rõ rệt cho sản phẩm. Ảnh sắc nét tuyệt đối từ tiền cảnh đến trung cảnh. ${render}`;
      case PipelineType.IMAGE_3D:
        const mat = settings.material;
        let matPrompt = '';
        if (mat) {
          matPrompt = `CHẤT LIỆU PBR CHI TIẾT CAO: `;
          if (mat.isGlass) {
            matPrompt += `Thủy tinh cao cấp (Premium Glass) với chỉ số IOR=1.5, độ xuyên thấu hoàn hảo, hiệu ứng Caustics sống động. `;
          }
          matPrompt += `Độ bóng (Glossiness): ${mat.glossiness/100}, Độ nhám vật lý (Roughness): ${mat.roughness/100}, Tính kim loại (Metalness): ${mat.metalness/100}. `;
          matPrompt += `Bề mặt phản xạ ánh sáng chân thực, specular lobes sắc nét. `;
        }
        return `${detail} ${technicalKeywords} ${matPrompt} PHONG CÁCH: 3D Product Mockup siêu thực, chất lượng Unreal Engine 5. Ánh sáng bao quanh cực kỳ mịn màng. Xoay góc Hero Shot đẳng cấp. ${render}`;
      case PipelineType.MODEL_SINGLE:
        return `${detail} ${technicalKeywords} PHONG CÁCH: Professional Fashion Editorial. Người mẫu Việt Nam với làn da thật sự sống động, ánh mắt có thần, đang tương tác tự nhiên với sản phẩm. Ánh sáng tự nhiên kết hợp Fill light. BẢO TỒN DANH TÍNH MẪU. ${render}`;
      case PipelineType.GROUP_SHOOT:
        return `${detail} ${technicalKeywords} PHONG CÁCH: Cinematic Group Portrait / Fashion Show. Kết hợp tất cả các mẫu tham chiếu vào một bối cảnh sang trọng duy nhất. Ánh sáng kịch tính (Dramatic lighting), hiệu ứng khói/bụi nhẹ dưới ánh đèn sân khấu. Tương tác nhóm hoàn hảo. BẢO TỒN DANH TÍNH TỪNG NGƯỜI. ${render}`;
      default:
        return `${detail} ${technicalKeywords} ${render}`;
    }
  }

  async generateMarketingContent(info: ProductInfo): Promise<CampaignContent> {
    const ai = this.getAI();
    const prompt = `Đóng vai Copywriter kỳ cựu tại Việt Nam. Viết chiến dịch marketing cho sản phẩm: ${info.name}. USP: ${info.usp}. Lợi ích: ${info.benefits.join(", ")}. Nền tảng: ${info.platform}. 
    Yêu cầu: Viết Hook cực mạnh, Body đầy đủ thông tin bán hàng, CTA thúc đẩy chuyển đổi cao. 
    Trả về định dạng JSON: { "hook": "...", "body": "...", "cta": "...", "hashtags": ["...", "..."], "schedule": "..." }.`;
    
    return this.withRetry(async () => {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { 
          responseMimeType: "application/json",
          systemInstruction: this.SYSTEM_INSTRUCTION
        }
      });
      return JSON.parse(response.text || '{}');
    });
  }

  async startVideoCommercial(config: PipelineConfig): Promise<string> {
    const ai = this.getAI();
    const videoPrompt = `High-end 4K Cinematic Commercial TVC for ${config.productInfo.name}. Context: ${config.settings.vnContext}. Extreme photorealism, slow-motion details, dynamic lighting, professional color grading, vivid 4K resolution. Single continuous 8-second shot.`;
    const operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: videoPrompt,
      config: { numberOfVideos: 1, resolution: '1080p', aspectRatio: '9:16' }
    });
    if (!operation.name) throw new Error("Gemini không trả về mã tác vụ tạo video.");
    return operation.name;
  }

  async getVideoStatus(operationName: string): Promise<VideoStatus> {
    const ai = this.getAI();
    const pending = new GenerateVideosOperation();
    pending.name = operationName;
    const operation = await ai.operations.getVideosOperation({ operation: pending });
    if (!operation.done) return { done: false };
    if (operation.error) return { done: true, error: JSON.stringify(operation.error) };
    const uri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!uri) return { done: true, error: "Video không được tạo (có thể bị bộ lọc nội dung chặn)." };
    return { done: true, uri };
  }

  // Tải file video từ Google; khóa được gửi qua header thay vì gắn vào URL.
  async downloadVideo(uri: string): Promise<Response> {
    return fetch(uri, { headers: { 'x-goog-api-key': this.apiKey } });
  }
}
