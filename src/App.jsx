import React, { useState, useRef, useEffect } from 'react';
import { 
  TrendingUp, 
  Target, 
  Calendar, 
  Award, 
  Rocket, 
  ShieldCheck, 
  Activity, 
  Lock, 
  ChevronRight, 
  ArrowLeft, 
  ArrowRight,
  Bell,
  Search,
  Crown,
  PlayCircle,
  Mic,
  Zap,
  BarChart3
} from 'lucide-react';

// ROI Data
// Talk Data: Derived from your CSVs
// S&P 500 Data: Estimated trend for 2025 scaled to match the +17.88% benchmark
const chartData = [
  { date: "2025-05-12", talk: 5.4, sp500: 0.0 },
  { date: "2025-05-16", talk: 7.51, sp500: 0.8 },
  { date: "2025-06-24", talk: 7.17, sp500: 4.5 },
  { date: "2025-06-26", talk: 6.87, sp500: 4.8 },
  { date: "2025-07-25", talk: 3.1, sp500: 8.2 },
  { date: "2025-08-01", talk: 24.76, sp500: 8.5 },
  { date: "2025-09-30", talk: 24.67, sp500: 12.1 },
  { date: "2025-10-06", talk: 21.19, sp500: 12.5 },
  { date: "2025-10-29", talk: 24.99, sp500: 14.8 },
  { date: "2025-11-18", talk: 29.63, sp500: 15.5 },
  { date: "2025-11-21", talk: 29.58, sp500: 15.8 },
  { date: "2025-11-24", talk: 29.66, sp500: 16.2 },
  { date: "2025-11-26", talk: 29.68, sp500: 16.5 },
  { date: "2025-12-26", talk: 27.78, sp500: 17.88 }
];

const ComparisonLineChart = ({ data }) => {
  if (!data || data.length === 0) return null;
  
  // Calculate Scales
  const allValues = data.flatMap(d => [d.talk, d.sp500]);
  const max = Math.max(...allValues) * 1.1; 
  const min = Math.min(...allValues, 0); // Ensure 0 is included
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
       {/* SVG Layer for Lines */}
       <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
          <defs>
            <linearGradient id="talkGradient" x1="0%" y1="0%" x2="0%" y2="100%">
               <stop offset="0%" stopColor="#95B1FF" stopOpacity="0.25" />
               <stop offset="100%" stopColor="#95B1FF" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* Grid Lines (Optional, simple baseline) */}
          <line x1="0" y1="100" x2="100" y2="100" stroke="#404040" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />

          {/* S&P 500 Line (Background) */}
          <path 
            d={toPath(spPoints)} 
            fill="none" 
            stroke="#666" 
            strokeWidth="1.5" 
            strokeDasharray="4 4"
            vectorEffect="non-scaling-stroke" 
            className="opacity-50"
          />

          {/* Talk Line (Foreground) */}
          <path d={toArea(talkPoints)} fill="url(#talkGradient)" className="animate-fade-in-delayed" />
          <path 
            d={toPath(talkPoints)} 
            fill="none" 
            stroke="#95B1FF" 
            strokeWidth="2.5" 
            vectorEffect="non-scaling-stroke" 
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-draw-stroke drop-shadow-lg"
          />
       </svg>

       {/* HTML Layer for Dots (Prevents Distortion) */}
       <div className="absolute inset-0 pointer-events-none">
          {talkPoints.map((p, i) => (
            (i === talkPoints.length - 1 || i % 4 === 0) && (
              <div 
                key={i}
                className="absolute w-2.5 h-2.5 rounded-full bg-[#141414] border-2 border-[#95B1FF] shadow-lg transform -translate-x-1/2 -translate-y-1/2 opacity-0 animate-pop-in"
                style={{ left: `${p.x}%`, top: `${p.y}%`, animationDelay: `${1 + i * 0.1}s` }}
              />
            )
          ))}
          {/* Last S&P Point */}
          <div 
             className="absolute w-2 h-2 rounded-full bg-[#666] transform -translate-x-1/2 -translate-y-1/2"
             style={{ left: '100%', top: `${spPoints[spPoints.length-1].y}%` }}
          />
       </div>

       {/* Floating Labels for End Points */}
       <div className="absolute right-0 transform translate-x-1" style={{ top: `${talkPoints[talkPoints.length-1].y}%` }}>
          <div className="bg-[#95B1FF] text-black text-[10px] font-black px-1.5 py-0.5 rounded ml-2 -mt-2.5 shadow-lg">
             Talk
          </div>
       </div>
       <div className="absolute right-0 transform translate-x-1" style={{ top: `${spPoints[spPoints.length-1].y}%` }}>
          <div className="bg-[#666] text-white text-[10px] font-bold px-1.5 py-0.5 rounded ml-2 -mt-2.5">
             S&P
          </div>
       </div>
    </div>
  );
}

