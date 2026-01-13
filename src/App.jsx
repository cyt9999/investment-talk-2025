import React, { useState, useRef, useEffect } from 'react';
import {
  TrendingUp, Target, Calendar, Award, Rocket, ShieldCheck, Activity,
  Lock, ChevronRight, ArrowLeft, ArrowRight, Bell, Search, Crown,
  PlayCircle, Mic, Zap, BarChart3, X, Gift, Share2, Camera, MessageSquare
} from 'lucide-react';

// --- DATA & HELPER COMPONENTS ---

// ROI Data (Normalized: May 12 = 0%)
const chartData = [
  { date: "2025-05-12", talk: 0.00, sp500: 0.0 },
  { date: "2025-05-16", talk: 2.00, sp500: 0.8 },
  { date: "2025-06-24", talk: 1.68, sp500: 4.5 },
  { date: "2025-06-26", talk: 1.39, sp500: 4.8 },
  { date: "2025-07-25", talk: -2.18, sp500: 8.2 },
  { date: "2025-08-01", talk: 18.37, sp500: 8.5 },
  { date: "2025-09-30", talk: 18.28, sp500: 12.1 },
  { date: "2025-10-06", talk: 14.98, sp500: 12.5 },
  { date: "2025-10-29", talk: 18.59, sp500: 14.8 },
  { date: "2025-11-18", talk: 22.99, sp500: 15.5 },
  { date: "2025-11-21", talk: 22.94, sp500: 15.8 },
  { date: "2025-11-24", talk: 23.02, sp500: 16.2 },
  { date: "2025-11-26", talk: 23.04, sp500: 16.5 },
  { date: "2025-12-26", talk: 21.23, sp500: 17.88 }
];

// Chart Component
const ComparisonLineChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  const allValues = data.flatMap(d => [d.talk, d.sp500]);
  const max = Math.max(...allValues) * 1.1;
  const min = Math.min(...allValues, 0);
  const range = max - min || 1;

  const getPoints = (key) => {
    return data.map((d, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - ((d[key] - min) / range) * 100;
      return { x, y, val: d[key] };
    });
  };

  const talkPoints = getPoints('talk');
  const spPoints = getPoints('sp500');

  const toPath = (pts) => `M ${pts.map(p => `${p.x},${p.y}`).join(' L ')}`;
  const toArea = (pts) => `M 0,100 L ${pts.map(p => `${p.x},${p.y}`).join(' L ')} L 100,100 Z`;

  return (
    <div className="w-full h-40 mt-6 relative select-none">
      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
        <defs>
          <linearGradient id="talkGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#95B1FF" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#95B1FF" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1="0" y1="100" x2="100" y2="100" stroke="#404040" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
        <path d={toPath(spPoints)} fill="none" stroke="#666" strokeWidth="1.5" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" className="opacity-50" />
        <path d={toArea(talkPoints)} fill="url(#talkGradient)" className="animate-fade-in-delayed" />
        <path d={toPath(talkPoints)} fill="none" stroke="#95B1FF" strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" className="animate-draw-stroke drop-shadow-lg" />
      </svg>
      <div className="absolute inset-0 pointer-events-none">
        {talkPoints.map((p, i) => (
          (i === talkPoints.length - 1 || i % 4 === 0) && (
            <div key={i} className="absolute w-2.5 h-2.5 rounded-full bg-[#141414] border-2 border-[#95B1FF] shadow-lg transform -translate-x-1/2 -translate-y-1/2 opacity-0 animate-pop-in" style={{ left: `${p.x}%`, top: `${p.y}%`, animationDelay: `${1 + i * 0.1}s` }} />
          )
        ))}
        <div className="absolute w-2 h-2 rounded-full bg-[#666] transform -translate-x-1/2 -translate-y-1/2" style={{ left: '100%', top: `${spPoints[spPoints.length - 1].y}%` }} />
      </div>
    </div>
  );
}

