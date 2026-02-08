
import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutGrid, Box, Users, Video, FileText, Zap, 
  Upload, Download, Plus, Loader2, ShieldCheck, Sparkles, 
  Sun, Copy, Check, Target, ShoppingBag, Globe, Store, 
  Coffee, Briefcase, Camera, Layers, Search, History, Trash2,
  Maximize2, Droplets, Wind, Sparkle, Paintbrush, Menu, X, PlusCircle,
  Hash, Send, ExternalLink, Camera as CameraIcon, AlertCircle, XCircle,
  SlidersHorizontal, RefreshCw, CheckCircle2, ImageIcon, Play, BookOpen, CreditCard, ChevronRight,
  Library, FileVideo, MonitorPlay, Sparkles as SparklesIcon, FlipHorizontal, Focus, Palette
} from 'lucide-react';
import { PipelineType, ProductInfo, PipelineConfig, CampaignContent, MaterialSettings, ProductEntry, CollageStyle } from './types';
import { gemini } from './services/geminiService';
import JSZip from 'jszip';

const SCENE_PRESETS = ['Studio', 'Đời sống', 'Cao cấp', 'Văn hoá Việt', 'Trend', 'Runway', 'Sân khấu LED'];
const RATIO_PRESETS = ['1:1', '4:5', '3:4', '9:16', '16:9'];
const COUNT_PRESETS = [4, 6, 8, 10, 12];

const MATERIAL_PRESETS = [
  { name: 'Mặc định', glossiness: 50, roughness: 30, metalness: 10, isGlass: false },
  { name: 'Kim loại bóng', glossiness: 95, roughness: 5, metalness: 100, isGlass: false },
  { name: 'Nhựa mờ', glossiness: 20, roughness: 80, metalness: 0, isGlass: false },
  { name: 'Thủy tinh 4K', glossiness: 98, roughness: 2, metalness: 0, isGlass: true },
  { name: 'Vàng 24K', glossiness: 90, roughness: 10, metalness: 100, isGlass: false },
  { name: 'Sơn Ceramic', glossiness: 92, roughness: 8, metalness: 20, isGlass: false },
];

