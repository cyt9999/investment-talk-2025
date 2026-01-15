import React, { useState, useRef, useEffect } from 'react';
import {
  TrendingUp, Target, Calendar, Award, Rocket, ShieldCheck, Activity,
  Lock, ChevronRight, ArrowLeft, ArrowRight, Bell, Search, Crown,
  PlayCircle, Mic, Zap, BarChart3, X, Gift, Share2, Camera, MessageSquare,
  AlarmClock, Globe
} from 'lucide-react';
import { translations } from './translations';

// --- DATA & HELPER COMPONENTS ---

// ROI Data (Normalized: May 12 = 0%)
const chartData = [
  { date: "2025-05-31", talk: 35.73, sp500: 0.51 },
  { date: "2025-06-30", talk: 38.3, sp500: 5.5 },
  { date: "2025-07-30", talk: 39.2, sp500: 8.2 },
  { date: "2025-08-25", talk: 42.4, sp500: 9.4 },
  { date: "2025-09-22", talk: 56.9, sp500: 13.8 },
  { date: "2025-10-27", talk: 58.9, sp500: 16.9 },
  { date: "2025-11-28", talk: 52.9, sp500: 16.4 },
  { date: "2025-12-31", talk: 50.8, sp500: 16.4 }
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
      case 'wide': return '';
      default: return '';
    }
  };

  const currentImg = item.images[currentImgIdx];

  return (
    <div
      className={`relative w-full overflow-hidden rounded-[24px] shadow-2xl transition-all duration-500 bg-[#1a1a1a] shadow-inner aspect-video`}
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
          className={`w-full h-full animate-fade-in-fast ${currentImg.fit === 'contain' ? 'object-contain scale-95' : 'object-contain object-top p-3'}`}
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
    </div >
  );
};


// --- MAIN APP COMPONENT ---

