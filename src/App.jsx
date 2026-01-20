import React, { useState, useRef, useEffect } from 'react';
import {
  TrendingUp, Target, Calendar, Award, Rocket, ShieldCheck, Activity,
  Lock, ChevronRight, ArrowLeft, ArrowRight, Bell, Search, Crown,
  PlayCircle, Mic, Zap, BarChart3, X, Gift, Share2, Camera, MessageSquare,
  AlarmClock, Globe
} from 'lucide-react';
import { translations } from './translations';
import { initAnalytics, trackEvent, trackPageView } from './utils/analytics'; // Import Analytics
import { useLocation } from 'react-router-dom';
import ScrollReveal from './components/ScrollReveal';

// --- HELPER COMPONENTS ---

// Image Viewer Component
const ImageViewer = ({ src, onClose }) => {
  if (!src) return null;
  return (
    <div
      className="absolute inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4 animate-fade-in"
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

const Toast = ({ message }) => (
  <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-[#333]/90 text-white px-6 py-2 rounded-full backdrop-blur-md border border-white/20 shadow-2xl z-[70] animate-fade-in flex items-center gap-2 pointer-events-none">
    <span className="text-sm font-bold tracking-wide">{message}</span>
  </div>
);

const App = () => {
  const [activeScreen, setActiveScreen] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [displayBeta, setDisplayBeta] = useState(0);

  const [selectedImage, setSelectedImage] = useState(null);
  const [language, setLanguage] = useState('TC');
  const [introAnimFinished, setIntroAnimFinished] = useState(false);
  const [toastMessage, setToastMessage] = useState(null); // New State
  const scrollRef = useRef(null);

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    const screenName = screens[activeScreen]?.id || `screen-${activeScreen}`;
    trackPageView(screenName);
    trackEvent('view_screen', { screen: screenName, screen_index: activeScreen });
  }, [activeScreen]);

  const location = useLocation();
  const isPro = location.pathname.includes('/pro');
  const t = translations[language];
  const campaignContent = isPro ? t.campaign_paid : t.campaign_free;

  const colors = {
    primary: '#95B1FF',
    primaryGradient: 'linear-gradient(135deg, #95B1FF 0%, #346AFF 100%)',
    bg: '#141414',
    bg2: '#1a1a1a',
    card: '#242424',
    line: '#404040',
  };

  useEffect(() => {
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

  // Auto-scroll for Trajectory screen (index 1)
  useEffect(() => {
    if (activeScreen === 1 && scrollRef.current) {
      // Reset scroll to top first
      scrollRef.current.scrollTop = 0;

      const duration = 4000; // 4 seconds (Faster)
      const start = performance.now();
      const startScroll = 0;
      const endScroll = scrollRef.current.scrollHeight - scrollRef.current.clientHeight;

      // If content fits, no need to scroll
      if (endScroll <= 0) return;

      let animationFrameId;

      const animateScroll = (currentTime) => {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);

        // Linear scroll to match linear line growth
        scrollRef.current.scrollTop = startScroll + (endScroll * progress);

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animateScroll);
        }
      };

      // Small delay to ensure content is rendered and height is correct
      const timeoutId = setTimeout(() => {
        animationFrameId = requestAnimationFrame(animateScroll);
      }, 100);

      return () => {
        cancelAnimationFrame(animationFrameId);
        clearTimeout(timeoutId);
      };
    }
  }, [activeScreen]);

  // Auto-advance for Trajectory (Screen 1) -> Trading (Screen 2)
  // Animation duration is 8s, adding 2s buffer = 10s
  useEffect(() => {
    if (activeScreen === 1) {
      const timer = setTimeout(() => {
        nextScreen();
      }, 5500); // 4s animation + 1s buffer
      return () => clearTimeout(timer);
    }
  }, [activeScreen]);

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

  // Auto-advance for Intro (Screen 0) and Story Transition (Screen 5)
  useEffect(() => {
    if (activeScreen === 5) {
      const timer = setTimeout(() => {
        nextScreen();
      }, 7500);
      return () => clearTimeout(timer);
    }
  }, [activeScreen]);

  const handleShare = async () => {
    trackEvent('click_share');
    const shareData = {
      title: campaignContent.shareTextTitle,
      text: campaignContent.shareTextBody,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Error sharing', error);
      }
    } else {
      // Fallback: Copy to Clipboard
      try {
        const textToCopy = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
        await navigator.clipboard.writeText(textToCopy);
        setToastMessage(language === 'TC' ? '連結已複製！' : '链接已复制！');
        setTimeout(() => setToastMessage(null), 3000);
      } catch (err) {
        console.error('Failed to copy: ', err);
        setToastMessage('Copy failed');
        setTimeout(() => setToastMessage(null), 3000);
      }
    }
  };

  const screens = [
    // 1. Intro Story (REPLACED ROI)
    {
      id: 'intro-story',
      content: (
        <div className="flex flex-col min-h-[100dvh] justify-center items-center px-6 pb-20 fade-in text-center relative overflow-hidden bg-gradient-to-br from-[#0a0a0a] via-[#111827] to-[#000000]">
          {/* Ambient Light Orbs - Subtler & Cleaner */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none" >
            <div className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px] animate-pulse ${introAnimFinished ? 'hidden' : ''}`}></div>
            <div className={`absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/20 rounded-full blur-[120px] animate-pulse ${introAnimFinished ? 'hidden' : ''}`} style={{ animationDelay: '2s' }}></div>
          </div >

          {/* Language Selection Buttons */}
          < div
            className={`absolute bottom-100 flex flex-col gap-8 z-50 items-center transition-opacity duration-1000 ${introAnimFinished ? 'opacity-100' : 'fade-in opacity-0'}`}
            style={{ animationDelay: introAnimFinished ? '0.5s' : '6.5s', animationFillMode: 'forwards' }}
          >
            <p className="text-white/80 text-lg font-bold tracking-widest mb-3">請選擇您的語言</p>
            <button
              onClick={() => { setLanguage('TC'); trackEvent('change_language', { lang: 'TC' }); nextScreen(); }}
              className="group relative px-8 py-3 rounded-full bg-[#1a1a1a] border border-[#95B1FF]/30 overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(149,177,255,0.2)] hover:shadow-[0_0_30px_rgba(149,177,255,0.4)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#95B1FF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative text-[#95B1FF] font-black text-lg tracking-widest">繁體中文</span>
            </button>

            <button
              onClick={() => { setLanguage('SC'); trackEvent('change_language', { lang: 'SC' }); nextScreen(); }}
              className="group relative px-8 py-3 rounded-full bg-[#1a1a1a] border border-[#ff95b1]/30 overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,149,177,0.2)] hover:shadow-[0_0_30px_rgba(255,149,177,0.4)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#ff95b1]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative text-[#ff95b1] font-black text-lg tracking-widest">简体中文</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveScreen(screens.length - 1);
                trackEvent('skip_to_campaign');
              }}
              className="mt-4 text-white/30 hover:text-white/90 text-[10px] font-bold tracking-[0.2em] uppercase transition-colors border-b border-transparent hover:border-white/50 pb-1"
            >
              直接跳到活動頁
            </button>

          </div >

          <div className={`relative w-full max-w-lg h-60 flex items-center justify-center mt-20 z-10 transition-opacity duration-500 ${introAnimFinished ? 'opacity-0' : 'opacity-100'}`}>
            {/* Group 1: 投資TALK君 / 2025 / 年度復盤 */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-white text-4xl md:text-5xl font-black uppercase tracking-widest clip-text drop-shadow-lg" style={{ animationDelay: '0.7s' }}>
                投資TALK君
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#e2e2e2] to-[#999] text-6xl md:text-7xl font-black uppercase tracking-tighter clip-text my-2 drop-shadow-2xl" style={{ animationDelay: '0.6s' }}>
                2025
              </span>
              <span className="text-[#95B1FF] text-4xl md:text-5xl font-black uppercase clip-text drop-shadow-[0_0_15px_rgba(149,177,255,0.3)]" style={{ animationDelay: '0.5s' }}>
                {language === 'TC' ? '年度復盤' : '年度复盘'}
              </span>
            </div>

            {/* Group 2: 準備好一起回顧 / 2025 / 了嗎? */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-white text-3xl md:text-4xl font-bold uppercase tracking-wide clip-text drop-shadow-lg" style={{ animationDelay: '4.2s' }}>
                {language === 'TC' ? '準備好一起回顧' : '准备好一起回顾'}
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#e2e2e2] to-[#999] text-6xl md:text-7xl font-black uppercase tracking-tighter clip-text my-2 drop-shadow-2xl" style={{ animationDelay: '4.1s' }}>
                2025
              </span>
              <span className="text-[#95B1FF] text-3xl md:text-4xl font-bold uppercase clip-text drop-shadow-[0_0_15px_rgba(149,177,255,0.3)]" style={{ animationDelay: '4.0s' }}>
                {language === 'TC' ? '了嗎?' : '了吗?'}
              </span>
            </div>
          </div>

          {/* Immediate Skip Button (Bottom) */}
          {/* Immediate Skip Button (Bottom) - Only show if animation not finished */}
          {!introAnimFinished && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIntroAnimFinished(true);
                trackEvent('skip_intro_animation');
              }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[60] text-white/30 hover:text-white/90 text-[10px] font-bold tracking-[0.2em] uppercase transition-colors border-b border-transparent hover:border-white/50 pb-1"
            >
              略過動畫
            </button>
          )}
        </div >
      )
    },



    // 2. Trajectory
    {
      id: 'trajectory',
      content: (
        <div className="flex flex-col min-h-full pb-10">
          <div className="fade-in mt-6">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3 mb-3">
              <Calendar size={32} color={colors.primary} />
              {t.trajectory.title}
            </h2>
          </div>
          <div className="space-y-12 relative">
            {/* Timeline Vertical Line Container */}
            <div className="absolute left-[31px] top-4 bottom-4 w-[2px] bg-white/10 rounded-full overflow-hidden">
              {/* Animated Fill Line */}
              <div
                className="absolute top-0 left-0 w-full bg-gradient-to-b from-[#95B1FF] to-[#95B1FF]"
                style={{
                  height: '100%',
                  animation: 'growHeight 4s linear forwards',
                  transformOrigin: 'top'
                }}
              ></div>
            </div>

            {t.trajectory.items.map((item, idx) => {
              // Map colors based on index to preserve design
              const itemColors = ['#FF8A8A', colors.primary, '#ADC4FF', colors.primary];
              const color = itemColors[idx] || colors.primary;

              // Calculate delay based on 4s total duration
              // Distribute items faster (0.2s, 1.2s, 2.2s, 3.2s)
              const delay = 0.2 + (idx * 1.0);

              return (
                <div key={idx} className="relative pl-24 opacity-0" style={{ animation: `softEntrance 0.8s ease-out forwards ${delay}s` }}>
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
    // 3. Trading (FIXED: ImageViewer + Full Width Readability)
    {
      id: 'trading',
      content: (
        <div className="flex flex-col min-h-full pb-10">
          <div className="fade-in my-6">
            <h2 className="text-3xl font-bold text-white mb-3 flex items-center gap-3 mb-10">
              <Award size={32} color={colors.primary} />
              {t.trading.title}
            </h2>
          </div>
          <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-1">
            {t.trading.records.map((stock, idx) => {
              const imgs = ['GE.png', 'INTC.png', 'TSLA.png'];
              const imgSrc = `${import.meta.env.BASE_URL}images/${imgs[idx]}`;

              // NOTE: Delays are removed in favor of ScrollReveal
              // animationDelay style is also removed

              return (
                <ScrollReveal key={idx} animation="softEntrance" className="bg-[#242424] border border-white/5 rounded-[32px] p-7 shadow-xl">
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
                    onClick={() => { setSelectedImage(imgSrc); trackEvent('view_image', { src: imgSrc, type: 'stock_record' }); }}
                    className="w-full h-auto object-contain rounded-xl mb-4 border border-white/10 opacity-90 cursor-pointer hover:opacity-100 transition-opacity bg-black/20"
                  />
                  <p className="text-[#95B1FF] text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Activity size={14} /> {stock.metric}
                  </p>
                </ScrollReveal>

              )
            })}
          </div>
          <a
            href="https://www.cmoney.tw/r/245/ksg7i8"
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-4 bg-[#242424] rounded-2xl p-4 border border-white/5 shadow-lg cursor-pointer hover:border-[#95B1FF]/50 transition-all active:scale-[0.99] group"
            onClick={() => trackEvent('click_external_link', { link: 'cmoney_holding' })}
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
              onClick={(e) => {
                e.preventDefault(); // Prevent link navigation
                e.stopPropagation();
                setSelectedImage(`${import.meta.env.BASE_URL}images/stock_holding.png`);
              }}
            />
          </a>
        </div>
      )
    },

    // 4. App Iteration
    {
      id: 'app-iteration',
      content: (
        <div className="flex flex-col min-h-full pb-10">
          <div className="fade-in my-6">
            <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
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
              <h2 className="text-3xl font-bold text-white mb-3 flex items-center gap-3">
                <ShieldCheck size={32} color={colors.primary} />
                {t.calendar.title1}
              </h2>
            </div>

            <a
              href="https://www.cmoney.tw/r/245/ksg7i8"
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-[#242424] rounded-[32px] p-6 border border-white/5 mb-8 shadow-2xl relative overflow-hidden slide-up cursor-pointer hover:border-[#95B1FF]/50 transition-all active:scale-[0.99]"
              onClick={() => trackEvent('click_external_link', { link: 'cmoney_calendar' })}
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
            </a>
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
              <h3 className="text-xl font-bold text-white py-3 flex items-center gap-3">
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
              <p className="text-[#95B1FF] text-3xl font-bold leading-relaxed opacity-0 animate-fade-in-out" style={{ animationDelay: '0s', animationDuration: '3s' }}>
                {t.story.p1}
              </p>
            </div>

            <div className="absolute inset-0 flex items-start justify-center pt-12 mt-6">
              <p className="text-[#95B1FF] text-3xl font-bold leading-relaxed opacity-0 animate-fade-in-out" style={{ animationDelay: '2.5s', animationDuration: '2.5s' }}>
                {t.story.p2}
              </p>
            </div>

            <div className="absolute inset-0 flex items-start justify-center pt-12 mt-6">
              <p className="text-[#95B1FF] text-3xl font-black leading-relaxed opacity-0 animate-fade-in-out" style={{ animationDelay: '5s', animationDuration: '4.5s' }}>
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
          <div className="fade-in mt-6 pb-6">
            <h2 className="text-3xl font-bold text-white mb-3 flex items-center gap-3">
              <Gift size={24} className="text-[#FF69B4]" />
              {campaignContent.title}
            </h2>
          </div>

          <div className="w-full max-w-md mx-auto mb-6 scale-in relative group">
            <div className="absolute inset-0 bg-[#FF69B4]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
            <img
              src={`${import.meta.env.BASE_URL}images/${isPro ? 'paid' : 'free'}_${language}.png`}
              alt={campaignContent.title}
              className="w-full h-auto rounded-2xl shadow-2xl cursor-pointer relative z-10 border border-white/10"
              onClick={() => setSelectedImage(`${import.meta.env.BASE_URL}images/${isPro ? 'paid' : 'free'}_${language}.png`)}
            />
          </div>

          {/* CONDITIONAL LAYOUT: PAID vs FREE */}
          {campaignContent.rewards ? (
            // PAID VERSION: Dual Rewards + Main Share CTA
            <div className="space-y-6">
              <div className="space-y-3">
                {campaignContent.rewards.map((reward, idx) => (
                  <div key={idx} className="bg-[#1a1a1a] rounded-2xl p-4 border border-white/10 flex items-center gap-4 relative overflow-hidden group hover:border-[#FF69B4] transition-colors">
                    {/* Icon */}
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#FF69B4]/20 to-[#FFD700]/10 flex items-center justify-center shrink-0 border border-white/5 relative">
                      {reward.icon === 'Mic' ? (
                        <Mic size={24} className="text-white" />
                      ) : (
                        <Crown size={24} className="text-[#FFD700]" weight="fill" />
                      )}
                    </div>
                    {/* Texts */}
                    <div className="flex-1">
                      <span className="bg-[#FFD700] text-black text-[10px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wider mb-1 inline-block">{reward.tag}</span>
                      <h4 className="text-white font-bold text-base leading-tight">{reward.title}</h4>
                      {reward.subtitle && <p className="text-[#95B1FF] text-xs font-medium mt-0.5">{reward.subtitle}</p>}
                    </div>
                  </div>
                ))}
              </div>

              {/* Main Action for Paid */}
              <div className="bg-[#1a1a1a] rounded-2xl p-5 border border-white/10 flex flex-col items-center">
                <a
                  href="https://www.cmoney.tw/r/245/oc8i7g"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('click_external_link', { link: 'campaign_paid_cta' })}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#FF69B4] to-[#FF8C69] text-white font-black text-lg shadow-[0_4px_20px_rgba(255,105,180,0.4)] hover:shadow-[0_6px_25px_rgba(255,105,180,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group mb-3"
                >
                  <Zap size={20} className="fill-current animate-pulse" />
                  {campaignContent.cta}
                </a>
                <div className="flex items-center gap-2 text-[#afafaf] text-[10px] font-bold uppercase tracking-widest">
                  <span>{campaignContent.ends}</span>
                </div>
              </div>
            </div>
          ) : (
            // FREE VERSION: Simplified Buttons Only
            <div className="w-full max-w-sm mx-auto mt-8 space-y-4">
              <a
                href="https://www.cmoney.tw/r/245/rb8xim"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 rounded-2xl font-bold text-xl text-white bg-gradient-to-r from-[#FF69B4] to-[#FF8A8A] shadow-lg hover:shadow-[#FF69B4]/40 active:scale-95 transition-all flex items-center justify-center gap-2 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <ShieldCheck size={24} />
                {campaignContent.cta}
              </a>

              <button
                onClick={(e) => { e.stopPropagation(); handleShare(); }}
                className="w-full flex items-center justify-center gap-2 py-3 text-[#95B1FF] bg-[#95B1FF]/5 hover:bg-[#95B1FF]/15 rounded-xl transition-colors border border-[#95B1FF]/20"
              >
                <Share2 size={16} />
                <span className="text-sm font-bold tracking-wider">{campaignContent.shareBtn}</span>
              </button>

              <div className="flex justify-center items-center text-[#afafaf] text-[10px] font-bold uppercase tracking-[0.2em] pt-2">
                <span>{campaignContent.ends}</span>
              </div>
            </div>
          )}

          <p className="text-[#666] text-[10px] text-center mt-3 text-white/30">{campaignContent.copyright}</p>

          <div className="flex justify-center mt-6 mb-2">
            <button
              onClick={() => { setActiveScreen(0); setIntroAnimFinished(false); }}
              className="px-4 py-2 rounded-full border border-white/10 text-[#666] text-[10px] hover:text-white hover:border-white/30 transition-colors flex items-center gap-2"
            >
              <ArrowLeft size={12} />
              Replay 2025 Wrapped
            </button>
          </div>
        </div>

      )
    }
  ];

  return (
    <div className="w-full h-[100dvh] bg-[#141414] flex justify-center overflow-hidden">
      <div
        className="w-full max-w-[480px] h-[100dvh] bg-[#141414] text-[#E0E0E0] font-sans select-none overflow-hidden flex flex-col relative shadow-2xl mx-auto"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {activeScreen !== 0 && (
          <div className="absolute top-0 left-0 right-0 z-50 pt-10 pb-6 bg-gradient-to-b from-[#141414] via-[#141414]/90 to-transparent flex justify-center gap-2.5 pointer-events-none">
            {screens.map((_, idx) => (
              <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 shadow-md ${activeScreen === idx ? 'w-10 bg-[#95B1FF]' : 'w-2.5 bg-[#404040]'}`} />
            ))}
          </div>
        )}

        <button
          onClick={handleShare}
          className="absolute top-6 right-6 z-[60] p-2.5 bg-[#1a1a1a]/40 backdrop-blur-md border border-white/10 rounded-full text-white shadow-lg active:scale-95 hover:bg-white/10 transition-all"
        >
          <Share2 size={20} />
        </button>

        <div ref={scrollRef} className={`flex-1 overflow-y-auto custom-scrollbar relative ${activeScreen === 0 ? 'p-0' : 'px-6 pt-20 pb-32'}`}>
          <div key={activeScreen} className="min-h-full">
            {screens[activeScreen].content}
          </div>
        </div>

        {selectedImage && <ImageViewer src={selectedImage} onClose={() => setSelectedImage(null)} />}

        {toastMessage && <Toast message={toastMessage} />}

        {activeScreen !== 0 && (
          <div className="absolute bottom-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
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
        )}

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
    </div>
  );
};

export default App;