const App = () => {
  const [activeScreen, setActiveScreen] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [displayBeta, setDisplayBeta] = useState(0);
  const [displayROI, setDisplayROI] = useState(0);
  const scrollRef = useRef(null);

  // 顏色配置
  const colors = {
    primary: '#95B1FF',
    primaryGradient: 'linear-gradient(135deg, #95B1FF 0%, #346AFF 100%)',
    bg: '#141414',
    bg2: '#1a1a1a',
    card: '#242424',
    line: '#404040',
  };

  // 數值跳動動畫邏輯
  useEffect(() => {
    if (activeScreen === 0) { 
      animateValue(0, 27.78, setDisplayROI, 1000);
    }
    if (activeScreen === 5) { 
      animateValue(0, 1.26, setDisplayBeta, 1000);
    }
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
    // 1. Overall (2025 回顧總覽)
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
          <p className="text-[#B0B0B0] text-sm md:text-base mb-8 leading-relaxed">+27.78% 不是終點，而是 5 次關鍵進化的結果。</p>
          
          {/* Main Chart Card */}
          <div className="bg-[#242424] rounded-[32px] p-6 md:p-8 mb-6 border border-white/5 relative overflow-hidden shadow-2xl scale-in">
            <div className="absolute -top-10 -right-10 opacity-5">
               <TrendingUp size={200} color={colors.primary} />
            </div>
            <div className="relative z-10">
              <div className="flex flex-col items-start mb-2">
                 {/* Main ROI */}
                 <div>
                    <p className="text-[#B0B0B0] text-sm font-medium mb-1">Talk 君年度回報</p>
                    <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-3">
                      +{displayROI.toFixed(2)}%
                    </h2>
                 </div>
                 
                 {/* S&P 500 Comparison (Moved Below) */}
                 <div className="flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-lg border border-white/5 backdrop-blur-sm">
                    <p className="text-[#666] text-xs font-bold uppercase">vs S&P 500</p>
                    <div className="w-px h-3 bg-[#404040]"></div>
                    <h3 className="text-sm md:text-base font-bold text-[#808080] tracking-tight">
                      +17.88%
                    </h3>
                 </div>
              </div>
              
              {/* Inserted Chart */}
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

          <p className="text-[#666] text-xs font-medium text-center opacity-60">
             *白色實線為Talk君淨值，灰色虛線為同期 S&P 500 表現，績效統計自 2025/05 APP 上線,為實際交易紀錄,過往表現不保證未來收益,投資有風險。
          </p>
        </div>
      )
    },

   // 2. 2025 智慧軌跡 (Talk 君怎麼做)
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
            {/* Timeline Line - Aligned to center of the 32px dots (left-4 = 16px, dot width 32px -> center at 32px) */}
            <div className="absolute left-[31px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-[#95B1FF] to-transparent"></div>
            
            {[
              { 
                date: '04/09', 
                tag: '解放日', 
                title: '關稅風暴後：多頭確立', 
                desc: '堅定不交籌碼，確立「盈餘驅動」主軸，加倉 QQQ 與特斯拉。', 
                color: '#FF8A8A' 
              },
              { 
                date: '05/07', 
                tag: '宏觀定調', 
                title: '聯準會的耐心測試', 
                desc: '鮑威爾強調等待數據。策略性配置 30% SHY 短債觀望，不隨市場雜訊起舞。', 
                color: colors.primary 
              },
              { 
                date: '07/22', 
                tag: '板塊輪動', 
                title: '能源接棒 AI', 
                desc: '獲利了結奇異航太 (GE) +100% 漲幅，轉倉 GEV 佈局 AI 算力背後的能源剛需。', 
                color: colors.primary 
              },
              { 
                date: '08/01', 
                tag: '逆勢抄底', 
                title: '非農暴雷：黑色星期五', 
                desc: '失業率數據引發衰退恐慌。堅持「軟著陸」劇本，逆勢大舉加倉 TSLA 與 ARM。', 
                color: '#ADC4FF' 
              },
              { 
                date: '10/06', 
                tag: '價值回歸', 
                title: '重倉亞馬遜', 
                desc: '看好 AWS 利潤率與電商旺季，在財報前夕將 AMZN 權重拉升至 17%，回歸價值本質。', 
                color: colors.primary 
              },
              { 
                date: '11/25', 
                tag: '精準對沖', 
                title: '情緒過熱：啟動防禦', 
                desc: '情緒指標突破 64% 警戒線，買入 SOXS (半導體空頭) 鎖定全年利潤，主動壓降 Beta。', 
                color: colors.primary 
              }
            ].map((item, idx) => (
              <div key={idx} className="relative pl-24 slide-up opacity-0" style={{ animationDelay: `${idx * 0.15}s`, animationFillMode: 'forwards' }}>
                {/* Dot - Absolute positioning relative to the container, centered on the line */}
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

    // 3. 交易實錄
    {
      id: 'trading',
      content: (
        <div className="flex flex-col min-h-full pb-10">
          <div className="fade-in mt-6">
            <h2 className="text-3xl font-black text-white mb-3 flex items-center gap-3 mb-10">
              <Award size={32} color={colors.primary} />
              致勝交易背後 是全年持續升級的引擎
            </h2>
          </div>
          <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-1">
            {[
              { 
                code: 'GE', name: '奇異航太', 
                roi: '+99.9%', 
                op: '均價 $128.80 ➡️ 11/17 $257.50 結算', 
                comment: '「航天行業幾乎無競爭對手，服務營收穩定。」',
                metric: '關鍵指標：服務營收佔比 / 寡佔定價權' 
              },
              { 
                code: 'INTC', name: '英特爾', 
                roi: '+51.7%', 
                op: '7/25 入場 $20.60 ➡️ 均價 $22.64 ➡️ 年底 $34.35', 
                comment: '「基本面展露逆境反轉，台海風險的對沖資產。」',
                metric: '關鍵指標：P/B Ratio 歷史低位 / 營收轉折點' 
              },
              { 
                code: 'AMZN', name: '亞馬遜', 
                roi: '+22.8%', 
                op: '10/06 入場 $171.70 ➡️ 均價 $176.76 ➡️ 年底 $217', 
                comment: '「AWS利潤率被低估，兩架馬車並進。」',
                metric: '關鍵指標：AWS Operating Margin' 
              },
              { 
                code: 'TSLA', name: '特斯拉', 
                roi: '+23.5%', 
                op: '底層策略入場 $220.00 ➡️ 均價 $247.00 ➡️ 年底 $305', 
                comment: '「自動駕駛的唯一股，堅守 FSD 信念。」',
                metric: '關鍵指標：FSD 滲透率 / 算力基礎設施化' 
              }
            ].map((stock, idx) => (
              <div key={idx} className="bg-[#242424] border border-white/5 rounded-[32px] p-7 shadow-xl slide-up opacity-0" style={{ animationDelay: `${idx * 0.15}s`, animationFillMode: 'forwards' }}>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <span className="text-sm px-3 py-1 rounded-xl bg-black text-[#95B1FF] font-black border border-white/10 uppercase tracking-widest">{stock.code}</span>
                    <span className="text-white font-black text-xl">{stock.name}</span>
                  </div>
                  <p className="text-3xl font-black italic text-[#95B1FF]">{stock.roi}</p>
                </div>
                
                <p className="text-[#95B1FF] text-sm font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                   <Activity size={14} /> {stock.metric}
                </p>
                
                <div className="mb-5 bg-black/60 p-5 rounded-2xl border-2 border-white/5 shadow-inner">
                  <p className="text-white text-lg font-black leading-relaxed">{stock.op}</p>
                </div>
                
                <p className="text-[#B0B0B0] text-base italic leading-relaxed border-l-2 border-[#95B1FF]/30 pl-4">{stock.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )
    },
    // 4. 2025 APP 迭代
    {
      id: 'app-iteration',
      content: (
        <div className="flex flex-col min-h-full pb-10">
          <div className="fade-in mt-6">
            <h2 className="text-3xl font-black text-white mb-3 flex items-center gap-3">
              <Rocket size={32} color={colors.primary} />
              2025 功能回顧
            </h2>
            <p className="text-[#B0B0B0] text-base mb-10 leading-relaxed">從核心觀點到量化監測，全面到位</p>
          </div>
          <div className="space-y-8 flex-1 overflow-y-auto custom-scrollbar pr-1">
            {[
              { 
                date: '2025/05', 
                title: 'App 正式上線', 
                desc: '核心觀點、五大清單系統同步啟動。',
                images: [
                  { name: '觀察與持倉清單', src: `${import.meta.env.BASE_URL}images/holding.png` }, 
                  { name: '三大選股策略', src: `${import.meta.env.BASE_URL}images/strategy.png` }, 
                  { name: '市場情緒', src: `${import.meta.env.BASE_URL}images/marketpart.png` }
                ]
              },
              { 
                date: '2025/08', 
                title: '量化監測體系', 
                desc: '情緒指標、趨勢圖、Beta 計算機。', 
                highlight: true,
                images: [
                  { name: '市場情緒 v2', src: `${import.meta.env.BASE_URL}images/marketpart2.png` },
                  { name: 'Beta 計算機', src: `${import.meta.env.BASE_URL}images/beta.png` }
                ]
              },
              { 
                date: '2025/11', 
                title: '全維數據集成', 
                desc: '文字聊天室、大盤看板、板塊 ETF。',
                images: [
                  { name: '文字聊天室', src: `${import.meta.env.BASE_URL}images/chatroom.png` },
                  { name: '個股即時新聞', src: `${import.meta.env.BASE_URL}images/stock_overview.png` }
                ]
              },
              { 
                date: '2025/12', 
                title: '多媒體內容化', 
                desc: '語音直播與回放、個股即時新聞。',
                images: [
                  { name: '語音直播', src: `${import.meta.env.BASE_URL}images/live.png` },
                  { name: '個股即時新聞', src: `${import.meta.env.BASE_URL}images/news.png` }
                ]
              }
            ].map((item, idx) => (
              <div key={idx} className={`bg-[#242424] rounded-[32px] overflow-hidden border transition-all slide-up opacity-0 ${item.highlight ? 'border-[#95B1FF]/50' : 'border-white/5'}`} style={{ animationDelay: `${idx * 0.1}s`, animationFillMode: 'forwards' }}>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                     <div>
                        <p className="text-[#95B1FF] text-xs font-black mb-1">{item.date}</p>
                        <h4 className="text-white font-black text-xl">{item.title}</h4>
                     </div>
                  </div>
                  <p className="text-[#B0B0B0] text-base mb-6">{item.desc}</p>

                  {/* Product Image Gallery (Horizontal Scroll) */}
                  {item.images && (
                    <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2 custom-scrollbar">
                      {item.images.map((img, imgIdx) => (
                        <div key={imgIdx} className="flex-shrink-0 w-40 flex flex-col gap-3 group cursor-pointer">
                           {/* Image Container */}
                           <div className="w-full aspect-[9/16] bg-[#1a1a1a] rounded-2xl border border-white/10 flex items-center justify-center relative overflow-hidden transition-all duration-300 group-hover:border-[#95B1FF]/50 group-hover:shadow-2xl group-hover:shadow-[#95B1FF]/20 group-hover:-translate-y-2">
                              
                              {/* Shine Effect Overlay */}
                              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none z-20" />

                              {/* IMAGE ELEMENT (Updated) */}
                              <img 
                                src={img.src} 
                                alt={img.name} 
                                // Changed object-cover to object-contain, added padding p-2
                                className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-110 relative z-10"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }} 
                              />

                              {/* Fallback Placeholder */}
                              <div className="hidden absolute inset-0 flex-col items-center justify-center gap-2 opacity-50 bg-[#242424] z-0">
                                 <div className="w-8 h-8 rounded-lg border-2 border-dashed border-white flex items-center justify-center">
                                    <div className="w-1 h-1 bg-white rounded-full"></div>
                                 </div>
                                 <span className="text-[10px] font-bold uppercase tracking-widest">No Image</span>
                              </div>
                              
                              {/* Background Gradient (Subtle) */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10"></div>
                           </div>
                           
                           {/* Caption */}
                           <p className="text-[#E0E0E0] text-xs font-bold text-center group-hover:text-[#95B1FF] transition-colors duration-300">
                              {img.name}
                           </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Q4 Stats */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#282828] p-8 rounded-[40px] border-2 border-[#95B1FF]/30 shadow-2xl fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="flex justify-between items-center mb-6">
                 <div className="flex items-center gap-2">
                    <Mic size={20} className="text-[#95B1FF]" />
                    <h4 className="text-white font-black text-xl uppercase tracking-widest">Q4 實績</h4>
                 </div>
                 <span className="text-[10px] bg-white text-black px-2 py-0.5 rounded uppercase font-black">Verified</span>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div className="bg-black/50 p-5 rounded-3xl border border-white/5 text-center transition-transform hover:scale-105 duration-300">
                  <p className="text-[#95B1FF] text-3xl font-black mb-1">3 場</p>
                  <p className="text-[#B0B0B0] text-xs uppercase font-bold">語音直播</p>
                </div>
                <div className="bg-black/50 p-5 rounded-3xl border border-white/5 text-center transition-transform hover:scale-105 duration-300">
                  <p className="text-white text-3xl font-black mb-1">86 篇</p>
                  <p className="text-[#B0B0B0] text-xs uppercase font-bold">專屬貼文</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // 5. 2026 重大事件行事曆
    {
      id: '2026-calendar',
      content: (
        <div className="flex flex-col min-h-full pb-10">
          <div className="fade-in mt-6">
            <h2 className="text-3xl font-black text-white mb-3 flex items-center gap-3">
               <Activity size={32} color={colors.primary} />
               宏觀巨變在即 APP功能讓你快一步
            </h2>
            <p className="text-[#B0B0B0] text-base mb-10 leading-relaxed">從「盈餘驅動」轉向「政策驅動」</p>
          </div>
          <div className="space-y-10">
            {[
              { id: 1, title: '聯準會主席變更', desc: '新舊交接期的政策連續性與不確定性將是核心。', img: 'https://images.pexels.com/photos/2862155/pexels-photo-2862155.jpeg' },
              { id: 2, title: '失業率與軟著陸', desc: '正式驗證美國經濟是否能在高利率下軟著陸。', img: 'https://images.pexels.com/photos/52608/pexels-photo-52608.jpeg' },
              { id: 3, title: '策略性壓降 Beta', desc: '計畫將組合 Beta 回歸 1.0，以防禦姿態等待。', img: 'https://images.pexels.com/photos/159888/pexels-photo-159888.jpeg' }
            ].map((item, idx) => (
              <div key={idx} className="bg-[#242424] rounded-[32px] overflow-hidden border border-white/5 shadow-xl slide-up opacity-0" style={{ animationDelay: `${idx * 0.15}s`, animationFillMode: 'forwards' }}>
                <img src={item.img} alt={item.title} className="h-48 w-full object-cover opacity-60" />
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#95B1FF] text-black font-black flex items-center justify-center">{item.id}</div>
                    <h4 className="text-white text-xl font-black">{item.title}</h4>
                  </div>
                  <p className="text-[#B0B0B0] text-base leading-relaxed pl-14">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },

    // 6. Beta Value & CTA
    {
      id: 'beta-cta',
      content: (
        <div className="flex flex-col min-h-full pb-10">
          <div className="fade-in mt-6">
            <h2 className="text-3xl font-black text-white mb-3 flex items-center gap-3 mb-10">
              <ShieldCheck size={32} color={colors.primary} />
              政策驅動時代 誰先控風險誰贏
            </h2>
          </div>

          {/* Gauge Visualization */}
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

          {/* CTA Section */}
          <div className="mt-auto space-y-4 fade-in" style={{ animationDelay: '0.6s' }}>
            <button className="w-full py-7 rounded-[32px] font-black text-2xl text-white bg-primary-gradient shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3">
               立即計算我的 Beta
               <ChevronRight size={24} />
            </button>
            <button className="w-full py-7 rounded-[32px] font-black text-xl text-[#E0E0E0] border-2 border-white/10 bg-[#242424] active:scale-95 transition-all flex items-center justify-center gap-3">
              <Crown size={24} className="text-[#FFD700]" /> 查看 Talk 君完整持倉
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
      {/* Top Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 pt-10 pb-6 bg-gradient-to-b from-[#141414] via-[#141414]/90 to-transparent flex justify-center gap-2.5 pointer-events-none">
          {screens.map((_, idx) => (
            <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 shadow-md ${activeScreen === idx ? 'w-10 bg-[#95B1FF]' : 'w-2.5 bg-[#404040]'}`} />
          ))}
      </div>

      {/* Main Content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 pt-20 pb-8 custom-scrollbar relative">
        <div key={activeScreen} className="min-h-full">
          {screens[activeScreen].content}
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="h-32 bg-gradient-to-t from-[#141414] via-[#141414] to-transparent flex flex-col items-center justify-center px-8 pb-4 shrink-0 relative z-[40] border-t border-white/5">
        <div className="w-full flex gap-5">
          <button onClick={prevScreen} disabled={activeScreen === 0} className={`flex-1 py-5 rounded-[24px] border border-white/10 flex items-center justify-center text-white font-black text-lg active:scale-95 transition-all ${activeScreen === 0 ? 'opacity-20 pointer-events-none' : 'bg-[#242424]'}`}>
             <ArrowLeft size={20} className="mr-2" /> 上一頁
          </button>
          <button onClick={nextScreen} disabled={activeScreen === screens.length - 1} className={`flex-1 py-5 rounded-[24px] flex items-center justify-center text-white font-black text-lg active:scale-95 transition-all shadow-lg ${activeScreen === screens.length - 1 ? 'opacity-20 pointer-events-none bg-[#242424]' : 'bg-primary-gradient'}`}>
             下一頁 <ArrowRight size={20} className="ml-2" />
          </button>
        </div>
      </div>

      <style>{`
        .bg-primary-gradient { background: linear-gradient(135deg, #95B1FF 0%, #346AFF 100%); }
        .custom-scrollbar::-webkit-scrollbar { width: 0px; }
        .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .fade-in { animation: fadeIn 0.8s ease-out forwards; }
        .slide-up { animation: slideUp 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards; }
        .scale-in { animation: scaleIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-pop-in { animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
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