const App: React.FC = () => {
  const [activePipeline, setActivePipeline] = useState<PipelineType>(PipelineType.IMAGE_2D);
  const [products, setProducts] = useState<ProductEntry[]>([
    { id: 'default', info: { name: '', category: '', benefits: [], price: '', message: '', platform: 'Facebook' }, images: [] }
  ]);
  const [activeProductId, setActiveProductId] = useState<string>('default');
  const [modelImages, setModelImages] = useState<string[]>([]);
  const [groupModelImages, setGroupModelImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [campaign, setCampaign] = useState<CampaignContent | null>(null);
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Video analysis state
  const [videoToAnalyze, setVideoToAnalyze] = useState<string | null>(null);
  const [videoAnalysisPrompt, setVideoAnalysisPrompt] = useState('Phân tích chi tiết các sản phẩm xuất hiện trong video này, các key message và bối cảnh quay phim.');
  const [videoAnalysisResult, setVideoAnalysisResult] = useState<string | null>(null);

  // Camera state
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [tempCapturedImage, setTempCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [isFlashActive, setIsFlashActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const activeProduct = products.find(p => p.id === activeProductId) || products[0];

  const [settings, setSettings] = useState({
    aspectRatio: '1:1' as any,
    sceneLevel: 'Studio' as any,
    vnContext: 'Quán cafe phong cách hiện đại tại Sài Gòn, ánh sáng tự nhiên.',
    imageCount: 8,
    includeCollage: true,
    collageStyle: 'Grid 2x2' as CollageStyle,
    autoLogoOverlay: true,
    material: { glossiness: 50, roughness: 30, metalness: 10, isGlass: false } as MaterialSettings
  });

  useEffect(() => {
    const checkKey = async () => {
      try {
        const selected = await (window as any).aistudio.hasSelectedApiKey();
        setHasApiKey(selected);
      } catch (e) { setHasApiKey(false); }
    };
    checkKey();
  }, []);

  const handleOpenSelectKey = async () => {
    await (window as any).aistudio.openSelectKey();
    setHasApiKey(true);
  };

  const applyMaterialPreset = (preset: typeof MATERIAL_PRESETS[0]) => {
    setSettings({
      ...settings,
      material: {
        glossiness: preset.glossiness,
        roughness: preset.roughness,
        metalness: preset.metalness,
        isGlass: preset.isGlass
      }
    });
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'product' | 'model' | 'icon' | 'group' | 'video_analysis') => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = (reader.result as string).split(',')[1];
        if (target === 'icon') {
          setProducts(prev => prev.map(p => p.id === activeProductId ? { ...p, iconImage: base64 } : p));
        } else if (target === 'group') {
          setGroupModelImages(prev => [...prev, base64].slice(-6));
        } else if (target === 'video_analysis') {
          setVideoToAnalyze(base64);
        } else {
          processImageData(base64, target);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const processImageData = async (base64: string, target: 'product' | 'model') => {
    if (target === 'product') {
      const newImages = [...(activeProduct.images || []), base64].slice(-6);
      setProducts(prev => prev.map(p => p.id === activeProductId ? { ...p, images: newImages } : p));
      
      if (!activeProduct.images || activeProduct.images.length === 0) {
        setIsAnalyzing(true);
        try {
          const info = await gemini.analyzeProduct(base64);
          setProducts(prev => prev.map(p => p.id === activeProductId ? { 
            ...p, 
            info: { ...p.info, ...info as ProductInfo } 
          } : p));
        } catch (e) { console.error(e); }
        finally { setIsAnalyzing(false); }
      }
    } else {
      setModelImages(prev => [...prev, base64].slice(-3));
    }
  };

  const startCamera = async (mode: 'user' | 'environment' = 'environment') => {
    setIsCameraOpen(true);
    setTempCapturedImage(null);
    setFacingMode(mode);
    
    if (videoRef.current && videoRef.current.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: mode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      try {
        const fallback = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = fallback;
      } catch (e) {
        alert("LỖI CAMERA: Vui lòng kiểm tra thiết bị.");
        setIsCameraOpen(false);
      }
    }
  };

  const toggleCamera = () => {
    const newMode = facingMode === 'user' ? 'environment' : 'user';
    startCamera(newMode);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      setIsFlashActive(true);
      setTimeout(() => setIsFlashActive(false), 150);

      const canvas = canvasRef.current;
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        if (facingMode === 'user') {
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
        }
        ctx.drawImage(videoRef.current, 0, 0);
        setTempCapturedImage(canvas.toDataURL('image/png'));
      }
    }
  };

  const closeCamera = () => {
    setIsCameraOpen(false);
    setTempCapturedImage(null);
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const confirmCapturedPhoto = () => {
    if (tempCapturedImage) {
      const base64 = tempCapturedImage.split(',')[1];
      processImageData(base64, 'product');
      closeCamera();
    }
  };

  const handleVideoAnalysis = async () => {
    if (!videoToAnalyze) return;
    setIsGenerating(true);
    setVideoAnalysisResult(null);
    try {
      const result = await gemini.analyzeVideo(videoToAnalyze, videoAnalysisPrompt);
      setVideoAnalysisResult(result);
    } catch (e: any) {
      alert("Lỗi phân tích video: " + e.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const startPipeline = async () => {
    if (!hasApiKey) { await handleOpenSelectKey(); return; }
    
    if (activePipeline === PipelineType.VIDEO_ANALYSIS) {
      handleVideoAnalysis();
      return;
    }

    setIsGenerating(true);
    setResults([]);
    setVideoUrl(null);
    setCampaign(null);
    try {
      const config: PipelineConfig = { 
        pipeline: activePipeline, 
        productImages: activeProduct.images || [], 
        iconImage: activeProduct.iconImage,
        modelImages: modelImages, 
        groupModelImages: groupModelImages,
        productInfo: activeProduct.info, 
        settings 
      };
      
      if (activePipeline === PipelineType.VIDEO_TREND) {
        const url = await gemini.generateVideoCommercial(config);
        setVideoUrl(url);
      } else {
        const [imgs, content] = await Promise.all([
          gemini.generate4KVisuals(config),
          gemini.generateMarketingContent(activeProduct.info)
        ]);
        setResults(imgs || []);
        setCampaign(content);
      }
    } catch (e: any) { 
      alert("Lỗi hệ thống: " + e.message); 
    } finally { 
      setIsGenerating(false); 
    }
  };

  const removeModel = (idx: number, target: 'single' | 'group') => {
    if (target === 'single') {
      setModelImages(prev => prev.filter((_, i) => i !== idx));
    } else {
      setGroupModelImages(prev => prev.filter((_, i) => i !== idx));
    }
  };

  const renderContent = () => {
    if (activePipeline === PipelineType.PRICING) return <PricingScreen />;
    if (activePipeline === PipelineType.TUTORIAL) return <TutorialScreen />;
    if (activePipeline === PipelineType.MY_ASSETS) return <AssetsScreen products={products} models={modelImages} />;
    
    if (activePipeline === PipelineType.VIDEO_ANALYSIS) {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <Section icon={<Library size={18}/>} title="PHÂN TÍCH VIDEO">
              <div className="space-y-4">
                <UploadZone label="TẢI VIDEO (.MP4)" onFile={(e: any) => handleUpload(e, 'video_analysis')} active={!!videoToAnalyze} />
                <InputField label="CÂU HỎI PHÂN TÍCH" value={videoAnalysisPrompt} onChange={setVideoAnalysisPrompt} />
                <button 
                  onClick={startPipeline} 
                  disabled={isGenerating || !videoToAnalyze} 
                  className="w-full bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white py-5 rounded-2xl font-black text-xs shadow-2xl transition-all flex items-center justify-center gap-3 uppercase italic"
                >
                  {isGenerating ? <Loader2 className="animate-spin" /> : <MonitorPlay size={18} />}
                  {isGenerating ? 'ĐANG PHÂN TÍCH VIDEO...' : 'BẮT ĐẦU PHÂN TÍCH'}
                </button>
              </div>
            </Section>
          </div>
          <div className="lg:col-span-8 space-y-6">
            {videoToAnalyze && (
              <div className="bg-slate-900 rounded-[32px] overflow-hidden border border-slate-800 shadow-2xl">
                <video src={`data:video/mp4;base64,${videoToAnalyze}`} controls className="w-full aspect-video bg-black" />
              </div>
            )}
            {isGenerating && !videoAnalysisResult && (
              <div className="aspect-[16/9] bg-slate-900 border-2 border-dashed border-orange-500/20 rounded-[40px] flex flex-col items-center justify-center animate-pulse">
                <Loader2 className="animate-spin text-orange-600 mb-4" size={48} />
                <p className="text-xl font-black uppercase italic text-white tracking-widest text-center px-8">GEMINI PRO ĐANG XEM & PHÂN TÍCH VIDEO...</p>
              </div>
            )}
            {videoAnalysisResult && (
              <div className="bg-slate-900 border border-slate-800 rounded-[40px] p-8 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h3 className="text-sm font-black uppercase italic text-orange-500 flex items-center gap-3 mb-6"><SparklesIcon size={18}/> KẾT QUẢ PHÂN TÍCH</h3>
                <div className="p-8 bg-slate-950 rounded-[24px] border border-orange-500/10">
                  <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-medium prose prose-invert max-w-none">
                    {videoAnalysisResult}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6 order-2 lg:order-1">
          <Section icon={<ShoppingBag size={18}/>} title="DỮ LIỆU SẢN PHẨM">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <UploadZone label="TẢI ẢNH SP" onFile={(e: any) => handleUpload(e, 'product')} active={activeProduct.images?.length > 0} />
                <button onClick={() => startCamera('environment')} className="aspect-square rounded-[32px] border-2 border-dashed border-orange-500/20 bg-orange-500/5 flex flex-col items-center justify-center p-6 group transition-all hover:bg-orange-500/10">
                  <CameraIcon size={24} className="text-orange-500 mb-2" />
                  <span className="text-[9px] font-black uppercase text-slate-500">CHỤP ẢNH SP</span>
                </button>
              </div>
              
              {isAnalyzing && (
                <div className="flex items-center gap-2 p-3 bg-orange-500/10 rounded-xl border border-orange-500/20">
                  <Loader2 size={14} className="animate-spin text-orange-500" />
                  <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest italic">AI ĐANG PHÂN TÍCH SẢN PHẨM...</span>
                </div>
              )}

              <div className="h-12 bg-slate-800 rounded-xl relative overflow-hidden group border border-slate-700/50">
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={(e) => handleUpload(e, 'icon')} />
                <div className="flex items-center justify-center h-full gap-2 text-slate-500 text-[10px] font-bold">
                  <ImageIcon size={14}/> {activeProduct.iconImage ? 'ĐÃ CÓ LOGO' : 'TẢI LOGO THƯƠNG HIỆU'}
                </div>
              </div>

              <InputField label="TÊN SẢN PHẨM" value={activeProduct.info.name} onChange={(v: string) => setProducts(p => p.map(pr => pr.id === activeProductId ? {...pr, info: {...pr.info, name: v}} : pr))} />
              <InputField label="USP (ĐIỂM ĐẶC BIỆT)" value={activeProduct.info.usp || ''} onChange={(v: string) => setProducts(p => p.map(pr => pr.id === activeProductId ? {...pr, info: {...pr.info, usp: v}} : pr))} />
              
              <div className="flex flex-wrap gap-2">
                {(activeProduct.images || []).map((img, i) => (
                  <div key={i} className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-700 group">
                    <img src={`data:image/png;base64,${img}`} className="w-full h-full object-cover" />
                    <button onClick={() => setProducts(p => p.map(prod => prod.id === activeProductId ? {...prod, images: prod.images.filter((_, idx) => idx !== i)} : prod))} className="absolute inset-0 bg-red-600/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12}/></button>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          {(activePipeline === PipelineType.MODEL_SINGLE || activePipeline === PipelineType.GROUP_SHOOT) && (
            <Section icon={<Users size={18}/>} title={activePipeline === PipelineType.GROUP_SHOOT ? "NHÓM NGƯỜI MẪU (2-6)" : "NGƯỜI MẪU ĐƠN"}>
              <UploadZone 
                label={activePipeline === PipelineType.GROUP_SHOOT ? "THÊM MẪU VÀO NHÓM" : "TẢI ẢNH MẪU"} 
                onFile={(e: any) => handleUpload(e, activePipeline === PipelineType.GROUP_SHOOT ? 'group' : 'model')} 
                active={(activePipeline === PipelineType.GROUP_SHOOT ? groupModelImages : modelImages).length > 0} 
              />
              <div className="grid grid-cols-3 gap-3 mt-4">
                {(activePipeline === PipelineType.GROUP_SHOOT ? groupModelImages : modelImages).map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-slate-700 group/item shadow-lg">
                    <img src={`data:image/png;base64,${img}`} className="w-full h-full object-cover" />
                    <button onClick={() => removeModel(i, activePipeline === PipelineType.GROUP_SHOOT ? 'group' : 'single')} className="absolute top-1 right-1 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity active:scale-90">
                      <X size={10}/>
                    </button>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {activePipeline === PipelineType.IMAGE_3D && (
            <Section icon={<SlidersHorizontal size={18}/>} title="VẬT LIỆU PBR (MASTERING)">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-2">
                  {MATERIAL_PRESETS.map(p => (
                    <button 
                      key={p.name} 
                      onClick={() => applyMaterialPreset(p)}
                      className="text-[8px] font-black uppercase py-2 px-3 bg-slate-800 hover:bg-orange-600/20 hover:text-orange-500 rounded-lg border border-slate-700 transition-all text-slate-400"
                    >
                      {p.name}
                    </button>
                  ))}
                </div>

                <div className="space-y-2 pt-4 border-t border-slate-800">
                  <div className="flex justify-between text-[9px] font-black text-slate-500 uppercase tracking-tighter"><span>Độ bóng (Glossiness)</span><span>{settings.material.glossiness}%</span></div>
                  <input type="range" className="w-full accent-orange-500 bg-slate-800 rounded-lg appearance-none h-1.5 cursor-pointer" value={settings.material.glossiness} onChange={e => updateMaterial('glossiness', parseInt(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[9px] font-black text-slate-500 uppercase tracking-tighter"><span>Độ nhám (Roughness)</span><span>{settings.material.roughness}%</span></div>
                  <input type="range" className="w-full accent-orange-500 bg-slate-800 rounded-lg appearance-none h-1.5 cursor-pointer" value={settings.material.roughness} onChange={e => updateMaterial('roughness', parseInt(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[9px] font-black text-slate-500 uppercase tracking-tighter"><span>Kim loại (Metallic)</span><span>{settings.material.metalness}%</span></div>
                  <input type="range" className="w-full accent-orange-500 bg-slate-800 rounded-lg appearance-none h-1.5 cursor-pointer" value={settings.material.metalness} onChange={e => updateMaterial('metalness', parseInt(e.target.value))} />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <span className="text-[10px] font-black text-slate-300 uppercase">KÍNH TRONG SUỐT (4K)</span>
                  <button onClick={() => updateMaterial('isGlass', !settings.material.isGlass)} className={`w-10 h-5 rounded-full relative transition-colors ${settings.material.isGlass ? 'bg-orange-600' : 'bg-slate-700'}`}><div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${settings.material.isGlass ? 'left-6' : 'left-1'}`} /></button>
                </div>
              </div>
            </Section>
          )}
        </div>

        <div className="lg:col-span-8 space-y-6 order-1 lg:order-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {isGenerating && (
              <div className="sm:col-span-2 aspect-[16/9] bg-slate-900 border-2 border-dashed border-orange-500/20 rounded-[40px] flex flex-col items-center justify-center animate-pulse p-6 text-center">
                <Loader2 className="animate-spin text-orange-600 mb-4" size={48} />
                <p className="text-lg lg:text-xl font-black uppercase italic text-white tracking-widest">ĐANG RENDERING 4K MASTER...</p>
                <p className="text-[10px] font-bold text-slate-500 mt-2 uppercase">Bảo tồn danh tính mẫu & Form sản phẩm</p>
              </div>
            )}
            {(results || []).map((url, i) => (
              <div key={i} className="group relative bg-slate-900 rounded-[32px] overflow-hidden border border-slate-800 hover:border-orange-500/50 transition-all shadow-2xl">
                <img src={url} className="w-full aspect-square object-cover" />
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-[9px] font-black uppercase border border-white/10">VISUAL {i+1} • 4K</div>
                <button onClick={() => downloadSingle(url, i)} className="absolute top-4 right-4 p-3 bg-white text-slate-950 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-orange-600 hover:text-white"><Download size={18}/></button>
              </div>
            ))}
            {videoUrl && <video src={videoUrl} controls className="sm:col-span-2 aspect-[9/16] max-h-[600px] mx-auto rounded-[32px] bg-black shadow-2xl w-full" />}
          </div>

          {campaign && (
            <div className="bg-slate-900 border border-slate-800 rounded-[40px] p-6 lg:p-8 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs lg:text-sm font-black uppercase italic text-orange-500 flex items-center gap-3"><Globe size={18}/> Nội dung chiến lược</h3>
                <button onClick={() => { navigator.clipboard.writeText(`${campaign.hook}\n\n${campaign.body}\n\n${campaign.cta}`); alert("Đã sao chép nội dung!"); }} className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all"><Copy size={16}/></button>
              </div>
              <div className="p-6 bg-slate-950 rounded-[24px] border border-orange-500/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none"><Zap size={40} className="text-orange-500" /></div>
                <p className="text-orange-500 font-black text-base lg:text-lg mb-4 italic tracking-tight">🔥 {campaign.hook}</p>
                <p className="text-slate-300 text-xs lg:text-sm leading-relaxed whitespace-pre-wrap">{campaign.body}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {(campaign.hashtags || []).map((tag, i) => <span key={i} className="text-[9px] lg:text-[10px] font-bold text-orange-400 bg-orange-400/5 px-2 py-1 rounded-md">{tag}</span>)}
                </div>
                <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between border-t border-slate-800 pt-6 gap-4">
                  <p className="text-white font-black text-[10px] lg:text-xs uppercase tracking-[0.1em]">👉 {campaign.cta}</p>
                  <span className="text-[8px] lg:text-[9px] font-black text-slate-600 uppercase italic">Lịch đăng: {campaign.schedule}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const updateMaterial = (key: keyof MaterialSettings, val: any) => {
    setSettings(s => ({ ...s, material: { ...s.material, [key]: val } }));
  };

  const downloadSingle = (url: string, index: number) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `CHICUONG_AI_4K_${activeProduct.info.name.replace(/\s+/g, '_') || 'Visual'}_${index+1}.png`;
    link.click();
  };

  const downloadAll = async () => {
    const zip = new JSZip();
    (results || []).forEach((url, i) => zip.file(`4K_Visual_${i+1}.png`, url.split(',')[1], { base64: true }));
    const blob = await zip.generateAsync({ type: "blob" });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob as unknown as Blob);
    link.download = `CHICUONG_AI_ALL_4K_${activeProduct.info.name.replace(/\s+/g, '_')}.zip`;
    link.click();
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-['Plus_Jakarta_Sans'] flex-col lg:flex-row">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center"><Zap className="w-5 h-5 text-white fill-current" /></div>
          <h1 className="text-lg font-black italic tracking-tighter uppercase">CHICUONG AI</h1>
        </div>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-slate-300">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Responsive Sidebar */}
      <aside className={`fixed inset-y-0 left-0 lg:relative lg:translate-x-0 w-72 bg-slate-900 border-r border-slate-800 flex flex-col p-6 z-40 shadow-2xl transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="hidden lg:flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-600/20"><Zap className="w-6 h-6 text-white fill-current" /></div>
          <h1 className="text-xl font-black italic tracking-tighter uppercase">CHICUONG AI</h1>
        </div>
        <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-2">
          <NavBtn icon={<LayoutGrid size={18}/>} label="ẢNH 2D (4K)" active={activePipeline === PipelineType.IMAGE_2D} onClick={() => { setActivePipeline(PipelineType.IMAGE_2D); setIsMenuOpen(false); }} />
          <NavBtn icon={<Box size={18}/>} label="ẢNH 3D / MOCKUP" active={activePipeline === PipelineType.IMAGE_3D} onClick={() => { setActivePipeline(PipelineType.IMAGE_3D); setIsMenuOpen(false); }} />
          <NavBtn icon={<Users size={18}/>} label="PHỐI MẪU NAM/NỮ" active={activePipeline === PipelineType.MODEL_SINGLE} onClick={() => { setActivePipeline(PipelineType.MODEL_SINGLE); setIsMenuOpen(false); }} />
          <NavBtn icon={<Sparkles size={18}/>} label="ẢNH NHÓM (RUNWAY)" active={activePipeline === PipelineType.GROUP_SHOOT} onClick={() => { setActivePipeline(PipelineType.GROUP_SHOOT); setIsMenuOpen(false); }} />
          <NavBtn icon={<Video size={18}/>} label="VIDEO REVIEW AI" active={activePipeline === PipelineType.VIDEO_TREND} onClick={() => { setActivePipeline(PipelineType.VIDEO_TREND); setIsMenuOpen(false); }} />
          <NavBtn icon={<MonitorPlay size={18}/>} label="PHÂN TÍCH VIDEO" active={activePipeline === PipelineType.VIDEO_ANALYSIS} onClick={() => { setActivePipeline(PipelineType.VIDEO_ANALYSIS); setIsMenuOpen(false); }} />
          <NavBtn icon={<FileText size={18}/>} label="CONTENT ENGINE" active={activePipeline === PipelineType.CONTENT_ENGINE} onClick={() => { setActivePipeline(PipelineType.CONTENT_ENGINE); setIsMenuOpen(false); }} />
          <div className="pt-4 border-t border-slate-800 mt-4 space-y-2">
            <NavBtn icon={<History size={18}/>} label="DỮ LIỆU CỦA TÔI" active={activePipeline === PipelineType.MY_ASSETS} onClick={() => { setActivePipeline(PipelineType.MY_ASSETS); setIsMenuOpen(false); }} />
            <NavBtn icon={<CreditCard size={18}/>} label="GÓI CƯỚC" active={activePipeline === PipelineType.PRICING} onClick={() => { setActivePipeline(PipelineType.PRICING); setIsMenuOpen(false); }} />
            <NavBtn icon={<BookOpen size={18}/>} label="HƯỚNG DẪN" active={activePipeline === PipelineType.TUTORIAL} onClick={() => { setActivePipeline(PipelineType.TUTORIAL); setIsMenuOpen(false); }} />
          </div>
        </nav>
      </aside>

      {/* Overlay for mobile sidebar */}
      {isMenuOpen && <div onClick={() => setIsMenuOpen(false)} className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm" />}

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Central Control Bar */}
        <div className="bg-slate-900/50 border-b border-slate-800 p-4 lg:p-6 flex flex-col lg:flex-row items-stretch lg:items-center justify-center gap-4 z-10 backdrop-blur-xl">
          <div className="flex bg-slate-950/80 rounded-2xl p-1.5 border border-slate-800 shadow-2xl overflow-x-auto no-scrollbar lg:overflow-visible">
            <ControlSelect label="SỐ LƯỢNG" value={settings.imageCount} options={COUNT_PRESETS} onChange={v => setSettings({...settings, imageCount: Number(v)})} />
            <div className="w-px h-8 bg-slate-800 self-center mx-2 shrink-0" />
            <ControlSelect label="TỶ LỆ" value={settings.aspectRatio} options={RATIO_PRESETS} onChange={v => setSettings({...settings, aspectRatio: v})} />
            <div className="w-px h-8 bg-slate-800 self-center mx-2 shrink-0" />
            <ControlSelect label="BỐI CẢNH" value={settings.sceneLevel} options={SCENE_PRESETS} onChange={v => setSettings({...settings, sceneLevel: v})} />
          </div>
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              className="w-full bg-slate-950/80 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold border border-slate-800 outline-none focus:ring-1 ring-orange-500 transition-all placeholder:text-slate-700" 
              placeholder={activePipeline === PipelineType.GROUP_SHOOT ? "Mô tả sự kiện..." : activePipeline === PipelineType.VIDEO_ANALYSIS ? "Câu hỏi cho video..." : "Mô tả bối cảnh..."}
              value={activePipeline === PipelineType.VIDEO_ANALYSIS ? videoAnalysisPrompt : settings.vnContext}
              onChange={e => activePipeline === PipelineType.VIDEO_ANALYSIS ? setVideoAnalysisPrompt(e.target.value) : setSettings({...settings, vnContext: e.target.value})}
            />
          </div>
          <div className="flex items-center gap-2">
            <button onClick={startPipeline} disabled={isGenerating || (activePipeline !== PipelineType.VIDEO_ANALYSIS && (!activeProduct.images || activeProduct.images.length === 0)) || (activePipeline === PipelineType.VIDEO_ANALYSIS && !videoToAnalyze)} className="flex-1 lg:flex-none bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase italic flex items-center justify-center gap-2 shadow-xl shadow-orange-600/20 active:scale-95 transition-all">
              {isGenerating ? <Loader2 className="animate-spin" size={16}/> : activePipeline === PipelineType.VIDEO_ANALYSIS ? <MonitorPlay size={16} fill="white" /> : <Zap size={16} fill="white"/>} 
              <span className="lg:inline">{activePipeline === PipelineType.VIDEO_ANALYSIS ? 'ANALYZE' : 'RUN'}</span>
            </button>
            <button onClick={() => { setResults([]); setVideoUrl(null); setCampaign(null); setVideoAnalysisResult(null); setVideoToAnalyze(null); }} className="p-4 bg-slate-800 rounded-2xl text-slate-400 hover:text-white transition-all active:rotate-180 duration-500"><RefreshCw size={18}/></button>
            {results && results.length > 0 && <button onClick={downloadAll} className="p-4 bg-white text-slate-950 rounded-2xl hover:bg-orange-500 hover:text-white transition-all shadow-lg active:scale-95"><Download size={18}/></button>}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar bg-slate-950/50">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </main>

      {/* MODAL CHỤP ẢNH SẢN PHẨM HOÀN THIỆN */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/98 backdrop-blur-2xl p-4 animate-in fade-in duration-500">
          <div className="relative w-full max-w-4xl bg-slate-900/50 rounded-[32px] lg:rounded-[48px] overflow-hidden border border-white/5 shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col lg:flex-row max-h-full">
            
            {/* Vùng xem trước camera */}
            <div className="flex-1 bg-black relative aspect-[3/4] lg:aspect-auto overflow-hidden">
              {!tempCapturedImage ? (
                <>
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className={`w-full h-full object-cover transition-transform duration-700 ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`} 
                  />
                  {/* Grid Lines Overlay */}
                  <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-20">
                    <div className="border-r border-b border-white/40" />
                    <div className="border-r border-b border-white/40" />
                    <div className="border-b border-white/40" />
                    <div className="border-r border-b border-white/40" />
                    <div className="border-r border-b border-white/40" />
                    <div className="border-b border-white/40" />
                    <div className="border-r border-white/40" />
                    <div className="border-r border-white/40" />
                  </div>
                  {/* Focus Marker */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-orange-500/30">
                    <Focus size={80} strokeWidth={0.5} className="w-12 h-12 lg:w-20 lg:h-20" />
                  </div>
                </>
              ) : (
                <img src={tempCapturedImage} className="w-full h-full object-cover animate-in zoom-in-95 duration-300" />
              )}
              
              {/* Shutter Flash Effect */}
              {isFlashActive && <div className="absolute inset-0 bg-white z-50 animate-out fade-out duration-150" />}
            </div>

            {/* Bảng điều khiển camera */}
            <div className="w-full lg:w-48 bg-slate-950 p-4 lg:p-6 flex flex-row lg:flex-col items-center justify-between gap-4 lg:gap-6 border-t lg:border-t-0 lg:border-l border-white/5 shrink-0">
              <button 
                onClick={closeCamera} 
                className="p-3 bg-slate-900 rounded-full text-slate-400 hover:text-white transition-all active:scale-90"
              >
                <X size={20} />
              </button>

              {!tempCapturedImage ? (
                <>
                  <div className="flex-1 lg:flex-none flex flex-row lg:flex-col items-center gap-6">
                    <button 
                      onClick={toggleCamera} 
                      className="p-3 lg:p-4 bg-slate-900 rounded-full text-orange-500 hover:bg-orange-500/10 transition-all active:rotate-180 duration-500"
                      title="Đổi Camera"
                    >
                      <FlipHorizontal size={20}/>
                    </button>
                    
                    <button 
                      onClick={capturePhoto} 
                      className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-white flex items-center justify-center active:scale-90 transition-all border-[4px] lg:border-[6px] border-slate-800 shadow-2xl hover:scale-105"
                    >
                      <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-full border-2 border-slate-950 flex items-center justify-center">
                         <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-orange-600 shadow-inner" />
                      </div>
                    </button>

                    <div className="hidden lg:block text-[8px] font-black text-slate-600 uppercase tracking-widest vertical-text mt-4">
                      PHOTO STUDIO
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 lg:flex-none flex flex-row lg:flex-col items-center gap-4">
                  <button 
                    onClick={() => setTempCapturedImage(null)} 
                    className="p-3 lg:p-4 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-all active:scale-90"
                    title="Chụp lại"
                  >
                    <RefreshCw size={20}/>
                  </button>
                  <button 
                    onClick={confirmCapturedPhoto} 
                    className="p-3 lg:p-4 bg-orange-600 text-white rounded-full hover:bg-orange-500 transition-all active:scale-90 shadow-xl shadow-orange-600/20"
                    title="Dùng ảnh này"
                  >
                    <Check size={24}/>
                  </button>
                </div>
              )}

              <div className="hidden lg:block w-12 h-12 rounded-xl bg-slate-900 border border-white/5 overflow-hidden opacity-50">
                 {activeProduct.images && activeProduct.images.length > 0 && <img src={`data:image/png;base64,${activeProduct.images[activeProduct.images.length-1]}`} className="w-full h-full object-cover" />}
              </div>
              {/* Spacer for mobile controls */}
              <div className="lg:hidden w-8" />
            </div>
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}
    </div>
  );
};

const ControlSelect = ({label, value, options, onChange}: any) => (
  <div className="px-3 flex flex-col items-start gap-0.5 group shrink-0">
    <span className="text-[7px] font-black text-slate-600 uppercase tracking-widest group-hover:text-orange-500 transition-colors">{label}</span>
    <select 
      className="bg-transparent text-[10px] font-black uppercase text-slate-300 outline-none cursor-pointer hover:text-white transition-colors"
      value={value}
      onChange={e => onChange(e.target.value)}
    >
      {(options || []).map((o: any) => <option key={o} value={o} className="bg-slate-950">{o}</option>)}
    </select>
  </div>
);

const NavBtn = ({icon, label, active, onClick}: any) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 px-6 py-3.5 rounded-2xl transition-all group relative ${active ? 'bg-orange-600 text-white shadow-xl scale-[1.02]' : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800/50'}`}>
    <div className={active ? 'text-white' : 'text-slate-500 group-hover:text-orange-500 transition-colors'}>{icon}</div>
    <span className="text-[10px] font-black uppercase tracking-wider">{label}</span>
  </button>
);

const Section = ({icon, title, children}: any) => (
  <div className="bg-slate-900 border border-slate-800 p-6 lg:p-8 rounded-[32px] lg:rounded-[40px] shadow-2xl relative overflow-hidden group">
    <div className="absolute top-0 left-0 w-1 h-full bg-orange-600 opacity-0 group-hover:opacity-100 transition-opacity" />
    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-3 mb-6">
      <div className="p-2.5 bg-slate-800 rounded-xl text-orange-500 shadow-inner">{icon}</div>
      {title}
    </h3>
    {children}
  </div>
);

const UploadZone = ({label, onFile, active}: any) => (
  <div className={`relative aspect-square rounded-[24px] lg:rounded-[32px] border-2 border-dashed transition-all group flex flex-col items-center justify-center p-4 lg:p-6 cursor-pointer overflow-hidden ${active ? 'border-orange-500 bg-orange-500/5 shadow-inner' : 'border-slate-800 hover:border-orange-500/30 bg-slate-800/20'}`}>
    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={onFile} multiple />
    <Upload size={20} className={`${active ? 'text-orange-600' : 'text-slate-600'} group-hover:scale-110 transition-transform`} />
    <span className="text-[8px] lg:text-[9px] font-black uppercase text-slate-500 mt-2 text-center leading-tight">{label}</span>
  </div>
);

const InputField = ({label, value, onChange}: any) => (
  <div className="space-y-2">
    <label className="text-[9px] font-black uppercase text-slate-600 px-1 tracking-[0.1em]">{label}</label>
    <input className="w-full bg-slate-800 rounded-xl p-4 text-xs font-bold border-none outline-none focus:ring-1 ring-orange-500 shadow-inner transition-all placeholder:text-slate-700" value={value} onChange={e => onChange(e.target.value)} />
  </div>
);

const PricingScreen = () => (
  <div className="max-w-4xl mx-auto py-10 lg:py-20 text-center animate-in fade-in zoom-in-95 duration-700">
    <h2 className="text-2xl lg:text-4xl font-black italic uppercase gradient-text mb-4">CHỌN GÓI CƯỚC CHIẾN DỊCH</h2>
    <p className="text-slate-500 font-bold mb-12 uppercase text-[10px] tracking-widest">Nâng tầm thương hiệu với chuẩn hình ảnh Master 4K</p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {['FREE', 'PRO', 'BUSINESS'].map(p => (
        <div key={p} className={`bg-slate-900 border ${p === 'PRO' ? 'border-orange-600 shadow-orange-600/10' : 'border-slate-800'} rounded-[32px] lg:rounded-[40px] p-8 lg:p-10 hover:border-orange-500 transition-all cursor-pointer relative group overflow-hidden`}>
          {p === 'PRO' && <div className="absolute top-0 right-0 bg-orange-600 px-4 py-1 text-[8px] font-black text-white uppercase italic tracking-widest">Phổ biến nhất</div>}
          <h4 className="font-black text-xl mb-2 italic">{p}</h4>
          <p className="text-[10px] font-bold text-slate-500 mb-6 uppercase">Cấp độ {p === 'FREE' ? 'Cơ bản' : p === 'PRO' ? 'Chuyên gia' : 'Doanh nghiệp'}</p>
          <ul className="text-xs text-slate-400 space-y-4 mb-10 text-left font-bold border-t border-slate-800 pt-6">
            <li className="flex items-center gap-2"><Check size={14} className="text-orange-500"/> Ảnh chất lượng 4K Ultra HD</li>
            <li className="flex items-center gap-2"><Check size={14} className="text-orange-500"/> {p === 'FREE' ? 'Dính Watermark thương hiệu' : 'Không dính Watermark'}</li>
            <li className="flex items-center gap-2"><Check size={14} className="text-orange-500"/> {p === 'BUSINESS' ? 'Ưu tiên xử lý Group/TVC' : 'Tốc độ tiêu chuẩn'}</li>
            <li className="flex items-center gap-2"><Check size={14} className="text-orange-500"/> {p === 'FREE' ? 'Giới hạn 5 ảnh/ngày' : 'Không giới hạn lượt tạo'}</li>
          </ul>
          <button className={`w-full ${p === 'PRO' ? 'bg-orange-600 hover:bg-orange-500' : 'bg-slate-800 hover:bg-slate-700'} py-4 rounded-2xl font-black text-[10px] uppercase transition-all shadow-xl group-hover:scale-[1.05]`}>CHỌN GÓI {p}</button>
        </div>
      ))}
    </div>
  </div>
);

const TutorialScreen = () => (
  <div className="max-w-4xl mx-auto py-10 lg:py-20 animate-in fade-in duration-700 px-4 lg:px-0">
    <h2 className="text-2xl lg:text-4xl font-black italic uppercase text-orange-500 mb-2">HƯỚNG DẪN THẦN TỐC</h2>
    <p className="text-slate-500 font-bold mb-12 uppercase text-[10px] tracking-widest italic">Tạo bộ ảnh Master 4K chỉ trong 3 phút</p>
    <div className="space-y-12">
      {[
        { step: '01', title: 'CHỌN PIPELINE & TẢI DỮ LIỆU', desc: 'Chọn loại hình ảnh (2D, 3D, Group). Tải ảnh sản phẩm gốc và người mẫu (nếu có). Hệ thống AI sẽ tự động phân tích và khóa danh tính mẫu.' },
        { step: '02', title: 'CẤU HÌNH CONTROL BAR', desc: 'Chọn tỷ lệ khung hình (9:16 cho TikTok, 1:1 cho FB/Shopee), số lượng ảnh và mô tả bối cảnh Việt Nam theo ý muốn.' },
        { step: '03', title: 'BẤM RUN & NHẬN KẾT QUẢ', desc: 'Hệ thống AI 4K sẽ render và tạo nội dung marketing đi kèm. Tải về bộ ảnh Master 4K để sẵn sàng quảng cáo.' }
      ].map(s => (
        <div key={s.step} className="flex flex-col sm:flex-row gap-6 lg:gap-8 items-start group">
          <div className="text-5xl lg:text-7xl font-black text-orange-500/10 group-hover:text-orange-500/30 transition-all duration-500 select-none leading-none">{s.step}</div>
          <div className="pt-0 lg:pt-4">
            <h4 className="text-lg lg:text-xl font-black uppercase mb-2 group-hover:text-orange-500 transition-colors">{s.title}</h4>
            <p className="text-slate-400 font-bold text-sm lg:text-base leading-relaxed">{s.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const AssetsScreen = ({products, models}: any) => (
  <div className="space-y-10 animate-in fade-in duration-700">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <h2 className="text-2xl lg:text-3xl font-black italic uppercase text-orange-500 flex items-center gap-4"><History size={28}/> DỮ LIỆU CỦA TÔI</h2>
      <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 rounded-xl text-[10px] font-black uppercase shadow-lg shadow-orange-600/20 active:scale-95"><Plus size={16}/> Thêm dự án mới</button>
    </div>
    <Section icon={<ShoppingBag size={18}/>} title="THƯ VIỆN SẢN PHẨM">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
        {(products || []).map((p: any) => (
          <div key={p.id} className="bg-slate-800 rounded-2xl lg:rounded-3xl p-4 border border-slate-700 hover:border-orange-500/30 transition-all group cursor-pointer shadow-xl">
            <div className="aspect-square bg-slate-900 rounded-xl lg:rounded-2xl mb-4 overflow-hidden shadow-inner relative">
              {p.images && p.images[0] ? (
                <img src={`data:image/png;base64,${p.images[0]}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-700"><ImageIcon size={32}/></div>
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><ExternalLink size={20} className="text-white"/></div>
            </div>
            <p className="font-black text-[9px] lg:text-[10px] uppercase truncate text-slate-300">{p.info?.name || 'DỰ ÁN MỚI'}</p>
            <p className="text-[7px] lg:text-[8px] font-bold text-slate-600 uppercase mt-1">{p.info?.category || 'Chưa phân loại'}</p>
          </div>
        ))}
      </div>
    </Section>
  </div>
);

export default App;