// Image Viewer Component
const ImageViewer = ({ src, onClose }) => {
  if (!src) return null;
  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <button
        className="absolute top-6 right-6 text-white bg-white/20 rounded-full p-2 backdrop-blur-md hover:bg-white/30 transition-colors z-50"
        onClick={onClose}
      >
        <X size={32} />
      </button>
      <img
        src={src}
        alt="Full View"
        className="max-w-full max-h-full object-contain rounded-md shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};

// --- FEATURE CARD ---
const AutoFeatureCard = ({ item, onImageClick }) => {
  const [currentImgIdx, setCurrentImgIdx] = useState(0);

  useEffect(() => {
    if (!item.images || item.images.length <= 1) return;

    let intervalId = null;
    const randomDelay = Math.random() * 2000;

    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        setCurrentImgIdx((prev) => (prev + 1) % item.images.length);
      }, 3000);
    }, randomDelay);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [item.images]);

  // Variant Styles
  const getContainerStyle = () => {
    switch (item.variant) {
      case 'tilt': return 'rotate-[-2deg] scale-[1.02]';
      case 'zoom': return 'scale-110';
      case 'wide': return 'aspect-[16/10]';
      default: return 'aspect-[9/16]';
    }
  };

  const currentImg = item.images[currentImgIdx];

  return (
    <div
      className={`relative w-full overflow-hidden rounded-[24px] shadow-2xl transition-all duration-500 bg-[#1a1a1a] ${item.shadow} ${item.variant === 'wide' ? 'aspect-[16/10]' : 'aspect-[4/5]'}`}
      onTouchStart={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
      onClick={() => onImageClick(currentImg.src)}
    >
      <div className={`absolute inset-0 ${item.bg} opacity-20 z-0`} />
      <div className={`absolute inset-0 transition-all duration-700 ease-in-out ${getContainerStyle()}`}>
        <img
          key={currentImg.src}
          src={currentImg.src}
          alt={currentImg.name}
          className={`w-full h-full animate-fade-in-fast ${currentImg.fit === 'contain' ? 'object-contain scale-95' : 'object-cover'}`}
          style={currentImg.customStyle || {}}
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10 flex justify-between items-end">
        <div>
          <div className="flex gap-1 mb-1">
            {item.images.map((_, idx) => (
              <div key={idx} className={`h-1 rounded-full transition-all duration-500 ${idx === currentImgIdx ? 'w-4 bg-white' : 'w-1 bg-white/30'}`} />
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            <p className="text-white font-bold text-sm tracking-wide transition-all duration-500">{currentImg.name}</p>
            {!['市場情緒', '市場情緒 2.0', '美股大盤/債券/原物料', '即時個股新聞'].includes(currentImg.name) && (
              <Crown size={14} className="text-[#FFD700]" />
            )}
          </div>
        </div>
        <div className="bg-white/10 p-1.5 rounded-full backdrop-blur-md hover:bg-white/20 transition-colors">
          <Search size={14} className="text-white/80" />
        </div>
      </div>
    </div>
  );
};


// --- MAIN APP COMPONENT ---

const App = () => {
  const [activeScreen, setActiveScreen] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [displayBeta, setDisplayBeta] = useState(0);
  const [displayROI, setDisplayROI] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const scrollRef = useRef(null);

  const colors = {
    primary: '#95B1FF',
    primaryGradient: 'linear-gradient(135deg, #95B1FF 0%, #346AFF 100%)',
    bg: '#141414',
    bg2: '#1a1a1a',
    card: '#242424',
    line: '#404040',
  };

  useEffect(() => {
    if (activeScreen === 0) animateValue(0, 21.23, setDisplayROI, 1000);
    if (activeScreen === 4) animateValue(0, 1.26, setDisplayBeta, 1000);
  }, [activeScreen]);

  const animateValue = (start, end, setter, duration) => {
    let current = start;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setter(end);
        clearInterval(timer);
      } else {
        setter(Number(current.toFixed(2)));
      }
    }, 16);
  };

  const nextScreen = () => {
    if (activeScreen < screens.length - 1) setActiveScreen(activeScreen + 1);
  };

  const prevScreen = () => {
    if (activeScreen > 0) setActiveScreen(activeScreen - 1);
  };

  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchEnd = (e) => {
    if (!touchStart) return;
    const touchEnd = e.changedTouches[0].clientX;
    const distance = touchStart - touchEnd;
    if (distance > 70) nextScreen();
    if (distance < -70) prevScreen();
    setTouchStart(null);
  };

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [activeScreen]);

  const screens = [
    // 1. Overall
    {
      id: 'overall',
      content: (
        <div className="flex flex-col min-h-full pb-10 fade-in">
          <div className="mt-12 mb-6">
            <span className="text-xs font-bold px-3 py-1.5 rounded-full border border-[#404040] text-white tracking-widest uppercase bg-[#282828] shadow-sm">
              2025 年度回顧
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-2 text-white leading-tight">超越大盤的</h1>
          <h1 className="text-4xl md:text-5xl font-black mb-6" style={{ background: colors.primaryGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            邏輯勝利
          </h1>
          <p className="text-[#B0B0B0] text-sm md:text-base mb-8 leading-relaxed">+21.23% 不是終點，而是 5 次關鍵進化的結果。</p>

          <div className="bg-[#242424] rounded-[32px] p-6 md:p-8 mb-6 border border-white/5 relative overflow-hidden shadow-2xl scale-in">
            <div className="absolute -top-10 -right-10 opacity-5">
              <TrendingUp size={200} color={colors.primary} />
            </div>
            <div className="relative z-10">
              <div className="flex flex-col items-start mb-2">
                <div>
                  <p className="text-[#B0B0B0] text-sm font-medium mb-1">Talk 君年度回報</p>
                  <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-3">
                    +{displayROI.toFixed(2)}%
                  </h2>
                </div>
                <div className="flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-lg border border-white/5 backdrop-blur-sm">
                  <p className="text-[#666] text-xs font-bold uppercase">vs S&P 500</p>
                  <div className="w-px h-3 bg-[#404040]"></div>
                  <h3 className="text-sm md:text-base font-bold text-[#808080] tracking-tight">
                    +17.88%
                  </h3>
                </div>
              </div>
              <ComparisonLineChart data={chartData} />
              <div className="flex justify-between text-[10px] text-[#666] mt-4 font-bold uppercase tracking-wider px-1">
                <span>May</span>
                <span>Jul</span>
                <span>Sep</span>
                <span>Nov</span>
                <span>Dec</span>
              </div>
            </div>
          </div>
          <p className="text-[#fff] text-xs font-base text-center opacity-50">
            *白色實線為Talk君淨值，灰色虛線為同期 S&P 500 表現，績效統計自 2025/05/12 起算（基準值 0%），基於APP內實際持倉紀錄計算區間累計回報。過往表現不保證未來收益，請自行評估投資風險。
          </p>
        </div>
      )
    },

    // 2. Trajectory
    {
      id: 'trajectory',
      content: (
        <div className="flex flex-col min-h-full pb-10">
          <div className="fade-in mt-6">
            <h2 className="text-3xl font-black text-white mb-3 flex items-center gap-3 mb-10">
              <Calendar size={32} color={colors.primary} />
              時機抓對了 執行力讓數字說話
            </h2>
          </div>
          <div className="space-y-12 relative">
            <div className="absolute left-[31px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-[#95B1FF] to-transparent"></div>
            {[
              { date: '04/09', tag: '解放日', title: '關稅風暴後：多頭確立', desc: '多頭確立｜堅定不交籌碼，加倉 QQQ 與特斯拉', color: '#FF8A8A' },
              { date: '05/07', tag: '宏觀定調', title: '聯準會的耐心測試', desc: '策略性配置 30% SHY 短債觀望', color: colors.primary },
              //{ date: '07/22', tag: '板塊輪動', title: '能源接棒 AI', desc: 'GE 獲利逾 100% 續抱，並加倉 GEV，全面鎖定 AI 算力背後的能源缺口。', color: colors.primary },
              { date: '08/01', tag: '逆勢抄底', title: '非農暴雷：黑色星期五', desc: '不被帶節奏，逆勢加倉 TSLA 與 ARM', color: '#ADC4FF' },
              //{ date: '10/06', tag: '價值回歸', title: '重倉亞馬遜', desc: '看好 AWS 利潤率與電商旺季，在財報前夕將 AMZN 權重拉升至 17%，回歸價值本質。', color: colors.primary },
              { date: '11/25', tag: '精準對沖', title: '情緒過熱：啟動防禦', desc: '情緒指標突破 64% 警戒線，主動壓降 Beta', color: colors.primary }
            ].map((item, idx) => (
              <div key={idx} className="relative pl-24 slide-up opacity-0" style={{ animationDelay: `${idx * 0.15}s`, animationFillMode: 'forwards' }}>
                <div className="absolute left-4 top-1 w-8 h-8 rounded-full border-4 border-[#141414] z-10 flex items-center justify-center shadow-lg transform transition-transform hover:scale-110" style={{ backgroundColor: item.color }}>
                  <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                </div>
                <div className="flex items-center gap-2 mb-1.5">
                  <p className="text-sm font-black" style={{ color: item.color }}>{item.date}</p>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#404040] text-white font-bold uppercase">{item.tag}</span>
                </div>
                <h3 className="text-white font-bold text-xl mb-1">{item.title}</h3>
                <p className="text-[#B0B0B0] text-base leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

        </div>
      )
    },

    // 3. Trading (FIXED: ImageViewer + Full Width Readability)
    {
      id: 'trading',
      content: (
        <div className="flex flex-col min-h-full pb-10">
          <div className="fade-in mt-6">
            <h2 className="text-3xl font-black text-white mb-3 flex items-center gap-3 mb-10">
              <Award size={32} color={colors.primary} />
              APP 實戰見證：全年持續升級的致勝引擎
            </h2>
          </div>
          <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-1">
            {[
              {
                code: 'GE', name: '奇異航太', roi: '+99.9%',
                op: '均價 $128.80 ➡️ 11/17 $257.50 結算',
                comment: '「航天行業幾乎無競爭對手，服務營收穩定。」',
                metric: '關鍵指標：服務營收佔比 / 寡佔定價權',
                img: `${import.meta.env.BASE_URL}images/GE.png`
              },
              {
                code: 'INTC', name: '英特爾', roi: '+51.7%',
                op: '7/25 入場 $20.60 ➡️ 均價 $22.64 ➡️ 年底 $34.35',
                comment: '「基本面展露逆境反轉，台海風險的對沖資產。」',
                metric: '關鍵指標：P/B Ratio 歷史低位 / 營收轉折點',
                img: `${import.meta.env.BASE_URL}images/INTC.png`
              },
              {
                code: 'TSLA', name: '特斯拉', roi: '+23.5%',
                op: '底層策略入場 $220.00 ➡️ 均價 $247.00 ➡️ 年底 $305',
                comment: '「自動駕駛的唯一股，堅守 FSD 信念。」',
                metric: '關鍵指標：FSD 滲透率 / 算力基礎設施化',
                img: `${import.meta.env.BASE_URL}images/TSLA.png`
              }
            ].map((stock, idx) => (
              <div key={idx} className="bg-[#242424] border border-white/5 rounded-[32px] p-7 shadow-xl slide-up opacity-0" style={{ animationDelay: `${idx * 0.15}s`, animationFillMode: 'forwards' }}>
                <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <span className="text-sm px-3 py-1 rounded-xl bg-black text-[#95B1FF] font-black border border-white/10 uppercase tracking-widest">{stock.code}</span>
                    <span className="text-white font-black text-xl">{stock.name}</span>
                  </div>
                  <p className="text-3xl font-black italic text-[#95B1FF]">{stock.roi}</p>
                </div>

                <p className="text-[#95B1FF] text-sm font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Activity size={14} /> {stock.metric}
                </p>

                {/* UPDATED: h-auto + object-contain + Click to View */}
                <img
                  src={stock.img}
                  alt={stock.name}
                  onClick={() => setSelectedImage(stock.img)}
                  className="w-full h-auto object-contain rounded-xl mb-4 border border-white/10 opacity-90 cursor-pointer hover:opacity-100 transition-opacity bg-black/20"
                />

                <div className="mb-5 bg-black/30 p-5 rounded-2xl border-2 border-white/5 shadow-inner">
                  <p className="text-white text-sm font-normal leading-relaxed">{stock.op}</p>
                </div>
                <p className="text-[#B0B0B0] text-base italic leading-relaxed border-l-2 border-[#95B1FF]/30 pl-4">{stock.comment}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-[#242424] rounded-2xl p-4 border border-white/5 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[#95B1FF]/20 rounded-lg">
                <BarChart3 size={20} className="text-[#95B1FF]" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">以上交易紀錄來自APP中的「持倉清單」</p>
                <p className="text-[#B0B0B0] text-xs">到「持倉清單」中看完整的持倉動態與即時價格</p>
              </div>
            </div>
            <img
              src={`${import.meta.env.BASE_URL}images/stock_holding.png`}
              alt="Holding List"
              className="w-full h-auto rounded-xl border border-white/10 opacity-90 hover:opacity-100 transition-opacity cursor-pointer"
              onClick={() => setSelectedImage(`${import.meta.env.BASE_URL}images/stock_holding.png`)}
            />
          </div>
        </div>
      )
    },

    // 4. App Iteration
    {
      id: 'app-iteration',
      content: (
        <div className="flex flex-col min-h-full pb-10">
          <div className="fade-in mt-6 mb-4">
            <h2 className="text-3xl font-black text-white mb-2 flex items-center gap-3 mb-10">
              <Rocket size={32} className="text-[#95B1FF]" />
              2025 功能回顧：投資 Talk 君進化之路
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 pb-20 space-y-12">
            {[
              {
                date: 'MAY',
                year: '2025',
                title: 'App 正式啟航：五大核心選股系統',
                desc: 'Talk君持倉、觀察與潛力股追蹤，一站建立最強地基。',
                bg: 'bg-gradient-to-br from-[#4c6ef5] via-[#5c7cfa] to-[#748ffc]',
                shadow: 'shadow-[#4c6ef5]/30',
                variant: 'tilt',
                images: [
                  { name: '持倉清單', src: `${import.meta.env.BASE_URL}images/holding.png` },
                  { name: '選股策略', src: `${import.meta.env.BASE_URL}images/strategy.png` },
                  { name: '市場情緒', src: `${import.meta.env.BASE_URL}images/marketpart.png` }
                ]
              },
              {
                date: 'AUG',
                year: '2025',
                title: '量化風險監測體系：Beta 護航引擎',
                desc: '導入 Beta 計算機與市場情緒指標，風險數值化趨勢曲線掌握全局',
                bg: 'bg-gradient-to-br from-[#ff6b6b] via-[#fa5252] to-[#e03131]',
                shadow: 'shadow-[#ff6b6b]/40',
                variant: 'zoom',
                highlight: true,
                images: [
                  { name: '市場情緒 2.0', src: `${import.meta.env.BASE_URL}images/marketpart2.png` },
                  { name: 'Beta 計算機', src: `${import.meta.env.BASE_URL}images/beta.png` }
                ]
              },
              {
                date: 'NOV',
                year: '2025',
                title: '全維數據集成：總經看板與社群即時聯動',
                desc: '整合文字聊天室與板塊 ETF，市場觀點與趨勢脈動一目了然。',
                bg: 'bg-gradient-to-br from-[#7950f2] via-[#845ef7] to-[#be4bdb]',
                shadow: 'shadow-[#7950f2]/40',
                variant: 'default',
                images: [
                  { name: '文字聊天室', src: `${import.meta.env.BASE_URL}images/chatroom.png` },
                  {
                    name: '美股大盤/債券/原物料',
                    src: `${import.meta.env.BASE_URL}images/stock_overview.png`,
                    fit: 'contain',
                    customStyle: {
                      transform: 'scale(1.3) translateY(-25%)',
                      transformOrigin: 'top center'
                    }
                  }
                ]
              },
              {
                date: 'DEC',
                year: '2025',
                title: '即時觀點升級：語音直播 VIP 互動生態',
                desc: '強化熱門主題即時拆解，搭配專屬問答與直播重點整理，觀點交流零距離。',
                bg: 'bg-gradient-to-br from-[#12b886] via-[#20c997] to-[#38d9a9]',
                shadow: 'shadow-[#12b886]/40',
                variant: 'wide',
                images: [
                  { name: '語音直播', src: `${import.meta.env.BASE_URL}images/live.png`, fit: 'contain' },
                  { name: '即時個股新聞', src: `${import.meta.env.BASE_URL}images/news.png` }
                ]
              }
            ].map((item, idx) => (
              <div key={idx} className="relative group slide-up opacity-0" style={{ animationDelay: `${idx * 0.15}s`, animationFillMode: 'forwards' }}>
                {idx !== 3 && <div className="absolute left-[28px] top-[60px] bottom-[-48px] w-[3px] bg-[#333] rounded-full -z-10 opacity-30" />}
                <div className="flex items-start gap-5 mb-5 pl-1">
                  <div className="flex flex-col items-center justify-center bg-[#2a2a2a] w-[56px] h-[56px] rounded-2xl border border-white/10 shadow-xl shrink-0 z-10">
                    <span className="text-[14px] font-black text-white leading-none">{item.date}</span>
                    <span className="text-[10px] font-bold text-[#666]">{item.year}</span>
                  </div>

                  <div className="pt-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-white font-black text-2xl tracking-tight">{item.title}</h4>
                      {item.highlight && <span className="bg-[#FFD700] text-black text-[10px] px-1.5 py-0.5 rounded font-black uppercase">Star</span>}
                    </div>
                    <p className="text-[#B0B0B0] text-sm font-medium leading-relaxed max-w-sm">{item.desc}</p>
                  </div>
                </div>
                <div className="px-4">
                  <AutoFeatureCard item={item} onImageClick={setSelectedImage} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },

    // 5. Calendar
    {
      id: '2026-calendar',
      content: (
        <div className="flex flex-col min-h-full pb-10">
          {/* --- MOVED: Beta Value & CTA --- */}
          <div className="mt-4 pt-8 border-t border-white/10">
            <div className="fade-in mt-6">
              <h2 className="text-3xl font-black text-white mb-3 flex items-center gap-3 mb-10">
                <ShieldCheck size={32} color={colors.primary} />
                宏觀巨變在即 APP功能讓你快一步
              </h2>
            </div>

            <div className="bg-[#242424] rounded-[40px] p-8 border border-white/5 flex flex-col items-center mb-8 shadow-2xl relative overflow-hidden scale-in">
              <div className="relative w-56 h-56 mb-4">
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#2a2a2a" strokeWidth="8" />
                  <circle cx="50" cy="50" r="45" fill="none" stroke={colors.primary} strokeWidth="8" strokeDasharray={`${(displayBeta / 1.5) * 282} 282`} style={{ transition: 'stroke-dasharray 1s ease-out' }} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
                  <p className="text-[#B0B0B0] text-sm mb-1">Talk 君 Beta</p>
                  <p className="text-white text-6xl font-black tracking-tighter">{displayBeta.toFixed(2)}</p>
                  <p className="text-[#95B1FF] text-xs font-black mt-2 uppercase tracking-widest bg-[#95B1FF]/10 px-3 py-1 rounded-full">Defense Mode</p>
                </div>
              </div>

              <div className="bg-[#141414] rounded-3xl p-6 w-full flex items-center gap-4 slide-up" style={{ animationDelay: '0.3s' }}>
                <Zap size={24} className="text-[#95B1FF] shrink-0" />
                <p className="text-[#E0E0E0] text-sm leading-relaxed">
                  面對變數，我們將 Beta 降至 <span className="text-[#95B1FF] font-bold">1.26</span>，你呢？
                </p>
              </div>
            </div>
          </div>
          <div className="fade-in mt-6">
            <h2 className="text-3xl font-black text-white mb-3 flex items-center gap-3">
              <Activity size={32} color={colors.primary} />
              2026，從「盈餘驅動」轉向「政策驅動」
            </h2>
          </div>
          <div className="space-y-10">
            {[
              { id: 1, title: '聯準會主席變更', desc: '新舊交接期的政策連續性與不確定性將是核心。', img: 'https://images.pexels.com/photos/2862155/pexels-photo-2862155.jpeg' },
              { id: 2, title: '失業率與軟著陸', desc: '正式驗證美國經濟是否能在高利率下軟著陸。', img: 'https://images.pexels.com/photos/52608/pexels-photo-52608.jpeg' },
              { id: 3, title: '策略性壓降 Beta', desc: '計畫將組合 Beta 回歸 1.0，以防禦姿態等待。', img: 'https://images.pexels.com/photos/159888/pexels-photo-159888.jpeg' }
            ].map((item, idx) => (
              <div key={idx} className="relative bg-[#242424] rounded-[32px] overflow-hidden border border-white/5 shadow-xl slide-up opacity-0" style={{ animationDelay: `${idx * 0.15}s`, animationFillMode: 'forwards' }}>
                <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: `url(${item.img})` }} />
                <div className="absolute inset-0 bg-black/55" />
                <div className="relative z-10 p-8">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#95B1FF] text-black font-black flex items-center justify-center">{item.id}</div>
                    <h4 className="text-white text-xl font-black">{item.title}</h4>
                  </div>
                  <p className="text-[#B0B0B0] text-base leading-relaxed pl-14">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          {/* New Section: 3 Feature Cards */}
          <div className="mt-12 slide-up" style={{ animationDelay: '0.5s' }}>
            <div className="flex items-center gap-2 mb-4 px-2 opacity-80">
              <div className="w-1 h-4 bg-[#95B1FF] rounded-full"></div>
              <h3 className="text-white font-bold text-lg tracking-wide">APP 每週更新，不在錯過任何重要總經時事</h3>
            </div>

            <div className="space-y-4">
              {/* Row 1: Updates & Reports */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { title: '美股盤勢整理', sub: '每週二、四更新', img: 'stock_post.png' },
                  { title: '美股趨勢剖析', sub: '每週五發布', img: 'stock_report.png' }
                ].map((card, i) => (
                  <div key={i} className="bg-[#242424] rounded-[24px] overflow-hidden border border-white/5 shadow-xl flex flex-col group">
                    <div className="h-28 overflow-hidden relative">
                      <img
                        src={`${import.meta.env.BASE_URL}images/${card.img}`}
                        alt={card.title}
                        className="w-full h-full object-cover object-top opacity-90 group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-center bg-[#242424] relative z-20">
                      <h4 className="text-white font-bold text-md mb-1 leading-tight">{card.title}</h4>
                      <p className="text-[#95B1FF] text-[14px] uppercase tracking-wide">{card.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Row 2: Calendar */}
              <div className="bg-[#242424] rounded-[24px] overflow-hidden border border-white/5 shadow-xl flex flex-col group">
                <div className="h-42 overflow-hidden relative">
                  <img
                    src={`${import.meta.env.BASE_URL}images/calendar.png`}
                    alt="美股行事曆"
                    className="w-full h-full object-cover object-top opacity-90 group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 flex items-center justify-between bg-[#242424] relative z-20">
                  <div>
                    <h4 className="text-white font-bold text-lg mb-1 leading-tight">美股行事曆</h4>
                    <p className="text-[#95B1FF] text-xs font-bold uppercase tracking-wide">即將發布</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#333] flex items-center justify-center">
                    <Crown size={14} className="text-[#FFD700]" />
                  </div>
                </div>
              </div>
            </div>
          </div>


        </div>
      )
    },

    // 6. Campaign Page
    {
      id: 'campaign',
      content: (
        <div className="flex flex-col min-h-full pb-10">
          <div className="fade-in mt-6">
            <h2 className="text-2xl font-black text-white mb-4 flex items-center gap-2">
              <Gift size={24} className="text-[#FF69B4]" />
              年度寵粉｜分享領直播券
            </h2>
          </div>

          <div className="bg-[#2a2a2a] rounded-[24px] p-5 border border-white/5 shadow-2xl relative overflow-hidden scale-in">
            <div className="absolute top-0 right-0 p-3 opacity-5">
              <Gift size={80} className="text-[#FF69B4]" />
            </div>

            <div className="relative z-10 mb-4">
              <p className="text-white text-lg font-black mb-1">完成任務領 2 月語音直播券</p>
              <p className="text-[#B0B0B0] text-xs leading-relaxed">
                分享以下內容至社團大廳，即刻開通權限：
              </p>
            </div>

            <div className="space-y-2 relative z-10 mb-4">
              <div className="bg-[#141414]/80 backdrop-blur-sm rounded-xl p-3 border border-white/10 flex gap-3 items-center">
                <div className="bg-[#95B1FF]/20 p-2 rounded-full text-[#95B1FF] shrink-0">
                  <Camera size={16} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">1. 你的 Beta 值與截圖</h4>
                </div>
              </div>

              <div className="bg-[#141414]/80 backdrop-blur-sm rounded-xl p-3 border border-white/10 flex gap-3 items-center">
                <div className="bg-[#95B1FF]/20 p-2 rounded-full text-[#95B1FF] shrink-0">
                  <MessageSquare size={16} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">2. 2026 最期待的 APP 功能</h4>
                </div>
              </div>
            </div>

            {/* Visual Placeholder for Example - Condensed */}
            <div className="w-full h-24 bg-gradient-to-br from-[#141414] to-[#242424] rounded-lg border border-dashed border-white/20 flex flex-col items-center justify-center text-[#666] mb-4 relative overflow-hidden group hover:border-[#FF69B4]/30 transition-colors">
              <div className="z-10 flex items-center gap-2 opacity-70">
                <Share2 size={14} />
                <span className="text-[10px] font-bold">分享範例預覽</span>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 relative z-10 flex items-center justify-between">
              <div>
                <span className="text-[#FFD700] font-bold flex items-center gap-1.5 text-xs"><Crown size={14} /> 達成獎勵</span>
                <span className="text-[#B0B0B0] text-[10px] block mt-0.5">2 月首場語音直播入場券 (2/6前發放)</span>
              </div>
              <div className="text-right">
                <span className="text-[#B0B0B0] text-[10px] block font-bold">截止日</span>
                <span className="text-[#FF69B4] text-xs font-black">1/31 23:59 (美東)</span>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-4 fade-in" style={{ animationDelay: '0.3s' }}>
            <button className="w-full py-4 rounded-[24px] font-black text-lg text-white bg-gradient-to-r from-[#FF69B4] to-[#FF8A8A] shadow-md shadow-[#FF69B4]/10 active:scale-95 transition-all flex items-center justify-center gap-2 hover:brightness-110">
              <ShieldCheck size={20} />
              立即計算 Beta 領券
            </button>
          </div>
        </div>
      )
    }
  ];

  return (
    <div
      className="w-full h-[100dvh] bg-[#141414] text-[#E0E0E0] font-sans select-none overflow-hidden flex flex-col relative"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="fixed top-0 left-0 right-0 z-50 pt-10 pb-6 bg-gradient-to-b from-[#141414] via-[#141414]/90 to-transparent flex justify-center gap-2.5 pointer-events-none">
        {screens.map((_, idx) => (
          <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 shadow-md ${activeScreen === idx ? 'w-10 bg-[#95B1FF]' : 'w-2.5 bg-[#404040]'}`} />
        ))}
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 pt-20 pb-32 custom-scrollbar relative">
        <div key={activeScreen} className="min-h-full">
          {screens[activeScreen].content}
        </div>
      </div>

      {selectedImage && <ImageViewer src={selectedImage} onClose={() => setSelectedImage(null)} />}

      <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
        <div className="bg-[#1a1a1a]/90 backdrop-blur-xl border border-white/10 p-1.5 rounded-full shadow-2xl flex items-center gap-2 pointer-events-auto">
          <button
            onClick={prevScreen}
            disabled={activeScreen === 0}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${activeScreen === 0 ? 'opacity-20 pointer-events-none' : 'hover:bg-white/10 text-white'}`}
          >
            <ArrowLeft size={20} />
          </button>
          <div className="w-px h-6 bg-white/10"></div>
          <button
            onClick={nextScreen}
            disabled={activeScreen === screens.length - 1}
            className={`h-12 px-6 rounded-full flex items-center gap-2 font-bold transition-all ${activeScreen === screens.length - 1 ? 'opacity-20 pointer-events-none bg-[#242424]' : 'bg-primary-gradient text-white shadow-lg active:scale-95'}`}
          >
            <span className="text-sm">下一頁</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      <style>{`
        .bg-primary-gradient { background: linear-gradient(135deg, #95B1FF 0%, #346AFF 100%); }
        .custom-scrollbar::-webkit-scrollbar { width: 0px; }
        .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .fade-in { animation: fadeIn 0.8s ease-out forwards; }
        
        /* UPDATED: Faster transition (0.7s) */
        .animate-fade-in-fast { animation: fadeIn 0.7s ease-out forwards; }
        
        .slide-up { animation: slideUp 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards; }
        .scale-in { animation: scaleIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-scale-in { animation: scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-pop-in { animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes popIn { from { opacity: 0; transform: translate(-50%, -50%) scale(0); } to { opacity: 1; transform: translate(-50%, -50%) scale(1); } }
        
        .animate-draw-stroke {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: drawStroke 2s ease-out forwards;
        }
        @keyframes drawStroke {
          to { stroke-dashoffset: 0; }
        }
        .animate-fade-in-delayed {
          opacity: 0;
          animation: fadeIn 0.5s ease-out forwards 0.5s;
        }
      `}</style>
    </div>
  );
};

export default App;
