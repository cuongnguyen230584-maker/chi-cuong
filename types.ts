
export enum PipelineType {
  IMAGE_2D = 'IMAGE_2D',
  IMAGE_3D = 'IMAGE_3D',
  MODEL_SINGLE = 'MODEL_SINGLE',
  GROUP_SHOOT = 'GROUP_SHOOT',
  VIDEO_TREND = 'VIDEO_TREND',
  CONTENT_ENGINE = 'CONTENT_ENGINE',
  VIDEO_ANALYSIS = 'VIDEO_ANALYSIS',
  MY_ASSETS = 'MY_ASSETS',
  PRICING = 'PRICING',
  TUTORIAL = 'TUTORIAL'
}

export type PlatformTarget = 'Facebook' | 'TikTok' | 'Shopee' | 'Instagram' | 'Website' | 'Lazada' | 'Zalo OA';

export interface MaterialSettings {
  glossiness: number;
  roughness: number;
  metalness: number;
  isGlass: boolean;
}

export interface ProductInfo {
  name: string;
  category: string;
  benefits: string[];
  price: string;
  message: string;
  platform: PlatformTarget;
  targetAudience?: string;
  usp?: string;
}

export interface ProductEntry {
  id: string;
  info: ProductInfo;
  images: string[];
  iconImage?: string;
}

export interface CampaignContent {
  hook: string;
  body: string;
  cta: string;
  hashtags: string[];
  schedule: string;
}

export type CollageStyle = 'Grid 2x2' | 'Moodboard' | 'Product Split' | 'Cinematic Frame';

export interface PipelineConfig {
  pipeline: PipelineType;
  productImages: string[];
  iconImage?: string;
  modelImages: string[];
  groupModelImages: string[];
  productInfo: ProductInfo;
  settings: {
    aspectRatio: '1:1' | '3:4' | '4:5' | '9:16' | '16:9';
    sceneLevel: 'Studio' | 'Lifestyle' | 'Premium' | 'Stage' | 'Vietnamese Culture' | 'Trend';
    vnContext: string;
    imageCount: number;
    includeCollage: boolean;
    collageStyle?: CollageStyle;
    autoLogoOverlay?: boolean;
    trendType?: string;
    videoLength?: '20s' | '30s' | '60s';
    material?: MaterialSettings;
  };
}
