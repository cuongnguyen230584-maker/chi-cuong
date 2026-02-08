
import { GoogleGenAI, Modality, Type } from "@google/genai";
import { PipelineType, ProductInfo, PipelineConfig, CampaignContent } from "../types";

export class GeminiService {
  private getAI() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
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
            { inlineData: { mimeType: 'image/png', data: base64 } },
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
    return this.withRetry(async () => {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: {
          parts: [
            { inlineData: { mimeType: 'video/mp4', data: videoBase64 } },
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

  async generate4KVisuals(config: PipelineConfig): Promise<string[]> {
    const ai = this.getAI();
    const prompt = this.buildPipelinePrompt(config);
    
    const parts: any[] = [];
    (config.productImages || []).forEach((img, i) => {
      parts.push({ text: `ẢNH THAM CHIẾU SẢN PHẨM ${i+1} (GIỮ NGUYÊN CHI TIẾT GỐC):` });
      parts.push({ inlineData: { mimeType: 'image/png', data: img } });
    });
    
    if (config.iconImage) {
      parts.push({ text: "LOGO/ICON THƯƠNG HIỆU CHÍNH THỨC (PHẢI XUẤT HIỆN SẮC NÉT VÀ NỔI BẬT):" });
      parts.push({ inlineData: { mimeType: 'image/png', data: config.iconImage } });
    }
    
    (config.modelImages || []).forEach((img, i) => {
      parts.push({ text: `ẢNH NGƯỜI MẪU THAM CHIẾU ${i+1} (GIỮ ĐÚNG DANH TÍNH, ĐƯỜNG NÉT VÀ THẦN THÁI):` });
      parts.push({ inlineData: { mimeType: 'image/png', data: img } });
    });

    (config.groupModelImages || []).forEach((img, i) => {
      parts.push({ text: `ẢNH THÀNH VIÊN NHÓM ${i+1} (KẾT HỢP VÀO KHUNG HÌNH CHUNG ĐỂ TẠO GROUP LOOK):` });
      parts.push({ inlineData: { mimeType: 'image/png', data: img } });
    });
    
    parts.push({ text: prompt });

    return this.withRetry(async () => {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: { parts },
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
        if (part.inlineData) images.push(`data:image/png;base64,${part.inlineData.data}`);
      });
      return images;
    });
  }

  private buildPipelinePrompt(config: PipelineConfig): string {
    const { pipeline, productInfo, settings, iconImage } = config;
    let detail = `SẢN PHẨM: ${productInfo.name}. ĐẶC ĐIỂM USP: ${productInfo.usp}. BỐI CẢNH YÊU CẦU: ${settings.vnContext}. `;
    
    if (iconImage) detail += "Đảm bảo logo thương hiệu được tích hợp một cách chuyên nghiệp, sắc nét từng đường nét trên sản phẩm hoặc bối cảnh. ";
    
    const technicalKeywords = "4K, Ultra-HD, 8k resolution, photorealistic, cinematic lighting, extreme detail, sharp focus, 85mm lens, f/1.8, ray-traced shadows, vibrant HDR colors, subsurface scattering, depth of field, high-end editorial look. ";

    switch (pipeline) {
      case PipelineType.IMAGE_2D:
        return `${detail} ${technicalKeywords} PHONG CÁCH: High-end Commercial Photography. Ánh sáng Studio Softbox mạnh mẽ, tạo khối rõ rệt cho sản phẩm. Ảnh sắc nét tuyệt đối từ tiền cảnh đến trung cảnh. HÃY RENDER ${settings.imageCount} PHIÊN BẢN MASTER.`;
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
        return `${detail} ${technicalKeywords} ${matPrompt} PHONG CÁCH: 3D Product Mockup siêu thực, chất lượng Unreal Engine 5. Ánh sáng bao quanh cực kỳ mịn màng. Xoay góc Hero Shot đẳng cấp. HÃY RENDER ${settings.imageCount} PHIÊN BẢN.`;
      case PipelineType.MODEL_SINGLE:
        return `${detail} ${technicalKeywords} PHONG CÁCH: Professional Fashion Editorial. Người mẫu Việt Nam với làn da thật sự sống động, ánh mắt có thần, đang tương tác tự nhiên với sản phẩm. Ánh sáng tự nhiên kết hợp Fill light. BẢO TỒN DANH TÍNH MẪU. HÃY RENDER ${settings.imageCount} PHIÊN BẢN.`;
      case PipelineType.GROUP_SHOOT:
        return `${detail} ${technicalKeywords} PHONG CÁCH: Cinematic Group Portrait / Fashion Show. Kết hợp tất cả các mẫu tham chiếu vào một bối cảnh sang trọng duy nhất. Ánh sáng kịch tính (Dramatic lighting), hiệu ứng khói/bụi nhẹ dưới ánh đèn sân khấu. Tương tác nhóm hoàn hảo. BẢO TỒN DANH TÍNH TỪNG NGƯỜI. HÃY RENDER ${settings.imageCount} PHIÊN BẢN.`;
      default:
        return `${detail} ${technicalKeywords} HÃY RENDER ${settings.imageCount} PHIÊN BẢN ĐẸP NHẤT.`;
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

  async generateVideoCommercial(config: PipelineConfig): Promise<string> {
    const ai = this.getAI();
    const videoPrompt = `High-end 4K Cinematic Commercial TVC for ${config.productInfo.name}. Context: ${config.settings.vnContext}. Extreme photorealism, slow-motion details, dynamic lighting, professional color grading, vivid 4K resolution. 20 seconds.`;
    try {
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: videoPrompt,
        config: { numberOfVideos: 1, resolution: '1080p', aspectRatio: '9:16' }
      });
      while (!operation.done) {
        await new Promise(r => setTimeout(r, 10000));
        operation = await ai.operations.getVideosOperation({ operation });
      }
      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      const res = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
      const blob = await res.blob();
      return URL.createObjectURL(blob as unknown as Blob);
    } catch (error: any) {
      console.error("Lỗi tạo video:", error);
      throw error;
    }
  }
}

export const gemini = new GeminiService();