const App = () => {
  const [activeScreen, setActiveScreen] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [displayBeta, setDisplayBeta] = useState(0);
  const [displayROI, setDisplayROI] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [language, setLanguage] = useState('TC');
  const scrollRef = useRef(null);

  const t = translations[language];

  const colors = {
    primary: '#95B1FF',
    primaryGradient: 'linear-gradient(135deg, #95B1FF 0%, #346AFF 100%)',
    bg: '#141414',
    bg2: '#1a1a1a',
    card: '#242424',
    line: '#404040',
  };

  useEffect(() => {
    if (activeScreen === 0) animateValue(0, 50.8, setDisplayROI, 1000);
    if (activeScreen === 4) animateValue(0, 1.22, setDisplayBeta, 1000);
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

  // Auto-advance for Story Transition (Screen 5)
  useEffect(() => {
    if (activeScreen === 5) {
      const timer = setTimeout(() => {
        nextScreen();
      }, 7500);
      return () => clearTimeout(timer);
    }
  }, [activeScreen]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: t.campaign.shareTextTitle,
          text: t.campaign.shareTextBody,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing', error);
      }
    } else {
      // Fallback
      alert('您的瀏覽器不支援原生分享，請截圖分享！');
    }
  };

  const screens = [
    // 1. Overall
    {
      id: 'overall',
      content: (
        <div className="flex flex-col min-h-full pb-10 fade-in">
          <div className="mt-12 mb-6 flex justify-between items-start">
            <span className="text-xs font-bold px-3 py-1.5 rounded-full border border-[#404040] text-white tracking-widest uppercase bg-[#282828] shadow-sm">
              {t.overall.badge}
            </span>
            {/* Language Toggle */}
            <div className="flex bg-[#282828] rounded-full p-1 border border-[#404040]">
              <button
                onClick={() => setLanguage('TC')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${language === 'TC' ? 'bg-[#95B1FF] text-[#141414]' : 'text-[#808080] hover:text-white'}`}
              >
                繁中
              </button>
              <button
                onClick={() => setLanguage('SC')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${language === 'SC' ? 'bg-[#ff95b1] text-[#141414]' : 'text-[#808080] hover:text-white'}`}
              >
                简中
              </button>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-2 text-white leading-tight">{t.overall.titlePrefix}</h1>
          <h1 className="text-4xl md:text-5xl font-black mb-6" style={{ background: colors.primaryGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {t.overall.titleMain}
          </h1>
          <p className="text-[#B0B0B0] text-sm md:text-base mb-8 leading-relaxed">{t.overall.description}</p>

          <div className="bg-[#242424] rounded-[32px] p-6 md:p-8 mb-6 border border-white/5 relative overflow-hidden shadow-2xl scale-in">
            <div className="absolute -top-10 -right-10 opacity-5">
              <TrendingUp size={200} color={colors.primary} />
            </div>
            <div className="relative z-10">
              <div className="flex flex-col items-start mb-2">
                <div>
                  <p className="text-[#B0B0B0] text-sm font-medium mb-1">{t.overall.returnLabel}</p>
                  <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-3">
                    +{displayROI.toFixed(2)}%
                  </h2>
                </div>
                <div className="flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-lg border border-white/5 backdrop-blur-sm">
                  <p className="text-[#666] text-xs font-bold uppercase">{t.overall.sp500Label}</p>
                  <div className="w-px h-3 bg-[#404040]"></div>
                  <h3 className="text-sm md:text-base font-bold text-[#808080] tracking-tight">
                    +17.88%
                  </h3>
                </div>
              </div>
              <ComparisonLineChart data={chartData} />
              <div className="flex justify-between text-[10px] text-[#666] mt-4 font-bold uppercase tracking-wider px-1">
                {t.overall.months.map((m, i) => <span key={i}>{m}</span>)}
              </div>
            </div>
          </div>
          <p className="text-[#fff] text-xs font-base text-center opacity-50">
            {t.overall.disclaimer}
          </p>
        </div>
      )
    },

    // 2. Trading (FIXED: ImageViewer + Full Width Readability)
    {
      id: 'trading',
      content: (
        <div className="flex flex-col min-h-full pb-10">
          <div className="fade-in my-6">
            <h2 className="text-3xl font-black text-white mb-3 flex items-center gap-3 mb-10">
              <Award size={32} color={colors.primary} />
              {t.trading.title}
            </h2>
          </div>
          <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-1">
            {t.trading.records.map((stock, idx) => {
              const imgs = ['GE.png', 'INTC.png', 'TSLA.png'];
              const imgSrc = `${import.meta.env.BASE_URL}images/${imgs[idx]}`;
              return (
                <div key={idx} className="bg-[#242424] border border-white/5 rounded-[32px] p-7 shadow-xl slide-up opacity-0" style={{ animationDelay: `${idx * 0.15}s`, animationFillMode: 'forwards' }}>
                  <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <span className="text-sm px-3 py-1 rounded-xl bg-black text-[#95B1FF] font-black border border-white/10 uppercase tracking-widest">{stock.code}</span>
                      <span className="text-white font-black text-xl">{stock.name}</span>
                    </div>
                    <p className="text-3xl font-black italic text-[#95B1FF]">{stock.roi}</p>
                  </div>

                  <p className="text-[#B0B0B0] text-base italic leading-relaxed border-l-2 border-[#95B1FF]/30 pl-4 mb-4 ">{stock.comment}</p>


                  {/* UPDATED: h-auto + object-contain + Click to View */}
                  <img
                    src={imgSrc}
                    alt={stock.name}
                    onClick={() => setSelectedImage(imgSrc)}
                    className="w-full h-auto object-contain rounded-xl mb-4 border border-white/10 opacity-90 cursor-pointer hover:opacity-100 transition-opacity bg-black/20"
                  />
                  <p className="text-[#95B1FF] text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Activity size={14} /> {stock.metric}
                  </p>
                </div>
              )
            })}
          </div>
          <div
            className="mt-4 bg-[#242424] rounded-2xl p-4 border border-white/5 shadow-lg cursor-pointer hover:border-[#95B1FF]/50 transition-all active:scale-[0.99] group"
            onClick={() => window.open('https://www.cmoney.tw/r/245/ksg7i8', '_blank')}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[#95B1FF]/20 rounded-lg group-hover:bg-[#95B1FF]/30 transition-colors">
                <BarChart3 size={20} className="text-[#95B1FF]" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">{t.trading.holdingTitle}</p>
                <p className="text-[#B0B0B0] text-xs flex items-center gap-1 group-hover:text-[#95B1FF] transition-colors">{t.trading.holdingDesc} <ArrowRight size={12} /></p>
              </div>
            </div>
            <img
              src={`${import.meta.env.BASE_URL}images/stock_holding.png`}
              alt="Holding List"
              className="w-full h-auto rounded-xl border border-white/10 opacity-90 hover:opacity-100 transition-opacity cursor-pointer hover:shadow-lg"
              onClick={(e) => { e.stopPropagation(); setSelectedImage(`${import.meta.env.BASE_URL}images/stock_holding.png`); }}
            />
          </div>
        </div>
      )
    },

    // 3. Trajectory
    {
      id: 'trajectory',
      content: (
        <div className="flex flex-col min-h-full pb-10">
          <div className="fade-in mt-6">
            <h2 className="text-3xl font-black text-white flex items-center gap-3 mb-3">
              <Calendar size={32} color={colors.primary} />
              {t.trajectory.title}
            </h2>
          </div>
          <div className="space-y-12 relative">
            <div className="absolute left-[31px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-[#95B1FF] to-transparent"></div>
            {t.trajectory.items.map((item, idx) => {
              // Map colors based on index to preserve design
              const itemColors = ['#FF8A8A', colors.primary, '#ADC4FF', colors.primary];
              const color = itemColors[idx] || colors.primary;

              return (
                <div key={idx} className="relative pl-24 slide-up opacity-0" style={{ animationDelay: `${idx * 0.15}s`, animationFillMode: 'forwards' }}>
                  <div className="absolute left-4 top-1 w-8 h-8 rounded-full border-4 border-[#141414] z-10 flex items-center justify-center shadow-lg transform transition-transform hover:scale-110" style={{ backgroundColor: color }}>
                    <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                  </div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <p className="text-sm font-black" style={{ color: color }}>{item.date}</p>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#404040] text-white font-bold uppercase">{item.tag}</span>
                  </div>
                  <h3 className="text-white font-bold text-xl mb-1">{item.title}</h3>
                  <p className="text-[#B0B0B0] text-base leading-relaxed">{item.desc}</p>
                </div>
              )
            })}
          </div>

        </div>
      )
    },

    // 4. App Iteration
    {
      id: 'app-iteration',
      content: (
        <div className="flex flex-col min-h-full pb-10">
          <div className="fade-in my-6">
            <h2 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
              <Rocket size={32} className="text-[#95B1FF]" />
              {t.appIteration.title}
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 pb-20 space-y-12">
            {t.appIteration.items.map((item, idx) => {
              const staticIterationData = [
                {
                  bg: 'bg-gradient-to-br from-[#4c6ef5] via-[#5c7cfa] to-[#748ffc]',
                  shadow: 'shadow-[#4c6ef5]/30',
                  variant: 'tilt',
                  imgs: ['holding.png', 'strategy.png', 'marketpart.png']
                },
                {
                  bg: 'bg-gradient-to-br from-[#ff6b6b] via-[#fa5252] to-[#e03131]',
                  shadow: 'shadow-[#ff6b6b]/40',
                  variant: 'zoom',
                  highlight: true,
                  imgs: ['marketpart2.png', 'beta.png']
                },
                {
                  bg: 'bg-gradient-to-br from-[#7950f2] via-[#845ef7] to-[#be4bdb]',
                  shadow: 'shadow-[#7950f2]/40',
                  variant: 'default',
                  imgs: ['chatroom.png', 'stock_overview.png'],
                  imgConfigs: [{}, { fit: 'contain', customStyle: { transform: 'scale(1.3) translateY(-25%)', transformOrigin: 'top center' } }]
                },
                {
                  bg: 'bg-gradient-to-br from-[#12b886] via-[#20c997] to-[#38d9a9]',
                  shadow: 'shadow-[#12b886]/40',
                  variant: 'wide',
                  imgs: ['live.png', 'news.png'],
                  imgConfigs: [{ fit: 'contain' }, {}]
                }
              ];
              const s = staticIterationData[idx];

              // Merge translation and static data
              const finalItem = {
                ...item,
                ...s,
                images: item.images.map((img, imgIdx) => ({
                  ...img,
                  src: `${import.meta.env.BASE_URL}images/${s.imgs[imgIdx]}`,
                  ...(s.imgConfigs?.[imgIdx] || {})
                }))
              };

              return (
                <div key={idx} className="relative group slide-up opacity-0" style={{ animationDelay: `${idx * 0.15}s`, animationFillMode: 'forwards' }}>
                  {idx !== 3 && <div className="absolute left-[28px] top-[60px] bottom-[-48px] w-[3px] bg-[#333] rounded-full -z-10 opacity-30" />}
                  <div className="flex items-start gap-5 mb-5 pl-1">
                    <div className="flex flex-col items-center justify-center bg-[#2a2a2a] w-[56px] h-[56px] rounded-2xl border border-white/10 shadow-xl shrink-0 z-10">
                      <span className="text-[14px] font-black text-white leading-none">{item.date}</span>
                      <span className="text-[10px] font-bold text-[#666]">{item.year}</span>
                    </div>

                    <div className="pt-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-white font-bold text-xl tracking-tight">{item.title}</h4>
                        {finalItem.highlight && <span className="bg-[#FFD700] text-black text-[10px] px-1.5 py-0.5 rounded font-black uppercase">Star</span>}
                      </div>
                      <p className="text-[#B0B0B0] text-sm font-medium leading-relaxed max-w-sm">{item.desc}</p>
                    </div>
                  </div>
                  <div className="px-4">
                    <AutoFeatureCard item={finalItem} onImageClick={setSelectedImage} />
                  </div>
                </div>
              )
            })}
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
          <div>
            <div className="fade-in my-6">
              <h2 className="text-3xl font-black text-white mb-3 flex items-center gap-3">
                <ShieldCheck size={32} color={colors.primary} />
                {t.calendar.title1}
              </h2>
            </div>

            <div
              className="bg-[#242424] rounded-[32px] p-6 border border-white/5 mb-8 shadow-2xl relative overflow-hidden slide-up cursor-pointer hover:border-[#95B1FF]/50 transition-all active:scale-[0.99]"
              onClick={() => window.open('https://www.cmoney.tw/r/245/ksg7i8', '_blank')}
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[#B0B0B0] text-xs font-bold uppercase tracking-wider mb-1">{t.calendar.betaLabel}</p>
                    <p className="text-white text-4xl font-black tracking-tighter leading-none">{displayBeta.toFixed(2)}</p>
                  </div>
                  <div className="pb-1">
                    <span className="text-[#95B1FF] text-xl font-black uppercase tracking-widest leading-none">{t.calendar.attackLabel}</span>
                  </div>
                </div>

                {/* Progress Bar Chart */}
                <div className="relative h-4 bg-[#141414] rounded-full overflow-hidden border border-white/5">
                  {/* Tick marks */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10 z-10"></div>
                  <div className="absolute left-1/4 top-0 bottom-0 w-px bg-white/5 z-0"></div>
                  <div className="absolute left-3/4 top-0 bottom-0 w-px bg-white/5 z-0"></div>

                  {/* Bar */}
                  <div
                    className="h-full bg-primary-gradient rounded-full shadow-[0_0_15px_rgba(149,177,255,0.5)] relative"
                    style={{ width: `${(displayBeta / 2) * 100}%`, transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' }}
                  >
                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/50"></div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <span className="text-md">🤫</span>
                  <p className="text-[#afafaf] text-sm font-medium">{t.calendar.whisper} <ArrowRight size={12} className="inline" /></p>
                </div>
              </div>
            </div>
          </div>
          <div className="fade-in">
            <h3 className="text-xl font-bold text-white py-3 flex items-center gap-3">
              <Activity size={32} color={colors.primary} />
              {t.calendar.title2}
            </h3>
          </div>
          <div className="space-y-10 my-6">
            {t.calendar.events.map((item, idx) => {
              const imgs = [
                'https://images.pexels.com/photos/2862155/pexels-photo-2862155.jpeg',
                'https://images.pexels.com/photos/52608/pexels-photo-52608.jpeg',
                'https://images.pexels.com/photos/159888/pexels-photo-159888.jpeg'
              ];
              return (
                <div key={idx} className="relative bg-[#242424] rounded-[16px] overflow-hidden border border-white/5 shadow-xl slide-up opacity-0" style={{ animationDelay: `${idx * 0.15}s`, animationFillMode: 'forwards' }}>
                  <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: `url(${imgs[idx]})` }} />
                  <div className="absolute inset-0 bg-black/55" />
                  <div className="relative z-10 p-4">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="w-10 h-10 rounded-2xl bg-[#95B1FF] text-black font-bold flex items-center justify-center">{item.id}</div>
                      <h4 className="text-white text-xl font-bold">{item.title}</h4>
                    </div>
                    <p className="text-[#B0B0B0] text-base leading-relaxed pl-14">{item.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
          {/* Row 2: Calendar - Nudge Note Style */}
          <div className="bg-gradient-to-r from-[#242424] to-[#95B1FF]/20 rounded-2xl p-4 border border-white/5 flex items-center justify-between shadow-lg group hover:border-[#95B1FF]/30 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-white/5 flex items-center justify-center shrink-0">
                <Calendar size={24} className="text-[#95B1FF]" />
              </div>
              <div>
                <h4 className="text-white font-bold text-md mb-1">{t.calendar.nudgeTitle}</h4>
                <p className="text-[#afafaf] text-sm">{t.calendar.nudgeDesc}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 pl-2">
              <span className="text-[#FFD700] text-[10px] font-bold uppercase tracking-wider bg-[#FFD700]/10 px-2 py-1 rounded-full whitespace-nowrap">{t.calendar.comingSoon}</span>
            </div>
          </div>
          {/* New Section: 3 Feature Cards */}
          <div className="mt-12 slide-up" style={{ animationDelay: '0.5s' }}>
            <div className="flex items-center gap-2 mb-4 px-2 opacity-80">
              <h3 className="text-xl font-black text-white py-3 flex items-center gap-3">
                <AlarmClock size={32} color={colors.primary} />
                {t.calendar.title3}</h3>
            </div>

            <div className="space-y-4">
              {/* Row 1: Updates & Reports */}
              <div className="grid grid-cols-2 gap-4">
                {t.calendar.updates.map((card, i) => {
                  const imgs = ['stock_post.png', 'stock_report.png'];
                  return (
                    <div key={i} className="bg-[#242424] rounded-[24px] overflow-hidden border border-white/5 shadow-xl flex flex-col group">
                      <div className="h-28 overflow-hidden relative">
                        <img
                          src={`${import.meta.env.BASE_URL}images/${imgs[i]}`}
                          alt={card.title}
                          className="w-full h-full object-cover object-top opacity-90 group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-center bg-[#242424] relative z-20">
                        <h4 className="text-white font-bold text-md mb-1 leading-tight">{card.title}</h4>
                        <p className="text-[#95B1FF] text-[14px] uppercase tracking-wide">{card.sub}</p>
                      </div>
                    </div>
                  )
                })}
              </div>


            </div>
          </div>


        </div>
      )
    },

    // 5. Story Transition
    {
      id: 'story-transition',
      content: (
        <div className="flex flex-col h-full justify-center items-center px-6 pb-20 fade-in text-center">
          <div className="relative w-full max-w-lg h-40">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#95B1FF] rounded-full blur-[100px] opacity-10 animate-pulse pointer-events-none"></div>

            <div className="absolute inset-0 flex items-start justify-center pt-12 mt-6">
              <p className="text-[#95B1FF] text-3xl font-black leading-relaxed opacity-0 animate-fade-in-out" style={{ animationDelay: '0s', animationDuration: '3s' }}>
                {t.story.p1}
              </p>
            </div>

            <div className="absolute inset-0 flex items-start justify-center pt-12 mt-6">
              <p className="text-[#95B1FF] text-3xl font-black leading-relaxed opacity-0 animate-fade-in-out" style={{ animationDelay: '2.5s', animationDuration: '2.5s' }}>
                {t.story.p2}
              </p>
            </div>

            <div className="absolute inset-0 flex items-start justify-center pt-12 mt-6">
              <p className="text-[#95B1FF] text-3xl font-black leading-relaxed opacity-0 animate-fade-in-out" style={{ animationDelay: '5s', animationDuration: '3s' }}>
                {t.story.p3}
              </p>
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
              {t.campaign.title}
            </h2>
          </div>

          <div className="bg-[#2a2a2a] rounded-[24px] p-5 border border-white/5 shadow-2xl relative overflow-hidden scale-in">
            <div className="absolute top-0 right-0 p-3 opacity-5">
              <Gift size={80} className="text-[#FF69B4]" />
            </div>

            <div className="relative z-10 mb-4">
              <p className="text-white text-lg font-black mb-1">{t.campaign.subtitle}</p>
              <p className="text-[#B0B0B0] text-sm leading-relaxed">
                {t.campaign.desc}
              </p>
            </div>

            <div className="space-y-2 relative z-10 mb-4">
              <div className="bg-[#141414]/80 backdrop-blur-sm rounded-xl p-3 border border-white/10 flex gap-3 items-center">
                <div className="bg-[#95B1FF]/20 p-2 rounded-full text-[#95B1FF] shrink-0">
                  <Camera size={16} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-md">{t.campaign.task1}</h4>
                </div>
              </div>

              <div className="bg-[#141414]/80 backdrop-blur-sm rounded-xl p-3 border border-white/10 flex gap-3 items-center">
                <div className="bg-[#95B1FF]/20 p-2 rounded-full text-[#95B1FF] shrink-0">
                  <MessageSquare size={16} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-md">{t.campaign.task2}</h4>
                </div>

              </div>
              <p className='text-sm text-[#afafaf] pb-1'>{t.campaign.hint}</p>

            </div>

            <div className="mb-6 pb-6 group text-center">
              <div className="inline-block relative">
                <img
                  src={`${import.meta.env.BASE_URL}images/club_example.png`}
                  alt="分享範例預覽"
                  className="w-[60%] mx-auto h-auto rounded-lg border border-white/20 opacity-90 group-hover:opacity-100 transition-opacity cursor-pointer shadow-lg group-hover:shadow-[#FF69B4]/20 group-hover:scale-105 duration-300"
                  onClick={() => setSelectedImage(`${import.meta.env.BASE_URL}images/club_example.png`)}
                />
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#1a1a1a] border border-white/20 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                  <Share2 size={10} className="text-[#FF69B4]" />
                  <span className="text-white text-[10px] whitespace-nowrap">{t.campaign.preview}</span>
                </div>
              </div>
            </div>

            {/* Sexy Reward Ticket Section - REFINED SHAPE (Restored) */}
            <div className="relative mt-auto group cursor-pointer mb-8 transform hover:-translate-y-1 transition-transform duration-300">
              {/* Ticket Container */}
              <div className="relative w-full max-w-sm mx-auto filter drop-shadow-2xl">

                {/* Top Section (Main) */}
                <div className="bg-[#1a1a1a] rounded-t-[32px] p-6 pb-5 relative overflow-hidden border-t border-x border-white/10">
                  {/* Corner Notches (Top Lefft/Right) */}
                  <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-[#141414] border-b border-r border-white/10 z-20"></div>
                  <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-[#141414] border-b border-l border-white/10 z-20"></div>

                  {/* Gradient Shine */}
                  <div className="absolute top-0 right-0 w-[150%] h-full bg-gradient-to-l from-white/5 to-transparent skew-x-12 opacity-50 pointer-events-none"></div>
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#FF69B4] via-[#FFD700] to-[#FF69B4]"></div>

                  <div className="flex flex-col items-center relative z-10">
                    <span className="bg-[#FFD700] text-black text-[12px] font-black px-4 py-1 rounded-sm uppercase tracking-widest mb-6 shadow-md transform -skew-x-12">
                      {t.campaign.shareTag}
                    </span>
                    <div className="w-full flex justify-center py-3 mb-2">
                      <div className="relative transform transition-transform group-hover:scale-110 duration-500">
                        <div className="absolute inset-0 bg-[#FF69B4] blur-2xl opacity-20 rounded-full animate-pulse"></div>
                        <Mic size={64} className="text-white relative z-10 drop-shadow-xl" />
                        <Crown size={32} className="text-[#FFD700] absolute -top-4 -right-2 z-20 rotate-[15deg] drop-shadow-lg" weight="fill" />
                      </div>
                    </div>

                    <h4 className="text-white font-black text-3xl italic tracking-tighter leading-none mb-4 text-center drop-shadow-sm flex flex-col items-center">
                      <span>{t.campaign.ticketTitle}</span>
                      <span className="text-[#FF69B4] text-4xl pt-2">{t.campaign.ticketSubtitle}</span>
                    </h4>

                    <p className="text-[#B0B0B0] text-sm font-bold tracking-wide uppercase">{t.campaign.ticketSession}</p>
                  </div>

                </div>

                {/* Deep Notch / Perforation Area */}
                <div className="relative h-6 bg-[#1a1a1a] border-x border-white/10 flex items-center mb-[-1px] z-10">
                  {/* The Deep Side Notches */}
                  <div className="absolute -left-5 w-10 h-10 rounded-full bg-[#2a2a2a] border-r border-white/10 z-20 shadow-inner"></div>
                  <div className="absolute -right-5 w-10 h-10 rounded-full bg-[#2a2a2a] border-l border-white/10 z-20 shadow-inner"></div>
                  {/* The Dashed Line */}
                  <div className="w-full h-[2px] border-t-2 border-dashed border-[#444] mx-5 opacity-50"></div>
                </div>

                {/* Bottom Section (Stub) */}
                <div className="bg-[#1a1a1a] rounded-b-[32px] p-6 pt-4 border-b border-x border-white/10 relative overflow-hidden flex flex-col items-center">
                  {/* Corner Notches (Bottom Left/Right) */}
                  <div className="absolute -bottom-3 -left-3 w-6 h-6 rounded-full bg-[#2a2a2a] border-t border-r border-white/10 z-20"></div>
                  <div className="absolute -bottom-3 -right-3 w-6 h-6 rounded-full bg-[#2a2a2a] border-t border-l border-white/10 z-20"></div>

                  <button
                    onClick={() => window.open('https://www.cmoney.tw/r/245/rb8xim', '_blank')}
                    className="w-full py-4 rounded-2xl font-black text-xl text-white bg-gradient-to-r from-[#FF69B4] to-[#FF8A8A] shadow-xl shadow-[#FF69B4]/30 active:scale-95 transition-all flex items-center justify-center gap-2 group-hover:brightness-110 overflow-hidden relative mb-3"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    <ShieldCheck size={24} />
                    {t.campaign.cta}
                  </button>

                  <button
                    onClick={(e) => { e.stopPropagation(); handleShare(); }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 text-[#95B1FF] bg-[#95B1FF]/5 hover:bg-[#95B1FF]/15 rounded-xl transition-colors mb-4 border border-[#95B1FF]/20"
                  >
                    <Share2 size={16} />
                    <span className="text-xs font-bold tracking-wider">{t.campaign.shareBtn}</span>
                  </button>

                  <div className="flex justify-center items-center text-[#afafaf] text-[10px] font-bold uppercase tracking-[0.2em]">
                    <span>{t.campaign.ends}</span>
                  </div>
                </div>

              </div>

              <p className="text-[#666] text-[10px] text-center mt-3">{t.campaign.copyright}</p>
            </div>
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
        
        /* TRUE TICKET SHAPE CSS */
        .ticket-top {
            background: radial-gradient(circle at bottom left, transparent 15px, #1a1a1a 15.5px) bottom left,
                        radial-gradient(circle at bottom right, transparent 15px, #1a1a1a 15.5px) bottom right;
            background-size: 51% 100%;
            background-repeat: no-repeat;
        }
        .ticket-bottom {
            background: radial-gradient(circle at top left, transparent 15px, #1a1a1a 15.5px) top left,
                        radial-gradient(circle at top right, transparent 15px, #1a1a1a 15.5px) top right;
            background-size: 51% 100%;
            background-repeat: no-repeat;
        }
        
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
